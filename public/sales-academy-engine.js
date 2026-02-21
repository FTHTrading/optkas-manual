/* ═══════════════════════════════════════════════════════════
   OPTKAS Sales Academy Engine — v1.14.0
   Quiz system, certification gating, progress tracking,
   and localStorage persistence.
   ═══════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    // ─── Lesson Metadata ───
    const LESSONS = {
        1: { title: 'Your Role & Authority', section: 'lesson1' },
        2: { title: 'Claims Policy', section: 'lesson2' },
        3: { title: 'What OPTKAS Sells', section: 'lesson3' },
        4: { title: 'Proof Pack Mastery', section: 'lesson4' },
        5: { title: 'Client Onboarding', section: 'lesson5' },
        6: { title: 'Legal Agreements', section: 'lesson6' },
        7: { title: 'Fee Structure', section: 'lesson7' },
        8: { title: 'Compensation & Conduct', section: 'lesson8' },
        9: { title: 'Risk Disclosures', section: 'lesson9' },
        10: { title: 'Final Certification', section: 'lesson10' }
    };

    // ─── Quiz Questions Per Lesson ───
    const QUIZZES = {
        1: [
            { q: 'What is your legal classification when working for OPTKAS?', opts: ['Financial advisor', 'Broker-dealer', 'Platform solicitor', 'Portfolio manager'], ans: 2 },
            { q: 'Which of the following CAN you do as a solicitor?', opts: ['Recommend specific investments', 'Describe platform architecture using verified facts', 'Provide tax advice', 'Guarantee returns'], ans: 1 },
            { q: 'When a prospect asks "Should I invest?", the correct response is:', opts: ['Yes, this is a great opportunity', 'I can show you the evidence and you should decide with your own counsel', 'It depends on your risk tolerance — here\'s my recommendation', 'Let me check with my manager'], ans: 1 },
            { q: 'Which statement is TRUE about your authority?', opts: ['You can modify agreement templates for special clients', 'You can interpret legal clauses if the client insists', 'You can only present verified materials and answer technical questions', 'You can discuss other clients\' investments as examples'], ans: 2 },
            { q: 'What must you include in your introduction to every prospect?', opts: ['Your personal investment history', 'A disclaimer that you are not a financial advisor', 'The expected return on investment', 'A comparison with competitor platforms'], ans: 1 }
        ],
        2: [
            { q: 'How many "buckets" classify all statements you make?', opts: ['Two', 'Three', 'Four', 'Five'], ans: 1 },
            { q: '"9 mainnet accounts are funded and operational" falls into which bucket?', opts: ['Forward-Looking Disclosure', 'Operational Process', 'Verified Fact', 'Forbidden Statement'], ans: 2 },
            { q: '"We aim to launch the primary offering by Q3" falls into which bucket?', opts: ['Verified Fact', 'Operational Process', 'Forward-Looking Disclosure', 'Approved Claim'], ans: 2 },
            { q: 'What happens if you state a Bucket 3 claim without the required risk disclosure?', opts: ['Nothing, if the client doesn\'t ask', 'Minor warning on first offense', 'Material misstatement — certification suspended', 'Retraining required'], ans: 2 },
            { q: '"Escrow uses crypto-condition release" is classified as:', opts: ['Verified Fact', 'Operational Process', 'Forward-Looking Disclosure', 'Forbidden Statement'], ans: 1 },
            { q: 'What test determines if a statement is Bucket 1?', opts: ['Can someone verify it right now without asking us?', 'Does it describe a future plan?', 'Is it in the marketing materials?', 'Has management approved it?'], ans: 0 }
        ],
        3: [
            { q: 'What does OPTKAS sell?', opts: ['Investment returns', 'Financial products', 'Platform infrastructure services', 'Banking services'], ans: 2 },
            { q: 'Which analogy best describes OPTKAS\'s product?', opts: ['We sell the cars on the highway', 'We sell the highway, not the cars', 'We sell the destination', 'We sell the fuel'], ans: 1 },
            { q: 'Which is a legitimate OPTKAS revenue source?', opts: ['Commission on investment returns', 'Volume-based bonuses', 'Platform service fees', 'Performance fees tied to bond outcomes'], ans: 2 },
            { q: 'OPTKAS is NOT which of the following?', opts: ['A capital markets platform', 'A blockchain-settled system', 'A bank that accepts deposits', 'An infrastructure provider'], ans: 2 },
            { q: 'When describing the product, you should focus on:', opts: ['Expected investment returns', 'The five-layer architecture and capabilities', 'Comparison with traditional banks', 'Limited time opportunity'], ans: 1 }
        ],
        4: [
            { q: 'What is the Proof Pack?', opts: ['Marketing brochures created by the sales team', 'The definitive evidence package supporting all OPTKAS claims', 'A summary of investment returns', 'Optional supporting documents'], ans: 1 },
            { q: 'How should you present legal documents from the Proof Pack?', opts: ['Paraphrase them in simpler language', 'Interpret key clauses for the client', 'Present them without editorializing and direct questions to counsel', 'Only share sections you think are relevant'], ans: 2 },
            { q: 'What must you check before every meeting?', opts: ['Market prices', 'That you have the current version of all documents', 'Competitor offerings', 'The client\'s net worth'], ans: 1 },
            { q: 'After delivering the Proof Pack, what must you log?', opts: ['Nothing — delivery is informal', 'What was shared, with whom, when, and via what channel', 'Only the client\'s response', 'The meeting duration'], ans: 1 },
            { q: 'The Verification Engine Report is described as:', opts: ['A static PDF updated quarterly', 'Live, self-service, timestamped readiness scores', 'An internal-only document', 'A marketing overview'], ans: 1 }
        ],
        5: [
            { q: 'How many steps are in the onboarding process?', opts: ['5', '6', '8', '10'], ans: 2 },
            { q: 'What is the minimum cooling-off period after Proof Pack delivery?', opts: ['No cooling-off required', '24 hours', '48 hours', '1 week'], ans: 2 },
            { q: 'During the cooling-off period, you should:', opts: ['Follow up daily to check interest', 'Not contact the prospect unless they initiate', 'Send additional marketing materials', 'Have a colleague reach out instead'], ans: 1 },
            { q: 'Step 7 (Compliance Verification) requires:', opts: ['Your personal approval', 'KYC/AML screening by the compliance team', 'The client\'s verbal confirmation', 'Nothing — it\'s automatic'], ans: 1 },
            { q: 'What happens immediately after compliance clears a prospect?', opts: ['Investment funds are collected', 'Trustlines are set and accounts are provisioned', 'The prospect receives trading access', 'Commission is paid to the solicitor'], ans: 1 }
        ],
        6: [
            { q: 'Which document discloses YOUR compensation arrangement to the prospect?', opts: ['Risk Disclosure Statement', 'Participation Agreement', 'Solicitor Disclosure Form', 'KYC/AML Documentation'], ans: 2 },
            { q: 'When a client asks "Can you explain this clause?", you should:', opts: ['Explain it in your own words', 'Skip over it and move on', 'Direct them to review it with their legal counsel', 'Tell them it\'s standard and not important'], ans: 2 },
            { q: 'Can you modify a legal agreement template for a special client?', opts: ['Yes, if they request it', 'Yes, for VIP clients only', 'Never — templates are approved as-is', 'Only with manager approval'], ans: 2 },
            { q: 'The Risk Disclosure Statement must be:', opts: ['Briefly mentioned', 'Optional for sophisticated investors', 'Walked through with each risk category acknowledged', 'Sent by email without discussion'], ans: 2 },
            { q: 'When must the Solicitor Disclosure Form be provided?', opts: ['After the agreement is signed', 'Before any agreement is signed', 'Only if the client asks', 'At the first meeting'], ans: 1 }
        ],
        7: [
            { q: 'What type of fee is charged for account provisioning and compliance processing?', opts: ['Platform Service Fee', 'Trading Fee', 'Onboarding Fee', 'Success Fee'], ans: 2 },
            { q: 'AMM Trading Fees are:', opts: ['Charged directly to participants', 'Earned as platform revenue from liquidity pool operations', 'Hidden fees not disclosed to clients', 'Commission-based fees'], ans: 1 },
            { q: 'When handling the objection "Why should I pay these fees?", you should:', opts: ['Explain that fees are worth it due to the investment returns', 'Describe the infrastructure the fees cover and let them decide', 'Offer a discount', 'Compare fees to competitors'], ans: 1 },
            { q: 'Which of these is FORBIDDEN when discussing fees?', opts: ['Explaining what each fee covers', 'Listing all fee categories', 'Saying "You\'ll make it back quickly"', 'Directing them to the Participation Agreement'], ans: 2 },
            { q: 'Where are all fee details disclosed?', opts: ['In conversation only', 'On the website', 'In the Participation Agreement before signing', 'After the client has invested'], ans: 2 }
        ],
        8: [
            { q: 'Your compensation is NEVER linked to:', opts: ['Onboarding fees', 'Platform service fees', 'Investment performance or returns', 'Training completions'], ans: 2 },
            { q: 'Which is an immediate disqualification trigger?', opts: ['Missing a team meeting', 'Using a Forbidden Statement (F-01 through F-12)', 'Having a client decline to invest', 'Needing retraining on a quiz'], ans: 1 },
            { q: 'Every client interaction must be documented with:', opts: ['A selfie as proof', 'Date, participants, topics discussed, materials shared, and compliance checkbox', 'Only a summary email', 'Nothing — verbal interactions don\'t need documentation'], ans: 1 },
            { q: 'Volume-based bonuses are:', opts: ['Available for top performers', 'Offered quarterly', 'Absolutely prohibited', 'Available with manager approval'], ans: 2 },
            { q: 'Undisclosed referral fees are:', opts: ['Acceptable for external partners', 'Common industry practice', 'Prohibited — all referral arrangements must be documented and disclosed', 'Only needed above $10,000'], ans: 2 }
        ],
        9: [
            { q: 'How many material risk categories must be disclosed?', opts: ['3', '5', '7', '10'], ans: 2 },
            { q: 'The "Total Loss Risk" disclosure must state:', opts: ['"Your money is protected by our insurance"', '"You could lose your entire investment"', '"Losses are unlikely but possible"', '"We guarantee your principal"'], ans: 1 },
            { q: 'The A.R.E. protocol stands for:', opts: ['Accept, Reject, Explain', 'Acknowledge, Reframe, Evidence', 'Analyze, Respond, Educate', 'Agree, Redirect, End'], ans: 1 },
            { q: 'When you don\'t know the answer to a question, you should:', opts: ['Make your best guess', 'Change the subject', 'Say "I don\'t have that information documented — let me get you a precise answer"', 'Tell the client it\'s confidential'], ans: 2 },
            { q: 'Which risk category covers the possibility that laws may change?', opts: ['Market Risk', 'Credit Risk', 'Regulatory Risk', 'Technology Risk'], ans: 2 },
            { q: 'When a prospect says "How do I know my money is safe?", the FIRST step in A.R.E. is:', opts: ['Show evidence immediately', 'Acknowledge: "That\'s the most important question you can ask"', 'Deflect to another topic', 'Provide a guarantee'], ans: 1 }
        ]
    };

    // ─── Final Exam Questions (50) ───
    const EXAM_QUESTIONS = [
        // Section A: Role & Identity (10 questions)
        { q: 'Your legal classification when working for OPTKAS is:', opts: ['Independent contractor', 'Platform solicitor', 'Investment advisor', 'Broker-dealer representative'], ans: 1, section: 'role' },
        { q: 'You are authorized to:', opts: ['Make investment recommendations', 'Present verified facts about the platform', 'Guarantee investment outcomes', 'Interpret legal documents'], ans: 1, section: 'role' },
        { q: 'If a prospect asks for your personal recommendation, you should:', opts: ['Give it informally', 'Decline and direct them to independent counsel', 'Recommend based on their profile', 'Escalate to your manager for the recommendation'], ans: 1, section: 'role' },
        { q: 'OPTKAS is best described as:', opts: ['A bank', 'A broker-dealer', 'A capital markets infrastructure platform', 'An investment fund'], ans: 2, section: 'role' },
        { q: 'The "Three Buckets" rule requires you to:', opts: ['Categorize every statement before making it', 'Use three different sales pitches', 'Make three follow-up calls', 'Present three investment options'], ans: 0, section: 'role' },
        { q: 'A Bucket 1 (Verified Fact) can be confirmed by:', opts: ['Management assertion', 'Sales team consensus', 'On-chain data, legal filings, or third-party records', 'Client testimonials'], ans: 2, section: 'role' },
        { q: 'Bucket 3 (Forward-Looking) statements MUST be accompanied by:', opts: ['Manager approval', 'Risk disclosures', 'Written client consent', 'Board resolution'], ans: 1, section: 'role' },
        { q: 'If you state a Bucket 3 claim without risk disclosure, this is:', opts: ['Acceptable for sophisticated investors', 'A minor infraction', 'A material misstatement resulting in certification suspension', 'Only a problem if the client complains'], ans: 2, section: 'role' },
        { q: 'The product you are selling is:', opts: ['Investment returns', 'Platform infrastructure and services', 'Financial products', 'Banking services'], ans: 1, section: 'role' },
        { q: 'Your introduction to every prospect must include:', opts: ['Your investment track record', 'A statement that you are not a financial advisor', 'The expected rate of return', 'Comparison with competing platforms'], ans: 1, section: 'role' },

        // Section B: Claims & Compliance (10 questions)
        { q: '"OPTKAS has 134 documented capabilities across 5 layers" is:', opts: ['A forward-looking claim', 'An operational process', 'A verified fact', 'A forbidden statement'], ans: 2, section: 'claims' },
        { q: '"The bond carries a 5% coupon rate" requires which disclosure?', opts: ['No disclosure needed', '"Coupon payments are subject to issuer performance"', '"Returns are guaranteed by insurance"', '"This rate has been steady for years"'], ans: 1, section: 'claims' },
        { q: 'The Proof Pack is:', opts: ['Marketing materials you create yourself', 'The definitive evidence package supporting OPTKAS claims', 'Optional reference material', 'Internal documents not shared with prospects'], ans: 1, section: 'claims' },
        { q: 'Before every meeting you must:', opts: ['Prepare your own presentation', 'Verify you have current versions of all Proof Pack documents', 'Research the client\'s portfolio', 'Set investment targets'], ans: 1, section: 'claims' },
        { q: 'The A.R.E. objection protocol is:', opts: ['Accept, Reject, Explain', 'Acknowledge, Reframe, Evidence', 'Agree, Redirect, End', 'Ask, Respond, Evaluate'], ans: 1, section: 'claims' },
        { q: 'How many material risk categories must be disclosed?', opts: ['3', '5', '7', '10'], ans: 2, section: 'claims' },
        { q: 'When you don\'t know an answer, you should:', opts: ['Provide your best estimate', 'Admit you don\'t know and promise to get the precise answer', 'Change the subject', 'Refer to the FAQ'], ans: 1, section: 'claims' },
        { q: 'All client interactions must be documented with:', opts: ['Just a follow-up email', 'Date, participants, topics, materials shared, questions, and compliance checkbox', 'Only if the client requests it', 'A brief text message summary'], ans: 1, section: 'claims' },
        { q: 'The minimum cooling-off period after Proof Pack delivery is:', opts: ['24 hours', '48 hours', '72 hours', 'No minimum'], ans: 1, section: 'claims' },
        { q: 'Your compensation is structured around:', opts: ['Commission on investment returns', 'Onboarding fee share and platform service share', 'Volume-based bonuses', 'Performance fees'], ans: 1, section: 'claims' },

        // Section C: Forbidden Statements (10 questions — 90% required)
        { q: 'Is this statement allowed? "Guaranteed returns of 5%"', opts: ['Yes — it\'s a verified fact', 'Yes — if the client is accredited', 'No — no return is guaranteed; 5% is a coupon rate, not a guarantee', 'Yes — the bond carries a 5% coupon'], ans: 2, section: 'forbidden' },
        { q: 'Is this statement allowed? "This investment is risk-free"', opts: ['Yes — over-collateralization eliminates risk', 'No — all investments carry risk', 'Yes — for accredited investors only', 'Yes — with a disclosure'], ans: 1, section: 'forbidden' },
        { q: 'Is this statement allowed? "OPTKAS is SEC approved"', opts: ['Yes — we have CUSIP identifiers', 'Yes — we have a transfer agent', 'No — OPTKAS has not received SEC approval or registration', 'Yes — it\'s in the process'], ans: 2, section: 'forbidden' },
        { q: 'Is this statement allowed? "You can\'t lose money"', opts: ['No — investors can lose their entire investment', 'Yes — with 250% over-collateralization', 'Yes — insurance protects the investment', 'Yes — for small investments'], ans: 0, section: 'forbidden' },
        { q: 'Is this statement allowed? "Get in early — this is a limited opportunity"', opts: ['Yes — it creates appropriate urgency', 'No — urgency tactics are manipulative and prohibited', 'Yes — if said casually', 'Yes — for VIP prospects only'], ans: 1, section: 'forbidden' },
        { q: 'Is this statement allowed? "Tokens will increase in value"', opts: ['Yes — based on market analysis', 'Yes — it\'s an operational process description', 'No — price appreciation predictions are speculative and prohibited', 'Yes — with a disclosure'], ans: 2, section: 'forbidden' },
        { q: 'Is this statement allowed? "We\'re fully regulated"', opts: ['Yes — we operate under Wyoming law', 'No — the regulatory pathway is in progress, licensing is not complete', 'Yes — we have a qualified transfer agent', 'Yes — with a footnote'], ans: 1, section: 'forbidden' },
        { q: 'Is this statement allowed? "Your money is FDIC insured"', opts: ['Yes — we have insurance', 'No — OPTKAS is not FDIC insured', 'Yes — the custodian provides FDIC coverage', 'Yes — for deposits under $250,000'], ans: 1, section: 'forbidden' },
        { q: 'Is this statement allowed? "Similar to Blackstone in performance"', opts: ['Yes — we use similar analytics', 'No — implying equivalence with established firms is misleading', 'Yes — if you add "at a different scale"', 'Yes — it\'s a factual comparison'], ans: 1, section: 'forbidden' },
        { q: 'Is this statement allowed? "Better than putting money in a bank"', opts: ['Yes — blockchain is more modern', 'Yes — it\'s a common comparison', 'No — OPTKAS is not a bank and comparative superiority claims are prohibited', 'Yes — with appropriate context'], ans: 2, section: 'forbidden' },

        // Section D: Process & Operations (10 questions)
        { q: 'How many steps are in the client onboarding process?', opts: ['5', '6', '8', '10'], ans: 2, section: 'process' },
        { q: 'Step 4 of onboarding requires:', opts: ['Collecting payment', 'Walking through the Risk Disclosure Statement', 'Sending marketing materials', 'Setting up a trading account'], ans: 1, section: 'process' },
        { q: 'During the cooling-off period, you may contact the prospect if:', opts: ['You have new information', 'Your manager asks you to', 'The prospect initiates contact', 'It has been more than 24 hours'], ans: 2, section: 'process' },
        { q: 'The Solicitor Disclosure Form must be provided:', opts: ['After the agreement is signed', 'Before any agreement is signed', 'Only for institutional clients', 'When the client asks for it'], ans: 1, section: 'process' },
        { q: 'After compliance clears a prospect, the next step is:', opts: ['Collecting additional fees', 'Wallet provisioning and trustline setup', 'Scheduling a follow-up in 30 days', 'Sending a welcome email'], ans: 1, section: 'process' },
        { q: 'Proof Pack documents are version-controlled because:', opts: ['It looks more professional', 'Old versions may contain outdated or incorrect information', 'Clients prefer numbered versions', 'Legal requires it for formatting'], ans: 1, section: 'process' },
        { q: 'Which is NOT a legitimate compensation source for solicitors?', opts: ['Onboarding fee share', 'Platform service share', 'Volume-based bonus for hitting targets', 'Training completion bonus'], ans: 2, section: 'process' },
        { q: 'An immediate disqualification trigger is:', opts: ['A client declining to invest', 'Missing one team meeting', 'Using any Forbidden Statement (F-01 through F-12)', 'Failing a quiz on the first attempt'], ans: 2, section: 'process' },
        { q: 'The compliance checkbox on interaction logs confirms:', opts: ['The meeting happened', 'All statements made were within approved claims', 'The client is satisfied', 'Follow-up is scheduled'], ans: 1, section: 'process' },
        { q: 'How many documents are in the Proof Pack?', opts: ['5', '6', '8', '10'], ans: 2, section: 'process' },

        // Section E: Risk & Ethics (10 questions)
        { q: 'Total Loss Risk disclosure must state:', opts: ['"Losses are very unlikely"', '"Insurance covers all losses"', '"You could lose your entire investment"', '"Historical performance prevents total loss"'], ans: 2, section: 'ethics' },
        { q: 'Regulatory Risk means:', opts: ['The platform may lose its license', 'Laws and regulations may change affecting operations', 'Regulators will shut down the platform', 'The platform must register as a bank'], ans: 1, section: 'ethics' },
        { q: 'When handling the question "How do I know my money is safe?", the correct first step is:', opts: ['Show evidence immediately', 'Provide a guarantee', 'Acknowledge: "That\'s the most important question"', 'Deflect to your manager'], ans: 2, section: 'ethics' },
        { q: 'Certification expires every:', opts: ['30 days', '60 days', '90 days', '365 days'], ans: 2, section: 'ethics' },
        { q: 'The readiness gate requires a minimum overall verification score of:', opts: ['50', '65', '75', '90'], ans: 2, section: 'ethics' },
        { q: 'If Legal domain verification score drops below 70, you should:', opts: ['Continue selling as normal', 'Suspend all sales outreach', 'Report it to management only', 'Ignore it until the next review'], ans: 1, section: 'ethics' },
        { q: '"Law is Layer 1" means:', opts: ['Legal work comes first chronologically', 'Everything — custody, automation, settlement — sits on top of legal structure', 'Lawyers run the platform', 'Legal compliance is optional'], ans: 1, section: 'ethics' },
        { q: 'Over-collateralization at 250% means:', opts: ['Guaranteed returns of 250%', 'Collateral value is 2.5x the obligation amount', 'The investment can grow 250%', 'You are protected up to $250,000'], ans: 1, section: 'ethics' },
        { q: 'Personal investment solicitation through your solicitor role is:', opts: ['Allowed for small amounts', 'Allowed with disclosure', 'Absolutely prohibited', 'Allowed with manager approval'], ans: 2, section: 'ethics' },
        { q: 'The retake waiting period for the final exam is:', opts: ['No waiting period', '4 hours', '24 hours', '7 days'], ans: 2, section: 'ethics' }
    ];

    const STORAGE_KEY = 'optkas_sales_academy_state';
    const CERT_DURATION_DAYS = 90;
    const EXAM_PASS_THRESHOLD = 0.85;        // 85% overall
    const FORBIDDEN_PASS_THRESHOLD = 0.90;   // 90% on forbidden section
    const LESSON_PASS_THRESHOLD = 0.70;      // 70% per lesson quiz
    const EXAM_TIME_LIMIT = 60 * 60 * 1000;  // 60 minutes

    // ─── State ───
    let state = loadState();
    let examTimer = null;

    // ─── Section Navigation ───
    const sectionOrder = ['dashboard', 'claims-library',
        'lesson1', 'lesson2', 'lesson3', 'lesson4', 'lesson5',
        'lesson6', 'lesson7', 'lesson8', 'lesson9', 'lesson10'];

    window.navigateTo = function (sectionId) {
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(sectionId);
        if (target) target.classList.add('active');

        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
        if (activeLink) activeLink.classList.add('active');

        const content = document.getElementById('content');
        if (content) content.scrollTop = 0;
    };

    // ─── Audio Controls ───
    let audioVisible = false;
    window.playAudio = function (lessonNum) {
        const audio = document.getElementById('audio' + lessonNum);
        if (audio) audio.play();
    };
    window.pauseAudio = function (lessonNum) {
        const audio = document.getElementById('audio' + lessonNum);
        if (audio) audio.pause();
    };

    // ─── Attestation Handling ───
    window.handleAttestation = function (lessonNum, checked) {
        if (!state.attestations) state.attestations = {};
        state.attestations[lessonNum] = checked;
        const block = document.getElementById('attest' + lessonNum);
        if (block) {
            if (checked) block.classList.add('signed');
            else block.classList.remove('signed');
        }
        saveState();
        updateProgress();
    };

    // ─── Quiz Rendering ───
    function renderQuiz(lessonNum) {
        const container = document.getElementById('quizBody' + lessonNum);
        if (!container || !QUIZZES[lessonNum]) return;

        const questions = QUIZZES[lessonNum];
        let html = '';
        questions.forEach((q, i) => {
            const qId = `L${lessonNum}Q${i}`;
            html += `<div class="quiz-question" data-qid="${qId}">
                <div class="quiz-q-header">
                    <span class="quiz-q-num">Q${i + 1}</span>
                    <span class="quiz-q-text">${q.q}</span>
                </div>
                <div class="quiz-options">`;
            q.opts.forEach((opt, oi) => {
                html += `<div class="quiz-option" data-opt="${oi}">
                    <input type="radio" name="${qId}" id="${qId}_${oi}" value="${oi}">
                    <label for="${qId}_${oi}">${opt}</label>
                </div>`;
            });
            html += `</div></div>`;
        });
        container.innerHTML = html;

        // Restore previous answers if quiz was already taken
        if (state.quizAnswers && state.quizAnswers[lessonNum]) {
            const prev = state.quizAnswers[lessonNum];
            Object.entries(prev).forEach(([qIdx, val]) => {
                const radio = document.getElementById(`L${lessonNum}Q${qIdx}_${val}`);
                if (radio) radio.checked = true;
            });
        }

        // If already passed, show result and disable
        if (state.quizResults && state.quizResults[lessonNum]) {
            showQuizResult(lessonNum);
        }
    }

    // ─── Quiz Submission ───
    window.submitQuiz = function (lessonNum) {
        const questions = QUIZZES[lessonNum];
        if (!questions) return;

        if (!state.quizAnswers) state.quizAnswers = {};
        state.quizAnswers[lessonNum] = {};

        let correct = 0;
        questions.forEach((q, i) => {
            const qId = `L${lessonNum}Q${i}`;
            const selected = document.querySelector(`input[name="${qId}"]:checked`);
            const selectedVal = selected ? parseInt(selected.value) : -1;
            state.quizAnswers[lessonNum][i] = selectedVal;

            // Mark correct/incorrect
            const options = document.querySelectorAll(`.quiz-question[data-qid="${qId}"] .quiz-option`);
            options.forEach((opt, oi) => {
                opt.classList.remove('correct', 'incorrect');
                if (oi === q.ans) opt.classList.add('correct');
                else if (oi === selectedVal && selectedVal !== q.ans) opt.classList.add('incorrect');
            });

            if (selectedVal === q.ans) correct++;
        });

        const score = correct / questions.length;
        const passed = score >= LESSON_PASS_THRESHOLD;

        if (!state.quizResults) state.quizResults = {};
        state.quizResults[lessonNum] = { score: Math.round(score * 100), passed, correct, total: questions.length };

        saveState();
        showQuizResult(lessonNum);
        updateProgress();
    };

    function showQuizResult(lessonNum) {
        const result = state.quizResults[lessonNum];
        if (!result) return;
        const el = document.getElementById('quizResult' + lessonNum);
        const btn = document.getElementById('quizSubmit' + lessonNum);
        if (el) {
            el.textContent = `${result.correct}/${result.total} (${result.score}%) — ${result.passed ? 'PASSED' : 'FAILED'}`;
            el.className = 'quiz-result ' + (result.passed ? 'pass' : 'fail');
        }
        if (btn && result.passed) {
            btn.disabled = true;
            btn.textContent = 'Quiz Passed ✓';
        }
    }

    // ─── Final Exam ───
    window.startExam = function () {
        // Check prerequisites
        const allLessonsPassed = checkAllLessonsPassed();
        if (!allLessonsPassed) {
            alert('You must pass all 9 lesson quizzes and sign all attestations before starting the final exam.');
            return;
        }

        // Check retake cooldown
        if (state.lastExamAttempt) {
            const elapsed = Date.now() - state.lastExamAttempt;
            const cooldown = 24 * 60 * 60 * 1000; // 24 hours
            if (elapsed < cooldown && !state.examPassed) {
                const remaining = Math.ceil((cooldown - elapsed) / (60 * 60 * 1000));
                alert(`Retake cooldown active. Please wait ${remaining} hour(s) before retaking the exam.`);
                return;
            }
        }

        // Render the exam
        renderExam();

        // Start timer
        state.examStartTime = Date.now();
        saveState();
        startExamTimer();

        // Show/hide buttons
        document.getElementById('examStartBtn').style.display = 'none';
        document.getElementById('quizSubmit10').style.display = '';
        document.getElementById('examTimer').style.display = '';
    };

    function renderExam() {
        const container = document.getElementById('quizBody10');
        if (!container) return;

        // Shuffle questions for each attempt (but deterministic within session)
        const shuffled = [...EXAM_QUESTIONS];

        let html = '';
        shuffled.forEach((q, i) => {
            const qId = `EQ${i}`;
            const sectionTag = q.section === 'forbidden' ?
                '<span style="color:#ef4444;font-size:10px;margin-left:8px;">[FORBIDDEN SECTION]</span>' : '';
            html += `<div class="quiz-question" data-qid="${qId}" data-section="${q.section}">
                <div class="quiz-q-header">
                    <span class="quiz-q-num">Q${i + 1}</span>
                    <span class="quiz-q-text">${q.q}${sectionTag}</span>
                </div>
                <div class="quiz-options">`;
            q.opts.forEach((opt, oi) => {
                html += `<div class="quiz-option" data-opt="${oi}">
                    <input type="radio" name="${qId}" id="${qId}_${oi}" value="${oi}">
                    <label for="${qId}_${oi}">${opt}</label>
                </div>`;
            });
            html += `</div></div>`;
        });
        container.innerHTML = html;
    }

    function startExamTimer() {
        const timerEl = document.getElementById('timerText');
        if (!timerEl) return;

        examTimer = setInterval(function () {
            const elapsed = Date.now() - state.examStartTime;
            const remaining = Math.max(0, EXAM_TIME_LIMIT - elapsed);
            const mins = Math.floor(remaining / 60000);
            const secs = Math.floor((remaining % 60000) / 1000);
            timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

            if (remaining <= 5 * 60 * 1000) timerEl.classList.add('warning');
            if (remaining <= 0) {
                clearInterval(examTimer);
                submitExam();
            }
        }, 1000);
    }

    window.submitExam = function () {
        if (examTimer) clearInterval(examTimer);

        const questions = EXAM_QUESTIONS;
        let totalCorrect = 0;
        let forbiddenCorrect = 0;
        let forbiddenTotal = 0;

        questions.forEach((q, i) => {
            const qId = `EQ${i}`;
            const selected = document.querySelector(`input[name="${qId}"]:checked`);
            const selectedVal = selected ? parseInt(selected.value) : -1;

            const options = document.querySelectorAll(`.quiz-question[data-qid="${qId}"] .quiz-option`);
            options.forEach((opt, oi) => {
                opt.classList.remove('correct', 'incorrect');
                if (oi === q.ans) opt.classList.add('correct');
                else if (oi === selectedVal && selectedVal !== q.ans) opt.classList.add('incorrect');
            });

            if (selectedVal === q.ans) {
                totalCorrect++;
                if (q.section === 'forbidden') forbiddenCorrect++;
            }

            if (q.section === 'forbidden') forbiddenTotal++;
        });

        const overallScore = totalCorrect / questions.length;
        const forbiddenScore = forbiddenTotal > 0 ? forbiddenCorrect / forbiddenTotal : 0;
        const overallPassed = overallScore >= EXAM_PASS_THRESHOLD;
        const forbiddenPassed = forbiddenScore >= FORBIDDEN_PASS_THRESHOLD;
        const passed = overallPassed && forbiddenPassed;

        state.examResult = {
            score: Math.round(overallScore * 100),
            forbiddenScore: Math.round(forbiddenScore * 100),
            correct: totalCorrect,
            total: questions.length,
            forbiddenCorrect,
            forbiddenTotal,
            passed,
            date: Date.now()
        };
        state.lastExamAttempt = Date.now();
        state.examPassed = passed;

        if (passed) {
            state.certificationDate = Date.now();
            state.certificationExpiry = Date.now() + (CERT_DURATION_DAYS * 24 * 60 * 60 * 1000);
        }

        saveState();

        const el = document.getElementById('quizResult10');
        const btn = document.getElementById('quizSubmit10');
        if (el) {
            let resultText = `Overall: ${totalCorrect}/${questions.length} (${state.examResult.score}%) — `;
            resultText += `Forbidden: ${forbiddenCorrect}/${forbiddenTotal} (${state.examResult.forbiddenScore}%) — `;
            resultText += passed ? 'CERTIFIED ✓' : 'NOT PASSED';
            el.textContent = resultText;
            el.className = 'quiz-result ' + (passed ? 'pass' : 'fail');
        }
        if (btn) {
            btn.disabled = true;
            btn.textContent = passed ? 'Exam Passed ✓' : 'Exam Completed — Retake in 24h';
        }

        updateProgress();
    };

    // ─── Progress & Certification ───
    function checkAllLessonsPassed() {
        for (let i = 1; i <= 9; i++) {
            if (!state.quizResults || !state.quizResults[i] || !state.quizResults[i].passed) return false;
            if (!state.attestations || !state.attestations[i]) return false;
        }
        return true;
    }

    function updateProgress() {
        let completedLessons = 0;
        let totalScore = 0;
        let scoredLessons = 0;

        for (let i = 1; i <= 9; i++) {
            const quizPassed = state.quizResults && state.quizResults[i] && state.quizResults[i].passed;
            const attested = state.attestations && state.attestations[i];
            const lessonCompleted = quizPassed && attested;

            if (lessonCompleted) completedLessons++;
            if (state.quizResults && state.quizResults[i]) {
                totalScore += state.quizResults[i].score;
                scoredLessons++;
            }

            // Update nav status
            const navStatus = document.getElementById('navStatus' + i);
            if (navStatus) {
                if (lessonCompleted) { navStatus.textContent = '✓'; navStatus.style.color = '#10b981'; }
                else if (quizPassed) { navStatus.textContent = '◐'; navStatus.style.color = '#f59e0b'; }
                else if (state.quizResults && state.quizResults[i]) { navStatus.textContent = '✗'; navStatus.style.color = '#ef4444'; }
                else { navStatus.textContent = '○'; navStatus.style.color = ''; }
            }

            // Update nav link completed class
            const navLink = document.querySelector(`.nav-link[data-section="lesson${i}"]`);
            if (navLink) {
                if (lessonCompleted) navLink.classList.add('completed');
                else navLink.classList.remove('completed');
            }
        }

        // Exam
        if (state.examPassed) completedLessons++; // Count exam as lesson 10
        const navStatus10 = document.getElementById('navStatus10');
        if (navStatus10) {
            if (state.examPassed) { navStatus10.textContent = '✓'; navStatus10.style.color = '#10b981'; }
            else if (state.examResult) { navStatus10.textContent = '✗'; navStatus10.style.color = '#ef4444'; }
            else { navStatus10.textContent = '○'; }
        }

        // Progress bar
        const progressPct = (completedLessons / 10) * 100;
        const pFill = document.getElementById('progressFill');
        const pText = document.getElementById('progressText');
        if (pFill) pFill.style.width = progressPct + '%';
        if (pText) pText.textContent = `${completedLessons} / 10 lessons completed`;

        // Score ring
        updateScoreRing(progressPct);

        // Lesson grid on dashboard
        renderLessonGrid();

        // Certification card
        updateCertCard(completedLessons, scoredLessons, totalScore);

        // Readiness gate
        updateReadinessGate();

        // Exam readiness
        updateExamReadiness();

        // Misstatement Risk
        updateMisstateRisk();
    }

    function updateScoreRing(pct) {
        const ringFill = document.getElementById('certRingFill');
        const ringText = document.getElementById('certRingText');
        const gradeLabel = document.getElementById('certStatusLabel');

        if (ringFill) {
            const circumference = 2 * Math.PI * 52;
            const offset = circumference * (1 - pct / 100);
            ringFill.style.strokeDashoffset = offset;
            ringFill.style.stroke = pct >= 100 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';
        }
        if (ringText) ringText.textContent = Math.round(pct);
        if (gradeLabel) {
            if (state.examPassed && !isCertExpired()) {
                gradeLabel.textContent = 'CERTIFIED';
                gradeLabel.style.color = '#10b981';
            } else if (pct >= 90) {
                gradeLabel.textContent = 'ALMOST THERE';
                gradeLabel.style.color = '#f59e0b';
            } else if (pct > 0) {
                gradeLabel.textContent = 'IN PROGRESS';
                gradeLabel.style.color = '#f59e0b';
            } else {
                gradeLabel.textContent = 'NOT STARTED';
                gradeLabel.style.color = '';
            }
        }
    }

    function renderLessonGrid() {
        const grid = document.getElementById('lessonGrid');
        if (!grid) return;

        let html = '';
        for (let i = 1; i <= 10; i++) {
            const title = LESSONS[i].title;
            const quizPassed = state.quizResults && state.quizResults[i] && state.quizResults[i].passed;
            const attested = state.attestations && state.attestations[i];
            const completed = i === 10 ? state.examPassed : (quizPassed && attested);
            const failed = state.quizResults && state.quizResults[i] && !state.quizResults[i].passed;
            const score = state.quizResults && state.quizResults[i] ? state.quizResults[i].score + '%' :
                          (i === 10 && state.examResult ? state.examResult.score + '%' : '—');

            html += `<div class="lesson-card ${completed ? 'completed' : ''} ${failed && !completed ? 'failed' : ''}" 
                          onclick="navigateTo('${LESSONS[i].section}')">
                <div class="lesson-card-num">${String(i).padStart(2, '0')}</div>
                <div class="lesson-card-title">${title}</div>
                <div class="lesson-card-score">${score}</div>
            </div>`;
        }
        grid.innerHTML = html;
    }

    function updateCertCard(completedLessons, scoredLessons, totalScore) {
        const card = document.getElementById('certCard');
        if (!card) return;

        const certified = state.examPassed && !isCertExpired();
        if (certified) {
            card.classList.add('certified');
        } else {
            card.classList.remove('certified');
        }

        const badgeIcon = document.getElementById('certBadge')?.querySelector('.cert-badge-icon');
        const badgeText = document.getElementById('certBadge')?.querySelector('.cert-badge-text');
        if (badgeIcon) badgeIcon.textContent = certified ? '🏆' : '🔒';
        if (badgeText) badgeText.textContent = certified ? 'CERTIFIED SOLICITOR' : 'NOT CERTIFIED';

        const lessonsEl = document.getElementById('certLessons');
        const quizAvgEl = document.getElementById('certQuizAvg');
        const examEl = document.getElementById('certExamScore');
        const forbiddenEl = document.getElementById('certForbiddenScore');
        const gateEl = document.getElementById('certGateStatus');
        const expiryEl = document.getElementById('certExpiry');

        if (lessonsEl) lessonsEl.textContent = `${completedLessons} / 10`;
        if (quizAvgEl) quizAvgEl.textContent = scoredLessons > 0 ? Math.round(totalScore / scoredLessons) + '%' : '—';
        if (examEl) examEl.textContent = state.examResult ? `${state.examResult.score}% (${state.examResult.passed ? 'PASSED' : 'FAILED'})` : '—';
        if (forbiddenEl) forbiddenEl.textContent = state.examResult ? `${state.examResult.forbiddenScore}% (${state.examResult.forbiddenScore >= 90 ? 'PASSED' : 'FAILED'})` : '—';

        if (examEl) examEl.style.color = state.examResult ? (state.examResult.passed ? '#10b981' : '#ef4444') : '';
        if (forbiddenEl) forbiddenEl.style.color = state.examResult ? (state.examResult.forbiddenScore >= 90 ? '#10b981' : '#ef4444') : '';

        // Readiness gate status
        const gateStatus = checkReadinessGate();
        if (gateEl) {
            gateEl.innerHTML = gateStatus.passed ?
                '<span style="color:#10b981;">🟢 All Gates Passed</span>' :
                '<span style="color:#ef4444;">🔴 Not Met</span>';
        }

        if (expiryEl) {
            if (state.certificationExpiry && !isCertExpired()) {
                const expDate = new Date(state.certificationExpiry);
                const daysLeft = Math.ceil((state.certificationExpiry - Date.now()) / (24 * 60 * 60 * 1000));
                expiryEl.textContent = `${expDate.toLocaleDateString()} (${daysLeft} days)`;
                expiryEl.style.color = daysLeft <= 14 ? '#ef4444' : daysLeft <= 30 ? '#f59e0b' : '#10b981';
            } else if (isCertExpired()) {
                expiryEl.textContent = 'EXPIRED — Recertify';
                expiryEl.style.color = '#ef4444';
            } else {
                expiryEl.textContent = '—';
            }
        }
    }

    function isCertExpired() {
        return state.certificationExpiry && Date.now() > state.certificationExpiry;
    }

    // ─── Readiness Gate ───
    function checkReadinessGate() {
        // Try to read from the verification engine's localStorage
        let verificationState = null;
        try {
            const vs = localStorage.getItem('optkas_verification_state');
            if (vs) verificationState = JSON.parse(vs);
        } catch (e) { /* ignore */ }

        const checks = {
            overall: false,
            legal: false,
            security: false,
            cert: state.examPassed && !isCertExpired()
        };

        if (verificationState && verificationState.assessments) {
            // Calculate domain scores from verification state
            const domains = {
                A: ['A1','A2','A3','A4','A5','A6','A7','A8','A9'],
                B: ['B1','B2','B3','B4','B5','B6','B7','B8'],
                C: ['C1','C2','C3','C4','C5','C6'],
                D: ['D1','D2','D3','D4','D5','D6'],
                E: ['E1','E2','E3','E4','E5','E6'],
                F: ['F1','F2','F3','F4','F5']
            };
            const scoreVals = { green: 100, yellow: 60, red: 20 };

            let totalScore = 0, totalDomains = 0;
            let legalScore = 0, legalCount = 0;
            let hasRedSecurity = false;

            for (const [domKey, claims] of Object.entries(domains)) {
                let domScore = 0, domCount = 0;
                for (const c of claims) {
                    const val = verificationState.assessments[c];
                    if (val) {
                        domScore += scoreVals[val] || 0;
                        domCount++;
                        if (domKey === 'F' && val === 'red') hasRedSecurity = true;
                    }
                }
                if (domCount > 0) {
                    const avg = domScore / domCount;
                    totalScore += avg;
                    totalDomains++;
                    if (domKey === 'D') { legalScore = avg; legalCount = domCount; }
                }
            }

            const overallScore = totalDomains > 0 ? totalScore / totalDomains : 0;
            checks.overall = overallScore >= 75;
            checks.legal = legalScore >= 70;
            checks.security = !hasRedSecurity;
        }

        checks.passed = checks.overall && checks.legal && checks.security && checks.cert;
        return checks;
    }

    function updateReadinessGate() {
        const checks = checkReadinessGate();

        ['overall', 'legal', 'security', 'cert'].forEach(key => {
            const el = document.getElementById('gate' + key.charAt(0).toUpperCase() + key.slice(1));
            if (!el) return;
            if (key === 'cert') {
                const gateEl = document.getElementById('gateCert');
                if (gateEl) {
                    gateEl.className = 'gate-check' + (checks.cert ? ' passed' : '');
                    gateEl.querySelector('.gate-icon').textContent = checks.cert ? '☑' : '☐';
                }
                return;
            }
            el.className = 'gate-check' + (checks[key] ? ' passed' : '');
            el.querySelector('.gate-icon').textContent = checks[key] ? '☑' : '☐';
        });
    }

    function updateExamReadiness() {
        const container = document.getElementById('examReadiness');
        if (!container) return;

        let html = '';
        const allPassed = checkAllLessonsPassed();
        const lessonCount = Object.keys(state.quizResults || {}).filter(k => state.quizResults[k].passed && parseInt(k) <= 9).length;
        const attestCount = Object.keys(state.attestations || {}).filter(k => state.attestations[k] && parseInt(k) <= 9).length;

        html += `<div class="readiness-item ${lessonCount >= 9 ? 'ready' : 'not-ready'}">
            <div class="readiness-item-icon">${lessonCount >= 9 ? '✅' : '❌'}</div>
            <div class="readiness-item-label">Quizzes Passed</div>
            <div class="readiness-item-value">${lessonCount} / 9</div>
        </div>`;
        html += `<div class="readiness-item ${attestCount >= 9 ? 'ready' : 'not-ready'}">
            <div class="readiness-item-icon">${attestCount >= 9 ? '✅' : '❌'}</div>
            <div class="readiness-item-label">Attestations Signed</div>
            <div class="readiness-item-value">${attestCount} / 9</div>
        </div>`;
        html += `<div class="readiness-item ${allPassed ? 'ready' : 'not-ready'}">
            <div class="readiness-item-icon">${allPassed ? '🔓' : '🔒'}</div>
            <div class="readiness-item-label">Exam Unlocked</div>
            <div class="readiness-item-value">${allPassed ? 'YES' : 'NO'}</div>
        </div>`;

        container.innerHTML = html;
    }

    // ─── Material Misstatement Risk ───
    function updateMisstateRisk() {
        const container = document.getElementById('misstateRisk');
        if (!container) return;

        const risks = [];

        // Check verification engine for risk patterns
        let verificationState = null;
        try {
            const vs = localStorage.getItem('optkas_verification_state');
            if (vs) verificationState = JSON.parse(vs);
        } catch (e) { /* ignore */ }

        if (verificationState && verificationState.assessments) {
            const scoreVals = { green: 100, yellow: 60, red: 20 };
            const domains = {
                D: ['D1','D2','D3','D4','D5','D6'],
                F: ['F1','F2','F3','F4','F5']
            };

            // Calculate Legal score
            let legalScore = 0, legalCount = 0;
            for (const c of domains.D) {
                if (verificationState.assessments[c]) {
                    legalScore += scoreVals[verificationState.assessments[c]] || 0;
                    legalCount++;
                }
            }
            const legalAvg = legalCount > 0 ? legalScore / legalCount : 0;

            // Check: Legal < 70 but solicitors are active
            if (legalAvg < 70 && legalCount > 0) {
                risks.push({ signal: 'red', text: `Legal domain score is ${Math.round(legalAvg)}/100 (below 70 threshold). Sales outreach should be suspended until Legal domain is raised. Risk: material claims about legal structure may not be fully verifiable.` });
            }

            // Check: Security has red claims
            let securityReds = [];
            for (const c of domains.F) {
                if (verificationState.assessments[c] === 'red') securityReds.push(c);
            }
            if (securityReds.length > 0) {
                risks.push({ signal: 'red', text: `Security domain has ${securityReds.length} unverified claim(s): ${securityReds.join(', ')}. Sales materials referencing security controls may constitute material misstatements.` });
            }
        }

        // Check: Exam score on forbidden section
        if (state.examResult && state.examResult.forbiddenScore < 90) {
            risks.push({ signal: 'yellow', text: `Forbidden statements score: ${state.examResult.forbiddenScore}%. Below 90% threshold. Elevated risk of prohibited claims during client interactions.` });
        }

        // Check: Certification expired
        if (isCertExpired()) {
            risks.push({ signal: 'red', text: 'Certification has expired. All sales outreach must stop immediately until recertification is completed.' });
        }

        if (risks.length === 0) {
            if (state.examPassed && !isCertExpired()) {
                container.innerHTML = `<div class="vuln-card">
                    <span class="vuln-signal signal-green"></span>
                    <div class="vuln-text"><strong>Low Risk.</strong> All certifications current. No flagged domains. Continue with standard compliance monitoring.</div>
                </div>`;
            } else {
                container.innerHTML = `<div class="concept-card" style="border-left:4px solid var(--text-secondary);">
                    <p style="color:var(--text-secondary);">Complete lessons and the final exam to generate risk assessment.</p>
                </div>`;
            }
            return;
        }

        let html = '';
        risks.forEach(r => {
            html += `<div class="vuln-card">
                <span class="vuln-signal signal-${r.signal}"></span>
                <div class="vuln-text">${r.text}</div>
            </div>`;
        });
        container.innerHTML = html;
    }

    // ─── Persistence ───
    function loadState() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) return JSON.parse(saved);
        } catch (e) { /* ignore */ }
        return {
            attestations: {},
            quizAnswers: {},
            quizResults: {},
            examResult: null,
            examPassed: false,
            certificationDate: null,
            certificationExpiry: null,
            lastExamAttempt: null,
            examStartTime: null
        };
    }

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) { /* ignore */ }
    }

    // ─── Restore UI State ───
    function restoreUI() {
        // Restore attestations
        if (state.attestations) {
            for (const [lessonNum, checked] of Object.entries(state.attestations)) {
                const input = document.querySelector(`.attestation-check[data-lesson="${lessonNum}"]`);
                if (input) input.checked = checked;
                const block = document.getElementById('attest' + lessonNum);
                if (block && checked) block.classList.add('signed');
            }
        }
    }

    // ─── TTS Toggle ───
    function initTTS() {
        const ttsBtn = document.getElementById('ttsToggle');
        if (ttsBtn) {
            ttsBtn.addEventListener('click', function () {
                audioVisible = !audioVisible;
                document.querySelectorAll('.audio-bar').forEach(bar => {
                    bar.style.display = audioVisible ? '' : 'none';
                });
            });
        }
    }

    // ─── Init ───
    document.addEventListener('DOMContentLoaded', function () {
        // Render all quizzes
        for (let i = 1; i <= 9; i++) {
            renderQuiz(i);
        }

        // Restore state
        restoreUI();

        // Nav click handlers
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const section = this.getAttribute('data-section');
                if (section) navigateTo(section);
            });
        });

        // TTS toggle
        initTTS();

        // Update everything
        updateProgress();

        // If exam was in progress, restore
        if (state.examStartTime && !state.examResult) {
            const elapsed = Date.now() - state.examStartTime;
            if (elapsed < EXAM_TIME_LIMIT) {
                renderExam();
                startExamTimer();
                document.getElementById('examStartBtn').style.display = 'none';
                document.getElementById('quizSubmit10').style.display = '';
                document.getElementById('examTimer').style.display = '';
            }
        } else if (state.examResult) {
            // Show previous exam result
            const el = document.getElementById('quizResult10');
            const btn = document.getElementById('quizSubmit10');
            const startBtn = document.getElementById('examStartBtn');
            if (el && state.examResult) {
                let resultText = `Overall: ${state.examResult.correct}/${state.examResult.total} (${state.examResult.score}%) — `;
                resultText += `Forbidden: ${state.examResult.forbiddenCorrect}/${state.examResult.forbiddenTotal} (${state.examResult.forbiddenScore}%) — `;
                resultText += state.examResult.passed ? 'CERTIFIED ✓' : 'NOT PASSED';
                el.textContent = resultText;
                el.className = 'quiz-result ' + (state.examResult.passed ? 'pass' : 'fail');
            }
            if (state.examResult.passed) {
                if (btn) { btn.style.display = ''; btn.disabled = true; btn.textContent = 'Exam Passed ✓'; }
                if (startBtn) startBtn.style.display = 'none';
            } else {
                if (startBtn) startBtn.textContent = 'Retake Exam';
            }
        }
    });

})();
