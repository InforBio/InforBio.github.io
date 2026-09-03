document.addEventListener("DOMContentLoaded", function () {

  const sections = document.querySelectorAll(".story-section");
  const visuals = document.querySelectorAll(".story-visual-item");

  if (!sections.length || !visuals.length) {
    console.log("Story elements not found");
    return;
  }

  console.log(
    "Story initialized:",
    sections.length,
    "sections /",
    visuals.length,
    "visuals"
  );


  function showVisual(name) {

    console.log("Showing visual:", name);

    visuals.forEach(function (visual) {
      visual.classList.remove("active");
    });

    const target = document.querySelector(
      ".story-visual-item.visual-" + name
    );

    if (target) {
      target.classList.add("active");
    }

  }


  /*
   * Initial state
   */

  showVisual("about");


  /*
   * Detect which text section is currently
   * closest to the center of the viewport.
   */

  function updateVisual() {

    const viewportCenter = window.innerHeight / 2;

    let closestSection = null;
    let closestDistance = Infinity;

    sections.forEach(function (section) {

      const rect = section.getBoundingClientRect();

      const sectionCenter =
        rect.top + rect.height / 2;

      const distance =
        Math.abs(sectionCenter - viewportCenter);

      if (distance < closestDistance) {

        closestDistance = distance;
        closestSection = section;

      }

    });


    if (closestSection) {

      const visualName =
        closestSection.dataset.visual;

      showVisual(visualName);

    }

  }


  /*
   * Update while scrolling
   */

  let ticking = false;

  window.addEventListener("scroll", function () {

    if (!ticking) {

      window.requestAnimationFrame(function () {

        updateVisual();

        ticking = false;

      });

      ticking = true;

    }

  });


  /*
   * Also update on resize
   */

  window.addEventListener("resize", updateVisual);


  /*
   * Initial update
   */

  updateVisual();

});