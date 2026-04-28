// public/assets/js/pages/auth.js
import { api } from '../api.js';
import { i18n } from '../i18n.js';

// Google OAuth Client ID — Replace with your own from Google Cloud Console
const GOOGLE_CLIENT_ID = ''; // Will be loaded from server config

// Store the randomly picked image to persist between tab switches
let currentBgImage = null;

export function renderLogin() {
    renderAuthPage('login');
}

export function renderRegister() {
    renderAuthPage('register');
}

function renderAuthPage(mode = 'login') {
    const container = document.getElementById('app-container');
    window.hideAppNav();
    const t = (k) => i18n.t(k);
    const isLogin = mode === 'login';

    container.innerHTML = `
    <div class="bg-background text-on-background min-h-screen flex flex-col">
        <main class="flex-grow flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
            <!-- Abstract Background -->
            <div class="absolute inset-0 pointer-events-none z-0">
                <div class="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px]"></div>
                <div class="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-surface-variant/50 rounded-full blur-[100px]"></div>
            </div>
            
            <div class="max-w-container-max w-full flex flex-col lg:flex-row bg-surface-container-lowest rounded-xl shadow-lg border border-surface-variant overflow-hidden z-10">
                <!-- Art Section (Hidden on mobile) -->
                <div class="hidden lg:flex w-1/2 relative bg-surface-container">
                    <img id="random-bg-image" alt="Manga Art" class="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-multiply" src="" />
                    <div class="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent flex flex-col justify-end p-12">
                        <h2 class="font-display-lg text-display-lg text-primary mb-4">${t('branding_title')} <br/><span class="text-on-background">${t('branding_highlight')}</span></h2>
                        <p class="font-body-lg text-body-lg text-on-surface-variant max-w-md">${t('branding_desc')}</p>
                    </div>
                </div>
                
                <!-- Form Section -->
                <div class="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center">
                    <!-- Brand Anchor -->
                    <div class="text-2xl font-black italic tracking-tighter text-rose-600 dark:text-rose-500 mb-8 lg:mb-12 cursor-pointer" onclick="window.router.navigate('/')">
                        MangaFlow
                    </div>
                    
                    <!-- Tabs -->
                    <div class="flex gap-8 mb-8 border-b border-surface-variant">
                        <button class="pb-4 font-headline-md text-headline-md ${isLogin ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary transition-colors'}" onclick="window.router.navigate('/login')">${t('login')}</button>
                        <button class="pb-4 font-headline-md text-headline-md ${!isLogin ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary transition-colors'}" onclick="window.router.navigate('/register')">${t('register')}</button>
                    </div>
                    
                    <div class="space-y-6">
                        <button id="google-sign-in-btn" class="w-full flex items-center justify-center gap-3 py-3 px-4 bg-surface-container rounded-lg hover:bg-surface-variant transition-colors border border-surface-variant">
                            <svg class="w-5 h-5" viewbox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                            </svg>
                            <span class="font-label-md text-label-md text-on-surface">${t('continue_google')}</span>
                        </button>

                        
                        <div class="relative flex items-center py-2">
                            <div class="flex-grow border-t border-surface-variant"></div>
                            <span class="flex-shrink-0 mx-4 font-label-sm text-label-sm text-secondary uppercase tracking-wider">${t('or')}</span>
                            <div class="flex-grow border-t border-surface-variant"></div>
                        </div>
                        
                        <!-- Login Form -->
                        <form id="auth-form" class="space-y-5 ${isLogin ? '' : 'hidden'}">
                            <div class="space-y-2">
                                <label class="font-label-sm text-label-sm text-on-surface" for="login-email">${t('email')}</label>
                                <input class="w-full bg-surface px-4 py-3 rounded-lg border border-surface-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md text-body-md" id="login-email" placeholder="name@example.com" type="email" required/>
                            </div>
                            <div class="space-y-2">
                                <div class="flex justify-between items-center">
                                    <label class="font-label-sm text-label-sm text-on-surface" for="login-pass">${t('password')}</label>
                                    <a class="font-label-sm text-label-sm text-primary hover:underline" href="#">${t('forgot_password') || 'Forgot Password?'}</a>
                                </div>
                                <input class="w-full bg-surface px-4 py-3 rounded-lg border border-surface-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md text-body-md" id="login-pass" placeholder="••••••••" type="password" required/>
                            </div>
                            <div id="auth-error" class="text-red-500 text-center text-xs hidden"></div>
                            <button class="w-full bg-primary-container text-on-primary-container font-label-md text-label-md py-3 rounded-lg hover:bg-tertiary transition-colors mt-2" type="submit">
                                ${t('login_btn')}
                            </button>
                        </form>
                        
                        <!-- Register Form -->
                        <form id="register-form" class="space-y-5 ${!isLogin ? '' : 'hidden'}">
                            <div class="space-y-2">
                                <label class="font-label-sm text-label-sm text-on-surface" for="reg-username">${t('username')}</label>
                                <input class="w-full bg-surface px-4 py-3 rounded-lg border border-surface-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md text-body-md" id="reg-username" placeholder="username123" type="text" required/>
                            </div>
                            <div class="space-y-2">
                                <label class="font-label-sm text-label-sm text-on-surface" for="reg-name">${t('full_name')}</label>
                                <input class="w-full bg-surface px-4 py-3 rounded-lg border border-surface-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md text-body-md" id="reg-name" placeholder="Nguyễn Văn A" type="text" required/>
                            </div>
                            <div class="space-y-2">
                                <label class="font-label-sm text-label-sm text-on-surface" for="reg-email">${t('email')}</label>
                                <input class="w-full bg-surface px-4 py-3 rounded-lg border border-surface-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md text-body-md" id="reg-email" placeholder="you@example.com" type="email" required/>
                            </div>
                            <div class="space-y-2">
                                <label class="font-label-sm text-label-sm text-on-surface" for="reg-pass">${t('password')}</label>
                                <input class="w-full bg-surface px-4 py-3 rounded-lg border border-surface-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md text-body-md" id="reg-pass" placeholder="••••••••" type="password" required minlength="6"/>
                            </div>
                            <div class="space-y-2">
                                <label class="font-label-sm text-label-sm text-on-surface" for="reg-pass-confirm">${t('confirm_password')}</label>
                                <input class="w-full bg-surface px-4 py-3 rounded-lg border border-surface-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md text-body-md" id="reg-pass-confirm" placeholder="••••••••" type="password" required minlength="6"/>
                            </div>
                            <div id="register-error" class="text-red-500 text-center text-xs hidden"></div>
                            <div id="register-success" class="text-green-500 text-center text-xs hidden"></div>
                            <button class="w-full bg-primary-container text-on-primary-container font-label-md text-label-md py-3 rounded-lg hover:bg-tertiary transition-colors mt-2" type="submit">
                                ${t('register_btn')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
        
        <!-- Footer Component -->
        <footer class="bg-gray-50 dark:bg-zinc-950 full-width border-t border-gray-200 dark:border-white/10 mt-auto">
            <div class="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
                <div class="flex flex-col items-center md:items-start gap-4">
                    <div class="text-lg font-black text-rose-600 dark:text-rose-500">MangaFlow</div>
                    <div class="font-epilogue text-xs uppercase tracking-widest font-semibold text-gray-400 dark:text-zinc-600">© 2024 MangaFlow. All rights reserved.</div>
                </div>
                <nav class="flex flex-wrap justify-center gap-6">
                    <a class="font-epilogue text-xs uppercase tracking-widest font-semibold text-gray-400 dark:text-zinc-600 hover:text-rose-600 dark:hover:text-rose-400 underline decoration-2 underline-offset-4 opacity-80 hover:opacity-100 transition-opacity" href="/privacy-policy.html">Privacy Policy</a>
                    <a class="font-epilogue text-xs uppercase tracking-widest font-semibold text-gray-400 dark:text-zinc-600 hover:text-rose-600 dark:hover:text-rose-400 underline decoration-2 underline-offset-4 opacity-80 hover:opacity-100 transition-opacity" href="/terms-of-service.html">Terms of Service</a>
                    <a class="font-epilogue text-xs uppercase tracking-widest font-semibold text-gray-400 dark:text-zinc-600 hover:text-rose-600 dark:hover:text-rose-400 underline decoration-2 underline-offset-4 opacity-80 hover:opacity-100 transition-opacity" href="#">Help Center</a>
                    <a class="font-epilogue text-xs uppercase tracking-widest font-semibold text-gray-400 dark:text-zinc-600 hover:text-rose-600 dark:hover:text-rose-400 underline decoration-2 underline-offset-4 opacity-80 hover:opacity-100 transition-opacity" href="#">Contact</a>
                </nav>
            </div>
        </footer>
    </div>`;

    // Setup Random Background Image
    const bgImgEl = document.getElementById('random-bg-image');
    if (bgImgEl) {
        if (!currentBgImage) {
            const backgroundImages = [
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAv7uR2n-kpEpOZ4DR6hKhtBu2EpELokfae0NQqXG2XMOAt9JBloeboGbjTwA6dcZ4_xRfaO-h8iTigyxp2FM9WFzMnkJSzhmR5QKCGUYEI0Z-22cENoUlRfUdLOrGwzWzBlWkBy4C7kbz0lsJfOZ7ZHGfRim3oVWVhxj3Lz-lEjDKu9Y_OIxnTEWB7cBFwOOdIb0AUtW8krCP1nOYa_tcr2VB3L6q9yd2hvce39MQWELgqMkriT7ASRuAS1fuCv5bRSo65b0Ol0HlW",
                "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1000&auto=format&fit=crop"
            ];
            currentBgImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
        }
        bgImgEl.src = currentBgImage;
    }

    // Bind login form
    const loginForm = document.getElementById('auth-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const pass = document.getElementById('login-pass').value;
            const errDiv = document.getElementById('auth-error');
            try {
                errDiv.classList.add('hidden');
                const result = await api.login(email, pass);
                // Store user info
                localStorage.setItem('mangaflow_user', JSON.stringify(result.user || result));
                window.showAppNav();
                window.refreshLayout();
                window.router.navigate('/');
            } catch (e) {
                errDiv.textContent = e.message;
                errDiv.classList.remove('hidden');
            }
        });
    }

    // Bind register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('reg-username').value;
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const pass = document.getElementById('reg-pass').value;
            const passConfirm = document.getElementById('reg-pass-confirm').value;
            const errDiv = document.getElementById('register-error');
            const successDiv = document.getElementById('register-success');

            errDiv.classList.add('hidden');
            successDiv.classList.add('hidden');

            if (pass !== passConfirm) {
                errDiv.textContent = t('passwords_not_match');
                errDiv.classList.remove('hidden');
                return;
            }

            if (!username || !name || !email || !pass) {
                errDiv.textContent = t('fill_all_fields');
                errDiv.classList.remove('hidden');
                return;
            }

            try {
                await api.register({ username, name, email, password: pass });
                successDiv.textContent = t('register_success');
                successDiv.classList.remove('hidden');
                // Redirect to login after 1.5s
                setTimeout(() => {
                    window.router.navigate('/login');
                }, 1500);
            } catch (e) {
                errDiv.textContent = e.message;
                errDiv.classList.remove('hidden');
            }
        });
    }

    // Bind Google Sign-In
    const googleBtn = document.getElementById('google-sign-in-btn');
    if (googleBtn) {
        googleBtn.addEventListener('click', async () => {
            try {
                // Get the Google OAuth URL from backend
                const data = await api.googleAuthUrl();
                if (data && data.url) {
                    window.location.href = data.url;
                } else {
                    alert('Google OAuth chưa được cấu hình. Vui lòng liên hệ admin.');
                }
            } catch (e) {
                console.error('Google auth error:', e);
                alert('Không thể kết nối Google OAuth: ' + e.message);
            }
        });
    }

    window.addEventListener('popstate', () => window.showAppNav(), { once: true });
}

