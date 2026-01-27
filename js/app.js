import { state, initStateRefs, saveToHistory } from './state.js';
import { initCanvas, updateCanvas, saveContentFromEditable, setupCanvasEvents, initializeDragAndDrop, addSection } from './canvas.js';
import { FormBuilder } from './form-builder.js';
import { ImageUploadModal } from './image-upload-modal.js';
import { GoogleDocsExporter } from './google-docs-exporter.js';
import { initializeGuidance } from './writing-guidelines.js';
import { generateSidebar, populateBrandPicker, setupBrandPicker, setupSidebarEnhancements, setupExportDropdown, setupEventListeners, exportJSON, exportAsImage, handleImport } from './ui.js';
import sectionTemplates from './sections/index.js';
import { brandPresets } from './brand-presets.js';

// Client configuration system (Phase 4)
async function loadConfig() {
    const params = new URLSearchParams(window.location.search);
    const clientName = params.get('client');

    if (!clientName) return { clientName: null, config: null };

    try {
        const response = await fetch(`config/${clientName}.json`);
        if (!response.ok) return { clientName, config: null };
        return { clientName, config: await response.json() };
    } catch {
        console.warn(`Could not load config for client: ${clientName}`);
        return { clientName, config: null };
    }
}

// Saved at startup before any config mutates them
let originalDefaults = {};

async function switchPreset(presetId) {
    const preset = brandPresets.find(p => p.id === presetId);
    if (!preset) return;

    state.activePreset = presetId;

    // Swap brand stylesheet
    const link = document.getElementById('brandStylesheet');
    if (link) {
        link.href = preset.stylesheet;
    }

    // Load and apply config if preset has one
    if (preset.config) {
        try {
            const response = await fetch(preset.config);
            if (response.ok) {
                const config = await response.json();
                applyConfig(config);
            }
        } catch {
            // Config load is optional
        }
    } else {
        // Reset to defaults: show all sections, clear client name
        document.querySelectorAll('.section-btn').forEach(btn => btn.style.display = '');
        document.querySelectorAll('.component-category').forEach(cat => cat.style.display = '');
        document.querySelector('.app-header h1').textContent = 'Landing Page Wireframe Builder';
        document.title = 'Landing Page Wireframe Builder';

        // Restore original section defaults
        for (const [type, orig] of Object.entries(originalDefaults)) {
            const tmpl = sectionTemplates[type];
            if (tmpl && tmpl.defaults) {
                Object.assign(tmpl.defaults, JSON.parse(JSON.stringify(orig)));
            }
        }
    }

    updateCanvas(false);
}

function applyConfig(config) {
    if (!config) return;

    // Brand stylesheet is handled by switchPreset via #brandStylesheet link.
    // No need to append a new <link> here.

    // Update page title
    if (config.clientName) {
        document.querySelector('.app-header h1').textContent = `${config.clientName} Wireframe Builder`;
        document.title = `${config.clientName} Wireframe Builder`;
    }

    // Filter enabled sections in sidebar
    if (config.enabledSections) {
        document.querySelectorAll('.section-btn').forEach(btn => {
            if (!config.enabledSections.includes(btn.dataset.section)) {
                btn.style.display = 'none';
            }
        });
        // Hide empty categories
        document.querySelectorAll('.component-category').forEach(cat => {
            const visibleBtns = cat.querySelectorAll('.section-btn:not([style*="display: none"])');
            if (visibleBtns.length === 0) cat.style.display = 'none';
        });
    }

    // Merge default content overrides
    if (config.defaultContent) {
        for (const [sectionType, overrides] of Object.entries(config.defaultContent)) {
            const template = sectionTemplates[sectionType];
            if (template && template.defaults) {
                Object.assign(template.defaults, overrides);
            }
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    const canvas = document.getElementById('canvas');
    const sectionLibrary = document.querySelector('.sidebar-content');
    const viewportBtns = document.querySelectorAll('.viewport-btn');
    const importBtn = document.getElementById('importBtn');
    const importFile = document.getElementById('importFile');
    const deleteAllBtn = document.getElementById('deleteAllBtn');
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
    const sidebar = document.querySelector('.sidebar');

    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }

    // Generate sidebar from registry (Phase 5)
    if (sectionLibrary) {
        generateSidebar(sectionLibrary);
    }

    // Save original section defaults before any config mutates them
    for (const [type, tmpl] of Object.entries(sectionTemplates)) {
        if (tmpl.defaults) {
            originalDefaults[type] = JSON.parse(JSON.stringify(tmpl.defaults));
        }
    }

    // Load client config (Phase 4)
    const { clientName, config } = await loadConfig();

    // Determine initial preset from ?client= param
    const initialPreset = clientName && brandPresets.find(p => p.id === clientName)
        ? clientName : 'default';
    state.activePreset = initialPreset;

    // Set brand stylesheet to match preset
    const brandLink = document.getElementById('brandStylesheet');
    const presetDef = brandPresets.find(p => p.id === initialPreset);
    if (brandLink && presetDef) {
        brandLink.href = presetDef.stylesheet;
    }

    // Populate and wire up brand picker
    populateBrandPicker(initialPreset);
    setupBrandPicker(switchPreset);

    // Initialize state refs
    initStateRefs(undoBtn, redoBtn, updateCanvas);

    // Initialize canvas module
    const formBuilder = new FormBuilder(updateCanvas);
    const imageUploadModal = new ImageUploadModal(updateCanvas);
    initCanvas(canvas, formBuilder, imageUploadModal);

    // Initialize Google Docs exporter
    const googleDocsExporter = new GoogleDocsExporter(config || {});

    // Apply client config after sidebar is generated
    applyConfig(config);

    // Setup all event listeners
    setupEventListeners(
        canvas, sectionLibrary, viewportBtns,
        importBtn, importFile, deleteAllBtn, undoBtn, redoBtn,
        toggleSidebarBtn, sidebar,
        (e) => handleImport(e, updateCanvas)
    );

    // Setup delete all (direct, no require)
    if (deleteAllBtn) {
        // Remove default listener added by setupEventListeners (it used require)
        // Re-add properly
        deleteAllBtn.addEventListener('click', () => {
            if (state.sections.length === 0) {
                alert('No sections to delete');
                return;
            }
            if (confirm('Are you sure you want to delete all sections? This cannot be undone.')) {
                state.sections = [];
                updateCanvas();
            }
        });
    }

    setupExportDropdown(
        () => exportAsImage(canvas),
        exportJSON,
        () => googleDocsExporter.exportToGoogleDocs(saveContentFromEditable)
    );

    setupCanvasEvents();
    initializeDragAndDrop();
    initializeGuidance();
    setupSidebarEnhancements();

    updateCanvas(false);
    saveToHistory();
});
