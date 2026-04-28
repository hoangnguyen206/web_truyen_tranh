// public/assets/js/pages/trending.js
import { api, cdnImage } from '../api.js';
import { i18n } from '../i18n.js';

const SPINNER = `<div class="min-h-screen flex items-center justify-center"><span class="material-symbols-outlined animate-spin text-4xl text-rose-500">progress_activity</span></div>`;

// Available ranking categories matching API endpoints
const RANK_TABS = [
    { id: 'ongoing',     endpoint: 'trending',   labelKey: 'filter_ongoing' },
    { id: 'new',         endpoint: 'newManga',    labelKey: 'filter_new_manga' },
    { id: 'completed',   endpoint: 'completed',   labelKey: 'filter_completed' },
    { id: 'coming-soon', endpoint: 'comingSoon',  labelKey: 'filter_coming_soon' },
];

let currentTab = 'ongoing';
let currentPage = 1;

export async function render(query) {
    const container = document.getElementById('app-container');
    window.showAppNav();
    const t = (k) => i18n.t(k);
    
    // Parse query for tab
    const params = new URLSearchParams(query);
    currentTab = params.get('tab') || 'ongoing';
    currentPage = parseInt(params.get('page')) || 1;
    
    container.innerHTML = SPINNER;
    
    try {
        await loadRankingData(container, t);
    } catch (e) {
        container.innerHTML = `<div class="min-h-screen flex items-center justify-center text-red-500">${e.message}</div>`;
    }
}

async function loadRankingData(container, t) {
    const tab = RANK_TABS.find(tb => tb.id === currentTab) || RANK_TABS[0];
    
    // Call the appropriate API endpoint
    let data;
    switch (tab.endpoint) {
        case 'newManga':   data = await api.newManga(currentPage); break;
        case 'completed':  data = await api.completed(currentPage); break;
        case 'comingSoon': data = await api.comingSoon(currentPage); break;
        default:           data = await api.trending(currentPage); break;
    }
    
    const cdn = data?.cdnImageUrl || 'https://img.otruyenapi.com';
    const items = data?.items || [];
    const pagination = data?.pagination;
    const totalPages = pagination ? Math.ceil((pagination.totalItems || 0) / (pagination.totalItemsPerPage || 24)) : 1;
    
    const top3 = items.slice(0, 3);
    const rest = items.slice(3);
    
    container.innerHTML = `
    <main class="pt-20 pb-24 md:pb-8 px-4 md:px-6 max-w-7xl mx-auto" style="font-family: 'Be Vietnam Pro', sans-serif;">
        <header class="mb-8 text-center">
            <h1 class="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white" style="font-family: 'Epilogue', sans-serif;">${t('ranking_title')}</h1>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">${t('ranking_desc')}</p>
        </header>
        
        <!-- Filter Tabs -->
        <div class="flex justify-center gap-2 flex-wrap mb-8" id="ranking-tabs">
            ${RANK_TABS.map(tb => `
                <button class="rank-tab ${tb.id === currentTab ? 'active' : ''}" 
                        data-tab="${tb.id}">
                    ${t(tb.labelKey)}
                </button>
            `).join('')}
        </div>
        
        <!-- Content -->
        <div id="ranking-content">
            ${top3.length >= 3 ? renderPodium(top3, cdn) : ''}
            
            <div class="max-w-3xl mx-auto space-y-3 mt-8">
                ${rest.map((m, i) => rankRow(m, cdn, i + 4)).join('')}
            </div>
            
            ${items.length === 0 ? '<div class="py-20 text-center text-zinc-400 dark:text-zinc-500">Không có dữ liệu</div>' : ''}
            
            <!-- Pagination -->
            ${renderTrendingPagination(currentPage, totalPages)}
        </div>
    </main>`;
    
    // Bind tab click events
    document.querySelectorAll('#ranking-tabs .rank-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            currentTab = tabId;
            currentPage = 1;
            window.router.navigate(`/trending?tab=${tabId}`);
        });
    });
}

