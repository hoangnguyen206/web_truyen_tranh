// public/assets/js/pages/library.js
// My Library — Matches library.html design (Material Design 3 tokens)
import { api, cdnImage } from '../api.js';
import { i18n } from '../i18n.js';

const SPINNER = `<div class="min-h-[400px] flex items-center justify-center"><span class="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span></div>`;

let currentTab = 'reading';

export async function render() {
    const t = (k) => i18n.t(k);
    const container = document.getElementById('app-container');
    window.showAppNav();

    // Check if logged in
    const userStr = localStorage.getItem('mangaflow_user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user) {
        renderLoginRequired(container);
        return;
    }

    container.innerHTML = `
    <main class="max-w-[1280px] mx-auto px-gutter py-md pt-20 pb-24 md:pb-8">
        <div class="mb-lg">
            <h1 class="font-display-lg text-display-lg text-on-surface mb-md" style="font-family: 'Epilogue', sans-serif;">${t('library')}</h1>
            <!-- Library Tabs -->
            <div class="flex gap-4 border-b border-surface-variant" id="library-tabs">
                <button class="lib-tab pb-sm border-b-2 font-label-md text-label-md px-2 transition-colors ${currentTab === 'reading' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}" data-tab="reading">
                    ${t('reading_tab')} <span class="tab-count" id="count-reading">0</span>
                </button>
                <button class="lib-tab pb-sm border-b-2 font-label-md text-label-md px-2 transition-colors ${currentTab === 'want_to_read' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}" data-tab="want_to_read">
                    ${t('want_to_read_tab')} <span class="tab-count" id="count-want_to_read">0</span>
                </button>
                <button class="lib-tab pb-sm border-b-2 font-label-md text-label-md px-2 transition-colors ${currentTab === 'completed' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}" data-tab="completed">
                    ${t('completed_tab')} <span class="tab-count" id="count-completed">0</span>
                </button>
            </div>
        </div>
        <!-- Content Area -->
        <div id="library-content">
            ${SPINNER}
        </div>
    </main>

    <style>
        .lib-tab {
            cursor: pointer;
            background: none;
            border-left: none;
            border-right: none;
            border-top: none;
            font-family: 'Be Vietnam Pro', sans-serif;
        }
        .lib-tab:hover {
            color: var(--tw-text-opacity, 1);
        }
        .tab-count {
            font-size: 11px;
            font-weight: 700;
            padding: 1px 6px;
            border-radius: 99px;
            background: rgba(0,0,0,0.06);
            margin-left: 4px;
        }
        html.dark .tab-count {
            background: rgba(255,255,255,0.1);
        }

        .library-card {
            transition: all 0.2s ease;
        }
        .library-card:hover {
            box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }
        html.dark .library-card:hover {
            box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }

        .progress-bar-fill {
            transition: width 0.5s ease;
        }

        .context-menu {
            position: absolute;
            right: 8px;
            top: 8px;
            z-index: 20;
        }
        .context-menu-panel {
            position: absolute;
            right: 0;
            top: 100%;
            width: 200px;
            background: #fff;
            border: 1px solid #e4e4e7;
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.12);
            padding: 4px;
            z-index: 30;
            display: none;
            font-size: 13px;
        }
        html.dark .context-menu-panel {
            background: #27272a;
            border-color: #3f3f46;
        }
        .context-menu-panel.show {
            display: block;
        }
        .ctx-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            border-radius: 8px;
            cursor: pointer;
            color: #52525b;
            font-weight: 500;
            transition: background 0.15s;
            font-family: 'Be Vietnam Pro', sans-serif;
        }
        html.dark .ctx-item {
            color: #a1a1aa;
        }
        .ctx-item:hover {
            background: #f4f4f5;
        }
        html.dark .ctx-item:hover {
            background: #3f3f46;
        }
        .ctx-item.danger {
            color: #ef4444;
        }
        .ctx-item.danger:hover {
            background: #fef2f2;
        }
        html.dark .ctx-item.danger:hover {
            background: #451a1a;
        }
    </style>`;

    // Bind tab clicks
    document.querySelectorAll('.lib-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            currentTab = btn.dataset.tab;
            // Update tab active styles
            document.querySelectorAll('.lib-tab').forEach(b => {
                b.classList.remove('border-primary', 'text-primary');
                b.classList.add('border-transparent', 'text-on-surface-variant');
            });
            btn.classList.remove('border-transparent', 'text-on-surface-variant');
            btn.classList.add('border-primary', 'text-primary');
            loadLibraryContent();
        });
    });

    // Close any open context menus when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.context-menu')) {
            document.querySelectorAll('.context-menu-panel.show').forEach(p => p.classList.remove('show'));
        }
    });

    loadLibraryContent();
}

