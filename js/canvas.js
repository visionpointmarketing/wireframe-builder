import { state } from './state.js';
import { saveToHistory } from './state.js';
import sectionTemplates from './sections/index.js';
import { gc } from './image-store.js';

let canvasEl = null;
let formBuilderRef = null;
let imageUploadModalRef = null;

export function initCanvas(canvas, formBuilder, imageUploadModal) {
    canvasEl = canvas;
    formBuilderRef = formBuilder;
    imageUploadModalRef = imageUploadModal;
}

// Get default visibility from section template fields
export function getDefaultVisibility(sectionType) {
    const template = sectionTemplates[sectionType];
    if (template && template.fields) {
        const vis = {};
        template.fields.forEach(f => { vis[f.key] = true; });
        return vis;
    }
    // Fallback
    return { eyebrow: true, title: true, body: true, ctaText: true };
}

// Get element labels from section template fields
export function getElementLabels(sectionType) {
    const template = sectionTemplates[sectionType];
    if (template && template.fields) {
        const labels = {};
        template.fields.forEach(f => { labels[f.key] = f.label; });
        return labels;
    }
    return { eyebrow: 'Eyebrow Text', title: 'Heading', body: 'Body Content', ctaText: 'CTA Button' };
}

// Add section to canvas
export function addSection(type, variant = 'light', content = {}) {
    const template = sectionTemplates[type];
    if (!template) return;

    // For lead-form sections, ensure default fields
    if (type === 'lead-form' && !content.fields) {
        content = { ...content, fields: template.defaults.fields };
    }

    const sectionData = {
        id: Date.now(),
        type,
        variant,
        content,
        visibility: getDefaultVisibility(type)
    };

    if (template.hasLayout) {
        sectionData.layoutDirection = 'normal';
    }

    state.sections.push(sectionData);
    updateCanvas();
}

// Update canvas with current sections
export function updateCanvas(saveHistory = true) {
    if (state.sections.length === 0) {
        canvasEl.innerHTML = '<div class="empty-state"><p>Click a section from the library to get started</p></div>';
        return;
    }

    const wireframeHtml = state.sections.map(section => {
        const template = sectionTemplates[section.type];
        const visibility = section.visibility || getDefaultVisibility(section.type);
        return template ? template.render(section.variant, section.content, section.layoutDirection, visibility) : '';
    }).join('');

    canvasEl.innerHTML = `<div class="wireframe-container">${wireframeHtml}</div>`;

    if (saveHistory) {
        saveToHistory();
    }
}

// Save content from contenteditable elements
export function saveContentFromEditable() {
    const sections = canvasEl.querySelectorAll('.section');
    sections.forEach((section, index) => {
        if (!state.sections[index]) return;

        const content = { ...state.sections[index].content };
        const editables = section.querySelectorAll('[contenteditable="true"]');

        editables.forEach(editable => {
            const field = editable.dataset.field;
            if (field) {
                content[field] = editable.textContent.trim();
            }
        });

        const sectionType = section.dataset.sectionType;
        if (sectionType === 'three-column') {
            content.columns = [];
            for (let i = 0; i < 3; i++) {
                const title = section.querySelector(`[data-field="column-title-${i}"]`);
                const desc = section.querySelector(`[data-field="column-description-${i}"]`);
                if (title || desc) {
                    content.columns.push({
                        title: title ? title.textContent.trim() : '',
                        description: desc ? desc.textContent.trim() : ''
                    });
                }
            }
        } else if (sectionType === 'statistics') {
            content.stats = [];
            for (let i = 0; i < 3; i++) {
                const number = section.querySelector(`[data-field="stat-number-${i}"]`);
                const label = section.querySelector(`[data-field="stat-label-${i}"]`);
                if (number || label) {
                    content.stats.push({
                        number: number ? number.textContent.trim() : '',
                        label: label ? label.textContent.trim() : ''
                    });
                }
            }
        } else if (sectionType === 'program-cards') {
            content.programs = [];
            for (let i = 0; i < 3; i++) {
                const title = section.querySelector(`[data-field="program-title-${i}"]`);
                const desc = section.querySelector(`[data-field="program-description-${i}"]`);
                if (title || desc) {
                    content.programs.push({
                        title: title ? title.textContent.trim() : '',
                        description: desc ? desc.textContent.trim() : ''
                    });
                }
            }
        }

        // Preserve form fields for lead-form sections
        if (state.sections[index].type === 'lead-form' && state.sections[index].content.fields) {
            content.fields = state.sections[index].content.fields;
        }

        // Preserve uploaded images
        if (state.sections[index].content.images) {
            content.images = state.sections[index].content.images;
        }

        state.sections[index].content = content;
    });
}

