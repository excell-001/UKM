/**
     * Pure Scroll-Driven Volumetric Cloud Parallax Engine
     * Renders organic, multi-layered cumulus and wispy high-altitude clouds
     * that glide smoothly across a vibrant cerulean sky when scrolling.
     */
    (function () {
      const stage = document.getElementById('cloud-stage');
      const sunBloom = document.getElementById('sun-bloom');
      const sunCore = document.getElementById('sun-core');

      if (!stage) return;

      /**
       * Cloud definitions across multiple atmospheric depth planes:
       * - depth: 0.15 (far background) to 1.0 (close foreground)
       * - baseX / baseY: initial viewport percentage coordinates
       * - travelX / travelY: total scroll displacement in vw / vh units
       * - scaleStart / scaleEnd: subtle depth perspective shift during scroll
       * - driftSpeed: gentle ambient micro-breeze oscillation even when idle
       */
      const cloudConfigs = [
        // 1. High-altitude delicate wisp (inspired by the small upper-right cloud in reference)
        {
          id: 'wisp-upper-right',
          type: 'wisp',
          width: '26vw',
          minWidth: 220,
          maxWidth: 420,
          aspect: 0.72,
          baseX: 54,
          baseY: 22,
          travelX: -28,
          travelY: -12,
          scaleStart: 0.92,
          scaleEnd: 1.06,
          opacity: 0.85,
          filter: 'url(#cirrus-wisp)',
          seed: 101,
          puffs: [
            { cx: 52, cy: 36, rx: 14, ry: 18, fill: 'url(#cloud-grad-wisp)' },
            { cx: 46, cy: 48, rx: 18, ry: 14, fill: 'url(#cloud-grad-wisp)' },
            { cx: 58, cy: 50, rx: 15, ry: 13, fill: 'url(#cloud-grad-wisp)' },
            { cx: 50, cy: 64, rx: 11, ry: 14, fill: 'url(#cloud-grad-wisp)' },
            { cx: 36, cy: 26, rx: 9, ry: 7, fill: 'url(#cloud-grad-wisp)' }
          ]
        },

        // 2. Distant soft horizon cloud bank (left)
        {
          id: 'distant-left',
          type: 'mid',
          width: '48vw',
          minWidth: 340,
          maxWidth: 760,
          aspect: 0.52,
          baseX: -12,
          baseY: 14,
          travelX: 38,
          travelY: -8,
          scaleStart: 0.85,
          scaleEnd: 0.96,
          opacity: 0.62,
          filter: 'url(#cumulus-fluff-mid)',
          seed: 202,
          puffs: [
            { cx: 28, cy: 58, rx: 22, ry: 14, fill: 'url(#cloud-grad-soft)' },
            { cx: 46, cy: 48, rx: 26, ry: 19, fill: 'url(#cloud-grad-soft)' },
            { cx: 66, cy: 54, rx: 24, ry: 16, fill: 'url(#cloud-grad-soft)' },
            { cx: 50, cy: 62, rx: 32, ry: 13, fill: 'url(#cloud-shadow-core)' }
          ]
        },

        // 3. Hero Cumulus Cloud (rich, dense, sunlit top + soft blue-grey underside like the main reference cloud)
        {
          id: 'hero-cumulus-main',
          type: 'heavy',
          width: '68vw',
          minWidth: 440,
          maxWidth: 1080,
          aspect: 0.64,
          baseX: 14,
          baseY: 44,
          travelX: -48,
          travelY: -26,
          scaleStart: 0.96,
          scaleEnd: 1.18,
          opacity: 0.98,
          filter: 'url(#cumulus-fluff-heavy)',
          seed: 303,
          puffs: [
            // Base body & soft blue-grey shadowed belly
            { cx: 50, cy: 62, rx: 38, ry: 18, fill: 'url(#cloud-grad-bright)' },
            { cx: 24, cy: 64, rx: 19, ry: 13, fill: 'url(#cloud-grad-bright)' },
            { cx: 76, cy: 63, rx: 20, ry: 14, fill: 'url(#cloud-grad-bright)' },
            { cx: 48, cy: 67, rx: 34, ry: 13, fill: 'url(#cloud-shadow-core)' },
            // Towering sunlit cumulus domes
            { cx: 50, cy: 36, rx: 22, ry: 21, fill: 'url(#cloud-grad-bright)' },
            { cx: 36, cy: 46, rx: 20, ry: 17, fill: 'url(#cloud-grad-bright)' },
            { cx: 64, cy: 45, rx: 21, ry: 18, fill: 'url(#cloud-grad-bright)' },
            { cx: 30, cy: 34, rx: 12, ry: 11, fill: 'url(#cloud-grad-soft)' },
            // Crisp sunlit highlights on upper-right ridges facing the sun
            { cx: 54, cy: 31, rx: 16, ry: 14, fill: 'url(#cloud-highlight-puff)' },
            { cx: 67, cy: 41, rx: 15, ry: 13, fill: 'url(#cloud-highlight-puff)' },
            { cx: 39, cy: 42, rx: 14, ry: 12, fill: 'url(#cloud-highlight-puff)' }
          ]
        },

        // 4. Mid-ground drifting cumulus entering from the right during scroll
        {
          id: 'mid-right-drifter',
          type: 'heavy',
          width: '56vw',
          minWidth: 380,
          maxWidth: 880,
          aspect: 0.58,
          baseX: 68,
          baseY: 58,
          travelX: -76,
          travelY: -22,
          scaleStart: 0.90,
          scaleEnd: 1.12,
          opacity: 0.92,
          filter: 'url(#cumulus-fluff-heavy)',
          seed: 404,
          puffs: [
            { cx: 48, cy: 60, rx: 34, ry: 16, fill: 'url(#cloud-grad-bright)' },
            { cx: 28, cy: 62, rx: 18, ry: 12, fill: 'url(#cloud-grad-bright)' },
            { cx: 70, cy: 61, rx: 19, ry: 13, fill: 'url(#cloud-grad-bright)' },
            { cx: 48, cy: 65, rx: 30, ry: 11, fill: 'url(#cloud-shadow-core)' },
            { cx: 44, cy: 42, rx: 20, ry: 17, fill: 'url(#cloud-grad-bright)' },
            { cx: 60, cy: 46, rx: 18, ry: 15, fill: 'url(#cloud-grad-bright)' },
            { cx: 48, cy: 37, rx: 15, ry: 12, fill: 'url(#cloud-highlight-puff)' }
          ]
        },

        // 5. Lower-left soft scatter cumulus (echoing the bottom cloud wisps in the photo)
        {
          id: 'lower-left-scatter',
          type: 'mid',
          width: '52vw',
          minWidth: 340,
          maxWidth: 820,
          aspect: 0.50,
          baseX: -16,
          baseY: 74,
          travelX: 64,
          travelY: -34,
          scaleStart: 0.94,
          scaleEnd: 1.15,
          opacity: 0.84,
          filter: 'url(#cumulus-fluff-mid)',
          seed: 505,
          puffs: [
            { cx: 34, cy: 55, rx: 22, ry: 14, fill: 'url(#cloud-grad-soft)' },
            { cx: 54, cy: 50, rx: 25, ry: 16, fill: 'url(#cloud-grad-bright)' },
            { cx: 72, cy: 58, rx: 19, ry: 12, fill: 'url(#cloud-grad-soft)' },
            { cx: 50, cy: 60, rx: 28, ry: 11, fill: 'url(#cloud-shadow-core)' }
          ]
        },

        // 6. High-altitude upper-left gossamer veil
        {
          id: 'upper-left-veil',
          type: 'wisp',
          width: '44vw',
          minWidth: 300,
          maxWidth: 680,
          aspect: 0.48,
          baseX: -8,
          baseY: 6,
          travelX: 44,
          travelY: -10,
          scaleStart: 0.88,
          scaleEnd: 1.02,
          opacity: 0.55,
          filter: 'url(#cirrus-wisp)',
          seed: 606,
          puffs: [
            { cx: 38, cy: 48, rx: 26, ry: 12, fill: 'url(#cloud-grad-wisp)' },
            { cx: 58, cy: 42, rx: 24, ry: 14, fill: 'url(#cloud-grad-wisp)' },
            { cx: 74, cy: 52, rx: 18, ry: 10, fill: 'url(#cloud-grad-wisp)' }
          ]
        },

        // 7. Foreground large sweeping cumulus (moves fastest across the lower sky on deep scroll)
        {
          id: 'foreground-sweeper',
          type: 'heavy',
          width: '78vw',
          minWidth: 500,
          maxWidth: 1240,
          aspect: 0.56,
          baseX: 36,
          baseY: 84,
          travelX: -95,
          travelY: -56,
          scaleStart: 1.0,
          scaleEnd: 1.26,
          opacity: 0.95,
          filter: 'url(#cumulus-fluff-heavy)',
          seed: 707,
          puffs: [
            { cx: 50, cy: 62, rx: 40, ry: 17, fill: 'url(#cloud-grad-bright)' },
            { cx: 22, cy: 64, rx: 20, ry: 13, fill: 'url(#cloud-grad-bright)' },
            { cx: 78, cy: 63, rx: 21, ry: 13, fill: 'url(#cloud-grad-bright)' },
            { cx: 50, cy: 68, rx: 36, ry: 12, fill: 'url(#cloud-shadow-core)' },
            { cx: 46, cy: 40, rx: 24, ry: 19, fill: 'url(#cloud-grad-bright)' },
            { cx: 64, cy: 46, rx: 21, ry: 16, fill: 'url(#cloud-grad-bright)' },
            { cx: 32, cy: 48, rx: 19, ry: 15, fill: 'url(#cloud-grad-bright)' },
            { cx: 52, cy: 35, rx: 17, ry: 13, fill: 'url(#cloud-highlight-puff)' },
            { cx: 67, cy: 42, rx: 15, ry: 12, fill: 'url(#cloud-highlight-puff)' }
          ]
        },

        // 8. Second wave upper-mid cumulus entering smoothly from the left
        {
          id: 'second-wave-left',
          type: 'heavy',
          width: '60vw',
          minWidth: 400,
          maxWidth: 940,
          aspect: 0.60,
          baseX: -48,
          baseY: 32,
          travelX: 98,
          travelY: -18,
          scaleStart: 0.88,
          scaleEnd: 1.10,
          opacity: 0.90,
          filter: 'url(#cumulus-fluff-heavy)',
          seed: 808,
          puffs: [
            { cx: 48, cy: 60, rx: 35, ry: 16, fill: 'url(#cloud-grad-bright)' },
            { cx: 26, cy: 62, rx: 18, ry: 12, fill: 'url(#cloud-grad-bright)' },
            { cx: 72, cy: 61, rx: 19, ry: 13, fill: 'url(#cloud-grad-bright)' },
            { cx: 48, cy: 65, rx: 32, ry: 11, fill: 'url(#cloud-shadow-core)' },
            { cx: 52, cy: 40, rx: 21, ry: 18, fill: 'url(#cloud-grad-bright)' },
            { cx: 36, cy: 46, rx: 18, ry: 15, fill: 'url(#cloud-grad-bright)' },
            { cx: 56, cy: 35, rx: 15, ry: 12, fill: 'url(#cloud-highlight-puff)' }
          ]
        }
      ];

      const SVG_NS = 'http://www.w3.org/2000/svg';
      const cloudElements = [];

      // Build DOM + SVG volumetric cloud clusters
      cloudConfigs.forEach((cfg, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'cloud-cluster';
        wrapper.style.width = `clamp(${cfg.minWidth}px, ${cfg.width}, ${cfg.maxWidth}px)`;
        wrapper.style.left = `${cfg.baseX}vw`;
        wrapper.style.top = `${cfg.baseY}vh`;
        wrapper.style.opacity = cfg.opacity;

        const svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

        const group = document.createElementNS(SVG_NS, 'g');
        group.setAttribute('filter', cfg.filter);

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
        wrapper.appendChild(svg);
        stage.appendChild(wrapper);

        cloudElements.push({
          el: wrapper,
          cfg,
          phaseOffset: index * 1.37
        });
      });

      // Smooth scroll interpolation state (Lerp)
      let targetProgress = 0;
      let currentProgress = 0;
      let viewportWidth = window.innerWidth;
      let viewportHeight = window.innerHeight;

      function updateViewportMetrics() {
        viewportWidth = window.innerWidth;
        viewportHeight = window.innerHeight;
      }

      function computeScrollProgress() {
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const scrollTop = window.scrollY || window.pageYOffset || 0;
        targetProgress = Math.min(1, Math.max(0, scrollTop / maxScroll));
      }

      window.addEventListener('scroll', computeScrollProgress, { passive: true });
      window.addEventListener('resize', () => {
        updateViewportMetrics();
        computeScrollProgress();
      }, { passive: true });

      // Animation loop combining smooth scroll parallax with subtle atmospheric breeze drift
      function animateSky(timestamp) {
        const timeSec = timestamp * 0.001;

        // Silky exponential lerp toward target scroll position
        currentProgress += (targetProgress - currentProgress) * 0.065;

        // Subtle shift in ambient sunlight glow as the viewer travels through the sky
        if (sunBloom && sunCore) {
          const sunX = -currentProgress * viewportWidth * 0.06;
          const sunY = -currentProgress * viewportHeight * 0.04;
          const sunScale = 1 + currentProgress * 0.08;
          sunBloom.style.transform = `translate3d(${sunX.toFixed(2)}px, ${sunY.toFixed(2)}px, 0) scale(${sunScale.toFixed(4)})`;
          sunCore.style.transform = `translate3d(${(sunX * 0.6).toFixed(2)}px, ${(sunY * 0.6).toFixed(2)}px, 0)`;
        }

        // Update each volumetric cloud cluster
        for (let i = 0; i < cloudElements.length; i++) {
          const item = cloudElements[i];
          const { el, cfg, phaseOffset } = item;

          // Scroll-driven parallax displacement in pixels
          const scrollDx = (cfg.travelX / 100) * viewportWidth * currentProgress;
          const scrollDy = (cfg.travelY / 100) * viewportHeight * currentProgress;

          // Gentle natural atmospheric breeze oscillation (very subtle so scroll remains the primary driver)
          const breezeX = Math.sin(timeSec * 0.22 + phaseOffset) * 8;
          const breezeY = Math.cos(timeSec * 0.18 + phaseOffset) * 4;

          const totalX = scrollDx + breezeX;
          const totalY = scrollDy + breezeY;

          // Smooth depth scale interpolation
          const scale = cfg.scaleStart + (cfg.scaleEnd - cfg.scaleStart) * currentProgress;

          el.style.transform = `translate3d(${totalX.toFixed(2)}px, ${totalY.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
        }

        requestAnimationFrame(animateSky);
      }

      window.onload = function () {
        updateViewportMetrics();
        computeScrollProgress();
        // Snap initial position immediately on load so there's no initial jump
        currentProgress = targetProgress;
        requestAnimationFrame(animateSky);
      };
    })();
