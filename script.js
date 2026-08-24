/**
 * HELLO WORLD - UNIVERSAL APP CONTROLLER
 * Supports Navigation, Theming, Authentication, Contact Form, FAQ Accordion & Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
    // =========================================================================
    // 1. THEME TOGGLE & PERSISTENCE (WORKS ON ALL PAGES)
    // =========================================================================
    const body = document.body;
    const themeToggleBtn = document.getElementById('theme-toggle');

    // Initialize saved theme or default to dark
    const savedTheme = localStorage.getItem('hw_theme') || 'dark';
    if (savedTheme === 'light') {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
    } else {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            if (body.classList.contains('dark-theme')) {
                body.classList.remove('dark-theme');
                body.classList.add('light-theme');
                localStorage.setItem('hw_theme', 'light');
                showToast('☀️ Light mode enabled', 'info');
            } else {
                body.classList.remove('light-theme');
                body.classList.add('dark-theme');
                localStorage.setItem('hw_theme', 'dark');
                showToast('🌙 Dark mode enabled', 'info');
            }
        });
    }

    // =========================================================================
    // 2. MOBILE NAVIGATION DRAWER TOGGLE
    // =========================================================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNavDrawer = document.getElementById('mobile-nav-drawer');

    if (mobileMenuBtn && mobileNavDrawer) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileNavDrawer.classList.toggle('open');
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileNavDrawer.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileNavDrawer.classList.remove('open');
            }
        });
    }

    // =========================================================================
    // 3. TOAST NOTIFICATION UTILITY (AVAILABLE GLOBALLY)
    // =========================================================================
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    window.showToast = function(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let iconSvg = '';
        if (type === 'success') {
            iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        } else if (type === 'error') {
            iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
        } else {
            iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
        }

        toast.innerHTML = `${iconSvg}<span>${escapeHTML(message)}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 3600);
    };

    function escapeHTML(str) {
        return String(str).replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    // =========================================================================
    // 4. FAQ ACCORDION HANDLER (CONTACT & ABOUT PAGES)
    // =========================================================================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question-btn');
        if (questionBtn) {
            questionBtn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                // Close other open accordion items
                faqItems.forEach(other => {
                    if (other !== item) other.classList.remove('active');
                });
                item.classList.toggle('active', !isActive);
            });
        }
    });

    // =========================================================================
    // 5. CONTACT FORM HANDLER (CONTACT PAGE)
    // =========================================================================
    const contactForm = document.getElementById('contact-form');
    const contactSuccessCard = document.getElementById('contact-success-card');
    const btnSendAnother = document.getElementById('btn-send-another');
    const messageInput = document.getElementById('contact-message');
    const charCounter = document.getElementById('char-count');
    const categoryChips = document.querySelectorAll('.category-chip');
    const subjectSelect = document.getElementById('contact-subject');
    const fileDropzone = document.getElementById('file-dropzone');
    const fileInput = document.getElementById('file-input');
    const fileSelectedBadge = document.getElementById('file-selected-badge');
    const fileNameSpan = document.getElementById('selected-file-name');
    const removeFileBtn = document.getElementById('remove-file-btn');

    // Category Chips selection
    if (categoryChips.length > 0 && subjectSelect) {
        categoryChips.forEach(chip => {
            chip.addEventListener('click', () => {
                categoryChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                const catValue = chip.getAttribute('data-value');
                if (catValue && subjectSelect) {
                    subjectSelect.value = catValue;
                }
            });
        });

        subjectSelect.addEventListener('change', () => {
            const selectedVal = subjectSelect.value;
            categoryChips.forEach(chip => {
                if (chip.getAttribute('data-value') === selectedVal) {
                    chip.classList.add('active');
                } else {
                    chip.classList.remove('active');
                }
            });
        });
    }

    // Message Character Counter
    if (messageInput && charCounter) {
        messageInput.addEventListener('input', () => {
            const length = messageInput.value.length;
            charCounter.textContent = `${length} / 1000`;
            if (length > 900) {
                charCounter.style.color = '#f59e0b';
            } else {
                charCounter.style.color = '';
            }
        });
    }

    // Mock File Dropzone
    if (fileDropzone && fileInput) {
        fileDropzone.addEventListener('click', (e) => {
            if (e.target !== removeFileBtn && !removeFileBtn?.contains(e.target)) {
                fileInput.click();
            }
        });

        fileInput.addEventListener('change', () => {
            if (fileInput.files && fileInput.files[0]) {
                const file = fileInput.files[0];
                if (fileNameSpan) fileNameSpan.textContent = file.name;
                if (fileSelectedBadge) fileSelectedBadge.classList.add('show');
                showToast(`Attached: ${file.name}`, 'info');
            }
        });

        if (removeFileBtn) {
            removeFileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                fileInput.value = '';
                if (fileSelectedBadge) fileSelectedBadge.classList.remove('show');
                showToast('Attachment removed', 'info');
            });
        }
    }

    // Contact Form Submission
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameEl = document.getElementById('contact-name');
            const emailEl = document.getElementById('contact-email');
            const subjectEl = document.getElementById('contact-subject');
            const messageEl = document.getElementById('contact-message');
            const submitBtn = document.getElementById('contact-submit-btn');

            let isValid = true;

            // Clear errors
            document.querySelectorAll('.input-wrapper, .textarea-wrapper, .select-wrapper').forEach(w => w.classList.remove('error'));
            document.querySelectorAll('.error-msg').forEach(m => m.classList.remove('visible'));

            if (!nameEl || !nameEl.value.trim()) {
                nameEl?.closest('.input-wrapper')?.classList.add('error');
                const err = document.getElementById('contact-name-error');
                if (err) err.classList.add('visible');
                isValid = false;
            }

            if (!emailEl || !emailEl.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
                emailEl?.closest('.input-wrapper')?.classList.add('error');
                const err = document.getElementById('contact-email-error');
                if (err) err.classList.add('visible');
                isValid = false;
            }

            if (!messageEl || !messageEl.value.trim() || messageEl.value.trim().length < 10) {
                messageEl?.closest('.textarea-wrapper')?.classList.add('error');
                const err = document.getElementById('contact-message-error');
                if (err) err.classList.add('visible');
                isValid = false;
            }

            if (!isValid) return;

            // Loading state
            if (submitBtn) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
            }

            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                }

                // Update Recap Box
                const recapName = document.getElementById('recap-name');
                const recapEmail = document.getElementById('recap-email');
                const recapSubject = document.getElementById('recap-subject');

                if (recapName && nameEl) recapName.textContent = nameEl.value.trim();
                if (recapEmail && emailEl) recapEmail.textContent = emailEl.value.trim();
                if (recapSubject && subjectEl) recapSubject.textContent = subjectEl.options[subjectEl.selectedIndex]?.text || subjectEl.value;

                contactForm.style.display = 'none';
                if (contactSuccessCard) {
                    contactSuccessCard.classList.add('show');
                }

                showToast('🚀 Message delivered successfully! We will get back to you shortly.', 'success');
            }, 1200);
        });
    }

    if (btnSendAnother) {
        btnSendAnother.addEventListener('click', () => {
            if (contactForm) {
                contactForm.reset();
                contactForm.style.display = 'block';
            }
            if (contactSuccessCard) {
                contactSuccessCard.classList.remove('show');
            }
            if (charCounter) charCounter.textContent = '0 / 1000';
            if (fileSelectedBadge) fileSelectedBadge.classList.remove('show');
        });
    }

    // =========================================================================
    // 6. COPY TO CLIPBOARD BUTTONS (CONTACT CHANNELS)
    // =========================================================================
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const textToCopy = btn.getAttribute('data-copy');
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast(`📋 Copied: ${textToCopy}`, 'success');
                }).catch(() => {
                    showToast(`Copied to clipboard`, 'info');
                });
            }
        });
    });

    // =========================================================================
    // 7. AUTHENTICATION CONTROLLER (HELLO_WORLD.HTML PORTAL)
    // =========================================================================
    const authForm = document.getElementById('auth-form');
    if (authForm) {
        let currentMode = 'signin';

        const tabSignIn = document.getElementById('tab-signin');
        const tabSignUp = document.getElementById('tab-signup');
        const tabsContainer = document.querySelector('.tabs-container');
        const formTitle = document.getElementById('form-title');
        const formSubtitle = document.getElementById('form-subtitle');
        const footerText = document.getElementById('footer-text');
        const footerActionBtn = document.getElementById('footer-action-btn');

        const groupName = document.getElementById('group-name');
        const groupConfirmPassword = document.getElementById('group-confirm-password');
        const strengthMeterBox = document.getElementById('strength-meter-box');
        const termsText = document.querySelector('.terms-text');
        const rememberLabel = document.getElementById('remember-label');

        const nameInput = document.getElementById('name-input');
        const emailInput = document.getElementById('email-input');
        const passwordInput = document.getElementById('password-input');
        const confirmPasswordInput = document.getElementById('confirm-password-input');
        const togglePasswordBtn = document.getElementById('toggle-password-btn');

        const strengthBars = [
            document.getElementById('bar-1'),
            document.getElementById('bar-2'),
            document.getElementById('bar-3'),
            document.getElementById('bar-4')
        ];
        const strengthText = document.getElementById('strength-text');

        const nameError = document.getElementById('name-error');
        const emailError = document.getElementById('email-error');
        const passwordError = document.getElementById('password-error');
        const confirmPasswordError = document.getElementById('confirm-password-error');

        const submitBtn = document.getElementById('submit-btn');
        const btnText = document.getElementById('btn-text');

        const authCard = document.getElementById('auth-card');
        const welcomeCard = document.getElementById('welcome-card');
        const userAvatar = document.getElementById('user-avatar');
        const welcomeMsg = document.getElementById('welcome-msg');
        const infoEmail = document.getElementById('info-email');
        const btnLogout = document.getElementById('btn-logout');
        const btnExplore = document.getElementById('btn-explore');

        const btnGoogle = document.getElementById('btn-google');
        const btnGithub = document.getElementById('btn-github');
        const btnApple = document.getElementById('btn-apple');

        const btnForgotPassword = document.getElementById('btn-forgot-password');
        const forgotModal = document.getElementById('forgot-modal');
        const modalCloseBtn = document.getElementById('modal-close-btn');
        const resetForm = document.getElementById('reset-form');
        const resetEmail = document.getElementById('reset-email');

        function setAuthMode(mode) {
            currentMode = mode;
            clearErrors();

            const signupElements = [groupName, groupConfirmPassword, strengthMeterBox, termsText];

            if (mode === 'signup') {
                if (tabsContainer) tabsContainer.classList.add('signup-active');
                if (tabSignIn) tabSignIn.classList.remove('active');
                if (tabSignUp) tabSignUp.classList.add('active');

                if (formTitle) formTitle.textContent = 'Join Hello World';
                if (formSubtitle) formSubtitle.textContent = 'Create an account to start your journey today';
                if (btnText) btnText.textContent = 'Create Account';
                if (footerText) footerText.textContent = 'Already have an account?';
                if (footerActionBtn) footerActionBtn.textContent = 'Sign in';
                if (rememberLabel) rememberLabel.textContent = 'Agree to receive product updates';

                signupElements.forEach(el => {
                    if (el) el.classList.add('show');
                });
                if (nameInput) nameInput.setAttribute('required', 'true');
                if (confirmPasswordInput) confirmPasswordInput.setAttribute('required', 'true');
            } else {
                if (tabsContainer) tabsContainer.classList.remove('signup-active');
                if (tabSignUp) tabSignUp.classList.remove('active');
                if (tabSignIn) tabSignIn.classList.add('active');

                if (formTitle) formTitle.textContent = 'Hello World';
                if (formSubtitle) formSubtitle.textContent = 'Sign in to your account to continue exploring';
                if (btnText) btnText.textContent = 'Sign In to Account';
                if (footerText) footerText.textContent = "Don't have an account?";
                if (footerActionBtn) footerActionBtn.textContent = 'Sign up now';
                if (rememberLabel) rememberLabel.textContent = 'Remember me for 30 days';

                signupElements.forEach(el => {
                    if (el) el.classList.remove('show');
                });
                if (nameInput) nameInput.removeAttribute('required');
                if (confirmPasswordInput) confirmPasswordInput.removeAttribute('required');
            }
        }

        if (tabSignIn) tabSignIn.addEventListener('click', () => setAuthMode('signin'));
        if (tabSignUp) tabSignUp.addEventListener('click', () => setAuthMode('signup'));
        if (footerActionBtn) {
            footerActionBtn.addEventListener('click', () => {
                setAuthMode(currentMode === 'signin' ? 'signup' : 'signin');
            });
        }

        if (togglePasswordBtn && passwordInput) {
            togglePasswordBtn.addEventListener('click', () => {
                const isPassword = passwordInput.getAttribute('type') === 'password';
                const newType = isPassword ? 'text' : 'password';
                passwordInput.setAttribute('type', newType);
                if (confirmPasswordInput) {
                    confirmPasswordInput.setAttribute('type', newType);
                }
                togglePasswordBtn.classList.toggle('active', isPassword);
            });
        }

        if (passwordInput) {
            passwordInput.addEventListener('input', () => {
                if (currentMode !== 'signup') return;
                const val = passwordInput.value;
                const strength = evaluatePasswordStrength(val);
                updateStrengthUI(strength);
            });
        }

        function evaluatePasswordStrength(password) {
            if (!password) return 0;
            let score = 0;
            if (password.length >= 8) score++;
            if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
            if (/[0-9]/.test(password)) score++;
            if (/[^A-Za-z0-9]/.test(password)) score++;
            return score;
        }

        function updateStrengthUI(score) {
            const levels = [
                { text: 'Too Weak', class: 'weak', color: '#f43f5e' },
                { text: 'Fair', class: 'fair', color: '#f59e0b' },
                { text: 'Good', class: 'good', color: '#38bdf8' },
                { text: 'Strong', class: 'strong', color: '#10b981' }
            ];

            strengthBars.forEach((bar, index) => {
                if (bar) {
                    if (index < score) {
                        bar.style.backgroundColor = levels[score - 1].color;
                    } else {
                        bar.style.backgroundColor = '';
                    }
                }
            });

            if (strengthText) {
                if (score > 0) {
                    const currentLevel = levels[score - 1];
                    strengthText.textContent = currentLevel.text;
                    strengthText.className = `strength-value ${currentLevel.class}`;
                } else {
                    strengthText.textContent = 'Weak';
                    strengthText.className = 'strength-value weak';
                }
            }
        }

        function validateEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        function clearErrors() {
            [nameError, emailError, passwordError, confirmPasswordError].forEach(err => {
                if (err) err.classList.remove('visible');
            });
            document.querySelectorAll('.input-wrapper').forEach(w => w.classList.remove('error'));
        }

        function showError(input, errorElement, message) {
            if (input) input.closest('.input-wrapper')?.classList.add('error');
            if (errorElement) {
                if (message) errorElement.textContent = message;
                errorElement.classList.add('visible');
            }
        }

        [nameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => {
            if (input) {
                input.addEventListener('input', () => {
                    input.closest('.input-wrapper')?.classList.remove('error');
                    const err = input.closest('.form-group')?.querySelector('.error-msg');
                    if (err) err.classList.remove('visible');
                });
            }
        });

        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearErrors();

            let isValid = true;
            const emailVal = emailInput ? emailInput.value.trim() : '';
            const passwordVal = passwordInput ? passwordInput.value : '';

            if (currentMode === 'signup' && nameInput) {
                const nameVal = nameInput.value.trim();
                if (!nameVal) {
                    showError(nameInput, nameError, 'Please enter your full name');
                    isValid = false;
                }

                if (confirmPasswordInput) {
                    const confirmVal = confirmPasswordInput.value;
                    if (passwordVal !== confirmVal) {
                        showError(confirmPasswordInput, confirmPasswordError, 'Passwords do not match');
                        isValid = false;
                    }
                }
            }

            if (!emailVal || !validateEmail(emailVal)) {
                showError(emailInput, emailError, 'Please enter a valid email address');
                isValid = false;
            }

            if (!passwordVal || passwordVal.length < 6) {
                showError(passwordInput, passwordError, 'Password must be at least 6 characters');
                isValid = false;
            }

            if (!isValid) return;

            if (submitBtn) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
            }

            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                }

                const displayName = currentMode === 'signup' && nameInput && nameInput.value.trim() 
                    ? nameInput.value.trim() 
                    : emailVal.split('@')[0];

                completeAuthentication(displayName, emailVal);
            }, 1200);
        });

        function handleSocialLogin(providerName) {
            showToast(`Connecting with ${providerName}...`, 'info');
            if (submitBtn) submitBtn.classList.add('loading');

            setTimeout(() => {
                if (submitBtn) submitBtn.classList.remove('loading');
                const mockName = `${providerName} User`;
                const mockEmail = `user@${providerName.toLowerCase()}.com`;
                completeAuthentication(mockName, mockEmail);
                showToast(`Successfully connected with ${providerName}!`, 'success');
            }, 1000);
        }

        if (btnGoogle) btnGoogle.addEventListener('click', () => handleSocialLogin('Google'));
        if (btnGithub) btnGithub.addEventListener('click', () => handleSocialLogin('GitHub'));
        if (btnApple) btnApple.addEventListener('click', () => handleSocialLogin('Apple'));

        function completeAuthentication(name, email) {
            const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'HW';
            if (userAvatar) userAvatar.textContent = initials;
            if (welcomeMsg) welcomeMsg.innerHTML = `Welcome to your dashboard, <strong>${escapeHTML(name)}</strong>. You are successfully authenticated!`;
            if (infoEmail) infoEmail.textContent = email;

            if (authCard) authCard.style.display = 'none';
            if (welcomeCard) welcomeCard.classList.remove('hidden');

            showToast(`🎉 Welcome to Hello World, ${name}!`, 'success');
        }

        if (btnLogout) {
            btnLogout.addEventListener('click', () => {
                if (welcomeCard) welcomeCard.classList.add('hidden');
                if (authCard) authCard.style.display = 'block';
                authForm.reset();
                clearErrors();
                setAuthMode('signin');
                showToast('Signed out successfully', 'info');
            });
        }

        if (btnExplore) {
            btnExplore.addEventListener('click', () => {
                showToast('🚀 Launching your personalized workspace...', 'success');
            });
        }

        if (btnForgotPassword && forgotModal) {
            btnForgotPassword.addEventListener('click', () => {
                forgotModal.classList.remove('hidden');
                if (resetEmail && emailInput) {
                    resetEmail.value = emailInput.value.trim();
                    resetEmail.focus();
                }
            });
        }

        if (modalCloseBtn && forgotModal) {
            modalCloseBtn.addEventListener('click', () => {
                forgotModal.classList.add('hidden');
            });
        }

        if (forgotModal) {
            forgotModal.addEventListener('click', (e) => {
                if (e.target === forgotModal) {
                    forgotModal.classList.add('hidden');
                }
            });
        }

        if (resetForm) {
            resetForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = resetEmail ? resetEmail.value.trim() : '';
                if (!email || !validateEmail(email)) {
                    showToast('Please enter a valid email address', 'error');
                    return;
                }

                if (forgotModal) forgotModal.classList.add('hidden');
                showToast(`📬 Password reset link sent to ${email}`, 'success');
                resetForm.reset();
            });
        }
    }
});
