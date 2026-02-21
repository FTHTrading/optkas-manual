/* ═══════════════════════════════════════════════════════════
   OPTKAS Attestations & Document Locker — v1.20.0
   Signed quiz/exam attestations with ECDSA P-256,
   private document locker with role+jurisdiction filtering.
   
   Dependencies: optkas-crypto.js, optkas-vault-store.js,
                 optkas-audit.js, optkas-registration.js
   ═══════════════════════════════════════════════════════════ */

window.OPTKAS_ATTESTATIONS = (function () {
    'use strict';

    const VERSION = '1.20.0';

    // ─── Attestation Types ───
    const TYPES = {
        QUIZ:           'QUIZ_COMPLETION',
        EXAM:           'EXAM_COMPLETION',
        CERTIFICATION:  'CERTIFICATION_GRANTED',
        LESSON_REVIEW:  'LESSON_REVIEWED',
        AUDIO_LISTEN:   'AUDIO_LISTENED'
    };

    // ─── Create Attestation Payload ───
    function buildPayload(type, data) {
        const session = window.OPTKAS_REGISTRATION.getCurrentUser();
        if (!session) throw new Error('Not registered — cannot create attestation.');

        // Bind to audit chain head for anti-replay
        var chainHead = null;
        try { chainHead = window.OPTKAS_AUDIT.getChainHead(); } catch (e) { /* ok */ }

        return {
            attestationType: type,
            userId: session.userId,
            role: session.role,
            jurisdictions: session.jurisdictions,
            data: data,
            platformVersion: VERSION,
            auditChainHead: chainHead,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };
    }

    // ─── Sign Attestation ───
    async function signAttestation(type, data, passphrase) {
        const session = window.OPTKAS_REGISTRATION.getCurrentUser();
        if (!session) throw new Error('Not registered.');

        // Build payload
        const payload = buildPayload(type, data);
        const payloadJson = JSON.stringify(payload);
        const payloadHash = await window.OPTKAS_CRYPTO.sha256(payloadJson);

        // Get profile to decrypt private key
        const profile = await window.OPTKAS_REGISTRATION.getCurrentProfile();
        if (!profile) throw new Error('Profile not found in vault.');

        // Decrypt private key
        const privateKey = await window.OPTKAS_CRYPTO.decryptPrivateKey(
            profile.encryptedPrivateKey, passphrase
        );

        // Sign the payload hash
        const signature = await window.OPTKAS_CRYPTO.sign(privateKey, payloadJson);

        // Build full attestation record
        const attestationId = 'ATT-' + payloadHash.substring(0, 16) + '-' + Date.now().toString(36);

        const attestation = {
            attestationId: attestationId,
            userId: session.userId,
            type: type,
            payload: payload,
            payloadHash: payloadHash,
            signature: signature,
            publicKeyJwk: profile.publicKeyJwk,
            timestamp: payload.timestamp,
            version: VERSION
        };

        // Save to vault
        await window.OPTKAS_VAULT.saveAttestation(attestation);

        // Log audit event
        if (type === TYPES.QUIZ) {
            await window.OPTKAS_AUDIT.logQuizAttempt(session.userId, {
                lessonId: data.lessonId,
                score: data.score,
                passed: data.passed,
                attestationId: attestationId
            });
        } else if (type === TYPES.EXAM) {
            await window.OPTKAS_AUDIT.logExamAttempt(session.userId, {
                score: data.score,
                passed: data.passed,
                attestationId: attestationId
            });
        } else if (type === TYPES.CERTIFICATION) {
            await window.OPTKAS_AUDIT.logCertification(session.userId, {
                attestationId: attestationId,
                publicKeyFingerprint: await window.OPTKAS_CRYPTO.sha256(JSON.stringify(profile.publicKeyJwk))
            });
        }

        console.log('[ATT] Signed attestation:', attestationId, type);
        return attestation;
    }

    // ─── Verify Attestation ───
    async function verifyAttestation(attestation) {
        try {
            // Import public key
            const publicKey = await window.OPTKAS_CRYPTO.importPublicKey(attestation.publicKeyJwk);

            // Verify signature
            const payloadJson = JSON.stringify(attestation.payload);
            const valid = await window.OPTKAS_CRYPTO.verify(publicKey, payloadJson, attestation.signature);

            // Verify payload hash
            const computedHash = await window.OPTKAS_CRYPTO.sha256(payloadJson);
            const hashMatch = computedHash === attestation.payloadHash;

            return {
                signatureValid: valid,
                hashValid: hashMatch,
                overallValid: valid && hashMatch,
                attestationId: attestation.attestationId,
                type: attestation.type,
                userId: attestation.userId,
                timestamp: attestation.timestamp
            };
        } catch (err) {
            return {
                signatureValid: false,
                hashValid: false,
                overallValid: false,
                error: err.message,
                attestationId: attestation.attestationId
            };
        }
    }

    // ─── Convenience Signers ───
    async function signQuizCompletion(lessonId, score, passed, answers, passphrase) {
        return signAttestation(TYPES.QUIZ, {
            lessonId: lessonId,
            score: score,
            passed: passed,
            totalQuestions: answers.length,
            audioCompletionRate: null, // filled by caller
            timestamp: new Date().toISOString()
        }, passphrase);
    }

    async function signExamCompletion(score, passed, totalQuestions, passphrase) {
        return signAttestation(TYPES.EXAM, {
            score: score,
            passed: passed,
            totalQuestions: totalQuestions,
            timestamp: new Date().toISOString()
        }, passphrase);
    }

    async function signCertification(certData, passphrase) {
        return signAttestation(TYPES.CERTIFICATION, certData, passphrase);
    }

    // ─── Get User Attestations ───
    async function getUserAttestations(userId) {
        return window.OPTKAS_VAULT.getAttestations(userId);
    }

    async function getAllAttestations() {
        return window.OPTKAS_VAULT.getAllAttestations();
    }

    // ─── Verify All User Attestations ───
    async function verifyAllUserAttestations(userId) {
        const attestations = await getUserAttestations(userId);
        const results = [];
        for (var i = 0; i < attestations.length; i++) {
            results.push(await verifyAttestation(attestations[i]));
        }
        return {
            total: results.length,
            valid: results.filter(function (r) { return r.overallValid; }).length,
            invalid: results.filter(function (r) { return !r.overallValid; }).length,
            details: results
        };
    }

    console.log('[ATT] OPTKAS Attestations v' + VERSION + ' loaded.');

    return {
        version: VERSION,
        TYPES: TYPES,
        signAttestation: signAttestation,
        verifyAttestation: verifyAttestation,
        signQuizCompletion: signQuizCompletion,
        signExamCompletion: signExamCompletion,
        signCertification: signCertification,
        getUserAttestations: getUserAttestations,
        getAllAttestations: getAllAttestations,
        verifyAllUserAttestations: verifyAllUserAttestations
    };
})();


