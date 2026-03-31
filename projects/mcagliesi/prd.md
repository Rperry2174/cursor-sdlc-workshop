# Product Requirements Document (PRD)

## Opportunity

There’s a gap between (a) pre-match formations/average positions and (b) what actually happens minute-to-minute: teams change rest-defense shapes, pressing structures, buildup shapes, and attacking shapes depending on scoreline, phase of play, substitutions, and opponent behavior. For a club like Liverpool, these shifts are frequent and meaningful, but they’re hard to review quickly across a season.

This product makes tactical shifts legible: for each match, it summarizes the main “shapes” Liverpool used, when they appeared, what triggered them, and what changed (roles, positioning, pressing, buildup lanes).

## Target Users

- Tactics-curious fans who want structured explanations (not raw heatmaps)
- Analysts / content creators who need match-by-match tactical timelines
- Coaches / players (lightweight reference; not a full coaching analysis suite)

## Problem Statement

Fans can find:

- Starting XI and listed formation
- Heatmaps / average positions
- Highlights

But they can’t easily answer:

- What shape did Liverpool build in (2-3-5? 3-2-5? 4-2-4 press?)
- How did it change when leading vs trailing?
- When did it change, and why (sub, tactical instruction, opponent adjustment)?
- What were the roles (e.g., inverted fullback, box midfield, 3+2 rest defense), and who occupied each lane?

## Goals / Non-goals

### Goals

- Show every Liverpool match in the selected season and provide a consistent tactical “timeline” per match
- Explain Liverpool’s shapes in core game states (buildup, settled attack, counter-press, defensive block, high press, rest defense)
- Attribute changes to triggers (goal, red card, substitution, opponent change, time-window, fatigue)
- Provide an opinionated, human-readable explanation with visual support

### Non-goals (v1)

- Predicting future tactics
- Fully automated ground-truth formation recognition with guaranteed correctness
- Opponent full tactical analysis (we’ll include opponent context only insofar as it explains Liverpool’s changes)

## Definitions (shared language)

- **Game state:** a combination of match context and phase of play.
    - Match context examples: leading / level / trailing; 11v11 vs 10v11; home/away; late-game.
    - Phase of play examples: buildup, settled attack, transition, defensive block, high press, set pieces.
- **Shape / formation:** out-of-possession and in-possession structures (often differ from the listed formation).
- **Segment:** a continuous time range in which Liverpool’s shape and roles are materially consistent (e.g., 00:00–18:30).
- **Trigger:** a discrete event that plausibly causes a tactical change (substitution, goal, card, instruction).

## Key User Stories

1. As a fan, I want to open any match and immediately understand Liverpool’s main in-possession and out-of-possession shapes.
2. As a fan, I want to scrub through the match timeline and see when the shape changed and what changed.
3. As an analyst, I want to filter the season for matches where Liverpool used a specific shape (e.g., 3-2-5 in buildup) or a pressing structure.
4. As a creator, I want to export a short summary (and optionally visuals) for a match or a segment.

## Proposed Solution (Product Overview)

The app has three core surfaces:

1) **Season Match List**

- A list of all matches Liverpool played in the selected season (competition filters)
- Each match row shows a compact “tactical fingerprint” (e.g., top 2–3 shapes used + notable triggers)

2) **Match Detail → Tactical Timeline**

- A timeline segmented into tactical phases (segments)
- For each segment:
    - Game state label(s) (e.g., “Level 0-0”, “Leading 1-0”, “10v11”)
    - Phase of play focus (buildup / press / block / attack / transitions)
    - Liverpool’s shape(s) (in-possession and out-of-possession)
    - Role notes (who is the 3rd CB in buildup, who inverts, who forms the 2)
    - Key evidence links: event timestamp(s), optional clip references, optional positional map

3) **Shape Library (Across Season)**

- Canonical definitions of shapes the product uses (with diagrams)
- Examples: “2-3-5 in possession”, “3-2-5 with inverted fullback”, “4-2-4 press”, “mid-block 4-4-2”, etc.
- Used as a glossary so match pages stay readable

## Core Game States to Support (v1)

Support these states consistently for every match:

- **In possession**
    - Buildup (goal kicks / deep progression)
    - Settled attack (final-third)
- **Out of possession**
    - High press
    - Mid/low block
- **Transitions**
    - Counter-press (immediate reaction after loss)
    - Defensive transition (after losing press / broken structure)
- **Rest defense**
    - “Behind the ball” structure while attacking (e.g., 3+2)

## Data + Method (How we produce explanations)

This PRD is compatible with multiple implementations:

- **Manual / analyst-authored segments (v1 launch-friendly):** a small team (or contractor workflow) creates segments per match.
- **Hybrid (v1.5):** automated suggestions + human verification.
- **Automated (future):** shape inference from tracking/event data.

Minimum data requirements for v1:

- Match schedule + opponents + competition
- Event timestamps (goals, subs, cards)
- Starting lineups + substitutions
- (Optional but helpful) possession chains / touch maps / average positions

## UX / IA (Information Architecture)

### Navigation

- Home: Season selector → competition filters
- Match list → match detail
- Global: Shape library

### Match Detail layout (suggested)

- Header: score, competition, date, opponent
- Tabs:
    - Timeline (default)
    - Summary
    - Shapes (all shapes used in match)
    - Players/Roles

## MVP Scope (Release Criteria)

- Season selector + match list covering all matches in the season
- Match detail page for each match with:
    - At least 3–6 segments per match (depending on volatility)
    - For each segment: game state, phase of play, in-possession shape, out-of-possession shape, trigger notes
- Shape library with consistent diagrams/definitions used across matches
- Basic search/filter: find matches by shape and by scoreline state (leading/level/trailing)

## Out of Scope / Future Ideas

- Video clip integration and auto-generated cut-ups per segment
- Opponent tactical timelines
- Compare matches (side-by-side) or compare halves
- Alerts: “Liverpool switched to X shape at minute Y”
- Advanced analytics: chance creation by shape, PPDA by segment, etc.

## Success Metrics

- Engagement: matches viewed per user per week; timeline scrubs per session
- Retention: weekly return rate for active fans
- Content quality: % segments marked “helpful” / “clear” by users
- Coverage: % of season matches with completed tactical timelines

## Risks / Open Issues

- Tactical interpretation is subjective; must design for uncertainty and avoid over-precision.
- Data availability varies by competition; reliance on proprietary tracking data may constrain scope.
- Consistency: multiple analysts must produce consistent segment definitions.

## Appendix: Example segment schema (conceptual)

For each segment:

- Time range: start/end
- Match context: scoreline, man-advantage, home/away
- Phase focus: buildup/press/block/attack/transitions
- In-possession shape: e.g., 3-2-5
- Out-of-possession shape: e.g., 4-4-2 press
- Role notes: bullet list
- Trigger: e.g., “Sub: RB off, CM on → fullback inversion stops”
- Confidence: high/medium/low
