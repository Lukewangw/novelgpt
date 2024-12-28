document.addEventListener("DOMContentLoaded", () => {
  const background = document.createElement("div");
  background.className = "matrix-bg";
  document.body.prepend(background);

  const characters =
    `天地玄黄宇宙洪荒日月盈昃辰宿列张寒来暑往秋收冬藏闰余成岁律吕调阳云腾致雨露结为霜`.split(
      ""
    );
  const columns = Math.floor(window.innerWidth / 40);
  const drops = [];

  for (let i = 0; i < columns; i++) {
    const column = document.createElement("div");
    column.className = "matrix-column";
    column.style.left = `${i * 40}px`;
    background.appendChild(column);

    drops.push({
      element: column,
      content: "",
      y: Math.random() * -2000,
      speed: 4 + Math.random() * 2,
      length: 8 + Math.floor(Math.random() * 12),
      nextUpdate: Date.now() + Math.random() * 2000,
    });
  }

  function updateDrops() {
    const now = Date.now();

    drops.forEach((drop) => {
      // Update position (fast falling)
      drop.y += drop.speed;

      // Change characters less frequently
      if (now >= drop.nextUpdate) {
        drop.content = "";
        for (let i = 0; i < drop.length; i++) {
          drop.content +=
            characters[Math.floor(Math.random() * characters.length)];
        }
        // Set next update time (1-3 seconds)
        drop.nextUpdate = now + 800 + Math.random() * 400;
      }

      // Reset position when reaching bottom
      if (drop.y > window.innerHeight) {
        drop.y = -100;
        drop.speed = 3 + Math.random() * 2; // Maintain fast speed
      }

      // Apply changes with opacity gradient
      const chars = drop.content.split("");
      const gradient = chars
        .map((char, i) => {
          const opacity = Math.max(0, 1 - i / drop.length);
          return `<span style="opacity: ${opacity}">${char}</span>`;
        })
        .join("");

      drop.element.style.transform = `translateY(${drop.y}px)`;
      drop.element.innerHTML = gradient;
    });

    requestAnimationFrame(updateDrops);
  }

  // Start animation immediately
  updateDrops();
});
