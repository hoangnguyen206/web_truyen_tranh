import { api } from '../api.js';
import { i18n } from '../i18n.js';

const SPINNER = `<div class="min-h-screen flex items-center justify-center"><span class="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span></div>`;

/**
 * Save reading progress to backend (auto-add to library if not present)
 */
async function saveReadingProgress(slug, chapterName, chapterUrl) {
    // Only save if user is logged in
    const userStr = localStorage.getItem('mangaflow_user');
    if (!userStr || !slug) return;

    try {
        // Extract chapter number from chapter name for chapters_read count
        const chapterNum = parseInt(chapterName) || 0;

        // First check if manga is in library
        const checkResult = await api.checkLibrary(slug);
        
        if (checkResult.in_library) {
            // Already in library — just update progress
            await api.updateProgress({
                manga_slug: slug,
                last_chapter_read: chapterName,
                last_chapter_url: chapterUrl,
                chapters_read: chapterNum
            });
        } else {
            // Not in library yet — auto-add to "reading" tab
            // We need manga info; fetch it from the API
            try {
                const mangaData = await api.manga(slug);
                const manga = mangaData.item;
                const chapters = manga.chapters?.[0]?.server_data || [];
                const totalChapters = chapters.length;
                const thumbUrl = manga.thumb_url || '';

                await api.addToLibrary({
                    manga_slug: slug,
                    manga_name: manga.name || slug,
                    manga_thumb: thumbUrl,
                    tab: 'reading',
                    last_chapter_read: chapterName,
                    last_chapter_url: chapterUrl,
                    total_chapters: totalChapters,
                    chapters_read: chapterNum,
                    manga_status: manga.status || 'ongoing'
                });
            } catch (mangaErr) {
                // If fetching manga info fails, still try to add with minimal data
                await api.addToLibrary({
                    manga_slug: slug,
                    manga_name: slug,
                    manga_thumb: '',
                    tab: 'reading',
                    last_chapter_read: chapterName,
                    last_chapter_url: chapterUrl,
                    total_chapters: 0,
                    chapters_read: chapterNum,
                    manga_status: 'ongoing'
                });
            }
        }
        console.log('[Reader] Progress saved: Ch.', chapterName, 'of', slug);
    } catch (err) {
        // Silently fail — don't interrupt reading experience
        console.warn('[Reader] Could not save progress:', err.message);
    }
}

export async function render(queryString) {
    const t = (k) => i18n.t(k);
    const container = document.getElementById('app-container');
    const params = new URLSearchParams(queryString || window.location.search);
    const chapterUrl = params.get('url');
    const slug = params.get('slug') || '';
    
    if (!chapterUrl) {
        container.innerHTML = `<div class="min-h-screen flex items-center justify-center text-zinc-500">${t('chapter_not_found')}</div>`;
        return;
    }
    
    window.hideAppNav();
    container.innerHTML = SPINNER;
    
    try {
        const data = await api.chapter(chapterUrl, slug);
        const item = data.item;
        const cdnDomain = data.domain_cdn || '';
        const images = item.chapter_image || [];
        const chapterPath = item.chapter_path || '';
        const chapterName = item.chapter_name || '';

        // === AUTO-SAVE reading progress ===
        saveReadingProgress(slug, chapterName, chapterUrl);

        container.innerHTML = `
        <!-- Reader Top Bar -->
        <header class="fixed top-0 w-full z-50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800 transition-transform duration-300" id="reader-header" style="font-family: 'Be Vietnam Pro', sans-serif;">
            <div class="flex items-center justify-between h-12 px-3 max-w-3xl mx-auto">
                <div class="flex items-center gap-2 min-w-0">
                    <button onclick="window.showAppNav(); history.back()" class="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors flex-shrink-0">
                        <span class="material-symbols-outlined text-[20px]">arrow_back</span>
                    </button>
                    <div class="min-w-0">
                        <p class="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate">${item.comic_name || ''}</p>
                        <p class="text-[11px] text-zinc-400">${t('chapter')} ${chapterName}</p>
                    </div>
                </div>
                <!-- Library status indicator -->
                <div class="flex items-center gap-2">
                    <span id="save-indicator" class="text-[11px] text-zinc-400 flex items-center gap-1">
                        <span class="material-symbols-outlined text-[14px] text-emerald-500">check_circle</span>
                        ${t('saved')}
                    </span>
                </div>
            </div>
        </header>

        <!-- Images -->
        <main class="bg-zinc-100 dark:bg-zinc-950 min-h-screen pt-12 pb-20 select-none" id="reader-main" onclick="toggleReaderUI()">
            <div class="max-w-3xl mx-auto">
                ${images.map((img, i) => `
                    <div class="relative w-full min-h-[200px] bg-zinc-200 dark:bg-zinc-900 flex items-center justify-center">
                        <span class="absolute material-symbols-outlined animate-spin text-zinc-400 z-0">progress_activity</span>
                        <img src="${cdnDomain}/${chapterPath}/${img.image_file}" 
                             alt="Page ${img.image_page || i+1}" loading="lazy"
                             class="w-full h-auto block relative z-10 opacity-0 transition-opacity duration-300"
                             onload="this.classList.remove('opacity-0')" />
                    </div>
                `).join('')}
            </div>
            
            <!-- End Actions -->
            <div class="max-w-3xl mx-auto p-6 flex flex-col items-center gap-4 mt-4 border-t border-zinc-200 dark:border-zinc-800">
                <p class="text-sm font-bold text-zinc-600 dark:text-zinc-400">${t('end_of_chapter')} ${chapterName}</p>
                <div class="flex gap-3">
                    <button onclick="window.showAppNav(); history.back()" class="px-5 py-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-semibold active:scale-95 transition-all flex items-center gap-1">
                        <span class="material-symbols-outlined text-[16px]">arrow_back</span> ${t('prev_chapter')}
                    </button>
                    <button onclick="window.showAppNav(); window.router.navigate('/manga/${slug}')" class="px-5 py-2.5 rounded-full bg-rose-600 text-white text-sm font-semibold active:scale-95 transition-all flex items-center gap-1">
                        <span class="material-symbols-outlined text-[16px]">menu_book</span> ${t('manga_details_page')}
                    </button>
                </div>
            </div>
        </main>`;

        // Toggle header on tap
        window.toggleReaderUI = () => {
            const hdr = document.getElementById('reader-header');
            hdr.style.transform = hdr.style.transform === 'translateY(-100%)' ? '' : 'translateY(-100%)';
        };

    } catch (error) {
        window.showAppNav();
        container.innerHTML = `<div class="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
            <span class="material-symbols-outlined text-6xl text-red-400">error</span>
            <p class="font-bold text-zinc-800 dark:text-white">${t('error_load_chapter')}</p>
            <p class="text-sm text-zinc-500">${error.message}</p>
        </div>`;
    }
}