async function loadLibraryContent() {
    const content = document.getElementById('library-content');
    if (!content) return;
    content.innerHTML = SPINNER;

    try {
        const data = await api.library(currentTab);
        const items = data.items || [];
        const counts = data.counts || {};
        const t = (k) => i18n.t(k);

        // Update tab counts
        ['reading', 'want_to_read', 'completed'].forEach(tab => {
            const el = document.getElementById(`count-${tab}`);
            if (el) el.textContent = counts[tab] || 0;
        });

        if (items.length === 0) {
            content.innerHTML = renderEmptyState();
            return;
        }

        if (currentTab === 'reading') {
            content.innerHTML = renderReadingTab(items);
        } else if (currentTab === 'want_to_read') {
            content.innerHTML = renderWantToReadTab(items);
        } else {
            content.innerHTML = renderCompletedTab(items);
        }

        bindCardActions();

    } catch (err) {
        const t = (k) => i18n.t(k);
        if (err.message && err.message.includes('đăng nhập')) {
            renderLoginRequired(document.getElementById('app-container'));
        } else {
            content.innerHTML = `
            <div class="flex flex-col items-center justify-center py-16 text-center">
                <span class="material-symbols-outlined text-5xl text-error mb-3">error</span>
                <p class="font-body-md text-on-surface-variant">${err.message}</p>
                <button onclick="window.router.navigate('/library')" class="mt-4 px-5 py-2 bg-primary text-on-primary text-sm font-semibold rounded-full">${t('try_again') || 'Thử lại'}</button>
            </div>`;
        }
    }
}

function renderEmptyState() {
    const t = (k) => i18n.t(k);
    const messages = {
        reading: { icon: 'auto_stories', title: t('empty_reading_title'), desc: t('empty_reading_desc') },
        want_to_read: { icon: 'bookmark_add', title: t('empty_want_title'), desc: t('empty_want_desc') },
        completed: { icon: 'check_circle', title: t('empty_completed_title'), desc: t('empty_completed_desc') }
    };
    const m = messages[currentTab] || messages.reading;

    return `
    <div class="flex flex-col items-center justify-center py-20 text-center">
        <div class="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center mb-5">
            <span class="material-symbols-outlined text-5xl text-outline">${m.icon}</span>
        </div>
        <h3 class="font-headline-md text-headline-md text-on-surface mb-2" style="font-family: 'Epilogue', sans-serif;">${m.title}</h3>
        <p class="font-body-md text-body-md text-on-surface-variant mb-6 max-w-xs">${m.desc}</p>
        <button onclick="window.router.navigate('/')" class="px-6 py-3 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md hover:shadow-md active:scale-95 transition-all">
            <span class="material-symbols-outlined text-[16px] align-middle mr-1">explore</span>${t('explore_now')}
        </button>
    </div>`;
}

function renderReadingTab(items) {
    const t = (k) => i18n.t(k);
    // First item as hero "Continue Reading" bento card (matching library.html)
    const hero = items[0];
    const rest = items.slice(1);
    const heroProgress = hero.total_chapters > 0 ? Math.round((hero.chapters_read / hero.total_chapters) * 100) : 0;
    const heroThumb = cdnImage(hero.manga_thumb);

    let html = `
    <!-- Continue Reading (Featured Bento Card) -->
    <section class="mb-lg">
        <h2 class="font-headline-md text-headline-md text-on-surface mb-md" style="font-family: 'Epilogue', sans-serif;">${t('continue_reading')}</h2>
        <div class="library-card bg-surface-container-low rounded-xl overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow group cursor-pointer border border-surface-variant relative"
             onclick="window.router.navigate('/manga/${hero.manga_slug}')">
            ${renderContextMenu(hero)}
            <div class="w-full md:w-1/3 aspect-[2/1] md:aspect-[3/4] relative">
                <img alt="${hero.manga_name}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                     src="${heroThumb}"
                     onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 600%22><rect fill=%22%23f4f4f5%22 width=%22400%22 height=%22600%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 fill=%22%23a1a1aa%22 font-size=%2220%22>No Image</text></svg>'" />
                <div class="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-surface-container-low via-surface-container-low/50 to-transparent md:to-transparent"></div>
            </div>
            <div class="p-lg flex flex-col justify-center flex-1 relative z-10">
                <div class="inline-flex items-center gap-2 bg-primary-container text-on-primary-container px-3 py-1 rounded-full w-fit mb-4">
                    <span class="material-symbols-outlined text-[16px]">bookmark</span>
                    <span class="font-label-sm text-label-sm uppercase tracking-wider">Ch. ${hero.last_chapter_read || '?'} ${hero.total_chapters > 0 ? '/ ' + hero.total_chapters : ''}</span>
                </div>
                <h3 class="font-headline-lg text-headline-lg text-on-surface mb-2" style="font-family: 'Epilogue', sans-serif;">${hero.manga_name}</h3>
                <p class="font-body-md text-body-md text-on-surface-variant mb-6 line-clamp-2">${hero.manga_status === 'completed' ? '🏁 ' + t('completed_status') : '📖 ' + t('ongoing_status')} · ${t('updated')} ${timeAgo(hero.updated_at)}</p>
                <div class="mt-auto">
                    <div class="w-full bg-surface-variant h-1 rounded-full overflow-hidden mb-2">
                        <div class="bg-primary h-full rounded-full progress-bar-fill" style="width: ${heroProgress}%"></div>
                    </div>
                    <div class="flex justify-between text-label-sm font-label-sm text-on-surface-variant">
                        <span>${heroProgress}%</span>
                        <span>${hero.chapters_read} / ${hero.total_chapters || '?'} ${t('chapter')}</span>
                    </div>
                </div>
            </div>
        </div>
    </section>`;

    if (rest.length > 0) {
        html += `
        <!-- Up Next Grid -->
        <section>
            <h2 class="font-headline-md text-headline-md text-on-surface mb-md" style="font-family: 'Epilogue', sans-serif;">${t('up_next')}</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-gutter">
                ${rest.map(item => renderMangaCard(item, 'reading')).join('')}
            </div>
        </section>`;
    }

    return html;
}

