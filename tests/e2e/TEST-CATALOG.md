# E2E test catalog

## Super Blocks core journey

**File:** `specs/game.spec.ts`

| Journey | Acceptance |
| --- | --- |
| Game home | `/` directly shows the menu, modes, ranking, settings, and rules. |
| Classic scoring | A deterministic opening can complete a line and persist score 18. |
| Session restore | Refresh and returning to `/` resume an unfinished game. |
| Preferences | Language, music, sound, and reduced motion persist independently. |
| Local ranking | The ranking shows local best and history without account controls. |
| Assets and routing | Required audio is served and invalid modes redirect to `/`. |
