// public/assets/js/api.js
// Centralized API Client — detects base path automatically

const API_BASE = (() => {
    const path = window.location.pathname;
    
    if (path.includes('/public')) {
        return path.substring(0, path.indexOf('/public') + 7) + '/api';
    }
    
    const match = path.match(/^(\/[^\/]+)/);
    if (match) {
        const firstSegment = match[1];
        const knownRoutes = ['/login', '/register', '/library', '/manga', '/search', '/genres', '/chapter', '/api'];
        if (!knownRoutes.includes(firstSegment)) {
            return firstSegment + '/api';
        }
    }
    
    return '/api';
})();

async function request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    
    const config = {
        headers: { 
            'Content-Type': 'application/json', 
            'X-Requested-With': 'XMLHttpRequest' 
        },
        credentials: 'same-origin',
        ...options,
    };
    
    try {
        const response = await fetch(url, config);
        const data = await response.json();
        if (!data.success) throw new Error(data.message || 'API Error');
        return data.data;
    } catch (error) {
        console.error(`[API] Error ${endpoint}:`, error);
        throw error;
    }
}

export const api = {
    home:       ()              => request('/home'),
    manga:      (slug)          => request(`/manga/${slug}`),
    chapter:    (url, slug)     => request(`/chapter?url=${encodeURIComponent(url)}${slug ? `&slug=${slug}` : ''}`),
    search:     (keyword, page=1) => request(`/search?keyword=${encodeURIComponent(keyword)}&page=${page}`),
    trending:   (page=1)        => request(`/trending?page=${page}`),
    latest:     (page=1)        => request(`/latest?page=${page}`),
    completed:  (page=1)        => request(`/completed?page=${page}`),
    comingSoon: (page=1)        => request(`/coming-soon?page=${page}`),
    newManga:   (page=1)        => request(`/new-manga?page=${page}`),
    genres:     ()              => request('/genres'),
    genreList:  (slug, page=1)  => request(`/genres/${slug}?page=${page}`),
    
    // Auth
    login:      (email, pass)   => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password: pass }) }),
    register:   (data)          => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    logout:     ()              => request('/auth/logout', { method: 'POST' }),
    me:         ()              => request('/auth/me'),
    googleAuthUrl: ()           => request('/auth/google/url'),
    googleCallback: (code)      => request('/auth/google/callback', { method: 'POST', body: JSON.stringify({ code }) }),
    
    // Library
    library:       (tab)        => request(`/library?tab=${tab || 'reading'}`),
    addToLibrary:  (data)       => request('/library', { method: 'POST', body: JSON.stringify(data) }),
    removeFromLib: (slug)       => request(`/library/${slug}`, { method: 'DELETE' }),
    updateProgress:(data)       => request('/library/progress', { method: 'POST', body: JSON.stringify(data) }),
    changeTab:     (slug, tab)  => request('/library/tab', { method: 'POST', body: JSON.stringify({ manga_slug: slug, tab }) }),
    checkLibrary:  (slug)       => request(`/library/check/${slug}`),
};

/**
 * Helper: build full CDN image URL from thumb_url filename
 * @param {string} thumbFilename - e.g. "one-piece-thumb.jpg"
 * @param {string} cdnBase - e.g. "https://img.otruyenapi.com"
 */
export function cdnImage(thumbFilename, cdnBase = 'https://img.otruyenapi.com') {
    if (!thumbFilename) return '';
    if (thumbFilename.startsWith('http')) return thumbFilename;
    return `${cdnBase}/uploads/comics/${thumbFilename}`;
}
