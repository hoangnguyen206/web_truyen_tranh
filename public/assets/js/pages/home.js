// public/assets/js/pages/home.js
import { api, cdnImage } from '../api.js';
import { i18n } from '../i18n.js';

const SPINNER = `<div class="pt-24 pb-32 text-center"><span class="material-symbols-outlined animate-spin text-4xl text-rose-500">sync</span></div>`;

let currentPage = 1;
let totalPages = 1;
let cdnBase = 'https://img.otruyenapi.com';

export async function render() {
    const container = document.getElementById('app-container');
    container.innerHTML = SPINNER;
    window.showAppNav();
    const t = (k) => i18n.t(k);
    
    try {
        // Load multiple data sources in parallel
        const [homeData, latestData, completedData] = await Promise.all([
            api.home(),
            api.latest(1),
            api.completed(1)
        ]);
        
        cdnBase = homeData?.cdnImageUrl || latestData?.cdnImageUrl || 'https://img.otruyenapi.com';
        const homeItems = homeData?.items || [];
        const latestItems = latestData?.items || [];
        const completedItems = completedData?.items || [];
        
        // Calculate total pages from latest data
        const pagination = latestData?.pagination;
        if (pagination) {
            totalPages = Math.ceil((pagination.totalItems || 0) / (pagination.totalItemsPerPage || 24));
        }
        currentPage = 1;
        
        let html = `
        <main class="pt-16 pb-24 md:pb-0" style="font-family: 'Be Vietnam Pro', sans-serif;">
            <!-- Hero Section -->
            <section class="relative w-full h-[60vh] md:h-[70vh] min-h-[400px] overflow-hidden">
                ${renderHero(homeItems[0] || {}, t)}
            </section>
            
            <div class="px-4 md:px-6 max-w-7xl mx-auto -mt-16 relative z-10">
                <!-- Latest Releases -->
                <section class="mb-14">
                    <div class="flex justify-between items-end mb-6">
                        <div>
                            <h2 class="text-[22px] md:text-[28px] font-black text-zinc-900 dark:text-white tracking-tight" style="font-family: 'Epilogue', sans-serif;">${t('latest_releases')}</h2>
                        </div>
                        <a href="/latest" data-link class="text-rose-500 hover:text-rose-600 font-semibold text-sm transition-colors flex items-center group">
                            ${t('see_more')} <span class="material-symbols-outlined text-[18px] ml-1 transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </a>
                    </div>
                    <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                        ${homeItems.slice(0, 12).map(manga => renderMangaCard(manga, cdnBase)).join('')}
                    </div>
                </section>
                
                <!-- Popular This Week (first 6 from latest page 2 or completed as proxy) -->
                <section class="mb-14">
                    <div class="flex justify-between items-end mb-6">
                        <div>
                            <h2 class="text-[22px] md:text-[28px] font-black text-zinc-900 dark:text-white tracking-tight" style="font-family: 'Epilogue', sans-serif;">🔥 ${t('popular_this_week')}</h2>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                        ${latestItems.slice(0, 10).map((manga, idx) => renderRankedCard(manga, cdnBase, idx + 1)).join('')}
                    </div>
                </section>
                
                <!-- Completed Manga -->
                <section class="mb-14">
                    <div class="flex justify-between items-end mb-6">
                        <div>
                            <h2 class="text-[22px] md:text-[28px] font-black text-zinc-900 dark:text-white tracking-tight" style="font-family: 'Epilogue', sans-serif;">✅ ${t('completed_manga')}</h2>
                        </div>
                    </div>
                    <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                        ${completedItems.slice(0, 12).map(manga => renderMangaCard(manga, cdnBase)).join('')}
                    </div>
                </section>
                
                <!-- All Manga with Pagination -->
                <section class="mb-14">
                    <div class="flex justify-between items-end mb-6">
                        <div>
                            <h2 class="text-[22px] md:text-[28px] font-black text-zinc-900 dark:text-white tracking-tight" style="font-family: 'Epilogue', sans-serif;">📚 ${t('all_manga')}</h2>
                            <p class="text-sm text-zinc-500 mt-1">${t('page')} ${currentPage} / ${totalPages}</p>
                        </div>
                    </div>
                    <div id="all-manga-grid" class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                        ${latestItems.map(manga => renderMangaCard(manga, cdnBase)).join('')}
                    </div>
                    <div id="all-manga-pagination" class="mt-8">
                        ${renderPagination(currentPage, totalPages)}
                    </div>
                </section>
            </div>
        </main>
        `;
        
        container.innerHTML = html;
        
        // Bind pagination events
        bindPaginationEvents();
        
    } catch (error) {
        const t = (k) => i18n.t(k);
        container.innerHTML = `<div class="pt-24 pb-32 text-center text-red-500">${t('error_load_home')}: ${error.message}</div>`;
    }
}

