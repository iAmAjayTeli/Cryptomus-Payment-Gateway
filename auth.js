// ===============================================
// AUTHENTICATION SYSTEM - JavaScript
// ===============================================

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check if user is already logged in
        this.loadUserSession();
        
        // Initialize page-specific functionality
        this.initPageFunctionality();
        
        // Initialize mobile menu
        this.initMobileMenu();
    }

    // ===============================================
    // SESSION MANAGEMENT
    // ===============================================
    
    loadUserSession() {
        const userData = localStorage.getItem('hostino_user');
        if (userData) {
            try {
                this.currentUser = JSON.parse(userData);
                this.updateUIForAuthenticatedUser();
            } catch (error) {
                console.error('Error loading user session:', error);
                localStorage.removeItem('hostino_user');
            }
        }
    }

    saveUserSession(userData) {
        this.currentUser = userData;
        localStorage.setItem('hostino_user', JSON.stringify(userData));
        this.updateUIForAuthenticatedUser();
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('hostino_user');
        localStorage.removeItem('hostino_remember');
        this.showMessage('You have been logged out successfully.', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    // ===============================================
    // UI UPDATES
    // ===============================================
    
    updateUIForAuthenticatedUser() {
        // Update navigation for authenticated users
        const navLinks = document.querySelectorAll('.nav-link');
        const btnPrimary = document.querySelectorAll('.btn-primary');
        
        navLinks.forEach(link => {
            if (link.textContent === 'Login' || link.href.includes('login.html')) {
                link.textContent = 'Dashboard';
                link.href = 'dashboard.html';
            }
        });

        btnPrimary.forEach(btn => {
            if (btn.textContent === 'Get Started' || btn.href.includes('pricing.html')) {
                btn.textContent = 'Dashboard';
                btn.href = 'dashboard.html';
            }
        });

        // Add logout option
        this.addLogoutOption();
    }

    addLogoutOption() {
        const nav = document.querySelector('.nav-bar .container .flex');
        if (nav && !document.getElementById('user-menu')) {
            const userMenu = document.createElement('div');
            userMenu.id = 'user-menu';
            userMenu.className = 'relative ml-4';
            userMenu.innerHTML = `
                <button class="flex items-center space-x-2 text-gray-700 hover:text-blue-600" id="user-menu-btn">
                    <div class="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center">
                        <i class="fas fa-user text-white text-sm"></i>
                    </div>
                    <span class="hidden md:block">${this.currentUser?.fullname || 'User'}</span>
                    <i class="fas fa-chevron-down text-xs"></i>
                </button>
                <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg hidden" id="user-dropdown">
                    <a href="dashboard.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</a>
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" id="profile-link">Profile</a>
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" id="logout-link">Logout</a>
                </div>
            `;

            nav.appendChild(userMenu);

            // Add dropdown functionality
            document.getElementById('user-menu-btn').addEventListener('click', () => {
                document.getElementById('user-dropdown').classList.toggle('hidden');
            });

            document.getElementById('logout-link').addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!userMenu.contains(e.target)) {
                    document.getElementById('user-dropdown').classList.add('hidden');
                }
            });
        }
    }

    // ===============================================
    // MOBILE MENU
    // ===============================================
    
    initMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', function() {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }

    // ===============================================
    // PAGE FUNCTIONALITY
    // ===============================================
    
    initPageFunctionality() {
        const currentPage = window.location.pathname.split('/').pop();
        
        switch(currentPage) {
            case 'login.html':
                this.initLoginPage();
                break;
            case 'signup.html':
                this.initSignupPage();
                break;
            case 'dashboard.html':
                this.initDashboardPage();
                break;
        }
    }

    // ===============================================
    // LOGIN PAGE
    // ===============================================
    
    initLoginPage() {
        // Redirect if already logged in
        if (this.currentUser) {
            window.location.href = 'dashboard.html';
            return;
        }

        const loginForm = document.getElementById('login-form');
        const togglePassword = document.getElementById('toggle-password');
        const forgotPassword = document.getElementById('forgot-password');

        // Password toggle
        if (togglePassword) {
            togglePassword.addEventListener('click', () => {
                this.togglePasswordVisibility('password', togglePassword);
            });
        }

        // Forgot password
        if (forgotPassword) {
            forgotPassword.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleForgotPassword();
            });
        }

        // Form submission
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(e);
            });
        }

        // Social logins
        document.getElementById('google-login')?.addEventListener('click', () => {
            this.handleSocialLogin('google');
        });

        document.getElementById('github-login')?.addEventListener('click', () => {
            this.handleSocialLogin('github');
        });

        // Load remembered credentials
        this.loadRememberedCredentials();
    }

    async handleLogin(e) {
        const formData = new FormData(e.target);
        const email = formData.get('email').trim();
        const password = formData.get('password');
        const rememberMe = formData.get('remember-me');

        // Validate inputs
        if (!this.validateEmail(email)) {
            this.showMessage('Please enter a valid email address.', 'error');
            return;
        }

        if (password.length < 6) {
            this.showMessage('Password must be at least 6 characters long.', 'error');
            return;
        }

        this.setLoading('login-btn', true);

        try {
            // Simulate API call
            await this.simulateApiCall();

            // Check credentials (demo purposes)
            const users = JSON.parse(localStorage.getItem('hostino_users') || '[]');
            const user = users.find(u => u.email === email);

            if (user && user.password === password) {
                // Remember user if requested
                if (rememberMe) {
                    localStorage.setItem('hostino_remember', JSON.stringify({email, password}));
                } else {
                    localStorage.removeItem('hostino_remember');
                }

                this.saveUserSession(user);
                this.showMessage('Login successful! Redirecting...', 'success');
                
                // Handle redirect if specified
                const urlParams = new URLSearchParams(window.location.search);
                const redirectUrl = urlParams.get('redirect');
                
                setTimeout(() => {
                    window.location.href = redirectUrl || 'dashboard.html';
                }, 1500);
            } else {
                this.showMessage('Invalid email or password. Please try again.', 'error');
            }
        } catch (error) {
            this.showMessage('Login failed. Please try again later.', 'error');
        } finally {
            this.setLoading('login-btn', false);
        }
    }

    loadRememberedCredentials() {
        const remembered = localStorage.getItem('hostino_remember');
        if (remembered) {
            try {
                const {email, password} = JSON.parse(remembered);
                document.getElementById('email').value = email;
                document.getElementById('password').value = password;
                document.getElementById('remember-me').checked = true;
            } catch (error) {
                localStorage.removeItem('hostino_remember');
            }
        }
    }

    handleForgotPassword() {
        const email = document.getElementById('email').value.trim();
        if (email && this.validateEmail(email)) {
            this.showMessage(`Password reset link sent to ${email}`, 'success');
        } else {
            this.showMessage('Please enter your email address first.', 'error');
        }
    }

    // ===============================================
    // SIGNUP PAGE
    // ===============================================
    
    initSignupPage() {
        // Redirect if already logged in
        if (this.currentUser) {
            window.location.href = 'dashboard.html';
            return;
        }

        const signupForm = document.getElementById('signup-form');
        const togglePassword = document.getElementById('toggle-password');
        const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
        const passwordInput = document.getElementById('password');

        // Password toggles
        if (togglePassword) {
            togglePassword.addEventListener('click', () => {
                this.togglePasswordVisibility('password', togglePassword);
            });
        }

        if (toggleConfirmPassword) {
            toggleConfirmPassword.addEventListener('click', () => {
                this.togglePasswordVisibility('confirm-password', toggleConfirmPassword);
            });
        }

        // Password strength checker
        if (passwordInput) {
            passwordInput.addEventListener('input', (e) => {
                this.checkPasswordStrength(e.target.value);
            });
        }

        // Form submission
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignup(e);
            });
        }

        // Social signups
        document.getElementById('google-signup')?.addEventListener('click', () => {
            this.handleSocialLogin('google');
        });

        document.getElementById('github-signup')?.addEventListener('click', () => {
            this.handleSocialLogin('github');
        });
    }

    async handleSignup(e) {
        const formData = new FormData(e.target);
        const fullname = formData.get('fullname').trim();
        const email = formData.get('email').trim();
        const password = formData.get('password');
        const confirmPassword = formData.get('confirm-password');
        const agreeTerms = formData.get('agree-terms');
        const newsletter = formData.get('newsletter');

        // Validate inputs
        if (!fullname || fullname.length < 2) {
            this.showMessage('Please enter your full name.', 'error');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showMessage('Please enter a valid email address.', 'error');
            return;
        }

        if (password.length < 6) {
            this.showMessage('Password must be at least 6 characters long.', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showMessage('Passwords do not match.', 'error');
            return;
        }

        if (!agreeTerms) {
            this.showMessage('Please agree to the Terms of Service and Privacy Policy.', 'error');
            return;
        }

        this.setLoading('signup-btn', true);

        try {
            // Simulate API call
            await this.simulateApiCall();

            // Check if user already exists
            const users = JSON.parse(localStorage.getItem('hostino_users') || '[]');
            if (users.find(u => u.email === email)) {
                this.showMessage('An account with this email already exists.', 'error');
                return;
            }

            // Create new user
            const newUser = {
                id: Date.now(),
                fullname,
                email,
                password, // In real app, this would be hashed
                newsletter: !!newsletter,
                createdAt: new Date().toISOString(),
                isVerified: false
            };

            users.push(newUser);
            localStorage.setItem('hostino_users', JSON.stringify(users));

            this.showMessage('Account created successfully! Redirecting to dashboard...', 'success');
            
            // Auto-login the user
            setTimeout(() => {
                this.saveUserSession(newUser);
                window.location.href = 'dashboard.html';
            }, 1500);

        } catch (error) {
            this.showMessage('Registration failed. Please try again later.', 'error');
        } finally {
            this.setLoading('signup-btn', false);
        }
    }

    checkPasswordStrength(password) {
        const strengthFill = document.getElementById('password-strength-fill');
        const strengthText = document.getElementById('password-strength-text');
        
        if (!strengthFill || !strengthText) return;

        let strength = 0;
        let text = '';
        let color = '';

        if (password.length >= 6) strength += 1;
        if (password.match(/[a-z]/)) strength += 1;
        if (password.match(/[A-Z]/)) strength += 1;
        if (password.match(/[0-9]/)) strength += 1;
        if (password.match(/[^a-zA-Z0-9]/)) strength += 1;

        switch (strength) {
            case 0:
            case 1:
                text = 'Very Weak';
                color = '#ef4444';
                break;
            case 2:
                text = 'Weak';
                color = '#f59e0b';
                break;
            case 3:
                text = 'Fair';
                color = '#eab308';
                break;
            case 4:
                text = 'Good';
                color = '#22c55e';
                break;
            case 5:
                text = 'Strong';
                color = '#16a34a';
                break;
        }

        const percentage = (strength / 5) * 100;
        strengthFill.style.width = `${percentage}%`;
        strengthFill.style.backgroundColor = color;
        strengthText.textContent = text;
        strengthText.style.color = color;
    }

    // ===============================================
    // DASHBOARD PAGE
    // ===============================================
    
    initDashboardPage() {
        // Redirect if not logged in
        if (!this.currentUser) {
            window.location.href = 'login.html';
            return;
        }

        // Initialize dashboard functionality
        this.loadDashboardData();
    }

    loadDashboardData() {
        // Update user info
        const elements = {
            'user-name': this.currentUser.fullname,
            'user-email': this.currentUser.email,
            'member-since': new Date(this.currentUser.createdAt).getFullYear()
        };

        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) element.textContent = elements[id];
        });
    }

    // ===============================================
    // UTILITY FUNCTIONS
    // ===============================================
    
    togglePasswordVisibility(inputId, button) {
        const input = document.getElementById(inputId);
        const icon = button.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash text-gray-400 hover:text-gray-600';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye text-gray-400 hover:text-gray-600';
        }
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    setLoading(btnId, loading) {
        const btn = document.getElementById(btnId);
        const btnText = btn.querySelector('.btn-text');
        const btnSpinner = btn.querySelector('.btn-spinner');
        
        if (loading) {
            btn.disabled = true;
            btnText.classList.add('opacity-50');
            btnSpinner.classList.remove('hidden');
        } else {
            btn.disabled = false;
            btnText.classList.remove('opacity-50');
            btnSpinner.classList.add('hidden');
        }
    }

    showMessage(message, type) {
        const messageDiv = document.getElementById('auth-message');
        if (!messageDiv) return;

        messageDiv.className = `mt-4 p-4 rounded-lg ${type === 'error' ? 'bg-red-100 border border-red-400 text-red-700' : 'bg-green-100 border border-green-400 text-green-700'}`;
        messageDiv.textContent = message;
        messageDiv.classList.remove('hidden');

        setTimeout(() => {
            messageDiv.classList.add('hidden');
        }, 5000);
    }

    async simulateApiCall() {
        return new Promise(resolve => {
            setTimeout(resolve, Math.random() * 1000 + 500);
        });
    }

    handleSocialLogin(provider) {
        this.showMessage(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login is not implemented in this demo.`, 'error');
    }
}

// ===============================================
// INITIALIZE AUTHENTICATION SYSTEM
// ===============================================

document.addEventListener('DOMContentLoaded', function() {
    window.authSystem = new AuthSystem();
});

// ===============================================
// GLOBAL FUNCTIONS
// ===============================================

// Function to check if user is authenticated
function isAuthenticated() {
    return window.authSystem && window.authSystem.currentUser !== null;
}

// Function to get current user
function getCurrentUser() {
    return window.authSystem ? window.authSystem.currentUser : null;
}

// Function to logout
function logout() {
    if (window.authSystem) {
        window.authSystem.logout();
    }
}