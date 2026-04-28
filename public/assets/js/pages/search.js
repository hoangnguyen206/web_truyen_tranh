import { api, cdnImage } from '../api.js';
const SPINNER = `<div class="min-h-screen flex items-center justify-center"><span class="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span></div>`;

export async function render(queryString) {
    const container = document.getElementById('app-container');
    window.showAppNav();
    const params = new URLSearchParams(queryString || window.location.search);
    const keyword = params.get('keyword') || '';
    if (!keyword.trim()) {
        container.innerHTML = `<div class="min-h-screen flex items-center justify-center text-zinc-500">Vui lòng nhập từ khóa tìm kiếm.</div>`;
        return;
    }
    container.innerHTML = SPINNER;
    try {
        const data = await api.search(keyword, 1);
        const cdn = data.cdnImageUrl || 'https://img.otruyenapi.com';
        const items = data.items || [];
        container.innerHTML = `
        <main class="pt-20 pb-24 md:pb-8 px-4 md:px-6 max-w-7xl mx-auto" style="font-family: 'Be Vietnam Pro', sans-serif;">
            <header class="mb-8">
                <h1 class="text-2xl font-black text-zinc-900 dark:text-white" style="font-family: 'Epilogue', sans-serif;">Kết quả: "${keyword}"</h1>
                <p class="text-sm text-zinc-500 mt-1">${items.length} truyện được tìm thấy.</p>
            </header>
            ${items.length > 0 ? `
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                ${items.map(m => searchCard(m, cdn)).join('')}
            </div>` : `
            <div class="py-20 text-center">
                <span class="material-symbols-outlined text-6xl text-zinc-300 dark:text-zinc-700">search_off</span>
                <p class="text-zinc-500 mt-4">Không tìm thấy kết quả nào.</p>
            </div>`}
        </main>`;
    } catch (e) {
        container.innerHTML = `<div class="min-h-screen flex items-center justify-center text-red-500">${e.message}</div>`;
    }
}

function searchCard(manga, cdn) {
    const img = cdnImage(manga.thumb_url, cdn);
    return `
    <article class="group cursor-pointer" onclick="window.router.navigate('/manga/${manga.slug}')">
        <div class="relative aspect-[2/3] rounded-xl overflow-hidden mb-2 bg-zinc-200 dark:bg-zinc-800 shadow-sm group-hover:shadow-md transition-shadow">
            <img src="${img}" alt="${manga.name}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.style.display='none'" />
        </div>
        <h3 class="text-[13px] font-semibold text-zinc-800 dark:text-zinc-200 leading-tight line-clamp-2 group-hover:text-rose-500 transition-colors">${manga.name}</h3>
    </article>`;
}