function renderPodium(top3, cdn) {
    const order = [top3[1], top3[0], top3[2]]; // 2nd, 1st, 3rd
    const heights = ['h-28 md:h-36', 'h-36 md:h-44', 'h-20 md:h-28'];
    const badges = ['🥈', '🥇', '🥉'];
    const sizes = ['w-[28%]', 'w-[34%]', 'w-[28%]'];
    return `
    <div class="flex items-end justify-center gap-2 md:gap-4 mb-6">
        ${order.map((m, i) => `
        <div class="${sizes[i]} max-w-[200px] flex flex-col items-center cursor-pointer group" onclick="window.router.navigate('/manga/${m.slug}')">
            <div class="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-md ${i===1 ? 'ring-2 ring-rose-500/50' : ''} group-hover:shadow-lg transition-shadow">
                <img src="${cdnImage(m.thumb_url, cdn)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div class="absolute top-1 left-1 text-xl">${badges[i]}</div>
            </div>
            <div class="${heights[i]} w-full ${i===1 ? 'bg-rose-50 dark:bg-rose-950/30' : 'bg-zinc-100 dark:bg-zinc-800/50'} mt-2 rounded-t-lg flex items-end justify-center pb-2">
                <p class="text-[11px] md:text-xs font-bold text-center px-1 line-clamp-2 ${i===1 ? 'text-rose-600' : 'text-zinc-700 dark:text-zinc-300'}">${m.name}</p>
            </div>
        </div>`).join('')}
    </div>`;
}

function rankRow(manga, cdn, rank) {
    const img = cdnImage(manga.thumb_url, cdn);
    const ch = manga.chaptersLatest?.[0]?.chapter_name;
    return `
    <div class="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-rose-200 dark:hover:border-rose-800 transition-colors cursor-pointer group shadow-sm" onclick="window.router.navigate('/manga/${manga.slug}')">
        <div class="w-8 text-center font-bold text-zinc-300 dark:text-zinc-600 text-lg">${rank}</div>
        <img src="${img}" class="w-14 h-20 object-cover rounded-md shadow-sm flex-shrink-0" onerror="this.style.display='none'" />
        <div class="flex-1 min-w-0">
            <h3 class="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate group-hover:text-rose-500 transition-colors">${manga.name}</h3>
            <p class="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">${ch ? `Ch. ${ch}` : ''} · ${(manga.category||[]).slice(0,2).map(c=>c.name).join(', ')}</p>
        </div>
    </div>`;
}

function renderTrendingPagination(current, total) {
    if (total <= 1) return '';
    
    let buttons = [];
    buttons.push(`<button class="pagination-btn" onclick="window._loadRankPage(${current - 1})" ${current <= 1 ? 'disabled style="opacity:0.3;pointer-events:none"' : ''}>&laquo;</button>`);
    
    if (current > 3) {
        buttons.push(`<button class="pagination-btn" onclick="window._loadRankPage(1)">1</button>`);
        if (current > 4) buttons.push(`<span class="px-1 text-zinc-400">...</span>`);
    }
    
    for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
        buttons.push(`<button class="pagination-btn ${i === current ? 'active' : ''}" onclick="window._loadRankPage(${i})">${i}</button>`);
    }
    
    if (current < total - 2) {
        if (current < total - 3) buttons.push(`<span class="px-1 text-zinc-400">...</span>`);
        buttons.push(`<button class="pagination-btn" onclick="window._loadRankPage(${total})">${total}</button>`);
    }
    
    buttons.push(`<button class="pagination-btn" onclick="window._loadRankPage(${current + 1})" ${current >= total ? 'disabled style="opacity:0.3;pointer-events:none"' : ''}>&raquo;</button>`);
    
    // Bind the page loading function
    window._loadRankPage = (page) => {
        if (page < 1 || page > total) return;
        window.router.navigate(`/trending?tab=${currentTab}&page=${page}`);
    };
    
    return `<div class="mt-10 flex justify-center items-center gap-2 flex-wrap">${buttons.join('')}</div>`;
}
