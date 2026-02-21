/* ═══════════════════════════════════════════════════════════
   OPTKAS Artifact Vault — Document Lifecycle Governance Engine
   Version: 1.18.0
   ═══════════════════════════════════════════════════════════
   Architecture: IIFE with localStorage persistence.
   localStorage key: optkas_artifact_vault_state
   Exposes: window.OPTKAS_VAULT for cross-system consumption.
   ═══════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    const ENGINE_VERSION = '1.18.0';
    const STORAGE_KEY = 'optkas_artifact_vault_state';
    const MAX_AUDIT_EVENTS = 300;

    // ─── Document Types and Impact Binding Rules ───
    const DOCUMENT_TYPES = {
        INSURANCE:      { label: 'Insurance Certificate',     icon: '🛡️', impactDomain: 'D', impactClaims: ['D2','D3'],       critical: true  },
        UCC_FILING:     { label: 'UCC Filing',                icon: '📋', impactDomain: null, impactCapabilities: ['L1-1','L1-2','L1-3','L1-4'], critical: true  },
        SPV_FILING:     { label: 'SPV Filing',                icon: '🏢', impactDomain: 'C', impactClaims: ['C1','C2','C3'],  critical: true  },
        CUSTODY:        { label: 'Custody Confirmation',      icon: '🔐', impactDomain: 'F', impactClaims: ['F1','F2'],       critical: true  },
        TRANSFER_AGENT: { label: 'Transfer Agent Letter',     icon: '📨', impactDomain: 'G', impactClaims: ['G1','G2','G3'],  critical: true  },
        LEGAL_MEMO:     { label: 'Legal Memorandum',          icon: '⚖️', impactDomain: 'D', impactClaims: ['D1','D4','D5'],  critical: false },
        ENGAGEMENT:     { label: 'Engagement Letter',         icon: '🤝', impactDomain: 'B', impactClaims: ['B1','B2'],       critical: false },
        REGULATORY:     { label: 'Regulatory Filing',         icon: '🏛️', impactDomain: 'D', impactClaims: ['D1','D6'],       critical: true  },
        AUDIT_REPORT:   { label: 'Audit Report',              icon: '📊', impactDomain: 'E', impactClaims: ['E1','E2','E3'],  critical: false },
        OTHER:          { label: 'Other Document',            icon: '📄', impactDomain: null, impactClaims: [],               critical: false }
    };

    const REVIEW_FREQUENCIES = [
        { value: 30,  label: 'Monthly (30 days)' },
        { value: 60,  label: 'Bi-Monthly (60 days)' },
        { value: 90,  label: 'Quarterly (90 days)' },
        { value: 180, label: 'Semi-Annual (180 days)' },
        { value: 365, label: 'Annual (365 days)' }
    ];

    const LEGAL_REVIEW_STATUSES = ['pending', 'approved', 'expired', 'flagged'];

    const VISIBILITY_OPTIONS = ['private', 'restricted', 'public'];

    // Expiration warning threshold (days)
    const EXPIRING_SOON_DAYS = 30;

    // ─── State Management ───
    let state = loadState();

    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                parsed.version = ENGINE_VERSION;
                if (!parsed.artifacts) parsed.artifacts = [];
                if (!parsed.auditLog) parsed.auditLog = [];
                if (!parsed.lastUpdated) parsed.lastUpdated = null;
                if (!parsed.nextId) parsed.nextId = 1;
                return parsed;
            }
        } catch (e) { /* ignore */ }
        return {
            version: ENGINE_VERSION,
            artifacts: [],
            auditLog: [],
            lastUpdated: null,
            nextId: 1
        };
    }

    function saveState() {
        state.version = ENGINE_VERSION;
        state.lastUpdated = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    // ─── Audit Logging ───
    function logAudit(type, detail, artifactId) {
        state.auditLog.unshift({
            timestamp: new Date().toISOString(),
            type: type,
            detail: detail,
            artifactId: artifactId || null,
            engineVersion: ENGINE_VERSION
        });
        if (state.auditLog.length > MAX_AUDIT_EVENTS) {
            state.auditLog = state.auditLog.slice(0, MAX_AUDIT_EVENTS);
        }
    }

    // ─── Artifact ID Generation ───
    function generateArtifactId() {
        const id = 'AV-' + String(state.nextId).padStart(3, '0');
        state.nextId++;
        return id;
    }

    // ─── SHA-256 Hash Generation ───
    async function generateArtifactHash(artifact) {
        const payload = JSON.stringify({
            id: artifact.id,
            title: artifact.title,
            documentType: artifact.documentType,
            version: artifact.version,
            issueDate: artifact.issueDate,
            expirationDate: artifact.expirationDate,
            claimIds: (artifact.claimIds || []).sort(),
            assignedOwner: artifact.assignedOwner
        });
        const encoded = new TextEncoder().encode(payload);
        const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // ─── Artifact Status Computation ───
    function computeArtifactStatus(artifact) {
        const now = new Date();
        if (artifact.manualStatus === 'revoked') return 'revoked';
        if (artifact.manualStatus === 'draft') return 'draft';

        if (artifact.expirationDate) {
            const exp = new Date(artifact.expirationDate);
            if (now > exp) return 'expired';
            const daysUntil = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
            if (daysUntil <= EXPIRING_SOON_DAYS) return 'expiring-soon';
        }

        if (artifact.reviewFrequencyDays && artifact.lastReviewDate) {
            const lastReview = new Date(artifact.lastReviewDate);
            const daysSince = Math.floor((now - lastReview) / (1000 * 60 * 60 * 24));
            if (daysSince > artifact.reviewFrequencyDays) return 'pending-review';
        }

        return 'active';
    }

    // ─── CRUD Operations ───
    function createArtifact(data) {
        const artifact = {
            id: generateArtifactId(),
            title: data.title || '',
            documentType: data.documentType || 'OTHER',
            claimIds: data.claimIds || [],
            version: data.version || 1,
            issueDate: data.issueDate || new Date().toISOString().split('T')[0],
            expirationDate: data.expirationDate || '',
            reviewFrequencyDays: data.reviewFrequencyDays || 90,
            lastReviewDate: data.lastReviewDate || new Date().toISOString().split('T')[0],
            assignedOwner: data.assignedOwner || '',
            legalReviewStatus: data.legalReviewStatus || 'pending',
            hash: '',
            storageIntegrity: 'valid',
            visibility: data.visibility || 'private',
            manualStatus: data.manualStatus || null,
            notes: data.notes || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Generate hash asynchronously, then save
        generateArtifactHash(artifact).then(hash => {
            artifact.hash = hash;
            state.artifacts.push(artifact);
            logAudit('ARTIFACT_CREATED', `Created ${artifact.id}: ${artifact.title}`, artifact.id);
            saveState();
            renderAll();
        });

        return artifact;
    }

    function updateArtifact(artifactId, data) {
        const artifact = state.artifacts.find(a => a.id === artifactId);
        if (!artifact) return null;

        const changes = [];
        for (const [key, val] of Object.entries(data)) {
            if (JSON.stringify(artifact[key]) !== JSON.stringify(val)) {
                changes.push(key);
                artifact[key] = val;
            }
        }

        if (changes.length > 0) {
            artifact.version = (artifact.version || 1) + 1;
            artifact.updatedAt = new Date().toISOString();

            generateArtifactHash(artifact).then(hash => {
                artifact.hash = hash;
                logAudit('ARTIFACT_UPDATED', `Updated ${artifactId}: ${changes.join(', ')}`, artifactId);
                saveState();
                renderAll();
            });
        }

        return artifact;
    }

    function revokeArtifact(artifactId) {
        const artifact = state.artifacts.find(a => a.id === artifactId);
        if (!artifact) return;
        artifact.manualStatus = 'revoked';
        artifact.updatedAt = new Date().toISOString();
        logAudit('ARTIFACT_REVOKED', `Revoked ${artifactId}: ${artifact.title}`, artifactId);
        saveState();
        renderAll();
    }

    function markReviewed(artifactId) {
        const artifact = state.artifacts.find(a => a.id === artifactId);
        if (!artifact) return;
        artifact.lastReviewDate = new Date().toISOString().split('T')[0];
        artifact.updatedAt = new Date().toISOString();
        logAudit('ARTIFACT_REVIEWED', `Reviewed ${artifactId}: ${artifact.title}`, artifactId);
        saveState();
        renderAll();
    }

    function deleteArtifact(artifactId) {
        const idx = state.artifacts.findIndex(a => a.id === artifactId);
        if (idx === -1) return;
        const artifact = state.artifacts[idx];
        logAudit('ARTIFACT_DELETED', `Deleted ${artifactId}: ${artifact.title}`, artifactId);
        state.artifacts.splice(idx, 1);
        saveState();
        renderAll();
    }

    // ─── Impact Analysis Engine ───
    function getImpactAnalysis() {
        const impacts = {
            expiredCritical: [],
            expiredNonCritical: [],
            expiringSoon: [],
            pendingReview: [],
            domainImpacts: {},
            capabilityImpacts: [],
            freezeTriggers: [],
            totalArtifacts: state.artifacts.length,
            activeCount: 0,
            expiredCount: 0,
            expiringSoonCount: 0,
            pendingReviewCount: 0,
            revokedCount: 0,
            draftCount: 0,
            complianceScore: 0
        };

        let activeOrOk = 0;

        state.artifacts.forEach(artifact => {
            const status = computeArtifactStatus(artifact);
            const typeInfo = DOCUMENT_TYPES[artifact.documentType] || DOCUMENT_TYPES.OTHER;

            switch (status) {
                case 'active':
                    impacts.activeCount++;
                    activeOrOk++;
                    break;
                case 'expiring-soon':
                    impacts.expiringSoonCount++;
                    impacts.expiringSoon.push(artifact);
                    activeOrOk++; // Still valid
                    break;
                case 'expired':
                    impacts.expiredCount++;
                    if (typeInfo.critical) {
                        impacts.expiredCritical.push(artifact);
                    } else {
                        impacts.expiredNonCritical.push(artifact);
                    }
                    // Domain impact
                    if (typeInfo.impactDomain) {
                        if (!impacts.domainImpacts[typeInfo.impactDomain]) {
                            impacts.domainImpacts[typeInfo.impactDomain] = [];
                        }
                        impacts.domainImpacts[typeInfo.impactDomain].push(artifact);
                    }
                    // Capability impact
                    if (typeInfo.impactCapabilities) {
                        typeInfo.impactCapabilities.forEach(cap => {
                            impacts.capabilityImpacts.push({ capability: cap, artifact: artifact });
                        });
                    }
                    // Freeze trigger for critical documents
                    if (typeInfo.critical) {
                        impacts.freezeTriggers.push(`${typeInfo.label} "${artifact.title}" expired`);
                    }
                    break;
                case 'pending-review':
                    impacts.pendingReviewCount++;
                    impacts.pendingReview.push(artifact);
                    activeOrOk++;
                    break;
                case 'revoked':
                    impacts.revokedCount++;
                    // Revoked critical documents trigger same as expired
                    if (typeInfo.critical) {
                        impacts.freezeTriggers.push(`${typeInfo.label} "${artifact.title}" revoked`);
                        if (typeInfo.impactDomain) {
                            if (!impacts.domainImpacts[typeInfo.impactDomain]) {
                                impacts.domainImpacts[typeInfo.impactDomain] = [];
                            }
                            impacts.domainImpacts[typeInfo.impactDomain].push(artifact);
                        }
                    }
                    break;
                case 'draft':
                    impacts.draftCount++;
                    break;
            }
        });

        // Compliance score: percentage of non-draft, non-revoked artifacts that are active/expiring-soon
        const relevantCount = state.artifacts.filter(a => {
            const s = computeArtifactStatus(a);
            return s !== 'draft' && s !== 'revoked';
        }).length;
        impacts.complianceScore = relevantCount > 0 ? Math.round((activeOrOk / relevantCount) * 100) : (state.artifacts.length === 0 ? 0 : 100);

        return impacts;
    }

    // ─── Claim Coverage Analysis ───
    function getClaimCoverage() {
        // All claim IDs from verification engine domains
        const allClaims = [
            'A1','A2','A3','A4','A5','A6','A7','A8','A9',
            'B1','B2','B3','B4','B5','B6','B7','B8',
            'C1','C2','C3','C4','C5','C6',
            'D1','D2','D3','D4','D5','D6',
            'E1','E2','E3','E4','E5','E6',
            'F1','F2','F3','F4','F5',
            'G1','G2','G3','G4','G5','G6','G7','G8','G9','G10'
        ];

        const coveredClaims = new Set();
        const activeCoveredClaims = new Set();

        state.artifacts.forEach(artifact => {
            const status = computeArtifactStatus(artifact);
            (artifact.claimIds || []).forEach(cid => {
                coveredClaims.add(cid);
                if (status === 'active' || status === 'expiring-soon') {
                    activeCoveredClaims.add(cid);
                }
            });
        });

        return {
            total: allClaims.length,
            covered: coveredClaims.size,
            activeCovered: activeCoveredClaims.size,
            coveragePercent: Math.round((coveredClaims.size / allClaims.length) * 100),
            activeCoveragePercent: Math.round((activeCoveredClaims.size / allClaims.length) * 100),
            uncoveredClaims: allClaims.filter(c => !coveredClaims.has(c))
        };
    }

    // ─── Next Expiration ───
    function getNextExpiration() {
        const now = new Date();
        let nearest = null;
        let nearestDays = Infinity;

        state.artifacts.forEach(artifact => {
            if (!artifact.expirationDate) return;
            const status = computeArtifactStatus(artifact);
            if (status === 'revoked' || status === 'draft') return;
            const exp = new Date(artifact.expirationDate);
            const days = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
            if (days > 0 && days < nearestDays) {
                nearestDays = days;
                nearest = artifact;
            }
        });

        return nearest ? { artifact: nearest, daysUntil: nearestDays } : null;
    }

    // ═══════════════════════════════════════════════════
    //  RENDERING
    // ═══════════════════════════════════════════════════

    function renderAll() {
        renderDashboard();
        renderRegistry();
        renderImpactPanel();
        renderTimeline();
        renderAuditLog();
    }

    // ─── Dashboard ───
    function renderDashboard() {
        const impact = getImpactAnalysis();
        const coverage = getClaimCoverage();
        const nextExp = getNextExpiration();

        // Metric cards
        setTextById('metricTotal', impact.totalArtifacts);
        setTextById('metricActive', impact.activeCount);
        setTextById('metricExpiring', impact.expiringSoonCount);
        setTextById('metricExpired', impact.expiredCount);
        setTextById('metricPendingReview', impact.pendingReviewCount);

        // Compliance score ring
        const scoreEl = document.getElementById('vaultComplianceScore');
        if (scoreEl) scoreEl.textContent = impact.complianceScore + '%';
        const ringFill = document.getElementById('vaultScoreRing');
        if (ringFill) {
            const circumference = 326.73; // 2 * π * 52
            const offset = circumference * (1 - impact.complianceScore / 100);
            ringFill.style.strokeDashoffset = offset;
            ringFill.style.stroke = impact.complianceScore >= 80 ? '#10b981' :
                                    impact.complianceScore >= 50 ? '#f59e0b' : '#ef4444';
        }

        // Claim coverage
        setTextById('metricClaimCoverage', coverage.coveragePercent + '%');
        setTextById('metricActiveCoverage', coverage.activeCoveragePercent + '%');

        // Next expiration
        const nextExpEl = document.getElementById('nextExpiration');
        if (nextExpEl) {
            if (nextExp) {
                const typeInfo = DOCUMENT_TYPES[nextExp.artifact.documentType] || DOCUMENT_TYPES.OTHER;
                nextExpEl.innerHTML = `<span class="next-exp-label">${typeInfo.icon} ${nextExp.artifact.title}</span>
                    <span class="next-exp-days ${nextExp.daysUntil <= 14 ? 'critical' : nextExp.daysUntil <= 30 ? 'warning' : ''}">${nextExp.daysUntil} days</span>`;
            } else {
                nextExpEl.innerHTML = '<span class="next-exp-label" style="color:var(--text-muted);">No upcoming expirations</span>';
            }
        }

        // Impact alerts
        const alertsEl = document.getElementById('impactAlerts');
        if (alertsEl) {
            if (impact.freezeTriggers.length > 0) {
                let html = '<div class="impact-alert critical">';
                html += '<strong>🚨 SALES FREEZE TRIGGERS</strong>';
                html += '<ul>';
                impact.freezeTriggers.forEach(t => { html += `<li>${t}</li>`; });
                html += '</ul></div>';
                alertsEl.innerHTML = html;
            } else if (impact.expiringSoon.length > 0) {
                let html = '<div class="impact-alert warning">';
                html += '<strong>⚠ Expiration Warnings</strong>';
                html += '<ul>';
                impact.expiringSoon.forEach(a => {
                    const days = Math.ceil((new Date(a.expirationDate) - new Date()) / (1000 * 60 * 60 * 24));
                    html += `<li>${a.title} — ${days} days remaining</li>`;
                });
                html += '</ul></div>';
                alertsEl.innerHTML = html;
            } else if (state.artifacts.length === 0) {
                alertsEl.innerHTML = '<div class="impact-alert info"><strong>No artifacts registered.</strong> Add documents to begin lifecycle governance.</div>';
            } else {
                alertsEl.innerHTML = '<div class="impact-alert ok"><strong>✓ All artifact lifecycles within governance bounds.</strong></div>';
            }
        }
    }

    // ─── Registry Table ───
    function renderRegistry() {
        const container = document.getElementById('registryBody');
        if (!container) return;

        if (state.artifacts.length === 0) {
            container.innerHTML = '<tr class="empty-row"><td colspan="8" style="text-align:center;color:var(--text-muted);padding:40px;">No artifacts registered. Click "Add Artifact" to begin.</td></tr>';
            return;
        }

        // Sort: expired first, then expiring-soon, then pending-review, then active
        const statusOrder = { 'expired': 0, 'revoked': 1, 'expiring-soon': 2, 'pending-review': 3, 'active': 4, 'draft': 5 };
        const sorted = [...state.artifacts].sort((a, b) => {
            const sa = computeArtifactStatus(a);
            const sb = computeArtifactStatus(b);
            return (statusOrder[sa] || 9) - (statusOrder[sb] || 9);
        });

        let html = '';
        sorted.forEach(artifact => {
            const status = computeArtifactStatus(artifact);
            const typeInfo = DOCUMENT_TYPES[artifact.documentType] || DOCUMENT_TYPES.OTHER;
            const statusClass = status === 'active' ? 'status-active' :
                                status === 'expiring-soon' ? 'status-expiring' :
                                status === 'expired' ? 'status-expired' :
                                status === 'pending-review' ? 'status-pending' :
                                status === 'revoked' ? 'status-revoked' : 'status-draft';

            html += `<tr class="registry-row ${statusClass}" data-id="${artifact.id}">
                <td class="col-id"><span class="artifact-id-badge">${artifact.id}</span></td>
                <td class="col-type">${typeInfo.icon} ${typeInfo.label}</td>
                <td class="col-title">${escapeHtml(artifact.title)}</td>
                <td class="col-status"><span class="status-badge ${statusClass}">${status.toUpperCase().replace('-', ' ')}</span></td>
                <td class="col-exp">${artifact.expirationDate || '—'}</td>
                <td class="col-owner">${escapeHtml(artifact.assignedOwner || '—')}</td>
                <td class="col-hash"><code>${artifact.hash ? artifact.hash.substring(0, 10) + '…' : '—'}</code></td>
                <td class="col-actions">
                    <button class="btn-vault-sm btn-review-artifact" onclick="OPTKAS_VAULT_UI.markReviewed('${artifact.id}')" title="Mark Reviewed">✓</button>
                    <button class="btn-vault-sm btn-edit-artifact" onclick="OPTKAS_VAULT_UI.editArtifact('${artifact.id}')" title="Edit">✎</button>
                    <button class="btn-vault-sm btn-revoke-artifact" onclick="OPTKAS_VAULT_UI.revokeArtifact('${artifact.id}')" title="Revoke">✕</button>
                </td>
            </tr>`;
        });

        container.innerHTML = html;
    }

    // ─── Impact Panel ───
    function renderImpactPanel() {
        const container = document.getElementById('impactBindingPanel');
        if (!container) return;

        const impact = getImpactAnalysis();
        let html = '';

        // Domain impacts
        const domainNames = {
            A: 'Infrastructure', B: 'XRPL Capabilities', C: 'Stellar Capabilities',
            D: 'Legal Structure', E: 'Operational Control', F: 'Security & Risk',
            G: 'Sales Compliance'
        };

        html += '<div class="impact-section">';
        html += '<h3>Domain Impact Bindings</h3>';

        if (Object.keys(impact.domainImpacts).length === 0 && impact.capabilityImpacts.length === 0) {
            html += '<p class="impact-clear">✓ No domains or capabilities impacted by expired artifacts.</p>';
        } else {
            for (const [domain, artifacts] of Object.entries(impact.domainImpacts)) {
                html += `<div class="impact-binding-item critical">
                    <span class="impact-domain">Domain ${domain}: ${domainNames[domain] || domain}</span>
                    <span class="impact-count">${artifacts.length} expired artifact(s)</span>
                    <ul class="impact-artifact-list">`;
                artifacts.forEach(a => {
                    html += `<li>${a.id}: ${escapeHtml(a.title)}</li>`;
                });
                html += '</ul></div>';
            }

            if (impact.capabilityImpacts.length > 0) {
                html += '<div class="impact-binding-item warning">';
                html += '<span class="impact-domain">Capability Impacts</span>';
                html += '<ul class="impact-artifact-list">';
                impact.capabilityImpacts.forEach(ci => {
                    html += `<li>${ci.capability} ← ${ci.artifact.id}: ${escapeHtml(ci.artifact.title)}</li>`;
                });
                html += '</ul></div>';
            }
        }
        html += '</div>';

        // Claim coverage map
        const coverage = getClaimCoverage();
        html += '<div class="impact-section">';
        html += '<h3>Claim Coverage Map</h3>';
        html += `<p class="coverage-summary">${coverage.covered} of ${coverage.total} claims backed by artifacts (${coverage.coveragePercent}%)</p>`;
        if (coverage.uncoveredClaims.length > 0 && coverage.uncoveredClaims.length <= 20) {
            html += '<div class="uncovered-claims">';
            html += '<span class="uncovered-label">Uncovered:</span> ';
            html += coverage.uncoveredClaims.map(c => `<span class="claim-chip uncovered">${c}</span>`).join(' ');
            html += '</div>';
        }
        html += '</div>';

        container.innerHTML = html;
    }

    // ─── Expiration Timeline ───
    function renderTimeline() {
        const container = document.getElementById('expirationTimeline');
        if (!container) return;

        const now = new Date();
        const upcoming = state.artifacts
            .filter(a => {
                const s = computeArtifactStatus(a);
                return a.expirationDate && s !== 'revoked' && s !== 'draft';
            })
            .map(a => ({
                ...a,
                status: computeArtifactStatus(a),
                daysUntil: Math.ceil((new Date(a.expirationDate) - now) / (1000 * 60 * 60 * 24))
            }))
            .sort((a, b) => a.daysUntil - b.daysUntil)
            .slice(0, 12);

        if (upcoming.length === 0) {
            container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:24px;">No expiration dates tracked.</p>';
            return;
        }

        let html = '';
        upcoming.forEach(a => {
            const typeInfo = DOCUMENT_TYPES[a.documentType] || DOCUMENT_TYPES.OTHER;
            const barClass = a.daysUntil <= 0 ? 'tl-expired' :
                             a.daysUntil <= 14 ? 'tl-critical' :
                             a.daysUntil <= 30 ? 'tl-warning' : 'tl-ok';

            html += `<div class="timeline-entry ${barClass}">
                <div class="tl-icon">${typeInfo.icon}</div>
                <div class="tl-content">
                    <div class="tl-title">${escapeHtml(a.title)}</div>
                    <div class="tl-meta">${a.id} · v${a.version} · ${a.assignedOwner || 'Unassigned'}</div>
                </div>
                <div class="tl-exp">
                    <span class="tl-days">${a.daysUntil <= 0 ? 'EXPIRED' : a.daysUntil + 'd'}</span>
                    <span class="tl-date">${a.expirationDate}</span>
                </div>
            </div>`;
        });

        container.innerHTML = html;
    }

    // ─── Audit Log ───
    function renderAuditLog() {
        const container = document.getElementById('vaultAuditEvents');
        if (!container) return;

        if (state.auditLog.length === 0) {
            container.innerHTML = '<div class="audit-empty">No audit events recorded.</div>';
            return;
        }

        const typeColors = {
            'ARTIFACT_CREATED': '#10b981',
            'ARTIFACT_UPDATED': '#3b82f6',
            'ARTIFACT_REVIEWED': '#06b6d4',
            'ARTIFACT_REVOKED': '#ef4444',
            'ARTIFACT_DELETED': '#dc2626',
            'ARTIFACT_RESTORED': '#f59e0b'
        };

        let html = '';
        state.auditLog.slice(0, 50).forEach(evt => {
            const time = new Date(evt.timestamp);
            const timeStr = time.toLocaleString('en-US', {
                month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            });
            const color = typeColors[evt.type] || '#64748b';
            const typeLabel = evt.type.replace('ARTIFACT_', '').replace('_', ' ');
            html += `<div class="audit-event">
                <span class="audit-dot" style="background:${color};"></span>
                <span class="audit-time">${timeStr}</span>
                <span class="audit-type" style="color:${color};">${typeLabel}</span>
                <span class="audit-detail">${escapeHtml(evt.detail)}</span>
                <span class="audit-ver">v${evt.engineVersion}</span>
            </div>`;
        });

        container.innerHTML = html;
    }

    // ─── Add Artifact Form ───
    function showAddForm(prefill) {
        const overlay = document.getElementById('artifactFormOverlay');
        if (!overlay) return;

        const data = prefill || {};
        const isEdit = !!data.id;

        let typeOptions = '';
        for (const [key, info] of Object.entries(DOCUMENT_TYPES)) {
            const selected = data.documentType === key ? ' selected' : '';
            typeOptions += `<option value="${key}"${selected}>${info.icon} ${info.label}</option>`;
        }

        let freqOptions = '';
        REVIEW_FREQUENCIES.forEach(f => {
            const selected = (data.reviewFrequencyDays || 90) === f.value ? ' selected' : '';
            freqOptions += `<option value="${f.value}"${selected}>${f.label}</option>`;
        });

        let legalOptions = '';
        LEGAL_REVIEW_STATUSES.forEach(s => {
            const selected = (data.legalReviewStatus || 'pending') === s ? ' selected' : '';
            legalOptions += `<option value="${s}"${selected}>${s.charAt(0).toUpperCase() + s.slice(1)}</option>`;
        });

        let visOptions = '';
        VISIBILITY_OPTIONS.forEach(v => {
            const selected = (data.visibility || 'private') === v ? ' selected' : '';
            visOptions += `<option value="${v}"${selected}>${v.charAt(0).toUpperCase() + v.slice(1)}</option>`;
        });

        // Build claim checkboxes from all domains
        const allClaims = [
            'A1','A2','A3','A4','A5','A6','A7','A8','A9',
            'B1','B2','B3','B4','B5','B6','B7','B8',
            'C1','C2','C3','C4','C5','C6',
            'D1','D2','D3','D4','D5','D6',
            'E1','E2','E3','E4','E5','E6',
            'F1','F2','F3','F4','F5',
            'G1','G2','G3','G4','G5','G6','G7','G8','G9','G10'
        ];
        const selectedClaims = new Set(data.claimIds || []);
        let claimCheckboxes = '';
        let currentDomain = '';
        allClaims.forEach(c => {
            const d = c.charAt(0);
            if (d !== currentDomain) {
                if (currentDomain) claimCheckboxes += '</div>';
                currentDomain = d;
                claimCheckboxes += `<div class="claim-domain-group"><span class="claim-domain-label">${d}</span>`;
            }
            const checked = selectedClaims.has(c) ? ' checked' : '';
            claimCheckboxes += `<label class="claim-checkbox"><input type="checkbox" value="${c}" name="claimIds"${checked}><span>${c}</span></label>`;
        });
        claimCheckboxes += '</div>';

        const today = new Date().toISOString().split('T')[0];

        overlay.innerHTML = `
            <div class="artifact-form-card">
                <div class="form-header">
                    <h2>${isEdit ? '✎ Edit Artifact' : '➕ Register New Artifact'}</h2>
                    <button class="btn-form-close" onclick="OPTKAS_VAULT_UI.closeForm()">✕</button>
                </div>
                <form id="artifactForm" class="artifact-form" onsubmit="return OPTKAS_VAULT_UI.submitForm(event, '${data.id || ''}')">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Document Title *</label>
                            <input type="text" name="title" value="${escapeHtml(data.title || '')}" required placeholder="e.g., General Liability Insurance Certificate">
                        </div>
                        <div class="form-group">
                            <label>Document Type *</label>
                            <select name="documentType" required>${typeOptions}</select>
                        </div>
                        <div class="form-group">
                            <label>Issue Date *</label>
                            <input type="date" name="issueDate" value="${data.issueDate || today}" required>
                        </div>
                        <div class="form-group">
                            <label>Expiration Date</label>
                            <input type="date" name="expirationDate" value="${data.expirationDate || ''}">
                        </div>
                        <div class="form-group">
                            <label>Review Frequency</label>
                            <select name="reviewFrequencyDays">${freqOptions}</select>
                        </div>
                        <div class="form-group">
                            <label>Assigned Owner *</label>
                            <input type="text" name="assignedOwner" value="${escapeHtml(data.assignedOwner || '')}" required placeholder="e.g., Legal Department">
                        </div>
                        <div class="form-group">
                            <label>Legal Review Status</label>
                            <select name="legalReviewStatus">${legalOptions}</select>
                        </div>
                        <div class="form-group">
                            <label>Visibility</label>
                            <select name="visibility">${visOptions}</select>
                        </div>
                    </div>
                    <div class="form-group full-width">
                        <label>Linked Claim IDs</label>
                        <div class="claim-selector">${claimCheckboxes}</div>
                    </div>
                    <div class="form-group full-width">
                        <label>Notes</label>
                        <textarea name="notes" rows="3" placeholder="Internal notes, filing references, or context...">${escapeHtml(data.notes || '')}</textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn-form-cancel" onclick="OPTKAS_VAULT_UI.closeForm()">Cancel</button>
                        <button type="submit" class="btn-form-submit">${isEdit ? 'Update Artifact' : 'Register Artifact'}</button>
                    </div>
                </form>
            </div>`;

        overlay.style.display = 'flex';
    }

    function closeForm() {
        const overlay = document.getElementById('artifactFormOverlay');
        if (overlay) {
            overlay.style.display = 'none';
            overlay.innerHTML = '';
        }
    }

    function submitForm(event, editId) {
        event.preventDefault();
        const form = document.getElementById('artifactForm');
        if (!form) return false;

        const formData = new FormData(form);
        const data = {
            title: formData.get('title'),
            documentType: formData.get('documentType'),
            issueDate: formData.get('issueDate'),
            expirationDate: formData.get('expirationDate'),
            reviewFrequencyDays: parseInt(formData.get('reviewFrequencyDays'), 10),
            assignedOwner: formData.get('assignedOwner'),
            legalReviewStatus: formData.get('legalReviewStatus'),
            visibility: formData.get('visibility'),
            notes: formData.get('notes'),
            claimIds: Array.from(form.querySelectorAll('input[name="claimIds"]:checked')).map(cb => cb.value)
        };

        if (editId) {
            updateArtifact(editId, data);
        } else {
            createArtifact(data);
        }

        closeForm();
        return false;
    }

    function editArtifact(artifactId) {
        const artifact = state.artifacts.find(a => a.id === artifactId);
        if (!artifact) return;
        showAddForm({ ...artifact });
    }

    // ─── Section Navigation ───
    let activeSection = 'dashboard';

    function navigateTo(sectionId) {
        // Hide all sections
        document.querySelectorAll('.vault-section').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

        // Show target
        const section = document.getElementById('sec-' + sectionId);
        if (section) section.classList.add('active');

        const link = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
        if (link) link.classList.add('active');

        activeSection = sectionId;
    }

    // ─── Utility ───
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function setTextById(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    // ═══════════════════════════════════════════════════
    //  PUBLIC API — cross-system consumption
    // ═══════════════════════════════════════════════════
    window.OPTKAS_VAULT = {
        getImpactAnalysis: getImpactAnalysis,
        getClaimCoverage: getClaimCoverage,
        getNextExpiration: getNextExpiration,
        getArtifacts: function () { return state.artifacts; },
        getArtifactStatus: computeArtifactStatus,
        getEngineVersion: function () { return ENGINE_VERSION; }
    };

    // ─── UI API (exposed for onclick handlers) ───
    window.OPTKAS_VAULT_UI = {
        showAddForm: function () { showAddForm(); },
        editArtifact: editArtifact,
        markReviewed: markReviewed,
        revokeArtifact: revokeArtifact,
        closeForm: closeForm,
        submitForm: submitForm,
        navigateTo: navigateTo
    };

    // ─── Initialization ───
    document.addEventListener('DOMContentLoaded', function () {
        renderAll();

        // Nav click handlers
        document.querySelectorAll('.nav-link[data-section]').forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                navigateTo(this.dataset.section);
            });
        });
    });

})();