// Event handlers for section controls
export const eventHandlers = {
    duplicateSection(btn) {
        const section = btn.closest('.section');
        const index = Array.from(canvasEl.querySelectorAll('.section')).indexOf(section);

        if (state.sections[index]) {
            const originalSection = state.sections[index];
            const duplicatedSection = {
                ...originalSection,
                id: Date.now(),
                content: { ...originalSection.content },
                visibility: originalSection.visibility ? { ...originalSection.visibility } : getDefaultVisibility(originalSection.type)
            };
            state.sections.splice(index + 1, 0, duplicatedSection);
            updateCanvas();
        }
    },

    toggleVariant(btn) {
        const section = btn.closest('.section');
        const index = Array.from(canvasEl.querySelectorAll('.section')).indexOf(section);
        if (state.sections[index]) {
            state.sections[index].variant = state.sections[index].variant === 'light' ? 'dark' : 'light';
            updateCanvas();
        }
    },

    toggleLayout(btn) {
        const section = btn.closest('.section');
        const index = Array.from(canvasEl.querySelectorAll('.section')).indexOf(section);
        if (state.sections[index] && state.sections[index].layoutDirection !== undefined) {
            state.sections[index].layoutDirection = state.sections[index].layoutDirection === 'normal' ? 'reversed' : 'normal';
            updateCanvas();
        }
    },

    deleteSection(btn) {
        const section = btn.closest('.section');
        const index = Array.from(canvasEl.querySelectorAll('.section')).indexOf(section);
        if (confirm('Are you sure you want to delete this section?')) {
            state.sections.splice(index, 1);
            updateCanvas();
            gc(state.sections);
        }
    },

    toggleCustomizePopover(btn) {
        const section = btn.closest('.section');
        const index = Array.from(canvasEl.querySelectorAll('.section')).indexOf(section);
        if (!state.sections[index]) return;

        let popover = btn.parentElement.querySelector('.visibility-popover');

        if (!popover) {
            popover = document.createElement('div');
            popover.className = 'visibility-popover';

            const sectionData = state.sections[index];
            const visibility = sectionData.visibility || getDefaultVisibility(sectionData.type);
            const labels = getElementLabels(sectionData.type);

            let optionsHtml = '';
            Object.keys(visibility).forEach(field => {
                if (labels[field]) {
                    optionsHtml += `
                        <div class="visibility-option">
                            <input type="checkbox" id="vis-${index}-${field}" data-field="${field}" ${visibility[field] ? 'checked' : ''}>
                            <label for="vis-${index}-${field}">${labels[field]}</label>
                        </div>
                    `;
                }
            });

            popover.innerHTML = `
                <div class="visibility-popover-header">Show/Hide Elements</div>
                <div class="visibility-options">${optionsHtml}</div>
                <div class="visibility-actions">
                    <button class="visibility-action-btn show-all-btn">Show All</button>
                    <button class="visibility-action-btn hide-all-btn">Hide All</button>
                </div>
            `;

            btn.parentElement.appendChild(popover);

            popover.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.addEventListener('change', (e) => {
                    if (!state.sections[index].visibility) {
                        state.sections[index].visibility = getDefaultVisibility(sectionData.type);
                    }
                    state.sections[index].visibility[e.target.dataset.field] = e.target.checked;
                    updateCanvas();
                });
            });

            popover.querySelector('.show-all-btn').addEventListener('click', () => {
                if (!state.sections[index].visibility) state.sections[index].visibility = getDefaultVisibility(sectionData.type);
                Object.keys(state.sections[index].visibility).forEach(field => { state.sections[index].visibility[field] = true; });
                popover.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = true; });
                updateCanvas();
            });

            popover.querySelector('.hide-all-btn').addEventListener('click', () => {
                if (!state.sections[index].visibility) state.sections[index].visibility = getDefaultVisibility(sectionData.type);
                Object.keys(state.sections[index].visibility).forEach(field => { state.sections[index].visibility[field] = field === 'title'; });
                popover.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = cb.dataset.field === 'title'; });
                updateCanvas();
            });
        }

        popover.classList.toggle('active');
    }
};

