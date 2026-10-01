/** A procedural spiral galaxy, with app icons as its wandering stars. */
(function () {
    'use strict';

    const galaxy = document.getElementById('galaxy');
    const canvas = document.getElementById('galaxy-canvas');
    const stars = document.getElementById('hero-stars');
    if (!galaxy || !canvas) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let paused = reducedMotion.matches;
    let inView = true;
    let frame = 0;
    let lastTime = 0;
    let elapsed = 0;
    let width = galaxy.clientWidth;
    let height = galaxy.clientHeight;
    let slots = [];
    let apps = [];
    let base = '';
    const popInDuration = 0.24;
    const popOutDuration = 0.18;

    // Fixed dust positions prevent the composition from jumping on reload.
    let seed = 73;
    function random() {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    }

    for (let i = 0; i < 46; i++) {
        const star = document.createElement('span');
        star.style.cssText = 'left:' + random() * 100 + '%;top:' + random() * 100 +
            '%;--star-size:' + (random() > 0.88 ? 3 : 1.5) + 'px;--star-delay:-' +
            random() * 8 + 's;--star-duration:' + (5 + random() * 5) + 's';
        stars.appendChild(star);
    }

    // Paint once. CSS rotates the resulting texture without redrawing the dust.
    const ctx = canvas.getContext('2d');
    if (ctx) {
        const size = canvas.width;
        const center = size / 2;
        function glow(x, y, radius, color, strength) {
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, 'rgba(' + color + ',' + strength + ')');
            gradient.addColorStop(0.35, 'rgba(' + color + ',' + strength * 0.4 + ')');
            gradient.addColorStop(1, 'rgba(' + color + ',0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
        }
        ctx.globalCompositeOperation = 'screen';
        glow(center, center, 370, '116,99,208', 0.14);

        // Two main spiral arms, with softer secondary arms and individual starlight.
        for (let arm = 0; arm < 4; arm++) {
            for (let i = 0; i < 620; i++) {
                const distance = 22 + Math.pow(random(), 0.72) * 347;
                const spread = (random() - 0.5) * (0.18 + distance / 1300);
                const angle = arm * Math.PI / 2 + distance / 110 + spread;
                const x = center + Math.cos(angle) * distance;
                const y = center + Math.sin(angle) * distance;
                const color = distance > 245 ? '100,153,237' : '166,143,229';
                const strength = (1 - distance / 430) * (arm % 2 === 0 ? 0.09 : 0.035);
                if (i % 3 === 0) glow(x, y, 12 + random() * 28, color, strength);
                ctx.fillStyle = 'rgba(' + (random() > 0.7 ? '218,228,255' : color) + ',' +
                    (0.15 + random() * 0.55) * (1 - distance / 470) + ')';
                ctx.beginPath();
                ctx.arc(x, y, 0.3 + random() * 1.05, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        for (let i = 0; i < 550; i++) {
            const angle = random() * Math.PI * 2;
            const distance = Math.pow(random(), 1.8) * 320;
            ctx.fillStyle = 'rgba(214,207,249,' + (0.08 + random() * 0.3) + ')';
            ctx.beginPath();
            ctx.arc(center + Math.cos(angle) * distance, center + Math.sin(angle) * distance,
                0.3 + random() * 0.65, 0, Math.PI * 2);
            ctx.fill();
        }
        glow(center, center, 145, '193,174,239', 0.28);
        glow(center, center, 65, '244,224,255', 0.6);
        glow(center, center, 24, '255,245,235', 0.8);
    }

    function syncMotion() {
        galaxy.classList.toggle('is-paused', paused || !inView || document.hidden);
        stars.classList.toggle('is-paused', paused || !inView || document.hidden);
        cancelAnimationFrame(frame);
        frame = 0;
        lastTime = 0;
        if (!paused && inView && !document.hidden) frame = requestAnimationFrame(animate);
    }

    function setApp(slot, app) {
        slot.app = app;
        slot.link.href = base + 'app.html?id=' + encodeURIComponent(app._slug);
        slot.link.setAttribute('aria-label', 'Explore ' + app.name);
        slot.image.src = base + 'apps/' + app._slug + '/' + (app.icon || 'icon.png');
    }

    function placeApps() {
        const tilt = -0.32;
        slots.forEach(function (slot) {
            const interacting = slot.link.matches(':hover, :focus-visible');
            if (elapsed - slot.born > slot.lifetime && !interacting) {
                const available = apps.filter(app => app !== slot.app);
                if (available.length) setApp(slot, available[Math.floor(Math.random() * available.length)]);
                slot.angle = Math.random() * Math.PI * 2;
                slot.radius = 0.25 + Math.random() * 0.14;
                slot.born = elapsed + 0.04;
                slot.lifetime = 3 + Math.random();
            }

            const angle = slot.angle + elapsed * slot.speed;
            const radius = width * slot.radius;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius * 0.64;
            const screenX = x * Math.cos(tilt) - y * Math.sin(tilt);
            const screenY = x * Math.sin(tilt) + y * Math.cos(tilt) + Math.sin(elapsed * 0.9) * 5;
            const depth = Math.sin(angle);
            const scale = 0.78 + (depth + 1) * 0.16;
            const age = elapsed - slot.born;
            const entering = Math.max(0, Math.min(1, age / popInDuration));
            const leaving = Math.max(0, Math.min(1, (slot.lifetime - age) / popOutDuration));
            // A quick spring-like pop in, then a compact shrink out before switching apps.
            const spring = 1 + 2.70158 * Math.pow(entering - 1, 3) +
                1.70158 * Math.pow(entering - 1, 2);
            const held = interacting || (paused && elapsed === 0);
            const popScale = held ? 1 : (0.35 + spring * 0.65) * (0.35 + leaving * leaving * 0.65);
            const opacity = held ? 1 : (1 - Math.pow(1 - entering, 3)) * leaving * leaving;
            slot.link.style.transform = 'translate(' + (width / 2 + screenX) + 'px,' +
                (height / 2 - 12 + screenY) + 'px) translate(-50%,-50%) scale(' + scale * popScale + ')';
            slot.link.style.opacity = opacity;
            slot.link.style.pointerEvents = opacity < 0.15 ? 'none' : 'auto';
            slot.link.tabIndex = opacity < 0.15 ? -1 : 0;
            slot.image.style.transform = 'translateZ(' + (depth * 14) + 'px) rotateX(' +
                Math.sin(elapsed * 0.7) * 18 + 'deg) rotateY(' +
                Math.cos(elapsed * 0.55) * 22 + 'deg) rotateZ(' +
                Math.sin(elapsed * 0.6) * 9 + 'deg)';
        });
    }

    function animate(time) {
        // Cap updates at 30 fps. Resume without jumping after backgrounding.
        if (!lastTime) lastTime = time;
        if (time - lastTime >= 1000 / 30) {
            elapsed += Math.min((time - lastTime) / 1000, 0.1);
            lastTime = time;
            placeApps();
        }
        frame = requestAnimationFrame(animate);
    }

    window.initAppGalaxy = function (configs, basePath) {
        if (slots.length) return;
        base = basePath;
        // Load the small icons before introducing them into an orbit.
        Promise.all(configs.map(app => new Promise(resolve => {
            const image = new Image();
            image.onload = () => resolve(app);
            image.onerror = () => resolve(null);
            image.src = base + 'apps/' + app._slug + '/' + (app.icon || 'icon.png');
        }))).then(function (loaded) {
            apps = loaded.filter(Boolean);
            for (let i = apps.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [apps[i], apps[j]] = [apps[j], apps[i]];
            }
            slots = apps.slice(0, 1).map(function (app) {
                const link = document.createElement('a');
                link.className = 'galaxy-app';
                const image = document.createElement('img');
                image.alt = '';
                image.width = 34;
                image.height = 34;
                link.appendChild(image);
                const slot = { link, image, angle: Math.random() * Math.PI * 2,
                    radius: 0.25 + Math.random() * 0.14, speed: 0.04,
                    born: elapsed, lifetime: 3 + Math.random() };
                setApp(slot, app);
                document.getElementById('galaxy-apps').appendChild(link);
                return slot;
            });
            placeApps();
            syncMotion();
        });
    };

    reducedMotion.addEventListener('change', function (event) {
        paused = event.matches;
        syncMotion();
    });
    document.addEventListener('visibilitychange', syncMotion);
    new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        syncMotion();
    }).observe(galaxy);
    new ResizeObserver(function () {
        width = galaxy.clientWidth;
        height = galaxy.clientHeight;
        placeApps();
    }).observe(galaxy);
    syncMotion();
})();