function renderWantToReadTab(items) {
    const t = (k) => i18n.t(k);
    return `
    <section>
        <h2 class="font-headline-md text-headline-md text-on-surface mb-md" style="font-family: 'Epilogue', sans-serif;">${t('want_to_read_tab')}</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-gutter">
            ${items.map(item => renderMangaCard(item, 'want_to_read')).join('')}
        </div>
    </section>`;
}

function renderCompletedTab(items) {
    const t = (k) => i18n.t(k);
    return `
    <section>
        <h2 class="font-headline-md text-headline-md text-on-surface mb-md" style="font-family: 'Epilogue', sans-serif;">${t('completed_tab')}</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-gutter">
            ${items.map(item => renderMangaCard(item, 'completed')).join('')}
        </div>
    </section>`;
}

function renderMangaCard(item, tab) {
    const t = (k) => i18n.t(k);
    const thumb = cdnImage(item.manga_thumb);
    const progress = item.total_chapters > 0 ? Math.round((item.chapters_read / item.total_chapters) * 100) : 0;

    // Badge — matches library.html card style
    let badge = '';
    if (tab === 'reading') {
        badge = `
        <div class="absolute top-2 right-2 bg-surface-container/90 backdrop-blur-sm text-on-surface px-2 py-1 rounded font-label-sm text-label-sm flex items-center gap-1 shadow-sm">
            <span class="material-symbols-outlined text-[14px]">new_releases</span>
            <span>Ch. ${item.last_chapter_read || '?'}</span>
        </div>`;
    } else if (tab === 'completed') {
        badge = `
        <div class="absolute top-2 right-2 bg-surface-container/90 backdrop-blur-sm text-on-surface px-2 py-1 rounded font-label-sm text-label-sm flex items-center gap-1 shadow-sm">
            <span class="material-symbols-outlined text-[14px]">check_circle</span>
            <span>${t('completed_status')}</span>
        </div>`;
    } else {
        badge = `
        <div class="absolute top-2 right-2 bg-surface-container/90 backdrop-blur-sm text-on-surface px-2 py-1 rounded font-label-sm text-label-sm flex items-center gap-1 shadow-sm">
            <span>${t('saved')}</span>
        </div>`;
    }

    return `
    <div class="library-card group relative" data-slug="${item.manga_slug}">
        ${renderContextMenu(item)}
        <a href="javascript:void(0)" onclick="window.router.navigate('/manga/${item.manga_slug}')" class="group block">
            <div class="relative aspect-[2/3] rounded-lg overflow-hidden shadow-sm mb-3">
                <img alt="${item.manga_name}" loading="lazy"
                     class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                     src="${thumb}"
                     onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 300%22><rect fill=%22%23f4f4f5%22 width=%22200%22 height=%22300%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 fill=%22%23a1a1aa%22 font-size=%2214%22>No Image</text></svg>'" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                ${badge}
            </div>
            <h4 class="font-label-md text-label-md text-on-surface line-clamp-1 group-hover:text-primary transition-colors">${item.manga_name}</h4>
            <p class="font-label-sm text-label-sm text-on-surface-variant">${tab === 'reading' ? `${t('chapter')} ${item.last_chapter_read || '?'}` : tab === 'completed' ? '✓ ' + t('completed_status') : timeAgo(item.added_at)}</p>
        </a>
    </div>`;
}

