// public/assets/js/components/navigation.js
// MangaFlow Design System — Navbar & Bottom Navigation
import { i18n } from '../i18n.js';
import { api } from '../api.js';

// Cache genres list
let cachedGenres = null;

async function loadGenres() {
    if (cachedGenres) return cachedGenres;
    try {
        cachedGenres = await api.genres();
        return cachedGenres;
    } catch (e) {
        return [];
    }
}

// Genre icon mapping
const GENRE_ICONS = {
    'Action':'bolt','Adventure':'explore','Comedy':'sentiment_very_satisfied','Drama':'theater_comedy',
    'Fantasy':'auto_awesome','Horror':'skull','Romance':'favorite','Mystery':'search','Sci-fi':'rocket',
    'School Life':'school','Martial Arts':'sports_martial_arts','Sports':'sports_soccer','Manga':'import_contacts',
    'Manhwa':'menu_book','Manhua':'auto_stories','Supernatural':'flare','Historical':'history_edu',
    'Slice of Life':'coffee','Cooking':'restaurant','Mecha':'precision_manufacturing'
};

function getUserFromStorage() {
    try {
        const str = localStorage.getItem('mangaflow_user');
        return str ? JSON.parse(str) : null;
    } catch { return null; }
}

export function renderNavbar() {
    const t = (k) => i18n.t(k);
    const user = getUserFromStorage();
    
    const userSection = user ? `
        <!-- Logged-in: Avatar Dropdown -->
        <div class="user-avatar-dropdown relative">
            <button class="flex items-center gap-2 p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer" id="avatar-trigger">
                <div class="w-8 h-8 rounded-full overflow-hidden border-2 border-rose-200 dark:border-rose-800 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                    ${user.avatar 
                        ? `<img src="${user.avatar}" class="w-full h-full object-cover" alt="" />`
                        : `<span class="material-symbols-outlined text-[20px] text-zinc-400">person</span>`
                    }
                </div>
            </button>
            <div class="avatar-dropdown-menu" id="avatar-dropdown-panel">
                <div class="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                    <p class="text-sm font-bold text-zinc-800 dark:text-zinc-200 truncate">${user.name || 'User'}</p>
                    <p class="text-[11px] text-zinc-400 truncate">${user.email || ''}</p>
                </div>
                <div class="p-1.5">
                    <a href="/library" data-link class="avatar-menu-item">
                        <span class="material-symbols-outlined text-[18px]">bookmark</span>
                        My Library
                    </a>
                    <a href="/settings" data-link class="avatar-menu-item">
                        <span class="material-symbols-outlined text-[18px]">settings</span>
                        ${t('settings')}
                    </a>
                    <button class="avatar-menu-item w-full text-red-500 hover:!bg-red-50 dark:hover:!bg-red-950/30" id="nav-logout-btn">
                        <span class="material-symbols-outlined text-[18px]">logout</span>
                        ${t('logout') || 'Đăng xuất'}
                    </button>
                </div>
            </div>
        </div>
    ` : `
        <!-- Not logged in -->
        <a href="/login" data-link class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 active:scale-95 transition-all shadow-sm">
            <span class="material-symbols-outlined text-[18px]">login</span>
            ${t('login')}
        </a>
    `;

    return `
    <header class="hidden md:block fixed top-0 w-full z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-800" style="font-family: 'Epilogue', sans-serif;">
        <div class="flex justify-between items-center h-16 px-6 max-w-7xl mx-auto">
            <!-- Brand -->
            <div class="flex items-center gap-8">
                <a class="text-2xl font-black tracking-tighter text-rose-600" href="/" data-link>
                    <span class="material-symbols-outlined fill text-[28px] align-middle mr-1">auto_stories</span>MangaFlow
                </a>
                <nav class="hidden lg:flex gap-1 items-center">
                    <a class="px-3 py-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-zinc-900 transition-all text-sm font-semibold" href="/" data-link>${t('home')}</a>
                    
                    <!-- Genres Dropdown -->
                    <div class="genre-dropdown">
                        <a class="px-3 py-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-zinc-900 transition-all text-sm font-semibold cursor-pointer inline-flex items-center gap-1" id="genre-trigger">
                            ${t('genres')} <span class="material-symbols-outlined text-[16px]">expand_more</span>
                        </a>
                        <div class="genre-dropdown-menu bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-2xl p-4" id="genre-dropdown-panel">
                            <div class="text-center text-zinc-400 text-sm py-4">
                                <span class="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                            </div>
                        </div>
                    </div>
                    
                    <a class="px-3 py-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-zinc-900 transition-all text-sm font-semibold" href="/latest" data-link>${t('latest')}</a>
                    <a class="px-3 py-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-zinc-900 transition-all text-sm font-semibold" href="/trending" data-link>${t('ranking')}</a>
                </nav>
            </div>
            
            <!-- Search + Actions -->
            <div class="flex items-center gap-3">
                <!-- Search Bar -->
                <form id="desktop-search-form" class="relative" onsubmit="event.preventDefault(); const q=this.querySelector('input').value; if(q.trim()) window.router.navigate('/search?keyword='+encodeURIComponent(q));">
                    <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-[20px]">search</span>
                    <input type="text" placeholder="${t('search_placeholder')}" 
                        class="pl-10 pr-4 py-2 w-56 bg-zinc-100 dark:bg-zinc-900 border-none rounded-full text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900 transition-all" />
                </form>
                
                <button id="dark-mode-toggle" class="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors text-zinc-500 dark:text-zinc-400" title="Dark Mode">
                    <span class="material-symbols-outlined text-[22px]" id="dark-mode-icon">dark_mode</span>
                </button>
                
                ${userSection}
            </div>
        </div>
    </header>
    
    <style>
        .user-avatar-dropdown { position: relative; }
        .avatar-dropdown-menu {
            position: absolute;
            right: 0;
            top: calc(100% + 8px);
            width: 220px;
            background: #fff;
            border: 1px solid #e4e4e7;
            border-radius: 16px;
            box-shadow: 0 12px 40px rgba(0,0,0,0.12);
            opacity: 0;
            visibility: hidden;
            transform: translateY(4px);
            transition: all 0.2s ease;
            z-index: 100;
            overflow: hidden;
        }
        html.dark .avatar-dropdown-menu {
            background: #18181b;
            border-color: #3f3f46;
            box-shadow: 0 12px 40px rgba(0,0,0,0.4);
        }
        .user-avatar-dropdown:hover .avatar-dropdown-menu,
        .avatar-dropdown-menu:hover {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        .avatar-menu-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 14px;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 600;
            color: #52525b;
            cursor: pointer;
            transition: background 0.15s;
            text-decoration: none;
            font-family: 'Be Vietnam Pro', sans-serif;
        }
        html.dark .avatar-menu-item {
            color: #a1a1aa;
        }
        .avatar-menu-item:hover {
            background: #f4f4f5;
        }
        html.dark .avatar-menu-item:hover {
            background: #27272a;
        }
    </style>`;
}

