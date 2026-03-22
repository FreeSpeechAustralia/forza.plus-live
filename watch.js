const sortSelect = document.getElementById('sortSelect');
const sortPanel = document.querySelector('.sort-panel');
const videoGrid = document.getElementById('videoGrid');
const videoCount = document.getElementById('videoCount');

const videos = [
  {
    id: 'v779oki',
    title: 'William Forza Mitchell vs Drew Pavloustein (Host: Sam Bamford) | 2WorldsCollide',
    sourceUrl: 'https://rumble.com/v779oki-william-forza-mitchell-vs-drew-pavloustein-sam-bamford-as-host-2worldscolli.html?e9s=src_v1_sa%2Csrc_v5_sa_o%2Csrc_v1_ucp_f',
    rank: 1,
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
  if (!videoGrid) return;

  const sortedVideos = sortVideos(mode);

  if (sortedVideos.length === 0) {
    videoGrid.innerHTML = '';
    if (videoCount) videoCount.textContent = '0 videos';
    if (sortSelect) sortSelect.disabled = true;
    if (sortPanel) sortPanel.classList.add('is-empty');
    return;
  }

  if (sortSelect) sortSelect.disabled = false;
  if (sortPanel) sortPanel.classList.remove('is-empty');
  videoGrid.innerHTML = sortedVideos.map(videoCard).join('');
  videoCount.textContent = `${sortedVideos.length} videos`;
}

if (sortSelect) {
  sortSelect.addEventListener('change', (event) => {
    renderVideos(event.target.value);
  });
}

renderVideos('latest');