// Handle Google OAuth callback
export async function handleGoogleCallback(query) {
    const container = document.getElementById('app-container');
    container.innerHTML = `
    <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
            <span class="material-symbols-outlined animate-spin text-4xl text-rose-500">sync</span>
            <p class="mt-4 text-zinc-600 dark:text-zinc-400">Đang xử lý đăng nhập Google...</p>
        </div>
    </div>`;

    try {
        const params = new URLSearchParams(query);
        const code = params.get('code');

        if (!code) {
            throw new Error('Không nhận được mã xác thực từ Google');
        }

        const result = await api.googleCallback(code);
        localStorage.setItem('mangaflow_user', JSON.stringify(result.user || result));
        window.showAppNav();
        window.refreshLayout();
        window.router.navigate('/');
    } catch (e) {
        container.innerHTML = `
        <div class="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
            <span class="material-symbols-outlined text-5xl text-red-500">error</span>
            <p class="text-zinc-800 dark:text-zinc-200 font-semibold">Lỗi đăng nhập Google</p>
            <p class="text-sm text-zinc-500">${e.message}</p>
            <button onclick="window.router.navigate('/login')" class="mt-4 px-6 py-3 bg-rose-600 text-white rounded-full text-sm font-semibold">Quay lại đăng nhập</button>
        </div>`;
    }
}
