/* ==========================================================================
   NorthPeak Digital — Interactive Project Assistant Engine
   Filename: Chatbot/chatbot.js
   ========================================================================== */

(function (window, document) {
    'use strict';

    const CONFIG = {
        STORAGE_KEY: 'northpeak_chat_state_v1',
        TYPING_SPEED_MS: 12,
        MIN_TYPING_DELAY: 400,
        MAX_TYPING_DELAY: 1200,
        SCROLL_SMOOTH: true,
        AUDIO_ENABLED: true,
        FORM_IDS: {
            FORM: 'contact-form',
            PROJECT: 'project',
            BUDGET: 'budget',
            MESSAGE: 'message',
            SECTION: 'contact'
        }
    };

    const ICONS = {
        chat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
        close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
        reset: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>`,
        avatar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 19L9 6L13 13L16 8L22 19H2Z"/></svg>`
    };

    class ChatState {
        constructor() {
            this.answers = {};
            this.history = [];
            this.currentNodeId = 'start';
            this.isOpen = false;
            this.isTyping = false;
            this.isComplete = false;
        }

        recordAnswer(key, value) {
            if (key) {
                this.answers[key] = value;
            }
        }

        pushHistory(sender, text, options = null) {
            this.history.push({
                id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                sender,
                text,
                options,
                timestamp: new Date().toISOString()
            });
        }

        reset() {
            this.answers = {};
            this.history = [];
            this.currentNodeId = 'start';
            this.isTyping = false;
            this.isComplete = false;
        }

        serialize() {
            return JSON.stringify({
                answers: this.answers,
                history: this.history,
                currentNodeId: this.currentNodeId,
                isComplete: this.isComplete
            });
        }

        deserialize(jsonString) {
            try {
                const data = JSON.parse(jsonString);
                this.answers = data.answers || {};
                this.history = data.history || [];
                this.currentNodeId = data.currentNodeId || 'start';
                this.isComplete = data.isComplete || false;
                return true;
            } catch (e) {
                console.warn('[NorthPeak Assistant] Failed to parse saved chat state:', e);
                return false;
            }
        }
    }

    class AudioEffects {
        constructor() {
            this.ctx = null;
        }

        init() {
            if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                this.ctx = new AudioCtx();
            }
        }

        playPop() {
            if (!CONFIG.AUDIO_ENABLED) return;
            try {
                this.init();
                if (!this.ctx) return;
                
                if (this.ctx.state === 'suspended') {
                    this.ctx.resume();
                }

                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(440, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);

                gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start();
                osc.stop(this.ctx.currentTime + 0.08);
            } catch (e) {}
        }
    }

    class NorthPeakAssistant {
        constructor() {
            this.state = new ChatState();
            this.audio = new AudioEffects();
            this.data = window.chatbotData || {};

            this.dom = {
                toggleBtn: null,
                widget: null,
                header: null,
                body: null,
                footer: null,
                resetBtn: null,
                closeBtn: null
            };

            this.init();
        }

        init() {
            if (document.querySelector('.chatbot-toggle') || document.querySelector('.chatbot')) {
                console.warn('[NorthPeak Assistant] Chatbot instance already exists on page.');
                return;
            }

            this.buildDOM();
            this.bindEvents();
            this.bindKeyboardShortcuts();
            this.bindMobileViewportFixes();
            this.loadSavedState();
        }

        detectUserCurrency() {
            try {
                const timeZone = (Intl.DateTimeFormat().resolvedOptions().timeZone || '').toLowerCase();
                const lang = (navigator.language || navigator.userLanguage || '').toLowerCase();

                if (timeZone.includes('kolkata') || timeZone.includes('calcutta') || lang.endsWith('-in') || lang === 'hi') {
                    return 'INR';
                }
            } catch (e) {}
            return 'USD';
        }

        buildDOM() {
            this.dom.toggleBtn = document.createElement('button');
            this.dom.toggleBtn.className = 'chatbot-toggle';
            this.dom.toggleBtn.setAttribute('type', 'button');
            this.dom.toggleBtn.setAttribute('aria-label', 'Open Project Assistant Chat');
            this.dom.toggleBtn.setAttribute('aria-expanded', 'false');
            this.dom.toggleBtn.innerHTML = ICONS.chat;

            this.dom.widget = document.createElement('div');
            this.dom.widget.className = 'chatbot';
            this.dom.widget.setAttribute('aria-hidden', 'true');
            this.dom.widget.setAttribute('role', 'dialog');
            this.dom.widget.setAttribute('aria-label', 'NorthPeak Project Assistant');

            this.dom.widget.innerHTML = `
                <div class="chatbot-header">
                    <div class="chatbot-brand">
                        <div class="chatbot-avatar">
                            ${ICONS.avatar}
                        </div>
                        <div class="chatbot-title">
                            <strong>NorthPeak Assistant</strong>
                            <span>Project Advisor</span>
                        </div>
                    </div>
                    <div class="chatbot-actions">
                        <button class="chatbot-icon-btn" id="chatbot-reset" type="button" title="Restart conversation" aria-label="Restart conversation">
                            ${ICONS.reset}
                        </button>
                        <button class="chatbot-icon-btn" id="chatbot-close" type="button" title="Close chat" aria-label="Close chat">
                            ${ICONS.close}
                        </button>
                    </div>
                </div>
                <div class="chatbot-body" id="chatbot-body" aria-live="polite"></div>
                <div class="chatbot-footer">
                    <span>NorthPeak Digital • Responsive Web Builds</span>
                </div>
            `;

            document.body.appendChild(this.dom.toggleBtn);
            document.body.appendChild(this.dom.widget);

            this.dom.body = document.getElementById('chatbot-body');
            this.dom.resetBtn = document.getElementById('chatbot-reset');
            this.dom.closeBtn = document.getElementById('chatbot-close');
        }

        bindEvents() {
            this.dom.toggleBtn.addEventListener('click', () => this.toggle());
            this.dom.closeBtn.addEventListener('click', () => this.close());
            this.dom.resetBtn.addEventListener('click', () => this.reset());

            this.dom.body.addEventListener('click', (e) => {
                // Multi-select option checkbox toggle
                const multiOptionBtn = e.target.closest('.chat-option[data-multi="true"]');
                if (multiOptionBtn && !multiOptionBtn.disabled) {
                    multiOptionBtn.classList.toggle('selected');
                    const isSelected = multiOptionBtn.classList.contains('selected');
                    const rawText = multiOptionBtn.getAttribute('data-raw-text') || multiOptionBtn.textContent.replace(/^[☐☑]\s*/, '');
                    
                    multiOptionBtn.textContent = `${isSelected ? '☑' : '☐'} ${rawText}`;
                    this.audio.playPop();
                    return;
                }

                // Submit Multi-select
                const multiSubmitBtn = e.target.closest('.chat-multi-submit');
                if (multiSubmitBtn && !multiSubmitBtn.disabled && !this.state.isTyping) {
                    const stepId = multiSubmitBtn.getAttribute('data-step-id');
                    const stepData = this.data[stepId];
                    if (stepData) {
                        this.handleMultiSelectSubmit(stepData, multiSubmitBtn.closest('.chat-options'));
                    }
                    return;
                }

                // Single-select options
                const targetBtn = e.target.closest('.chat-option:not([data-multi="true"])');
                if (!targetBtn || targetBtn.disabled || this.state.isTyping) return;

                const stepId = targetBtn.getAttribute('data-step-id');
                const optionIndex = parseInt(targetBtn.getAttribute('data-option-index'), 10);
                const stepData = this.data[stepId];

                let options = stepData ? stepData.options : null;
                if (options && !Array.isArray(options) && typeof options === 'object') {
                    const currency = this.detectUserCurrency();
                    options = options[currency] || options.USD || options.INR || [];
                }

                if (stepData && options && options[optionIndex]) {
                    const selectedOption = options[optionIndex];
                    this.handleOptionSelection(selectedOption, stepData);
                }
            });
        }

        bindKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.state.isOpen) {
                    this.close();
                }
            });
        }

        bindMobileViewportFixes() {
            if (window.visualViewport) {
                window.visualViewport.addEventListener('resize', () => {
                    if (this.state.isOpen && window.innerWidth <= 640) {
                        this.dom.widget.style.height = `${window.visualViewport.height - 100}px`;
                    }
                });
            }
        }

        toggle() {
            if (this.state.isOpen) {
                this.close();
            } else {
                this.open();
            }
        }

        open() {
            if (this.state.isOpen) return;

            this.state.isOpen = true;
            this.dom.widget.classList.add('open');
            this.dom.widget.setAttribute('aria-hidden', 'false');
            this.dom.toggleBtn.classList.add('active');
            this.dom.toggleBtn.setAttribute('aria-expanded', 'true');
            this.dom.toggleBtn.innerHTML = ICONS.close;

            if (this.state.history.length === 0) {
                this.processNode('start');
            } else {
                this.scrollToBottom();
            }

            this.saveState();
        }

        close() {
            if (!this.state.isOpen) return;

            this.state.isOpen = false;
            this.dom.widget.classList.remove('open');
            this.dom.widget.setAttribute('aria-hidden', 'true');
            this.dom.toggleBtn.classList.remove('active');
            this.dom.toggleBtn.setAttribute('aria-expanded', 'false');
            this.dom.toggleBtn.innerHTML = ICONS.chat;

            this.saveState();
        }

        reset() {
            this.dom.body.innerHTML = '';
            this.state.reset();
            this.clearSavedState();
            this.processNode('start');
        }

        processNode(nodeId) {
            const node = this.data[nodeId];
            if (!node) {
                console.error(`[NorthPeak Assistant] Node missing in data: "${nodeId}"`);
                return;
            }

            node.id = nodeId;
            this.state.currentNodeId = nodeId;

            this.showTypingIndicator();

            const textLength = node.message ? node.message.length : 0;
            const calculatedDelay = Math.min(
                Math.max(textLength * CONFIG.TYPING_SPEED_MS, CONFIG.MIN_TYPING_DELAY),
                CONFIG.MAX_TYPING_DELAY
            );

            setTimeout(() => {
                this.removeTypingIndicator();
                this.renderBotMessage(node.message);
                this.state.pushHistory('bot', node.message);

                let options = node.options;
                if (options && !Array.isArray(options) && typeof options === 'object') {
                    const currency = this.detectUserCurrency();
                    options = options[currency] || options.USD || options.INR || [];
                }

                if (options && options.length > 0) {
                    this.renderOptions(options, node.id, node.multiSelect);
                } else if (node.next) {
                    this.processNode(node.next);
                } else if (node.end) {
                    this.state.isComplete = true;
                    this.renderSummaryAndCTA();
                }

                this.saveState();
            }, calculatedDelay);
        }

        handleOptionSelection(option, parentNode) {
            if (this.state.isTyping) return;

            this.audio.playPop();

            if (parentNode.save) {
                this.state.recordAnswer(parentNode.save, option.value);
            } else if (parentNode.id === 'start') {
                this.state.recordAnswer('Project Type', option.value);
            }

            const activeOptionsDiv = this.dom.body.querySelector('.chat-options:last-child');
            if (activeOptionsDiv) {
                const buttons = activeOptionsDiv.querySelectorAll('.chat-option');
                buttons.forEach(btn => {
                    btn.disabled = true;
                    if (btn.textContent.trim() === option.text.trim()) {
                        btn.style.background = 'var(--accent-soft, #eef2ff)';
                        btn.style.borderColor = 'var(--accent, #6366f1)';
                    } else {
                        btn.style.opacity = '0.5';
                    }
                });
            }

            this.renderUserMessage(option.text);
            this.state.pushHistory('user', option.text);

            if (option.next) {
                this.processNode(option.next);
            }
        }

        handleMultiSelectSubmit(parentNode, containerEl) {
            let options = parentNode.options;
            if (options && !Array.isArray(options) && typeof options === 'object') {
                const currency = this.detectUserCurrency();
                options = options[currency] || options.USD || options.INR || [];
            }

            const selectedBtns = containerEl.querySelectorAll('.chat-option.selected');
            const selectedValues = [];
            const selectedTexts = [];

            selectedBtns.forEach(btn => {
                const optIndex = parseInt(btn.getAttribute('data-option-index'), 10);
                const opt = options ? options[optIndex] : null;
                if (opt) {
                    selectedValues.push(opt.value);
                    selectedTexts.push(opt.text);
                }
            });

            const finalValue = selectedValues.length > 0 ? selectedValues.join(', ') : 'None Selected';
            const userDisplayText = selectedTexts.length > 0 ? selectedTexts.join(', ') : 'None Selected';

            if (parentNode.save) {
                this.state.recordAnswer(parentNode.save, finalValue);
            }

            // Disable container controls after submission
            const allBtns = containerEl.querySelectorAll('button');
            allBtns.forEach(btn => btn.disabled = true);

            this.renderUserMessage(userDisplayText);
            this.state.pushHistory('user', userDisplayText);

            if (parentNode.next) {
                this.processNode(parentNode.next);
            }
        }

        renderBotMessage(text) {
            const msgNode = document.createElement('div');
            msgNode.className = 'message bot';
            
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            bubble.innerHTML = this.formatMarkdownText(text);

            msgNode.appendChild(bubble);
            this.dom.body.appendChild(msgNode);
            this.scrollToBottom();
        }

        renderUserMessage(text) {
            const msgNode = document.createElement('div');
            msgNode.className = 'message user';

            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            bubble.textContent = text;

            msgNode.appendChild(bubble);
            this.dom.body.appendChild(msgNode);
            this.scrollToBottom();
        }

        renderOptions(options, stepId, isMultiSelect = false) {
            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'chat-options';

            options.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = 'chat-option';
                btn.type = 'button';
                btn.setAttribute('data-step-id', stepId);
                btn.setAttribute('data-option-index', idx);
                
                if (isMultiSelect) {
                    btn.setAttribute('data-multi', 'true');
                    btn.setAttribute('data-raw-text', opt.text);
                    btn.textContent = `☐ ${opt.text}`;
                } else {
                    btn.textContent = opt.text;
                }

                optionsDiv.appendChild(btn);
            });

            if (isMultiSelect) {
                const submitBtn = document.createElement('button');
                submitBtn.className = 'chat-multi-submit';
                submitBtn.type = 'button';
                submitBtn.setAttribute('data-step-id', stepId);
                submitBtn.style.width = '100%';
                submitBtn.style.marginTop = '8px';
                submitBtn.style.padding = '8px 12px';
                submitBtn.style.borderRadius = '6px';
                submitBtn.style.border = 'none';
                submitBtn.style.background = 'var(--accent, #6366f1)';
                submitBtn.style.color = '#fff';
                submitBtn.style.fontWeight = '600';
                submitBtn.style.cursor = 'pointer';
                submitBtn.textContent = 'Continue ➔';

                optionsDiv.appendChild(submitBtn);
            }

            this.dom.body.appendChild(optionsDiv);
            this.scrollToBottom();
        }

        showTypingIndicator() {
            if (this.dom.body.querySelector('#chatbot-typing')) return;

            this.state.isTyping = true;
            const typingWrapper = document.createElement('div');
            typingWrapper.className = 'message bot typing-wrapper';
            typingWrapper.id = 'chatbot-typing';

            typingWrapper.innerHTML = `
                <div class="bubble typing">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            `;

            this.dom.body.appendChild(typingWrapper);
            this.scrollToBottom();
        }

        removeTypingIndicator() {
            this.state.isTyping = false;
            const typingEl = document.getElementById('chatbot-typing');
            if (typingEl) {
                typingEl.remove();
            }
        }

        scrollToBottom() {
            requestAnimationFrame(() => {
                if (CONFIG.SCROLL_SMOOTH) {
                    this.dom.body.scrollTo({
                        top: this.dom.body.scrollHeight,
                        behavior: 'smooth'
                    });
                } else {
                    this.dom.body.scrollTop = this.dom.body.scrollHeight;
                }
            });
        }

        formatMarkdownText(text) {
            if (!text) return '';
            let formatted = text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');

            formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            formatted = formatted.replace(/\n/g, '<br>');

            return formatted;
        }

        renderSummaryAndCTA() {
            const summaryDiv = document.createElement('div');
            summaryDiv.className = 'message bot';

            let html = `<div class="bubble" style="border: 1px solid var(--accent, #6366f1); background: var(--panel-2, #f9fafb);">`;
            html += `<strong>📋 Project Summary:</strong><br><br>`;

            const keys = Object.keys(this.state.answers);
            if (keys.length > 0) {
                keys.forEach(k => {
                    const val = Array.isArray(this.state.answers[k]) 
                        ? this.state.answers[k].join(', ') 
                        : this.state.answers[k];
                    html += `• <strong>${k}:</strong> ${val}<br>`;
                });
            } else {
                html += `<em>Custom Inquiry Details</em><br>`;
            }

            html += `</div>`;
            summaryDiv.innerHTML = html;
            this.dom.body.appendChild(summaryDiv);

            const ctaContainer = document.createElement('div');
            ctaContainer.className = 'chat-options';
            
            // Primary CTA: Autofill Form
            const fillBtn = document.createElement('button');
            fillBtn.className = 'chat-option';
            fillBtn.type = 'button';
            fillBtn.style.background = 'var(--accent, #6366f1)';
            fillBtn.style.color = 'var(--accent-contrast, #ffffff)';
            fillBtn.style.fontWeight = '600';
            fillBtn.style.width = '100%';
            fillBtn.style.textAlign = 'center';
            fillBtn.style.marginBottom = '6px';
            fillBtn.innerHTML = '🚀 Populate Inquiry Form & Send';

            fillBtn.addEventListener('click', () => {
                this.autofillContactForm();
                this.close();

                const contactEl = document.getElementById(CONFIG.FORM_IDS.SECTION);
                if (contactEl) {
                    contactEl.scrollIntoView({ behavior: 'smooth' });
                }
            });

            // Secondary CTA: Start another inquiry (Resets answers for clean session)
            const restartBtn = document.createElement('button');
            restartBtn.className = 'chat-option';
            restartBtn.type = 'button';
            restartBtn.style.width = '100%';
            restartBtn.style.textAlign = 'center';
            restartBtn.innerHTML = '🔄 Plan Another Project';

            restartBtn.addEventListener('click', () => {
                fillBtn.disabled = true;
                restartBtn.disabled = true;
                this.state.answers = {}; // Reset answers for clean session
                this.state.isComplete = false;
                this.processNode('start');
            });

            ctaContainer.appendChild(fillBtn);
            ctaContainer.appendChild(restartBtn);
            this.dom.body.appendChild(ctaContainer);
            this.scrollToBottom();
        }

        autofillContactForm() {
            const form = document.getElementById(CONFIG.FORM_IDS.FORM);
            if (!form) return;

            // 1. Autofill Project Type Dropdown (#project)
            const projectSelect = form.querySelector('#' + CONFIG.FORM_IDS.PROJECT);
            if (projectSelect) {
                const websiteType = (this.state.answers['Website Type'] || '').trim().toLowerCase();
                const projectType = (this.state.answers['Project Type'] || '').trim().toLowerCase();
                
                let targetFormValue = '';

                // Categorize accurately into HTML option values ("New website", "Redesign", "Web app")
                if (websiteType.includes('redesign')) {
                    targetFormValue = 'redesign';
                } else if (projectType.includes('web application') || projectType.includes('web app')) {
                    targetFormValue = 'web app';
                } else if (websiteType.includes('new') || websiteType !== '' || projectType !== '') {
                    targetFormValue = 'new website';
                }

                let matchedIndex = -1;
                for (let i = 0; i < projectSelect.options.length; i++) {
                    const optVal = projectSelect.options[i].value.trim().toLowerCase();
                    const optTxt = projectSelect.options[i].text.trim().toLowerCase();

                    if (targetFormValue && (optVal === targetFormValue || optTxt === targetFormValue)) {
                        matchedIndex = i;
                        break;
                    }
                }

                if (matchedIndex !== -1) {
                    projectSelect.selectedIndex = matchedIndex;
                    projectSelect.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }

            // 2. Autofill Budget Range Dropdown
            const budgetSelect = form.querySelector('#' + CONFIG.FORM_IDS.BUDGET);
            if (budgetSelect && this.state.answers['Budget']) {
                const targetBudget = String(this.state.answers['Budget']).trim();
                let matchedIndex = -1;

                // Exact text/value match first
                for (let i = 0; i < budgetSelect.options.length; i++) {
                    const optTxt = budgetSelect.options[i].text.trim();
                    const optVal = budgetSelect.options[i].value.trim();
                    if (optTxt === targetBudget || optVal === targetBudget) {
                        matchedIndex = i;
                        break;
                    }
                }

                // Tier index mapping fallback if USD budget is selected but select element has INR options
                if (matchedIndex === -1 && targetBudget !== 'Not Sure Yet') {
                    const usdTiers = ['Under $200', '$200 – $500', '$500 – $1,000', '$1,000+'];
                    const inrTiers = ['Under ₹15,000', '₹15,000 – ₹35,000', '₹35,000 – ₹75,000', '₹75,000+'];

                    let tierIdx = usdTiers.indexOf(targetBudget);
                    if (tierIdx === -1) tierIdx = inrTiers.indexOf(targetBudget);

                    if (tierIdx !== -1 && budgetSelect.options.length > tierIdx + 1) {
                        matchedIndex = tierIdx + 1;
                    }
                }

                if (matchedIndex !== -1) {
                    budgetSelect.selectedIndex = matchedIndex;
                    budgetSelect.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }

            // 3. Populate structured message body
            const messageArea = form.querySelector('#' + CONFIG.FORM_IDS.MESSAGE);
            if (messageArea) {
                let note = "Project summary generated via NorthPeak Assistant:\n";
                Object.keys(this.state.answers).forEach(k => {
                    const val = Array.isArray(this.state.answers[k]) 
                        ? this.state.answers[k].join(', ') 
                        : this.state.answers[k];
                    note += `• ${k}: ${val}\n`;
                });
                messageArea.value = note;
                messageArea.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }

        saveState() {
            try {
                localStorage.setItem(CONFIG.STORAGE_KEY, this.state.serialize());
            } catch (e) {}
        }

        loadSavedState() {
            try {
                const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
                if (!raw) return;

                if (this.state.deserialize(raw)) {
                    this.rebuildUIFromHistory();
                }
            } catch (e) {
                console.warn('[NorthPeak Assistant] Error restoring saved state:', e);
            }
        }

        clearSavedState() {
            try {
                localStorage.removeItem(CONFIG.STORAGE_KEY);
            } catch (e) {}
        }

        rebuildUIFromHistory() {
            if (this.state.history.length === 0) return;

            this.dom.body.innerHTML = '';
            
            this.state.history.forEach(item => {
                if (item.sender === 'bot') {
                    this.renderBotMessage(item.text);
                } else if (item.sender === 'user') {
                    this.renderUserMessage(item.text);
                }
            });

            if (this.state.isComplete) {
                this.renderSummaryAndCTA();
            } else if (this.state.currentNodeId && this.data[this.state.currentNodeId]) {
                const currNode = this.data[this.state.currentNodeId];
                let options = currNode.options;
                if (options && !Array.isArray(options) && typeof options === 'object') {
                    const currency = this.detectUserCurrency();
                    options = options[currency] || options.USD || options.INR || [];
                }
                if (options && options.length > 0) {
                    this.renderOptions(options, currNode.id, currNode.multiSelect);
                }
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.northpeakAssistant = new NorthPeakAssistant();
        });
    } else {
        window.northpeakAssistant = new NorthPeakAssistant();
    }

})(window, document);