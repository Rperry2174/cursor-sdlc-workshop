# Product Requirements Document (PRD)

> **Instructions:** This is your team's project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** CityWeather Toggle

**One-line Description:** A simple weather app that lets you toggle between the 10 biggest US cities and displays current weather conditions.

**Type:** Web App (Single HTML page)

---

## Guidelines

### Keep It Small!
- Your MVP should be buildable in **10 minutes** by one person
- Think "proof of concept" not "production ready"
- If it sounds ambitious, make it simpler
- **Use Cursor to help you plan this!** You need a project that has at least 5 features so everyone on your team can pick one and add it
- Feel free to take one of the ideas below — this exercise is about learning the git flow, collaborating as a team, and understanding where Cursor's features fit into the SDLC

### Good Project Ideas

**Pong** — classic paddle-and-ball game
- _Example features:_ scoreboard, sound effects, difficulty/speed settings

**Memory Card Match** — flip cards to find matching pairs
- _Example features:_ move counter, timer, win animation/confetti

**Drawing Pad** — simple canvas you can sketch on
- _Example features:_ color picker, brush size slider, eraser tool

**Typing Speed Game** — type a passage and measure your words per minute
- _Example features:_ WPM display, accuracy tracker, difficulty levels

**Trivia Quiz** — multiple choice questions with score tracking
- _Example features:_ timer per question, category selector, results summary screen

### Bad Project Ideas (Too Big!)
- Anything with a database -- tell cursor to avoid this
- Anything requiring authentication
- Anything with multiple pages/screens
- Anything that "needs" an API

---

## Team Members & Tasks

> **Important:** Each team member MUST have their own task. Tasks should be independent features that can be built in parallel without stepping on each other's toes.

| Name | Task | Description |
|------|------|-------------|
| Matt Giordano | City Selector Grid | Add a visual grid of city buttons with hover effects |
| Trevor Cotta | Weather Icons | Add weather condition icons/emojis based on weather type |
| Casey Brenna | Temperature Styling | Style the temperature display with color coding (hot/cold) |
| Dan Riley | Weather Details Panel | Add humidity, wind speed, and "feels like" information |
| _(Bonus)_ | Dark/Light Mode Toggle | Add theme switcher for day/night viewing |

### Task Guidelines
- Each task should add something **visible** to the project
- Tasks should be **independent** — no dependencies on other tasks
- Think: new button, new section, new color scheme, new text, etc.
- Everyone should be able to work at the same time without conflicts

---

## Base MVP (Phase 2)

> **One person** creates the foundation that everyone else builds on.

**What the MVP includes:**
- Single HTML file with embedded CSS and JavaScript
- Hardcoded weather data for 10 biggest US cities (New York, Los Angeles, Chicago, Houston, Phoenix, Philadelphia, San Antonio, San Diego, Dallas, Austin)
- Basic city dropdown/select element
- Simple text display showing: City name, Temperature (°F), and Weather condition
- Function to switch between cities when dropdown changes

**What it does NOT include:**
- Styled city buttons (Matt will add)
- Weather icons (Trevor will add)
- Temperature color coding (Casey will add)
- Detailed weather info like humidity/wind (Dan will add)
- Theme switcher (bonus feature)

---

## Feature Slots (Phase 3)

> These are the features team members will add. Design them to be **independent** so people can work in parallel.

### Feature 1: City Selector Grid
- **Assigned to:** Matt Giordano
- **Description:** Replace the basic dropdown with a visually appealing grid of city buttons. Add hover effects and active state styling. Each button displays the city name and shows selected state.
- **Files to modify/create:** Modify the main HTML file - update the city selector section and add CSS for the button grid

### Feature 2: Weather Icons
- **Assigned to:** Trevor Cotta
- **Description:** Add weather condition icons (using emojis or simple SVGs) next to the weather condition text. Map different weather conditions (Sunny, Cloudy, Rainy, etc.) to appropriate visual icons.
- **Files to modify/create:** Modify the main HTML file - add icon display function and update weather display area with icon element

### Feature 3: Temperature Color Coding
- **Assigned to:** Casey Brenna
- **Description:** Style the temperature display with color gradients based on temperature ranges (e.g., blue for cold <50°F, orange for warm 50-80°F, red for hot >80°F). Make the temperature stand out visually.
- **Files to modify/create:** Modify the main HTML file - add CSS classes for temperature ranges and JavaScript to apply the right class based on temp value

### Feature 4: Weather Details Panel
- **Assigned to:** Dan Riley
- **Description:** Add an additional information panel below the main display showing humidity percentage, wind speed (mph), and "feels like" temperature. Style it as a neat info card.
- **Files to modify/create:** Modify the main HTML file - add new HTML section for details panel, add corresponding data to the weather data object, and style the panel

### Feature 5: Dark/Light Mode Toggle
- **Assigned to:** _(Bonus Feature)_
- **Description:** Add a toggle button to switch between light and dark themes. Updates background colors, text colors, and card styling based on selected theme.
- **Files to modify/create:** Modify the main HTML file - add theme toggle button, CSS variables for themes, and JavaScript toggle function

---

## Success Criteria

- [ ] MVP runs locally
- [ ] Each team member has merged at least one PR
- [ ] All features work together without breaking the app
