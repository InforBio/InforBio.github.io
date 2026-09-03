/* =========================================================
   INFORBIO — DNA PARTICLE ANIMATION
   ========================================================= */

   (function () {

    const canvas = document.getElementById("dnaCanvas");
  
    if (!canvas) return;
  
    const ctx = canvas.getContext("2d");
  
    let width;
    let height;
    let dpr;
  
    let particles = [];
    let trails = [];
    let ambientParticles = [];
  
    let mouse = {
      x: 0,
      y: 0,
      active: false
    };
  
  
    /* =======================================================
       SETTINGS
       ======================================================= */
  
    const CONFIG = {
  
      particleCount: 380,
  
      ambientCount: 90,
  
      trailCount: 45,
  
      helixTurns: 2.5,
  
      helixRadius: 105,
  
      helixHeight: 470,
  
      particleSize: 1.8,
  
      rotationSpeed: 0.0007,
  
      mouseInfluence: 80
  
    };
  
  
    /* =======================================================
       RESIZE
       ======================================================= */
  
    function resize() {
  
      const rect =
        canvas.getBoundingClientRect();
  
      dpr =
        Math.min(window.devicePixelRatio || 1, 2);
  
      width =
        rect.width;
  
      height =
        rect.height;
  
      canvas.width =
        width * dpr;
  
      canvas.height =
        height * dpr;
  
      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );
  
      createParticles();
  
    }
  
  
    /* =======================================================
       DNA PARTICLES
       ======================================================= */
  
    function createParticles() {
  
      particles = [];
  
      for (
        let i = 0;
        i < CONFIG.particleCount;
        i++
      ) {
  
        const t =
          Math.random();
  
        const strand =
          Math.random() < 0.5
            ? 0
            : 1;
  
        const angle =
          t *
          Math.PI *
          2 *
          CONFIG.helixTurns;
  
        const radius =
          CONFIG.helixRadius *
          (0.82 + Math.random() * 0.18);
  
        particles.push({
  
          t,
  
          strand,
  
          angle,
  
          radius,
  
          offset:
            (Math.random() - 0.5) * 10,
  
          size:
            0.7 +
            Math.random() * 2.2,
  
          alpha:
            0.35 +
            Math.random() * 0.65,
  
          speed:
            0.0003 +
            Math.random() * 0.0005,
  
          phase:
            Math.random() *
            Math.PI * 2
  
        });
  
      }
  
  
      /* Ambient particles */
  
      ambientParticles = [];
  
      for (
        let i = 0;
        i < CONFIG.ambientCount;
        i++
      ) {
  
        ambientParticles.push({
  
          x:
            Math.random() * width,
  
          y:
            Math.random() * height,
  
          size:
            0.5 +
            Math.random() * 2,
  
          alpha:
            0.1 +
            Math.random() * 0.35,
  
          speed:
            0.1 +
            Math.random() * 0.3,
  
          phase:
            Math.random() *
            Math.PI * 2
  
        });
  
      }
  
  
      /* Data trails */
  
      trails = [];
  
      for (
        let i = 0;
        i < CONFIG.trailCount;
        i++
      ) {
  
        trails.push({
  
          y:
            Math.random() * height,
  
          x:
            Math.random() * width,
  
          length:
            40 +
            Math.random() * 160,
  
          speed:
            0.3 +
            Math.random() * 1.2,
  
          alpha:
            0.08 +
            Math.random() * 0.22,
  
          size:
            0.5 +
            Math.random() * 1.3
  
        });
  
      }
  
    }
  
  
    /* =======================================================
       MOUSE
       ======================================================= */
  
    canvas.addEventListener(
      "pointermove",
      function (event) {
  
        const rect =
          canvas.getBoundingClientRect();
  
        mouse.x =
          event.clientX -
          rect.left;
  
        mouse.y =
          event.clientY -
          rect.top;
  
        mouse.active = true;
  
      }
    );
  
  
    canvas.addEventListener(
      "pointerleave",
      function () {
  
        mouse.active = false;
  
      }
    );
  
  
    /* =======================================================
       DRAW AMBIENT PARTICLES
       ======================================================= */
  
    function drawAmbient(time) {
  
      ambientParticles.forEach(p => {
  
        const y =
          p.y +
          Math.sin(
            time * 0.001 * p.speed +
            p.phase
          ) * 8;
  
        ctx.beginPath();
  
        ctx.arc(
          p.x,
          y,
          p.size,
          0,
          Math.PI * 2
        );
  
        ctx.fillStyle =
          `rgba(41,155,179,${p.alpha})`;
  
        ctx.fill();
  
      });
  
    }
  
  
    /* =======================================================
       DRAW DATA TRAILS
       ======================================================= */
  
    function drawTrails() {
  
      trails.forEach(t => {
  
        t.x += t.speed;
  
        if (t.x > width + t.length) {
  
          t.x = -t.length;
  
          t.y =
            Math.random() * height;
  
        }
  
  
        const gradient =
          ctx.createLinearGradient(
            t.x - t.length,
            0,
            t.x,
            0
          );
  
        gradient.addColorStop(
          0,
          "rgba(41,155,179,0)"
        );
  
        gradient.addColorStop(
          0.7,
          `rgba(41,155,179,${t.alpha})`
        );
  
        gradient.addColorStop(
          1,
          `rgba(120,220,235,${t.alpha * 1.5})`
        );
  
  
        ctx.beginPath();
  
        ctx.moveTo(
          t.x - t.length,
          t.y
        );
  
        ctx.lineTo(
          t.x,
          t.y
        );
  
        ctx.strokeStyle =
          gradient;
  
        ctx.lineWidth =
          t.size;
  
        ctx.stroke();
  
      });
  
    }
  
  
    /* =======================================================
       DNA POSITION
       ======================================================= */
  
    function dnaPosition(p, time) {
  
      const centerX =
        width * 0.55;
  
      const centerY =
        height * 0.5;
  
      const vertical =
        (p.t - 0.5) *
        CONFIG.helixHeight;
  
  
      const angle =
        p.angle +
        time *
        CONFIG.rotationSpeed *
        1000 *
        p.speed *
        100;
  
  
      const strandOffset =
        p.strand === 0
          ? 0
          : Math.PI;
  
  
      const finalAngle =
        angle +
        strandOffset;
  
  
      const depth =
        Math.sin(finalAngle);
  
  
      const x =
        centerX +
        Math.cos(finalAngle) *
        p.radius *
        (0.65 + depth * 0.35);
  
  
      const y =
        centerY +
        vertical;
  
  
      return {
  
        x,
        y,
        depth
  
      };
  
    }
  
  
    /* =======================================================
       DRAW DNA CONNECTIONS
       ======================================================= */
  
    function drawConnections(time) {
  
      const steps = 85;
  
      for (
        let i = 0;
        i < steps;
        i++
      ) {
  
        const t =
          i / (steps - 1);
  
        const angle =
          t *
          Math.PI *
          2 *
          CONFIG.helixTurns +
          time *
          0.0005;
  
  
        const y =
          height * 0.5 +
          (t - 0.5) *
          CONFIG.helixHeight;
  
  
        const x1 =
          width * 0.55 +
          Math.cos(angle) *
          CONFIG.helixRadius *
          0.65;
  
  
        const x2 =
          width * 0.55 +
          Math.cos(angle + Math.PI) *
          CONFIG.helixRadius *
          0.65;
  
  
        ctx.beginPath();
  
        ctx.moveTo(x1, y);
  
        ctx.lineTo(x2, y);
  
        ctx.strokeStyle =
          `rgba(41,155,179,${0.04 + Math.abs(Math.sin(angle)) * 0.08})`;
  
        ctx.lineWidth = 1;
  
        ctx.stroke();
  
      }
  
    }
  
  
    /* =======================================================
       DRAW DNA
       ======================================================= */
  
    function drawDNA(time) {
  
      particles.forEach(p => {
  
        const pos =
          dnaPosition(p, time);
  
  
        /* Mouse interaction */
  
        let mx = 0;
        let my = 0;
  
        if (mouse.active) {
  
          const dx =
            pos.x - mouse.x;
  
          const dy =
            pos.y - mouse.y;
  
          const distance =
            Math.sqrt(
              dx * dx +
              dy * dy
            );
  
          if (
            distance <
            CONFIG.mouseInfluence
          ) {
  
            const force =
              (1 -
                distance /
                CONFIG.mouseInfluence) *
              22;
  
            mx =
              (dx / (distance || 1)) *
              force;
  
            my =
              (dy / (distance || 1)) *
              force;
  
          }
  
        }
  
  
        const x =
          pos.x + mx;
  
        const y =
          pos.y + my;
  
  
        /* Depth */
  
        const depth =
          (pos.depth + 1) / 2;
  
        const size =
          p.size *
          (0.65 + depth * 0.8);
  
        const alpha =
          p.alpha *
          (0.35 + depth * 0.65);
  
  
        ctx.beginPath();
  
        ctx.arc(
          x,
          y,
          size,
          0,
          Math.PI * 2
        );
  
  
        ctx.fillStyle =
          `rgba(
            ${41 + depth * 80},
            ${155 + depth * 65},
            ${179 + depth * 50},
            ${alpha}
          )`;
  
  
        ctx.shadowBlur =
          depth > 0.6
            ? 10
            : 3;
  
        ctx.shadowColor =
          "rgba(41,190,215,0.6)";
  
        ctx.fill();
  
        ctx.shadowBlur = 0;
  
      });
  
    }
  
  
    /* =======================================================
       DNA MOTION TRAILS
       ======================================================= */
  
    function drawDNAStreams(time) {
  
      for (
        let i = 0;
        i < 22;
        i++
      ) {
  
        const t =
          (i / 22 +
            time * 0.00003) %
          1;
  
  
        const y =
          height * 0.5 +
          (t - 0.5) *
          CONFIG.helixHeight;
  
  
        const angle =
          t *
          Math.PI *
          2 *
          CONFIG.helixTurns;
  
  
        const x =
          width * 0.55 +
          Math.cos(angle) *
          CONFIG.helixRadius;
  
  
        const length =
          50 +
          Math.sin(
            i * 2.4
          ) *
          35;
  
  
        const gradient =
          ctx.createLinearGradient(
            x - length,
            y,
            x,
            y
          );
  
  
        gradient.addColorStop(
          0,
          "rgba(41,155,179,0)"
        );
  
        gradient.addColorStop(
          1,
          "rgba(70,210,230,0.45)"
        );
  
  
        ctx.beginPath();
  
        ctx.moveTo(
          x - length,
          y
        );
  
        ctx.lineTo(
          x,
          y
        );
  
        ctx.strokeStyle =
          gradient;
  
        ctx.lineWidth =
          1;
  
        ctx.stroke();
  
      }
  
    }
  
  
    /* =======================================================
       MAIN LOOP
       ======================================================= */
  
    function animate(time) {
  
      ctx.clearRect(
        0,
        0,
        width,
        height
      );
  
  
      drawAmbient(time);
  
      drawTrails();
  
      drawConnections(time);
  
      drawDNAStreams(time);
  
      drawDNA(time);
  
  
      requestAnimationFrame(
        animate
      );
  
    }
  
  
    /* =======================================================
       START
       ======================================================= */
  
    window.addEventListener(
      "resize",
      resize
    );
  
    resize();
  
    requestAnimationFrame(
      animate
    );
  
  })();