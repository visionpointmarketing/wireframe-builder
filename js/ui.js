import { state } from './state.js';
import { undo, redo } from './state.js';
import { saveContentFromEditable } from './canvas.js';
import sectionTemplates from './sections/index.js';
import { allSections, categories } from './sections/index.js';
import { addSection } from './canvas.js';
import { exportImages, importImages } from './image-store.js';

// Generate sidebar HTML from section registry (Phase 5)
export function generateSidebar(sidebarContent) {
    sidebarContent.innerHTML = categories.map(cat => {
        const sections = allSections.filter(s => s.category === cat.id);
        if (sections.length === 0) return '';

        return `
            <div class="component-category">
                <button class="category-header" data-category="${cat.id}">
                    ${cat.icon}
                    <span>${cat.label}</span>
                    <svg class="category-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M6 9l6 6 6-6"/>
                    </svg>
                </button>
                <div class="category-items expanded">
                    ${sections.map(s => `
                        <button class="section-btn" data-section="${s.type}">
                            <div class="section-preview">${s.name}</div>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
}

export function setupSidebarEnhancements() {
    const categoryHeaders = document.querySelectorAll('.category-header');
    categoryHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const categoryItems = header.nextElementSibling;
            categoryItems.classList.toggle('expanded');
            header.setAttribute('aria-expanded', categoryItems.classList.contains('expanded'));
        });
    });

    const searchInput = document.getElementById('componentSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const allButtons = document.querySelectorAll('.section-btn');
            const cats = document.querySelectorAll('.component-category');

            if (searchTerm === '') {
                allButtons.forEach(btn => btn.style.display = '');
                cats.forEach(cat => cat.style.display = '');
                return;
            }

            cats.forEach(category => {
                const categoryButtons = category.querySelectorAll('.section-btn');
                let hasVisibleButtons = false;

                categoryButtons.forEach(btn => {
                    const text = btn.textContent.toLowerCase();
                    if (text.includes(searchTerm)) {
                        btn.style.display = '';
                        hasVisibleButtons = true;
                    } else {
                        btn.style.display = 'none';
                    }
                });

                category.style.display = hasVisibleButtons ? '' : 'none';
                if (hasVisibleButtons) {
                    category.querySelector('.category-items').classList.add('expanded');
                }
            });
        });
    }
}

export function setupExportDropdown(exportAsImageFn, exportJSONFn, googleDocsExporterFn) {
    const exportDropdownBtn = document.getElementById('exportDropdownBtn');
    const exportMenu = document.getElementById('exportMenu');
    const exportBtn = document.getElementById('exportBtn');
    const exportImageBtn = document.getElementById('exportImageBtn');
    const googleDocsExportBtn = document.getElementById('googleDocsExportBtn');

    exportDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        exportMenu.classList.toggle('show');
    });

    document.addEventListener('click', () => {
        exportMenu.classList.remove('show');
    });

    exportImageBtn.addEventListener('click', () => {
        exportMenu.classList.remove('show');
        exportAsImageFn();
    });

    exportBtn.addEventListener('click', () => {
        exportMenu.classList.remove('show');
        exportJSONFn();
    });

    googleDocsExportBtn.addEventListener('click', async () => {
        exportMenu.classList.remove('show');
        if (state.sections.length === 0) {
            alert('Please add sections to export');
            return;
        }
        try {
            googleDocsExportBtn.disabled = true;
            googleDocsExportBtn.textContent = 'Exporting...';
            await googleDocsExporterFn();
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            googleDocsExportBtn.disabled = false;
            googleDocsExportBtn.textContent = 'Copy to Google Docs';
        }
    });
}

