// public/assets/js/pages/home.js
import { api, cdnImage } from '../api.js';
import { i18n } from '../i18n.js';

const SPINNER = `<div class="pt-24 pb-32 text-center"><span class="material-symbols-outlined animate-spin text-4xl text-rose-500">sync</span></div>`;

let currentPage = 1;
let totalPages = 1;
let cdnBase = 'https://img.otruyenapi.com';
let heroIntervalId = null; // Track carousel interval for cleanup

export async function render() {
    // Cleanup previous carousel interval
    if (heroIntervalId) { clearInterval(heroIntervalId); heroIntervalId = null; }
    
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
            <!-- Hero Banner Carousel -->
            <section class="w-full mb-8 md:mb-12 px-0 md:px-6">
                ${renderHeroCarousel(homeItems.slice(0, 5), t)}
            </section>
            
            <div class="px-4 md:px-6 max-w-7xl mx-auto">
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
        
        // Initialize hero carousel
        initHeroCarousel();
        
        // Bind hero "Add to Library" button
        window._heroAddToLibrary = async (slug) => {
            const user = localStorage.getItem('mangaflow_user');
            if (!user) {
                window.router.navigate('/login');
                return;
            }
            try {
                await api.addToLibrary({ manga_slug: slug, tab: 'want_to_read' });
                // Show brief feedback
                const btn = document.querySelector('.hero-slide.active [data-hero-lib]');
                if (btn) {
                    const origHTML = btn.innerHTML;
                    btn.innerHTML = `<span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1;">bookmark_added</span> ${t('saved')}`;
                    btn.classList.remove('bg-white/10');
                    btn.classList.add('bg-emerald-500/30');
                    setTimeout(() => {
                        btn.innerHTML = origHTML;
                        btn.classList.add('bg-white/10');
                        btn.classList.remove('bg-emerald-500/30');
                    }, 2000);
                }
            } catch (e) {
                console.error('Add to library error:', e);
            }
        };
        
    } catch (error) {
        const t = (k) => i18n.t(k);
        container.innerHTML = `<div class="pt-24 pb-32 text-center text-red-500">${t('error_load_home')}: ${error.message}</div>`;
    }
}

// ===== Hero Carousel =====

function renderHeroCarousel(mangaList, t) {
    if (!mangaList || mangaList.length === 0) return '';
    
    const slides = mangaList.filter(m => m.name).map((manga, idx) => {
        const imgUrl = cdnImage(manga.thumb_url);
        const categories = manga.category || [];
        const categoryTags = categories.slice(0, 3).map(c => {
            const name = c.name || c;
            const slug = c.slug || encodeURIComponent(name);
            return `<a href="/genres/${slug}" data-link onclick="event.stopPropagation()" class="bg-white/15 hover:bg-rose-500/80 text-white px-3 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md border border-white/10 transition-colors z-20 relative pointer-events-auto">${name}</a>`;
        }).join('');
        
        const firstChapterApiData = manga.chaptersLatest?.[0]?.chapter_api_data || '';
        const firstChapterName = manga.chaptersLatest?.[0]?.chapter_name || '1';
        const rankNum = idx + 1;
        
        // Build the "Read Chapter 1" link — goes directly to reader
        const readChapter1Href = firstChapterApiData 
            ? `/read?url=${encodeURIComponent(firstChapterApiData)}&slug=${manga.slug}`
            : `/manga/${manga.slug}`;
        
        return `
        <div class="hero-slide absolute inset-0 transition-opacity duration-700 ease-in-out cursor-pointer ${idx === 0 ? 'active opacity-100 z-10' : 'opacity-0 z-0'}" data-slide="${idx}" onclick="window.router.navigate('/manga/${manga.slug}')">
            <!-- Banner Image -->
            <img alt="${manga.name}" 
                 class="w-full h-full object-cover transition-transform duration-[8000ms] ease-out ${idx === 0 ? 'scale-105' : 'scale-100'}" 
                 src="${imgUrl}" 
                 loading="${idx === 0 ? 'eager' : 'lazy'}"
                 onerror="this.style.display='none'" />
            <!-- Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            <!-- Content -->
            <div class="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
                <!-- Tags -->
                <div class="flex flex-wrap gap-2 mb-3">
                    <span class="bg-rose-600 text-white px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-lg">
                        🔥 ${t('trending_num')} #${rankNum}
                    </span>
                    ${categoryTags}
                </div>
                <!-- Title -->
                <h2 class="text-white text-3xl md:text-[48px] font-black leading-tight mb-2 line-clamp-2 drop-shadow-lg" style="font-family: 'Epilogue', sans-serif; letter-spacing: -0.02em;">
                    ${manga.name}
                </h2>
                <!-- Synopsis -->
                <p class="text-zinc-300 text-sm md:text-[18px] leading-relaxed max-w-2xl mb-6 line-clamp-2 hidden md:block" style="font-family: 'Be Vietnam Pro', sans-serif;">
                    ${t('chapter_latest')}: Ch. ${firstChapterName} · ${categories.slice(0, 2).map(c => c.name || c).join(' / ') || 'Manga'}
                </p>
                <p class="text-zinc-300 text-sm leading-relaxed max-w-2xl mb-5 line-clamp-2 md:hidden" style="font-family: 'Be Vietnam Pro', sans-serif;">
                    Ch. ${firstChapterName} · ${categories.slice(0, 2).map(c => c.name || c).join(' / ') || 'Manga'}
                </p>
                <!-- Action Buttons -->
                <div class="flex items-center gap-3 relative z-30">
                    <a href="${readChapter1Href}" data-link onclick="event.stopPropagation()"
                       class="bg-rose-600 hover:bg-rose-700 text-white px-6 md:px-8 py-3 md:py-3.5 rounded-full font-semibold text-sm md:text-[14px] transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-rose-600/30">
                        <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">play_arrow</span>
                        ${t('read_chapter_1')}
                    </a>
                    <button data-hero-lib onclick="event.stopPropagation(); window._heroAddToLibrary && window._heroAddToLibrary('${manga.slug}')"
                       class="bg-white/10 hover:bg-white/20 text-white px-5 md:px-6 py-3 md:py-3.5 rounded-full font-semibold text-sm md:text-[14px] transition-all active:scale-95 backdrop-blur-md border border-white/10 flex items-center gap-2">
                        <span class="material-symbols-outlined text-[18px]">bookmark_add</span>
                        ${t('add_to_library')}
                    </button>
                </div>
            </div>
        </div>`;
    }).join('');
    
    // Dot indicators
    const dots = mangaList.filter(m => m.name).map((_, idx) => 
        `<button class="hero-dot w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === 0 ? 'bg-white w-8' : 'bg-white/40 hover:bg-white/60'}" data-dot="${idx}"></button>`
    ).join('');
    
    return `
    <div class="hero-carousel relative w-full h-[420px] md:h-[520px] rounded-none md:rounded-2xl overflow-hidden shadow-xl md:mx-auto md:max-w-7xl md:mt-4" id="hero-carousel">
        ${slides}
        <!-- Dot Indicators -->
        <div class="absolute bottom-4 md:bottom-6 right-6 md:right-10 flex items-center gap-2 z-20" id="hero-dots">
            ${dots}
        </div>
        <!-- Progress bar -->
        <div class="absolute bottom-0 left-0 w-full h-[3px] z-20">
            <div class="h-full bg-rose-500/80 transition-all" id="hero-progress" style="width: 0%; transition: width 4s linear;"></div>
        </div>
    </div>`;
}

