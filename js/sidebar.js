/**
 * Sidebar — Shared navigation sidebar across all pages
 * Loads all app configs and renders a slide-out sidebar with app icons
 */
(function () {
    'use strict';

    function getBasePath() {
        var path = window.location.pathname;
        var lastSlash = path.lastIndexOf('/');
        return path.substring(0, lastSlash + 1);
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function getParam(name) {
        var params = new URLSearchParams(window.location.search);
        return params.get(name);
    }

    var basePath = getBasePath();
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebar-overlay');
    var toggle = document.getElementById('sidebar-toggle');
    var close = document.getElementById('sidebar-close');
    var appsContainer = document.getElementById('sidebar-apps');

    if (!sidebar || !toggle) return;

    // Toggle sidebar
    function openSidebar() {
        sidebar.classList.add('is-open');
        overlay.classList.add('is-visible');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        sidebar.classList.remove('is-open');
        overlay.classList.remove('is-visible');
        document.body.style.overflow = '';
    }

    toggle.addEventListener('click', openSidebar);
    close.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);

    // Close on Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeSidebar();
    });

    // Load apps for sidebar
    var currentSlug = getParam('id') || '';

    async function loadSidebarApps() {
        if (!window.APPS || APPS.length === 0) return;

        var configs = await Promise.all(
            APPS.map(async function (slug) {
                try {
                    var res = await fetch(basePath + 'apps/' + slug + '/config.json');
                    if (!res.ok) throw new Error('Not found');
                    var config = await res.json();
                    config._slug = slug;
                    return config;
                } catch (e) {
                    return null;
                }
            })
        );

        var validConfigs = configs.filter(Boolean);
        var html = '';

        validConfigs.forEach(function (app) {
            var iconPath = basePath + 'apps/' + app._slug + '/' + (app.icon || 'icon.png');
            var isActive = app._slug === currentSlug;
            var href = basePath + 'app.html?id=' + encodeURIComponent(app._slug);

            html += '<a class="sidebar-app' + (isActive ? ' is-active' : '') + '" href="' + href + '">' +
                '<img class="sidebar-app-icon" src="' + escapeHtml(iconPath) + '" alt="" loading="lazy">' +
                '<div class="sidebar-app-info">' +
                    '<span class="sidebar-app-name">' + escapeHtml(app.name) + '</span>' +
                    '<span class="sidebar-app-subtitle">' + escapeHtml(app.subtitle || '').substring(0, 60) + '</span>' +
                '</div>' +
                '<svg class="sidebar-app-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>' +
            '</a>';
        });

        // Add link back to home
        html += '<a class="sidebar-home" href="' + basePath + 'index.html">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' +
            '<span>View All Apps</span>' +
        '</a>';

        appsContainer.innerHTML = html;
    }

    loadSidebarApps();
})();
