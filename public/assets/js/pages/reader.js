// public/assets/js/pages/reader.js
import { api } from '../api.js';
import { i18n } from '../i18n.js';

const SPINNER = `<div class="min-h-screen bg-surface dark:bg-zinc-950 flex items-center justify-center"><span class="material-symbols-outlined animate-spin text-4xl text-rose-500">progress_activity</span></div>`;

/**
 * Save reading progress to backend (auto-add to library if not present)
 */
async function saveReadingProgress(slug, chapterName, chapterUrl, mangaData) {
    const userStr = localStorage.getItem('mangaflow_user');
    if (!userStr || !slug) return;

    try {
        const chapterNum = parseInt(chapterName) || 0;
        const checkResult = await api.checkLibrary(slug);
        
        if (checkResult.in_library) {
            await api.updateProgress({
                manga_slug: slug,
                last_chapter_read: chapterName,
                last_chapter_url: chapterUrl,
                chapters_read: chapterNum
            });
        } else if (mangaData && mangaData.item) {
            const manga = mangaData.item;
            const chapters = manga.chapters?.[0]?.server_data || [];
            await api.addToLibrary({
                manga_slug: slug,
                manga_name: manga.name || slug,
                manga_thumb: manga.thumb_url || '',
                tab: 'reading',
                last_chapter_read: chapterName,
                last_chapter_url: chapterUrl,
                total_chapters: chapters.length,
                chapters_read: chapterNum,
                manga_status: manga.status || 'ongoing'
            });
        }
    } catch (err) {
        console.warn('[Reader] Could not save progress:', err.message);
    }
}

function renderNavButtons(prevChapter, nextChapter, allChapters, currentUrl, slug) {
    const prevDisabled = !prevChapter ? 'opacity-50 pointer-events-none' : 'hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white';
    const nextDisabled = !nextChapter ? 'opacity-50 pointer-events-none' : 'hover:bg-rose-500 hover:text-white';
    
    // Find index to slice the list if it's too long, but usually standard selects can handle 1000s of items.
    const options = allChapters.map(ch => {
        const isSelected = ch.chapter_api_data === currentUrl ? 'selected' : '';
        return `<option class="dark:bg-zinc-900 dark:text-white" value="${ch.chapter_api_data}" ${isSelected}>Chương ${ch.chapter_name}</option>`;
    }).join('');

    return `
        <a ${prevChapter ? `href="/read?url=${encodeURIComponent(prevChapter.chapter_api_data)}&slug=${slug}" data-link` : ''} 
           class="flex items-center justify-center p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-white transition-all ${prevDisabled} w-9 h-9 md:w-10 md:h-10 shrink-0">
            <span class="material-symbols-outlined text-[18px]">arrow_back</span>
        </a>
        
        <div class="flex-1 max-w-[200px] md:max-w-[300px] mx-2">
            <select onchange="if(this.value) window.router.navigate('/read?url=' + encodeURIComponent(this.value) + '&slug=${slug}')"
                    class="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-white text-xs md:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-full p-1.5 md:p-2 outline-none font-semibold text-center cursor-pointer shadow-inner py-1.5">
                ${options}
            </select>
        </div>
        
        <a ${nextChapter ? `href="/read?url=${encodeURIComponent(nextChapter.chapter_api_data)}&slug=${slug}" data-link` : ''} 
           class="flex items-center justify-center p-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-all ${nextDisabled} w-9 h-9 md:w-10 md:h-10 shrink-0">
            <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
        </a>
    `;
}

