import './palette.css';
// ── SVG icon library ─────────────────────────────────────────────────────────

const ICONS = {
    alignLeft: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1" y="2" width="14" height="2.5" rx="1" fill="currentColor" opacity=".4"/><rect x="1" y="6.75" width="9" height="2.5" rx="1" fill="currentColor"/><rect x="1" y="11.5" width="11" height="2.5" rx="1" fill="currentColor" opacity=".4"/><rect x="1" y="1" width="1.5" height="14" rx=".75" fill="currentColor"/></svg>`,
    alignCenter: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1" y="2" width="14" height="2.5" rx="1" fill="currentColor" opacity=".4"/><rect x="3.5" y="6.75" width="9" height="2.5" rx="1" fill="currentColor"/><rect x="2.5" y="11.5" width="11" height="2.5" rx="1" fill="currentColor" opacity=".4"/><rect x="7.25" y="1" width="1.5" height="14" rx=".75" fill="currentColor"/></svg>`,
    alignRight: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1" y="2" width="14" height="2.5" rx="1" fill="currentColor" opacity=".4"/><rect x="6" y="6.75" width="9" height="2.5" rx="1" fill="currentColor"/><rect x="3.5" y="11.5" width="11" height="2.5" rx="1" fill="currentColor" opacity=".4"/><rect x="13.5" y="1" width="1.5" height="14" rx=".75" fill="currentColor"/></svg>`,
    alignTop: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="1" width="2.5" height="14" rx="1" fill="currentColor" opacity=".4"/><rect x="6.75" y="1" width="2.5" height="9" rx="1" fill="currentColor"/><rect x="11.5" y="1" width="2.5" height="11" rx="1" fill="currentColor" opacity=".4"/><rect x="1" y="1" width="14" height="1.5" rx=".75" fill="currentColor"/></svg>`,
    alignMiddle: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="1" width="2.5" height="14" rx="1" fill="currentColor" opacity=".4"/><rect x="6.75" y="3.5" width="2.5" height="9" rx="1" fill="currentColor"/><rect x="11.5" y="2.5" width="2.5" height="11" rx="1" fill="currentColor" opacity=".4"/><rect x="1" y="7.25" width="14" height="1.5" rx=".75" fill="currentColor"/></svg>`,
    alignBottom: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="1" width="2.5" height="14" rx="1" fill="currentColor" opacity=".4"/><rect x="6.75" y="6" width="2.5" height="9" rx="1" fill="currentColor"/><rect x="11.5" y="3.5" width="2.5" height="11" rx="1" fill="currentColor" opacity=".4"/><rect x="1" y="13.5" width="14" height="1.5" rx=".75" fill="currentColor"/></svg>`,
    distH: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="3" height="10" rx="1" fill="currentColor"/><rect x="6.5" y="5" width="3" height="6" rx="1" fill="currentColor" opacity=".6"/><rect x="12" y="3" width="3" height="10" rx="1" fill="currentColor"/><path d="M1 8h14" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2" opacity=".4"/></svg>`,
    distV: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="3" y="1" width="10" height="3" rx="1" fill="currentColor"/><rect x="5" y="6.5" width="6" height="3" rx="1" fill="currentColor" opacity=".6"/><rect x="3" y="12" width="10" height="3" rx="1" fill="currentColor"/><path d="M8 1v14" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2" opacity=".4"/></svg>`,
    sameWidth: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1" y="5" width="14" height="3" rx="1" fill="currentColor"/><rect x="1" y="9" width="14" height="3" rx="1" fill="currentColor" opacity=".5"/><path d="M1 3v10M15 3v10" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity=".5"/></svg>`,
    sameHeight: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="5" y="1" width="3" height="14" rx="1" fill="currentColor"/><rect x="9" y="1" width="3" height="14" rx="1" fill="currentColor" opacity=".5"/><path d="M3 1h10M3 15h10" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity=".5"/></svg>`,
    sameSize: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="9" height="9" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="6" y="6" width="9" height="9" rx="1.5" fill="currentColor" opacity=".2" stroke="currentColor" stroke-width="1.5"/></svg>`,
    swap: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M1 5h10M9 3l2 2-2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 11H5m2-2-2 2 2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    group: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".4"/><rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".4"/><rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".4"/><rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".4"/><rect x="3" y="3" width="10" height="10" rx="2" stroke="currentColor" stroke-width="1.5"/></svg>`,
    ungroup: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5" opacity=".4"/><rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5" opacity=".4"/></svg>`,
    rect: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3.5" width="13" height="9" rx="2" stroke="currentColor" stroke-width="1.5"/></svg>`,
    circle: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/></svg>`,
    triangle: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 2l7 12H1L8 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
    text: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 3h12M8 3v10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M5 13h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity=".5"/></svg>`,
    line: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 8h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><rect x="1" y="6.5" width="2" height="3" rx=".5" fill="currentColor" opacity=".5"/><rect x="13" y="6.5" width="2" height="3" rx=".5" fill="currentColor" opacity=".5"/></svg>`,
    arrow: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 8h10M9 5l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

    matrix: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="4" height="4" rx="1" fill="currentColor"/><rect x="6" y="1" width="4" height="4" rx="1" fill="currentColor" opacity=".5"/><rect x="11" y="1" width="4" height="4" rx="1" fill="currentColor" opacity=".25"/><rect x="1" y="6" width="4" height="4" rx="1" fill="currentColor" opacity=".5"/><rect x="6" y="6" width="4" height="4" rx="1" fill="currentColor" opacity=".3"/><rect x="11" y="6" width="4" height="4" rx="1" fill="currentColor" opacity=".15"/><rect x="1" y="11" width="4" height="4" rx="1" fill="currentColor" opacity=".25"/><rect x="6" y="11" width="4" height="4" rx="1" fill="currentColor" opacity=".15"/><rect x="11" y="11" width="4" height="4" rx="1" fill="currentColor" opacity=".08"/></svg>`,
    tableRow: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="4" rx="1" stroke="currentColor" stroke-width="1.2" opacity=".4"/><rect x="1" y="9" width="14" height="4" rx="1" stroke="currentColor" stroke-width="1.2"/><path d="M8 10.5v1M7 11h2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`,
    tableCol: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="3" y="1" width="4" height="14" rx="1" stroke="currentColor" stroke-width="1.2" opacity=".4"/><rect x="9" y="1" width="4" height="14" rx="1" stroke="currentColor" stroke-width="1.2"/><path d="M10.5 8h1M11 7v2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`,
    ai: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1l1.5 3.5L13 6l-3.5 1.5L8 11l-1.5-3.5L3 6l3.5-1.5L8 1z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M13 11l.7 1.5 1.5.7-1.5.7L13 15l-.7-1.5L10.8 13l1.5-.7L13 11z" fill="currentColor" opacity=".5"/></svg>`,
    matchStyle: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13 3l-2-2L4 8l-1 5 5-1 7-7z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="3" cy="13" r="1" fill="currentColor"/></svg>`,
    autoFit: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3.5" width="13" height="9" rx="1" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2 1"/><path d="M5 8h6M6 6l-1 2 1 2M10 6l1 2-1 2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

const COMMANDS = [
    // Align ──────────────────────────────────────────────
    { id: 'align-left', name: 'Align Left', cat: 'Align', icon: ICONS.alignLeft, sc: 'AL' },
    { id: 'align-center-h', name: 'Align Center', cat: 'Align', icon: ICONS.alignCenter, sc: 'AC' },
    { id: 'align-right', name: 'Align Right', cat: 'Align', icon: ICONS.alignRight, sc: 'AR' },
    { id: 'align-top', name: 'Align Top', cat: 'Align', icon: ICONS.alignTop, sc: 'AT' },
    { id: 'align-middle-v', name: 'Align Middle', cat: 'Align', icon: ICONS.alignMiddle, sc: 'AM' },
    { id: 'align-bottom', name: 'Align Bottom', cat: 'Align', icon: ICONS.alignBottom, sc: 'AB' },
    { id: 'dist-h', name: 'Distribute Horizontal', cat: 'Align', icon: ICONS.distH, sc: 'DH' },
    { id: 'dist-v', name: 'Distribute Vertical', cat: 'Align', icon: ICONS.distV, sc: 'DV' },
    // Size ───────────────────────────────────────────────
    { id: 'same-width', name: 'Same Width', cat: 'Size', icon: ICONS.sameWidth, sc: 'SW' },
    { id: 'same-height', name: 'Same Height', cat: 'Size', icon: ICONS.sameHeight, sc: 'SH' },
    { id: 'same-size', name: 'Same Size', cat: 'Size', icon: ICONS.sameSize, sc: 'SS' },
    { id: 'match-style', name: 'Match Style', cat: 'Size', icon: ICONS.matchStyle, sc: 'MS' },
    // Arrange ────────────────────────────────────────────
    { id: 'swap', name: 'Swap Positions', cat: 'Arrange', icon: ICONS.swap, sc: '/' },
    { id: 'align-matrix', name: 'Align Matrix', cat: 'Arrange', icon: ICONS.matrix, sc: 'AX' },
    { id: 'group', name: 'Group', cat: 'Arrange', icon: ICONS.group, sc: 'Ctrl + G' },
    { id: 'ungroup', name: 'Ungroup', cat: 'Arrange', icon: ICONS.ungroup, sc: 'U' },
    // Insert ─────────────────────────────────────────────
    { id: 'add-rect', name: 'Add Rectangle', cat: 'Insert', icon: ICONS.rect, sc: 'R' },
    { id: 'add-circle', name: 'Add Circle', cat: 'Insert', icon: ICONS.circle, sc: 'C' },
    { id: 'add-triangle', name: 'Add Triangle', cat: 'Insert', icon: ICONS.triangle, sc: 'G' },
    { id: 'add-text', name: 'Add Text Box', cat: 'Insert', icon: ICONS.text, sc: 'T' },
    { id: 'add-line', name: 'Add Line', cat: 'Insert', icon: ICONS.line, sc: 'L' },
    { id: 'add-arrow', name: 'Add Arrow', cat: 'Insert', icon: ICONS.arrow, sc: 'AA' },

    // Smart ──────────────────────────────────────────────
    { id: 'enclose-icon', name: 'Enclose Icon', cat: 'Smart', icon: ICONS.circle, sc: 'EI' },
    { id: 'auto-fit', name: 'Auto Fit', cat: 'Smart', icon: ICONS.autoFit, sc: 'AF' },
    { id: 'add-row', name: 'Add Table Row', cat: 'Smart', icon: ICONS.tableRow, sc: null },
    { id: 'add-col', name: 'Add Table Column', cat: 'Smart', icon: ICONS.tableCol, sc: null },
    // AI ─────────────────────────────────────────────────
    { id: 'ai-generate-slide', name: 'Generate Slide', cat: 'AI', icon: ICONS.ai, sc: null },
    { id: 'translate-page', name: 'Translate Page', cat: 'AI', icon: ICONS.ai, sc: null },
    { id: 'ai-lead', name: 'Generate Lead Sentence', cat: 'AI', icon: ICONS.ai, sc: null },
    { id: 'ai-rewrite', name: 'Rewrite Text Professionally', cat: 'AI', icon: ICONS.ai, sc: null },
    { id: 'ai-bullets', name: 'Rewrite as Bullets', cat: 'AI', icon: ICONS.ai, sc: null },
];

const LANGUAGES = [
    { id: 'Arabic', name: 'Arabic', code: 'AR' },
    { id: 'French', name: 'French', code: 'FR' },
    { id: 'Spanish', name: 'Spanish', code: 'ES' },
    { id: 'German', name: 'German', code: 'DE' },
    { id: 'Chinese', name: 'Chinese', code: 'ZH' },
    { id: 'Japanese', name: 'Japanese', code: 'JA' }
];

window.userTier = 'free';
window.userCreditsUsed = 0;
window.userCreditsLimit = 0;
window.updateAvailable = false;
window.updateVersion = '';

let sel = 0;
let langSel = 0;
let optSel = 0;
let list = [...COMMANDS];
let optionsList = [];
let currentView = 'home'; // 'home', 'lang-menu', 'options-menu'
const input = document.getElementById('search');
const results = document.getElementById('results');
const langResults = document.getElementById('lang-results');
const langMenu = document.getElementById('lang-menu');
const optionsResults = document.getElementById('options-results');
const optionsMenu = document.getElementById('options-menu');
const generateMenu = document.getElementById('generate-menu');
const generatePrompt = document.getElementById('generate-prompt');
const loader = document.getElementById('loader');

let generateState = 'input'; // 'input', 'loading', 'success'

function renderGenerateMenu() {
    const inputCont = document.getElementById('generate-input-container');
    const loadCont = document.getElementById('generate-loading-container');
    const succCont = document.getElementById('generate-success-container');
    const hint = document.getElementById('generate-action-hint');

    if (inputCont) inputCont.style.display = generateState === 'input' ? 'block' : 'none';
    if (loadCont) loadCont.style.display = generateState === 'loading' ? 'flex' : 'none';
    if (succCont) succCont.style.display = generateState === 'success' ? 'flex' : 'none';

    if (hint) {
        if (generateState === 'input') {
            hint.innerHTML = '<kbd>↵</kbd> Generate';
            hint.style.display = 'flex';
        } else {
            hint.style.display = 'none';
        }
    }
}

function render() {
    if (currentView === 'lang-menu') {
        langMenu.style.display = 'flex';
        optionsMenu.style.display = 'none';
        generateMenu.style.display = 'none';
        renderLanguages();
        return;
    } else if (currentView === 'options-menu') {
        optionsMenu.style.display = 'flex';
        langMenu.style.display = 'none';
        generateMenu.style.display = 'none';
        renderOptions();
        return;
    } else if (currentView === 'generate-menu') {
        generateMenu.style.display = 'flex';
        langMenu.style.display = 'none';
        optionsMenu.style.display = 'none';
        renderGenerateMenu();
        return;
    } else {
        langMenu.style.display = 'none';
        optionsMenu.style.display = 'none';
        generateMenu.style.display = 'none';
        currentView = 'home';
    }

    // Dynamically add update command if available
    let dynamicList = [...list];

    if (window.updateAvailable) {
        const updateIcon = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1v8M4.5 5.5L8 2l3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
        dynamicList.push({
            id: 'restart-for-update',
            name: `Restart to Update (v${window.updateVersion})`,
            cat: 'App',
            icon: updateIcon,
            sc: null
        });
    }

    // Only full re-render if needed (list change or results empty)
    if (results.dataset.lastQuery !== input.value || results.innerHTML === '') {
        results.innerHTML = '';
        results.dataset.lastQuery = input.value;

        if (!dynamicList.length) {
            results.innerHTML = '<div class="no-results">No tools matched your search</div>';
            return;
        }

        let lastCat = null;
        dynamicList.forEach((cmd, i) => {
            if (cmd.cat !== lastCat) {
                const label = document.createElement('div');
                label.className = 'section-label';
                label.textContent = cmd.cat;
                results.appendChild(label);
                lastCat = cmd.cat;
            }

            // Lock EVERYTHING if user is on Free tier
            const isLocked = window.userTier === 'free';
            const lockIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.4; margin-left:8px;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`;

            const div = document.createElement('div');
            div.className = 'cmd-item' + (isLocked ? ' restricted' : '');
            div.dataset.index = i;

            div.innerHTML = `
              <div class="cmd-icon-wrap" ${isLocked ? 'style="opacity:0.4"' : ''}>${cmd.icon}</div>
              <div class="cmd-info" ${isLocked ? 'style="opacity:0.5"' : ''}>
                <div class="cmd-name">${hl(cmd.name)}</div>
              </div>
              <span class="cmd-cat">${cmd.cat}</span>
              ${isLocked ? lockIcon : (cmd.sc ? `<span class="cmd-shortcut">${cmd.sc}</span>` : '')}
            `;

            div.addEventListener('click', () => run(cmd));
            div.addEventListener('mouseenter', () => {
                div.style.cursor = 'pointer';
                if (sel !== i) {
                    sel = i;
                    updateSelectionStyles(results);
                }
            });
            results.appendChild(div);
        });
    }

    updateSelectionStyles(results);
}