function renderHero(manga, t) {
    if (!manga.name) return '';
    const imgUrl = cdnImage(manga.thumb_url);
    return `
        <div class="absolute inset-0 bg-cover bg-center bg-no-repeat blur-xl scale-110 opacity-50 dark:opacity-30 transition-all duration-1000" style="background-image: url('${imgUrl}')"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-950 via-white/60 dark:via-zinc-950/60 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-white dark:from-zinc-950 via-white/40 dark:via-zinc-950/40 to-transparent md:w-2/3"></div>
        <div class="relative h-full flex items-center px-4 md:px-6 max-w-7xl mx-auto">
            <div class="w-full md:w-1/2 flex flex-col items-start gap-4 z-10">
                <div class="flex flex-wrap gap-2 mb-2">
                    <span class="px-3 py-1 bg-rose-600 text-white rounded-full text-xs font-bold shadow-sm">${t('hot')}</span>
                </div>
                <h1 class="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white leading-tight drop-shadow-sm line-clamp-2 md:line-clamp-3" style="font-family: 'Epilogue', sans-serif;">${manga.name}</h1>
                <p class="text-base text-zinc-600 dark:text-zinc-400 line-clamp-3 md:line-clamp-4 max-w-lg hidden md:block">
                    ${t('chapter_latest')}: ${manga.chaptersLatest?.[0]?.chapter_name || 'N/A'}
                </p>
                <div class="flex gap-4 mt-4 w-full md:w-auto">
                    <a href="/manga/${manga.slug}" data-link class="flex-1 md:flex-none flex items-center justify-center gap-2 bg-rose-600 text-white hover:bg-rose-700 active:scale-95 transition-all px-8 py-4 rounded-full text-sm font-bold shadow-lg">
                        <span class="material-symbols-outlined text-[20px] fill">play_arrow</span> ${t('read_now')}
                    </a>
                </div>
            </div>
        </div>
    `;
}

function renderMangaCard(manga, cdn) {
    const imgUrl = cdnImage(manga.thumb_url, cdn);
    const chapterName = manga.chaptersLatest?.[0]?.chapter_name || '';
    return `
    <article class="flex flex-col group cursor-pointer" onclick="window.router.navigate('/manga/${manga.slug}')">
        <div class="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-sm group-hover:shadow-lg transition-all duration-300 mb-2 bg-zinc-200 dark:bg-zinc-800">
            <img src="${imgUrl}" alt="${manga.name}" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out" loading="lazy" onerror="this.style.display='none'" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
            ${chapterName ? `<div class="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                <span class="text-white text-[11px] font-bold">Ch. ${chapterName}</span>
            </div>` : ''}
        </div>
        <h3 class="text-[13px] md:text-[14px] font-semibold text-zinc-800 dark:text-zinc-200 leading-tight mb-1 group-hover:text-rose-500 transition-colors line-clamp-2">${manga.name}</h3>
    </article>
    `;
}

