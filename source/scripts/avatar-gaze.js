/**
 * Interactive Gaze Tracking Avatar Engine
 * Dynamically switches the Notion-style pixel art avatar image based on pointer coordinates
 */

(function () {
  let avatarImg;

  const gazeMap = {
    top_left: "./source/img/avatar/avatar_top_left.png",
    top_center: "./source/img/avatar/avatar_top_center.png",
    top_right: "./source/img/avatar/avatar_top_right.png",
    center_left: "./source/img/avatar/avatar_center_left.png",
    center_center: "./source/img/avatar/avatar_center.png",
    center_right: "./source/img/avatar/avatar_center_right.png",
    bottom_left: "./source/img/avatar/avatar_bottom_left.png",
    bottom_center: "./source/img/avatar/avatar_bottom_center.png",
    bottom_right: "./source/img/avatar/avatar_bottom_right.png",
  };

  // Preload all 9 gaze images for instantaneous zero-latency switching
  const preloadedImages = {};
  Object.keys(gazeMap).forEach((key) => {
    const img = new Image();
    img.src = gazeMap[key];
    preloadedImages[key] = img;
  });

  function init() {
    avatarImg = document.getElementById("interactiveAvatar");
    if (!avatarImg) return;

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
  }

  function updateGaze(clientX, clientY) {
    if (!avatarImg) return;

    const rect = avatarImg.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    const thresholdX = window.innerWidth * 0.12;
    const thresholdY = window.innerHeight * 0.12;

    let dirX = "center";
    if (deltaX < -thresholdX) dirX = "left";
    else if (deltaX > thresholdX) dirX = "right";

    let dirY = "center";
    if (deltaY < -thresholdY) dirY = "top";
    else if (deltaY > thresholdY) dirY = "bottom";

    const key = `${dirY}_${dirX}`;
    const newSrc = gazeMap[key] || gazeMap["center_center"];

    if (avatarImg.src !== newSrc && avatarImg.getAttribute("src") !== newSrc) {
      avatarImg.src = newSrc;
    }
  }

  function onMouseMove(e) {
    updateGaze(e.clientX, e.clientY);
  }

  function onTouchMove(e) {
    if (e.touches && e.touches[0]) {
      updateGaze(e.touches[0].clientX, e.touches[0].clientY);
    }
  }

  window.addEventListener("DOMContentLoaded", init);
})();