function updateSelectionStyles(container) {
    const items = container.querySelectorAll('.cmd-item');
    items.forEach((item, i) => {
        const isSelected = i === (container === results ? sel : (container === langResults ? langSel : optSel));
        if (isSelected) {
            item.classList.add('sel');
            item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        } else {
            item.classList.remove('sel');
        }
    });
}

function renderLanguages() {
    if (langResults.innerHTML === '') {
        langResults.innerHTML = '';
        LANGUAGES.forEach((lang, i) => {
            const div = document.createElement('div');
            div.className = 'cmd-item';
            div.innerHTML = `
                <div class="cmd-icon-wrap">${lang.code}</div>
                <div class="cmd-info">
                    <div class="cmd-name">${lang.name}</div>
                </div>
            `;
            div.addEventListener('click', () => startTranslation(lang.id));
            div.addEventListener('mouseenter', () => {
                if (langSel !== i) {
                    langSel = i;
                    updateSelectionStyles(langResults);
                }
            });
            langResults.appendChild(div);
        });
    }
    updateSelectionStyles(langResults);
}

function renderOptions() {
    if (optionsResults.innerHTML === '') {
        optionsResults.innerHTML = '';
        optionsList.forEach((opt, i) => {
            const div = document.createElement('div');
            div.className = 'cmd-item';
            div.innerHTML = `
                <div class="cmd-icon-wrap" style="font-size:12px; font-weight:bold;">${i + 1}</div>
                <div class="cmd-info">
                    <div class="cmd-name" style="white-space:normal; font-size:13px; line-height:1.4;">${opt}</div>
                </div>
            `;
            div.addEventListener('click', () => submitOption(opt));
            div.addEventListener('mouseenter', () => {
                if (optSel !== i) {
                    optSel = i;
                    updateSelectionStyles(optionsResults);
                }
            });
            optionsResults.appendChild(div);
        });
    }
    updateSelectionStyles(optionsResults);
}

