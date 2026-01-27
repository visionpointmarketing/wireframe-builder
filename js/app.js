import { state, initStateRefs, saveToHistory } from './state.js';
import { initCanvas, updateCanvas, saveContentFromEditable, setupCanvasEvents, initializeDragAndDrop, addSection } from './canvas.js';
import { FormBuilder } from './form-builder.js';
import { GoogleDocsExporter } from './google-docs-exporter.js';
import { initializeGuidance } from './writing-guidelines.js';
import { generateSidebar, setupSidebarEnhancements, setupExportDropdown, setupEventListeners, exportJSON, exportAsImage, handleImport } from './ui.js';
import sectionTemplates from './sections/index.js';

// Client configuration system (Phase 4)
async function loadConfig() {
    const params = new URLSearchParams(window.location.search);
    const clientName = params.get('client');

    if (!clientName) return null;

    try {
        const response = await fetch(`config/${clientName}.json`);
        if (!response.ok) return null;
        return await response.json();
    } catch {
        console.warn(`Could not load config for client: ${clientName}`);
        return null;
    }
}

function applyConfig(config) {
    if (!config) return;

    // Load brand stylesheet
    if (config.brandStylesheet) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = config.brandStylesheet;
        document.head.appendChild(link);
    }

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

    // Load client config (Phase 4)
    const config = await loadConfig();

    // Initialize state refs
    initStateRefs(undoBtn, redoBtn, updateCanvas);

    // Initialize canvas module
    const formBuilder = new FormBuilder(updateCanvas);
    initCanvas(canvas, formBuilder);

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
