/**
 * Docs page — localized feature docs for one app.
 *
 * URL: docs.html?id=<app>&lang=<locale>#<feature-id>
 * Content: apps/<app>/docs/content/<locale>.json (generated; see apps/<app>/docs/README.md)
 * Screenshots: apps/<app>/docs/screenshots/<feature-id>/step-<n>[.<locale>].png|jpg|webp,
 *              listed in apps/<app>/docs/screenshots/manifest.json.
 * Add ?shots=1 to see the expected screenshot path on each placeholder.
 */
(function () {
    'use strict';

    var LOCALES = [
        { code: 'en', flag: '🇺🇸', name: 'English' },
        { code: 'ja', flag: '🇯🇵', name: '日本語' },
        { code: 'zh-Hans', flag: '🇨🇳', name: '简体中文' },
        { code: 'ko', flag: '🇰🇷', name: '한국어' }
    ];
    var STORAGE_KEY = 'docs.locale';

    // Line icons for the sidebar groups (24×24, stroked).
    var ICONS = {
        spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.5 2.5M15.2 15.2l2.5 2.5M6.3 17.7l2.5-2.5M15.2 8.8l2.5-2.5"/>',
        move: '<path d="M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3"/>',
        frame: '<path d="M7 3v18M17 3v18M3 7h18M3 17h18"/>',
        type: '<path d="M5 6V4h14v2M12 4v16M9 20h6"/>',
        shapes: '<rect x="3" y="12" width="9" height="9" rx="1.5"/><circle cx="16.5" cy="7.5" r="4.5"/>',
        palette: '<path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.6-.8 1.6-1.6 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-.9.7-1.6 1.6-1.6H16a5 5 0 0 0 5-5C21 6.6 17 3 12 3z"/><circle cx="7.5" cy="11.5" r="1"/><circle cx="10" cy="7.5" r="1"/><circle cx="14.5" cy="7.5" r="1"/>',
        wand: '<path d="M4 20L15 9M14 4v3M18.5 5.5l-2 2M20 10h-3M9.5 4.5l1.5 1.5"/><path d="M15 9l1 1"/>',
        layout: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 10h18M10 10v11"/>',
        mirror: '<rect x="3" y="5" width="7" height="14" rx="1.5"/><rect x="14" y="5" width="7" height="14" rx="1.5" stroke-dasharray="2.5 2.5"/>',
        diamond: '<path d="M12 3l9 9-9 9-9-9 9-9z"/><path d="M12 8l4 4-4 4-4-4 4-4z"/>',
        cube: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>',
        export: '<path d="M12 15V3M8 7l4-4 4 4"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>',
        sparkles: '<path d="M10 3l1.8 4.7L16.5 9.5l-4.7 1.8L10 16l-1.8-4.7L3.5 9.5l4.7-1.8L10 3z"/><path d="M18 14l.9 2.1L21 17l-2.1.9L18 20l-.9-2.1L15 17l2.1-.9L18 14z"/>',
        pencil: '<path d="M16.5 3.5l4 4L8 20H4v-4L16.5 3.5z"/><path d="M14 6l4 4"/>',
        eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
        gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1"/>',
        agent: '<rect x="4" y="7" width="16" height="12" rx="3"/><path d="M12 3v4M9 12h.01M15 12h.01M9.5 15.5h5"/><path d="M2 12v3M22 12v3"/>',
        book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14z"/><path d="M20 17v4H6.5A2.5 2.5 0 0 1 4 18.5"/><path d="M8 7h8M8 11h6"/>',
        check: '<path d="M5 12l5 5 9-10"/>',
        bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
        sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>'
    };

    var state = {
        slug: null,
        app: null,
        locale: 'en',
        content: null,
        screenshots: new Set(),
        order: [],
        byId: {},
        query: '',
        markdown: {}
    };

    // ---- Helpers ----
    function basePath() {
        var path = window.location.pathname;
        return path.substring(0, path.lastIndexOf('/') + 1);
    }

    function param(name) {
        return new URLSearchParams(window.location.search).get(name);
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function format(template, values) {
        return String(template).replace(/\{(\w+)\}/g, function (m, key) {
            return key in values ? values[key] : m;
        });
    }

    function icon(name, size) {
        var paths = ICONS[name] || ICONS.spark;
        var s = size || 18;
        return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + '</svg>';
    }

    // Wrap keyboard shortcuts such as ⌥⌘G or ⇧A in <kbd>.
    var SHORTCUT = /([⌘⌥⇧⌃]+(?:Return|Esc|Space|[A-Za-z0-9\\\/;,.<>+\-−=]))/g;
    function richText(text) {
        return escapeHtml(text).replace(SHORTCUT, '<kbd>$1</kbd>');
    }

    function resolveLocale() {
        var codes = LOCALES.map(function (l) { return l.code; });
        var fromUrl = param('lang');
        if (fromUrl && codes.indexOf(fromUrl) >= 0) return fromUrl;
        try {
            var saved = localStorage.getItem(STORAGE_KEY);
            if (saved && codes.indexOf(saved) >= 0) return saved;
        } catch (e) { /* storage unavailable */ }
        var langs = navigator.languages || [navigator.language || 'en'];
        for (var i = 0; i < langs.length; i++) {
            var tag = String(langs[i]).toLowerCase();
            if (tag.indexOf('ja') === 0) return 'ja';
            if (tag.indexOf('ko') === 0) return 'ko';
            if (tag === 'zh' || tag.indexOf('zh-hans') === 0 || tag === 'zh-cn' || tag === 'zh-sg') return 'zh-Hans';
            if (tag.indexOf('en') === 0) return 'en';
        }
        return 'en';
    }

    function docsUrl(featureId, locale) {
        var url = basePath() + 'docs.html?id=' + encodeURIComponent(state.slug);
        if (locale && locale !== 'en') url += '&lang=' + encodeURIComponent(locale);
        return url + (featureId ? '#' + featureId : '');
    }

    // ---- Loading ----
    async function fetchJSON(url) {
        var res = await fetch(url, { cache: 'no-cache' });
        if (!res.ok) throw new Error(url + ' → ' + res.status);
        return res.json();
    }

    async function loadContent(locale) {
        var root = basePath() + 'apps/' + state.slug + '/docs/';
        var content;
        try {
            content = await fetchJSON(root + 'content/' + locale + '.json');
        } catch (e) {
            if (locale === 'en') throw e;
            locale = 'en';
            content = await fetchJSON(root + 'content/en.json');
        }
        state.locale = locale;
        state.content = content;
        state.order = [];
        state.byId = {};
        content.groups.forEach(function (group) {
            group.features.forEach(function (feature) {
                feature.group = group;
                if (group.kind && !feature.kind) feature.kind = group.kind;
                state.order.push(feature);
                state.byId[feature.id] = feature;
            });
        });
    }

    async function loadScreenshots() {
        try {
            var manifest = await fetchJSON(basePath() + 'apps/' + state.slug + '/docs/screenshots/manifest.json');
            state.screenshots = new Set(manifest.files || []);
        } catch (e) {
            state.screenshots = new Set();
        }
    }

    // Returns the best screenshot path for a step: localized, then default.
    function screenshotFor(featureId, n) {
        var exts = ['png', 'jpg', 'jpeg', 'webp'];
        var candidates = [];
        exts.forEach(function (ext) { candidates.push(featureId + '/step-' + n + '.' + state.locale + '.' + ext); });
        exts.forEach(function (ext) { candidates.push(featureId + '/step-' + n + '.' + ext); });
        for (var i = 0; i < candidates.length; i++) {
            if (state.screenshots.has(candidates[i])) return candidates[i];
        }
        return null;
    }

    // ---- Chrome ----
    function ui(key, values) {
        var text = (state.content && state.content.ui[key]) || key;
        return values ? format(text, values) : text;
    }

    function renderChrome() {
        var app = state.app;
        var locale = LOCALES.filter(function (l) { return l.code === state.locale; })[0] || LOCALES[0];
        document.documentElement.lang = state.locale;
        document.getElementById('docs-lang-flag').textContent = locale.flag;
        document.getElementById('docs-lang-name').textContent = locale.name;
        document.getElementById('docs-lang-button').setAttribute('aria-label', ui('language') + ': ' + locale.name);
        document.getElementById('docs-brand-text').textContent = ui('docsTitle');
        document.getElementById('docs-brand').href = docsUrl('', state.locale);
        document.getElementById('docs-menu-label').textContent = ui('menu');
        document.getElementById('docs-back-label').textContent = ui('backToApp');
        document.getElementById('docs-back-link').href = basePath() + 'app.html?id=' + encodeURIComponent(state.slug);
        var input = document.getElementById('docs-search-input');
        input.placeholder = ui('searchPlaceholder');
        input.setAttribute('aria-label', ui('searchPlaceholder'));
        document.getElementById('docs-sidebar').setAttribute('aria-label', ui('menu'));
        if (app) {
            var brandIcon = document.getElementById('docs-brand-icon');
            brandIcon.src = basePath() + 'apps/' + state.slug + '/' + (app.icon || 'icon.png');
            brandIcon.alt = '';
        }
        var menu = document.getElementById('docs-lang-menu');
        menu.innerHTML = LOCALES.map(function (l) {
            var selected = l.code === state.locale;
            return '<li role="option" tabindex="-1" data-locale="' + l.code + '" aria-selected="' + selected + '" lang="' + l.code + '">' +
                '<span class="docs-lang-flag" aria-hidden="true">' + l.flag + '</span><span>' + escapeHtml(l.name) + '</span>' +
                (selected ? '<svg class="docs-lang-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>' : '') +
                '</li>';
        }).join('');
    }

    function matchesQuery(feature, terms) {
        if (!terms.length) return true;
        var text = [feature.title, feature.summary, feature.group.title, feature.why || '']
            .concat(feature.steps || [])
            .concat((feature.faq || []).map(function (f) { return f.q + ' ' + f.a; }))
            .concat(feature.uses || [])
            .concat(feature.tips || [])
            .concat((feature.details || []).map(function (d) { return d.term + ' ' + d.text; }))
            .concat(state.markdown[feature.id] ? [state.markdown[feature.id]] : [])
            .join(' ').toLowerCase();
        return terms.every(function (t) { return text.indexOf(t) >= 0; });
    }

    function renderNav() {
        var nav = document.getElementById('docs-nav');
        var current = currentFeatureId();
        var terms = state.query.toLowerCase().split(/\s+/).filter(Boolean);
        var html = '';
        var total = 0;
        if (!terms.length) {
            html += '<a class="docs-nav-overview' + (current ? '' : ' is-active') + '" href="' + docsUrl('', state.locale) + '">' +
                icon('spark', 16) + '<span>' + escapeHtml(ui('overview')) + '</span></a>';
        }
        state.content.groups.forEach(function (group) {
            var features = group.features.filter(function (f) { return matchesQuery(f, terms); });
            if (!features.length) return;
            total += features.length;
            var containsCurrent = features.some(function (f) { return f.id === current; });
            html += '<section class="docs-nav-group' + (containsCurrent ? ' has-active' : '') + '">' +
                '<h2 class="docs-nav-group-title"><span class="docs-nav-group-icon">' + icon(group.icon, 16) + '</span>' + escapeHtml(group.title) + '</h2><ul>';
            features.forEach(function (f) {
                var active = f.id === current;
                html += '<li><a href="#' + f.id + '"' + (active ? ' class="is-active" aria-current="page"' : '') + '>' + escapeHtml(f.title) + '</a></li>';
            });
            html += '</ul></section>';
        });
        if (!total) {
            html += '<p class="docs-nav-empty">' + escapeHtml(ui('noResults', { query: state.query })) + '</p>';
        }
        nav.innerHTML = html;
        var activeLink = nav.querySelector('a.is-active');
        if (activeLink && !isDrawer()) activeLink.scrollIntoView({ block: 'nearest' });
    }

    // ---- Pages ----
    function currentFeatureId() {
        var id = decodeURIComponent(window.location.hash.replace(/^#/, ''));
        return state.byId[id] ? id : '';
    }

    function renderOverview() {
        var app = state.app || {};
        var html = '<div class="docs-overview">' +
            '<div class="docs-hero">' +
            (app.icon ? '<img class="docs-hero-icon" src="' + escapeHtml(basePath() + 'apps/' + state.slug + '/' + app.icon) + '" alt="">' : '') +
            '<div><h1>' + escapeHtml(ui('docsTitle')) + '</h1>' +
            '<p class="docs-lede">' + escapeHtml(ui('docsTagline')) + '</p>' +
            '<p class="docs-hero-note">' + escapeHtml(ui('inApp')) + '</p></div></div>' +
            '<p class="docs-section-intro">' + escapeHtml(ui('overviewIntro')) + '</p>';
        var agents = state.content.groups.filter(function (g) { return g.kind === 'markdown'; })[0];
        if (agents && agents.features.length) {
            var hero = agents.features[0].hero;
            html += '<a class="docs-agents-banner" href="#' + agents.features[0].id + '">' +
                '<span class="docs-agents-text"><span class="docs-agents-eyebrow">' + icon('agent', 15) + escapeHtml(agents.title) + '</span>' +
                '<strong>' + escapeHtml(agents.features[0].title) + '</strong>' +
                '<span>' + escapeHtml(ui('agentsIntro')) + '</span>' +
                '<span class="docs-agents-cta">' + escapeHtml(ui('agentsCta')) + ' →</span></span>' +
                (hero ? '<img src="' + escapeHtml(assetUrl(hero.src)) + '" alt="" loading="lazy">' : '') +
                '</a>';
        }
        html += '<div class="docs-group-grid">';
        state.content.groups.forEach(function (group) {
            var first = group.features[0];
            var countLabel = group.kind === 'markdown' ? ui('pagesCount', { count: group.features.length }) : ui('featuresCount', { count: group.features.length });
            html += '<a class="docs-group-card" href="#' + first.id + '">' +
                '<span class="docs-group-card-icon">' + icon(group.icon, 22) + '</span>' +
                '<span class="docs-group-card-title">' + escapeHtml(group.title) + '</span>' +
                '<span class="docs-group-card-list">' + group.features.slice(0, 4).map(function (f) { return escapeHtml(f.title); }).join(' · ') + '</span>' +
                '<span class="docs-group-card-count">' + escapeHtml(countLabel) + '</span>' +
                '</a>';
        });
        html += '</div></div>';
        return html;
    }

    function renderStep(feature, step, index) {
        var n = index + 1;
        var shot = screenshotFor(feature.id, n);
        var alt = ui('step', { n: n }) + ': ' + step;
        var media;
        if (!shot && !param('shots')) {
            return '<li class="docs-step docs-step-text-only" id="' + feature.id + '-step-' + n + '">' +
                '<div class="docs-step-text"><span class="docs-step-number" aria-hidden="true">' + n + '</span>' +
                '<p><span class="docs-visually-hidden">' + escapeHtml(ui('step', { n: n })) + '. </span>' + richText(step) + '</p></div></li>';
        }
        if (shot) {
            media = '<img src="' + escapeHtml(basePath() + 'apps/' + state.slug + '/docs/screenshots/' + shot) + '" alt="' + escapeHtml(alt) + '" loading="lazy">';
        } else {
            var expected = 'apps/' + state.slug + '/docs/screenshots/' + feature.id + '/step-' + n + '.png';
            media = '<div class="docs-shot-placeholder" role="img" aria-label="' + escapeHtml(ui('screenshotPending')) + '" data-expected="' + escapeHtml(expected) + '">' +
                '<span class="docs-shot-icon">' + icon(feature.group.icon, 26) + '</span>' +
                '<span class="docs-shot-label">' + escapeHtml(ui('screenshotPending')) + '</span>' +
                (param('shots') ? '<code class="docs-shot-path">' + escapeHtml(expected) + '</code>' : '') +
                '</div>';
        }
        return '<li class="docs-step" id="' + feature.id + '-step-' + n + '">' +
            '<div class="docs-step-text"><span class="docs-step-number" aria-hidden="true">' + n + '</span>' +
            '<p><span class="docs-visually-hidden">' + escapeHtml(ui('step', { n: n })) + '. </span>' + richText(step) + '</p></div>' +
            '<figure class="docs-shot">' + media + '</figure></li>';
    }

    function assetUrl(src) {
        return basePath() + 'apps/' + state.slug + '/' + src;
    }

    function renderHero(feature) {
        var hero = feature.hero;
        if (!hero) return '';
        var platform = window.Platforms ? window.Platforms.label(hero.device) : '';
        return '<figure class="docs-hero-shot" data-device="' + escapeHtml(hero.device || '') + '">' +
            '<img src="' + escapeHtml(assetUrl(hero.src)) + '" alt="' + escapeHtml(hero.alt || feature.title) + '">' +
            (platform ? '<figcaption>' + (window.Platforms ? window.Platforms.icon(hero.device, 13) : '') + escapeHtml(platform) + '</figcaption>' : '') +
            '</figure>';
    }

    function pager(feature) {
        var index = state.order.indexOf(feature);
        var prev = state.order[index - 1];
        var next = state.order[index + 1];
        return '<nav class="docs-pager">' +
            (prev ? '<a class="docs-pager-prev" href="#' + prev.id + '"><span>' + escapeHtml(ui('previous')) + '</span><strong>' + escapeHtml(prev.title) + '</strong></a>' : '<span></span>') +
            (next ? '<a class="docs-pager-next" href="#' + next.id + '"><span>' + escapeHtml(ui('next')) + '</span><strong>' + escapeHtml(next.title) + '</strong></a>' : '<span></span>') +
            '</nav>';
    }

    function titleRow(feature) {
        return '<p class="docs-eyebrow">' + icon(feature.group.icon, 15) + '<span>' + escapeHtml(feature.group.title) + '</span></p>' +
            '<div class="docs-title-row"><h1 id="docs-title" tabindex="-1">' + escapeHtml(feature.title) + '</h1>' +
            '<button class="docs-copy-link" type="button" data-copy="' + escapeHtml(feature.id) + '" title="' + escapeHtml(ui('copyLink')) + '" aria-label="' + escapeHtml(ui('copyLink')) + '">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg></button></div>';
    }

    function englishNote(feature) {
        return feature.extrasLang && feature.extrasLang !== state.locale
            ? ' lang="' + feature.extrasLang + '"' : '';
    }

    function renderFeature(feature) {
        var sections = [];
        var lang = englishNote(feature);
        var html = '<article class="docs-article">' + titleRow(feature) +
            '<p class="docs-lede">' + richText(feature.summary) + '</p>';
        if (feature.why) {
            html += '<div class="docs-why"' + lang + '><h2 class="docs-h3" id="docs-why">' + icon('bulb', 16) + escapeHtml(ui('why')) + '</h2><p>' + richText(feature.why) + '</p></div>';
        }
        html += renderHero(feature);
        sections.push(['docs-steps', ui('steps'), feature.steps.length]);
        if (feature.uses && feature.uses.length) sections.push(['docs-uses', ui('uses'), feature.uses.length]);
        if (feature.details && feature.details.length) sections.push(['docs-details', ui('details'), feature.details.length]);
        if (feature.tips && feature.tips.length) sections.push(['docs-tips', ui('tips'), feature.tips.length]);
        sections.push(['docs-faq', ui('faq'), feature.faq.length]);
        html += '<nav class="docs-jump" aria-label="' + escapeHtml(ui('onThisPage')) + '">' + sections.map(function (sec) {
            return '<a href="#' + feature.id + '" data-scroll="' + sec[0] + '">' + escapeHtml(sec[1]) + ' <span>' + sec[2] + '</span></a>';
        }).join('') + '</nav>';
        html += '<h2 class="docs-h2" id="docs-steps">' + escapeHtml(ui('steps')) + '</h2>' +
            '<ol class="docs-steps">' + feature.steps.map(function (s, i) { return renderStep(feature, s, i); }).join('') + '</ol>';
        if (feature.uses && feature.uses.length) {
            html += '<h2 class="docs-h2" id="docs-uses">' + escapeHtml(ui('uses')) + '</h2>' +
                '<ul class="docs-uses"' + lang + '>' + feature.uses.map(function (u) { return '<li>' + icon('check', 16) + '<span>' + richText(u) + '</span></li>'; }).join('') + '</ul>';
        }
        if (feature.details && feature.details.length) {
            html += '<h2 class="docs-h2" id="docs-details">' + escapeHtml(ui('details')) + '</h2>' +
                '<dl class="docs-details"' + lang + '>' + feature.details.map(function (d) {
                    return '<div><dt>' + richText(d.term) + '</dt><dd>' + richText(d.text) + '</dd></div>';
                }).join('') + '</dl>';
        }
        if (feature.tips && feature.tips.length) {
            html += '<h2 class="docs-h2" id="docs-tips">' + escapeHtml(ui('tips')) + '</h2>' +
                '<ol class="docs-tips"' + lang + '>' + feature.tips.map(function (t) { return '<li>' + richText(t) + '</li>'; }).join('') + '</ol>';
        }
        html += '<h2 class="docs-h2" id="docs-faq">' + escapeHtml(ui('faq')) + '</h2>' +
            '<div class="docs-faq">' + feature.faq.map(function (item, i) {
                return '<details' + (i === 0 ? ' open' : '') + '><summary>' + richText(item.q) +
                    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></summary>' +
                    '<p>' + richText(item.a) + '</p></details>';
            }).join('') + '</div>';
        if (lang) html += '<p class="docs-lang-note">' + escapeHtml(ui('englishOnly')) + '</p>';
        return html + pager(feature) + '</article>';
    }

    // ---- Markdown (Agents & MCP pages) ----
    function slugify(text) {
        return 'md-' + String(text).toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    function inlineMarkdown(text) {
        var codes = [];
        var out = escapeHtml(text).replace(/`([^`]+)`/g, function (m, code) {
            codes.push('<code>' + code + '</code>');
            return '\u0000' + (codes.length - 1) + '\u0000';
        });
        out = out
            .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, label, href) {
                var safe = /^(https?:|mailto:|#|\.{0,2}\/)/.test(href) ? href : '#';
                var external = /^https?:/.test(safe) && safe.indexOf(window.location.host) < 0;
                return '<a href="' + safe + '"' + (external ? ' target="_blank" rel="noopener"' : '') + '>' + label + '</a>';
            })
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/(^|[\s(])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
            .replace(/(^|[\s(])_([^_\s][^_]*)_(?=[\s).,;:]|$)/g, '$1<em>$2</em>')
            .replace(SHORTCUT, '<kbd>$1</kbd>');
        return out.replace(/\u0000(\d+)\u0000/g, function (m, i) { return codes[Number(i)]; });
    }

    function renderMarkdown(source) {
        var lines = source.replace(/\r\n/g, '\n').split('\n');
        var html = '';
        var toc = [];
        var i = 0;
        var seenTitle = false;
        function isBlockStart(l) {
            return /^(#{1,4}\s|```|>\s?|\|)/.test(l) || /^\s*([-*]|\d+\.)\s+/.test(l);
        }
        while (i < lines.length) {
            var line = lines[i];
            if (!line.trim()) { i++; continue; }
            var fence = line.match(/^```\s*([\w+-]*)/);
            if (fence) {
                var code = [];
                i++;
                while (i < lines.length && !/^```/.test(lines[i])) { code.push(lines[i]); i++; }
                i++;
                html += '<div class="md-code"><div class="md-code-bar"><span>' + escapeHtml(fence[1] || 'text') + '</span>' +
                    '<button type="button" class="md-copy" data-copy-code>Copy</button></div><pre><code>' + escapeHtml(code.join('\n')) + '</code></pre></div>';
                continue;
            }
            var heading = line.match(/^(#{1,4})\s+(.*)$/);
            if (heading) {
                var level = heading[1].length;
                if (level === 1 && !seenTitle) { seenTitle = true; i++; continue; }
                var text = inlineMarkdown(heading[2]);
                var id = slugify(heading[2]);
                var tag = 'h' + Math.min(level + (level === 1 ? 1 : 0), 4);
                if (tag === 'h2') toc.push([id, heading[2].replace(/`/g, '')]);
                html += '<' + tag + ' class="md-' + tag + '" id="' + id + '">' + text + '</' + tag + '>';
                i++;
                continue;
            }
            if (/^\|/.test(line)) {
                var rows = [];
                while (i < lines.length && /^\|/.test(lines[i])) { rows.push(lines[i]); i++; }
                var cells = function (r) { return r.replace(/^\||\|\s*$/g, '').split(/(?<!\\)\|/).map(function (c) { return c.trim().replace(/\\\|/g, '|'); }); };
                var head = cells(rows[0]);
                var body = rows.slice(/^\|[\s:|-]+\|?\s*$/.test(rows[1] || '') ? 2 : 1);
                html += '<div class="md-table"><table><thead><tr>' + head.map(function (c) { return '<th>' + inlineMarkdown(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
                    body.map(function (r) { return '<tr>' + cells(r).map(function (c) { return '<td>' + inlineMarkdown(c) + '</td>'; }).join('') + '</tr>'; }).join('') +
                    '</tbody></table></div>';
                continue;
            }
            if (/^>\s?/.test(line)) {
                var quote = [];
                while (i < lines.length && /^>\s?/.test(lines[i])) { quote.push(lines[i].replace(/^>\s?/, '')); i++; }
                html += '<blockquote class="md-note"><p>' + inlineMarkdown(quote.join(' ')) + '</p></blockquote>';
                continue;
            }
            var listMatch = line.match(/^(\s*)([-*]|\d+\.)\s+/);
            if (listMatch) {
                var ordered = /\d/.test(listMatch[2]);
                var items = [];
                while (i < lines.length) {
                    var l = lines[i];
                    var m = l.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
                    if (m) {
                        items.push({ depth: m[1].length >= 2 ? 1 : 0, text: m[3] });
                        i++;
                    } else if (l.trim() && /^\s{2,}/.test(l) && items.length) {
                        items[items.length - 1].text += ' ' + l.trim();
                        i++;
                    } else {
                        break;
                    }
                }
                var tagName = ordered ? 'ol' : 'ul';
                html += '<' + tagName + ' class="md-list">' + items.map(function (it) {
                    return '<li' + (it.depth ? ' class="md-sub"' : '') + '>' + inlineMarkdown(it.text) + '</li>';
                }).join('') + '</' + tagName + '>';
                continue;
            }
            var para = [line.trim()];
            i++;
            while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i])) { para.push(lines[i].trim()); i++; }
            html += '<p>' + inlineMarkdown(para.join(' ')) + '</p>';
        }
        return { html: html, toc: toc };
    }

    function renderMarkdownPage(feature) {
        var source = state.markdown[feature.id];
        var html = '<article class="docs-article docs-md-article" lang="' + (feature.lang || 'en') + '">' + titleRow(feature);
        if (source === undefined) {
            loadMarkdown(feature);
            return html + '<p class="docs-lede">' + escapeHtml(feature.summary) + '</p><div class="docs-loading">…</div></article>';
        }
        var md = renderMarkdown(source);
        html += '<p class="docs-lede">' + inlineMarkdown(feature.summary) + '</p>' + renderHero(feature);
        if (md.toc.length > 2) {
            html += '<nav class="docs-jump docs-jump-wrap" aria-label="' + escapeHtml(ui('onThisPage')) + '">' + md.toc.map(function (t) {
                return '<a href="#' + feature.id + '" data-scroll="' + t[0] + '">' + escapeHtml(t[1]) + '</a>';
            }).join('') + '</nav>';
        }
        // The lede repeats the first paragraph; drop it from the body.
        var body = md.html.replace(/^<p>[\s\S]*?<\/p>/, '');
        if (state.locale !== 'en') html += '<p class="docs-lang-note" lang="' + state.locale + '">' + escapeHtml(ui('englishOnly')) + '</p>';
        return html + '<div class="md-body">' + body + '</div>' + pager(feature) + '</article>';
    }

    async function loadMarkdown(feature) {
        try {
            var res = await fetch(basePath() + 'apps/' + state.slug + '/docs/' + feature.src, { cache: 'no-cache' });
            if (!res.ok) throw new Error(res.status);
            state.markdown[feature.id] = await res.text();
        } catch (e) {
            state.markdown[feature.id] = '# ' + feature.title + '\n\nThis page could not be loaded.';
        }
        if (currentFeatureId() === feature.id) render(false);
    }

    function render(focusTitle) {
        var main = document.getElementById('docs-main');
        var id = currentFeatureId();
        var appName = state.app ? state.app.name : '';
        if (id) {
            var feature = state.byId[id];
            main.innerHTML = feature.kind === 'markdown' ? renderMarkdownPage(feature) : renderFeature(feature);
            document.title = feature.title + ' — ' + ui('docsTitle');
        } else {
            main.innerHTML = renderOverview();
            document.title = ui('docsTitle') + (appName ? ' — ' + appName : '');
        }
        renderNav();
        if (focusTitle) {
            window.scrollTo(0, 0);
            var title = document.getElementById('docs-title');
            if (title) title.focus({ preventScroll: true });
        }
    }

    // ---- Interaction ----
    function isDrawer() {
        return window.matchMedia('(max-width: 900px)').matches;
    }

    function setDrawer(open) {
        var sidebar = document.getElementById('docs-sidebar');
        var scrim = document.getElementById('docs-sidebar-scrim');
        var button = document.getElementById('docs-menu-button');
        sidebar.classList.toggle('is-open', open);
        scrim.hidden = !open;
        button.setAttribute('aria-expanded', String(open));
        document.body.classList.toggle('docs-drawer-open', open);
        if (open) {
            var active = sidebar.querySelector('a.is-active');
            if (active) active.scrollIntoView({ block: 'center' });
        }
    }

    function setLangMenu(open) {
        var menu = document.getElementById('docs-lang-menu');
        var button = document.getElementById('docs-lang-button');
        menu.hidden = !open;
        button.setAttribute('aria-expanded', String(open));
        if (open) {
            var selected = menu.querySelector('[aria-selected="true"]') || menu.firstElementChild;
            if (selected) selected.focus();
        }
    }

    async function switchLocale(code) {
        setLangMenu(false);
        if (code === state.locale) return;
        try { localStorage.setItem(STORAGE_KEY, code); } catch (e) { /* ignore */ }
        await loadContent(code);
        history.replaceState(null, '', docsUrl(currentFeatureId(), state.locale));
        renderChrome();
        render(false);
        document.getElementById('docs-lang-button').focus();
    }

    function bindEvents() {
        window.addEventListener('hashchange', function () {
            render(true);
            if (isDrawer()) setDrawer(false);
        });

        document.getElementById('docs-menu-button').addEventListener('click', function () {
            setDrawer(!document.getElementById('docs-sidebar').classList.contains('is-open'));
        });
        document.getElementById('docs-sidebar-scrim').addEventListener('click', function () { setDrawer(false); });

        var input = document.getElementById('docs-search-input');
        input.addEventListener('input', function () {
            state.query = input.value.trim();
            renderNav();
        });
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                var first = document.querySelector('#docs-nav section a');
                if (first) { window.location.hash = first.getAttribute('href'); input.blur(); }
            } else if (e.key === 'Escape') {
                input.value = ''; state.query = ''; renderNav(); input.blur();
            }
        });

        document.addEventListener('keydown', function (e) {
            var tag = (e.target.tagName || '').toLowerCase();
            if (e.key === '/' && tag !== 'input' && tag !== 'textarea') {
                e.preventDefault();
                if (isDrawer()) setDrawer(true);
                input.focus();
            } else if (e.key === 'Escape') {
                setLangMenu(false);
                if (isDrawer()) setDrawer(false);
            }
        });

        var langButton = document.getElementById('docs-lang-button');
        var langMenu = document.getElementById('docs-lang-menu');
        langButton.addEventListener('click', function () { setLangMenu(langMenu.hidden); });
        langMenu.addEventListener('click', function (e) {
            var item = e.target.closest('[data-locale]');
            if (item) switchLocale(item.getAttribute('data-locale'));
        });
        langMenu.addEventListener('keydown', function (e) {
            var items = Array.prototype.slice.call(langMenu.querySelectorAll('[data-locale]'));
            var i = items.indexOf(document.activeElement);
            if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
            else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (i >= 0) switchLocale(items[i].getAttribute('data-locale'));
            } else if (e.key === 'Escape') { setLangMenu(false); langButton.focus(); }
        });
        document.addEventListener('click', function (e) {
            if (!e.target.closest('#docs-lang')) setLangMenu(false);
        });

        document.getElementById('docs-main').addEventListener('click', function (e) {
            var jump = e.target.closest('[data-scroll]');
            if (jump) {
                e.preventDefault();
                var target = document.getElementById(jump.getAttribute('data-scroll'));
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                return;
            }
            var copyCode = e.target.closest('[data-copy-code]');
            if (copyCode) {
                var pre = copyCode.closest('.md-code').querySelector('code');
                var finish = function () {
                    copyCode.textContent = ui('linkCopied') === 'linkCopied' ? 'Copied' : 'Copied';
                    setTimeout(function () { copyCode.textContent = 'Copy'; }, 1400);
                };
                if (navigator.clipboard) navigator.clipboard.writeText(pre.textContent).then(finish, finish); else finish();
                return;
            }
            var copy = e.target.closest('[data-copy]');
            if (copy) {
                var url = window.location.origin + docsUrl(copy.getAttribute('data-copy'), state.locale);
                var done = function () {
                    copy.classList.add('is-copied');
                    copy.setAttribute('title', ui('linkCopied'));
                    setTimeout(function () { copy.classList.remove('is-copied'); copy.setAttribute('title', ui('copyLink')); }, 1600);
                };
                if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, done); else done();
            }
        });
    }

    // ---- Init ----
    async function init() {
        state.slug = param('id') || 'mica';
        var loading = document.getElementById('docs-loading');
        loading.textContent = '…';
        try {
            var results = await Promise.all([
                fetchJSON(basePath() + 'apps/' + state.slug + '/config.json').catch(function () { return null; }),
                loadContent(resolveLocale()),
                loadScreenshots()
            ]);
            state.app = results[0];
            if (state.app && state.app.accentColor) {
                document.documentElement.style.setProperty('--color-accent', state.app.accentColor);
                document.documentElement.style.setProperty('--color-accent-glow', state.app.accentColor + '33');
            }
        } catch (e) {
            console.error('Failed to load docs:', e);
            document.getElementById('docs-main').innerHTML =
                '<div class="not-found"><div><h1>404</h1><p>Docs not found</p><a href="' + basePath() + 'index.html">&larr; Back to portfolio</a></div></div>';
            return;
        }
        renderChrome();
        bindEvents();
        render(false);
        var id = currentFeatureId();
        if (id) {
            var title = document.getElementById('docs-title');
            if (title) title.focus({ preventScroll: true });
        }
    }

    init();
})();