function checkAICredits() {
    if (window.userTier === 'free') {
        return { allowed: false, reason: 'upgrade' };
    }
    if (window.userCreditsUsed >= window.userCreditsLimit) {
        return { allowed: false, reason: 'exhausted' };
    }
    return { allowed: true };
}

async function run(cmd) {
    // Block ALL commands for free users
    if (window.userTier === 'free') {
        showError("Upgrade to Pro to unlock all features.", 'home');
        return;
    }

    // Check AI credits for AI commands
    if (cmd.cat === 'AI' && window.userCreditsUsed >= window.userCreditsLimit) {
        showError(`Credits used (${window.userCreditsUsed}/${window.userCreditsLimit}). Resets monthly.`, 'home');
        return;
    }

    if (cmd.id === 'translate-page') {
        currentView = 'lang-menu';
        langSel = 0;
        render();
        return;
    }

    if (cmd.id === 'ai-generate-slide') {
        currentView = 'generate-menu';
        generateState = 'input';
        render();
        setTimeout(() => generatePrompt.focus(), 50);
        return;
    }

    if (cmd.id === 'ai-lead') {
        loader.style.display = 'flex';
        document.getElementById('loader-msg').textContent = 'Extracting text...';
        window.currentAction = 'lead';
        send('GET_SLIDE_TEXT');
        return;
    }

    if (cmd.id === 'ai-rewrite' || cmd.id === 'ai-bullets') {
        loader.style.display = 'flex';
        document.getElementById('loader-msg').textContent = 'Reading selected text...';
        window.currentAction = cmd.id === 'ai-rewrite' ? 'rewrite' : 'bullets';
        send('GET_SELECTED_TEXT');
        return;
    }

    if (cmd.id === 'restart-for-update') {
        loader.style.display = 'flex';
        document.getElementById('loader-msg').textContent = 'Applying update...';

        // Apply the update
        send('APPLY_UPDATE');
        return;
    }

    const active = results.querySelector('.sel');
    if (active) {
        active.style.transform = 'scale(0.98)';
        setTimeout(() => {
            send('CMD:' + cmd.id);
        }, 80);
    } else {
        send('CMD:' + cmd.id);
    }
}