// Drag and Drop functionality
let draggedElement = null;
let draggedIndex = null;

export function initializeDragAndDrop() {
    canvasEl.addEventListener('dragstart', handleDragStart);
    canvasEl.addEventListener('dragover', handleDragOver);
    canvasEl.addEventListener('drop', handleDrop);
    canvasEl.addEventListener('dragend', handleDragEnd);
    canvasEl.addEventListener('dragleave', handleDragLeave);
}

function handleDragStart(e) {
    if (!e.target.classList.contains('drag-handle')) return;
    const section = e.target.closest('.section');
    if (!section) return;
    draggedElement = section;
    draggedIndex = Array.from(canvasEl.querySelectorAll('.section')).indexOf(section);
    section.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', section.innerHTML);
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const section = e.target.closest('.section');
    if (section && section !== draggedElement) {
        canvasEl.querySelectorAll('.section').forEach(s => s.classList.remove('drag-over'));
        section.classList.add('drag-over');
    }
    return false;
}

function handleDrop(e) {
    e.stopPropagation();
    const dropSection = e.target.closest('.section');
    if (!dropSection || dropSection === draggedElement) return;
    const dropIndex = Array.from(canvasEl.querySelectorAll('.section')).indexOf(dropSection);
    const [movedSection] = state.sections.splice(draggedIndex, 1);
    state.sections.splice(dropIndex, 0, movedSection);
    updateCanvas();
    return false;
}

function handleDragEnd() {
    canvasEl.querySelectorAll('.section').forEach(section => {
        section.classList.remove('dragging', 'drag-over');
    });
    draggedElement = null;
    draggedIndex = null;
}

function handleDragLeave(e) {
    const section = e.target.closest('.section');
    if (section) section.classList.remove('drag-over');
}

// Setup canvas event delegation
export function setupCanvasEvents() {
    canvasEl.addEventListener('click', (e) => {
        if (e.target.classList.contains('duplicate-btn')) {
            eventHandlers.duplicateSection(e.target);
        } else if (e.target.classList.contains('variant-btn')) {
            eventHandlers.toggleVariant(e.target);
        } else if (e.target.classList.contains('layout-btn')) {
            eventHandlers.toggleLayout(e.target);
        } else if (e.target.classList.contains('form-edit-btn') || e.target.closest('.form-edit-btn')) {
            const btn = e.target.closest('.form-edit-btn') || e.target;
            const section = btn.closest('.section');
            const sections = Array.from(canvasEl.querySelectorAll('.section'));
            const sectionIndex = sections.indexOf(section);
            if (sectionIndex !== -1 && state.sections[sectionIndex].type === 'lead-form') {
                formBuilderRef.open(sectionIndex);
            }
        } else if (e.target.classList.contains('customize-btn') || e.target.closest('.customize-btn')) {
            eventHandlers.toggleCustomizePopover(e.target.closest('.customize-btn') || e.target);
        } else if (e.target.classList.contains('delete-btn')) {
            eventHandlers.deleteSection(e.target);
        } else {
            // Image placeholder click
            const wrapper = e.target.closest('.image-placeholder-wrapper');
            if (wrapper && imageUploadModalRef) {
                const section = wrapper.closest('.section');
                const sections = Array.from(canvasEl.querySelectorAll('.section'));
                const sectionIndex = sections.indexOf(section);
                const imageSlot = wrapper.dataset.imageSlot;
                if (sectionIndex !== -1 && imageSlot) {
                    imageUploadModalRef.open(sectionIndex, imageSlot);
                }
            }
        }
    });

    // Close popovers when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.visibility-popover') && !e.target.closest('.customize-btn')) {
            document.querySelectorAll('.visibility-popover').forEach(p => p.classList.remove('active'));
        }
    });

    // Prevent HTML injection in contenteditable
    canvasEl.addEventListener('paste', (e) => {
        if (e.target.contentEditable === 'true') {
            e.preventDefault();
            const text = (e.clipboardData || window.clipboardData).getData('text');
            document.execCommand('insertText', false, text);
        }
    });

    // Save content on blur
    canvasEl.addEventListener('blur', (e) => {
        if (e.target.contentEditable === 'true') {
            saveContentFromEditable();
        }
    }, true);
}
