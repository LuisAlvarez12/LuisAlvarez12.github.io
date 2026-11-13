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

        const docsHref = basePath + 'docs.html?id=' + encodeURIComponent(slug);

        // Nav links
        const navLinks = document.getElementById('nav-links');
        if (navLinks) {
            let linksHtml = '';
            if (app.appStoreUrl) {
                linksHtml += '<a class="nav-link" href="' + escapeHtml(app.appStoreUrl) + '" target="_blank" rel="noopener">App Store</a>';
            }
            if (app.docs) {
                linksHtml += '<a class="nav-link" href="' + docsHref + '">Docs</a>';
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

        // Docs button beside the App Store button
        const docsLink = document.getElementById('app-docs-link');
        if (docsLink) {
            if (app.docs) {
                docsLink.href = docsHref;
                docsLink.style.display = '';
            }
        }
        const mcpLink = document.getElementById('app-mcp-link');
        if (mcpLink && app.docs && hasMCPDocs(app)) {
            mcpLink.href = docsHref + '#mcp-overview';
            mcpLink.style.display = '';
        }

        // Platforms
        const platformsEl = document.getElementById('app-platforms');
        if (platformsEl && window.Platforms) {
            platformsEl.innerHTML = '<span class="app-platforms-label">Available on</span>' + window.Platforms.badges(app);
        }

        // Apply accent color if provided
        if (app.accentColor) {
            document.documentElement.style.setProperty('--color-accent', app.accentColor);
            document.documentElement.style.setProperty('--color-accent-glow', app.accentColor + '26');
        }

        renderStats(app);

        // Screenshots
        renderScreenshots(app);

        renderHighlights(app, docsHref);

        // Features
        renderFeatures(app);

        renderDocsCallout(app, docsHref);

        // Description
        renderDescription(app);

        // Footer links
        renderFooterLinks(app);

        // Init scroll animations
        initScrollAnimations();
    }

    function hasMCPDocs(app) {
        return (app.highlights || []).some(function (h) { return h.docs && h.docs.indexOf('mcp-') === 0; });
    }

    function renderStats(app) {
        const section = document.getElementById('stats-section');
        const grid = document.getElementById('stats-grid');
        if (!section || !app.stats || !app.stats.length) return;
        grid.innerHTML = app.stats.map(function (s) {
            return '<div class="stat"><dt>' + escapeHtml(s.label) + '</dt><dd>' + escapeHtml(s.value) + '</dd></div>';
        }).join('');
        section.hidden = false;
    }

    function fillCarousel(carousel, images, altPrefix, platform) {
        const appBasePath = basePath + 'apps/' + slug + '/';
        carousel.innerHTML = '';
        carousel.setAttribute('data-platform', platform || '');
        carousel.scrollLeft = 0;
        images.forEach(function (src, i) {
            const item = document.createElement('div');
            item.className = 'screenshot-item';
            item.innerHTML = '<img src="' + escapeHtml(appBasePath + src) + '" alt="' + escapeHtml(altPrefix) + ' screenshot ' + (i + 1) + '" loading="' + (i < 3 ? 'eager' : 'lazy') + '">';
            carousel.appendChild(item);
            setTimeout(function () {
                item.classList.add('is-visible');
            }, 120 + i * 70);
        });
    }

    function renderScreenshots(app) {
        const section = document.getElementById('screenshots-section');
        const carousel = document.getElementById('screenshots-carousel');
        const sets = (app.screenshotSets || []).filter(function (set) { return set.images && set.images.length; });

        if (sets.length > 1 && window.Platforms) {
            const tabs = document.getElementById('platform-tabs');
            tabs.innerHTML = sets.map(function (set, i) {
                return '<button type="button" role="tab" id="shots-tab-' + set.platform + '" aria-controls="screenshots-carousel" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? '0' : '-1') + '" data-index="' + i + '">' +
                    window.Platforms.icon(set.platform, 16) + '<span>' + escapeHtml(window.Platforms.label(set.platform)) + '</span></button>';
            }).join('');
            tabs.hidden = false;
            carousel.setAttribute('role', 'tabpanel');
            const select = function (i, focus) {
                const buttons = tabs.querySelectorAll('button');
                buttons.forEach(function (b, j) {
                    b.setAttribute('aria-selected', String(i === j));
                    b.tabIndex = i === j ? 0 : -1;
                });
                carousel.setAttribute('aria-labelledby', buttons[i].id);
                fillCarousel(carousel, sets[i].images, app.name + ' on ' + window.Platforms.label(sets[i].platform), sets[i].platform);
                if (focus) buttons[i].focus();
            };
            tabs.addEventListener('click', function (e) {
                const b = e.target.closest('button[data-index]');
                if (b) select(Number(b.getAttribute('data-index')), false);
            });
            tabs.addEventListener('keydown', function (e) {
                const current = Number(document.activeElement.getAttribute('data-index'));
                if (isNaN(current)) return;
                if (e.key === 'ArrowRight') { e.preventDefault(); select((current + 1) % sets.length, true); }
                if (e.key === 'ArrowLeft') { e.preventDefault(); select((current - 1 + sets.length) % sets.length, true); }
            });
            select(0, false);
            return;
        }

        const images = sets.length ? sets[0].images : (app.screenshots || []);
        if (!images.length) {
            section.style.display = 'none';
            return;
        }
        fillCarousel(carousel, images, app.name, sets.length ? sets[0].platform : '');
    }

    function renderHighlights(app, docsHref) {
        const section = document.getElementById('highlights-section');
        const list = document.getElementById('highlights-list');
        if (!section || !app.highlights || !app.highlights.length) return;
        const appBasePath = basePath + 'apps/' + slug + '/';
        list.innerHTML = app.highlights.map(function (h, i) {
            const platform = h.device && window.Platforms ? window.Platforms.label(h.device) : '';
            return '<article class="highlight animate-on-scroll' + (i % 2 ? ' is-reversed' : '') + '">' +
                '<figure class="highlight-media" data-device="' + escapeHtml(h.device || '') + '">' +
                    '<img src="' + escapeHtml(appBasePath + h.image) + '" alt="' + escapeHtml(h.title + (platform ? ' — ' + app.name + ' on ' + platform : '')) + '" loading="lazy">' +
                    (platform ? '<figcaption>' + window.Platforms.icon(h.device, 14) + escapeHtml(platform) + '</figcaption>' : '') +
                '</figure>' +
                '<div class="highlight-text">' +
                    (h.eyebrow ? '<p class="highlight-eyebrow">' + escapeHtml(h.eyebrow) + '</p>' : '') +
                    '<h3 class="highlight-title">' + escapeHtml(h.title) + '</h3>' +
                    '<p class="highlight-description">' + escapeHtml(h.description) + '</p>' +
                    (h.bullets && h.bullets.length ? '<ul class="highlight-bullets">' + h.bullets.map(function (b) { return '<li>' + escapeHtml(b) + '</li>'; }).join('') + '</ul>' : '') +
                    (h.docs && app.docs ? '<a class="highlight-link" href="' + docsHref + '#' + encodeURIComponent(h.docs) + '">Read the guide<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>' : '') +
                '</div>' +
            '</article>';
        }).join('');
        section.hidden = false;
    }

    async function renderDocsCallout(app, docsHref) {
        const section = document.getElementById('docs-callout-section');
        const grid = document.getElementById('docs-callout-grid');
        if (!section || !app.docs) return;
        let guides = 0, mcpPages = 0, groups = [];
        try {
            const res = await fetch(basePath + 'apps/' + slug + '/docs/content/en.json');
            const content = await res.json();
            content.groups.forEach(function (g) {
                if (g.kind === 'markdown') { mcpPages += g.features.length; return; }
                guides += g.features.length;
                groups.push(g.title);
            });
        } catch (e) { /* counts are optional */ }
        let html = '<a class="docs-callout" href="' + docsHref + '">' +
            '<span class="docs-callout-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14z"/><path d="M20 17v4H6.5A2.5 2.5 0 0 1 4 18.5"/></svg></span>' +
            '<span class="docs-callout-title">Feature guides</span>' +
            '<span class="docs-callout-text">' + (guides ? guides + ' step-by-step guides with why, how and best practices for every feature' : 'Step-by-step guides for every feature') + '.</span>' +
            (groups.length ? '<span class="docs-callout-meta">' + escapeHtml(groups.slice(0, 6).join(' · ')) + ' …</span>' : '') +
            '<span class="docs-callout-cta">Open the docs →</span></a>';
        if (mcpPages) {
            html += '<a class="docs-callout" href="' + docsHref + '#mcp-overview">' +
                '<span class="docs-callout-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 7l-5 5 5 5M15 7l5 5-5 5"/></svg></span>' +
                '<span class="docs-callout-title">Agents and MCP</span>' +
                '<span class="docs-callout-text">Connect Claude, Cursor, Codex or any MCP client to Mica on Mac. Setup, permissions, recipes and the full tool reference.</span>' +
                '<span class="docs-callout-meta">' + mcpPages + ' pages · Connect · Permissions · Workflows · Tools · Properties</span>' +
                '<span class="docs-callout-cta">Read the MCP guide →</span></a>';
        }
        grid.innerHTML = html;
        section.hidden = false;
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
        if (app.docs) {
            html += '<a class="footer-link" href="' + basePath + 'docs.html?id=' + encodeURIComponent(slug) + '">Docs</a>';
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