async function startTranslation(targetLang = null) {
    const lang = targetLang || LANGUAGES[langSel].id;
    loader.style.display = 'flex';
    document.getElementById('loader-msg').textContent = 'Extracting text...';
    window.currentTranslationTarget = lang;
    window.currentAction = 'translate';

    // Step 1: Request text from PPT
    send('GET_SLIDE_TEXT');
}

async function handleTranslationData(jsonText) {
    try {
        const target = window.currentTranslationTarget || 'Arabic';
        document.getElementById('loader-msg').textContent = `Translating to ${target}...`;

        // We use the function from api.js
        let translatedJson = await fetchAITranslation(jsonText, target);

        document.getElementById('loader-msg').textContent = 'Applying changes...';

        // Reset UI state before sending so it's clean on next open
        input.value = '';
        filterList('');
        sel = 0;
        langSel = 0;
        currentView = 'home';
        loader.style.display = 'none';
        langMenu.style.display = 'none';
        render();

        // Step 3: Send back to C# to apply
        send('APPLY_TRANSLATION:' + translatedJson);
    } catch (err) {
        console.error(err);
        showError("Translation failed: " + err.message, 'lang-menu');
    }
}

async function handleLeadSentenceData(jsonText) {
    try {
        document.getElementById('loader-msg').textContent = 'Generating Lead Sentences...';
        const options = await fetchAILeadSentence(jsonText);
        optionsList = options;
        optSel = 0;
        currentView = 'options-menu';
        loader.style.display = 'none';
        loader.style.display = 'none';
        render();
    } catch (err) {
        console.error(err);
        showError("Generation failed: " + err.message, 'home');
    }
}