export function setupEventListeners(canvas, sectionLibrary, viewportBtns, importBtn, importFile, deleteAllBtn, undoBtn, redoBtn, toggleSidebarBtn, sidebar, handleImportFn) {
    // Section library clicks with debounce
    let addSectionTimeout;
    if (sectionLibrary) {
        sectionLibrary.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const btn = e.target.closest('.section-btn');
            if (btn && !btn.disabled) {
                const sectionType = btn.dataset.section;
                if (addSectionTimeout) return;
                btn.disabled = true;
                addSectionTimeout = setTimeout(() => {
                    addSectionTimeout = null;
                    btn.disabled = false;
                }, 300);
                addSection(sectionType);
            }
        });
    }

    viewportBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            viewportBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.currentViewport = btn.dataset.viewport;
            canvas.className = `canvas ${state.currentViewport}`;
        });
    });

    if (importBtn && importFile) {
        importBtn.addEventListener('click', () => importFile.click());
        importFile.addEventListener('change', handleImportFn);
    }

    // deleteAllBtn is handled in app.js to avoid circular import

    if (undoBtn) undoBtn.addEventListener('click', undo);
    if (redoBtn) redoBtn.addEventListener('click', redo);

    if (toggleSidebarBtn && sidebar) {
        toggleSidebarBtn.addEventListener('click', () => {
            sidebar.classList.toggle('hidden');
            toggleSidebarBtn.classList.toggle('active');
            const isHidden = sidebar.classList.contains('hidden');
            toggleSidebarBtn.setAttribute('aria-label', isHidden ? 'Show sidebar' : 'Hide sidebar');
            toggleSidebarBtn.setAttribute('aria-expanded', !isHidden);
        });
    }

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            undo();
        } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
            e.preventDefault();
            redo();
        }
    });
}

// Export functions
export function exportJSON() {
    try {
        saveContentFromEditable();
        const exportData = {
            version: '1.2',
            created: new Date().toISOString(),
            viewport: state.currentViewport,
            sections: state.sections,
            images: exportImages(state.sections)
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wireframe-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Export error:', error);
        alert('Error exporting wireframe. Please try again.');
    }
}

export async function exportAsImage(canvas) {
    const wireframe = canvas.querySelector('.wireframe-container');
    if (!wireframe) {
        alert('Please add sections to export');
        return;
    }

    if (typeof html2canvas === 'undefined') {
        alert('Image export library not loaded. Please refresh the page and try again.');
        return;
    }

    const exportImageBtn = document.getElementById('exportImageBtn');
    try {
        exportImageBtn.disabled = true;
        exportImageBtn.textContent = 'Generating...';

        const controls = wireframe.querySelectorAll('.section-controls, .drag-handle');
        controls.forEach(el => el.style.display = 'none');
        saveContentFromEditable();

        const canvasImg = await html2canvas(wireframe, {
            backgroundColor: '#ffffff',
            scale: 2,
            logging: false,
            useCORS: true,
            allowTaint: true
        });

        controls.forEach(el => el.style.display = '');

        canvasImg.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `wireframe-${new Date().toISOString().split('T')[0]}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            exportImageBtn.disabled = false;
            exportImageBtn.textContent = 'Export as Image';
        }, 'image/png');
    } catch (error) {
        console.error('Export error:', error);
        alert('Error exporting image: ' + error.message);
        exportImageBtn.disabled = false;
        exportImageBtn.textContent = 'Export as Image';
    }
}

export function handleImport(e, updateCanvasFn) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            if (!data.sections || !Array.isArray(data.sections)) {
                throw new Error('Invalid file format');
            }
            data.sections.forEach(section => {
                if (!section.type || !sectionTemplates[section.type]) {
                    throw new Error(`Invalid section type: ${section.type}`);
                }
                if (!['light', 'dark'].includes(section.variant)) {
                    section.variant = 'light';
                }
                if (!section.content || typeof section.content !== 'object') {
                    section.content = {};
                }
            });
            if (data.images) {
                importImages(data.images);
            }
            state.sections = data.sections;
            updateCanvasFn();
            alert('Wireframe imported successfully!');
        } catch (error) {
            console.error('Import error:', error);
            alert('Error importing file: ' + error.message);
        }
    };
    reader.readAsText(file);
    e.target.value = '';
}
