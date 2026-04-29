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
<!-- Main Content Canvas -->
<main class="flex-1 w-full max-w-2xl mx-auto px-gutter py-md md:py-lg pb-24">
<!-- Profile Overview (Context) -->
<div class="flex items-center mb-lg pb-md border-b border-outline-variant dark:border-zinc-800">
<div class="w-16 h-16 rounded-full bg-secondary-container dark:bg-zinc-800 flex items-center justify-center text-on-secondary-container dark:text-zinc-400 mr-md overflow-hidden relative shadow-sm">
${user?.avatar 
    ? `<div class="absolute inset-0 bg-cover bg-center" style="background-image: url('${user.avatar}')"></div>`
    : `<span class="material-symbols-outlined text-3xl">account_circle</span>`
}
</div>
<div>
<h2 class="font-headline-lg text-headline-lg text-on-background dark:text-white text-[24px]">${user?.name || t('guest')}</h2>
<p class="font-body-md text-body-md text-on-secondary-container dark:text-zinc-400">${user?.email || t('not_logged_in')}</p>
</div>
</div>
<!-- Appearance Section -->
<section class="mb-lg">
<h2 class="font-label-md text-label-md text-primary dark:text-rose-400 mb-sm uppercase tracking-widest pl-1">${t('appearance') || 'Appearance'}</h2>
<div class="bg-surface-container-lowest dark:bg-zinc-900 rounded-xl border border-outline-variant dark:border-zinc-800 p-md shadow-sm">
<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
<div>
<h3 class="font-body-lg text-body-lg text-on-surface dark:text-white mb-xs font-medium">${t('theme_preference') || 'Theme Preference'}</h3>
<p class="font-body-md text-body-md text-on-secondary-container dark:text-zinc-400 text-sm">${t('dark_mode_desc') || 'Choose your reading environment.'}</p>
</div>
<!-- Segmented Control for Theme -->
<div class="flex bg-surface-container dark:bg-zinc-800 rounded-lg p-1 shrink-0">
<!-- Active State: Light Mode -->
<button id="theme-light-btn" class="flex items-center justify-center px-4 py-2 rounded-md ${!isDark ? 'bg-surface-container-lowest dark:bg-zinc-700 shadow-sm text-primary dark:text-rose-400 transition-all relative z-10 w-24' : 'text-on-secondary-container dark:text-zinc-400 hover:text-on-surface dark:hover:text-white hover:bg-surface-container-high dark:hover:bg-zinc-700 transition-all w-24'}">
<span class="material-symbols-outlined mr-2 text-[20px]" ${!isDark ? 'style="font-variation-settings: \'FILL\' 1;"' : ''}>light_mode</span>
<span class="font-label-sm text-label-sm ${!isDark ? 'font-semibold' : ''}">Light</span>
</button>
<!-- Inactive State: Dark Mode -->
<button id="theme-dark-btn" class="flex items-center justify-center px-4 py-2 rounded-md ${isDark ? 'bg-surface-container-lowest dark:bg-zinc-700 shadow-sm text-primary dark:text-rose-400 transition-all relative z-10 w-24' : 'text-on-secondary-container dark:text-zinc-400 hover:text-on-surface dark:hover:text-white hover:bg-surface-container-high dark:hover:bg-zinc-700 transition-all w-24'}">
<span class="material-symbols-outlined mr-2 text-[20px]" ${isDark ? 'style="font-variation-settings: \'FILL\' 1;"' : ''}>dark_mode</span>
<span class="font-label-sm text-label-sm ${isDark ? 'font-semibold' : ''}">Dark</span>
</button>
</div>
</div>
</div>
</section>
<!-- Localization Section (Bento Grid Style) -->
<section class="mb-lg">
<h2 class="font-label-md text-label-md text-primary dark:text-rose-400 mb-sm uppercase tracking-widest pl-1">${t('localization') || 'Localization'}</h2>
<div class="grid grid-cols-1 md:grid-cols-2 gap-sm">
<!-- English Option -->
<button id="lang-en-btn" class="rounded-xl p-md flex items-center justify-between text-left transition-all relative group ${currentLang === 'en' ? 'bg-surface-container-lowest dark:bg-zinc-900 border-2 border-primary dark:border-rose-500 shadow-sm overflow-hidden' : 'bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 hover:border-outline dark:hover:border-zinc-600 hover:bg-surface-container-high dark:hover:bg-zinc-800/50'}">
${currentLang === 'en' ? '<div class="absolute inset-0 bg-primary/5 dark:bg-rose-500/10 transition-colors group-hover:bg-primary/10 dark:group-hover:bg-rose-500/20"></div>' : ''}
<div class="relative z-10 flex items-center">
<div class="w-10 h-10 rounded-full bg-surface-container dark:bg-zinc-800 flex items-center justify-center mr-md border border-outline-variant/50 dark:border-zinc-700 ${currentLang !== 'en' ? 'group-hover:bg-surface-container-highest dark:group-hover:bg-zinc-700 transition-colors' : ''}">
<span class="font-display-lg text-[20px] leading-none">🇺🇸</span>
</div>
<div>
<h3 class="font-label-md text-label-md text-on-surface dark:text-white mb-1 text-[16px]">English</h3>
<p class="font-label-sm text-label-sm ${currentLang === 'en' ? 'text-primary dark:text-rose-400' : 'text-on-secondary-container dark:text-zinc-400'}">${currentLang === 'en' ? 'Active Language' : 'English'}</p>
</div>
</div>
${currentLang === 'en' ? '<span class="material-symbols-outlined text-primary dark:text-rose-500 relative z-10" style="font-variation-settings: \'FILL\' 1;">check_circle</span>' : ''}
</button>
<!-- Vietnamese Option -->
<button id="lang-vi-btn" class="rounded-xl p-md flex items-center justify-between text-left transition-all relative group ${currentLang === 'vi' ? 'bg-surface-container-lowest dark:bg-zinc-900 border-2 border-primary dark:border-rose-500 shadow-sm overflow-hidden' : 'bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 hover:border-outline dark:hover:border-zinc-600 hover:bg-surface-container-high dark:hover:bg-zinc-800/50'}">
${currentLang === 'vi' ? '<div class="absolute inset-0 bg-primary/5 dark:bg-rose-500/10 transition-colors group-hover:bg-primary/10 dark:group-hover:bg-rose-500/20"></div>' : ''}
<div class="flex items-center relative z-10">
<div class="w-10 h-10 rounded-full bg-surface-container dark:bg-zinc-800 flex items-center justify-center mr-md border border-outline-variant/50 dark:border-zinc-700 ${currentLang !== 'vi' ? 'group-hover:bg-surface-container-highest dark:group-hover:bg-zinc-700 transition-colors' : ''}">
<span class="font-display-lg text-[20px] leading-none">🇻🇳</span>
</div>
<div>
<h3 class="font-label-md text-label-md text-on-surface dark:text-white mb-1 text-[16px]">Tiếng Việt</h3>
<p class="font-label-sm text-label-sm ${currentLang === 'vi' ? 'text-primary dark:text-rose-400' : 'text-on-secondary-container dark:text-zinc-400'}">${currentLang === 'vi' ? (currentLang === 'vi' ? 'Ngôn ngữ hiện tại' : 'Active Language') : 'Vietnamese'}</p>
</div>
</div>
${currentLang === 'vi' ? '<span class="material-symbols-outlined text-primary dark:text-rose-500 relative z-10" style="font-variation-settings: \'FILL\' 1;">check_circle</span>' : ''}
</button>
</div>
</section>
<!-- Reading Preferences -->
<section class="mb-xl">
<h2 class="font-label-md text-label-md text-primary dark:text-rose-400 mb-sm uppercase tracking-widest pl-1">${t('reading') || 'Reading Experience'}</h2>
<div class="bg-surface-container-lowest dark:bg-zinc-900 rounded-xl border border-outline-variant dark:border-zinc-800 shadow-sm overflow-hidden">
<!-- List Item 1 -->
<div class="p-md flex items-center justify-between border-b border-outline-variant dark:border-zinc-800 hover:bg-surface-container-low dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group">
<div class="flex items-center">
<div class="w-8 h-8 rounded bg-secondary-container dark:bg-zinc-800 flex items-center justify-center mr-md">
<span class="material-symbols-outlined text-on-secondary-container dark:text-zinc-400 text-[20px]">menu_book</span>
</div>
<div>
<h3 class="font-body-lg text-body-lg text-on-surface dark:text-white font-medium text-[16px]">${t('read_direction') || 'Default Reading Direction'}</h3>
<p class="font-body-md text-body-md text-on-secondary-container dark:text-zinc-400 text-sm">${t('read_direction_desc') || 'Right to Left (Manga standard)'}</p>
</div>
</div>
<span class="material-symbols-outlined text-on-surface-variant dark:text-zinc-500 group-hover:text-primary dark:group-hover:text-rose-400 transition-colors">chevron_right</span>
</div>
<!-- List Item 2 (Toggle) -->
<div class="p-md flex items-center justify-between hover:bg-surface-container-low dark:hover:bg-zinc-800/50 transition-colors">
<div class="flex items-center">
<div class="w-8 h-8 rounded bg-secondary-container dark:bg-zinc-800 flex items-center justify-center mr-md">
<span class="material-symbols-outlined text-on-secondary-container dark:text-zinc-400 text-[20px]">vibration</span>
</div>
<div>
<h3 class="font-body-lg text-body-lg text-on-surface dark:text-white font-medium text-[16px]">Haptic Feedback</h3>
<p class="font-body-md text-body-md text-on-secondary-container dark:text-zinc-400 text-sm">Vibrate on page turn</p>
</div>
</div>
<!-- UI Switch (Active State) -->
<button aria-checked="true" class="w-12 h-6 bg-primary dark:bg-rose-600 rounded-full relative cursor-pointer shadow-inner focus:outline-none focus:ring-2 focus:ring-primary-container dark:focus:ring-rose-900 focus:ring-offset-2 focus:ring-offset-surface-container-lowest dark:focus:ring-offset-zinc-900" role="switch">
<div class="absolute right-1 top-1 bg-surface-container-lowest dark:bg-white w-4 h-4 rounded-full shadow-sm"></div>
</button>
</div>
</div>
</section>
<!-- Danger Zone -->
${user ? `
<section class="mt-xl pt-lg border-t border-outline-variant dark:border-zinc-800">
<button id="logout-btn" class="w-full flex items-center justify-center py-sm px-md rounded-lg border border-error dark:border-red-500 text-error dark:text-red-500 hover:bg-error-container dark:hover:bg-red-900/20 transition-colors font-label-md text-label-md">
<span class="material-symbols-outlined mr-2 text-[20px]">logout</span>
Sign Out
</button>
</section>
` : `
<section class="mt-xl pt-lg border-t border-outline-variant dark:border-zinc-800">
<a href="/login" data-link class="w-full flex items-center justify-center py-sm px-md rounded-lg bg-primary dark:bg-rose-600 text-on-primary dark:text-white hover:bg-primary-container dark:hover:bg-rose-700 transition-colors font-label-md text-label-md">
<span class="material-symbols-outlined mr-2 text-[20px]">login</span>
Sign In
</a>
</section>
`}
</main>
    `;

    // Bind dark mode toggle
    const themeLightBtn = document.getElementById('theme-light-btn');
    if (themeLightBtn) {
        themeLightBtn.addEventListener('click', () => {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                document.documentElement.classList.add('light');
                localStorage.setItem('mangaflow_dark', 'false');
                render();
                window.refreshLayout();
            }
        });
    }

    const themeDarkBtn = document.getElementById('theme-dark-btn');
    if (themeDarkBtn) {
        themeDarkBtn.addEventListener('click', () => {
            if (!document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.add('dark');
                document.documentElement.classList.remove('light');
                localStorage.setItem('mangaflow_dark', 'true');
                render();
                window.refreshLayout();
            }
        });
    }
    
    // Bind language select
    const langEnBtn = document.getElementById('lang-en-btn');
    if (langEnBtn) {
        langEnBtn.addEventListener('click', () => {
            i18n.setLocale('en');
            render();
            window.refreshLayout();
        });
    }

    const langViBtn = document.getElementById('lang-vi-btn');
    if (langViBtn) {
        langViBtn.addEventListener('click', () => {
            i18n.setLocale('vi');
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