export async function render(queryString) {
    const t = (k) => i18n.t(k);
    const container = document.getElementById('app-container');
    const params = new URLSearchParams(queryString || window.location.search);
    const chapterUrl = params.get('url');
    const slug = params.get('slug') || '';
    
    if (!chapterUrl) {
        container.innerHTML = `<div class="min-h-screen bg-surface dark:bg-zinc-950 flex items-center justify-center text-zinc-500">${t('chapter_not_found')}</div>`;
        return;
    }
    
    // Yêu cầu: Giữ nguyên thanh điều hướng (navbar)
    window.showAppNav();
    container.innerHTML = SPINNER;
    
    try {
        const [mangaData, data] = await Promise.all([
            api.manga(slug).catch(() => null),
            api.chapter(chapterUrl, slug)
        ]);
        
        const item = data.item;
        const cdnDomain = data.domain_cdn || '';
        const images = item.chapter_image || [];
        const chapterPath = item.chapter_path || '';
        const chapterName = item.chapter_name || '';
        const comicName = item.comic_name || (mangaData ? mangaData.item.name : 'Unknown Manga');
        
        // Prepare navigation chapters
        const allChapters = mangaData?.item?.chapters?.[0]?.server_data || [];
        const currentIndex = allChapters.findIndex(c => c.chapter_api_data === chapterUrl);
        
        let prevChapter = null;
        let nextChapter = null;
        let isDescending = true;
        
        if (allChapters.length > 1) {
            const first = parseFloat(allChapters[0].chapter_name) || 0;
            const last = parseFloat(allChapters[allChapters.length - 1].chapter_name) || 0;
            isDescending = first > last;
        }

        if (currentIndex !== -1) {
            if (isDescending) {
                nextChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
                prevChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;
            } else {
                prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
                nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;
            }
        }

        // Auto-save progress
        saveReadingProgress(slug, chapterName, chapterUrl, mangaData);

        container.innerHTML = `
        <main class="min-h-screen bg-surface dark:bg-zinc-950 text-zinc-800 dark:text-zinc-300 pt-20 pb-20 font-body-md" style="font-family: 'Be Vietnam Pro', sans-serif;">
            <div class="max-w-[800px] mx-auto px-4 lg:px-0">
                
                <!-- Breadcrumb -->
                <nav class="flex items-center gap-1.5 md:gap-2 text-[12px] md:text-[13px] text-zinc-500 dark:text-zinc-300 mb-6 flex-wrap font-medium">
                    <a href="/" data-link class="hover:text-rose-500 transition-colors cursor-pointer flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">home</span> Trang Chủ</a>
                    <span class="material-symbols-outlined text-[14px] text-zinc-400 dark:text-zinc-500">chevron_right</span>
                    <a href="/manga/${slug}" data-link class="hover:text-rose-500 transition-colors cursor-pointer line-clamp-1 max-w-[150px] md:max-w-xs">${comicName}</a>
                    <span class="material-symbols-outlined text-[14px] text-zinc-400 dark:text-zinc-500">chevron_right</span>
                    <span class="text-rose-500 font-semibold">Chương ${chapterName}</span>
                </nav>

                <!-- Chapter Title -->
                <h1 class="text-xl md:text-3xl font-black text-zinc-900 dark:text-white mb-6 leading-tight" style="font-family: 'Epilogue', sans-serif;">${comicName} - Chương ${chapterName}</h1>

                <!-- Top Chapter Navigation (Sticky) -->
                <div id="top-nav" class="sticky top-[60px] md:top-[64px] z-40 mx-auto w-max bg-white/95 dark:bg-zinc-800/95 backdrop-blur-xl rounded-full p-1.5 md:p-2 flex items-center shadow-xl shadow-zinc-200 dark:shadow-black/60 border border-zinc-200 dark:border-zinc-700 transition-all duration-300 mb-6 transform origin-top">
                    ${renderNavButtons(prevChapter, nextChapter, allChapters, chapterUrl, slug)}
                </div>

                <!-- Reader Images -->
                <div class="flex flex-col items-center w-full bg-zinc-100 dark:bg-zinc-900 rounded-lg overflow-hidden shadow-2xl">
                    ${images.map((img, i) => `
                        <div class="relative w-full min-h-[300px] flex items-center justify-center">
                            <span class="absolute material-symbols-outlined animate-spin text-zinc-400 dark:text-zinc-600 z-0 text-3xl">progress_activity</span>
                            <img src="${cdnDomain}/${chapterPath}/${img.image_file}" 
                                 alt="Page ${img.image_page || i+1}" loading="lazy"
                                 class="w-full h-auto block relative z-10 opacity-0 transition-opacity duration-500"
                                 onload="this.classList.remove('opacity-0'); this.previousElementSibling.remove();"
                                 onerror="this.classList.remove('opacity-0'); this.previousElementSibling.textContent='broken_image';" />
                        </div>
                    `).join('')}
                </div>

                <!-- Bottom Chapter Navigation -->
                <div id="bottom-nav" class="mt-10 mx-auto w-max bg-white/90 dark:bg-zinc-800/95 rounded-full p-2 flex items-center border border-zinc-200 dark:border-zinc-700 mb-6 shadow-lg shadow-zinc-200 dark:shadow-black/40">
                    ${renderNavButtons(prevChapter, nextChapter, allChapters, chapterUrl, slug)}
                </div>
                
                <div class="text-center mt-8 mb-12">
                    <a href="/manga/${slug}" data-link class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-white font-semibold transition-colors">
                        <span class="material-symbols-outlined text-[20px]">format_list_bulleted</span>
                        Xem danh sách chương
                    </a>
                </div>
            </div>
        </main>

        <!-- Back to top button -->
        <button id="back-to-top" class="fixed bottom-20 left-4 md:left-8 z-50 bg-rose-600 hover:bg-rose-500 text-white w-11 h-11 md:w-12 md:h-12 rounded-full shadow-lg shadow-rose-900/30 flex items-center justify-center transition-all duration-300 opacity-0 translate-y-10 pointer-events-none focus:outline-none" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">
            <span class="material-symbols-outlined text-[22px] md:text-[24px]">arrow_upward</span>
        </button>
        `;

        // Setup intersection observer for hiding top nav when bottom nav is visible
        setTimeout(() => {
            const topNav = document.getElementById('top-nav');
            const bottomNav = document.getElementById('bottom-nav');
            const appNav = document.querySelector('header');
            
            if (appNav) appNav.style.transition = 'transform 0.3s ease-in-out';
            if (topNav) topNav.style.transition = 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out';
            
            if (bottomNav && topNav) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            topNav.dataset.hiddenBottom = 'true';
                            topNav.style.opacity = '0';
                            topNav.style.transform = 'translateY(-10px) scale(0.98)';
                            topNav.style.pointerEvents = 'none';
                        } else {
                            topNav.dataset.hiddenBottom = 'false';
                            topNav.style.opacity = '1';
                            topNav.style.transform = 'translateY(0) scale(1)';
                            topNav.style.pointerEvents = 'auto';
                        }
                    });
                }, { threshold: 0.1 });
                observer.observe(bottomNav);
            }
            
            // Scroll logic for navbar & back to top button
            let lastScrollY = window.scrollY;
            if (window._readerScrollHandler) {
                window.removeEventListener('scroll', window._readerScrollHandler);
            }
            window._readerScrollHandler = () => {
                const currentScrollY = window.scrollY;
                const btn = document.getElementById('back-to-top');
                
                // Hide/show App Navbar and adjust Chapter Nav
                if (currentScrollY > 150 && currentScrollY > lastScrollY) {
                    // Scrolling down: hide app nav, move chapter nav up to fill gap
                    if (appNav) appNav.style.transform = 'translateY(-100%)';
                    if (topNav && topNav.dataset.hiddenBottom !== 'true') {
                        // Move it up 52px so it sits near the top of the screen
                        topNav.style.transform = 'translateY(-52px)';
                    }
                } else if (currentScrollY < lastScrollY) {
                    // Scrolling up: show app nav, restore chapter nav position
                    if (appNav) appNav.style.transform = 'translateY(0)';
                    if (topNav && topNav.dataset.hiddenBottom !== 'true') {
                        topNav.style.transform = 'translateY(0) scale(1)';
                    }
                }
                lastScrollY = currentScrollY;

                if (!btn) return;
                if (currentScrollY > 400) {
                    btn.classList.remove('opacity-0', 'translate-y-10', 'pointer-events-none');
                    btn.classList.add('opacity-100', 'translate-y-0');
                } else {
                    btn.classList.add('opacity-0', 'translate-y-10', 'pointer-events-none');
                    btn.classList.remove('opacity-100', 'translate-y-0');
                }
            };
            window.addEventListener('scroll', window._readerScrollHandler, { passive: true });
        }, 100);

    } catch (error) {
        window.showAppNav();
        container.innerHTML = `<div class="min-h-screen bg-surface dark:bg-zinc-950 flex flex-col items-center justify-center gap-4 px-4">
            <span class="material-symbols-outlined text-6xl text-red-500">error</span>
            <p class="font-bold text-zinc-900 dark:text-white">${t('error_load_chapter')}</p>
            <p class="text-sm text-zinc-500">${error.message}</p>
        </div>`;
    }
}