function renderContextMenu(item) {
    const t = (k) => i18n.t(k);
    return `
    <div class="context-menu">
        <button class="ctx-toggle p-1.5 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-zinc-700 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                onclick="event.stopPropagation(); toggleCtxMenu(this)">
            <span class="material-symbols-outlined text-[18px] text-zinc-500">more_vert</span>
        </button>
        <div class="context-menu-panel">
            ${currentTab !== 'reading' ? `
            <div class="ctx-item" onclick="event.stopPropagation(); moveToTab('${item.manga_slug}', 'reading')">
                <span class="material-symbols-outlined text-[16px]">auto_stories</span> ${t('move_to_reading')}
            </div>` : ''}
            ${currentTab !== 'want_to_read' ? `
            <div class="ctx-item" onclick="event.stopPropagation(); moveToTab('${item.manga_slug}', 'want_to_read')">
                <span class="material-symbols-outlined text-[16px]">bookmark_add</span> ${t('move_to_want')}
            </div>` : ''}
            ${currentTab !== 'completed' ? `
            <div class="ctx-item" onclick="event.stopPropagation(); moveToTab('${item.manga_slug}', 'completed')">
                <span class="material-symbols-outlined text-[16px]">check_circle</span> ${t('mark_completed')}
            </div>` : ''}
            <div class="ctx-item danger" onclick="event.stopPropagation(); removeFromLib('${item.manga_slug}')">
                <span class="material-symbols-outlined text-[16px]">delete</span> ${t('remove')}
            </div>
        </div>
    </div>`;
}

function renderLoginRequired(container) {
    const t = (k) => i18n.t(k);
    container.innerHTML = `
    <main class="max-w-[1280px] mx-auto px-gutter py-md pt-20 pb-24 md:pb-8">
        <div class="flex flex-col items-center justify-center py-24 text-center">
            <div class="w-28 h-28 rounded-full bg-surface-container flex items-center justify-center mb-6">
                <span class="material-symbols-outlined text-6xl text-outline">lock</span>
            </div>
            <h2 class="font-headline-lg text-headline-lg text-on-surface mb-3" style="font-family: 'Epilogue', sans-serif;">${t('sign_in_library')}</h2>
            <p class="font-body-md text-body-md text-on-surface-variant mb-6 max-w-md">${t('sign_in_library_desc')}</p>
            <div class="flex gap-3">
                <button onclick="window.router.navigate('/login')" class="px-8 py-3 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md hover:shadow-md active:scale-95 transition-all">
                    <span class="material-symbols-outlined text-[16px] align-middle mr-1">login</span>${t('sign_in')}
                </button>
                <button onclick="window.router.navigate('/register')" class="px-8 py-3 rounded-full bg-surface-container text-on-surface font-label-md text-label-md hover:shadow-md active:scale-95 transition-all border border-outline-variant">
                    ${t('register')}
                </button>
            </div>
        </div>
    </main>`;
}

function bindCardActions() {
    // Context menu toggle
    window.toggleCtxMenu = (btn) => {
        const panel = btn.nextElementSibling;
        // Close all other menus first
        document.querySelectorAll('.context-menu-panel.show').forEach(p => {
            if (p !== panel) p.classList.remove('show');
        });
        panel.classList.toggle('show');
    };

    // Move to tab
    window.moveToTab = async (slug, tab) => {
        try {
            await api.changeTab(slug, tab);
            showToast(tab === 'completed' ? 'Marked as completed ✓' : 'Moved successfully');
            loadLibraryContent();
        } catch (e) {
            showToast('Error: ' + e.message, true);
        }
    };

    // Remove from library
    window.removeFromLib = async (slug) => {
        if (!confirm('Remove this manga from your library?')) return;
        try {
            await api.removeFromLib(slug);
            showToast('Removed from library');
            loadLibraryContent();
        } catch (e) {
            showToast('Error: ' + e.message, true);
        }
    };
}

function showToast(message, isError = false) {
    const existing = document.getElementById('lib-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'lib-toast';
    toast.className = `fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl font-label-md text-label-md shadow-lg z-[100] transition-all duration-300 ${
        isError ? 'bg-error text-on-error' : 'bg-inverse-surface text-inverse-on-surface'
    }`;
    toast.style.fontFamily = "'Be Vietnam Pro', sans-serif";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, 10px)';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

function timeAgo(dateStr) {
    const t = (k) => i18n.t(k);
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return t('just_now');
    if (diff < 3600) return Math.floor(diff / 60) + ' ' + t('m_ago');
    if (diff < 86400) return Math.floor(diff / 3600) + ' ' + t('h_ago');
    if (diff < 2592000) return Math.floor(diff / 86400) + ' ' + t('d_ago');
    return Math.floor(diff / 2592000) + ' ' + t('mo_ago');
}