function renderRankedCard(manga, cdn, rank) {
    const imgUrl = cdnImage(manga.thumb_url, cdn);
    const chapterName = manga.chaptersLatest?.[0]?.chapter_name || '';
    const rankColors = ['', 'text-amber-500', 'text-zinc-400', 'text-amber-700'];
    const rankBg = rank <= 3 ? 'bg-rose-600 text-white' : 'bg-zinc-800/60 text-white';
    return `
    <article class="flex flex-col group cursor-pointer relative" onclick="window.router.navigate('/manga/${manga.slug}')">
        <div class="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-sm group-hover:shadow-lg transition-all duration-300 mb-2 bg-zinc-200 dark:bg-zinc-800">
            <img src="${imgUrl}" alt="${manga.name}" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out" loading="lazy" onerror="this.style.display='none'" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div class="absolute top-2 left-2 w-7 h-7 ${rankBg} rounded-full flex items-center justify-center text-xs font-black shadow-md">${rank}</div>
            ${chapterName ? `<div class="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                <span class="text-white text-[11px] font-bold">Ch. ${chapterName}</span>
            </div>` : ''}
        </div>
        <h3 class="text-[13px] font-semibold text-zinc-800 dark:text-zinc-200 leading-tight line-clamp-2 group-hover:text-rose-500 transition-colors">${manga.name}</h3>
    </article>
    `;
}

function renderPagination(current, total) {
    if (total <= 1) return '';
    
    let buttons = [];
    
    // Previous button
    buttons.push(`<button class="pagination-btn" onclick="window._loadHomePage(${current - 1})" ${current <= 1 ? 'disabled style="opacity:0.3;pointer-events:none"' : ''}>&laquo;</button>`);
    
    // First page
    if (current > 3) {
        buttons.push(`<button class="pagination-btn" onclick="window._loadHomePage(1)">1</button>`);
        if (current > 4) buttons.push(`<span class="px-1 text-zinc-400">...</span>`);
    }
    
    // Page numbers around current
    for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
        buttons.push(`<button class="pagination-btn ${i === current ? 'active' : ''}" onclick="window._loadHomePage(${i})">${i}</button>`);
    }
    
    // Last page
    if (current < total - 2) {
        if (current < total - 3) buttons.push(`<span class="px-1 text-zinc-400">...</span>`);
        buttons.push(`<button class="pagination-btn" onclick="window._loadHomePage(${total})">${total}</button>`);
    }
    
    // Next button
    buttons.push(`<button class="pagination-btn" onclick="window._loadHomePage(${current + 1})" ${current >= total ? 'disabled style="opacity:0.3;pointer-events:none"' : ''}>&raquo;</button>`);
    
    return `<div class="flex justify-center items-center gap-2 flex-wrap">${buttons.join('')}</div>`;
}

function bindPaginationEvents() {
    const t = (k) => i18n.t(k);
    window._loadHomePage = async (page) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        
        const grid = document.getElementById('all-manga-grid');
        const paginationDiv = document.getElementById('all-manga-pagination');
        
        if (!grid || !paginationDiv) return;
        
        // Show loading
        grid.innerHTML = `<div class="col-span-full py-12 text-center"><span class="material-symbols-outlined animate-spin text-3xl text-rose-500">sync</span></div>`;
        
        try {
            const data = await api.latest(page);
            const items = data?.items || [];
            const cdn = data?.cdnImageUrl || cdnBase;
            
            currentPage = page;
            
            // Update pagination info
            if (data?.pagination) {
                totalPages = Math.ceil((data.pagination.totalItems || 0) / (data.pagination.totalItemsPerPage || 24));
            }
            
            // Update grid
            grid.innerHTML = items.map(manga => renderMangaCard(manga, cdn)).join('');
            
            // Update pagination buttons
            paginationDiv.innerHTML = renderPagination(currentPage, totalPages);
            
            // Update page info text
            const pageInfo = grid.parentElement?.querySelector('p.text-sm');
            if (pageInfo) pageInfo.textContent = `${t('page')} ${currentPage} / ${totalPages}`;
            
            // Scroll to the all-manga section
            grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
        } catch (e) {
            grid.innerHTML = `<div class="col-span-full py-12 text-center text-red-500">${e.message}</div>`;
        }
    };
}
