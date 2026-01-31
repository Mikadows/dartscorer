# Dart Scorer Features

Welcome to the Dart Scorer project! This document outlines the key features and functionality of the application designed to streamline dart score entry.

## Key Features

### Score Entry — Interactive Target

- Target: an exact reproduction of a real dartboard (preserving the orientation and the position of the 20 segment).
- Input control: each area of the board is treated as a strict button — precise assignment to rings and sectors using radius and angle thresholds.
- Available actions: a visible secondary control — an `Undo` button to cancel throws, with an infinite undo history (multi-level undo across the whole game).

#### UI / UX — General Appearance
- The interface must faithfully reproduce the visual hierarchy and layout shown in the reference mockup (`asset/img.png`).
- Dominant dark theme: overall very dark background (black/anthracite gray) with high contrast for readability.
- No bitmap images for the target: 100% vector rendering.
- The target must always be a perfect circle (1:1 aspect ratio), dynamically sized to the available space.
- The target should be positioned in the right 3/4 of the screen in landscape mode, and in the bottom 3/4 in portrait mode.
- Visual composition faithful to a real dartboard:
    * Dark outer ring with numbers 1–20 in white, positioned radially.
    * Single-score sectors alternating dark red / off-white.
    * Thin triple and double rings, alternating bright red / bright green.
    * Outer bull green, bullseye red.
- The relative proportions of the rings should follow real-board standards (double/triple rings noticeably thinner than single-score areas).

### Functional Requirements — Score Display

- Layout: reserve the left 1/4 (25%) of the available screen width for the score display area; the interactive target occupies the remaining right 3/4. This layout must adapt to orientation while preserving relative proportions (left column remains ~25% in landscape; in portrait the score area stacks above/beside as in the mockup if space requires).
- Visual design: the score display must match the attached reference (see image) in composition and visual weight: stacked player score cards, dark theme, high-contrast typography, and compact dart-result tiles (e.g., `T20`, `20`, `D10`). Keep styling consistent with the target mockup in `asset/img.png`.
- Card model: each completed player turn (up to 3 darts) is represented by one independent score card. A card contains:
    * **Player name** and avatar/icon.
    * **Remaining score** (big and prominent).
    * **Three dart slots** showing the hits for that turn (empty if not thrown yet). Each slot shows shorthand (e.g., `T20`, `20`, `B`), color-coded to match the board rings.
    * **Turn subtotal** and optional small notes (e.g., checkout achieved).
    * Timestamp or turn index (optional for history).
- Turn lifecycle and rules:
    * A player's turn lasts for up to three darts. After the third dart is recorded the system automatically finalizes that card and immediately switches control to the next player in the rotation.
    * While a turn is in progress the active player's current card is editable (new darts appended into the three slots). Finalization occurs automatically on the 3rd dart or when the player finishes/achieves a checkout.
    * Each player's turns are independent; history for each player appears as separate cards in the global sequence (interleaved by player order).
    * Undo/redo: existing global infinite undo applies — undoing a throw removes it from the corresponding turn card (and may reopen a finalized card if the last action was the finalizing 3rd dart).
- Scrolling and history:
    * The score cards list supports infinite history: older cards must be loaded on demand (infinite scroll / pagination) and the list must be performant (use virtualization for large histories).
    * Card order: newest cards appear at the top of the list by default.
    * Automatic scrolling: when a new card is added or the active player's current card updates, the score list automatically scrolls to keep the active/latest card in view. This auto-scroll must be smooth and not interrupt any user gesture if the user is actively scrolling (i.e., only auto-scroll when the list is idle or when the user has not scrolled away).
    * Auto-scroll toggle: provide a user-accessible toggle (settings or toolbar) to enable/disable automatic scrolling. The toggle must be enabled by default.
    * Provide a small affordance/button to jump to latest if the user is viewing older history.
- Interaction and accessibility:
    * Tapping a card expands it to show per-dart details and allows correction (subject to undo rules).
    * Long-press or overflow menu on a card exposes actions: `Edit`, `Delete Turn`, `Copy Turn`, `Pin`.
    * Ensure adequate color contrast and screen-reader labels for all score elements.
- Edge cases & acceptance criteria (testable):
    1. The score display occupies 25% of horizontal space next to the target in normal landscape layout.  
    2. After exactly three dart inputs for a player, the app finalizes the turn and switches the active player automatically.  
    3. Each finalized turn appears as its own card; multiple turns from the same player appear as separate cards in chronological order.  
    4. The score list supports infinite scrolling and loads older turns on demand without blocking the UI.  
    5. When a new turn is created or updated, the list scrolls to show that card (unless the user is actively viewing older history).  
    6. The app exposes an auto-scroll toggle; it is enabled by default and can be turned off by the user.