async function handleSelectedTextData(text) {
    try {
        if (!text || text.trim() === '') {
            showError("No text found. Please select a shape or place your cursor in text.", 'home');
            return;
        }

        document.getElementById('loader-msg').textContent = 'Rewriting with AI...';
        const newText = await fetchAIRewrite(text, window.currentAction);

        document.getElementById('loader-msg').textContent = 'Applying changes...';

        // Return clear state
        input.value = '';
        currentView = 'home';
        loader.style.display = 'none';
        render();

        if (window.currentAction === 'bullets') {
            send('REPLACE_SELECTED_TEXT_BULLETS:' + newText);
        } else {
            send('REPLACE_SELECTED_TEXT:' + newText);
        }
    } catch (err) {
        console.error(err);
        showError("Rewrite failed: " + err.message, 'home');
    }
}

function showError(msg, returnView) {
    loader.style.display = 'flex';
    const msgEl = document.getElementById('loader-msg');
    const spinner = document.querySelector('.spinner');

    spinner.style.display = 'none';
    msgEl.textContent = msg;
    msgEl.classList.add('error');

    setTimeout(() => {
        loader.style.display = 'none';
        spinner.style.display = 'block';
        msgEl.classList.remove('error');
        currentView = returnView;
        render();
    }, 2500);
}

