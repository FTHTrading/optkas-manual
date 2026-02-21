/* ═══════════════════════════════════════════════════════════
   OPTKAS Registration Gate — v1.20.0
   Registration form, WebCrypto keypair generation,
   passphrase-encrypted private key storage, session
   management, gate check for protected pages.
   
   Dependencies: optkas-crypto.js, optkas-vault-store.js,
                 optkas-audit.js
   ═══════════════════════════════════════════════════════════ */

window.OPTKAS_REGISTRATION = (function () {
    'use strict';

    const REG_VERSION = '1.20.0';
    const SESSION_KEY = 'optkas_session';
    const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

    // Protected pages that require registration
    const PROTECTED_PAGES = [
        'sales-academy.html',
        'artifact-vault.html',
        'templates.html'
    ];

    // Roles
    const ROLES = [
        { value: 'sales', label: 'Sales Representative' },
        { value: 'operator', label: 'Platform Operator' },
        { value: 'client', label: 'Client / Investor' },
        { value: 'auditor', label: 'Auditor / Compliance' }
    ];

    // Jurisdictions
    const JURISDICTIONS = [
        { value: 'US', label: 'United States' },
        { value: 'EU', label: 'European Union' },
        { value: 'UK', label: 'United Kingdom' },
        { value: 'UAE', label: 'United Arab Emirates' },
        { value: 'SG', label: 'Singapore' },
        { value: 'OTHER', label: 'Other' }
    ];

    // Acknowledgments
    const ACKNOWLEDGMENTS = [
        'I understand that all training materials within this platform are for internal use only and do not constitute legal, tax, or investment advice.',
        'I acknowledge that my training progress, quiz results, and certification status will be cryptographically signed and may be subject to compliance audit.',
        'I confirm that I will not share my private key or passphrase with anyone, and I understand that lost credentials cannot be recovered.'
    ];

    // ─── Session Management ───
    function getSession() {
        try {
            const raw = localStorage.getItem(SESSION_KEY);
            if (!raw) return null;
            const session = JSON.parse(raw);
            // Check expiry
            if (Date.now() - session.loginAt > SESSION_DURATION_MS) {
                localStorage.removeItem(SESSION_KEY);
                return null;
            }
            return session;
        } catch (e) {
            return null;
        }
    }

    function setSession(userId, role, jurisdictions, name) {
        const session = {
            userId: userId,
            role: role,
            jurisdictions: jurisdictions,
            name: name,
            loginAt: Date.now(),
            version: REG_VERSION
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return session;
    }

    function clearSession() {
        localStorage.removeItem(SESSION_KEY);
    }

    function isRegistered() {
        return getSession() !== null;
    }

    // ─── Gate Check ───
    function isProtectedPage() {
        const path = window.location.pathname;
        return PROTECTED_PAGES.some(function (p) {
            return path.endsWith(p) || path.endsWith('/' + p);
        });
    }

    function checkGate() {
        if (!isProtectedPage()) return true;
        if (isRegistered()) return true;
        showRegistrationModal();
        return false;
    }

    // ─── Registration Modal UI ───
    function showRegistrationModal() {
        // Remove existing modal if present
        const existing = document.getElementById('optkas-reg-modal');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'optkas-reg-modal';
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:99999;display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;';

        const modal = document.createElement('div');
        modal.style.cssText = 'background:#1a1a2e;border:1px solid #333;border-radius:12px;padding:40px;max-width:560px;width:90%;max-height:90vh;overflow-y:auto;color:#e0e0e0;box-shadow:0 20px 60px rgba(0,0,0,0.5);';

        modal.innerHTML = `
            <div style="text-align:center;margin-bottom:24px;">
                <div style="font-size:36px;margin-bottom:8px;">🔐</div>
                <h2 style="color:#f0f0f0;margin:0 0 8px;">OPTKAS Registration</h2>
                <p style="color:#888;font-size:13px;margin:0;">Cryptographic training vault registration required to access this section.</p>
            </div>

            <form id="optkas-reg-form" autocomplete="off">
                <div style="margin-bottom:16px;">
                    <label style="display:block;font-size:12px;color:#aaa;margin-bottom:4px;text-transform:uppercase;letter-spacing:1px;">Full Legal Name *</label>
                    <input type="text" id="reg-name" required style="${inputStyle()}" placeholder="Enter your full legal name">
                </div>

                <div style="margin-bottom:16px;">
                    <label style="display:block;font-size:12px;color:#aaa;margin-bottom:4px;text-transform:uppercase;letter-spacing:1px;">Email Address *</label>
                    <input type="email" id="reg-email" required style="${inputStyle()}" placeholder="your.email@company.com">
                </div>

                <div style="margin-bottom:16px;">
                    <label style="display:block;font-size:12px;color:#aaa;margin-bottom:4px;text-transform:uppercase;letter-spacing:1px;">Role *</label>
                    <select id="reg-role" required style="${inputStyle()}">
                        <option value="">— Select Role —</option>
                        ${ROLES.map(r => '<option value="' + r.value + '">' + r.label + '</option>').join('')}
                    </select>
                </div>

                <div style="margin-bottom:16px;">
                    <label style="display:block;font-size:12px;color:#aaa;margin-bottom:4px;text-transform:uppercase;letter-spacing:1px;">Jurisdictions *</label>
                    <div id="reg-jurisdictions" style="display:flex;flex-wrap:wrap;gap:8px;">
                        ${JURISDICTIONS.map(j => `
                            <label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:13px;background:#222;padding:6px 10px;border-radius:6px;border:1px solid #444;">
                                <input type="checkbox" name="jurisdiction" value="${j.value}" style="accent-color:#4ade80;">
                                ${j.label}
                            </label>
                        `).join('')}
                    </div>
                </div>

                <div style="margin-bottom:16px;">
                    <label style="display:block;font-size:12px;color:#aaa;margin-bottom:4px;text-transform:uppercase;letter-spacing:1px;">Passphrase * <span style="font-size:11px;color:#666;">(encrypts your private key — CANNOT be recovered)</span></label>
                    <input type="password" id="reg-passphrase" required minlength="8" style="${inputStyle()}" placeholder="Minimum 8 characters">
                </div>

                <div style="margin-bottom:16px;">
                    <label style="display:block;font-size:12px;color:#aaa;margin-bottom:4px;text-transform:uppercase;letter-spacing:1px;">Confirm Passphrase *</label>
                    <input type="password" id="reg-passphrase-confirm" required minlength="8" style="${inputStyle()}" placeholder="Re-enter passphrase">
                </div>

                <div style="margin-bottom:20px;border:1px solid #333;border-radius:8px;padding:16px;background:#111;">
                    <p style="font-size:12px;color:#f59e0b;margin:0 0 12px;font-weight:600;">⚖ Required Acknowledgments</p>
                    ${ACKNOWLEDGMENTS.map((ack, i) => `
                        <label style="display:flex;align-items:flex-start;gap:8px;cursor:pointer;font-size:12px;line-height:1.5;margin-bottom:${i < ACKNOWLEDGMENTS.length - 1 ? '10px' : '0'};">
                            <input type="checkbox" name="ack" value="${i}" required style="accent-color:#4ade80;margin-top:2px;flex-shrink:0;">
                            <span style="color:#ccc;">${ack}</span>
                        </label>
                    `).join('')}
                </div>

                <div id="reg-error" style="display:none;background:#dc2626;color:white;padding:10px;border-radius:6px;margin-bottom:12px;font-size:13px;"></div>
                <div id="reg-status" style="display:none;background:#1e3a5f;color:#93c5fd;padding:10px;border-radius:6px;margin-bottom:12px;font-size:13px;"></div>

                <button type="submit" id="reg-submit" style="width:100%;padding:12px;background:#16a34a;color:white;border:none;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer;transition:background 0.2s;">
                    🔐 Register & Generate Keypair
                </button>
            </form>

            <div id="reg-login-section" style="margin-top:20px;padding-top:16px;border-top:1px solid #333;text-align:center;">
                <p style="font-size:12px;color:#888;margin:0 0 8px;">Already registered?</p>
                <button id="reg-login-btn" onclick="OPTKAS_REGISTRATION.showLoginModal()" style="padding:8px 20px;background:#2563eb;color:white;border:none;border-radius:6px;font-size:13px;cursor:pointer;">
                    Sign In
                </button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Form submission handler
        document.getElementById('optkas-reg-form').addEventListener('submit', handleRegistration);
    }

    function inputStyle() {
        return 'width:100%;padding:10px 12px;background:#222;border:1px solid #444;border-radius:6px;color:#e0e0e0;font-size:14px;box-sizing:border-box;outline:none;';
    }

    // ─── Handle Registration ───
    async function handleRegistration(e) {
        e.preventDefault();

        const errorDiv = document.getElementById('reg-error');
        const statusDiv = document.getElementById('reg-status');
        const submitBtn = document.getElementById('reg-submit');

        errorDiv.style.display = 'none';
        statusDiv.style.display = 'none';

        // Gather form data
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim().toLowerCase();
        const role = document.getElementById('reg-role').value;
        const passphrase = document.getElementById('reg-passphrase').value;
        const passphraseConfirm = document.getElementById('reg-passphrase-confirm').value;

        const jurisdictionCheckboxes = document.querySelectorAll('input[name="jurisdiction"]:checked');
        const jurisdictions = Array.from(jurisdictionCheckboxes).map(cb => cb.value);

        const ackCheckboxes = document.querySelectorAll('input[name="ack"]:checked');

        // Validation
        if (!name || !email || !role) {
            showError('All fields are required.');
            return;
        }
        if (jurisdictions.length === 0) {
            showError('Select at least one jurisdiction.');
            return;
        }
        if (passphrase.length < 8) {
            showError('Passphrase must be at least 8 characters.');
            return;
        }
        if (passphrase !== passphraseConfirm) {
            showError('Passphrases do not match.');
            return;
        }
        if (ackCheckboxes.length < ACKNOWLEDGMENTS.length) {
            showError('All acknowledgments must be accepted.');
            return;
        }

        // Disable submit
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Generating keypair...';
        showStatus('Generating ECDSA P-256 keypair...');

        try {
            // 1. Generate User ID
            const createdAt = new Date().toISOString();
            const { userId, salt } = await window.OPTKAS_CRYPTO.generateUserId(email, createdAt);

            showStatus('Keypair generated. Encrypting private key...');

            // 2. Generate ECDSA P-256 keypair
            const keyPair = await window.OPTKAS_CRYPTO.generateKeyPair();
            const publicKeyJwk = await window.OPTKAS_CRYPTO.exportPublicKey(keyPair.publicKey);
            const privateKeyJwk = await window.OPTKAS_CRYPTO.exportPrivateKey(keyPair.privateKey);

            // 3. Encrypt private key with passphrase
            const encryptedPrivateKey = await window.OPTKAS_CRYPTO.encryptPrivateKey(privateKeyJwk, passphrase);

            showStatus('Saving profile to encrypted vault...');

            // 4. Save profile
            const profile = {
                userId: userId,
                name: name,
                email: email,
                role: role,
                jurisdictions: jurisdictions,
                publicKeyJwk: publicKeyJwk,
                encryptedPrivateKey: encryptedPrivateKey,
                createdAt: createdAt,
                salt: salt,
                version: REG_VERSION,
                acknowledgments: ACKNOWLEDGMENTS.map(function (ack, i) {
                    return { text: ack, accepted: true, timestamp: createdAt };
                })
            };

            await window.OPTKAS_VAULT.saveProfile(profile);

            // 5. Log audit event
            showStatus('Recording audit event...');
            await window.OPTKAS_AUDIT.logRegistration(userId, {
                role: role,
                jurisdictions: jurisdictions,
                publicKeyFingerprint: await window.OPTKAS_CRYPTO.sha256(JSON.stringify(publicKeyJwk)),
                acknowledgmentsAccepted: ACKNOWLEDGMENTS.length
            });

            // 6. Create session
            setSession(userId, role, jurisdictions, name);

            showStatus('✅ Registration complete! User ID: ' + userId);

            // 7. Close modal after brief delay
            setTimeout(function () {
                const modal = document.getElementById('optkas-reg-modal');
                if (modal) modal.remove();
                // Inject session indicator
                injectSessionIndicator();
            }, 1500);

        } catch (err) {
            showError('Registration failed: ' + err.message);
            submitBtn.disabled = false;
            submitBtn.textContent = '🔐 Register & Generate Keypair';
        }

        function showError(msg) {
            errorDiv.textContent = msg;
            errorDiv.style.display = 'block';
        }

        function showStatus(msg) {
            statusDiv.textContent = msg;
            statusDiv.style.display = 'block';
        }
    }

    // ─── Login Modal ───
    window.OPTKAS_REGISTRATION = window.OPTKAS_REGISTRATION || {};

    function showLoginModal() {
        const existing = document.getElementById('optkas-reg-modal');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'optkas-reg-modal';
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:99999;display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;';

        const modal = document.createElement('div');
        modal.style.cssText = 'background:#1a1a2e;border:1px solid #333;border-radius:12px;padding:40px;max-width:420px;width:90%;color:#e0e0e0;box-shadow:0 20px 60px rgba(0,0,0,0.5);';

        modal.innerHTML = `
            <div style="text-align:center;margin-bottom:24px;">
                <div style="font-size:36px;margin-bottom:8px;">🔓</div>
                <h2 style="color:#f0f0f0;margin:0 0 8px;">Sign In</h2>
                <p style="color:#888;font-size:13px;margin:0;">Enter your email and passphrase to unlock your vault.</p>
            </div>

            <form id="optkas-login-form" autocomplete="off">
                <div style="margin-bottom:16px;">
                    <label style="display:block;font-size:12px;color:#aaa;margin-bottom:4px;text-transform:uppercase;letter-spacing:1px;">Email Address</label>
                    <input type="email" id="login-email" required style="${inputStyle()}" placeholder="your.email@company.com">
                </div>

                <div style="margin-bottom:16px;">
                    <label style="display:block;font-size:12px;color:#aaa;margin-bottom:4px;text-transform:uppercase;letter-spacing:1px;">Passphrase</label>
                    <input type="password" id="login-passphrase" required style="${inputStyle()}" placeholder="Your passphrase">
                </div>

                <div id="login-error" style="display:none;background:#dc2626;color:white;padding:10px;border-radius:6px;margin-bottom:12px;font-size:13px;"></div>

                <button type="submit" style="width:100%;padding:12px;background:#2563eb;color:white;border:none;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer;">
                    🔓 Sign In
                </button>
            </form>

            <div style="margin-top:16px;text-align:center;">
                <button onclick="OPTKAS_REGISTRATION.showRegistrationModal()" style="padding:8px 20px;background:transparent;color:#4ade80;border:1px solid #4ade80;border-radius:6px;font-size:13px;cursor:pointer;">
                    New Registration
                </button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        document.getElementById('optkas-login-form').addEventListener('submit', handleLogin);
    }

    async function handleLogin(e) {
        e.preventDefault();

        const errorDiv = document.getElementById('login-error');
        errorDiv.style.display = 'none';

        const email = document.getElementById('login-email').value.trim().toLowerCase();
        const passphrase = document.getElementById('login-passphrase').value;

        try {
            // Find profile by email
            const profiles = await window.OPTKAS_VAULT.getAllProfiles();
            const profile = profiles.find(function (p) { return p.email === email; });

            if (!profile) {
                showLoginError('No account found for this email.');
                return;
            }

            // Try to decrypt private key to verify passphrase
            try {
                await window.OPTKAS_CRYPTO.decryptPrivateKey(profile.encryptedPrivateKey, passphrase);
            } catch (decryptErr) {
                showLoginError('Invalid passphrase.');
                return;
            }

            // Success — create session
            setSession(profile.userId, profile.role, profile.jurisdictions, profile.name);

            // Close modal
            const modal = document.getElementById('optkas-reg-modal');
            if (modal) modal.remove();

            injectSessionIndicator();

        } catch (err) {
            showLoginError('Login failed: ' + err.message);
        }

        function showLoginError(msg) {
            errorDiv.textContent = msg;
            errorDiv.style.display = 'block';
        }
    }

    // ─── Session Indicator ───
    function injectSessionIndicator() {
        const session = getSession();
        if (!session) return;

        // Remove existing indicator
        const existing = document.getElementById('optkas-session-indicator');
        if (existing) existing.remove();

        const topBar = document.querySelector('.top-bar-right');
        if (!topBar) return;

        const indicator = document.createElement('div');
        indicator.id = 'optkas-session-indicator';
        indicator.style.cssText = 'display:flex;align-items:center;gap:6px;background:#1a3a2a;border:1px solid #16a34a;border-radius:6px;padding:4px 10px;font-size:11px;color:#4ade80;cursor:pointer;';
        indicator.innerHTML = '🔐 <span>' + (session.name || session.userId).substring(0, 20) + '</span>';
        indicator.title = 'User ID: ' + session.userId + '\nRole: ' + session.role + '\nJurisdictions: ' + session.jurisdictions.join(', ');
        indicator.onclick = function () {
            if (confirm('Sign out of OPTKAS vault?')) {
                clearSession();
                indicator.remove();
                if (isProtectedPage()) {
                    showRegistrationModal();
                }
            }
        };

        topBar.insertBefore(indicator, topBar.firstChild);
    }

    // ─── Get Current User ───
    function getCurrentUser() {
        return getSession();
    }

    async function getCurrentProfile() {
        const session = getSession();
        if (!session) return null;
        return window.OPTKAS_VAULT.getProfile(session.userId);
    }

    // ─── Initialize on page load ───
    function init() {
        // Check if current page requires registration
        if (isProtectedPage()) {
            if (!isRegistered()) {
                showRegistrationModal();
            } else {
                injectSessionIndicator();
            }
        } else if (isRegistered()) {
            injectSessionIndicator();
        }
    }

    document.addEventListener('DOMContentLoaded', init);

    console.log('[REG] OPTKAS Registration Gate v' + REG_VERSION + ' loaded.');

    return {
        version: REG_VERSION,
        isRegistered: isRegistered,
        getSession: getSession,
        getCurrentUser: getCurrentUser,
        getCurrentProfile: getCurrentProfile,
        clearSession: clearSession,
        checkGate: checkGate,
        showRegistrationModal: showRegistrationModal,
        showLoginModal: showLoginModal,
        ROLES: ROLES,
        JURISDICTIONS: JURISDICTIONS,
        PROTECTED_PAGES: PROTECTED_PAGES
    };
})();
