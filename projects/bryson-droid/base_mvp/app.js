const profiles = [
  {
    name: "Maya",
    handicap: "HCP 12",
    distance: "6 miles away",
    course: "Presidio Golf Course",
    availability: "Sat mornings",
    vibe: "Walks 18",
    bio: "Walking 18, keeps a steady pace, always up for a casual competitive round.",
    hints: ["Similar skill level", "Shared morning availability", "Mutual course"],
    photo: "linear-gradient(135deg, #2f855a, #68d391)",
  },
  {
    name: "Jordan",
    handicap: "HCP 16-20",
    distance: "11 miles away",
    course: "TPC Harding Park",
    availability: "Sun afternoons",
    vibe: "Relaxed 9",
    bio: "Rides most rounds, likes 9 holes after lunch, relaxed vibe and no pressure.",
    hints: ["Within travel radius", "Same 9-hole preference", "Good weekend overlap"],
    photo: "linear-gradient(135deg, #2b6cb0, #63b3ed)",
  },
  {
    name: "Chris",
    handicap: "New / Unknown",
    distance: "4 miles away",
    course: "Lincoln Park Golf Course",
    availability: "Weekday twilight",
    vibe: "New golfer",
    bio: "Newer golfer looking for a recurring group, easygoing round, and good course chat.",
    hints: ["Very close by", "Flexible schedule", "Recurring group interest"],
    photo: "linear-gradient(135deg, #805ad5, #d6bcfa)",
  },
];

const profileCard = document.getElementById("profile-card");
const profileCount = document.getElementById("profile-count");
const matchCount = document.getElementById("match-count");
const matchesList = document.getElementById("matches-list");
const passButton = document.getElementById("pass-button");
const likeButton = document.getElementById("like-button");

let currentIndex = 0;
let likedProfiles = [];

function renderProfile() {
  const profile = profiles[currentIndex];

  profileCount.textContent = profile
    ? `${currentIndex + 1} of ${profiles.length}`
    : "Done";

  if (!profile) {
    profileCard.innerHTML = `
      <div class="done-state">
        <span class="done-pill">Stack complete</span>
        <h3>No more golfers to review.</h3>
        <p>You made it through the starter stack. Refresh to browse again or keep your favorite picks in the saved list.</p>
      </div>
    `;
    passButton.disabled = true;
    likeButton.disabled = true;
    return;
  }

  profileCard.innerHTML = `
    <div class="profile-photo" style="background-image: ${profile.photo};">
      <div class="profile-topline">
        <span class="profile-badge">Top pick nearby</span>
        <span class="profile-badge">${profile.distance}</span>
      </div>
      <div class="profile-headline">
        <h3>${profile.name}</h3>
        <div class="profile-subline">
          <span>${profile.handicap}</span>
          <span>${profile.vibe}</span>
        </div>
      </div>
    </div>
    <div class="profile-body">
      <section class="profile-section">
        <p class="section-label">Round details</p>
        <ul class="profile-meta">
          <li>${profile.course}</li>
          <li>${profile.availability}</li>
        </ul>
      </section>
      <section class="profile-section">
        <p class="section-label">About them</p>
        <p class="profile-bio">${profile.bio}</p>
      </section>
      <section class="profile-section">
        <p class="section-label">Why this match?</p>
        <ul class="hint-list">
          ${profile.hints.map((hint) => `<li>${hint}</li>`).join("")}
        </ul>
      </section>
    </div>
  `;

  passButton.disabled = false;
  likeButton.disabled = false;
}

function renderMatches() {
  matchCount.textContent = `${likedProfiles.length} liked`;

  if (likedProfiles.length === 0) {
    matchesList.innerHTML = `
      <li>
        <p class="empty-state"><strong>Start swiping</strong>Liked golfers will appear here so you can quickly review the playing partners worth circling back to.</p>
      </li>
    `;
    return;
  }

  matchesList.innerHTML = likedProfiles
    .map(
      (profile) => `
        <li class="match-item">
          <div class="match-avatar" style="background: ${profile.photo};">${profile.name.charAt(0)}</div>
          <div class="match-copy">
            <strong>${profile.name}</strong>
            <p>${profile.handicap} · ${profile.course} · ${profile.availability}</p>
          </div>
        </li>
      `,
    )
    .join("");
}

function moveToNextProfile() {
  currentIndex += 1;
  renderProfile();
}

passButton.addEventListener("click", () => {
  moveToNextProfile();
});

likeButton.addEventListener("click", () => {
  const profile = profiles[currentIndex];

  if (profile) {
    likedProfiles = [...likedProfiles, profile];
    renderMatches();
  }

  moveToNextProfile();
});

renderProfile();
renderMatches();
