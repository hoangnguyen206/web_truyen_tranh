// public/assets/js/pages/settings.js
import { api } from '../api.js';
import { i18n } from '../i18n.js';

export function render() {
    const container = document.getElementById('app-container');
    window.showAppNav();
    const t = (k) => i18n.t(k);
    const currentLang = i18n.getLocale();
    const isDark = document.documentElement.classList.contains('dark');
    
    // Check if user is logged in
    const userStr = localStorage.getItem('mangaflow_user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    container.innerHTML = `
    <main class="pt-20 pb-24 md:pb-8 px-4 md:px-6 max-w-3xl mx-auto" style="font-family: 'Be Vietnam Pro', sans-serif;">
        <h1 class="text-2xl font-black text-zinc-900 dark:text-white mb-8" style="font-family: 'Epilogue', sans-serif;">${t('settings')}</h1>
        
        <!-- Profile -->
        <section class="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800 shadow-sm mb-4 flex items-center gap-4">
            <div class="w-14 h-14 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                ${user?.avatar 
                    ? `<img src="${user.avatar}" class="w-full h-full object-cover" />`
                    : `<span class="material-symbols-outlined text-3xl text-zinc-400">account_circle</span>`
                }
            </div>
            <div class="flex-1">
                <p class="font-bold text-zinc-900 dark:text-white">${user?.name || t('guest')}</p>
                <p class="text-xs text-zinc-500 dark:text-zinc-400">${user?.email || t('not_logged_in')}</p>
            </div>
            ${user 
                ? `<button id="logout-btn" class="px-5 py-2 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-semibold hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors">Logout</button>`
                : `<a href="/login" data-link class="px-5 py-2 rounded-full bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition-colors">${t('login')}</a>`
            }
        </section>
        
        <!-- Appearance Settings -->
        <section class="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden mb-4">
            <div class="px-5 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
                <h3 class="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">${t('appearance')}</h3>
            </div>
            <div class="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                <!-- Dark Mode Toggle -->
                <button id="settings-dark-toggle" class="w-full flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-zinc-500 dark:text-zinc-400">dark_mode</span>
                        <div class="text-left">
                            <p class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">${t('dark_mode')}</p>
                            <p class="text-[11px] text-zinc-400 dark:text-zinc-500">${t('dark_mode_desc')}</p>
                        </div>
                    </div>
                    <div class="w-11 h-6 rounded-full ${isDark ? 'bg-rose-600' : 'bg-zinc-300'} relative transition-colors">
                        <div class="absolute top-0.5 ${isDark ? 'right-0.5' : 'left-0.5'} w-5 h-5 bg-white rounded-full shadow transition-all"></div>
                    </div>
                </button>
                
                <!-- Language Selection -->
                <div class="flex items-center justify-between p-4">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-zinc-500 dark:text-zinc-400">language</span>
                        <div>
                            <p class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">${t('language')}</p>
                            <p class="text-[11px] text-zinc-400 dark:text-zinc-500">${t('language_desc')}</p>
                        </div>
                    </div>
                    <select id="lang-select" class="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900">
                        <option value="vi" ${currentLang === 'vi' ? 'selected' : ''}>🇻🇳 ${t('vietnamese')}</option>
                        <option value="en" ${currentLang === 'en' ? 'selected' : ''}>🇬🇧 ${t('english')}</option>
                    </select>
                </div>
            </div>
        </section>
        
        <!-- Reading Settings -->
        <section class="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div class="px-5 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
                <h3 class="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">${t('reading')}</h3>
            </div>
            <div class="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                <div class="flex items-center justify-between p-4">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-zinc-500 dark:text-zinc-400">swap_vert</span>
                        <div>
                            <p class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">${t('read_direction')}</p>
                            <p class="text-[11px] text-zinc-400 dark:text-zinc-500">${t('read_direction_desc')}</p>
                        </div>
                    </div>
                    <span class="material-symbols-outlined text-zinc-400 dark:text-zinc-500">chevron_right</span>
                </div>
            </div>
        </section>
        
        <p class="text-center text-xs text-zinc-400 dark:text-zinc-500 mt-8">MangaFlow v2.0 · Powered by OTruyen API</p>
    </main>`;
    
    // Bind dark mode toggle
    const darkToggle = document.getElementById('settings-dark-toggle');
    if (darkToggle) {
        darkToggle.addEventListener('click', () => {
            const nowDark = document.documentElement.classList.toggle('dark');
            document.documentElement.classList.toggle('light', !nowDark);
            localStorage.setItem('mangaflow_dark', nowDark);
            // Re-render to update toggle state
            render();
            // Also update navbar
            window.refreshLayout();
        });
    }
    
    // Bind language select
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            i18n.setLocale(e.target.value);
            // Re-render everything
            render();
            window.refreshLayout();
        });
    }
    
    // Bind logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await api.logout();
            } catch (e) {
                // Ignore errors
            }
            localStorage.removeItem('mangaflow_user');
            render();
            window.refreshLayout();
        });
    }
}