export function renderBottomNav() {
    const t = (k) => i18n.t(k);
    const user = getUserFromStorage();
    
    return `
    <nav class="fixed bottom-0 left-0 w-full flex justify-around items-center h-16 px-2 pb-safe md:hidden bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border-t border-zinc-200 dark:border-zinc-800 z-50" style="font-family: 'Be Vietnam Pro', sans-serif;">
        <a class="flex flex-col items-center justify-center gap-0.5 text-rose-600 transition-colors py-2 px-3" href="/" data-link>
            <span class="material-symbols-outlined fill text-[22px]">home</span>
            <span class="text-[10px] font-bold uppercase tracking-wider">${t('home')}</span>
        </a>
        <a class="flex flex-col items-center justify-center gap-0.5 text-zinc-400 hover:text-rose-500 transition-colors py-2 px-3" href="/trending" data-link>
            <span class="material-symbols-outlined text-[22px]">trending_up</span>
            <span class="text-[10px] font-bold uppercase tracking-wider">${t('ranking')}</span>
        </a>
        <a class="flex flex-col items-center justify-center gap-0.5 text-zinc-400 hover:text-rose-500 transition-colors py-2 px-3" href="/library" data-link>
            <span class="material-symbols-outlined text-[22px]">bookmark</span>
            <span class="text-[10px] font-bold uppercase tracking-wider">${t('library')}</span>
        </a>
        <a class="flex flex-col items-center justify-center gap-0.5 text-zinc-400 hover:text-rose-500 transition-colors py-2 px-3" href="${user ? '/settings' : '/login'}" data-link>
            ${user 
                ? `<div class="w-[22px] h-[22px] rounded-full overflow-hidden border border-rose-300 dark:border-rose-700">
                    ${user.avatar 
                        ? `<img src="${user.avatar}" class="w-full h-full object-cover" alt="" />`
                        : `<span class="material-symbols-outlined text-[22px]">person</span>`
                    }
                   </div>`
                : `<span class="material-symbols-outlined text-[22px]">person</span>`
            }
            <span class="text-[10px] font-bold uppercase tracking-wider">${user ? (user.name || '').split(' ').pop() || t('personal') : t('personal')}</span>
        </a>
    </nav>`;
}

