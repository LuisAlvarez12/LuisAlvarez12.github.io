/**
 * App Page — Detail page logic
 * Loads a single app config and renders the landing page
 */
(function () {
    'use strict';

    // ---- Helpers ----
    function getBasePath() {
        const path = window.location.pathname;
        const lastSlash = path.lastIndexOf('/');
        return path.substring(0, lastSlash + 1);
    }

    function getParam(name) {
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ---- Nav scroll effect ----
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', function () {
        nav.classList.toggle('scrolled', window.scrollY > 20);
    });

    // ---- Footer year ----
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ---- Load app ----
    const basePath = getBasePath();
    const slug = getParam('id');

    if (!slug) {
        window.location.href = basePath + 'index.html';
        return;
    }

    async function loadApp() {
        try {
            const res = await fetch(basePath + 'apps/' + slug + '/config.json');
            if (!res.ok) throw new Error('Not found');
            const app = await res.json();
            app._slug = slug;
            renderApp(app);
        } catch (e) {
            console.error('Failed to load app:', e);
            document.body.innerHTML = `
                <div class="not-found">
                    <div>
                        <h1>404</h1>
                        <p>App not found</p>
                        <a href="${basePath}index.html">&larr; Back to portfolio</a>
                    </div>
                </div>
            `;
        }
    }

    function renderApp(app) {
        // Page title
        document.title = app.name + ' — Rezonating Apps';

        // Update meta
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.content = app.subtitle || '';

        // Nav links
        const navLinks = document.getElementById('nav-links');
        if (navLinks) {
            let linksHtml = '';
            if (app.appStoreUrl) {
                linksHtml += '<a class="nav-link" href="' + escapeHtml(app.appStoreUrl) + '" target="_blank" rel="noopener">App Store</a>';
            }
            linksHtml += '<a class="nav-link" href="' + basePath + 'terms.html?id=' + encodeURIComponent(slug) + '">Terms</a>';
            linksHtml += '<a class="nav-link" href="' + basePath + 'privacy.html?id=' + encodeURIComponent(slug) + '">Privacy</a>';
            navLinks.innerHTML = linksHtml;
        }

        // Hero
        const appBasePath = basePath + 'apps/' + slug + '/';
        const iconPath = appBasePath + (app.icon || 'icon.png');

        document.getElementById('app-icon').src = iconPath;
        document.getElementById('app-icon').alt = app.name + ' icon';
        document.getElementById('app-title').textContent = app.name;
        document.getElementById('app-subtitle').textContent = app.subtitle || '';

        // App Store link
        const storeLink = document.getElementById('app-store-link');
        if (app.appStoreUrl) {
            storeLink.href = app.appStoreUrl;
        } else {
            storeLink.style.display = 'none';
        }

        // Apply accent color if provided
        if (app.accentColor) {
            document.documentElement.style.setProperty('--color-accent', app.accentColor);
            document.documentElement.style.setProperty('--color-accent-glow', app.accentColor + '26');
        }

        // Screenshots
        renderScreenshots(app);

        // Features
        renderFeatures(app);

        // Description
        renderDescription(app);

        // Footer links
        renderFooterLinks(app);

        // Init scroll animations
        initScrollAnimations();
    }

    function renderScreenshots(app) {
        const section = document.getElementById('screenshots-section');
        const carousel = document.getElementById('screenshots-carousel');

        if (!app.screenshots || app.screenshots.length === 0) {
            section.style.display = 'none';
            return;
        }

        const appBasePath = basePath + 'apps/' + slug + '/';

        app.screenshots.forEach(function (src, i) {
            const item = document.createElement('div');
            item.className = 'screenshot-item';
            item.innerHTML = '<img src="' + escapeHtml(appBasePath + src) + '" alt="' + escapeHtml(app.name) + ' screenshot ' + (i + 1) + '" loading="lazy">';
            carousel.appendChild(item);

            // Staggered animation
            setTimeout(function () {
                item.classList.add('is-visible');
            }, 200 + i * 100);
        });
    }

    function renderFeatures(app) {
        const section = document.getElementById('features-section');
        const grid = document.getElementById('features-grid');

        if (!app.features || app.features.length === 0) {
            section.style.display = 'none';
            return;
        }

        app.features.forEach(function (feature, i) {
            const card = document.createElement('div');
            card.className = 'feature-card';
            card.innerHTML =
                '<div class="feature-icon">' + (feature.icon || '✨') + '</div>' +
                '<h3 class="feature-title">' + escapeHtml(feature.title) + '</h3>' +
                '<p class="feature-description">' + escapeHtml(feature.description) + '</p>';
            grid.appendChild(card);

            setTimeout(function () {
                card.classList.add('is-visible');
            }, 300 + i * 100);
        });
    }

    function renderDescription(app) {
        const section = document.getElementById('description-section');
        const content = document.getElementById('description-content');

        if (!app.description) {
            section.style.display = 'none';
            return;
        }

        // Support paragraphs split by double newline
        const paragraphs = app.description.split('\n\n');
        content.innerHTML = paragraphs
            .map(function (p) {
                return '<p>' + escapeHtml(p.trim()) + '</p>';
            })
            .join('');
    }

    function renderFooterLinks(app) {
        const footerLinks = document.getElementById('footer-links');
        if (!footerLinks) return;

        let html = '';
        html += '<a class="footer-link" href="' + basePath + 'terms.html?id=' + encodeURIComponent(slug) + '">Terms & Conditions</a>';
        html += '<a class="footer-link" href="' + basePath + 'privacy.html?id=' + encodeURIComponent(slug) + '">Privacy Policy</a>';
        if (app.supportUrl) {
            html += '<a class="footer-link" href="' + escapeHtml(app.supportUrl) + '" target="_blank" rel="noopener">Support</a>';
        }
        if (app.websiteUrl) {
            html += '<a class="footer-link" href="' + escapeHtml(app.websiteUrl) + '" target="_blank" rel="noopener">Website</a>';
        }
        footerLinks.innerHTML = html;
    }

    // ---- Scroll animations ----
    function initScrollAnimations() {
        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );

        document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
            observer.observe(el);
        });
    }

    // ---- Init ----
    loadApp();
})();