/* ═══════════════════════════════════════════════════════════
   OPTKAS Document Locker — v1.20.0
   Private document access with role + jurisdiction filtering.
   ═══════════════════════════════════════════════════════════ */

window.OPTKAS_DOC_LOCKER = (function () {
    'use strict';

    const VERSION = '1.20.0';

    // ─── Document Registry ───
    // Maps template IDs to access rules
    // Classification: PUBLIC_REFERENCE = safe if URL is directly accessed
    //                 RESTRICTED_PRIVATE = must be gated; Mode 2 required for true lockdown
    const DOC_REGISTRY = {
        'investment-agreement':      { roles: ['sales', 'operator', 'client'], jurisdictions: 'all', sensitivity: 'high',   classification: 'RESTRICTED_PRIVATE' },
        'subscription-agreement':    { roles: ['sales', 'operator', 'client'], jurisdictions: 'all', sensitivity: 'high',   classification: 'RESTRICTED_PRIVATE' },
        'risk-disclosure':           { roles: ['sales', 'operator', 'client', 'auditor'], jurisdictions: 'all', sensitivity: 'medium', classification: 'PUBLIC_REFERENCE' },
        'aml-kyc-checklist':         { roles: ['operator', 'auditor'], jurisdictions: 'all', sensitivity: 'high',   classification: 'RESTRICTED_PRIVATE' },
        'compliance-certificate':    { roles: ['operator', 'auditor'], jurisdictions: 'all', sensitivity: 'high',   classification: 'RESTRICTED_PRIVATE' },
        'client-onboarding-form':    { roles: ['sales', 'operator'], jurisdictions: 'all', sensitivity: 'medium', classification: 'RESTRICTED_PRIVATE' },
        'nda-template':              { roles: ['sales', 'operator', 'client', 'auditor'], jurisdictions: 'all', sensitivity: 'medium', classification: 'PUBLIC_REFERENCE' },
        'operating-procedures':      { roles: ['operator', 'auditor'], jurisdictions: 'all', sensitivity: 'medium', classification: 'PUBLIC_REFERENCE' },
        'tax-information-form':      { roles: ['operator', 'client', 'auditor'], jurisdictions: 'all', sensitivity: 'high',   classification: 'RESTRICTED_PRIVATE' },
        'incident-response-plan':    { roles: ['operator', 'auditor'], jurisdictions: 'all', sensitivity: 'high',   classification: 'RESTRICTED_PRIVATE' },
        'audit-report-template':     { roles: ['auditor'], jurisdictions: 'all', sensitivity: 'high',   classification: 'RESTRICTED_PRIVATE' }
    };

    // ─── Access Check ───
    function canAccess(documentId) {
        const session = window.OPTKAS_REGISTRATION.getCurrentUser();
        if (!session) return { allowed: false, reason: 'Not registered.' };

        const doc = DOC_REGISTRY[documentId];
        if (!doc) return { allowed: false, reason: 'Document not found in registry.' };

        // Role check
        if (!doc.roles.includes(session.role)) {
            return { allowed: false, reason: 'Your role (' + session.role + ') does not have access to this document.' };
        }

        // Jurisdiction check
        if (doc.jurisdictions !== 'all') {
            var hasJurisdiction = session.jurisdictions.some(function (j) {
                return doc.jurisdictions.includes(j);
            });
            if (!hasJurisdiction) {
                return { allowed: false, reason: 'Your jurisdiction(s) do not have access to this document.' };
            }
        }

        return { allowed: true };
    }

    // ─── Record Document Access ───
    async function recordAccess(documentId, action) {
        const session = window.OPTKAS_REGISTRATION.getCurrentUser();
        if (!session) return;

        action = action || 'view';

        const accessRecord = {
            accessId: 'DOC-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
            userId: session.userId,
            documentId: documentId,
            action: action,
            timestamp: new Date().toISOString(),
            role: session.role,
            jurisdictions: session.jurisdictions
        };

        await window.OPTKAS_VAULT.saveDocumentAccess(accessRecord);
        await window.OPTKAS_AUDIT.logDocAccess(session.userId, {
            documentId: documentId,
            action: action
        });

        console.log('[DOC] Recorded access:', documentId, action);
        return accessRecord;
    }

    // ─── Get Accessible Documents ───
    function getAccessibleDocuments() {
        const session = window.OPTKAS_REGISTRATION.getCurrentUser();
        if (!session) return [];

        return Object.keys(DOC_REGISTRY).filter(function (docId) {
            return canAccess(docId).allowed;
        }).map(function (docId) {
            return { id: docId, rules: DOC_REGISTRY[docId] };
        });
    }

    // ─── Get Access History ───
    async function getAccessHistory(userId) {
        return window.OPTKAS_VAULT.getDocumentAccess(userId);
    }

    // ─── Gate a Download ───
    async function gatedDownload(documentId, downloadFn) {
        var check = canAccess(documentId);
        if (!check.allowed) {
            alert('⛔ Access Denied\n\n' + check.reason);
            return false;
        }

        await recordAccess(documentId, 'download');

        if (typeof downloadFn === 'function') {
            downloadFn();
        }
        return true;
    }

    console.log('[DOC] OPTKAS Document Locker v' + VERSION + ' loaded.');

    return {
        version: VERSION,
        DOC_REGISTRY: DOC_REGISTRY,
        canAccess: canAccess,
        recordAccess: recordAccess,
        getAccessibleDocuments: getAccessibleDocuments,
        getAccessHistory: getAccessHistory,
        gatedDownload: gatedDownload
    };
})();