function initHeroCarousel() {
    const carousel = document.getElementById('hero-carousel');
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.hero-slide');
    const dots = carousel.querySelectorAll('.hero-dot');
    const progressBar = document.getElementById('hero-progress');
    if (slides.length <= 1) return;
    
    let currentSlide = 0;
    let isPaused = false;
    const INTERVAL = 4000; // 4 seconds
    
    function goToSlide(idx) {
        // Remove active from current
        slides[currentSlide].classList.remove('active', 'opacity-100', 'z-10');
        slides[currentSlide].classList.add('opacity-0', 'z-0');
        // Reset scale on outgoing slide image
        const outImg = slides[currentSlide].querySelector('img');
        if (outImg) outImg.classList.remove('scale-105');
        
        // Update dots
        dots[currentSlide].classList.remove('bg-white', 'w-8');
        dots[currentSlide].classList.add('bg-white/40');
        dots[currentSlide].style.width = '';
        
        currentSlide = idx;
        
        // Activate new slide
        slides[currentSlide].classList.remove('opacity-0', 'z-0');
        slides[currentSlide].classList.add('active', 'opacity-100', 'z-10');
        // Ken Burns zoom on incoming slide image
        const inImg = slides[currentSlide].querySelector('img');
        if (inImg) {
            inImg.classList.remove('scale-105');
            // Force reflow to restart the animation
            void inImg.offsetWidth;
            inImg.classList.add('scale-105');
        }
        
        // Update dots
        dots[currentSlide].classList.add('bg-white', 'w-8');
        dots[currentSlide].classList.remove('bg-white/40');
        
        // Reset progress bar
        resetProgress();
    }
    
    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }
    
    function resetProgress() {
        if (progressBar) {
            progressBar.style.transition = 'none';
            progressBar.style.width = '0%';
            // Force reflow
            void progressBar.offsetWidth;
            progressBar.style.transition = `width ${INTERVAL}ms linear`;
            progressBar.style.width = '100%';
        }
    }
    
    // Click handlers for dots
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            if (idx !== currentSlide) {
                goToSlide(idx);
                restartInterval();
            }
        });
    });
    
    // Pause on hover, resume on leave
    carousel.addEventListener('mouseenter', () => { isPaused = true; });
    carousel.addEventListener('mouseleave', () => { 
        isPaused = false; 
        restartInterval();
    });
    
    // Auto-rotation interval
    function startInterval() {
        // Cleanup previous interval if exists
        if (heroIntervalId) clearInterval(heroIntervalId);
        heroIntervalId = setInterval(() => {
            if (!isPaused) nextSlide();
        }, INTERVAL);
    }
    
    function restartInterval() {
        startInterval();
        resetProgress();
    }
    
    // Start
    resetProgress();
    startInterval();
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
