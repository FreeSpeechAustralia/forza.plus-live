const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.header-nav');
const sortSelect = document.getElementById('sortSelect');
const videoGrid = document.getElementById('videoGrid');
const videoCount = document.getElementById('videoCount');
const canvas = document.getElementById('nebula-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;

const videos = [
  {
    id: 'v744kuq',
    title: 'The Jews TURN on Nick Shirley',
    sourceUrl: 'https://rumble.com/v76b8uy-the-jews-turn-on-nick-shirley.html',
    rank: 1,
  },
  {
    id: 'v742m96',
    title: "My Thoughts on Trump's State of the Union Address",
    sourceUrl: 'https://rumble.com/v769a9e-my-thoughts-on-trumps-state-of-the-union-address.html',
    rank: 2,
  },
  {
    id: 'v740tz2',
    title: 'Tucker Carlson PRESSES Mike Huckabee on Israel',
    sourceUrl: 'https://rumble.com/v767hza-tucker-carlson-presses-mike-huckabee-on-israel.html',
    rank: 3,
  },
  {
    id: 'v73ypzu',
    title: 'What even are these superchats???',
    sourceUrl: 'https://rumble.com/v765e02-what-even-are-these-superchats.html',
    rank: 4,
  },
  {
    id: 'v73ub68',
    title: "Trump's Religious Liberty Commission FIRES Catholic for Criticizing Israel",
    sourceUrl: 'https://rumble.com/v760z6g-trumps-religious-liberty-commission-fires-catholic-for-criticizing-israel.html',
    rank: 5,
  },
  {
    id: 'v73tmio',
    title: 'Fortnite with SNEAKO & Bradley Martyn',
    sourceUrl: 'https://rumble.com/v760aiw-fortnite-with-sneako-and-bradley-martyn.html',
    rank: 6,
  },
  {
    id: 'v73spa8',
    title: 'Mass Deportations Were NEVER Going to Happen',
    sourceUrl: 'https://rumble.com/v75zdag-mass-deportations-were-never-going-to-happen.html',
    rank: 7,
  },
  {
    id: 'v73qrya',
    title: 'Another Confrontation with Iran is INEVITABLE',
    sourceUrl: 'https://rumble.com/v75xfyi-another-confrontation-with-iran-is-inevitable.html',
    rank: 8,
  },
  {
    id: 'v73p8k0',
    title: 'The Brutal Reality of Looksmaxxing',
    sourceUrl: 'https://rumble.com/v75vwk8-the-brutal-reality-of-looksmaxxing.html',
    rank: 9,
  },
  {
    id: 'v73mfem',
    title: 'Sometimes I wonder how dumb the goyim can be...',
    sourceUrl: 'https://rumble.com/v75t3eu-sometimes-i-wonder-how-dumb-the-goyim-can-be.html',
    rank: 10,
  },
  {
    id: 'v73j19o',
    title: 'Trump TOTALLY SURRENDERS in Minneapolis',
    sourceUrl: 'https://rumble.com/v75pp9w-trump-totally-surrenders-in-minneapolis.html',
    rank: 11,
  },
  {
    id: 'v73h340',
    title: 'This Will Be the DOWNFALL of the Trump Administration',
    sourceUrl: 'https://rumble.com/v75nr48-this-will-be-the-downfall-of-the-trump-administration.html',
    rank: 12,
  },
];

function sortVideos(mode) {
  const sorted = [...videos];

  if (mode === 'oldest') {
    sorted.sort((a, b) => b.rank - a.rank);
  } else if (mode === 'title') {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    sorted.sort((a, b) => a.rank - b.rank);
  }

  return sorted;
}

function videoCard(video) {
  const embedUrl = `https://rumble.com/embed/${video.id}/`;

  return `
    <article class="video-card glass">
      <div class="video-embed-wrap">
        <iframe
          src="${embedUrl}"
          title="${video.title}"
          loading="lazy"
          allowfullscreen
        ></iframe>
      </div>
      <div class="video-meta">
        <h2>${video.title}</h2>
        <p>Source: Rumble channel feed</p>
        <a href="${video.sourceUrl}" target="_blank" rel="noopener noreferrer">Open on Rumble</a>
      </div>
    </article>
  `;
}

function renderVideos(mode = 'latest') {
  const sortedVideos = sortVideos(mode);
  videoGrid.innerHTML = sortedVideos.map(videoCard).join('');
  videoCount.textContent = `${sortedVideos.length} videos`;
}

if (sortSelect) {
  sortSelect.addEventListener('change', (event) => {
    renderVideos(event.target.value);
  });
}

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

if (canvas && ctx) {
  const stars = Array.from({ length: 70 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.7 + 0.4,
    o: Math.random() * 0.6 + 0.2,
    v: Math.random() * 0.0007 + 0.0002,
  }));

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach((star) => {
      star.y += star.v;
      if (star.y > 1.02) star.y = -0.02;

      ctx.beginPath();
      ctx.arc(star.x * canvas.width, star.y * canvas.height, star.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(183, 222, 255, ${star.o})`;
      ctx.fill();
    });

    requestAnimationFrame(drawStars);
  }

  resizeCanvas();
  drawStars();
  window.addEventListener('resize', resizeCanvas);
}

renderVideos('latest');
