// public/assets/js/pages/genres.js
// Genre manga list page — accessed from dropdown menu navigation
import { api, cdnImage } from '../api.js';
import { i18n } from '../i18n.js';

const SPINNER = `<div class="min-h-screen flex items-center justify-center"><span class="material-symbols-outlined animate-spin text-4xl text-rose-500">progress_activity</span></div>`;

let currentGenreSlug = '';
let currentPage = 1;
let totalPages = 1;

export async function renderGenre(slug, query) {
    const container = document.getElementById('app-container');
    window.showAppNav();
    const t = (k) => i18n.t(k);
    
    currentGenreSlug = slug;
    const params = new URLSearchParams(query);
    currentPage = parseInt(params.get('page')) || 1;
    
    container.innerHTML = SPINNER;
    try {
        const data = await api.genreList(slug, currentPage);
        const cdn = data.cdnImageUrl || 'https://img.otruyenapi.com';
        const items = data.items || [];
        const title = data.titlePage || slug;
        const pagination = data.pagination;
        
        if (pagination) {
            totalPages = Math.ceil((pagination.totalItems || 0) / (pagination.totalItemsPerPage || 24));
        }
        
        container.innerHTML = `
        <main class="pt-20 pb-24 md:pb-8 px-4 md:px-6 max-w-7xl mx-auto" style="font-family: 'Be Vietnam Pro', sans-serif;">
            <header class="mb-8 flex items-center gap-3">
                <button onclick="history.back()" class="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-600 dark:text-zinc-400">
                    <span class="material-symbols-outlined">arrow_back</span>
                </button>
                <div>
                    <h1 class="text-2xl font-black text-zinc-900 dark:text-white" style="font-family: 'Epilogue', sans-serif;">${title}</h1>
                    <p class="text-sm text-zinc-500 dark:text-zinc-400">${pagination ? pagination.totalItems + ' ' + t('manga_count') : ''} · ${t('page')} ${currentPage}/${totalPages}</p>
                </div>
            </header>
            <div id="genre-manga-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                ${items.map(m => mangaCard(m, cdn)).join('')}
            </div>
            ${items.length === 0 ? `<div class="py-20 text-center text-zinc-400 dark:text-zinc-500">${t('no_manga')}</div>` : ''}
            <div id="genre-pagination" class="mt-8">
                ${renderGenrePagination(currentPage, totalPages)}
            </div>
        </main>`;
        
        // Bind pagination
        window._loadGenrePage = (page) => {
            if (page < 1 || page > totalPages) return;
            window.router.navigate(`/genres/${currentGenreSlug}?page=${page}`);
        };
        
    } catch (e) {
        container.innerHTML = `<div class="min-h-screen flex items-center justify-center text-red-500">${e.message}</div>`;
    }
}

function mangaCard(manga, cdn) {
    const img = cdnImage(manga.thumb_url, cdn);
    const ch = manga.chaptersLatest?.[0]?.chapter_name;
    return `
    <article class="group cursor-pointer" onclick="window.router.navigate('/manga/${manga.slug}')">
        <div class="relative aspect-[2/3] rounded-xl overflow-hidden mb-2 bg-zinc-200 dark:bg-zinc-800 shadow-sm group-hover:shadow-md transition-shadow">
            <img src="${img}" alt="${manga.name}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.style.display='none'" />
            ${ch ? `<div class="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent"><span class="text-white text-[11px] font-bold">Ch. ${ch}</span></div>` : ''}
        </div>
        <h3 class="text-[13px] font-semibold text-zinc-800 dark:text-zinc-200 leading-tight line-clamp-2 group-hover:text-rose-500 transition-colors">${manga.name}</h3>
    </article>`;
}

function renderGenrePagination(current, total) {
    if (total <= 1) return '';
    
    let buttons = [];
    buttons.push(`<button class="pagination-btn" onclick="window._loadGenrePage(${current - 1})" ${current <= 1 ? 'disabled style="opacity:0.3;pointer-events:none"' : ''}>&laquo;</button>`);
    
    if (current > 3) {
        buttons.push(`<button class="pagination-btn" onclick="window._loadGenrePage(1)">1</button>`);
        if (current > 4) buttons.push(`<span class="px-1 text-zinc-400">...</span>`);
    }
    
    for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
        buttons.push(`<button class="pagination-btn ${i === current ? 'active' : ''}" onclick="window._loadGenrePage(${i})">${i}</button>`);
    }
    
    if (current < total - 2) {
        if (current < total - 3) buttons.push(`<span class="px-1 text-zinc-400">...</span>`);
        buttons.push(`<button class="pagination-btn" onclick="window._loadGenrePage(${total})">${total}</button>`);
    }
    
    buttons.push(`<button class="pagination-btn" onclick="window._loadGenrePage(${current + 1})" ${current >= total ? 'disabled style="opacity:0.3;pointer-events:none"' : ''}>&raquo;</button>`);
    
    return `<div class="flex justify-center items-center gap-2 flex-wrap">${buttons.join('')}</div>`;
}
