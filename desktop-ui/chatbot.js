// chatbot.js
(function () {
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send-btn');
    const messagesContainer = document.getElementById('chat-messages');
    const greeting = document.getElementById('chat-greeting');

    const CHAT_INPUT_MIN_HEIGHT_PX = 18;
    const CHAT_INPUT_MAX_HEIGHT_PX = 120;

    let isWaitingForResponse = false;
    let slideContextContext = "{}"; // Store slide context if we fetch it
    let chatHistory = []; // Could store history here if needed later

    const statusState = new WeakMap();

    window.initChatbot = function () {
        chatInput.value = '';
        chatInput.style.height = '18px';
        chatInput.focus();
    };

    function formatText(text) {
        if (!text) return '';
        let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

        html = html.replace(/```json([\s\S]*?)```/g, (match, code) => {
            return `<pre><code>${code.trim()}</code></pre>`;
        });

        html = html.replace(/\n/g, '<br>');
        return html;
    }

    function addMessage(role, text, includeSlideCard = false) {
        if (greeting) {
            greeting.style.display = 'none';
        }

        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg chat-msg-${role}`;

        let avatarContent = role === 'bot' ?
            `<img src="conslide_favicon.png" width="28" height="28" style="object-fit: contain; margin-top:2px;">` :
            `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
            </svg>`;

        let extraHtml = '';
        if (includeSlideCard && role === 'bot') {
            extraHtml = `
            <div class="chat-slide-card">
                <div class="chat-slide-card-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><polyline points="14 2 14 8 20 8"/><path d="M2 15h10"/><path d="M5 12l-3 3 3 3"/></svg>
                </div>
                <div class="chat-slide-card-info">
                    <div class="chat-slide-card-title">Slide Generated</div>
                    <div class="chat-slide-card-desc">Click to insert into presentation</div>
                </div>
                <div class="chat-slide-card-action" onclick="window.applyLastGeneratedSlide()">Insert</div>
            </div>`;
        }

        let reportBtnHtml = role === 'bot' ? 
            `<button class="chat-report-btn" onclick="window.reportAIContent(this)" title="Report inappropriate content">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
                Report
            </button>` : '';

        msgDiv.innerHTML = `
            <div class="chat-msg-avatar">${avatarContent}</div>
            <div class="chat-msg-content">
                <div class="chat-msg-text">${formatText(text)}</div>
                ${extraHtml}
                ${reportBtnHtml}
            </div>
        `;

        messagesContainer.appendChild(msgDiv);
        scrollToBottom();
        return msgDiv;
    }

    function ensureStatusCard(msgDiv) {
        if (!msgDiv) return null;
        const content = msgDiv.querySelector('.chat-msg-content');
        if (!content) return null;

        let card = content.querySelector('.chat-status-card');
        if (card) return card;

        card = document.createElement('div');
        card.className = 'chat-status-card';
        card.style.display = 'none';
        content.appendChild(card);
        return card;
    }

    function startStatusCard(msgDiv, title, subtitles, isEdit = false) {
        const card = ensureStatusCard(msgDiv);
        if (!card) return;

        const existing = statusState.get(msgDiv);
        if (existing && existing.timer) {
            try { clearInterval(existing.timer); } catch { }
        }

        const state = {
            phase: 'running',
            title,
            subtitles: Array.isArray(subtitles) && subtitles.length ? subtitles : ['Working…'],
            idx: 0,
            dots: 0,
            timer: null,
        };

        // Create structure with edit-specific styling
        card.className = 'chat-status-card' + (isEdit ? ' chat-status-card-edit' : '');
        card.innerHTML = `
            <div class="chat-status-spinner${isEdit ? ' chat-status-spinner-edit' : ''}"></div>
            <div class="chat-status-text">
                <div class="chat-status-title">${state.title}</div>
                <div class="chat-status-subtitle"></div>
            </div>
        `;
        card.style.display = 'flex';

        const subtitleEl = card.querySelector('.chat-status-subtitle');

        const updateText = () => {
            const subtitleBase = state.subtitles[state.idx % state.subtitles.length];
            const dots = '.'.repeat(state.dots);
            if (subtitleEl) subtitleEl.textContent = `${subtitleBase}${dots}`;
        };

        updateText();

        state.timer = setInterval(() => {
            state.dots = (state.dots + 1) % 4;
            if (state.dots === 0) state.idx = (state.idx + 1) % state.subtitles.length;
            updateText();
        }, 450);

        statusState.set(msgDiv, state);
    }

    function finishStatusCard(msgDiv, title, subtitle, isEdit = false) {
        const card = ensureStatusCard(msgDiv);
        if (!card) return;

        const existing = statusState.get(msgDiv);
        if (existing && existing.timer) {
            try { clearInterval(existing.timer); } catch { }
        }

        card.className = 'chat-status-card' + (isEdit ? ' chat-status-card-edit-done' : '');
        card.innerHTML = `
            <div class="chat-status-icon${isEdit ? ' chat-status-icon-edit' : ''}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                </svg>
            </div>
            <div class="chat-status-text">
                <div class="chat-status-title">${title}</div>
                <div class="chat-status-subtitle">${subtitle}</div>
            </div>
        `;
        card.style.display = 'flex';

        statusState.set(msgDiv, { phase: 'done' });
    }

    function setMessageText(msgDiv, text) {
        if (!msgDiv) return;
        const textEl = msgDiv.querySelector('.chat-msg-text');
        if (!textEl) return;
        textEl.innerHTML = formatText(text);
        scrollToBottom();
    }

    function setMessageHtml(msgDiv, html) {
        if (!msgDiv) return;
        const textEl = msgDiv.querySelector('.chat-msg-text');
        if (!textEl) return;
        textEl.innerHTML = html;
        scrollToBottom();
    }

    function addTypingIndicator() {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg chat-msg-bot`;
        msgDiv.id = 'chat-typing-indicator';
        msgDiv.innerHTML = `
            <div class="chat-msg-avatar">
                <img src="conslide_favicon.png" width="28" height="28" style="object-fit: contain; margin-top:2px;">
            </div>
            <div class="chat-msg-content">
                <div class="chat-msg-text" style="display:flex; align-items:center; height: 32px">
                    <div class="dot-pulse" style="margin-top: 4px;">
                        <div></div><div></div><div></div>
                    </div>
                </div>
            </div>
        `;
        messagesContainer.appendChild(msgDiv);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const ind = document.getElementById('chat-typing-indicator');
        if (ind) ind.remove();
    }

    function scrollToBottom() {
        requestAnimationFrame(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        });
    }

    chatInput.addEventListener('input', function () {
        this.style.height = '0px';
        const nextHeight = Math.min(
            Math.max(this.scrollHeight, CHAT_INPUT_MIN_HEIGHT_PX),
            CHAT_INPUT_MAX_HEIGHT_PX
        );
        this.style.height = nextHeight + 'px';
        if (this.value.trim().length > 0) {
            sendBtn.classList.add('active');
        } else {
            sendBtn.classList.remove('active');
        }
    });

    chatInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            e.stopPropagation();
            sendMessage();
        }
    });

    sendBtn.addEventListener('click', sendMessage);

    let lastGeneratedJson = "";
    let lastAction = 'create'; // Track if last action was create or edit
    let previousSlideJson = ""; // Store previous slide for undo

    window.applyLastGeneratedSlide = function () {
        if (!lastGeneratedJson) return;
        let action = 'create';
        try {
            const parsed = JSON.parse(lastGeneratedJson);
            if (parsed.action === 'edit') action = 'edit';
        } catch (e) { }

        lastAction = action;
        const command = action === 'edit' ? 'EDIT_CURRENT_SLIDE_FROM_JSON:' : 'CREATE_SLIDE_FROM_JSON:';
        if (window.chrome && window.chrome.webview) {
            window.chrome.webview.postMessage(command + lastGeneratedJson);
        }
        // Only show banner for edit actions - for create, close palette immediately
        if (action === 'edit') {
            showEditCompletionBanner(action);
        } else {
            if (window.closePalette) {
                window.closePalette();
            }
        }
    };

    // Show completion banner above input container
    function showEditCompletionBanner(action) {
        const inputWrapper = document.querySelector('.chat-input-wrapper');
        if (!inputWrapper) return;

        // Remove existing banner if any
        const existingBanner = document.querySelector('.chat-edit-banner');
        if (existingBanner) existingBanner.remove();

        const banner = document.createElement('div');
        banner.className = 'chat-edit-banner';
        banner.innerHTML = `
            <div class="chat-edit-banner-content">
                <div class="chat-edit-banner-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 6 9 17l-5-5"/>
                    </svg>
                </div>
                <div class="chat-edit-banner-text">
                    <span class="chat-edit-banner-title">Editing Complete</span>
                    <span class="chat-edit-banner-subtitle">Changes applied to current slide</span>
                </div>
            </div>
            <div class="chat-edit-banner-actions">
                <button class="chat-edit-btn chat-edit-accept" onclick="acceptEdit()">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 6 9 17l-5-5"/>
                    </svg>
                    Accept
                </button>
                <button class="chat-edit-btn chat-edit-undo" onclick="undoEdit()">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 7v6h6"/>
                        <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
                    </svg>
                    Undo
                </button>
            </div>
        `;

        inputWrapper.parentNode.insertBefore(banner, inputWrapper);
    }

    window.acceptEdit = function() {
        const banner = document.querySelector('.chat-edit-banner');
        if (banner) {
            banner.classList.add('chat-edit-banner-accepting');
            setTimeout(() => banner.remove(), 300);
        }
        if (window.closePalette) {
            window.closePalette();
        }
    };

    window.undoEdit = function() {
        if (lastAction === 'edit' && previousSlideJson) {
            // Send the previous slide back to restore
            if (window.chrome && window.chrome.webview) {
                window.chrome.webview.postMessage('EDIT_CURRENT_SLIDE_FROM_JSON:' + previousSlideJson);
            }
        }
        const banner = document.querySelector('.chat-edit-banner');
        if (banner) banner.remove();
    };

    /**
     * Optional: Receive context from C# if you want to edit current slide
     */
    window.setSlideContext = function (json) {
        slideContextContext = json;
        // Store the current slide context as previous for undo functionality
        previousSlideJson = json;
    };

    // Listen for slide JSON from C#
    if (window.chrome && window.chrome.webview) {
        window.chrome.webview.addEventListener('message', function(e) {
            if (typeof e.data === 'string' && e.data.startsWith('SLIDE_JSON:')) {
                const json = e.data.substring('SLIDE_JSON:'.length);
                slideContextContext = json;
                previousSlideJson = json;
            }
        });
    }

    async function sendMessage() {
        if (isWaitingForResponse) return;
        const text = chatInput.value.trim();
        if (!text) return;

        chatInput.value = '';
        chatInput.style.height = '18px';
        sendBtn.classList.remove('active');

        addMessage('user', text);

        isWaitingForResponse = true;
        addTypingIndicator();

        // Fetch fresh slide context before sending to AI
        if (window.chrome && window.chrome.webview) {
            const slideJsonPromise = new Promise(resolve => {
                window._slideJsonResolve = resolve;
                window.chrome.webview.postMessage('GET_SLIDE_JSON');
                // Timeout after 500ms if no response
                setTimeout(() => {
                    if (window._slideJsonResolve === resolve) {
                        window._slideJsonResolve = null;
                        resolve('{}');
                    }
                }, 500);
            });
            const freshSlideJson = await slideJsonPromise;
            if (freshSlideJson && freshSlideJson !== '{}') {
                slideContextContext = freshSlideJson;
                previousSlideJson = freshSlideJson;
            }
        }

        try {
            // Include chat history context in the prompt if we want, but simple implementation just sends text
            // In a real implementation we would send the full history to the edge function.
            // For now, if we prepend history to the text:
            let promptToSend = text;
            if (chatHistory.length > 0) {
                promptToSend = "Previous context:\n" + chatHistory.map(m => `${m.role}: ${m.content}`).join('\n') + "\n\nUser request: " + text;
            }

            let streamedText = '';
            let botMsgDiv = null;
            let jsonStarted = false;
            let statusSet = false;
            let detectedAction = null;
            let preJsonText = '';

            // Detect edit mode early based on slide context presence
            const hasSlideContext = slideContextContext && slideContextContext !== '{}';
            const isEditMode = hasSlideContext;

            const streamResult = await fetchAIGenerateSlideStream(promptToSend, slideContextContext, {
                onToken: (token, full) => {
                    streamedText = full;

                    if (!botMsgDiv) {
                        removeTypingIndicator();
                        botMsgDiv = addMessage('bot', '');
                    }

                    if (!jsonStarted) {
                        const jsonIdx = streamedText.indexOf('```json');
                        if (jsonIdx !== -1) {
                            jsonStarted = true;
                            preJsonText = streamedText.slice(0, jsonIdx).trim();
                            if (preJsonText) setMessageText(botMsgDiv, preJsonText);
                        } else {
                            setMessageText(botMsgDiv, streamedText);
                            return;
                        }
                    }

                    if (!statusSet) {
                        // Check if AI explicitly specifies action, otherwise use pre-detected mode
                        const actionMatch = streamedText.match(/\"action\"\s*:\s*\"(create|edit)\"/i);
                        if (actionMatch) {
                            detectedAction = actionMatch[1].toLowerCase();
                        } else {
                            detectedAction = isEditMode ? 'edit' : 'create';
                        }

                        const isEdit = detectedAction === 'edit';
                        const label = isEdit ? 'Editing slide' : 'Generating slide';
                        startStatusCard(botMsgDiv, label, isEdit ? [
                            'Reading slide context',
                            'Applying changes',
                            'Updating layout',
                            'Finalizing edits'
                        ] : [
                            'Analyzing request',
                            'Designing layout',
                            'Styling shapes',
                            'Finalizing slide'
                        ], isEdit);
                        statusSet = true;
                    }
                }
            });

            if (!botMsgDiv) {
                removeTypingIndicator();
                botMsgDiv = addMessage('bot', '');
            }

            isWaitingForResponse = false;

            const fullResponse = streamResult?.fullResponse || streamedText || '';

            chatHistory.push({ role: 'user', content: text });
            chatHistory.push({ role: 'assistant', content: fullResponse });

            // Keep history short (last 6 messages)
            if (chatHistory.length > 6) chatHistory = chatHistory.slice(-6);

            // Parse slide payload after full response
            const jsonMatch = fullResponse.match(/```json\s*([\s\S]*?)```/);
            if (jsonMatch) {
                const slideJson = jsonMatch[1].trim();
                lastGeneratedJson = slideJson;
                const explanation = fullResponse.replace(/```json[\s\S]*?```/g, '').trim();
                setMessageText(botMsgDiv, explanation || "I've generated a slide based on your request.");
                window.applyLastGeneratedSlide();
                finishStatusCard(
                    botMsgDiv,
                    detectedAction === 'edit' ? 'Slide edited' : 'Slide generated',
                    detectedAction === 'edit' ? 'Changes applied successfully' : 'Inserted into your presentation',
                    detectedAction === 'edit'
                );
            } else {
                // Ensure final render is applied
                setMessageText(botMsgDiv, fullResponse);
            }
        } catch (err) {
            removeTypingIndicator();
            isWaitingForResponse = false;
            addMessage('bot', "Error: " + err.message);
        }
    }
    window.reportAIContent = function(btn) {
        if (confirm("Would you like to report this AI-generated response as inappropriate? This helps us improve our safety filters.")) {
            btn.innerHTML = "Reported";
            btn.disabled = true;
            btn.style.opacity = "0.6";
            btn.style.cursor = "default";
            // In a production app, you would send this to your backend
            console.log("AI Content Reported");
        }
    };
})();
