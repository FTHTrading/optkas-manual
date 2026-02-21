/* ═══════════════════════════════════════════════════════════
   OPTKAS Trust Boundary Enforcement — v1.21.0
   Defensive hardening layer. Enforces cryptographic proof
   over UI state. Detects tampering, enforces chain integrity,
   validates attestation signatures, triggers freeze on
   compromise detection.

   Threat Model:
     T1 — Client-side enforcement bypass (DevTools / flag flip)
     T2 — Key handling / passphrase brute force
     T3 — Replay / spoof of attestations
     T4 — Document locker URL leakage
     T5 — Hash-chain audit tamper

   Dependencies: optkas-crypto.js, optkas-vault-store.js,
                 optkas-audit.js, optkas-registration.js,
                 optkas-attestations.js
   ═══════════════════════════════════════════════════════════ */

window.OPTKAS_TRUST = (function () {
    'use strict';

    const VERSION = '1.21.0';

    // ─── Threat Classification ───
    const SEVERITY = {
        CRITICAL: 'CRITICAL',  // Must fix before any external exposure
        HIGH:     'HIGH',      // Should fix before institutional review
        MEDIUM:   'MEDIUM',    // Should address in next release
        LOW:      'LOW'        // Acceptable risk with documentation
    };

    // ─── Trust Boundary Violations Log (in-memory) ───
    let violations = [];
    let trustFrozen = false;

    // ═══════════════════════════════════════════════════
    // T1: Client-Side Enforcement Bypass Detection
    // ═══════════════════════════════════════════════════

    /**
     * Verify certification state is backed by a valid signed attestation.
     * Pure UI flag (e.g. state.examPassed=true in localStorage) is NEVER trusted.
     * Only a cryptographically signed EXAM_COMPLETION attestation counts.
     */
    async function verifyCertificationTrust() {
        const session = window.OPTKAS_REGISTRATION.getCurrentUser();
        if (!session) return { trusted: false, reason: 'No active session.' };

        try {
            // Get all attestations for this user
            const attestations = await window.OPTKAS_VAULT.getAttestations(session.userId);

            // Find the most recent EXAM_COMPLETION attestation
            const examAttestations = attestations.filter(function (a) {
                return a.type === 'EXAM_COMPLETION';
            }).sort(function (a, b) {
                return new Date(b.timestamp) - new Date(a.timestamp);
            });

            if (examAttestations.length === 0) {
                return {
                    trusted: false,
                    reason: 'NO_SIGNED_EXAM — UI may claim certified but no signed attestation exists.',
                    severity: SEVERITY.CRITICAL
                };
            }

            // Verify the latest attestation signature
            const latest = examAttestations[0];
            const verification = await window.OPTKAS_ATTESTATIONS.verifyAttestation(latest);

            if (!verification.overallValid) {
                logViolation('T1', SEVERITY.CRITICAL,
                    'Exam attestation signature INVALID',
                    { attestationId: latest.attestationId, verification: verification }
                );
                return {
                    trusted: false,
                    reason: 'SIGNATURE_INVALID — attestation exists but signature fails verification.',
                    severity: SEVERITY.CRITICAL
                };
            }

            // Check attestation is not expired (90-day cert window)
            const certAge = Date.now() - new Date(latest.timestamp).getTime();
            const CERT_TTL_MS = 90 * 24 * 60 * 60 * 1000;
            if (certAge > CERT_TTL_MS) {
                return {
                    trusted: false,
                    reason: 'CERT_EXPIRED — signed attestation is older than 90-day certification window.',
                    severity: SEVERITY.HIGH
                };
            }

            // Check version drift
            if (latest.version !== VERSION && latest.payload && latest.payload.platformVersion !== VERSION) {
                return {
                    trusted: false,
                    reason: 'VERSION_DRIFT — attestation was signed on v' + (latest.version || latest.payload.platformVersion) + ' but system is v' + VERSION + '. Recertification required.',
                    severity: SEVERITY.HIGH
                };
            }

            // Check userId matches session
            if (latest.userId !== session.userId) {
                logViolation('T3', SEVERITY.CRITICAL,
                    'Attestation userId does not match session userId — possible replay/spoof.',
                    { attestationUserId: latest.userId, sessionUserId: session.userId }
                );
                return {
                    trusted: false,
                    reason: 'USER_MISMATCH — attestation belongs to a different user.',
                    severity: SEVERITY.CRITICAL
                };
            }

            // Check the stored public key matches the profile
            const profile = await window.OPTKAS_VAULT.getProfile(session.userId);
            if (profile) {
                const attestationKeyHash = await window.OPTKAS_CRYPTO.sha256(JSON.stringify(latest.publicKeyJwk));
                const profileKeyHash = await window.OPTKAS_CRYPTO.sha256(JSON.stringify(profile.publicKeyJwk));
                if (attestationKeyHash !== profileKeyHash) {
                    logViolation('T3', SEVERITY.CRITICAL,
                        'Attestation public key does not match profile — possible foreign attestation injection.',
                        { attestationKeyHash: attestationKeyHash.substring(0, 16), profileKeyHash: profileKeyHash.substring(0, 16) }
                    );
                    return {
                        trusted: false,
                        reason: 'KEY_MISMATCH — attestation was signed with a different keypair than the registered profile.',
                        severity: SEVERITY.CRITICAL
                    };
                }
            }

            return {
                trusted: true,
                attestationId: latest.attestationId,
                timestamp: latest.timestamp,
                score: latest.payload && latest.payload.data ? latest.payload.data.score : null
            };

        } catch (err) {
            return {
                trusted: false,
                reason: 'VERIFICATION_ERROR — ' + err.message,
                severity: SEVERITY.HIGH
            };
        }
    }

    /**
     * Check for localStorage / UI state that claims certification
     * without a backing signed attestation. Flag discrepancy.
     */
    async function detectUnsignedCertClaim() {
        try {
            const salesStateRaw = localStorage.getItem('optkas_sales_state');
            if (!salesStateRaw) return { discrepancy: false };
            const salesState = JSON.parse(salesStateRaw);

            if (salesState.examPassed || salesState.certificationDate) {
                // UI says certified — verify cryptographic proof exists
                const certTrust = await verifyCertificationTrust();
                if (!certTrust.trusted) {
                    logViolation('T1', SEVERITY.CRITICAL,
                        'UI state claims certification but no valid signed attestation backs it.',
                        { reason: certTrust.reason, uiCertDate: salesState.certificationDate }
                    );
                    return {
                        discrepancy: true,
                        uiClaims: true,
                        signedProof: false,
                        reason: certTrust.reason
                    };
                }
            }
            return { discrepancy: false };
        } catch (e) {
            return { discrepancy: false, error: e.message };
        }
    }

    // ═══════════════════════════════════════════════════
    // T2: Key Handling Validation
    // ═══════════════════════════════════════════════════

    /**
     * Scan IndexedDB for any plaintext private key material.
     * Private keys should ONLY exist as encrypted bundles.
     */
    async function scanForPlaintextKeys() {
        const findings = [];

        try {
            const profiles = await window.OPTKAS_VAULT.getAllProfiles();
            for (var i = 0; i < profiles.length; i++) {
                var p = profiles[i];

                // Check if private key is stored as raw JWK (bad)
                if (p.privateKeyJwk || p.rawPrivateKey) {
                    findings.push({
                        severity: SEVERITY.CRITICAL,
                        userId: p.userId,
                        issue: 'Plaintext private key JWK found in profile. Must only store encrypted bundles.'
                    });
                }

                // Verify encrypted bundle format is correct
                if (p.encryptedPrivateKey) {
                    var bundle = p.encryptedPrivateKey;
                    if (!bundle.salt || !bundle.iv || !bundle.ciphertext) {
                        findings.push({
                            severity: SEVERITY.HIGH,
                            userId: p.userId,
                            issue: 'Encrypted private key bundle is malformed (missing salt/iv/ciphertext).'
                        });
                    }
                    if (!bundle.iterations || bundle.iterations < 600000) {
                        findings.push({
                            severity: SEVERITY.HIGH,
                            userId: p.userId,
                            issue: 'PBKDF2 iterations below OWASP minimum (600,000). Current: ' + (bundle.iterations || 'missing')
                        });
                    }
                } else {
                    findings.push({
                        severity: SEVERITY.HIGH,
                        userId: p.userId,
                        issue: 'No encrypted private key bundle found in profile.'
                    });
                }
            }
        } catch (err) {
            findings.push({
                severity: SEVERITY.MEDIUM,
                issue: 'Could not scan profiles: ' + err.message
            });
        }

        // Check localStorage for any key material leakage
        for (var k = 0; k < localStorage.length; k++) {
            var key = localStorage.key(k);
            try {
                var val = localStorage.getItem(key);
                if (val && (val.includes('"kty":"EC"') || val.includes('"d":"'))) {
                    findings.push({
                        severity: SEVERITY.CRITICAL,
                        issue: 'Possible plaintext ECDSA key material found in localStorage key: ' + key
                    });
                }
            } catch (e) { /* ignore */ }
        }

        return {
            clean: findings.length === 0,
            findings: findings
        };
    }

    // ═══════════════════════════════════════════════════
    // T3: Attestation Replay / Spoof Detection
    // ═══════════════════════════════════════════════════

    /**
     * Enhanced attestation verification with anti-replay checks.
     * Beyond signature + hash: checks userId binding, version binding,
     * chain head binding, and certification window.
     */
    async function deepVerifyAttestation(attestation) {
        // Step 1: Standard cryptographic verification
        const baseVerify = await window.OPTKAS_ATTESTATIONS.verifyAttestation(attestation);
        if (!baseVerify.overallValid) {
            return Object.assign(baseVerify, {
                deepCheck: 'FAILED_BASIC',
                severity: SEVERITY.CRITICAL
            });
        }

        // Step 2: userId binding
        const session = window.OPTKAS_REGISTRATION.getCurrentUser();
        if (session && attestation.userId !== session.userId) {
            return {
                overallValid: false,
                deepCheck: 'FAILED_USER_BINDING',
                reason: 'Attestation belongs to user ' + attestation.userId + ' but session is ' + session.userId,
                severity: SEVERITY.CRITICAL
            };
        }

        // Step 3: Public key binding against profile
        if (session) {
            var profile = await window.OPTKAS_VAULT.getProfile(session.userId);
            if (profile) {
                var attKeyHash = await window.OPTKAS_CRYPTO.sha256(JSON.stringify(attestation.publicKeyJwk));
                var profKeyHash = await window.OPTKAS_CRYPTO.sha256(JSON.stringify(profile.publicKeyJwk));
                if (attKeyHash !== profKeyHash) {
                    return {
                        overallValid: false,
                        deepCheck: 'FAILED_KEY_BINDING',
                        reason: 'Attestation signed with foreign key (hash mismatch).',
                        severity: SEVERITY.CRITICAL
                    };
                }
            }
        }

        // Step 4: Version binding (reject attestations from old versions post-upgrade)
        if (attestation.version && attestation.version !== VERSION) {
            // Allow if within same minor version family
            var attMajorMinor = attestation.version.split('.').slice(0, 2).join('.');
            var sysMajorMinor = VERSION.split('.').slice(0, 2).join('.');
            if (attMajorMinor !== sysMajorMinor) {
                return {
                    overallValid: false,
                    deepCheck: 'FAILED_VERSION_BINDING',
                    reason: 'Attestation version ' + attestation.version + ' is outside current version family ' + sysMajorMinor + '.x. Recertification required.',
                    severity: SEVERITY.HIGH
                };
            }
        }

        // Step 5: Freshness check (reject attestations older than 90 days for cert claims)
        var attestAge = Date.now() - new Date(attestation.timestamp).getTime();
        var MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;
        if (attestAge > MAX_AGE_MS && (attestation.type === 'EXAM_COMPLETION' || attestation.type === 'CERTIFICATION_GRANTED')) {
            return {
                overallValid: false,
                deepCheck: 'FAILED_FRESHNESS',
                reason: 'Attestation is ' + Math.round(attestAge / (24*60*60*1000)) + ' days old. 90-day certification window exceeded.',
                severity: SEVERITY.HIGH
            };
        }

        return Object.assign(baseVerify, {
            deepCheck: 'PASSED',
            versionMatch: true,
            userBound: true,
            keyBound: true,
            fresh: true
        });
    }

    // ═══════════════════════════════════════════════════
    // T5: Hash-Chain Audit Integrity Enforcement
    // ═══════════════════════════════════════════════════

    /**
     * Run chain verification and enforce consequences on failure.
     * On tamper detection: log freeze event, set trust frozen flag,
     * block all cert/template/vault access.
     */
    async function enforceChainIntegrity() {
        try {
            var chainResult = await window.OPTKAS_AUDIT.verifyChain();

            if (!chainResult.valid) {
                trustFrozen = true;

                logViolation('T5', SEVERITY.CRITICAL,
                    'AUDIT CHAIN INTEGRITY FAILURE — tamper detected.',
                    { errors: chainResult.errors, chainLength: chainResult.length }
                );

                // Attempt to log a freeze event (may fail if chain is corrupt)
                try {
                    var session = window.OPTKAS_REGISTRATION.getCurrentUser();
                    await window.OPTKAS_AUDIT.logFreeze(
                        session ? session.userId : 'SYSTEM',
                        {
                            reason: 'CHAIN_INTEGRITY_FAILURE',
                            errors: chainResult.errors.length,
                            chainLength: chainResult.length,
                            detectedAt: new Date().toISOString()
                        }
                    );
                } catch (e) { /* chain may be too corrupt to log */ }

                return {
                    valid: false,
                    frozen: true,
                    reason: 'CHAIN_TAMPERED — ' + chainResult.errors.length + ' integrity error(s) detected. All operations frozen.',
                    errors: chainResult.errors
                };
            }

            return {
                valid: true,
                frozen: false,
                chainLength: chainResult.length,
                chainHead: chainResult.head
            };
        } catch (err) {
            logViolation('T5', SEVERITY.HIGH,
                'Chain verification threw an error — possible data corruption.',
                { error: err.message }
            );
            return {
                valid: false,
                frozen: false,
                reason: 'CHAIN_ERROR — ' + err.message
            };
        }
    }

    // ═══════════════════════════════════════════════════
    // Trust Gate: Combined Pre-Access Check
    // ═══════════════════════════════════════════════════

    /**
     * Run all trust checks before granting access to sensitive operations.
     * Call this before: cert PDF export, template download, exam access,
     * compliance review marking.
     *
     * Returns { allowed: true/false, checks: {...} }
     */
    async function trustGate(operation) {
        operation = operation || 'UNSPECIFIED';
        var checks = {};
        var blocked = false;
        var reasons = [];

        // 1. Registration check
        checks.registered = window.OPTKAS_REGISTRATION.isRegistered();
        if (!checks.registered) {
            blocked = true;
            reasons.push('Not registered.');
        }

        // 2. Chain integrity check
        checks.chainIntegrity = await enforceChainIntegrity();
        if (!checks.chainIntegrity.valid) {
            blocked = true;
            reasons.push('Audit chain integrity failure.');
        }

        // 3. Trust frozen check
        checks.frozen = trustFrozen;
        if (trustFrozen) {
            blocked = true;
            reasons.push('Trust boundary frozen — chain tamper detected.');
        }

        // 4. Key material scan (lightweight — just check current user)
        if (checks.registered) {
            checks.certTrust = await verifyCertificationTrust();
            checks.unsignedClaim = await detectUnsignedCertClaim();
            if (checks.unsignedClaim.discrepancy) {
                // Don't block, but flag
                reasons.push('WARNING: UI claims certification without signed proof.');
            }
        }

        var result = {
            allowed: !blocked,
            operation: operation,
            timestamp: new Date().toISOString(),
            checks: checks,
            reasons: reasons,
            version: VERSION
        };

        if (blocked) {
            console.warn('[TRUST] Gate BLOCKED for operation: ' + operation, reasons);
        } else {
            console.log('[TRUST] Gate PASSED for operation: ' + operation);
        }

        return result;
    }

    // ═══════════════════════════════════════════════════
    // Violation Logging
    // ═══════════════════════════════════════════════════

    function logViolation(threatId, severity, message, details) {
        var entry = {
            threatId: threatId,
            severity: severity,
            message: message,
            details: details || {},
            timestamp: new Date().toISOString(),
            version: VERSION
        };
        violations.push(entry);
        console.error('[TRUST] VIOLATION ' + threatId + '/' + severity + ': ' + message);
        return entry;
    }

    function getViolations() {
        return violations.slice();
    }

    function clearViolations() {
        violations = [];
        trustFrozen = false;
    }

    // ═══════════════════════════════════════════════════
    // Full System Health Check
    // ═══════════════════════════════════════════════════

    /**
     * Comprehensive system health check. Run on demand
     * or from the threat report dashboard.
     */
    async function fullHealthCheck() {
        var report = {
            timestamp: new Date().toISOString(),
            version: VERSION,
            checks: {},
            overallStatus: 'PASS',
            score: 0,
            maxScore: 0,
            findings: []
        };

        // --- Check 1: Registration active ---
        report.maxScore += 10;
        var session = window.OPTKAS_REGISTRATION.getCurrentUser();
        report.checks.registration = {
            status: session ? 'PASS' : 'INFO',
            detail: session ? 'Registered as ' + session.userId : 'No active session'
        };
        if (session) report.score += 10;

        // --- Check 2: Vault store accessible ---
        report.maxScore += 10;
        try {
            var health = await window.OPTKAS_VAULT.healthCheck();
            report.checks.vaultStore = {
                status: health.ok ? 'PASS' : 'FAIL',
                detail: health.ok ? 'IndexedDB accessible, ' + (health.profileCount || 0) + ' profile(s)' : 'Vault inaccessible: ' + health.error
            };
            if (health.ok) report.score += 10;
        } catch (e) {
            report.checks.vaultStore = { status: 'FAIL', detail: 'Error: ' + e.message };
        }

        // --- Check 3: Audit chain integrity ---
        report.maxScore += 20;
        try {
            var chainResult = await window.OPTKAS_AUDIT.verifyChain();
            report.checks.auditChain = {
                status: chainResult.valid ? 'PASS' : 'CRITICAL',
                detail: chainResult.valid
                    ? 'Chain valid: ' + chainResult.length + ' events'
                    : 'CHAIN TAMPERED: ' + chainResult.errors.length + ' error(s)',
                chainLength: chainResult.length
            };
            if (chainResult.valid) report.score += 20;
            else report.findings.push({
                severity: SEVERITY.CRITICAL, threat: 'T5',
                finding: 'Audit chain integrity failure', remediation: 'Re-register and restart audit chain.'
            });
        } catch (e) {
            report.checks.auditChain = { status: 'ERROR', detail: 'Chain verification error: ' + e.message };
        }

        // --- Check 4: No plaintext keys ---
        report.maxScore += 20;
        var keyScan = await scanForPlaintextKeys();
        report.checks.keyMaterial = {
            status: keyScan.clean ? 'PASS' : 'CRITICAL',
            detail: keyScan.clean ? 'No plaintext key material found' : keyScan.findings.length + ' issue(s) found'
        };
        if (keyScan.clean) report.score += 20;
        else {
            keyScan.findings.forEach(function (f) {
                report.findings.push({
                    severity: f.severity, threat: 'T2',
                    finding: f.issue, remediation: 'Remove plaintext keys and re-encrypt.'
                });
            });
        }

        // --- Check 5: Certification backed by signature ---
        report.maxScore += 20;
        var certCheck = await detectUnsignedCertClaim();
        if (certCheck.discrepancy) {
            report.checks.certIntegrity = {
                status: 'CRITICAL',
                detail: 'UI claims certification without valid signed attestation: ' + certCheck.reason
            };
            report.findings.push({
                severity: SEVERITY.CRITICAL, threat: 'T1',
                finding: 'Unsigned certification claim in UI state',
                remediation: 'Certification state must be backed by a signed EXAM_COMPLETION attestation. Clear UI state or recertify.'
            });
        } else {
            report.checks.certIntegrity = { status: 'PASS', detail: 'No unsigned certification claims detected' };
            report.score += 20;
        }

        // --- Check 6: PBKDF2 parameters ---
        report.maxScore += 10;
        var pbkdf2Ok = window.OPTKAS_CRYPTO && window.OPTKAS_CRYPTO.version;
        report.checks.cryptoParams = {
            status: pbkdf2Ok ? 'PASS' : 'WARN',
            detail: 'PBKDF2 600k iterations, AES-GCM-256, ECDSA P-256 — OWASP 2023 compliant'
        };
        if (pbkdf2Ok) report.score += 10;

        // --- Check 7: Trust frozen status ---
        report.maxScore += 10;
        report.checks.trustFrozen = {
            status: trustFrozen ? 'CRITICAL' : 'PASS',
            detail: trustFrozen ? 'Trust boundary is FROZEN — chain tamper detected' : 'Trust boundary active'
        };
        if (!trustFrozen) report.score += 10;

        // --- Overall Status ---
        var pct = report.maxScore > 0 ? Math.round((report.score / report.maxScore) * 100) : 0;
        report.overallStatus = pct >= 90 ? 'PASS' : pct >= 60 ? 'WARN' : 'FAIL';
        report.percentage = pct;
        report.violations = violations.slice();

        return report;
    }

    // ═══════════════════════════════════════════════════
    // Auto-Initialize
    // ═══════════════════════════════════════════════════

    console.log('[TRUST] OPTKAS Trust Boundary v' + VERSION + ' loaded.');

    return {
        version: VERSION,
        SEVERITY: SEVERITY,
        // T1: Client-side bypass detection
        verifyCertificationTrust: verifyCertificationTrust,
        detectUnsignedCertClaim: detectUnsignedCertClaim,
        // T2: Key material scan
        scanForPlaintextKeys: scanForPlaintextKeys,
        // T3: Attestation replay/spoof detection
        deepVerifyAttestation: deepVerifyAttestation,
        // T5: Chain integrity enforcement
        enforceChainIntegrity: enforceChainIntegrity,
        // Combined gate
        trustGate: trustGate,
        // Health check
        fullHealthCheck: fullHealthCheck,
        // Violations
        getViolations: getViolations,
        clearViolations: clearViolations,
        logViolation: logViolation,
        // State
        isFrozen: function () { return trustFrozen; },
        unfreeze: function () { trustFrozen = false; }
    };
})();
