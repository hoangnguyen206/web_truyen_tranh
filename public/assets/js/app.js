// public/assets/js/app.js — SPA Router & App Bootstrap
import { i18n } from './i18n.js';

class Router {
    constructor(routes) {
        this.routes = routes;
        this._onPopState = () => this.resolve();
        window.addEventListener('popstate', this._onPopState);
        
        // Intercept all [data-link] clicks for SPA navigation
        document.addEventListener('click', e => {
            const link = e.target.closest('[data-link]');
            if (link) {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href && href !== window.location.pathname + window.location.search) {
                    this.navigate(href);
                }
            }
        });
    }
    
    navigate(path) {
        history.pushState(null, '', path);
        this.resolve();
    }
    
    async resolve() {
        const path = location.pathname;
        // Also pass query string to handlers
        const query = location.search;
        
        for (const route of this.routes) {
            const match = path.match(route.pattern);
            if (match) {
                // Scroll to top on navigation
                window.scrollTo(0, 0);
                try {
                    await route.handler(match.groups || {}, query);
                } catch (e) {
                    console.error("Page render error:", e);
                    const t = (k) => i18n.t(k);
                    document.getElementById('app-container').innerHTML = `
                        <div class="min-h-screen flex flex-col items-center justify-center gap-4 text-zinc-800 dark:text-zinc-200 px-4">
                            <span class="material-symbols-outlined text-6xl text-error">error</span>
                            <p class="font-headline-md text-headline-md">${t('error_occurred')}</p>
                            <p class="font-body-md text-zinc-500 text-center">${e.message}</p>
                            <button onclick="window.router.navigate('/')" class="mt-4 px-6 py-3 bg-primary text-on-primary rounded-full font-label-md">${t('go_home')}</button>
                        </div>`;
                }
                return;
            }
        }
        
        // 404
        const t = (k) => i18n.t(k);
        document.getElementById('app-container').innerHTML = `
            <div class="min-h-screen flex flex-col items-center justify-center gap-4 text-zinc-800 dark:text-zinc-200 px-4">
                <span class="material-symbols-outlined text-8xl text-zinc-300 dark:text-zinc-600">explore_off</span>
                <p class="font-display-lg text-[64px] text-primary font-black">404</p>
                <p class="font-body-lg text-zinc-500">${t('page_not_found')}</p>
                <button onclick="window.router.navigate('/')" class="mt-4 px-6 py-3 bg-primary text-on-primary rounded-full font-label-md">${t('go_home')}</button>
            </div>`;
    }
}

// --- Layout Components ---
import { renderNavbar, renderBottomNav, initNavbarInteractions } from './components/navigation.js';

function initLayout() {
    document.getElementById('navbar-container').innerHTML = renderNavbar();
    document.getElementById('bottom-nav-container').innerHTML = renderBottomNav();
    // Initialize interactive features (dark mode toggle, genre dropdown)
    initNavbarInteractions();
}

// Show/hide navbars (used by reader page)
window.showAppNav = () => {
    document.getElementById('navbar-container').style.display = '';
    document.getElementById('bottom-nav-container').style.display = '';
};
window.hideAppNav = () => {
    document.getElementById('navbar-container').style.display = 'none';
    document.getElementById('bottom-nav-container').style.display = 'none';
};

// Expose a method to refresh layout (used after language change)
window.refreshLayout = () => {
    initLayout();
};

// --- Route Definitions ---
const routes = [
    { pattern: /^\/$/, handler: () => import('./pages/home.js').then(m => m.render()) },
    { pattern: /^\/manga\/(?<slug>[^/?]+)$/, handler: (p) => import('./pages/details.js').then(m => m.render(p.slug)) },
    { pattern: /^\/read$/, handler: (_, q) => import('./pages/reader.js').then(m => m.render(q)) },
    { pattern: /^\/latest$/, handler: (_, q) => import('./pages/latest.js').then(m => m.render(q)) },
    { pattern: /^\/trending$/, handler: (_, q) => import('./pages/trending.js').then(m => m.render(q)) },
    { pattern: /^\/genres\/(?<slug>[^/?]+)$/, handler: (p, q) => import('./pages/genres.js').then(m => m.renderGenre(p.slug, q)) },
    { pattern: /^\/library$/, handler: () => import('./pages/library.js').then(m => m.render()) },
    { pattern: /^\/search$/, handler: (_, q) => import('./pages/search.js').then(m => m.render(q)) },
    { pattern: /^\/login$/, handler: () => import('./pages/auth.js').then(m => m.renderLogin()) },
    { pattern: /^\/register$/, handler: () => import('./pages/auth.js').then(m => m.renderRegister()) },
    { pattern: /^\/settings$/, handler: () => import('./pages/settings.js').then(m => m.render()) },
    { pattern: /^\/auth\/google\/callback$/, handler: (_, q) => import('./pages/auth.js').then(m => m.handleGoogleCallback(q)) },
];

// --- Init ---
initLayout();
window.router = new Router(routes);
window.router.resolve();
