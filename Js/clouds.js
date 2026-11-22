/**
 * High-Performance Scroll-Driven Cloud Parallax Engine
 * Pre-renders SVG turbulence clouds into static GPU-friendly <canvas> textures once on load.
 */
(function () {
  const stage = document.getElementById('cloud-stage');
  const sunBloom = document.getElementById('sun-bloom');
  const sunCore = document.getElementById('sun-core');
  const defsSource = document.querySelector('svg defs');

  if (!stage) return;

  const isMobile = window.innerWidth <= 768;
  const SVG_NS = 'http://www.w3.org/2000/svg';

  const cloudConfigs = [
    {
      id: 'wisp-upper-right',
      width: '26vw',
      minWidth: 160,
      maxWidth: 420,
      baseX: 54,
      baseY: 22,
      travelX: -28,
      travelY: -12,
      scaleStart: 0.92,
      scaleEnd: 1.06,
      opacity: 0.85,
      filter: 'url(#cirrus-wisp)',
      mobileShow: true,
      puffs: [
        { cx: 52, cy: 36, rx: 14, ry: 18, fill: 'url(#cloud-grad-wisp)' },
        { cx: 46, cy: 48, rx: 18, ry: 14, fill: 'url(#cloud-grad-wisp)' },
        { cx: 58, cy: 50, rx: 15, ry: 13, fill: 'url(#cloud-grad-wisp)' },
        { cx: 50, cy: 64, rx: 11, ry: 14, fill: 'url(#cloud-grad-wisp)' }
      ]
    },
    {
      id: 'distant-left',
      width: '48vw',
      minWidth: 340,
      maxWidth: 760,
      baseX: -12,
      baseY: 14,
      travelX: 38,
      travelY: -8,
      scaleStart: 0.85,
      scaleEnd: 0.96,
      opacity: 0.62,
      filter: 'url(#cumulus-fluff-mid)',
      mobileShow: false,
      puffs: [
        { cx: 28, cy: 58, rx: 22, ry: 14, fill: 'url(#cloud-grad-soft)' },
        { cx: 46, cy: 48, rx: 26, ry: 19, fill: 'url(#cloud-grad-soft)' },
        { cx: 66, cy: 54, rx: 24, ry: 16, fill: 'url(#cloud-grad-soft)' },
        { cx: 50, cy: 62, rx: 32, ry: 13, fill: 'url(#cloud-shadow-core)' }
      ]
    },
    {
      id: 'hero-cumulus-main',
      width: '68vw',
      minWidth: 260,
      maxWidth: 1080,
      baseX: 14,
      baseY: 44,
      travelX: -48,
      travelY: -26,
      scaleStart: 0.96,
      scaleEnd: 1.18,
      opacity: 0.96,
      filter: 'url(#cumulus-fluff-heavy)',
      mobileShow: true,
      puffs: [
        { cx: 50, cy: 62, rx: 38, ry: 18, fill: 'url(#cloud-grad-bright)' },
        { cx: 24, cy: 64, rx: 19, ry: 13, fill: 'url(#cloud-grad-bright)' },
        { cx: 76, cy: 63, rx: 20, ry: 14, fill: 'url(#cloud-grad-bright)' },
        { cx: 48, cy: 67, rx: 34, ry: 13, fill: 'url(#cloud-shadow-core)' },
        { cx: 50, cy: 36, rx: 22, ry: 21, fill: 'url(#cloud-grad-bright)' },
        { cx: 36, cy: 46, rx: 20, ry: 17, fill: 'url(#cloud-grad-bright)' },
        { cx: 64, cy: 45, rx: 21, ry: 18, fill: 'url(#cloud-grad-bright)' },
        { cx: 54, cy: 31, rx: 16, ry: 14, fill: 'url(#cloud-highlight-puff)' }
      ]
    },
    {
      id: 'mid-right-drifter',
      width: '56vw',
      minWidth: 230,
      maxWidth: 880,
      baseX: 68,
      baseY: 58,
      travelX: -76,
      travelY: -22,
      scaleStart: 0.90,
      scaleEnd: 1.12,
      opacity: 0.90,
      filter: 'url(#cumulus-fluff-heavy)',
      mobileShow: true,
      puffs: [
        { cx: 48, cy: 60, rx: 34, ry: 16, fill: 'url(#cloud-grad-bright)' },
        { cx: 28, cy: 62, rx: 18, ry: 12, fill: 'url(#cloud-grad-bright)' },
        { cx: 70, cy: 61, rx: 19, ry: 13, fill: 'url(#cloud-grad-bright)' },
        { cx: 44, cy: 42, rx: 20, ry: 17, fill: 'url(#cloud-grad-bright)' },
        { cx: 60, cy: 46, rx: 18, ry: 15, fill: 'url(#cloud-grad-bright)' }
      ]
    },
    {
      id: 'lower-left-scatter',
      width: '52vw',
      minWidth: 220,
      maxWidth: 820,
      baseX: -16,
      baseY: 74,
      travelX: 64,
      travelY: -34,
      scaleStart: 0.94,
      scaleEnd: 1.15,
      opacity: 0.82,
      filter: 'url(#cumulus-fluff-mid)',
      mobileShow: true,
      puffs: [
        { cx: 34, cy: 55, rx: 22, ry: 14, fill: 'url(#cloud-grad-soft)' },
        { cx: 54, cy: 50, rx: 25, ry: 16, fill: 'url(#cloud-grad-bright)' },
        { cx: 72, cy: 58, rx: 19, ry: 12, fill: 'url(#cloud-grad-soft)' }
      ]
    },
    {
      id: 'upper-left-veil',
      width: '44vw',
      minWidth: 300,
      maxWidth: 680,
      baseX: -8,
      baseY: 6,
      travelX: 44,
      travelY: -10,
      scaleStart: 0.88,
      scaleEnd: 1.02,
      opacity: 0.55,
      filter: 'url(#cirrus-wisp)',
      mobileShow: false,
      puffs: [
        { cx: 38, cy: 48, rx: 26, ry: 12, fill: 'url(#cloud-grad-wisp)' },
        { cx: 58, cy: 42, rx: 24, ry: 14, fill: 'url(#cloud-grad-wisp)' }
      ]
    },
    {
      id: 'foreground-sweeper',
      width: '78vw',
      minWidth: 500,
      maxWidth: 1240,
      baseX: 36,
      baseY: 84,
      travelX: -95,
      travelY: -56,
      scaleStart: 1.0,
      scaleEnd: 1.26,
      opacity: 0.95,
      filter: 'url(#cumulus-fluff-heavy)',
      mobileShow: false,
      puffs: [
        { cx: 50, cy: 62, rx: 40, ry: 17, fill: 'url(#cloud-grad-bright)' },
        { cx: 46, cy: 40, rx: 24, ry: 19, fill: 'url(#cloud-grad-bright)' },
        { cx: 64, cy: 46, rx: 21, ry: 16, fill: 'url(#cloud-grad-bright)' }
      ]
    },
    {
      id: 'second-wave-left',
      width: '60vw',
      minWidth: 400,
      maxWidth: 940,
      baseX: -48,
      baseY: 32,
      travelX: 98,
      travelY: -18,
      scaleStart: 0.88,
      scaleEnd: 1.10,
      opacity: 0.90,
      filter: 'url(#cumulus-fluff-heavy)',
      mobileShow: false,
      puffs: [
        { cx: 48, cy: 60, rx: 35, ry: 16, fill: 'url(#cloud-grad-bright)' },
        { cx: 52, cy: 40, rx: 21, ry: 18, fill: 'url(#cloud-grad-bright)' }
      ]
    }
  ];

  /**
   * Render SVG filter 1x saja ke Canvas statis agar tidak makan CPU saat digerakkan
   */
  function createBakedCloudCanvas(cfg) {
    const size = isMobile ? 280 : 480;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    canvas.className = 'cloud-canvas';

    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('xmlns', SVG_NS);
    svg.setAttribute('width', String(size));
    svg.setAttribute('height', String(size));
    svg.setAttribute('viewBox', '-35 -35 170 170');

    if (defsSource) {
      svg.appendChild(defsSource.cloneNode(true));
    }

    const group = document.createElementNS(SVG_NS, 'g');
    if (!isMobile) {
      group.setAttribute('filter', cfg.filter);
    }

    cfg.puffs.forEach((puff) => {
      const ellipse = document.createElementNS(SVG_NS, 'ellipse');
      ellipse.setAttribute('cx', puff.cx);
      ellipse.setAttribute('cy', puff.cy);
      ellipse.setAttribute('rx', puff.rx);
      ellipse.setAttribute('ry', puff.ry);
      ellipse.setAttribute('fill', puff.fill);
      group.appendChild(ellipse);
    });

    svg.appendChild(group);

    const svgString = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
      }
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
    };
    img.src = url;

    return canvas;
  }

  const activeConfigs = isMobile
    ? cloudConfigs.filter((c) => c.mobileShow)
    : cloudConfigs;

  const cloudElements = [];

  activeConfigs.forEach((cfg) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'cloud-cluster';
    wrapper.style.width = `clamp(${cfg.minWidth}px, ${cfg.width}, ${cfg.maxWidth}px)`;
    wrapper.style.left = `${cfg.baseX}vw`;
    wrapper.style.top = `${cfg.baseY}vh`;
    wrapper.style.opacity = cfg.opacity;

    const canvas = createBakedCloudCanvas(cfg);
    wrapper.appendChild(canvas);
    stage.appendChild(wrapper);

    cloudElements.push({ el: wrapper, cfg });
  });

  let targetProgress = 0;
  let currentProgress = 0;
  let viewportWidth = window.innerWidth;
  let viewportHeight = window.innerHeight;
  let isAnimating = false;

  function updateViewportMetrics() {
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
  }

  function applyTransforms() {
    if (sunBloom && sunCore && !isMobile) {
      const sunX = -currentProgress * viewportWidth * 0.06;
      const sunY = -currentProgress * viewportHeight * 0.04;
      const sunScale = 1 + currentProgress * 0.08;
      sunBloom.style.transform = `translate3d(${sunX.toFixed(1)}px, ${sunY.toFixed(1)}px, 0) scale(${sunScale.toFixed(3)})`;
      sunCore.style.transform = `translate3d(${(sunX * 0.6).toFixed(1)}px, ${(sunY * 0.6).toFixed(1)}px, 0)`;
    }

    for (let i = 0; i < cloudElements.length; i++) {
      const { el, cfg } = cloudElements[i];
      const scrollDx = (cfg.travelX / 100) * viewportWidth * currentProgress;
      const scrollDy = (cfg.travelY / 100) * viewportHeight * currentProgress;
      const scale = cfg.scaleStart + (cfg.scaleEnd - cfg.scaleStart) * currentProgress;

      el.style.transform = `translate3d(${scrollDx.toFixed(1)}px, ${scrollDy.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
    }
  }

  function renderFrame() {
    const diff = targetProgress - currentProgress;
    currentProgress += diff * 0.1;

    // Otomatis berhenti saat scroll selesai (baik di Desktop maupun HP) -> 0% CPU saat idle
    if (Math.abs(diff) < 0.0005) {
      currentProgress = targetProgress;
      applyTransforms();
      isAnimating = false;
      return;
    }

    applyTransforms();
    requestAnimationFrame(renderFrame);
  }

  function startAnimationLoop() {
    if (!isAnimating) {
      isAnimating = true;
      requestAnimationFrame(renderFrame);
    }
  }

  function computeScrollProgress() {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scrollTop = window.scrollY || window.pageYOffset || 0;
    targetProgress = Math.min(1, Math.max(0, scrollTop / maxScroll));
    startAnimationLoop();
  }

  window.addEventListener('scroll', computeScrollProgress, { passive: true });
  window.addEventListener('resize', () => {
    updateViewportMetrics();
    computeScrollProgress();
  }, { passive: true });

  window.addEventListener('load', () => {
    updateViewportMetrics();
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scrollTop = window.scrollY || window.pageYOffset || 0;
    targetProgress = Math.min(1, Math.max(0, scrollTop / maxScroll));
    currentProgress = targetProgress;
    applyTransforms();
  });
})();