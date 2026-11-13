/**
 * Platforms — shared platform icons and badges.
 *
 * Add `"platforms": ["iphone", "ipad", "mac", "vision"]` to an app's config.json
 * (any subset, in this order). Used by the home cards, the app sidebar,
 * the app detail hero and the docs.
 */
(function () {
    'use strict';

    var PLATFORMS = {
        iphone: {
            label: 'iPhone',
            paths: '<rect x="6.5" y="2" width="11" height="20" rx="2.6"/><path d="M10.4 4.7h3.2"/>'
        },
        ipad: {
            label: 'iPad',
            paths: '<rect x="3.5" y="2.5" width="17" height="19" rx="2.2"/><path d="M11 18.6h2"/>'
        },
        mac: {
            label: 'Mac',
            paths: '<rect x="4" y="4.5" width="16" height="11" rx="1.4"/><path d="M1.8 19.2h20.4M9.8 19.2l.6-1.4h3.2l.6 1.4"/>'
        },
        vision: {
            label: 'Apple Vision Pro',
            short: 'Vision Pro',
            paths: '<path d="M2.8 11.2c0-2.7 2.1-4.6 5-4.6h8.4c2.9 0 5 1.9 5 4.6v.9c0 2.8-2 4.9-4.6 4.9-1.8 0-2.7-1.8-4.6-1.8s-2.8 1.8-4.6 1.8c-2.6 0-4.6-2.1-4.6-4.9z"/><path d="M7.4 9.4h9.2"/>'
        }
    };
    var ORDER = ['iphone', 'ipad', 'mac', 'vision'];

    function list(app) {
        var given = (app && app.platforms) || ['iphone'];
        return ORDER.filter(function (p) { return given.indexOf(p) >= 0; });
    }

    function icon(id, size) {
        var p = PLATFORMS[id];
        if (!p) return '';
        var s = size || 16;
        return '<svg class="platform-icon" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p.paths + '</svg>';
    }

    function names(app) {
        var labels = list(app).map(function (id) { return PLATFORMS[id].label; });
        if (labels.length < 2) return labels.join('');
        return labels.slice(0, -1).join(', ') + ' and ' + labels[labels.length - 1];
    }

    // Compact row of icons: home cards and sidebar.
    function icons(app, size) {
        var ids = list(app);
        return '<span class="platform-icons" role="img" aria-label="' + 'Available on ' + names(app) + '" title="' + names(app) + '">' +
            ids.map(function (id) { return icon(id, size); }).join('') + '</span>';
    }

    // Labelled pills: app detail hero.
    function badges(app) {
        return '<ul class="platform-badges" aria-label="Available on">' + list(app).map(function (id) {
            var p = PLATFORMS[id];
            return '<li class="platform-badge">' + icon(id, 16) + '<span>' + (p.short || p.label) + '</span></li>';
        }).join('') + '</ul>';
    }

    window.Platforms = {
        all: PLATFORMS,
        order: ORDER,
        list: list,
        icon: icon,
        icons: icons,
        badges: badges,
        names: names,
        label: function (id) { return PLATFORMS[id] ? PLATFORMS[id].label : id; }
    };
})();
