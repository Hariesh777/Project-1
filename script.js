/**
 * HELLO WORLD - MODERN AUTHENTICATION & INTERACTIVITY CONTROLLER
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- State Variables ---
    let currentMode = 'signin'; // 'signin' or 'signup'

    // --- DOM Elements ---
    const body = document.body;
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Tabs & Headers
    const tabSlider = document.getElementById('tab-slider');
    const tabsContainer = document.querySelector('.tabs-container');
    const tabSignIn = document.getElementById('tab-signin');
    const tabSignUp = document.getElementById('tab-signup');
    const formTitle = document.getElementById('form-title');
    const formSubtitle = document.getElementById('form-subtitle');
    const footerText = document.getElementById('footer-text');
    const footerActionBtn = document.getElementById('footer-action-btn');
    
    // Form & Groups
    const authForm = document.getElementById('auth-form');
    const groupName = document.getElementById('group-name');
    const groupEmail = document.getElementById('group-email');
    const groupPassword = document.getElementById('group-password');
    const groupConfirmPassword = document.getElementById('group-confirm-password');
    const strengthMeterBox = document.getElementById('strength-meter-box');
    const termsText = document.querySelector('.terms-text');
    const rememberLabel = document.getElementById('remember-label');
    
    // Inputs
    const nameInput = document.getElementById('name-input');
    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');
    const confirmPasswordInput = document.getElementById('confirm-password-input');
    const togglePasswordBtn = document.getElementById('toggle-password-btn');
    
    // Strength Meter Bars
    const strengthBars = [
        document.getElementById('bar-1'),
        document.getElementById('bar-2'),
        document.getElementById('bar-3'),
        document.getElementById('bar-4')
    ];
    const strengthText = document.getElementById('strength-text');
    
    // Error Messages
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const confirmPasswordError = document.getElementById('confirm-password-error');
    
    // Submit Button
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    
    // Cards & Welcome View
    const authCard = document.getElementById('auth-card');
    const welcomeCard = document.getElementById('welcome-card');
    const userAvatar = document.getElementById('user-avatar');
    const welcomeMsg = document.getElementById('welcome-msg');
    const infoEmail = document.getElementById('info-email');
    const btnLogout = document.getElementById('btn-logout');
    const btnExplore = document.getElementById('btn-explore');

    // Social Buttons
    const btnGoogle = document.getElementById('btn-google');
    const btnGithub = document.getElementById('btn-github');
    const btnApple = document.getElementById('btn-apple');

    // Forgot Password Modal
    const btnForgotPassword = document.getElementById('btn-forgot-password');
    const forgotModal = document.getElementById('forgot-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const resetForm = document.getElementById('reset-form');
    const resetEmail = document.getElementById('reset-email');
    
    // Toast Container
    const toastContainer = document.getElementById('toast-container');

    // =========================================================================
    // 1. THEME TOGGLE & PERSISTENCE
    // =========================================================================
    const savedTheme = localStorage.getItem('hw_theme') || 'dark';
    if (savedTheme === 'light') {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
    }

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

    // =========================================================================
    // 2. TAB SWITCHING (SIGN IN / SIGN UP)
    // =========================================================================
    function setAuthMode(mode) {
        currentMode = mode;
        clearErrors();

        const signupElements = [groupName, groupConfirmPassword, strengthMeterBox, termsText];

        if (mode === 'signup') {
            tabsContainer.classList.add('signup-active');
            tabSignIn.classList.remove('active');
            tabSignUp.classList.add('active');

            formTitle.textContent = 'Join Hello World';
            formSubtitle.textContent = 'Create an account to start your journey today';
            btnText.textContent = 'Create Account';
            footerText.textContent = 'Already have an account?';
            footerActionBtn.textContent = 'Sign in';
            rememberLabel.textContent = 'Agree to receive product updates';

            signupElements.forEach(el => {
                if (el) el.classList.add('show');
            });
            nameInput.setAttribute('required', 'true');
            confirmPasswordInput.setAttribute('required', 'true');
        } else {
            tabsContainer.classList.remove('signup-active');
            tabSignUp.classList.remove('active');
            tabSignIn.classList.add('active');

            formTitle.textContent = 'Hello World';
            formSubtitle.textContent = 'Sign in to your account to continue exploring';
            btnText.textContent = 'Sign In to Account';
            footerText.textContent = "Don't have an account?";
            footerActionBtn.textContent = 'Sign up now';
            rememberLabel.textContent = 'Remember me for 30 days';

            signupElements.forEach(el => {
                if (el) el.classList.remove('show');
            });
            nameInput.removeAttribute('required');
            confirmPasswordInput.removeAttribute('required');
        }
    }

    tabSignIn.addEventListener('click', () => setAuthMode('signin'));
    tabSignUp.addEventListener('click', () => setAuthMode('signup'));
    footerActionBtn.addEventListener('click', () => {
        setAuthMode(currentMode === 'signin' ? 'signup' : 'signin');
    });

    // =========================================================================
    // 3. SHOW / HIDE PASSWORD TOGGLE
    // =========================================================================
    togglePasswordBtn.addEventListener('click', () => {
        const isPassword = passwordInput.getAttribute('type') === 'password';
        const newType = isPassword ? 'text' : 'password';
        passwordInput.setAttribute('type', newType);
        if (confirmPasswordInput) {
            confirmPasswordInput.setAttribute('type', newType);
        }
        togglePasswordBtn.classList.toggle('active', isPassword);
    });

    // =========================================================================
    // 4. PASSWORD STRENGTH METER
    // =========================================================================
    passwordInput.addEventListener('input', () => {
        if (currentMode !== 'signup') return;
        const val = passwordInput.value;
        const strength = evaluatePasswordStrength(val);
        updateStrengthUI(strength);
    });

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
            if (index < score) {
                bar.style.backgroundColor = levels[score - 1].color;
            } else {
                bar.style.backgroundColor = '';
            }
        });

        if (score > 0) {
            const currentLevel = levels[score - 1];
            strengthText.textContent = currentLevel.text;
            strengthText.className = `strength-value ${currentLevel.class}`;
        } else {
            strengthText.textContent = 'Weak';
            strengthText.className = 'strength-value weak';
        }
    }

    // =========================================================================
    // 5. VALIDATION & ERROR HANDLING
    // =========================================================================
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
        input.closest('.input-wrapper').classList.add('error');
        if (message) errorElement.textContent = message;
        errorElement.classList.add('visible');
    }

    function hideError(input, errorElement) {
        input.closest('.input-wrapper').classList.remove('error');
        errorElement.classList.remove('visible');
    }

    // Clear error on typing
    [nameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => {
        input.addEventListener('input', () => {
            input.closest('.input-wrapper').classList.remove('error');
            const err = input.closest('.form-group').querySelector('.error-msg');
            if (err) err.classList.remove('visible');
        });
    });

    // =========================================================================
    // 6. FORM SUBMISSION (SIMULATED AUTH)
    // =========================================================================
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();

        let isValid = true;
        const emailVal = emailInput.value.trim();
        const passwordVal = passwordInput.value;

        // Validation for Sign Up specific fields
        if (currentMode === 'signup') {
            const nameVal = nameInput.value.trim();
            if (!nameVal) {
                showError(nameInput, nameError, 'Please enter your full name');
                isValid = false;
            }

            const confirmVal = confirmPasswordInput.value;
            if (passwordVal !== confirmVal) {
                showError(confirmPasswordInput, confirmPasswordError, 'Passwords do not match');
                isValid = false;
            }
        }

        // Email validation
        if (!emailVal || !validateEmail(emailVal)) {
            showError(emailInput, emailError, 'Please enter a valid email address');
            isValid = false;
        }

        // Password validation
        if (!passwordVal || passwordVal.length < 6) {
            showError(passwordInput, passwordError, 'Password must be at least 6 characters');
            isValid = false;
        }

        if (!isValid) return;

        // Start loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;

            const displayName = currentMode === 'signup' && nameInput.value.trim() 
                ? nameInput.value.trim() 
                : emailVal.split('@')[0];

            completeAuthentication(displayName, emailVal);
        }, 1200);
    });

    // =========================================================================
    // 7. SOCIAL LOGIN HANDLERS
    // =========================================================================
    function handleSocialLogin(providerName) {
        showToast(`Connecting with ${providerName}...`, 'info');
        submitBtn.classList.add('loading');

        setTimeout(() => {
            submitBtn.classList.remove('loading');
            const mockName = `${providerName} User`;
            const mockEmail = `user@${providerName.toLowerCase()}.com`;
            completeAuthentication(mockName, mockEmail);
            showToast(`Successfully connected with ${providerName}!`, 'success');
        }, 1000);
    }

    btnGoogle.addEventListener('click', () => handleSocialLogin('Google'));
    btnGithub.addEventListener('click', () => handleSocialLogin('GitHub'));
    btnApple.addEventListener('click', () => handleSocialLogin('Apple'));

    // =========================================================================
    // 8. COMPLETE AUTH & SHOW WELCOME DASHBOARD
    // =========================================================================
    function completeAuthentication(name, email) {
        const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'HW';
        userAvatar.textContent = initials;
        welcomeMsg.innerHTML = `Welcome to your dashboard, <strong>${escapeHTML(name)}</strong>. You are successfully authenticated!`;
        infoEmail.textContent = email;

        // Hide auth card, show welcome card
        authCard.style.display = 'none';
        welcomeCard.classList.remove('hidden');

        showToast(`🎉 Welcome to Hello World, ${name}!`, 'success');
    }

    btnLogout.addEventListener('click', () => {
        welcomeCard.classList.add('hidden');
        authCard.style.display = 'block';
        authForm.reset();
        clearErrors();
        setAuthMode('signin');
        showToast('Signed out successfully', 'info');
    });

    btnExplore.addEventListener('click', () => {
        showToast('🚀 Launching your personalized workspace...', 'success');
    });

    // =========================================================================
    // 9. FORGOT PASSWORD MODAL
    // =========================================================================
    btnForgotPassword.addEventListener('click', () => {
        forgotModal.classList.remove('hidden');
        resetEmail.value = emailInput.value.trim();
        resetEmail.focus();
    });

    modalCloseBtn.addEventListener('click', () => {
        forgotModal.classList.add('hidden');
    });

    forgotModal.addEventListener('click', (e) => {
        if (e.target === forgotModal) {
            forgotModal.classList.add('hidden');
        }
    });

    resetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = resetEmail.value.trim();
        if (!email || !validateEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }

        forgotModal.classList.add('hidden');
        showToast(`📬 Password reset link sent to ${email}`, 'success');
        resetForm.reset();
    });

    // =========================================================================
    // 10. TOAST NOTIFICATION UTILITY
    // =========================================================================
    function showToast(message, type = 'info') {
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

        toast.innerHTML = `${iconSvg}<span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 3600);
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
});
