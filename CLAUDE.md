# CLAUDE.md — Project Context

## What This Is

A browser-based visual wireframe builder for higher education landing pages. Vanilla JavaScript ES modules, no build step, no framework. Open `index.html` in a browser to run.

## Architecture

- **ES modules** loaded from `index.html → js/app.js`
- **Section registry pattern**: each section in `js/sections/` is a self-contained module exporting `type`, `name`, `category`, `defaults`, `fields`, `render()`, and `toDocFormat()`
- **`js/sections/index.js`** imports all section modules, groups them by category, and exports the registry
- **`wrapSection()`** in `js/utils.js` adds drag handles, controls (duplicate/delete/visibility), and theme attributes around every section's rendered HTML
- **Sidebar** is auto-generated from registry categories (no hardcoded section list)
- **Google Docs export** calls each section's `toDocFormat()` method
- **Writing guidelines** are driven by each section's `fields` metadata (character limits, labels)

## Key Files

| File | Role |
|------|------|
| `js/app.js` | Entry point — loads config, initializes state, sets up event listeners |
| `js/state.js` | State object, section array, history stack, undo/redo |
| `js/utils.js` | `escapeHtml`, `renderIfVisible`, `wrapSection` |
| `js/canvas.js` | Canvas rendering, inline editing, event delegation, drag-and-drop reordering |
| `js/ui.js` | Sidebar generation, viewport toggle, export dropdown, theme toggle |
| `js/google-docs-exporter.js` | Google Docs export via Apps Script |
| `js/form-builder.js` | Lead form field customization modal |
| `js/writing-guidelines.js` | Guidance panel using section field metadata |
| `js/sections/index.js` | Registry — imports all section templates, exports `sectionTemplates` and `categories` |
| `js/sections/*.js` | Individual section templates (8 total) |

## Adding or Modifying Sections

Adding a section is a single-file operation:

1. Create `js/sections/my-section.js` with the standard exports (`type`, `name`, `category`, `defaults`, `fields`, `render`, `toDocFormat`)
2. Import it in `js/sections/index.js` and add to the `templates` array
3. If the `category` is new, add it to the `categories` array in the same file
4. Everything else (sidebar, export, visibility, writing guidelines) picks it up automatically

## Client Configuration

The `?client=` query parameter loads `config/<name>.json` at startup. Config controls:

- `clientName` — UI display name
- `brandStylesheet` — path to brand CSS override
- `googleAppsScriptUrl` — Apps Script endpoint for Docs export
- `docTitlePrefix` — prefix for exported doc titles
- `enabledSections` — array of section type keys to show (omit = show all)
- `defaultContent` — per-section default field overrides

Default config: `config/default.json`. Example client config: `config/troy.json`.

## CSS Architecture

```
styles/main.css          → @import layers
  ├── tokens.css         → design tokens (colors, spacing, typography)
  ├── ui.css             → UI chrome (sidebar, toolbar, controls)
  ├── content.css        → section content styles
  └── brands/
      ├── default.css    → default brand token values
      └── troy.css       → Troy University overrides
```

CSS uses `@layer` for specificity control. Brand overrides only change token values. No CSS changes needed when adding sections.

## Legacy Files

- **`script.js`** — the original single-file IIFE. No longer loaded by `index.html`. Kept for reference only.
- **`updated-google-script.js`** — Google Apps Script code deployed separately at script.google.com (not loaded in the browser).

## Testing Checklist

- [ ] All 8 section types render correctly on the canvas
- [ ] Inline editing works for all editable fields
- [ ] Section variant toggles (e.g., dark/light theme) work
- [ ] Visibility toggle hides/shows sections
- [ ] Drag-and-drop reordering works
- [ ] Undo/redo (Ctrl/Cmd+Z, Ctrl/Cmd+Y)
- [ ] Export to PNG captures all visible sections
- [ ] Export to Google Docs produces formatted document
- [ ] Export/import JSON round-trips correctly
- [ ] Form builder modal opens and saves field configuration
- [ ] Writing guidelines panel shows correct limits per field
- [ ] `?client=troy` loads Troy branding and config
- [ ] Responsive preview (desktop/tablet/mobile) works
