# Animation Window

Open `/animation-window/` through the shared static server. Root owns registration and publishing.

Clicking the Speaker's coil first enlarges the selected finished part while the other layers recede. The child holds a finished coil, brings its temporary form back underneath it, then visibly peels the winding into one continuous insulated wire. The reverse-entry sequence takes about 3.5 seconds. Generic Prev / Next / jumps subsequently follow the active item's making steps; the same sampled continuous path winds and unwinds on the Coil page.

A clickable side rack shows individual tools. Speaker actions show winding feed/form rotation, a locator approaching/holding/withdrawing, meter probe contact, signal-to-amplifier wiring, power supply and acoustic microphone measurement. The rack becomes a compact horizontal shelf on a phone. Richer explanations remain alongside the window on desktop.

Only Part and Tool roles are visible. Magnet and iron flux parts have separate links. Meter, Audio signal source, Audio amplifier, Measurement microphone and Power source have separate native making pages. Tool pages expose their input parts and manufacturing tools; their use remains in the caller's steps. Regular stand-in pages explicitly say "This is a stand-in page" and mark diagrams TBD where appropriate. The primary ancestry is Phone → Speaker → Copper voice coil → Insulated wire; tool detours retain their caller.

Phone is a regular three-step stand-in. Every non-root item has an immediate parent/caller return, which restores the step, view, camera/viewBox, pause state, disclosure, scroll and originating launcher focus.

Active code is window.js plus animation-window.css, with the retained technical Speaker SVG and base styling. Legacy app.js / journeys.js are not loaded.

Checks: active script syntax passed. A bounded core-flow execution checked finished-coil reverse entry ending at wire, nested Wire and Winding fixture returns, exact Speaker state restoration and regular Phone return/re-entry. This agent has no available browser surface; the root agent performs the single desktop/phone visual acceptance pass before publishing.

Limits: unwinding is an illustrative continuous-path transformation, not a winding-machine simulation. Stand-ins and TBD geometry communicate dependencies rather than a validated manufacturing specification. Power-source making explicitly requires supplied mechanical work; magnets alone are not treated as a continuous power supply. Source notes link the KLIPPEL primary documentation used for the conceptual Speaker physics.