console.log("INFORBIO NETWORK JS LOADED");

let inforBioNetworkInitialized = false;

function initNetwork() {

  // Prevent Quarto / preview from initializing twice
  if (inforBioNetworkInitialized) {
    console.log("Network already initialized");
    return;
  }

  const hero =
    document.querySelector(".landing-hero");

  const nodes =
    [...document.querySelectorAll(
      ".landing-hero .network-node"
    )];

  const svg =
    document.querySelector(
      ".landing-hero .network-lines"
    );


  if (!hero || !nodes.length || !svg) {

    console.log(
      "Network elements not found"
    );

    return;

  }


  inforBioNetworkInitialized = true;


  console.log(
    "Network nodes:",
    nodes.length
  );


  // ==========================================
  // FIND INFORBIO
  // ==========================================

  const mainIndex =
    nodes.findIndex(
      node =>
        node.classList.contains(
          "node-main"
        )
    );


  if (mainIndex === -1) {

    console.error(
      "InforBio node not found"
    );

    return;

  }


  // ==========================================
  // SETTINGS
  // ==========================================

  const MIN_SPEED = 0.004;
  const MAX_SPEED = 0.007;

  const FLOAT_AMOUNT = 3;


  // ==========================================
  // NODE STATES
  // ==========================================

  const states =
    nodes.map(
      (node, index) => {

        const angle =
          Math.random() *
          Math.PI *
          2;

        const speed =
          MIN_SPEED +
          Math.random() *
          (
            MAX_SPEED -
            MIN_SPEED
          );


        return {

          x:
            index === mainIndex
              ? 50
              : 15 +
                Math.random() * 70,

          y:
            index === mainIndex
              ? 50
              : 15 +
                Math.random() * 70,

          vx:
            Math.cos(angle) *
            speed,

          vy:
            Math.sin(angle) *
            speed,

          phase:
            Math.random() *
            Math.PI *
            2,

          frequency:
            0.00007 +
            Math.random() *
            0.00003

        };

      }
    );


  // ==========================================
  // SVG
  // ==========================================

  svg.innerHTML = "";

  svg.setAttribute(
    "preserveAspectRatio",
    "none"
  );


  // ==========================================
  // CREATE EXACTLY ONE LINE PER NODE
  // ==========================================

  const lines =
    nodes.map(
      (node, index) => {

        if (index === mainIndex) {
          return null;
        }


        const line =
          document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
          );


        line.classList.add(
          "network-line"
        );


        svg.appendChild(line);


        return line;

      }
    );


  // ==========================================
  // EDGE INTERSECTION
  // ==========================================

  function getEdgePoint(
    centerX,
    centerY,
    width,
    height,
    dx,
    dy
  ) {

    const halfWidth =
      width / 2;

    const halfHeight =
      height / 2;


    const scaleX =
      halfWidth /
      Math.max(
        Math.abs(dx),
        0.0001
      );


    const scaleY =
      halfHeight /
      Math.max(
        Math.abs(dy),
        0.0001
      );


    const scale =
      Math.min(
        scaleX,
        scaleY
      );


    return {

      x:
        centerX +
        dx *
        scale,

      y:
        centerY +
        dy *
        scale

    };

  }


  // ==========================================
  // ANIMATION
  // ==========================================

  let lastTime =
    performance.now();


  function animate(time) {

    const delta =
      Math.min(
        (time - lastTime) /
        16.67,
        2
      );

    lastTime =
      time;


    const width =
      hero.clientWidth;

    const height =
      hero.clientHeight;


    // ========================================
    // MOVE NODES
    // ========================================

    states.forEach(
      (state, i) => {

        const node =
          nodes[i];


        // ------------------------------------
        // CENTER NODE
        // ------------------------------------

        if (i === mainIndex) {

          state.x =
            50 +
            Math.sin(
              time * 0.00010 +
              state.phase
            ) *
            0.3;

          state.y =
            50 +
            Math.cos(
              time * 0.00009 +
              state.phase
            ) *
            0.3;

        }


        // ------------------------------------
        // OUTER NODES
        // ------------------------------------

        else {

          state.x +=
            state.vx *
            delta;

          state.y +=
            state.vy *
            delta;


          if (state.x < 7) {

            state.x = 7;

            state.vx =
              Math.abs(
                state.vx
              );

          }


          if (state.x > 93) {

            state.x = 93;

            state.vx =
              -Math.abs(
                state.vx
              );

          }


          if (state.y < 10) {

            state.y = 10;

            state.vy =
              Math.abs(
                state.vy
              );

          }


          if (state.y > 90) {

            state.y = 90;

            state.vy =
              -Math.abs(
                state.vy
              );

          }

        }


        // ------------------------------------
        // FLOAT
        // ------------------------------------

        const floatX =
          Math.sin(
            time *
            state.frequency +
            state.phase
          ) *
          FLOAT_AMOUNT;


        const floatY =
          Math.cos(
            time *
            state.frequency *
            0.8 +
            state.phase
          ) *
          FLOAT_AMOUNT;


        // ------------------------------------
        // POSITION
        // ------------------------------------

        const x =
          state.x / 100 *
          width +
          floatX;


        const y =
          state.y / 100 *
          height +
          floatY;


        node.style.left =
          "0px";

        node.style.top =
          "0px";

        node.style.transform =
          `translate3d(
            ${x}px,
            ${y}px,
            0
          )`;

      }
    );


    // ========================================
    // SVG SIZE
    // ========================================

    svg.setAttribute(
      "viewBox",
      `0 0 ${width} ${height}`
    );


    // ========================================
    // GET ACTUAL NODE RECTANGLES
    // ========================================

    const heroRect =
      hero.getBoundingClientRect();


    const positions =
      nodes.map(
        node => {

          const rect =
            node.getBoundingClientRect();


          return {

            x:
              rect.left -
              heroRect.left +
              rect.width / 2,

            y:
              rect.top -
              heroRect.top +
              rect.height / 2,

            width:
              rect.width,

            height:
              rect.height

          };

        }
      );


    const main =
      positions[mainIndex];


    // ========================================
    // ONE EDGE → INFORBIO
    // ========================================

    nodes.forEach(
      (node, index) => {

        if (index === mainIndex) {
          return;
        }


        const target =
          positions[index];


        const line =
          lines[index];


        if (!line || !target) {
          return;
        }


        // ------------------------------------
        // Direction
        // ------------------------------------

        const dx =
          target.x -
          main.x;

        const dy =
          target.y -
          main.y;


        const distance =
          Math.sqrt(
            dx * dx +
            dy * dy
          );


        if (distance < 1) {
          line.style.opacity = "0";
          return;
        }


        const dirX =
          dx / distance;

        const dirY =
          dy / distance;


        // ------------------------------------
        // InforBio edge
        // ------------------------------------

        const start =
          getEdgePoint(
            main.x,
            main.y,
            main.width,
            main.height,
            dirX,
            dirY
          );


        // ------------------------------------
        // Target edge
        // ------------------------------------

        const end =
          getEdgePoint(
            target.x,
            target.y,
            target.width,
            target.height,
            -dirX,
            -dirY
          );


        // ------------------------------------
        // Draw
        // ------------------------------------

        line.setAttribute(
          "x1",
          start.x
        );

        line.setAttribute(
          "y1",
          start.y
        );

        line.setAttribute(
          "x2",
          end.x
        );

        line.setAttribute(
          "y2",
          end.y
        );


        line.style.opacity =
          "0.65";

      }
    );


    requestAnimationFrame(
      animate
    );

  }


  requestAnimationFrame(
    animate
  );

}


// ============================================
// START
// ============================================

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initNetwork
  );

} else {

  initNetwork();

}