function submitOption(optText) {
    // Send standard clean option to PPT
    const text = optText || optionsList[optSel];
    send('INSERT_LEAD_SENTENCE:' + text.trim());
    closePalette();
}

function formatAgentText(text) {
    if (!text) return '';
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.replace(/\n/g, '<br>');
    return text;
}

let typewriterInterval;
function startTypewriter() {
    const el = document.getElementById('generate-status');
    const phrases = [
        "Analyzing your request...",
        "Structuring the content...",
        "Applying optimal layout...",
        "Refining the design...",
        "Finalizing slide elements..."
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    el.innerHTML = '<span id="generate-status-text"></span><span class="tw-cursor"></span>';
    const spanText = document.getElementById('generate-status-text');

    function tick() {
        if (!el.isConnected || generateState !== 'loading') return;

        let currentPhrase = phrases[phraseIdx];
        if (isDeleting) {
            spanText.textContent = currentPhrase.substring(0, charIdx - 1);
            charIdx--;
        } else {
            spanText.textContent = currentPhrase.substring(0, charIdx + 1);
            charIdx++;
        }

        let typeSpeed = isDeleting ? 30 : 50;

        if (!isDeleting && charIdx === currentPhrase.length) {
            typeSpeed = 1500; // Pause at end of phrase
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            typeSpeed = 300; // Pause before typing next
        }

        typewriterInterval = setTimeout(tick, typeSpeed);
    }
    tick();
}

function stopTypewriter() {
    clearTimeout(typewriterInterval);
}

async function submitGenerateSlide() {
    const prompt = generatePrompt.value.trim();
    if (!prompt) return;

    generateState = 'loading';
    renderGenerateMenu();
    startTypewriter();

    try {
        let result = await fetchAIGenerateSlide(prompt, "{}");
        let slideJson = result.slideJson;
        let explanation = result.explanation;

        let action = 'create';
        try {
            const parsed = JSON.parse(slideJson);
            if (parsed.action === 'edit') action = 'edit';
        } catch (e) { }

        document.getElementById('generate-status').textContent = 'Applying changes...';

        const command = action === 'edit' ? 'EDIT_CURRENT_SLIDE_FROM_JSON:' : 'CREATE_SLIDE_FROM_JSON:';
        send(command + slideJson);

        stopTypewriter();
        document.getElementById('generate-explanation').innerHTML = formatAgentText(explanation) || 'Slide generated successfully.';
        generateState = 'success';
        renderGenerateMenu();

        // Close palette instantly
        closePalette();

    } catch (err) {
        console.error(err);
        stopTypewriter();
        generateState = 'input';
        renderGenerateMenu();
        showError("Generation failed: " + err.message, 'generate-menu');
    }
}

function closePalette() {
    input.value = '';
    filterList('');
    sel = 0;
    langSel = 0;
    optSel = 0;

    if (currentView !== 'generate-menu') {
        currentView = 'home';
    }

    results.innerHTML = '';
    langResults.innerHTML = '';
    optionsResults.innerHTML = '';
    // DON'T clear generatePrompt so state is kept!
    loader.style.display = 'none';

    if (currentView !== 'generate-menu') {
        langMenu.style.display = 'none';
        optionsMenu.style.display = 'none';
        generateMenu.style.display = 'none';
        render();
    }

    send('CLOSE_PALETTE');
}

function send(msg) {
    if (window.chrome && window.chrome.webview) {
        window.chrome.webview.postMessage(msg);
    }
}

function hl(item, q) {
    if (!q) return item;
    const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return item.replace(re, '<mark>$1</mark>');
}

function filterList(q) {
    const oldListCount = list.length;
    if (!q) {
        list = [...COMMANDS];
    } else {
        const low = q.toLowerCase();
        list = COMMANDS.filter(c =>
            c.name.toLowerCase().includes(low) ||
            c.cat.toLowerCase().includes(low) ||
            (c.sc && c.sc.toLowerCase().includes(low))
        );
    }

    // Force a re-render by clearing the results if the list changed
    results.innerHTML = '';
    render();
}

input.addEventListener('input', () => {
    filterList(input.value.trim());
    sel = 0;
});

generatePrompt.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation(); // Prevent the main keydown handler from triggering run()
        submitGenerateSlide();
    }
    if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        currentView = 'home';
        render();
    }
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        if (currentView === 'lang-menu') {
            currentView = 'home';
            render();
        } else {
            closePalette();
        }
        return;
    }

    if (currentView === 'lang-menu') {
        if (e.key === 'ArrowDown') { langSel = Math.min(langSel + 1, LANGUAGES.length - 1); renderLanguages(); e.preventDefault(); return; }
        if (e.key === 'ArrowUp') { langSel = Math.max(langSel - 1, 0); renderLanguages(); e.preventDefault(); return; }
        if (e.key === 'Enter') {
            startTranslation();
            e.preventDefault();
        }
        return;
    }

    if (currentView === 'options-menu') {
        if (e.key === 'ArrowDown') { optSel = Math.min(optSel + 1, optionsList.length - 1); renderOptions(); e.preventDefault(); return; }
        if (e.key === 'ArrowUp') { optSel = Math.max(optSel - 1, 0); renderOptions(); e.preventDefault(); return; }
        if (e.key === 'Enter') {
            submitOption();
            e.preventDefault();
        }
        return;
    }

    if (e.key === 'ArrowDown') { sel = Math.min(sel + 1, list.length - 1); render(); e.preventDefault(); return; }
    if (e.key === 'ArrowUp') { sel = Math.max(sel - 1, 0); render(); e.preventDefault(); return; }
    if (e.key === 'Enter' && list[sel]) { run(list[sel]); }
});