// Initialize dark mode toggle and genre dropdown after navbar renders
export function initNavbarInteractions() {
    // Dark mode toggle
    const darkBtn = document.getElementById('dark-mode-toggle');
    const darkIcon = document.getElementById('dark-mode-icon');
    
    if (darkBtn) {
        // Set correct icon
        const isDark = document.documentElement.classList.contains('dark');
        if (darkIcon) darkIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
        
        darkBtn.addEventListener('click', () => {
            const nowDark = document.documentElement.classList.toggle('dark');
            document.documentElement.classList.toggle('light', !nowDark);
            localStorage.setItem('mangaflow_dark', nowDark);
            if (darkIcon) darkIcon.textContent = nowDark ? 'light_mode' : 'dark_mode';
        });
    }
    
    // Load genres into dropdown
    const genrePanel = document.getElementById('genre-dropdown-panel');
    if (genrePanel) {
        const trigger = document.getElementById('genre-trigger');
        // Load genres on hover
        let loaded = false;
        const doLoad = async () => {
            if (loaded) return;
            loaded = true;
            const genres = await loadGenres();
            if (!genres || genres.length === 0) {
                genrePanel.innerHTML = '<p class="text-zinc-400 text-sm text-center py-3">Không tải được thể loại</p>';
                return;
            }
            genrePanel.innerHTML = `
                <div class="grid grid-cols-3 gap-1">
                    ${genres.map(g => `
                        <a href="/genres/${g.slug}" data-link
                           class="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-rose-50 dark:hover:bg-zinc-800 hover:text-rose-600 dark:hover:text-rose-400 transition-all">
                            <span class="material-symbols-outlined text-[18px] text-zinc-400">${GENRE_ICONS[g.name] || 'category'}</span>
                            ${g.name}
                        </a>
                    `).join('')}
                </div>
            `;
        };
        // Load on first hover
        trigger?.parentElement?.addEventListener('mouseenter', doLoad, { once: true });
        // Also load immediately after a short delay for better UX
        setTimeout(doLoad, 2000);
    }
    
    // Logout button in nav dropdown
    const navLogoutBtn = document.getElementById('nav-logout-btn');
    if (navLogoutBtn) {
        navLogoutBtn.addEventListener('click', async () => {
            try {
                await api.logout();
            } catch (e) {
                // Ignore errors
            }
            localStorage.removeItem('mangaflow_user');
            window.refreshLayout();
            window.router.navigate('/');
        });
    }
}
