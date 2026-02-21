/* ═══════════════════════════════════════════════════════════
   OPTKAS Hash-Chain Audit Log — v1.20.0
   Tamper-resistant audit trail with cryptographic chaining.
   Each event hash includes the previous event hash, forming
   an immutable sequence. Chain head stored in certification
   snapshot hashes.
   
   Dependencies: optkas-crypto.js, optkas-vault-store.js
   ═══════════════════════════════════════════════════════════ */

window.OPTKAS_AUDIT = (function () {
    'use strict';

    const AUDIT_VERSION = '1.20.0';

    // ─── Event Types ───
    const EVENT_TYPES = {
        REGISTRATION: 'REGISTRATION',
        LESSON_LISTENED: 'LESSON_LISTENED',
        LESSON_REVIEWED: 'LESSON_REVIEWED',
        QUIZ_ATTEMPT: 'QUIZ_ATTEMPT',
        EXAM_ATTEMPT: 'EXAM_ATTEMPT',
        CERTIFICATION_GRANTED: 'CERTIFICATION_GRANTED',
        CERTIFICATION_SUSPENDED: 'CERTIFICATION_SUSPENDED',
        DOC_ACCESSED: 'DOC_ACCESSED',
        MISSTATEMENT_REPORT: 'MISSTATEMENT_REPORT',
        LIB_AUDIO_LISTENED: 'LIB_AUDIO_LISTENED',
        FREEZE_ACTIVATED: 'FREEZE_ACTIVATED',
        FREEZE_RELEASED: 'FREEZE_RELEASED',
        JURISDICTION_BOUND: 'JURISDICTION_BOUND',
        PASSPHRASE_CHANGED: 'PASSPHRASE_CHANGED'
    };

    // Chain head — stored in memory, persisted to IndexedDB
    let chainHead = 'GENESIS'; // SHA-256 of "OPTKAS_AUDIT_GENESIS"
    let chainLength = 0;
    let initialized = false;

    // ─── Initialize: Load chain head from existing audit trail ───
    async function initialize() {
        if (initialized) return;

        try {
            const chain = await window.OPTKAS_VAULT.getAuditChain();
            if (chain && chain.length > 0) {
                // Get the last event hash as chain head
                const lastEvent = chain[chain.length - 1];
                chainHead = lastEvent.eventHash;
                chainLength = chain.length;
                console.log('[AUDIT] Chain restored: ' + chainLength + ' events, head: ' + chainHead.substring(0, 12) + '...');
            } else {
                // Genesis state
                chainHead = await window.OPTKAS_CRYPTO.sha256('OPTKAS_AUDIT_GENESIS|' + AUDIT_VERSION);
                chainLength = 0;
                console.log('[AUDIT] Genesis chain initialized.');
            }
            initialized = true;
        } catch (e) {
            console.warn('[AUDIT] Init warning:', e.message);
            chainHead = await window.OPTKAS_CRYPTO.sha256('OPTKAS_AUDIT_GENESIS|' + AUDIT_VERSION);
            chainLength = 0;
            initialized = true;
        }
    }

    // ─── Log Event ───
    async function logEvent(eventType, userId, payload) {
        await initialize();

        if (!EVENT_TYPES[eventType]) {
            console.error('[AUDIT] Unknown event type: ' + eventType);
            return null;
        }

        const timestamp = new Date().toISOString();
        const prevHash = chainHead;

        // Construct event record
        const eventData = {
            eventType: eventType,
            userId: userId || 'SYSTEM',
            timestamp: timestamp,
            payload: payload || {},
            systemVersion: AUDIT_VERSION,
            prevHash: prevHash
        };

        // Compute event hash: SHA-256(prevHash + JSON(eventData))
        const eventJson = JSON.stringify(eventData);
        const eventHash = await window.OPTKAS_CRYPTO.sha256(prevHash + '|' + eventJson);

        // Full event record
        const auditRecord = Object.assign({}, eventData, {
            eventHash: eventHash,
            chainIndex: chainLength
        });

        // Persist to IndexedDB
        try {
            await window.OPTKAS_VAULT.addAuditEvent(auditRecord);
        } catch (e) {
            console.error('[AUDIT] Failed to persist event:', e.message);
            // Still update chain state for session consistency
        }

        // Update chain head
        chainHead = eventHash;
        chainLength++;

        console.log('[AUDIT] Event #' + (chainLength) + ' ' + eventType + ' → ' + eventHash.substring(0, 12) + '...');

        return {
            eventHash: eventHash,
            chainIndex: chainLength - 1,
            timestamp: timestamp
        };
    }

    // ─── Verify Chain Integrity ───
    async function verifyChain() {
        await initialize();

        const chain = await window.OPTKAS_VAULT.getAuditChain();
        if (!chain || chain.length === 0) {
            return { valid: true, length: 0, message: 'Empty chain (genesis state).' };
        }

        let prevHash = await window.OPTKAS_CRYPTO.sha256('OPTKAS_AUDIT_GENESIS|' + AUDIT_VERSION);
        let errors = [];

        for (let i = 0; i < chain.length; i++) {
            const event = chain[i];

            // Verify prevHash matches
            if (event.prevHash !== prevHash) {
                errors.push({
                    index: i,
                    error: 'prevHash mismatch',
                    expected: prevHash.substring(0, 12),
                    got: event.prevHash.substring(0, 12)
                });
            }

            // Recompute event hash
            const eventData = {
                eventType: event.eventType,
                userId: event.userId,
                timestamp: event.timestamp,
                payload: event.payload,
                systemVersion: event.systemVersion,
                prevHash: event.prevHash
            };

            const expectedHash = await window.OPTKAS_CRYPTO.sha256(event.prevHash + '|' + JSON.stringify(eventData));

            if (event.eventHash !== expectedHash) {
                errors.push({
                    index: i,
                    error: 'eventHash mismatch',
                    expected: expectedHash.substring(0, 12),
                    got: event.eventHash.substring(0, 12)
                });
            }

            prevHash = event.eventHash;
        }

        return {
            valid: errors.length === 0,
            length: chain.length,
            head: chain[chain.length - 1].eventHash,
            errors: errors,
            message: errors.length === 0
                ? 'Chain integrity verified: ' + chain.length + ' events.'
                : 'CHAIN INTEGRITY FAILURE: ' + errors.length + ' error(s) detected.'
        };
    }

    // ─── Get Chain Head ───
    function getChainHead() {
        return chainHead;
    }

    function getChainLength() {
        return chainLength;
    }

    // ─── Get Events by Type ───
    async function getEventsByType(eventType) {
        return window.OPTKAS_VAULT.getAuditByType(eventType);
    }

    // ─── Get Full Chain ───
    async function getFullChain() {
        return window.OPTKAS_VAULT.getAuditChain();
    }

    // ─── Convenience loggers ───
    function logRegistration(userId, payload) {
        return logEvent(EVENT_TYPES.REGISTRATION, userId, payload);
    }

    function logQuizAttempt(userId, payload) {
        return logEvent(EVENT_TYPES.QUIZ_ATTEMPT, userId, payload);
    }

    function logExamAttempt(userId, payload) {
        return logEvent(EVENT_TYPES.EXAM_ATTEMPT, userId, payload);
    }

    function logCertification(userId, payload) {
        return logEvent(EVENT_TYPES.CERTIFICATION_GRANTED, userId, payload);
    }

    function logDocAccess(userId, payload) {
        return logEvent(EVENT_TYPES.DOC_ACCESSED, userId, payload);
    }

    function logLibAudioListened(userId, payload) {
        return logEvent(EVENT_TYPES.LIB_AUDIO_LISTENED, userId, payload);
    }

    function logFreeze(userId, payload) {
        return logEvent(EVENT_TYPES.FREEZE_ACTIVATED, userId, payload);
    }

    function logMisstatement(userId, payload) {
        return logEvent(EVENT_TYPES.MISSTATEMENT_REPORT, userId, payload);
    }

    console.log('[AUDIT] OPTKAS Hash-Chain Audit Log v' + AUDIT_VERSION + ' loaded.');

    return {
        version: AUDIT_VERSION,
        EVENT_TYPES: EVENT_TYPES,
        initialize: initialize,
        logEvent: logEvent,
        logRegistration: logRegistration,
        logQuizAttempt: logQuizAttempt,
        logExamAttempt: logExamAttempt,
        logCertification: logCertification,
        logDocAccess: logDocAccess,
        logLibAudioListened: logLibAudioListened,
        logFreeze: logFreeze,
        logMisstatement: logMisstatement,
        verifyChain: verifyChain,
        getChainHead: getChainHead,
        getChainLength: getChainLength,
        getEventsByType: getEventsByType,
        getFullChain: getFullChain
    };
})();
