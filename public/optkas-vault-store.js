/* ═══════════════════════════════════════════════════════════
   OPTKAS Vault Store — v1.20.0
   Encrypted IndexedDB storage for Mode 1 (local private).
   User profile, encrypted state blobs, audit chain,
   signed attestations, document access records.
   
   Dependencies: optkas-crypto.js
   ═══════════════════════════════════════════════════════════ */

window.OPTKAS_VAULT = (function () {
    'use strict';

    const VAULT_VERSION = '1.20.0';
    const DB_NAME = 'optkas_vault';
    const DB_VERSION = 1;

    // Store names
    const STORES = {
        PROFILE: 'user_profile',        // userId, role, jurisdictions, publicKeyJwk, encryptedPrivateKey, createdAt
        STATE: 'encrypted_state',        // key → encrypted state blobs
        AUDIT: 'audit_chain',           // sequential hash-chained audit events
        ATTESTATIONS: 'attestations',   // signed quiz/exam attestation payloads
        DOCUMENTS: 'document_access'    // document locker access records
    };

    let db = null;

    // ─── Open / Initialize IndexedDB ───
    function openDB() {
        return new Promise(function (resolve, reject) {
            if (db) return resolve(db);

            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = function (event) {
                const database = event.target.result;

                // User profile store
                if (!database.objectStoreNames.contains(STORES.PROFILE)) {
                    database.createObjectStore(STORES.PROFILE, { keyPath: 'userId' });
                }

                // Encrypted state store (key-value)
                if (!database.objectStoreNames.contains(STORES.STATE)) {
                    database.createObjectStore(STORES.STATE, { keyPath: 'key' });
                }

                // Audit chain (auto-increment sequence)
                if (!database.objectStoreNames.contains(STORES.AUDIT)) {
                    const auditStore = database.createObjectStore(STORES.AUDIT, { keyPath: 'seq', autoIncrement: true });
                    auditStore.createIndex('eventType', 'eventType', { unique: false });
                    auditStore.createIndex('timestamp', 'timestamp', { unique: false });
                    auditStore.createIndex('userId', 'userId', { unique: false });
                }

                // Attestations
                if (!database.objectStoreNames.contains(STORES.ATTESTATIONS)) {
                    const attestStore = database.createObjectStore(STORES.ATTESTATIONS, { keyPath: 'attestationId' });
                    attestStore.createIndex('userId', 'userId', { unique: false });
                    attestStore.createIndex('type', 'type', { unique: false });
                    attestStore.createIndex('timestamp', 'timestamp', { unique: false });
                }

                // Document access records
                if (!database.objectStoreNames.contains(STORES.DOCUMENTS)) {
                    const docStore = database.createObjectStore(STORES.DOCUMENTS, { keyPath: 'accessId' });
                    docStore.createIndex('userId', 'userId', { unique: false });
                    docStore.createIndex('documentId', 'documentId', { unique: false });
                }
            };

            request.onsuccess = function (event) {
                db = event.target.result;
                console.log('[VAULT] IndexedDB opened: ' + DB_NAME + ' v' + DB_VERSION);
                resolve(db);
            };

            request.onerror = function (event) {
                console.error('[VAULT] IndexedDB error:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    // ─── Generic Store Operations ───
    function put(storeName, data) {
        return new Promise(async function (resolve, reject) {
            const database = await openDB();
            const tx = database.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            const request = store.put(data);
            request.onsuccess = function () { resolve(request.result); };
            request.onerror = function () { reject(request.error); };
        });
    }

    function get(storeName, key) {
        return new Promise(async function (resolve, reject) {
            const database = await openDB();
            const tx = database.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const request = store.get(key);
            request.onsuccess = function () { resolve(request.result); };
            request.onerror = function () { reject(request.error); };
        });
    }

    function getAll(storeName) {
        return new Promise(async function (resolve, reject) {
            const database = await openDB();
            const tx = database.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const request = store.getAll();
            request.onsuccess = function () { resolve(request.result); };
            request.onerror = function () { reject(request.error); };
        });
    }

    function getAllByIndex(storeName, indexName, value) {
        return new Promise(async function (resolve, reject) {
            const database = await openDB();
            const tx = database.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const index = store.index(indexName);
            const request = index.getAll(value);
            request.onsuccess = function () { resolve(request.result); };
            request.onerror = function () { reject(request.error); };
        });
    }

    function count(storeName) {
        return new Promise(async function (resolve, reject) {
            const database = await openDB();
            const tx = database.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const request = store.count();
            request.onsuccess = function () { resolve(request.result); };
            request.onerror = function () { reject(request.error); };
        });
    }

    // ─── User Profile ───
    async function saveProfile(profile) {
        return put(STORES.PROFILE, profile);
    }

    async function getProfile(userId) {
        return get(STORES.PROFILE, userId);
    }

    async function getAllProfiles() {
        return getAll(STORES.PROFILE);
    }

    // ─── Encrypted State ───
    async function saveEncryptedState(key, encryptedBlob) {
        return put(STORES.STATE, { key: key, blob: encryptedBlob, updatedAt: Date.now() });
    }

    async function getEncryptedState(key) {
        const record = await get(STORES.STATE, key);
        return record ? record.blob : null;
    }

    // ─── Audit Chain ───
    async function addAuditEvent(event) {
        return put(STORES.AUDIT, event);
    }

    async function getAuditChain() {
        return getAll(STORES.AUDIT);
    }

    async function getAuditByType(eventType) {
        return getAllByIndex(STORES.AUDIT, 'eventType', eventType);
    }

    async function getAuditCount() {
        return count(STORES.AUDIT);
    }

    // ─── Attestations ───
    async function saveAttestation(attestation) {
        return put(STORES.ATTESTATIONS, attestation);
    }

    async function getAttestations(userId) {
        return getAllByIndex(STORES.ATTESTATIONS, 'userId', userId);
    }

    async function getAllAttestations() {
        return getAll(STORES.ATTESTATIONS);
    }

    // ─── Document Access ───
    async function saveDocumentAccess(record) {
        return put(STORES.DOCUMENTS, record);
    }

    async function getDocumentAccess(userId) {
        return getAllByIndex(STORES.DOCUMENTS, 'userId', userId);
    }

    // ─── Vault Health Check ───
    async function healthCheck() {
        try {
            await openDB();
            const profileCount = await count(STORES.PROFILE);
            const auditCount = await count(STORES.AUDIT);
            const attCount = await count(STORES.ATTESTATIONS);
            return {
                status: 'healthy',
                dbName: DB_NAME,
                dbVersion: DB_VERSION,
                profiles: profileCount,
                auditEvents: auditCount,
                attestations: attCount,
                version: VAULT_VERSION
            };
        } catch (e) {
            return {
                status: 'error',
                error: e.message,
                version: VAULT_VERSION
            };
        }
    }

    // ─── Mode 2 Hook: Remote API Interface ───
    // When Mode 2 is implemented, replace these methods with server calls
    const MODE2_HOOKS = {
        saveProfileRemote: null,       // async function(profile) {}
        getProfileRemote: null,        // async function(userId) {}
        saveAuditRemote: null,         // async function(event) {}
        saveAttestationRemote: null,   // async function(attestation) {}
    };

    function setMode2Hook(hookName, handler) {
        if (MODE2_HOOKS.hasOwnProperty(hookName)) {
            MODE2_HOOKS[hookName] = handler;
            console.log('[VAULT] Mode 2 hook set: ' + hookName);
        }
    }

    console.log('[VAULT] OPTKAS Vault Store v' + VAULT_VERSION + ' loaded (Mode 1: Local IndexedDB).');

    return {
        version: VAULT_VERSION,
        openDB: openDB,
        saveProfile: saveProfile,
        getProfile: getProfile,
        getAllProfiles: getAllProfiles,
        saveEncryptedState: saveEncryptedState,
        getEncryptedState: getEncryptedState,
        addAuditEvent: addAuditEvent,
        getAuditChain: getAuditChain,
        getAuditByType: getAuditByType,
        getAuditCount: getAuditCount,
        saveAttestation: saveAttestation,
        getAttestations: getAttestations,
        getAllAttestations: getAllAttestations,
        saveDocumentAccess: saveDocumentAccess,
        getDocumentAccess: getDocumentAccess,
        healthCheck: healthCheck,
        setMode2Hook: setMode2Hook,
        STORES: STORES
    };
})();
