/**
 * Main.js — Home page logic
 * Loads all app configs and renders the portfolio grid
 */
(function () {
    'use strict';

    // ---- Helpers ----
    function getBasePath() {
        const path = window.location.pathname;
        const lastSlash = path.lastIndexOf('/');
        return path.substring(0, lastSlash + 1);
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

    // ---- Load all apps ----
    const basePath = getBasePath();
    const grid = document.getElementById('apps-grid');

    async function loadApps() {
        if (!APPS || APPS.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <div class="empty-state-icon">📱</div>
                    <p class="empty-state-text">No apps yet. Check the README to add your first app!</p>
                </div>
            `;
            return;
        }

        const configs = await Promise.all(
            APPS.map(async (slug) => {
                try {
                    const res = await fetch(basePath + 'apps/' + slug + '/config.json');
                    if (!res.ok) throw new Error('Not found');
                    const config = await res.json();
                    config._slug = slug;
                    return config;
                } catch (e) {
                    console.warn('Failed to load app config for "' + slug + '":', e);
                    return null;
                }
            })
        );

        const validConfigs = configs.filter(Boolean);

        if (validConfigs.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <div class="empty-state-icon">⚠️</div>
                    <p class="empty-state-text">Could not load any app configs. Check the console for details.</p>
                </div>
            `;
            return;
        }

        validConfigs.forEach(function (app, index) {
            const card = createAppCard(app, index);
            grid.appendChild(card);
        });

        // Staggered entrance animation
        requestAnimationFrame(function () {
            const cards = grid.querySelectorAll('.app-card');
            cards.forEach(function (card, i) {
                setTimeout(function () {
                    card.classList.add('is-visible');
                }, 100 + i * 120);
            });
        });
    }

    function createAppCard(app, index) {
        const card = document.createElement('a');
        card.className = 'app-card';
        card.href = basePath + 'app.html?id=' + encodeURIComponent(app._slug);

        const iconPath = basePath + 'apps/' + app._slug + '/' + (app.icon || 'icon.png');
        const coverPath = app.coverImage
            ? basePath + 'apps/' + app._slug + '/' + app.coverImage
            : (app.screenshots && app.screenshots.length > 0
                ? basePath + 'apps/' + app._slug + '/' + app.screenshots[0]
                : '');

        const tagsHtml = (app.tags || [])
            .slice(0, 3)
            .map(function (tag) {
                return '<span class="app-card-tag">' + escapeHtml(tag) + '</span>';
            })
            .join('');

        card.innerHTML =
            '<div class="app-card-image">' +
                (coverPath
                    ? '<img src="' + escapeHtml(coverPath) + '" alt="' + escapeHtml(app.name) + ' preview" loading="lazy">'
                    : '<div style="width:100%;height:100%;background:var(--gradient-subtle);"></div>') +
                '<div class="app-card-image-overlay"></div>' +
            '</div>' +
            '<div class="app-card-body">' +
                '<img class="app-card-icon" src="' + escapeHtml(iconPath) + '" alt="' + escapeHtml(app.name) + ' icon" loading="lazy">' +
                '<h3 class="app-card-title">' + escapeHtml(app.name) + '</h3>' +
                '<p class="app-card-description">' + escapeHtml(app.subtitle || '') + '</p>' +
                (tagsHtml ? '<div class="app-card-tags">' + tagsHtml + '</div>' : '') +
            '</div>' +
            '<div class="app-card-arrow">' +
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' +
            '</div>';

        return card;
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
    loadApps();
    initScrollAnimations();
})();
