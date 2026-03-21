/**
 * Legal Page — Terms & Privacy logic
 * Loads an app's legal content from its config.json
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

    // ---- Determine page type (terms or privacy) ----
    const basePath = getBasePath();
    const slug = getParam('id');
    const pagePath = window.location.pathname;
    const isPrivacy = pagePath.includes('privacy');
    const pageType = isPrivacy ? 'privacy' : 'terms';

    if (!slug) {
        window.location.href = basePath + 'index.html';
        return;
    }

    async function loadLegal() {
        try {
            const res = await fetch(basePath + 'apps/' + slug + '/config.json');
            if (!res.ok) throw new Error('Not found');
            const app = await res.json();
            renderLegal(app);
        } catch (e) {
            console.error('Failed to load app:', e);
            document.getElementById('legal-content').innerHTML =
                '<p>Could not load content. <a href="' + basePath + 'index.html">Return home</a>.</p>';
        }
    }

    function renderLegal(app) {
        // Page title
        const titleText = isPrivacy ? 'Privacy Policy' : 'Terms & Conditions';
        document.title = titleText + ' — ' + app.name;

        // Back link
        document.getElementById('back-link').href = basePath + 'app.html?id=' + encodeURIComponent(slug);

        // Title
        document.getElementById('legal-title').textContent = app.name + ' ' + titleText;

        // Last updated
        const legalData = isPrivacy ? app.privacyPolicy : app.termsAndConditions;
        const updatedEl = document.getElementById('legal-updated');

        if (legalData && legalData.lastUpdated) {
            updatedEl.textContent = 'Last updated: ' + legalData.lastUpdated;
        } else {
            updatedEl.style.display = 'none';
        }

        // Content
        const contentEl = document.getElementById('legal-content');

        if (!legalData || !legalData.sections || legalData.sections.length === 0) {
            contentEl.innerHTML = '<p>No ' + titleText.toLowerCase() + ' available for this app.</p>';
            return;
        }

        let html = '';
        legalData.sections.forEach(function (section) {
            html += '<h2>' + escapeHtml(section.title) + '</h2>';

            if (section.content) {
                // Split content by newlines for paragraphs
                const paragraphs = section.content.split('\n').filter(function (p) {
                    return p.trim().length > 0;
                });
                paragraphs.forEach(function (p) {
                    html += '<p>' + escapeHtml(p.trim()) + '</p>';
                });
            }

            if (section.items && section.items.length > 0) {
                html += '<ul>';
                section.items.forEach(function (item) {
                    html += '<li>' + escapeHtml(item) + '</li>';
                });
                html += '</ul>';
            }
        });

        contentEl.innerHTML = html;

        // Accent color
        if (app.accentColor) {
            document.documentElement.style.setProperty('--color-accent', app.accentColor);
        }
    }

    // ---- Init ----
    loadLegal();
})();
