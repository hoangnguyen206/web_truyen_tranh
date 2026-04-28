import { api, cdnImage } from '../api.js';
import { i18n } from '../i18n.js';

const SPINNER = `<div class="min-h-screen flex items-center justify-center"><span class="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span></div>`;

export async function render(slug) {
    const t = (k) => i18n.t(k);
    const container = document.getElementById('app-container');
    window.showAppNav();
    container.innerHTML = SPINNER;
    
    try {
        const data = await api.manga(slug);
        const cdn = data.cdnImageUrl || 'https://img.otruyenapi.com';
        const manga = data.item;
        const img = cdnImage(manga.thumb_url, cdn);
        const chapters = manga.chapters?.[0]?.server_data || [];
        const categories = manga.category || [];
        const statusMap = { ongoing: t('ongoing_status'), completed: t('completed_status'), coming_soon: t('filter_coming_soon') };
        const statusText = statusMap[manga.status] || manga.status;
        const author = (manga.author || [t('updating')]).join(', ');
        
        const viewsData = manga.views || { total_views: 0, chapters: {} };
        const totalViews = viewsData.total_views || 0;

        // Check if user is logged in & if manga is in library
        const userStr = localStorage.getItem('mangaflow_user');
        const isLoggedIn = !!userStr;
        let libraryEntry = null;
        if (isLoggedIn) {
            try {
                const checkResult = await api.checkLibrary(slug);
                libraryEntry = checkResult.in_library ? checkResult.entry : null;
            } catch (e) {
                // Silently fail
            }
        }

        // Determine the "continue reading" button
        let readBtnHtml = '';
        if (chapters.length > 0) {
            if (libraryEntry && libraryEntry.last_chapter_url) {
                readBtnHtml = `
                <a href="/read?url=${encodeURIComponent(chapters[0].chapter_api_data)}&slug=${manga.slug}" data-link class="bg-primary text-on-primary font-label-md text-label-md px-lg py-sm rounded-lg hover:bg-surface-tint active:scale-95 transition-all flex items-center justify-center gap-base shadow-sm">
                    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">play_arrow</span>
                    ${t('read_first_chapter')}
                </a>
                <a href="/read?url=${encodeURIComponent(libraryEntry.last_chapter_url)}&slug=${manga.slug}" data-link class="bg-surface-container-high text-on-surface font-label-md text-label-md px-lg py-sm rounded-lg hover:bg-surface-variant active:scale-95 transition-all flex items-center justify-center border border-outline-variant">
                    ${t('resume_chapter')} ${libraryEntry.last_chapter_read || '?'}
                </a>`;
            } else {
                readBtnHtml = `
                <a href="/read?url=${encodeURIComponent(chapters[0].chapter_api_data)}&slug=${manga.slug}" data-link class="bg-primary text-on-primary font-label-md text-label-md px-lg py-sm rounded-lg hover:bg-surface-tint active:scale-95 transition-all flex items-center justify-center gap-base shadow-sm">
                    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">play_arrow</span>
                    ${t('read_first_chapter')}
                </a>`;
            }
        }

        // Library button state
        const libBtnId = 'lib-save-btn';
        const libBtnIcon = libraryEntry ? 'bookmark_added' : 'bookmark_add';
        const libBtnText = libraryEntry ? t('saved') : t('save');

        // Set default sorting to newest first
        let sortOrder = 'newest';
        
        const renderChapters = () => {
            // Chapters from API are typically oldest first
            let displayChapters = [...chapters];
            if (sortOrder === 'newest') {
                displayChapters.reverse();
            }

            return displayChapters.map(ch => {
                const isLastRead = libraryEntry && libraryEntry.last_chapter_read === ch.chapter_name;
                const chapterViewCount = viewsData.chapters[ch.chapter_api_data] || 0;
                
                let visualClass = "bg-surface p-md rounded-xl border border-outline-variant hover:border-primary/50 transition-colors cursor-pointer flex justify-between items-center group shadow-sm";
                let titleClass = "font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors";
                let iconHtml = "";

                if (isLastRead) {
                    visualClass = "bg-primary-fixed-dim/20 border border-primary-fixed p-md rounded-xl hover:bg-primary-fixed-dim/30 transition-colors cursor-pointer flex justify-between items-center group shadow-sm";
                    iconHtml = `<button class="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md group-active:scale-90 transition-transform"><span class="material-symbols-outlined">menu_book</span></button>`;
                }

                return `
                <a href="/read?url=${encodeURIComponent(ch.chapter_api_data)}&slug=${manga.slug}" data-link class="${visualClass}">
                    <div class="flex flex-col">
                        <span class="font-label-sm text-label-sm ${isLastRead ? 'text-primary font-bold' : 'text-secondary'} mb-[4px]">${t('chapter')} ${ch.chapter_name}</span>
                        <span class="${titleClass}">${t('chapter')} ${ch.chapter_name}</span>
                        <span class="font-label-sm text-label-sm text-secondary mt-base flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">visibility</span> ${chapterViewCount.toLocaleString()}</span>
                    </div>
                    ${iconHtml}
                </a>`;
            }).join('');
        };

        container.innerHTML = `
        <main class="pb-xl pt-[80px]">
            <!-- Hero Section: Cover & Details -->
            <section class="max-w-container-max mx-auto px-md pt-lg md:pt-xl">
                <div class="flex flex-col md:flex-row gap-lg">
                    <!-- Manga Cover Image -->
                    <div class="w-full md:w-[340px] flex-shrink-0 mx-auto md:mx-0">
                        <div class="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-[0_16px_32px_rgba(0,0,0,0.12)] border border-outline-variant/30 group">
                            <img alt="${manga.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" src="${img}"/>
                            <!-- Subtle gradient overlay at bottom for depth -->
                            <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
                        </div>
                    </div>
                    
                    <!-- Info Pane -->
                    <div class="flex-1 flex flex-col justify-center pb-sm">
                        <!-- Status & Rating Badges -->
                        <div class="flex flex-wrap items-center gap-sm mb-md">
                            <span class="bg-primary-container text-on-primary-container font-label-sm text-label-sm px-sm py-xs rounded-full inline-block">
                                ${statusText}
                            </span>
                            <span class="bg-surface-container-highest text-on-surface font-label-sm text-label-sm px-sm py-xs rounded-full flex items-center gap-[4px] border border-outline-variant">
                                <span class="material-symbols-outlined text-[14px] text-tertiary" style="font-variation-settings: 'FILL' 1;">star</span> 4.9
                            </span>
                            <span class="text-secondary font-label-sm text-label-sm flex items-center gap-1">
                                <span class="material-symbols-outlined text-[16px]">visibility</span>
                                ${totalViews.toLocaleString()} ${t('views')}
                            </span>
                        </div>
                        
                        <!-- Title & Author -->
                        <h1 class="font-display-lg text-display-lg text-on-background mb-base">${manga.name}</h1>
                        <p class="font-label-md text-label-md text-secondary mb-lg">By ${author}</p>
                        
                        <!-- Genre Chips -->
                        <div class="flex flex-wrap gap-xs mb-lg">
                            ${categories.map(c => {
                                const name = c.name || c;
                                const slug = c.slug || encodeURIComponent(name);
                                return `<a href="/genres/${slug}" data-link class="bg-surface-container-low border border-outline-variant text-on-surface-variant font-label-sm text-label-sm px-sm py-xs rounded-md hover:bg-primary hover:text-on-primary transition-colors cursor-pointer">${name}</a>`;
                            }).join('')}
                        </div>
                        
                        <!-- Synopsis -->
                        <div class="mb-lg">
                            <h2 class="font-label-md text-label-md text-on-surface mb-sm tracking-widest uppercase opacity-70">${t('synopsis')}</h2>
                            <div class="font-body-md text-body-md text-on-surface-variant leading-relaxed line-clamp-4 hover:line-clamp-none transition-all cursor-pointer" title="${t('show_more')}">
                                ${manga.content || t('no_synopsis')}
                            </div>
                        </div>
                        
                        <!-- Primary Actions -->
                        <div class="flex flex-col sm:flex-row gap-sm mt-auto">
                            ${readBtnHtml}
                            <button id="${libBtnId}" class="bg-surface-container-high text-on-surface font-label-md text-label-md px-lg py-sm rounded-lg hover:bg-surface-variant active:scale-95 transition-all flex items-center justify-center border border-outline-variant gap-2 ${libraryEntry ? 'text-primary border-primary' : ''}">
                                <span class="material-symbols-outlined" id="lib-btn-icon">${libBtnIcon}</span>
                                <span id="lib-btn-text">${libBtnText}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Chapter List Section (Bento Grid Approach) -->
            <section class="max-w-container-max mx-auto px-md mt-xl">
                <!-- Section Header -->
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end border-b border-outline-variant pb-sm mb-md gap-sm">
                    <h2 class="font-headline-lg text-headline-lg text-on-background tracking-tight">${t('chapters_list')}</h2>
                    <div class="flex items-center gap-md">
                        <span class="font-label-md text-label-md text-secondary bg-surface-container-low px-sm py-xs rounded-md border border-outline-variant">
                            ${chapters.length} ${t('chapter')}
                        </span>
                        <button id="sort-chapters-btn" class="text-secondary hover:text-primary transition-colors flex items-center gap-[4px] font-label-sm text-label-sm">
                            <span class="material-symbols-outlined text-[18px]" id="sort-icon" style="transition: transform 0.3s;">sort</span>
                            <span id="sort-text">${t('newest')}</span>
                        </button>
                    </div>
                </div>

                <!-- Grid Layout -->
                <div id="chapters-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
                    ${renderChapters()}
                </div>
            </section>
        </main>`;

        // === BIND SORTING BUTTON ===
        const sortBtn = document.getElementById('sort-chapters-btn');
        if (sortBtn) {
            sortBtn.addEventListener('click', () => {
                sortOrder = sortOrder === 'newest' ? 'oldest' : 'newest';
                document.getElementById('sort-text').textContent = sortOrder === 'newest' ? t('newest') : t('oldest');
                // Toggle icon visually
                const icon = document.getElementById('sort-icon');
                if (sortOrder === 'newest') {
                    icon.style.transform = 'scaleY(1)';
                } else {
                    icon.style.transform = 'scaleY(-1)';
                }
                
                // Re-render chapters
                document.getElementById('chapters-grid').innerHTML = renderChapters();
                
                // Use setTimeout to ensure DOM is updated before binding router events again
                setTimeout(() => {
                    if (window.router && typeof window.router.updateLinks === 'function') {
                        window.router.updateLinks();
                    }
                }, 50);
            });
        }

        // === BIND LIBRARY SAVE BUTTON ===
        const saveBtn = document.getElementById(libBtnId);
        if (saveBtn) {
            let inLibrary = !!libraryEntry;
            saveBtn.addEventListener('click', async () => {
                if (!isLoggedIn) {
                    window.router.navigate('/login');
                    return;
                }
                const btnIcon = document.getElementById('lib-btn-icon');
                const btnText = document.getElementById('lib-btn-text');

                if (inLibrary) {
                    // Remove from library
                    try {
                        await api.removeFromLib(slug);
                        inLibrary = false;
                        btnIcon.textContent = 'bookmark_add';
                        btnText.textContent = 'Lưu';
                        saveBtn.classList.remove('text-primary', 'border-primary');
                        showDetailToast('Đã xóa khỏi thư viện');
                    } catch (e) {
                        showDetailToast('Lỗi: ' + e.message, true);
                    }
                } else {
                    // Add to library
                    try {
                        await api.addToLibrary({
                            manga_slug: slug,
                            manga_name: manga.name,
                            manga_thumb: manga.thumb_url || '',
                            tab: 'want_to_read',
                            last_chapter_read: null,
                            last_chapter_url: null,
                            total_chapters: chapters.length,
                            chapters_read: 0,
                            manga_status: manga.status || 'ongoing'
                        });
                        inLibrary = true;
                        btnIcon.textContent = 'bookmark_added';
                        btnText.textContent = 'Đã lưu';
                        saveBtn.classList.add('text-primary', 'border-primary');
                        showDetailToast('Đã thêm vào thư viện ✓');
                    } catch (e) {
                        showDetailToast('Lỗi: ' + e.message, true);
                    }
                }
            });
        }

    } catch (error) {
        container.innerHTML = `<div class="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
            <span class="material-symbols-outlined text-6xl text-on-error-container">error</span>
            <p class="font-bold text-lg text-on-background">${t('manga_not_found')}</p>
            <p class="text-sm text-secondary">${error.message}</p>
        </div>`;
    }
}

function showDetailToast(message, isError = false) {
    const existing = document.getElementById('detail-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'detail-toast';
    toast.className = `fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl text-sm font-semibold shadow-lg z-[100] transition-all duration-300 ${
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