if (window.chrome && window.chrome.webview) {
    window.chrome.webview.addEventListener('message', e => {
        if (e.data.startsWith('FOCUS_WITH_SESSION:')) {
            try {
                const sessionJson = e.data.substring(19);
                const session = JSON.parse(sessionJson);
                window._lastSessionData = session;

                // Set defaults from session (C# may not send tier info)
                const tier = session.tier || 'free';
                let limit = session.token_limit;

                if (!limit || limit === 0) {
                    if (tier === 'pro') limit = 100;
                    else if (tier === 'team') limit = 500;
                    else limit = 10;
                }

                window.userTier = tier;
                window.userCreditsUsed = session.token_usage || 0;
                window.userCreditsLimit = limit;


                // Always fetch fresh tier data from Supabase
                if (session.user_id && session.access_token) {
                    window.fetchLivelyTier(session).then(liveData => {
                        if (liveData) {
                            window.userTier = liveData.tier;
                            window.userCreditsUsed = liveData.token_usage;
                            window.userCreditsLimit = liveData.token_limit;
                            results.innerHTML = '';
                            render();
                            // Tell C# to persist the latest valid tier
                            send('UPDATE_TIER:' + liveData.tier);
                        }
                    });
                }
            } catch (err) {
                window.userTier = 'free';
                window.userCreditsUsed = 0;
                window.userCreditsLimit = 0;
            }

            if (currentView !== 'generate-menu') {
                currentView = 'home';
                input.value = '';
                filterList('');
                results.innerHTML = '';
                langResults.innerHTML = '';
                optionsResults.innerHTML = '';
                render();
                input.focus();
                input.select();
            } else {
                render();
                generatePrompt.focus();
            }
        }
        if (e.data.startsWith('SLIDE_TEXT:')) {
            const jsonText = e.data.substring(11);
            if (window.currentAction === 'lead') {
                handleLeadSentenceData(jsonText);
            } else {
                handleTranslationData(jsonText);
            }
        }
        if (e.data.startsWith('SELECTED_TEXT:')) {
            handleSelectedTextData(e.data.substring(14));
        }
        if (e.data.startsWith('SLIDE_JSON:')) {
            const json = e.data.substring(11);
            if (window._slideJsonResolve) {
                window._slideJsonResolve(json);
                window._slideJsonResolve = null;
            }
        }
        if (e.data === 'NOTIFY_NO_SELECTION') {
            showError("Nothing is selected!", 'home');
        }
        if (e.data.startsWith('UPDATE_READY:')) {
            const version = e.data.substring(13);
            if (document.getElementById('update-popup')) return;

            const popup = document.createElement('div');
            popup.id = 'update-popup';
            popup.style.cssText = 'position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(30, 30, 30, 0.95); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 12px 24px; border-radius: 12px; font-weight: 500; font-size: 13px; cursor: pointer; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4); display: flex; align-items: center; gap: 10px; z-index: 9999; backdrop-filter: blur(10px); transition: transform 0.2s;';
            popup.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1v8M4.5 5.5L8 2l3.5 3.5" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2" stroke="#3b82f6" stroke-width="2" stroke-linecap="round"/></svg> Restart to Apply Update (v${version})`;

            popup.onmouseover = () => popup.style.transform = 'translateX(-50%) scale(1.05)';
            popup.onmouseout = () => popup.style.transform = 'translateX(-50%) scale(1)';

            popup.onclick = () => {
                popup.innerHTML = 'Applying update...';
                popup.style.cursor = 'wait';
                send('APPLY_UPDATE');
            };

            document.body.appendChild(popup);
        }
        if (e.data === 'NO_UPDATE_AVAILABLE') {
            showError("You're already on the latest version!", 'home');
        }
        if (e.data === 'UPDATE_DOWNLOADED') {
            loader.style.display = 'none';
            // Show confirmation dialog
            if (confirm('Update downloaded! Restart Conslide to apply the update?')) {
                send('APPLY_UPDATE_AND_RESTART');
            }
        }
        if (e.data === 'UPDATE_DOWNLOAD_FAILED') {
            showError("Failed to download update. Please try again later.", 'home');
        }
        if (e.data.startsWith('AGENT_RESULT:')) {
            const result = e.data.substring(13);
            if (window._agentPendingResolve) {
                window._agentPendingResolve(result);
                window._agentPendingResolve = null;
            }
        }
    });
}

document.getElementById('lang-back').addEventListener('click', () => {
    currentView = 'home';
    langResults.innerHTML = '';
    render();
});

document.getElementById('options-back').addEventListener('click', () => {
    currentView = 'home';
    optionsResults.innerHTML = '';
    render();
});

document.getElementById('generate-back').addEventListener('click', () => {
    currentView = 'home';
    render();
});

document.getElementById('generate-another-btn').addEventListener('click', () => {
    generateState = 'input';
    generatePrompt.value = '';
    renderGenerateMenu();
    generatePrompt.focus();
});

document.getElementById('profile-btn').addEventListener('click', () => {
    // Open profile page in default browser via C# or direct link
    if (window.chrome && window.chrome.webview) {
        window.chrome.webview.postMessage('OPEN_URL:http://localhost:8080/profile');
    }
});

render();
input.focus();