// Secure Wireframe Builder - Main Application
(function() {
    'use strict';

    // HTML Sanitization utility
    const sanitizeHTML = (str) => {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    };

    // Escape HTML for safe display
    const escapeHtml = (unsafe) => {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };
    
    // Unescape HTML entities for export
    const unescapeHtml = (safe) => {
        const temp = document.createElement('div');
        temp.innerHTML = safe;
        return temp.textContent || temp.innerText || '';
    };

    // State management
    const state = {
        sections: [],
        currentViewport: 'desktop',
        history: [],
        historyIndex: -1,
        maxHistorySize: 50
    };

    // DOM elements - will be initialized after DOM is ready
    let canvas, sectionLibrary, viewportBtns, exportDropdownBtn, exportMenu;
    let exportBtn, importBtn, importFile, exportImageBtn, googleDocsExportBtn;
    let deleteAllBtn, undoBtn, redoBtn, toggleSidebarBtn, sidebar;
    
    // Initialize DOM elements
    function initializeDOMElements() {
        canvas = document.getElementById('canvas');
        sectionLibrary = document.querySelector('.sidebar-content') || document.querySelector('.section-library');
        viewportBtns = document.querySelectorAll('.viewport-btn');
        exportDropdownBtn = document.getElementById('exportDropdownBtn');
        exportMenu = document.getElementById('exportMenu');
        exportBtn = document.getElementById('exportBtn');
        importBtn = document.getElementById('importBtn');
        importFile = document.getElementById('importFile');
        exportImageBtn = document.getElementById('exportImageBtn');
        googleDocsExportBtn = document.getElementById('googleDocsExportBtn');
        deleteAllBtn = document.getElementById('deleteAllBtn');
        undoBtn = document.getElementById('undoBtn');
        redoBtn = document.getElementById('redoBtn');
        toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
        sidebar = document.querySelector('.sidebar');
    }

    // Section templates with secure rendering
    const sectionTemplates = {
        'content-cta': {
            name: 'Content + CTA',
            variants: ['light', 'dark'],
            render: (variant = 'light', content = {}, layoutDirection = null, visibility = {}) => {
                const defaults = {
                    eyebrow: 'Why Choose Us',
                    title: 'Your Future Starts Here',
                    body: 'Join 10,000+ graduates now thriving in their careers. Experience personalized mentorship, industry connections, and a 97% job placement rate.',
                    ctaText: 'Get Started'
                };
                const data = { ...defaults, ...content };
                
                // Sanitize all user content
                Object.keys(data).forEach(key => {
                    if (typeof data[key] === 'string') {
                        data[key] = escapeHtml(data[key]);
                    }
                });
                
                return `
                    <div class="section content-cta ${variant}" data-section-type="content-cta">
                        <div class="section-container">
                            <div class="section-header">
                                ${renderIfVisible('eyebrow', `<div class="eyebrow editable" contenteditable="true" data-field="eyebrow">${data.eyebrow}</div>`, visibility)}
                                ${renderIfVisible('title', `<h2 class="section-title editable" contenteditable="true" data-field="title">${data.title}</h2>`, visibility)}
                            </div>
                            ${renderIfVisible('body', `<div class="body-content editable" contenteditable="true" data-field="body">${data.body}</div>`, visibility)}
                            ${renderIfVisible('ctaText', `<a href="#" class="cta-button editable" contenteditable="true" data-field="ctaText">${data.ctaText}</a>`, visibility)}
                        </div>
                        <div class="drag-handle" draggable="true" aria-label="Drag to reorder section">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                                <path d="M9 3h6M9 7h6M9 11h6M9 15h6M9 19h6" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </div>
                        <div class="section-controls">
                            <button class="control-btn duplicate-btn" aria-label="Duplicate section">Duplicate</button>
                            <button class="control-btn variant-btn" aria-label="Toggle theme variant">Toggle Theme</button>
                            <button class="control-btn customize-btn" aria-label="Customize elements">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                                Customize
                            </button>
                            <button class="control-btn delete delete-btn" aria-label="Delete section">Delete</button>
                        </div>
                    </div>
                `;
            }
        },
        'three-column': {
            name: 'Three Column Features',
            variants: ['light', 'dark'],
            render: (variant = 'light', content = {}, layoutDirection = null, visibility = {}) => {
                const defaults = {
                    eyebrow: 'Why Choose Us',
                    title: 'Built for Your Success',
                    subtitle: 'Three reasons why 97% of our graduates land jobs within 6 months.',
                    columns: [
                        {
                            title: 'Industry-Expert Faculty',
                            description: 'Learn from professionals actively working in your field.'
                        },
                        {
                            title: 'Career Placement Team',
                            description: 'Dedicated advisors connect you with top employers.'
                        },
                        {
                            title: 'Flexible Schedules',
                            description: 'Online, evening, and weekend options for working adults.'
                        }
                    ],
                    ctaText: 'Learn More'
                };
                const data = { ...defaults, ...content };
                
                // Sanitize all content
                if (typeof data.eyebrow === 'string') data.eyebrow = escapeHtml(data.eyebrow);
                if (typeof data.title === 'string') data.title = escapeHtml(data.title);
                if (typeof data.subtitle === 'string') data.subtitle = escapeHtml(data.subtitle);
                if (typeof data.ctaText === 'string') data.ctaText = escapeHtml(data.ctaText);
                
                data.columns = data.columns.map(col => ({
                    title: escapeHtml(col.title || ''),
                    description: escapeHtml(col.description || '')
                }));
                
                return `
                    <div class="section three-column ${variant}" data-section-type="three-column">
                        <div class="section-container">
                            <div class="section-header">
                                ${renderIfVisible('eyebrow', `<div class="eyebrow editable" contenteditable="true" data-field="eyebrow">${data.eyebrow}</div>`, visibility)}
                                ${renderIfVisible('title', `<h2 class="section-title editable" contenteditable="true" data-field="title">${data.title}</h2>`, visibility)}
                                ${renderIfVisible('subtitle', `<p class="section-subtitle editable" contenteditable="true" data-field="subtitle">${data.subtitle}</p>`, visibility)}
                            </div>
                            <div class="three-column-grid">
                                ${data.columns.map((col, i) => `
                                    <div class="column-item" data-column-index="${i}">
                                        <div class="column-image">Mountain Graphic</div>
                                        <h3 class="column-title editable" contenteditable="true" data-field="column-title-${i}">${col.title}</h3>
                                        <p class="column-description editable" contenteditable="true" data-field="column-description-${i}">${col.description}</p>
                                    </div>
                                `).join('')}
                            </div>
                            ${renderIfVisible('ctaText', `<div style="text-align: center;">
                                <a href="#" class="cta-button editable" contenteditable="true" data-field="ctaText">${data.ctaText}</a>
                            </div>`, visibility)}
                        </div>
                        <div class="drag-handle" draggable="true" aria-label="Drag to reorder section">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                                <path d="M9 3h6M9 7h6M9 11h6M9 15h6M9 19h6" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </div>
                        <div class="section-controls">
                            <button class="control-btn duplicate-btn" aria-label="Duplicate section">Duplicate</button>
                            <button class="control-btn variant-btn" aria-label="Toggle theme variant">Toggle Theme</button>
                            <button class="control-btn customize-btn" aria-label="Customize elements">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                                Customize
                            </button>
                            <button class="control-btn delete delete-btn" aria-label="Delete section">Delete</button>
                        </div>
                    </div>
                `;
            }
        },
        'statistics': {
            name: 'Statistics/Numbers',
            variants: ['light', 'dark'],
            render: (variant = 'light', content = {}, layoutDirection = null, visibility = {}) => {
                const defaults = {
                    eyebrow: 'Our Impact',
                    title: 'Success by the Numbers',
                    subtitle: 'Data-driven results that showcase our commitment to student achievement.',
                    stats: [
                        { number: '97%', label: 'Job Placement' },
                        { number: '4.8/5', label: 'Student Rating' },
                        { number: '45K+', label: 'Alumni Network' }
                    ],
                    ctaText: 'View Stats'
                };
                const data = { ...defaults, ...content };
                
                // Sanitize all content
                if (typeof data.eyebrow === 'string') data.eyebrow = escapeHtml(data.eyebrow);
                if (typeof data.title === 'string') data.title = escapeHtml(data.title);
                if (typeof data.subtitle === 'string') data.subtitle = escapeHtml(data.subtitle);
                if (typeof data.ctaText === 'string') data.ctaText = escapeHtml(data.ctaText);
                
                data.stats = data.stats.map(stat => ({
                    number: escapeHtml(stat.number || ''),
                    label: escapeHtml(stat.label || '')
                }));
                
                return `
                    <div class="section statistics ${variant}" data-section-type="statistics">
                        <div class="section-container">
                            <div class="section-header">
                                ${renderIfVisible('eyebrow', `<div class="eyebrow editable" contenteditable="true" data-field="eyebrow">${data.eyebrow}</div>`, visibility)}
                                ${renderIfVisible('title', `<h2 class="section-title editable" contenteditable="true" data-field="title">${data.title}</h2>`, visibility)}
                                ${renderIfVisible('subtitle', `<p class="section-subtitle editable" contenteditable="true" data-field="subtitle">${data.subtitle}</p>`, visibility)}
                            </div>
                            <div class="stats-grid">
                                ${data.stats.map((stat, i) => `
                                    <div class="stat-item" data-stat-index="${i}">
                                        <div class="stat-number editable" contenteditable="true" data-field="stat-number-${i}">${stat.number}</div>
                                        <div class="stat-label editable" contenteditable="true" data-field="stat-label-${i}">${stat.label}</div>
                                    </div>
                                `).join('')}
                            </div>
                            ${renderIfVisible('ctaText', `<div style="text-align: center; margin-top: 2rem;">
                                <a href="#" class="cta-button editable" contenteditable="true" data-field="ctaText">${data.ctaText}</a>
                            </div>`, visibility)}
                        </div>
                        <div class="drag-handle" draggable="true" aria-label="Drag to reorder section">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                                <path d="M9 3h6M9 7h6M9 11h6M9 15h6M9 19h6" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </div>
                        <div class="section-controls">
                            <button class="control-btn duplicate-btn" aria-label="Duplicate section">Duplicate</button>
                            <button class="control-btn variant-btn" aria-label="Toggle theme variant">Toggle Theme</button>
                            <button class="control-btn customize-btn" aria-label="Customize elements">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                                Customize
                            </button>
                            <button class="control-btn delete delete-btn" aria-label="Delete section">Delete</button>
                        </div>
                    </div>
                `;
            }
        },
        'program-cards': {
            name: 'Program Cards',
            variants: ['light', 'dark'],
            render: (variant = 'light', content = {}, layoutDirection = null, visibility = {}) => {
                const defaults = {
                    eyebrow: 'Popular Programs',
                    title: 'Find Your Path to Success',
                    subtitle: 'Explore our most in-demand programs designed to launch your career.',
                    programs: [
                        { 
                            title: 'Business Administration MBA',
                            description: 'Launch into C-suite roles with our AACSB-accredited program.'
                        },
                        { 
                            title: 'Computer Science B.S.',
                            description: 'Join the tech revolution with guaranteed internships at top firms.'
                        },
                        { 
                            title: 'Healthcare Management',
                            description: 'Lead the future of healthcare in our fastest-growing field.'
                        }
                    ],
                    ctaText: 'Explore All Programs'
                };
                const data = { ...defaults, ...content };
                
                // Sanitize all content
                if (typeof data.eyebrow === 'string') data.eyebrow = escapeHtml(data.eyebrow);
                if (typeof data.title === 'string') data.title = escapeHtml(data.title);
                if (typeof data.subtitle === 'string') data.subtitle = escapeHtml(data.subtitle);
                if (typeof data.ctaText === 'string') data.ctaText = escapeHtml(data.ctaText);
                
                data.programs = data.programs.map(program => ({
                    title: escapeHtml(program.title || ''),
                    description: escapeHtml(program.description || '')
                }));
                
                return `
                    <div class="section program-cards ${variant}" data-section-type="program-cards">
                        <div class="section-container">
                            <div class="section-header">
                                ${renderIfVisible('eyebrow', `<div class="eyebrow editable" contenteditable="true" data-field="eyebrow">${data.eyebrow}</div>`, visibility)}
                                ${renderIfVisible('title', `<h2 class="section-title editable" contenteditable="true" data-field="title">${data.title}</h2>`, visibility)}
                                ${renderIfVisible('subtitle', `<p class="section-subtitle editable" contenteditable="true" data-field="subtitle">${data.subtitle}</p>`, visibility)}
                            </div>
                            <div class="program-grid">
                                ${data.programs.map((program, i) => `
                                    <div class="program-card" data-program-index="${i}">
                                        <div class="program-image">Mountain Graphic</div>
                                        <div class="program-content">
                                            <h3 class="program-title editable" contenteditable="true" data-field="program-title-${i}">${program.title}</h3>
                                            <p class="program-description editable" contenteditable="true" data-field="program-description-${i}">${program.description}</p>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                            ${renderIfVisible('ctaText', `<div style="text-align: center; margin-top: 2rem;">
                                <a href="#" class="cta-button editable" contenteditable="true" data-field="ctaText">${data.ctaText}</a>
                            </div>`, visibility)}
                        </div>
                        <div class="drag-handle" draggable="true" aria-label="Drag to reorder section">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                                <path d="M9 3h6M9 7h6M9 11h6M9 15h6M9 19h6" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </div>
                        <div class="section-controls">
                            <button class="control-btn duplicate-btn" aria-label="Duplicate section">Duplicate</button>
                            <button class="control-btn variant-btn" aria-label="Toggle theme variant">Toggle Theme</button>
                            <button class="control-btn customize-btn" aria-label="Customize elements">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                                Customize
                            </button>
                            <button class="control-btn delete delete-btn" aria-label="Delete section">Delete</button>
                        </div>
                    </div>
                `;
            }
        },
        'lead-form': {
            name: 'Lead Generation Form',
            variants: ['light', 'dark'],
            render: (variant = 'light', content = {}, layoutDirection = 'normal', visibility = {}) => {
                const defaults = {
                    eyebrow: 'Get Started',
                    title: 'Request Information',
                    description: 'Connect with an advisor within 24 hours.',
                    fields: [
                        { id: 'field_default_1', label: 'First Name', type: 'text', required: true },
                        { id: 'field_default_2', label: 'Last Name', type: 'text', required: true },
                        { id: 'field_default_3', label: 'Email', type: 'email', required: true },
                        { id: 'field_default_4', label: 'Phone', type: 'tel', required: false },
                        { id: 'field_default_5', label: 'Birth Date', type: 'date', required: false }
                    ],
                    submitText: 'Submit'
                };
                const data = { ...defaults, ...content };
                
                // Sanitize all content
                if (typeof data.eyebrow === 'string') data.eyebrow = escapeHtml(data.eyebrow);
                if (typeof data.title === 'string') data.title = escapeHtml(data.title);
                if (typeof data.description === 'string') data.description = escapeHtml(data.description);
                if (typeof data.submitText === 'string') data.submitText = escapeHtml(data.submitText);
                
                // Ensure fields have proper structure and sanitization
                data.fields = data.fields.map(field => ({
                    ...field,
                    label: escapeHtml(field.label || ''),
                    placeholder: field.placeholder ? escapeHtml(field.placeholder) : '',
                    helpText: field.helpText ? escapeHtml(field.helpText) : '',
                    options: field.options ? field.options.map(opt => escapeHtml(opt)) : undefined
                }));
                
                return `
                    <div class="section lead-form ${variant}" data-section-type="lead-form">
                        <div class="section-container">
                            <div class="form-layout ${layoutDirection === 'reversed' ? 'reversed' : ''}">
                                <div class="form-content">
                                    <div class="form-header">
                                        ${renderIfVisible('eyebrow', `<div class="eyebrow editable" contenteditable="true" data-field="eyebrow">${data.eyebrow}</div>`, visibility)}
                                        ${renderIfVisible('title', `<h2 class="section-title editable" contenteditable="true" data-field="title">${data.title}</h2>`, visibility)}
                                        ${renderIfVisible('description', `<p class="form-description editable" contenteditable="true" data-field="description">${data.description}</p>`, visibility)}
                                    </div>
                                    <form class="lead-generation-form" onsubmit="return false;">
                                        ${data.fields.map((field, i) => {
                                            let fieldHtml = '<div class="form-field">';
                                            fieldHtml += `<label for="field-${i}">${field.label}${field.required ? ' *' : ''}</label>`;
                                            
                                            // Render different field types
                                            switch (field.type) {
                                                case 'select':
                                                    fieldHtml += `<select id="field-${i}" ${field.required ? 'required' : ''} aria-required="${field.required}">`;
                                                    fieldHtml += `<option value="">Select...</option>`;
                                                    if (field.options) {
                                                        field.options.forEach(option => {
                                                            fieldHtml += `<option value="${option}">${option}</option>`;
                                                        });
                                                    }
                                                    fieldHtml += `</select>`;
                                                    break;
                                                    
                                                case 'textarea':
                                                    fieldHtml += `<textarea id="field-${i}" placeholder="${field.placeholder || field.label}" rows="${field.rows || 4}" ${field.required ? 'required' : ''} aria-required="${field.required}"></textarea>`;
                                                    break;
                                                    
                                                case 'radio':
                                                    if (field.options) {
                                                        fieldHtml += '<div class="radio-group">';
                                                        field.options.forEach((option, optIndex) => {
                                                            fieldHtml += `
                                                                <label class="radio-label">
                                                                    <input type="radio" name="field-${i}" value="${option}" ${field.required && optIndex === 0 ? 'required' : ''}>
                                                                    ${option}
                                                                </label>
                                                            `;
                                                        });
                                                        fieldHtml += '</div>';
                                                    }
                                                    break;
                                                    
                                                case 'checkbox':
                                                    if (field.options && field.options.length > 1) {
                                                        fieldHtml += '<div class="checkbox-group">';
                                                        field.options.forEach((option) => {
                                                            fieldHtml += `
                                                                <label class="checkbox-label">
                                                                    <input type="checkbox" name="field-${i}" value="${option}">
                                                                    ${option}
                                                                </label>
                                                            `;
                                                        });
                                                        fieldHtml += '</div>';
                                                    } else {
                                                        fieldHtml = '<div class="form-field checkbox-single">';
                                                        fieldHtml += `
                                                            <label class="checkbox-label">
                                                                <input type="checkbox" id="field-${i}" ${field.required ? 'required' : ''}>
                                                                <span>${field.label}</span>
                                                            </label>
                                                        `;
                                                    }
                                                    break;
                                                    
                                                case 'consent':
                                                    fieldHtml = '<div class="form-field consent-field">';
                                                    fieldHtml += `
                                                        <label class="checkbox-label">
                                                            <input type="checkbox" id="field-${i}" ${field.required ? 'required' : ''}>
                                                            <span>${field.label}</span>
                                                        </label>
                                                    `;
                                                    break;
                                                    
                                                default:
                                                    // Standard input types (text, email, tel, number, date)
                                                    fieldHtml += `<input type="${field.type}" id="field-${i}" placeholder="${field.placeholder || field.label}" ${field.required ? 'required' : ''} aria-required="${field.required}"`;
                                                    if (field.type === 'number' && field.min !== null) fieldHtml += ` min="${field.min}"`;
                                                    if (field.type === 'number' && field.max !== null) fieldHtml += ` max="${field.max}"`;
                                                    fieldHtml += '>';
                                            }
                                            
                                            if (field.helpText) {
                                                fieldHtml += `<small class="field-help">${escapeHtml(field.helpText)}</small>`;
                                            }
                                            
                                            fieldHtml += '</div>';
                                            return fieldHtml;
                                        }).join('')}
                                        ${renderIfVisible('submitText', `<button type="submit" class="submit-btn editable" contenteditable="true" data-field="submitText">${data.submitText}</button>`, visibility)}
                                    </form>
                                </div>
                                <div class="form-image">
                                    <div class="decorative-graphic">Mountain Graphic</div>
                                </div>
                            </div>
                        </div>
                        <div class="drag-handle" draggable="true" aria-label="Drag to reorder section">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                                <path d="M9 3h6M9 7h6M9 11h6M9 15h6M9 19h6" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </div>
                        <div class="section-controls">
                            <button class="control-btn duplicate-btn" aria-label="Duplicate section">Duplicate</button>
                            <button class="control-btn variant-btn" aria-label="Toggle theme variant">Toggle Theme</button>
                            <button class="control-btn layout-btn" aria-label="Toggle layout direction">Toggle Layout</button>
                            <button class="control-btn form-edit-btn" aria-label="Edit form fields">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                                Edit Form
                            </button>
                            <button class="control-btn customize-btn" aria-label="Customize elements">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                                Customize
                            </button>
                            <button class="control-btn delete delete-btn" aria-label="Delete section">Delete</button>
                        </div>
                    </div>
                `;
            }
        },
        'testimonial-single': {
            name: 'Single Testimonial with Large Quote',
            variants: ['light', 'dark'],
            render: (variant = 'light', content = {}, layoutDirection = null, visibility = {}) => {
                const defaults = {
                    eyebrow: 'Student Success',
                    title: 'Real Stories, Real Results',
                    quote: 'The personalized mentorship I received transformed my career path. I went from uncertainty to landing my dream job at a Fortune 500 company before graduation. This program truly delivers on its promises.',
                    name: 'Sarah Johnson',
                    role: 'Computer Science, Class of 2024'
                };
                const data = { ...defaults, ...content };
                
                // Sanitize all content
                Object.keys(data).forEach(key => {
                    if (typeof data[key] === 'string') {
                        data[key] = escapeHtml(data[key]);
                    }
                });
                
                return `
                    <div class="section testimonial-single ${variant}" data-section-type="testimonial-single">
                        <div class="section-container">
                            <div class="testimonial-layout">
                                <div class="testimonial-image-large">
                                    <div class="profile-placeholder">Profile Image</div>
                                </div>
                                <div class="testimonial-content-large">
                                    <div class="testimonial-header">
                                        ${renderIfVisible('eyebrow', `<div class="eyebrow editable" contenteditable="true" data-field="eyebrow">${data.eyebrow}</div>`, visibility)}
                                        ${renderIfVisible('title', `<h2 class="section-title editable" contenteditable="true" data-field="title">${data.title}</h2>`, visibility)}
                                    </div>
                                    ${renderIfVisible('quote', `<blockquote class="testimonial-quote-large editable" contenteditable="true" data-field="quote">"${data.quote}"</blockquote>`, visibility)}
                                    <div class="testimonial-attribution">
                                        ${renderIfVisible('name', `<div class="testimonial-name editable" contenteditable="true" data-field="name">${data.name}</div>`, visibility)}
                                        ${renderIfVisible('role', `<div class="testimonial-role editable" contenteditable="true" data-field="role">${data.role}</div>`, visibility)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="drag-handle" draggable="true" aria-label="Drag to reorder section">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                                <path d="M9 3h6M9 7h6M9 11h6M9 15h6M9 19h6" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </div>
                        <div class="section-controls">
                            <button class="control-btn duplicate-btn" aria-label="Duplicate section">Duplicate</button>
                            <button class="control-btn variant-btn" aria-label="Toggle theme variant">Toggle Theme</button>
                            <button class="control-btn customize-btn" aria-label="Customize elements">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                                Customize
                            </button>
                            <button class="control-btn delete delete-btn" aria-label="Delete section">Delete</button>
                        </div>
                    </div>
                `;
            }
        },
        'testimonial-carousel': {
            name: 'Testimonial Carousel',
            variants: ['light', 'dark'],
            render: (variant = 'light', content = {}, layoutDirection = null, visibility = {}) => {
                const defaults = {
                    eyebrow: 'Student Stories',
                    title: 'Hear from Our Graduates',
                    testimonials: [
                        {
                            quote: 'The hands-on projects and industry mentors helped me land a job at Google before graduation.',
                            name: 'Michael Chen',
                            role: 'MBA 2023, Product Manager'
                        },
                        {
                            quote: 'Balancing work and school was seamless with evening classes. I doubled my salary in 18 months.',
                            name: 'Emily Rodriguez',
                            role: 'Healthcare Management 2024'
                        },
                        {
                            quote: 'Career services helped me pivot from retail to data science. Now I work at a Fortune 500.',
                            name: 'James Williams',
                            role: 'Data Science Certificate 2023'
                        }
                    ],
                    currentIndex: 0
                };
                const data = { ...defaults, ...content };
                
                // Sanitize all content
                if (typeof data.eyebrow === 'string') data.eyebrow = escapeHtml(data.eyebrow);
                if (typeof data.title === 'string') data.title = escapeHtml(data.title);
                
                // Only show first testimonial, sanitized
                const firstTestimonial = data.testimonials[0] || defaults.testimonials[0];
                const sanitizedTestimonial = {
                    quote: escapeHtml(firstTestimonial.quote || ''),
                    name: escapeHtml(firstTestimonial.name || ''),
                    role: escapeHtml(firstTestimonial.role || '')
                };
                
                return `
                    <div class="section testimonial-carousel ${variant}" data-section-type="testimonial-carousel">
                        <div class="section-container">
                            <div class="section-header">
                                ${renderIfVisible('eyebrow', `<div class="eyebrow editable" contenteditable="true" data-field="eyebrow">${data.eyebrow}</div>`, visibility)}
                                ${renderIfVisible('title', `<h2 class="section-title editable" contenteditable="true" data-field="title">${data.title}</h2>`, visibility)}
                            </div>
                            <div class="testimonial-carousel-container">
                                <div class="testimonial-slide active">
                                    <div class="testimonial-profile">
                                        <div class="profile-circle">Profile</div>
                                    </div>
                                    <blockquote class="testimonial-quote editable" contenteditable="true" data-field="testimonial-quote-0">"${sanitizedTestimonial.quote}"</blockquote>
                                    <div class="testimonial-info">
                                        <div class="testimonial-name editable" contenteditable="true" data-field="testimonial-name-0">${sanitizedTestimonial.name}</div>
                                        <div class="testimonial-role editable" contenteditable="true" data-field="testimonial-role-0">${sanitizedTestimonial.role}</div>
                                    </div>
                                </div>
                                <div class="carousel-dots">
                                    <span class="dot active"></span>
                                    <span class="dot"></span>
                                    <span class="dot"></span>
                                </div>
                            </div>
                        </div>
                        <div class="drag-handle" draggable="true" aria-label="Drag to reorder section">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                                <path d="M9 3h6M9 7h6M9 11h6M9 15h6M9 19h6" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </div>
                        <div class="section-controls">
                            <button class="control-btn duplicate-btn" aria-label="Duplicate section">Duplicate</button>
                            <button class="control-btn variant-btn" aria-label="Toggle theme variant">Toggle Theme</button>
                            <button class="control-btn customize-btn" aria-label="Customize elements">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                                Customize
                            </button>
                            <button class="control-btn delete delete-btn" aria-label="Delete section">Delete</button>
                        </div>
                    </div>
                `;
            }
        },
        'image-content': {
            name: 'Image + Content',
            variants: ['light', 'dark'],
            render: (variant = 'light', content = {}, layoutDirection = 'normal', visibility = {}) => {
                const defaults = {
                    eyebrow: 'Campus Life',
                    title: 'Visit Our Campus',
                    body: 'Located in the heart of the city, our campus blends modern facilities with a close-knit community feel.\n\n• Central location with public transit access\n• On-campus housing available\n• Dedicated student success center',
                    ctaText: 'Explore Programs'
                };
                const data = { ...defaults, ...content };
                
                // Sanitize all user content
                Object.keys(data).forEach(key => {
                    if (typeof data[key] === 'string') {
                        data[key] = escapeHtml(data[key]);
                    }
                });
                
                // Preserve line breaks in body content
                const formattedBody = data.body.replace(/\n/g, '<br>');
                
                return `
                    <div class="section image-content ${variant}" data-section-type="image-content">
                        <div class="section-container">
                            <div class="image-content-grid ${layoutDirection === 'reversed' ? 'reversed' : ''}">
                                <div class="image-column">
                                    <div class="content-image">Mountain Graphic</div>
                                </div>
                                <div class="content-column">
                                    ${renderIfVisible('eyebrow', `<div class="eyebrow editable" contenteditable="true" data-field="eyebrow">${data.eyebrow}</div>`, visibility)}
                                    ${renderIfVisible('title', `<h2 class="section-title editable" contenteditable="true" data-field="title">${data.title}</h2>`, visibility)}
                                    ${renderIfVisible('body', `<div class="body-content editable" contenteditable="true" data-field="body">${formattedBody}</div>`, visibility)}
                                    ${renderIfVisible('ctaText', `<a href="#" class="cta-button editable" contenteditable="true" data-field="ctaText">${data.ctaText}</a>`, visibility)}
                                </div>
                            </div>
                        </div>
                        <div class="drag-handle" draggable="true" aria-label="Drag to reorder section">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                                <path d="M9 3h6M9 7h6M9 11h6M9 15h6M9 19h6" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </div>
                        <div class="section-controls">
                            <button class="control-btn duplicate-btn" aria-label="Duplicate section">Duplicate</button>
                            <button class="control-btn variant-btn" aria-label="Toggle theme variant">Toggle Theme</button>
                            <button class="control-btn layout-btn" aria-label="Toggle layout direction">Toggle Layout</button>
                            <button class="control-btn customize-btn" aria-label="Customize elements">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                                Customize
                            </button>
                            <button class="control-btn delete delete-btn" aria-label="Delete section">Delete</button>
                        </div>
                    </div>
                `;
            }
        }
    };

    // Get default visibility settings for a section type
    function getDefaultVisibility(sectionType) {
        const commonFields = {
            eyebrow: true,
            title: true,
            body: true,
            ctaText: true
        };
        
        switch(sectionType) {
            case 'content-cta':
            case 'image-content':
                return { ...commonFields };
                
            case 'three-column':
            case 'statistics':
            case 'programs':
            case 'program-cards':
                return {
                    eyebrow: true,
                    title: true,
                    subtitle: true,
                    ctaText: true
                };
                
            case 'lead-form':
                return {
                    eyebrow: true,
                    title: true,
                    description: true,
                    submitText: true
                };
                
            case 'testimonial-single':
                return {
                    eyebrow: true,
                    title: true,
                    quote: true,
                    name: true,
                    role: true
                };
                
            case 'testimonial-carousel':
                return {
                    eyebrow: true,
                    title: true
                };
                
            default:
                return commonFields;
        }
    }
    
    // Get element labels for display in the popover
    function getElementLabels(sectionType) {
        // Return labels specific to each section type
        switch(sectionType) {
            case 'lead-form':
                return {
                    eyebrow: 'Eyebrow Text',
                    title: 'Heading',
                    description: 'Description',
                    submitText: 'Submit Button'
                };
            case 'testimonial-single':
                return {
                    eyebrow: 'Eyebrow Text',
                    title: 'Heading',
                    quote: 'Testimonial Quote',
                    name: 'Author Name',
                    role: 'Author Role'
                };
            case 'testimonial-carousel':
                return {
                    eyebrow: 'Eyebrow Text',
                    title: 'Heading'
                };
            case 'three-column':
            case 'statistics':
            case 'programs':
            case 'program-cards':
                return {
                    eyebrow: 'Eyebrow Text',
                    title: 'Heading',
                    subtitle: 'Subtitle',
                    ctaText: 'CTA Button'
                };
            case 'content-cta':
            case 'image-content':
            default:
                return {
                    eyebrow: 'Eyebrow Text',
                    title: 'Heading',
                    body: 'Body Content',
                    ctaText: 'CTA Button'
                };
        }
    }
    
    // Helper function to conditionally render elements based on visibility
    function renderIfVisible(field, html, visibility) {
        if (!visibility || visibility[field] !== false) {
            return html;
        }
        return '';
    }

    // Event handling with proper delegation
    const eventHandlers = {
        duplicateSection: function(btn) {
            const section = btn.closest('.section');
            const index = Array.from(canvas.querySelectorAll('.section')).indexOf(section);
            
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
        
        toggleVariant: function(btn) {
            const section = btn.closest('.section');
            const index = Array.from(canvas.querySelectorAll('.section')).indexOf(section);
            
            if (state.sections[index]) {
                state.sections[index].variant = state.sections[index].variant === 'light' ? 'dark' : 'light';
                updateCanvas();
            }
        },
        
        toggleLayout: function(btn) {
            const section = btn.closest('.section');
            const index = Array.from(canvas.querySelectorAll('.section')).indexOf(section);
            
            if (state.sections[index] && state.sections[index].layoutDirection !== undefined) {
                state.sections[index].layoutDirection = state.sections[index].layoutDirection === 'normal' ? 'reversed' : 'normal';
                updateCanvas();
            }
        },
        
        deleteSection: function(btn) {
            const section = btn.closest('.section');
            const index = Array.from(canvas.querySelectorAll('.section')).indexOf(section);
            
            if (confirm('Are you sure you want to delete this section?')) {
                state.sections.splice(index, 1);
                updateCanvas();
            }
        },
        
        toggleCustomizePopover: function(btn) {
            const section = btn.closest('.section');
            const index = Array.from(canvas.querySelectorAll('.section')).indexOf(section);
            
            if (!state.sections[index]) return;
            
            // Check if popover already exists
            let popover = btn.parentElement.querySelector('.visibility-popover');
            
            if (!popover) {
                // Create popover
                popover = document.createElement('div');
                popover.className = 'visibility-popover';
                
                const sectionData = state.sections[index];
                const visibility = sectionData.visibility || getDefaultVisibility(sectionData.type);
                const labels = getElementLabels(sectionData.type);
                
                // Build popover content
                let optionsHtml = '';
                Object.keys(visibility).forEach(field => {
                    if (labels[field]) {
                        optionsHtml += `
                            <div class="visibility-option">
                                <input type="checkbox" id="vis-${index}-${field}" 
                                       data-field="${field}" 
                                       ${visibility[field] ? 'checked' : ''}>
                                <label for="vis-${index}-${field}">${labels[field]}</label>
                            </div>
                        `;
                    }
                });
                
                popover.innerHTML = `
                    <div class="visibility-popover-header">Show/Hide Elements</div>
                    <div class="visibility-options">
                        ${optionsHtml}
                    </div>
                    <div class="visibility-actions">
                        <button class="visibility-action-btn show-all-btn">Show All</button>
                        <button class="visibility-action-btn hide-all-btn">Hide All</button>
                    </div>
                `;
                
                // Add popover to the section controls container
                btn.parentElement.appendChild(popover);
                
                // Add event listeners to checkboxes
                popover.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                    checkbox.addEventListener('change', (e) => {
                        const field = e.target.dataset.field;
                        
                        // Initialize visibility if it doesn't exist
                        if (!state.sections[index].visibility) {
                            state.sections[index].visibility = getDefaultVisibility(sectionData.type);
                        }
                        
                        state.sections[index].visibility[field] = e.target.checked;
                        updateCanvas();
                    });
                });
                
                // Show All button
                popover.querySelector('.show-all-btn').addEventListener('click', () => {
                    if (!state.sections[index].visibility) {
                        state.sections[index].visibility = getDefaultVisibility(sectionData.type);
                    }
                    
                    Object.keys(state.sections[index].visibility).forEach(field => {
                        state.sections[index].visibility[field] = true;
                    });
                    
                    popover.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                        checkbox.checked = true;
                    });
                    
                    updateCanvas();
                });
                
                // Hide All button
                popover.querySelector('.hide-all-btn').addEventListener('click', () => {
                    if (!state.sections[index].visibility) {
                        state.sections[index].visibility = getDefaultVisibility(sectionData.type);
                    }
                    
                    // Keep title visible as it's usually required
                    Object.keys(state.sections[index].visibility).forEach(field => {
                        state.sections[index].visibility[field] = field === 'title';
                    });
                    
                    popover.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                        const field = checkbox.dataset.field;
                        checkbox.checked = field === 'title';
                    });
                    
                    updateCanvas();
                });
            }
            
            // Toggle active state
            popover.classList.toggle('active');
        }
    };

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
        initializeDOMElements();
        setupEventListeners();
        initializeGuidance();
        initializeDragAndDrop();
        // Export dropdown is now handled in setupEventListeners
        // addFormSettingsButton(); // Commented out - form settings accessed via section controls
        setupSidebarEnhancements();
        updateCanvas(false);
        saveToHistory();
    });

    // Event listeners setup
    function setupEventListeners() {
        // Check if elements exist before adding listeners
        if (!canvas) {
            console.error('Canvas element not found');
            return;
        }
        
        // Section library clicks with debounce
        let addSectionTimeout;
        if (sectionLibrary) {
            sectionLibrary.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const btn = e.target.closest('.section-btn');
            if (btn && !btn.disabled) {
                const sectionType = btn.dataset.section;
                
                // Debounce to prevent double clicks
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

        // Viewport controls
        viewportBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                viewportBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.currentViewport = btn.dataset.viewport;
                canvas.className = `canvas ${state.currentViewport}`;
            });
        });

        // Setup export dropdown
        setupExportDropdown();
        
        // Import with error handling
        if (importBtn && importFile) {
            importBtn.addEventListener('click', () => importFile.click());
            importFile.addEventListener('change', handleImport);
        }
        
        if (deleteAllBtn) {
            deleteAllBtn.addEventListener('click', deleteAllSections);
        }
        
        // Undo/Redo
        if (undoBtn) {
            undoBtn.addEventListener('click', undo);
        }
        if (redoBtn) {
            redoBtn.addEventListener('click', redo);
        }
        
        // Toggle sidebar
        if (toggleSidebarBtn && sidebar) {
            toggleSidebarBtn.addEventListener('click', () => {
                sidebar.classList.toggle('hidden');
                toggleSidebarBtn.classList.toggle('active');
                
                // Update toggle button aria-label
                const isHidden = sidebar.classList.contains('hidden');
                toggleSidebarBtn.setAttribute('aria-label', isHidden ? 'Show sidebar' : 'Hide sidebar');
                toggleSidebarBtn.setAttribute('aria-expanded', !isHidden);
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                undo();
            } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault();
                redo();
            }
        });

        // Event delegation for section controls
        canvas.addEventListener('click', (e) => {
            if (e.target.classList.contains('duplicate-btn')) {
                eventHandlers.duplicateSection(e.target);
            } else if (e.target.classList.contains('variant-btn')) {
                eventHandlers.toggleVariant(e.target);
            } else if (e.target.classList.contains('layout-btn')) {
                eventHandlers.toggleLayout(e.target);
            } else if (e.target.classList.contains('form-edit-btn') || e.target.closest('.form-edit-btn')) {
                const btn = e.target.closest('.form-edit-btn') || e.target;
                const section = btn.closest('.section');
                const sections = Array.from(canvas.querySelectorAll('.section'));
                const sectionIndex = sections.indexOf(section);
                if (sectionIndex !== -1 && state.sections[sectionIndex].type === 'lead-form') {
                    formBuilder.open(sectionIndex);
                }
            } else if (e.target.classList.contains('customize-btn') || e.target.closest('.customize-btn')) {
                const btn = e.target.closest('.customize-btn') || e.target;
                eventHandlers.toggleCustomizePopover(btn);
            } else if (e.target.classList.contains('delete-btn')) {
                eventHandlers.deleteSection(e.target);
            }
        });
        
        // Close popovers when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.visibility-popover') && !e.target.closest('.customize-btn')) {
                document.querySelectorAll('.visibility-popover').forEach(popover => {
                    popover.classList.remove('active');
                });
            }
        });

        // Prevent HTML injection in contenteditable
        canvas.addEventListener('paste', (e) => {
            if (e.target.contentEditable === 'true') {
                e.preventDefault();
                const text = (e.clipboardData || window.clipboardData).getData('text');
                document.execCommand('insertText', false, text);
            }
        });

        // Save content on blur
        canvas.addEventListener('blur', (e) => {
            if (e.target.contentEditable === 'true') {
                saveContentFromEditable();
            }
        }, true);
    }

    // Add section to canvas
    function addSection(type, variant = 'light', content = {}) {
        const template = sectionTemplates[type];
        if (!template) return;

        // For lead-form sections, ensure default fields are included
        if (type === 'lead-form' && !content.fields) {
            content = {
                ...content,
                fields: [
                    { id: 'field_default_1', label: 'First Name', type: 'text', required: true },
                    { id: 'field_default_2', label: 'Last Name', type: 'text', required: true },
                    { id: 'field_default_3', label: 'Email', type: 'email', required: true },
                    { id: 'field_default_4', label: 'Phone', type: 'tel', required: false },
                    { id: 'field_default_5', label: 'Birth Date', type: 'date', required: false }
                ]
            };
        }

        const sectionData = {
            id: Date.now(),
            type,
            variant,
            content,
            visibility: getDefaultVisibility(type) // Add default visibility settings
        };
        
        // Add layoutDirection for sections that support it
        if (type === 'lead-form' || type === 'image-content') {
            sectionData.layoutDirection = 'normal';
        }

        state.sections.push(sectionData);
        updateCanvas();
    }

    // Update canvas with current sections
    function updateCanvas(saveHistory = true) {
        if (state.sections.length === 0) {
            canvas.innerHTML = '<div class="empty-state"><p>Click a section from the library to get started</p></div>';
            updateFormSettingsVisibility();
            return;
        }

        const wireframeHtml = state.sections.map(section => {
            const template = sectionTemplates[section.type];
            const visibility = section.visibility || getDefaultVisibility(section.type);
            return template ? template.render(section.variant, section.content, section.layoutDirection, visibility) : '';
        }).join('');

        canvas.innerHTML = `<div class="wireframe-container">${wireframeHtml}</div>`;
        
        updateFormSettingsVisibility();
        
        if (saveHistory) {
            saveToHistory();
        }
    }

    // Save content from contenteditable elements
    function saveContentFromEditable() {
        const sections = canvas.querySelectorAll('.section');
        sections.forEach((section, index) => {
            if (!state.sections[index]) return;
            
            // Start with existing content to preserve non-editable data like form fields
            const content = { ...state.sections[index].content };
            const editables = section.querySelectorAll('[contenteditable="true"]');
            
            editables.forEach(editable => {
                const field = editable.dataset.field;
                if (field) {
                    // Store as plain text to prevent XSS
                    content[field] = editable.textContent.trim();
                }
            });
            
            // Handle special cases for arrays
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
            
            state.sections[index].content = content;
        });
    }

    // Export functions with error handling
    function exportJSON() {
        try {
            saveContentFromEditable();

            const exportData = {
                version: '1.1',
                created: new Date().toISOString(),
                viewport: state.currentViewport,
                sections: state.sections
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

    // Import with validation
    function handleImport(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                
                // Validate import data
                if (!data.sections || !Array.isArray(data.sections)) {
                    throw new Error('Invalid file format');
                }
                
                // Validate each section
                data.sections.forEach(section => {
                    if (!section.type || !sectionTemplates[section.type]) {
                        throw new Error(`Invalid section type: ${section.type}`);
                    }
                    
                    // Ensure variant is valid
                    if (!['light', 'dark'].includes(section.variant)) {
                        section.variant = 'light';
                    }
                    
                    // Ensure content exists
                    if (!section.content || typeof section.content !== 'object') {
                        section.content = {};
                    }
                });
                
                state.sections = data.sections;
                updateCanvas();
                alert('Wireframe imported successfully!');
            } catch (error) {
                console.error('Import error:', error);
                alert('Error importing file: ' + error.message);
            }
        };
        reader.readAsText(file);
        
        // Clear the input for re-use
        e.target.value = '';
    }

    // Export as image with error handling
    async function exportAsImage() {
        if (!canvas) {
            alert('Canvas not initialized');
            return;
        }
        const wireframe = canvas.querySelector('.wireframe-container');
        if (!wireframe) {
            alert('Please add sections to export');
            return;
        }

        // Check if html2canvas is available
        if (typeof html2canvas === 'undefined') {
            alert('Image export library not loaded. Please refresh the page and try again.');
            return;
        }

        try {
            exportImageBtn.disabled = true;
            exportImageBtn.textContent = 'Generating...';
            
            // Hide controls temporarily
            const controls = wireframe.querySelectorAll('.section-controls, .drag-handle');
            controls.forEach(el => el.style.display = 'none');
            
            // Save current content
            saveContentFromEditable();
            
            const canvas = await html2canvas(wireframe, {
                backgroundColor: '#ffffff',
                scale: 2,
                logging: false,
                useCORS: true,
                allowTaint: true
            });
            
            // Restore controls
            controls.forEach(el => el.style.display = '');
            
            canvas.toBlob(function(blob) {
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

    // Google Docs Export functionality
    // Replace YOUR_SCRIPT_ID with the actual deployed Apps Script ID
    const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/a/macros/visionpointmarketing.com/s/AKfycbxfYTH9X-jQkI0Pq8p75U7g6avUSDZz9EOUovQm69xH0JRDD2Uc8zx9sAH7JH7UzIRl/exec';
    
    /* Google Apps Script Code to deploy (paste this at script.google.com):
    
    function doGet(e) {
        try {
            // Get data from URL parameter
            const encodedData = e.parameter.data;
            if (!encodedData) {
                throw new Error('No data provided');
            }
            
            // Decode the data
            const jsonString = decodeURIComponent(Utilities.newBlob(Utilities.base64Decode(encodedData)).getDataAsString());
            const data = JSON.parse(jsonString);
            
            // Create the document
            const doc = DocumentApp.create(data.title);
            const body = doc.getBody();
            
            // Add title
            const title = body.appendParagraph(data.title);
            title.setHeading(DocumentApp.ParagraphHeading.HEADING1);
            
            // Add timestamp
            body.appendParagraph('Generated: ' + new Date().toLocaleString());
            body.appendParagraph('');
            
            // Add sections
            data.content.forEach((section, index) => {
                // Section header
                const sectionTitle = body.appendParagraph(`Section ${index + 1}: ${section.type}`);
                sectionTitle.setHeading(DocumentApp.ParagraphHeading.HEADING2);
                body.appendParagraph(`Theme: ${section.variant}`);
                body.appendParagraph('');
                
                // Section content
                section.content.forEach(item => {
                    if (item.value) {
                        const para = body.appendParagraph(`${item.label}: ${item.value}`);
                        para.setIndentFirstLine(20);
                    }
                });
                
                body.appendParagraph('');
                body.appendParagraph('---');
                body.appendParagraph('');
            });
            
            // Share the document with anyone who has the link
            doc.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
            
            // Get the URL and redirect to it
            const docUrl = doc.getUrl();
            
            // Return an HTML page that redirects to the document
            return HtmlService.createHtmlOutput(`
                <html>
                    <head>
                        <title>Creating Document...</title>
                        <meta http-equiv="refresh" content="0; url=${docUrl}">
                    </head>
                    <body>
                        <p>Creating your document... If you're not redirected, <a href="${docUrl}">click here</a>.</p>
                        <script>window.location.href = "${docUrl}";</script>
                    </body>
                </html>
            `);
            
        } catch (error) {
            // Return error page
            return HtmlService.createHtmlOutput(`
                <html>
                    <head><title>Error</title></head>
                    <body>
                        <h1>Error Creating Document</h1>
                        <p>${error.toString()}</p>
                        <p><button onclick="window.close()">Close Window</button></p>
                    </body>
                </html>
            `);
        }
    }
    */

    class GoogleDocsExporter {
        constructor() {
            this.SCRIPT_URL = GOOGLE_APPS_SCRIPT_URL;
        }
        
        async exportToGoogleDocs() {
            try {
                saveContentFromEditable();
                const docData = this.convertWireframeToDocFormat(state.sections);
                
                // Convert data to base64 to pass as URL parameter
                const encodedData = btoa(encodeURIComponent(JSON.stringify(docData)));
                
                // Use GET request with data as parameter (avoids CORS issues)
                const url = `${this.SCRIPT_URL}?data=${encodedData}`;
                
                // Open in new window/tab - this bypasses CORS completely
                const newWindow = window.open(url, '_blank');
                
                if (!newWindow) {
                    throw new Error('Popup blocked. Please allow popups for this site.');
                }
                
                // Show success message
                alert('Creating Google Doc... The document will open in a new tab.');
                
            } catch (error) {
                console.error('Export error:', error);
                alert('Error exporting to Google Docs: ' + error.message);
            }
        }
        
        convertWireframeToDocFormat(sections) {
            const timestamp = new Date().toLocaleString();
            const viewportInfo = `Viewport: ${state.currentViewport}`;
            
            return {
                title: `Landing Page Wireframe - ${new Date().toLocaleDateString()}`,
                content: sections.map(section => this.formatSectionContent(section))
            };
        }
        
        formatSectionContent(section) {
            const type = section.type;
            const content = section.content || {};
            const visibility = section.visibility || getDefaultVisibility(section.type);
            
            // Helper to filter out hidden fields
            const includeIfVisible = (field, label, value) => {
                if (visibility[field] !== false && value) {
                    return { label, value };
                }
                return null;
            };
            
            switch (type) {
                case 'content-cta':
                    return {
                        type: 'Content + CTA',
                        variant: section.variant,
                        content: [
                            includeIfVisible('eyebrow', 'Eyebrow', content.eyebrow),
                            includeIfVisible('title', 'Headline', content.title),
                            includeIfVisible('body', 'Body', content.body),
                            includeIfVisible('ctaText', 'CTA Text', content.ctaText)
                        ].filter(Boolean) // Remove null entries
                    };
                    
                case 'image-content':
                    return {
                        type: 'Image + Content',
                        variant: section.variant,
                        content: [
                            includeIfVisible('eyebrow', 'Eyebrow', content.eyebrow),
                            includeIfVisible('title', 'Headline', content.title),
                            includeIfVisible('body', 'Body', content.body),
                            includeIfVisible('ctaText', 'CTA Text', content.ctaText)
                        ].filter(Boolean)
                    };
                    
                case 'three-column':
                    return {
                        type: 'Three Column Features',
                        variant: section.variant,
                        content: [
                            includeIfVisible('eyebrow', 'Eyebrow', content.eyebrow),
                            includeIfVisible('title', 'Headline', content.title),
                            includeIfVisible('subtitle', 'Subtitle', content.subtitle),
                            ...(content.columns || []).map((col, i) => ({
                                label: `Column ${i + 1}`,
                                value: `Headline: ${col.title}\nSubhead: ${col.description}`
                            })),
                            includeIfVisible('ctaText', 'CTA Text', content.ctaText)
                        ].filter(Boolean)
                    };
                    
                case 'statistics':
                    return {
                        type: 'Statistics/Numbers',
                        variant: section.variant,
                        content: [
                            includeIfVisible('eyebrow', 'Eyebrow', content.eyebrow),
                            includeIfVisible('title', 'Headline', content.title),
                            includeIfVisible('subtitle', 'Subtitle', content.subtitle),
                            ...(content.stats || []).map((stat, i) => ({
                                label: `Stat ${i + 1}`,
                                value: `${stat.number} - ${stat.label}`
                            })),
                            includeIfVisible('ctaText', 'CTA Text', content.ctaText)
                        ].filter(Boolean)
                    };
                    
                case 'program-cards':
                    return {
                        type: 'Program Cards',
                        variant: section.variant,
                        content: [
                            { label: 'Eyebrow', value: content.eyebrow || '' },
                            { label: 'Headline', value: content.title || '' },
                            { label: 'Subtitle', value: content.subtitle || '' },
                            ...(content.programs || []).map((prog, i) => ({
                                label: `Program ${i + 1}`,
                                value: `Headline: ${prog.title}\nSubhead: ${prog.description}`
                            })),
                            { label: 'CTA Text', value: content.ctaText || '' }
                        ]
                    };
                    
                case 'lead-form':
                    const formContent = [
                        includeIfVisible('eyebrow', 'Eyebrow', content.eyebrow),
                        includeIfVisible('title', 'Headline', content.title),
                        includeIfVisible('description', 'Subhead', content.description)
                    ].filter(Boolean);
                    
                    // Always add form fields section header
                    formContent.push({ label: '', value: '' }); // Empty line
                    formContent.push({ label: 'Form Fields', value: '' });
                    
                    // Add detailed field information
                    if (content.fields && content.fields.length > 0) {
                        content.fields.forEach((field, index) => {
                            // Unescape HTML entities for proper display in Google Docs
                            const cleanLabel = unescapeHtml(field.label || '');
                            const cleanPlaceholder = field.placeholder ? unescapeHtml(field.placeholder) : '';
                            const cleanOptions = field.options ? field.options.map(opt => unescapeHtml(opt)) : [];
                            
                            let fieldInfo = `${cleanLabel} (${field.type})`;
                            if (field.required) fieldInfo += ' - Required';
                            if (cleanPlaceholder) fieldInfo += ` - Placeholder: "${cleanPlaceholder}"`;
                            if (cleanOptions.length > 0) fieldInfo += ` - Options: ${cleanOptions.join(', ')}`;
                            formContent.push({ label: `  Field ${index + 1}`, value: fieldInfo });
                        });
                    } else {
                        // If no fields, add default fields
                        const defaultFields = [
                            { label: 'First Name', type: 'text', required: true },
                            { label: 'Last Name', type: 'text', required: true },
                            { label: 'Email', type: 'email', required: true },
                            { label: 'Phone', type: 'tel', required: false },
                            { label: 'Birth Date', type: 'date', required: false }
                        ];
                        defaultFields.forEach((field, index) => {
                            let fieldInfo = `${field.label} (${field.type})`;
                            if (field.required) fieldInfo += ' - Required';
                            formContent.push({ label: `  Field ${index + 1}`, value: fieldInfo });
                        });
                    }
                    
                    formContent.push({ label: '', value: '' }); // Empty line
                    formContent.push({ label: 'Submit Button', value: content.submitText || 'Submit' });
                    
                    return {
                        type: 'Lead Generation Form',
                        variant: section.variant,
                        content: formContent
                    };
                    
                case 'testimonial-single':
                    return {
                        type: 'Single Testimonial',
                        variant: section.variant,
                        content: [
                            includeIfVisible('eyebrow', 'Eyebrow', content.eyebrow),
                            includeIfVisible('title', 'Headline', content.title),
                            includeIfVisible('quote', 'Quote', content.quote),
                            includeIfVisible('name', 'Name', content.name),
                            includeIfVisible('role', 'Role', content.role)
                        ].filter(Boolean)
                    };
                    
                case 'testimonial-carousel':
                    return {
                        type: 'Testimonial Carousel',
                        variant: section.variant,
                        content: [
                            includeIfVisible('eyebrow', 'Eyebrow', content.eyebrow),
                            includeIfVisible('title', 'Headline', content.title),
                            { label: 'Testimonial Quote', value: content['testimonial-quote-0'] || '' },
                            { label: 'Testimonial Name', value: content['testimonial-name-0'] || '' },
                            { label: 'Testimonial Role', value: content['testimonial-role-0'] || '' }
                        ].filter(Boolean)
                    };
                    
                default:
                    return {
                        type: 'Unknown Section',
                        variant: section.variant,
                        content: [{ label: 'Data', value: JSON.stringify(content) }]
                    };
            }
        }
    }

    const googleDocsExporter = new GoogleDocsExporter();

    // Form Builder Class
    class FormBuilder {
        constructor() {
            this.modal = document.getElementById('formBuilderBackdrop');
            this.fieldsList = document.getElementById('formFieldsList');
            this.fieldProperties = document.getElementById('fieldProperties');
            this.fieldTypeSelector = document.getElementById('fieldTypeSelector');
            this.currentSectionIndex = null;
            this.selectedFieldId = null;
            this.formFields = [];
            
            this.fieldTypes = {
                text: { label: 'Text Input', defaultLabel: 'Text Field' },
                email: { label: 'Email', defaultLabel: 'Email Address' },
                tel: { label: 'Phone', defaultLabel: 'Phone Number' },
                number: { label: 'Number', defaultLabel: 'Number' },
                date: { label: 'Date', defaultLabel: 'Date' },
                select: { label: 'Dropdown', defaultLabel: 'Select Option' },
                radio: { label: 'Radio', defaultLabel: 'Radio Group' },
                checkbox: { label: 'Checkbox', defaultLabel: 'Checkbox' },
                textarea: { label: 'Textarea', defaultLabel: 'Comments' },
                consent: { label: 'Consent', defaultLabel: 'I agree to the terms' }
            };
            
            this.templates = {
                basic: {
                    name: 'Basic Contact',
                    fields: [
                        { type: 'text', label: 'First Name', required: true },
                        { type: 'text', label: 'Last Name', required: true },
                        { type: 'email', label: 'Email', required: true },
                        { type: 'tel', label: 'Phone', required: false }
                    ]
                },
                event: {
                    name: 'Event Registration',
                    fields: [
                        { type: 'text', label: 'Full Name', required: true },
                        { type: 'email', label: 'Email', required: true },
                        { type: 'tel', label: 'Phone', required: true },
                        { type: 'select', label: 'Event Date', required: true, options: ['March 15, 2024', 'March 22, 2024', 'March 29, 2024'] },
                        { type: 'number', label: 'Number of Attendees', required: true },
                        { type: 'textarea', label: 'Special Requirements', required: false }
                    ]
                },
                inquiry: {
                    name: 'Program Inquiry',
                    fields: [
                        { type: 'text', label: 'First Name', required: true },
                        { type: 'text', label: 'Last Name', required: true },
                        { type: 'email', label: 'Email', required: true },
                        { type: 'tel', label: 'Phone', required: false },
                        { type: 'select', label: 'Program of Interest', required: true, options: ['MBA', 'Computer Science', 'Engineering', 'Healthcare'] },
                        { type: 'select', label: 'Start Term', required: true, options: ['Fall 2024', 'Spring 2025', 'Summer 2025'] },
                        { type: 'radio', label: 'Enrollment Status', required: true, options: ['First-Time Student', 'Transfer Student', 'Returning Student'] },
                        { type: 'textarea', label: 'Tell us about yourself', required: false }
                    ]
                },
                newsletter: {
                    name: 'Newsletter Signup',
                    fields: [
                        { type: 'email', label: 'Email Address', required: true },
                        { type: 'text', label: 'First Name', required: false },
                        { type: 'checkbox', label: 'Send me weekly updates', required: false },
                        { type: 'consent', label: 'I agree to receive marketing communications', required: true }
                    ]
                }
            };
            
            this.init();
        }
        
        init() {
            // Modal controls
            document.getElementById('closeFormBuilder').addEventListener('click', () => this.close());
            document.getElementById('cancelFormBuilder').addEventListener('click', () => this.close());
            document.getElementById('saveFormBuilder').addEventListener('click', () => this.save());
            
            // Add field button
            document.getElementById('addFieldBtn').addEventListener('click', () => this.showFieldTypeSelector());
            
            // Field type selection
            document.querySelectorAll('.field-type-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const type = btn.dataset.type;
                    this.addField(type);
                    this.hideFieldTypeSelector();
                });
            });
            
            // Template buttons
            document.querySelectorAll('.template-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const template = btn.dataset.template;
                    this.loadTemplate(template);
                });
            });
            
            // Click outside field type selector to close
            this.modal.addEventListener('click', (e) => {
                if (!e.target.closest('.field-type-selector') && !e.target.closest('#addFieldBtn')) {
                    this.hideFieldTypeSelector();
                }
            });
        }
        
        open(sectionIndex) {
            this.currentSectionIndex = sectionIndex;
            const section = state.sections[sectionIndex];
            
            if (section && section.type === 'lead-form') {
                // Load existing form fields or defaults
                this.formFields = JSON.parse(JSON.stringify(section.content.fields || [
                    { id: this.generateFieldId(), type: 'text', label: 'First Name', required: true },
                    { id: this.generateFieldId(), type: 'text', label: 'Last Name', required: true },
                    { id: this.generateFieldId(), type: 'email', label: 'Email', required: true },
                    { id: this.generateFieldId(), type: 'tel', label: 'Phone', required: false },
                    { id: this.generateFieldId(), type: 'date', label: 'Birth Date', required: false }
                ]));
                
                // Ensure all fields have IDs
                this.formFields.forEach(field => {
                    if (!field.id) field.id = this.generateFieldId();
                });
                
                this.renderFields();
                this.modal.style.display = 'flex';
            }
        }
        
        close() {
            this.modal.style.display = 'none';
            this.hideFieldTypeSelector();
            this.selectedFieldId = null;
        }
        
        save() {
            if (this.currentSectionIndex !== null) {
                const section = state.sections[this.currentSectionIndex];
                if (section && section.type === 'lead-form') {
                    section.content.fields = JSON.parse(JSON.stringify(this.formFields));
                    updateCanvas();
                    this.close();
                }
            }
        }
        
        generateFieldId() {
            return 'field_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }
        
        addField(type) {
            const fieldType = this.fieldTypes[type];
            const field = {
                id: this.generateFieldId(),
                type: type,
                label: fieldType.defaultLabel,
                placeholder: '',
                required: false,
                helpText: ''
            };
            
            // Add type-specific properties
            if (type === 'select' || type === 'radio' || type === 'checkbox') {
                field.options = ['Option 1', 'Option 2', 'Option 3'];
            }
            
            if (type === 'number') {
                field.min = null;
                field.max = null;
            }
            
            if (type === 'textarea') {
                field.rows = 4;
            }
            
            this.formFields.push(field);
            this.renderFields();
            this.selectField(field.id);
        }
        
        removeField(fieldId) {
            const index = this.formFields.findIndex(f => f.id === fieldId);
            if (index > -1) {
                this.formFields.splice(index, 1);
                this.renderFields();
                if (this.selectedFieldId === fieldId) {
                    this.selectedFieldId = null;
                    this.renderProperties();
                }
            }
        }
        
        selectField(fieldId) {
            this.selectedFieldId = fieldId;
            document.querySelectorAll('.field-item').forEach(item => {
                item.classList.toggle('active', item.dataset.fieldId === fieldId);
            });
            this.renderProperties();
        }
        
        renderFields() {
            this.fieldsList.innerHTML = this.formFields.map((field, index) => {
                const fieldType = this.fieldTypes[field.type];
                return `
                    <div class="field-item" data-field-id="${field.id}" data-index="${index}">
                        <div class="field-drag-handle">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 3h6M9 7h6M9 11h6M9 15h6M9 19h6"/>
                            </svg>
                        </div>
                        <div class="field-info">
                            <div class="field-label">
                                ${escapeHtml(field.label)}
                                ${field.required ? '<span class="field-required">*</span>' : ''}
                            </div>
                            <div class="field-type">${fieldType.label}</div>
                        </div>
                        <button class="field-delete" data-field-id="${field.id}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                `;
            }).join('');
            
            // Add click handlers
            this.fieldsList.querySelectorAll('.field-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    if (!e.target.closest('.field-delete')) {
                        this.selectField(item.dataset.fieldId);
                    }
                });
            });
            
            // Add delete handlers
            this.fieldsList.querySelectorAll('.field-delete').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (confirm('Delete this field?')) {
                        this.removeField(btn.dataset.fieldId);
                    }
                });
            });
            
            // Initialize drag and drop
            this.initFieldDragDrop();
        }
        
        renderProperties() {
            const field = this.formFields.find(f => f.id === this.selectedFieldId);
            
            if (!field) {
                this.fieldProperties.innerHTML = `
                    <div class="empty-properties">
                        <p>Select a field to edit its properties</p>
                    </div>
                `;
                return;
            }
            
            let propertiesHtml = `
                <div class="property-group">
                    <label>Field Label</label>
                    <input type="text" id="fieldLabel" value="${escapeHtml(field.label || '')}">
                </div>
                
                <div class="property-group">
                    <label>Placeholder Text</label>
                    <input type="text" id="fieldPlaceholder" value="${escapeHtml(field.placeholder || '')}">
                </div>
                
                <div class="property-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="fieldRequired" ${field.required ? 'checked' : ''}>
                        Required Field
                    </label>
                </div>
                
                <div class="property-group">
                    <label>Help Text</label>
                    <input type="text" id="fieldHelpText" value="${escapeHtml(field.helpText || '')}">
                </div>
            `;
            
            // Type-specific properties
            if (field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') {
                propertiesHtml += `
                    <div class="property-group">
                        <label>Options</label>
                        <div class="options-list">
                            ${(field.options || []).map((option, index) => `
                                <div class="option-item">
                                    <input type="text" value="${escapeHtml(option)}" data-option-index="${index}">
                                    <button class="option-remove" data-option-index="${index}">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M18 6L6 18M6 6l12 12"/>
                                        </svg>
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                        <button class="btn btn-secondary btn-sm add-option-btn">Add Option</button>
                    </div>
                `;
            }
            
            if (field.type === 'number') {
                propertiesHtml += `
                    <div class="property-group">
                        <label>Minimum Value</label>
                        <input type="number" id="fieldMin" value="${field.min || ''}">
                    </div>
                    <div class="property-group">
                        <label>Maximum Value</label>
                        <input type="number" id="fieldMax" value="${field.max || ''}">
                    </div>
                `;
            }
            
            if (field.type === 'textarea') {
                propertiesHtml += `
                    <div class="property-group">
                        <label>Number of Rows</label>
                        <input type="number" id="fieldRows" value="${field.rows || 4}" min="1" max="10">
                    </div>
                `;
            }
            
            this.fieldProperties.innerHTML = propertiesHtml;
            
            // Add event listeners for property changes
            this.fieldProperties.querySelectorAll('input').forEach(input => {
                input.addEventListener('input', () => this.updateFieldProperty(input));
            });
            
            // Option management
            this.fieldProperties.querySelectorAll('.option-remove').forEach(btn => {
                btn.addEventListener('click', () => this.removeOption(parseInt(btn.dataset.optionIndex)));
            });
            
            const addOptionBtn = this.fieldProperties.querySelector('.add-option-btn');
            if (addOptionBtn) {
                addOptionBtn.addEventListener('click', () => this.addOption());
            }
        }
        
        updateFieldProperty(input) {
            const field = this.formFields.find(f => f.id === this.selectedFieldId);
            if (!field) return;
            
            switch (input.id) {
                case 'fieldLabel':
                    field.label = input.value;
                    break;
                case 'fieldPlaceholder':
                    field.placeholder = input.value;
                    break;
                case 'fieldRequired':
                    field.required = input.checked;
                    break;
                case 'fieldHelpText':
                    field.helpText = input.value;
                    break;
                case 'fieldMin':
                    field.min = input.value ? parseInt(input.value) : null;
                    break;
                case 'fieldMax':
                    field.max = input.value ? parseInt(input.value) : null;
                    break;
                case 'fieldRows':
                    field.rows = parseInt(input.value) || 4;
                    break;
            }
            
            // Handle option updates
            if (input.dataset.optionIndex !== undefined) {
                const index = parseInt(input.dataset.optionIndex);
                if (field.options && field.options[index] !== undefined) {
                    field.options[index] = input.value;
                }
            }
            
            this.renderFields();
        }
        
        addOption() {
            const field = this.formFields.find(f => f.id === this.selectedFieldId);
            if (!field || !field.options) return;
            
            field.options.push(`Option ${field.options.length + 1}`);
            this.renderProperties();
        }
        
        removeOption(index) {
            const field = this.formFields.find(f => f.id === this.selectedFieldId);
            if (!field || !field.options) return;
            
            field.options.splice(index, 1);
            this.renderProperties();
        }
        
        showFieldTypeSelector() {
            this.fieldTypeSelector.style.display = 'block';
        }
        
        hideFieldTypeSelector() {
            this.fieldTypeSelector.style.display = 'none';
        }
        
        loadTemplate(templateName) {
            const template = this.templates[templateName];
            if (!template) return;
            
            if (confirm(`Load "${template.name}" template? This will replace all current fields.`)) {
                this.formFields = template.fields.map(field => ({
                    ...field,
                    id: this.generateFieldId()
                }));
                this.renderFields();
                this.selectedFieldId = null;
                this.renderProperties();
            }
        }
        
        initFieldDragDrop() {
            let draggedElement = null;
            let draggedIndex = null;
            
            this.fieldsList.querySelectorAll('.field-item').forEach((item, index) => {
                const handle = item.querySelector('.field-drag-handle');
                
                // Only the handle should initiate drag
                handle.style.cursor = 'grab';
                
                // Make handle draggable, not the entire item
                handle.draggable = true;
                
                handle.addEventListener('dragstart', (e) => {
                    e.dataTransfer.effectAllowed = 'move';
                    // Store reference to the parent field-item
                    draggedElement = item;
                    draggedIndex = parseInt(item.dataset.index);
                    item.classList.add('dragging');
                    // Set drag image to the entire field item
                    e.dataTransfer.setDragImage(item, 0, 0);
                });
                
                handle.addEventListener('dragend', () => {
                    if (draggedElement) {
                        draggedElement.classList.remove('dragging');
                        draggedElement = null;
                        
                        // Update field order based on new DOM positions
                        const newOrder = Array.from(this.fieldsList.querySelectorAll('.field-item')).map(el => 
                            this.formFields.find(f => f.id === el.dataset.fieldId)
                        ).filter(Boolean); // Filter out any undefined values
                        this.formFields = newOrder;
                    }
                });
                
                // Handle visual feedback on mouse interactions
                handle.addEventListener('mousedown', () => {
                    handle.style.cursor = 'grabbing';
                });
                
                handle.addEventListener('mouseup', () => {
                    handle.style.cursor = 'grab';
                });
                
                handle.addEventListener('mouseleave', () => {
                    handle.style.cursor = 'grab';
                });
                
                // Set up drop zone on the item
                item.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    
                    const draggingItem = this.fieldsList.querySelector('.dragging');
                    if (!draggingItem || draggingItem === item) return;
                    
                    // Get all items except the one being dragged
                    const siblings = [...this.fieldsList.querySelectorAll('.field-item:not(.dragging)')];
                    
                    // Find the item after which the dragging item should be inserted
                    const nextSibling = siblings.find(sibling => {
                        const rect = sibling.getBoundingClientRect();
                        const midpoint = rect.top + rect.height / 2;
                        return e.clientY < midpoint;
                    });
                    
                    // Insert the dragging item at the appropriate position
                    if (nextSibling) {
                        this.fieldsList.insertBefore(draggingItem, nextSibling);
                    } else {
                        this.fieldsList.appendChild(draggingItem);
                    }
                });
                
                // Prevent default drag behavior on the item itself
                item.addEventListener('dragstart', (e) => {
                    // Only allow drag if it originated from the handle
                    if (!e.target.closest('.field-drag-handle')) {
                        e.preventDefault();
                    }
                });
            });
        }
    }
    
    const formBuilder = new FormBuilder();

    // Setup sidebar enhancements
    function setupSidebarEnhancements() {
        // Category toggle functionality
        const categoryHeaders = document.querySelectorAll('.category-header');
        categoryHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const categoryItems = header.nextElementSibling;
                const arrow = header.querySelector('.category-arrow');
                
                categoryItems.classList.toggle('expanded');
                header.setAttribute('aria-expanded', categoryItems.classList.contains('expanded'));
            });
        });
        
        // Component search functionality
        const searchInput = document.getElementById('componentSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const allButtons = document.querySelectorAll('.section-btn');
                const categories = document.querySelectorAll('.component-category');
                
                if (searchTerm === '') {
                    // Show all components and categories
                    allButtons.forEach(btn => btn.style.display = '');
                    categories.forEach(cat => cat.style.display = '');
                    return;
                }
                
                // Filter components
                categories.forEach(category => {
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
                    
                    // Hide category if no visible buttons
                    category.style.display = hasVisibleButtons ? '' : 'none';
                    
                    // Expand category if it has matches
                    if (hasVisibleButtons) {
                        const items = category.querySelector('.category-items');
                        items.classList.add('expanded');
                    }
                });
            });
        }
    }
    
    // Setup export dropdown functionality
    function setupExportDropdown() {
        const exportDropdownBtn = document.getElementById('exportDropdownBtn');
        const exportMenu = document.getElementById('exportMenu');
        const exportBtn = document.getElementById('exportBtn');
        const exportImageBtn = document.getElementById('exportImageBtn');
        const googleDocsExportBtn = document.getElementById('googleDocsExportBtn');
        
        // Toggle dropdown
        exportDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            exportMenu.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            exportMenu.classList.remove('show');
        });
        
        // Export handlers
        exportImageBtn.addEventListener('click', () => {
            exportMenu.classList.remove('show');
            exportAsImage();
        });
        
        exportBtn.addEventListener('click', () => {
            exportMenu.classList.remove('show');
            exportJSON();
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
                await googleDocsExporter.exportToGoogleDocs();
            } catch (error) {
                console.error('Export failed:', error);
            } finally {
                googleDocsExportBtn.disabled = false;
                googleDocsExportBtn.textContent = 'Copy to Google Docs';
            }
        });
    }

    // Add Form Settings button to sidebar
    function addFormSettingsButton() {
        const sectionLibrary = document.querySelector('.section-library');
        
        // Create container for form settings
        const formSettingsContainer = document.createElement('div');
        formSettingsContainer.className = 'form-settings-container';
        formSettingsContainer.id = 'formSettingsContainer';
        formSettingsContainer.style.display = 'none';
        
        const formSettingsBtn = document.createElement('button');
        formSettingsBtn.className = 'form-settings-btn';
        formSettingsBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v6m6.364-15.364l-4.243 4.243m-4.242 4.242l-4.243 4.243m19.092-6.364h-6m-6 0h-6m15.364 6.364l-4.243-4.243m-4.242-4.242l-4.243-4.243"/>
            </svg>
            Customize Form Fields
        `;
        
        formSettingsBtn.addEventListener('click', () => {
            // Find the lead form section index
            const leadFormIndex = state.sections.findIndex(s => s.type === 'lead-form');
            if (leadFormIndex !== -1) {
                formBuilder.open(leadFormIndex);
            }
        });
        
        formSettingsContainer.appendChild(formSettingsBtn);
        sectionLibrary.appendChild(formSettingsContainer);
    }
    
    // Update form settings button visibility
    function updateFormSettingsVisibility() {
        // Form settings are now accessed through section controls
        // This function is kept for backwards compatibility
        return;
    }

    // Delete all sections with confirmation
    function deleteAllSections() {
        if (state.sections.length === 0) {
            alert('No sections to delete');
            return;
        }
        
        if (confirm('Are you sure you want to delete all sections? This cannot be undone.')) {
            state.sections = [];
            updateCanvas();
        }
    }

    // Writing guidelines (updated with corrected character limits)
    const writingGuidelines = {
        'eyebrow': {
            maxChars: 35,
            idealChars: 25,
            tips: [
                'Keep eyebrow text to 3-5 words',
                'Use as category label or key benefit',
                'Examples: "Why Choose Us", "Student Success"',
                'Avoid punctuation and full sentences'
            ]
        },
        'section-title': {
            maxChars: 70,
            idealChars: 45, // CHANGED from 50 to 45
            tips: [
                'Headlines work best at 6-12 words (35-70 characters)',
                'Front-load with key benefit or outcome',
                'Use power words that evoke emotion',
                'Make it specific to your audience'
            ]
        },
        'section-subtitle': {
            maxChars: 160,
            idealChars: 120,
            tips: [
                'Expand on the headline promise',
                'Keep to 20-25 words for best readability',
                'Include specific value proposition',
                'Break into two sentences if needed'
            ]
        },
        'body-content': {
            maxChars: 600, // CHANGED from 250 to 600
            idealChars: 400, // CHANGED from 150 to 400
            tips: [
                'Limit to 50-75 words for best readability',
                'Lead with most compelling benefit',
                'Use simple, conversational language',
                'Each sentence should add new value'
            ]
        },
        'cta-button': {
            maxChars: 25, // CHANGED from 20 to 25
            idealChars: 15, // CHANGED from 12 to 15
            tips: [
                'Best CTAs are 2-3 words',
                'Start with action verb',
                'Examples: "Get Started", "Learn More", "Apply Now"',
                'Match CTA to user intent'
            ]
        },
        'submit-btn': {
            maxChars: 20,
            idealChars: 12,
            tips: [
                'Keep form buttons concise',
                'Good examples: "Submit", "Get Started", "Get Info"',
                'Match button text to form purpose',
                'Ensure mobile tap targets are 44px+'
            ]
        },
        'stat-number': {
            maxChars: 8,
            idealChars: 5,
            tips: [
                'Round to memorable numbers',
                'Include unit symbol (%, K, +)',
                'Examples: "97%", "10K+", "#1"',
                'Make numbers instantly scannable'
            ]
        },
        'stat-label': {
            maxChars: 25,
            idealChars: 18,
            tips: [
                'Use 2-3 words maximum',
                'Focus on the outcome',
                'Examples: "Job Placement", "Graduation Rate"',
                'Avoid complex metrics'
            ]
        },
        'column-title': {
            maxChars: 35,
            idealChars: 25,
            tips: [
                'Feature titles need 3-5 words',
                'Start with benefit, not feature',
                'Make each unique and specific',
                'Consider icon pairing'
            ]
        },
        'column-description': {
            maxChars: 100,
            idealChars: 75,
            tips: [
                'One compelling sentence is best',
                'Expand on title benefit',
                'Keep under 15 words',
                'Use active, present tense'
            ]
        },
        'program-title': {
            maxChars: 50,
            idealChars: 35,
            tips: [
                'Use official program names',
                'Include degree type when relevant',
                'Examples: "MBA in Finance", "B.S. Computer Science"',
                'Maintain consistency across all cards'
            ]
        },
        'program-description': {
            maxChars: 120,
            idealChars: 90,
            tips: [
                'Focus on career outcomes',
                'Mention 1-2 key differentiators',
                'Keep to 15-20 words',
                'Highlight demand or growth'
            ]
        },
        'form-description': {
            maxChars: 140, // CHANGED from 100 to 140
            idealChars: 100, // CHANGED from 75 to 100
            tips: [
                'Set clear expectations about next steps',
                'Mention response time to build trust',
                'Keep to one compelling sentence',
                'Consider privacy reassurance'
            ]
        },
        'testimonial-quote': {
            maxChars: 200, // CHANGED from 180 to 200
            idealChars: 150, // CHANGED from 140 to 150
            tips: [
                'Best testimonials are 20-30 words',
                'Include specific outcome or transformation',
                'Keep authentic voice and tone',
                'One powerful statement beats many'
            ]
        },
        'testimonial-quote-large': {
            maxChars: 350, // CHANGED from 280 to 350
            idealChars: 250, // CHANGED from 200 to 250
            tips: [
                'Tell mini success story in 2-3 sentences',
                'Include before/after transformation',
                'Mention specific achievements',
                'Keep conversational and authentic'
            ]
        },
        'testimonial-name': {
            maxChars: 30,
            idealChars: 20,
            tips: [
                'Use full name for credibility',
                'First and last name only',
                'Check privacy permissions',
                'Consider using real alumni'
            ]
        },
        'testimonial-role': {
            maxChars: 50,
            idealChars: 35,
            tips: [
                'Format: "Program, Class of Year"',
                'Can add current job title',
                'Example: "MBA 2023, Marketing Director"',
                'Keep consistent across testimonials'
            ]
        },
        'image-content-eyebrow': {
            maxChars: 35,
            idealChars: 25,
            tips: [
                'Keep eyebrow text to 3-5 words',
                'Use as category label or key benefit',
                'Examples: "Campus Life", "Our Location", "Student Experience"',
                'Avoid punctuation and full sentences'
            ]
        },
        'image-content-title': {
            maxChars: 70,
            idealChars: 45,
            tips: [
                'Headlines work best at 6-12 words (35-70 characters)',
                'Front-load with key benefit or outcome',
                'Use power words that evoke emotion',
                'Make it specific to your audience'
            ]
        },
        'image-content-body': {
            maxChars: 600,
            idealChars: 400,
            tips: [
                'Limit to 50-75 words for best readability',
                'Lead with most compelling benefit',
                'Use simple, conversational language',
                'Can include bullet points using • symbol',
                'Each sentence should add new value'
            ]
        },
        'image-content-cta': {
            maxChars: 25,
            idealChars: 15,
            tips: [
                'Best CTAs are 2-3 words',
                'Start with action verb',
                'Examples: "Learn More", "Explore Campus", "Schedule Visit"',
                'Match CTA to user intent'
            ]
        },
        'general': {
            tips: [
                'Mobile users see 30-40% less content',
                'Higher ed compliance: avoid guarantees',
                'Focus on outcomes, not features',
                'Use inclusive, accessible language'
            ]
        }
    };

    // Initialize guidance system with debounced updates
    let guidanceTimeout;
    function initializeGuidance() {
        const guidancePanel = document.getElementById('guidancePanel');
        const guidanceContent = document.getElementById('guidanceContent');
        
        // Focus event for guidance
        document.addEventListener('focus', (e) => {
            if (e.target.contentEditable === 'true') {
                showGuidance(e.target);
                addCharacterCounter(e.target);
                checkContentLength(e.target);
            }
        }, true);
        
        // Blur event to hide guidance
        document.addEventListener('blur', (e) => {
            if (e.target.contentEditable === 'true') {
                removeCharacterCounter(e.target);
                hideGuidance();
                e.target.style.borderColor = '';
            }
        }, true);
        
        // Debounced input handler
        document.addEventListener('input', (e) => {
            if (e.target.contentEditable === 'true') {
                clearTimeout(guidanceTimeout);
                guidanceTimeout = setTimeout(() => {
                    updateCharacterCounter(e.target);
                    checkContentLength(e.target);
                    updateGuidancePanel(e.target);
                }, 100);
            }
        }, true);
    }

    // Guidance helper functions
    function showGuidance(element) {
        const guidancePanel = document.getElementById('guidancePanel');
        const guidanceContent = document.getElementById('guidanceContent');
        
        let elementType = 'general';
        const classList = element.classList;
        
        // Check for section-specific guidelines first
        const parentSection = element.closest('.section');
        if (parentSection) {
            const sectionType = parentSection.dataset.sectionType;
            if (sectionType === 'image-content') {
                // Map image-content fields to their specific guidelines
                if (element.classList.contains('eyebrow')) {
                    elementType = 'image-content-eyebrow';
                } else if (element.classList.contains('section-title')) {
                    elementType = 'image-content-title';
                } else if (element.classList.contains('body-content')) {
                    elementType = 'image-content-body';
                } else if (element.classList.contains('cta-button')) {
                    elementType = 'image-content-cta';
                }
            }
        }
        
        // If no section-specific guideline found, check general classes
        if (elementType === 'general') {
            for (const className of classList) {
                if (writingGuidelines[className]) {
                    elementType = className;
                    break;
                }
            }
        }
        
        if (element.tagName === 'LABEL') {
            elementType = 'form-field label';
        }
        
        const guidelines = writingGuidelines[elementType] || writingGuidelines.general;
        let html = '';
        
        if (guidelines.maxChars) {
            const currentLength = element.textContent.trim().length;
            const status = getCharCountStatus(currentLength, guidelines.idealChars, guidelines.maxChars);
            
            // Special handling for body-content to show word count
            if (element.classList.contains('body-content')) {
                const wordCount = element.textContent.trim().split(/\s+/).filter(word => word.length > 0).length;
                html += `
                    <div class="guidance-tip ${status}">
                        <strong>Character Count:</strong> ${currentLength} / ${guidelines.idealChars} ideal
                        <div class="char-count ${status}">
                            Max recommended: ${guidelines.maxChars} characters
                        </div>
                        <strong>Word Count:</strong> ${wordCount} / 50-75 ideal
                    </div>
                `;
            } else {
                html += `
                    <div class="guidance-tip ${status}">
                        <strong>Character Count:</strong> ${currentLength} / ${guidelines.idealChars} ideal
                        <div class="char-count ${status}">
                            Max recommended: ${guidelines.maxChars}
                        </div>
                    </div>
                `;
            }
        }
        
        if (guidelines.tips && guidelines.tips.length > 0) {
            html += '<div class="guidance-tip">';
            html += '<strong>Writing Tips:</strong>';
            html += '<ul style="margin: 0.5rem 0 0 1.25rem; padding: 0;">';
            guidelines.tips.forEach(tip => {
                html += `<li style="margin-bottom: 0.25rem;">${escapeHtml(tip)}</li>`;
            });
            html += '</ul>';
            html += '</div>';
        }
        
        if (state.currentViewport === 'mobile' && element.textContent.length > 50) {
            html += `
                <div class="guidance-tip warning">
                    <strong>Mobile Alert:</strong> This text may be too long for mobile screens. Consider shortening for better readability.
                </div>
            `;
        }
        
        guidanceContent.innerHTML = html;
        guidancePanel.classList.add('active');
    }

    function getCharCountStatus(current, ideal, max) {
        if (current > max) return 'error';
        if (current > ideal) return 'warning';
        return '';
    }

    function addCharacterCounter(element) {
        if (element.nextElementSibling?.classList.contains('char-indicator')) {
            return;
        }
        
        const counter = document.createElement('div');
        counter.className = 'char-indicator';
        element.parentNode.insertBefore(counter, element.nextSibling);
        updateCharacterCounter(element);
    }

    function updateCharacterCounter(element) {
        const counter = element.nextElementSibling;
        if (!counter?.classList.contains('char-indicator')) return;
        
        const length = element.textContent.trim().length;
        let guideline = null;
        
        // Check for section-specific guidelines first
        const parentSection = element.closest('.section');
        if (parentSection) {
            const sectionType = parentSection.dataset.sectionType;
            if (sectionType === 'image-content') {
                if (element.classList.contains('eyebrow')) {
                    guideline = writingGuidelines['image-content-eyebrow'];
                } else if (element.classList.contains('section-title')) {
                    guideline = writingGuidelines['image-content-title'];
                } else if (element.classList.contains('body-content')) {
                    guideline = writingGuidelines['image-content-body'];
                } else if (element.classList.contains('cta-button')) {
                    guideline = writingGuidelines['image-content-cta'];
                }
            }
        }
        
        // If no section-specific guideline found, check general classes
        if (!guideline) {
            for (const className of element.classList) {
                if (writingGuidelines[className]) {
                    guideline = writingGuidelines[className];
                    break;
                }
            }
        }
        
        // Special handling for body-content to show word count
        if (element.classList.contains('body-content')) {
            const wordCount = element.textContent.trim().split(/\s+/).filter(word => word.length > 0).length;
            const status = getCharCountStatus(length, guideline.idealChars, guideline.maxChars);
            counter.textContent = `${length} chars / ${wordCount} words (50-75 ideal)`;
            counter.className = `char-indicator ${status}`;
        } else if (guideline?.maxChars) {
            const status = getCharCountStatus(length, guideline.idealChars, guideline.maxChars);
            counter.textContent = `${length} / ${guideline.idealChars}`;
            counter.className = `char-indicator ${status}`;
        } else {
            counter.textContent = `${length} chars`;
        }
    }

    function removeCharacterCounter(element) {
        const counter = element.nextElementSibling;
        if (counter?.classList.contains('char-indicator')) {
            counter.remove();
        }
    }

    function checkContentLength(element) {
        let guideline = null;
        
        // Check for section-specific guidelines first
        const parentSection = element.closest('.section');
        if (parentSection) {
            const sectionType = parentSection.dataset.sectionType;
            if (sectionType === 'image-content') {
                if (element.classList.contains('eyebrow')) {
                    guideline = writingGuidelines['image-content-eyebrow'];
                } else if (element.classList.contains('section-title')) {
                    guideline = writingGuidelines['image-content-title'];
                } else if (element.classList.contains('body-content')) {
                    guideline = writingGuidelines['image-content-body'];
                } else if (element.classList.contains('cta-button')) {
                    guideline = writingGuidelines['image-content-cta'];
                }
            }
        }
        
        // If no section-specific guideline found, check general classes
        if (!guideline) {
            for (const className of element.classList) {
                if (writingGuidelines[className]) {
                    guideline = writingGuidelines[className];
                    break;
                }
            }
        }
        
        if (guideline?.maxChars) {
            const length = element.textContent.trim().length;
            if (length > guideline.maxChars) {
                element.style.borderColor = 'var(--primary-red)';
            } else if (length > guideline.idealChars) {
                element.style.borderColor = '#F59E0B';
            } else {
                element.style.borderColor = '';
            }
        }
    }

    function hideGuidance() {
        const guidancePanel = document.getElementById('guidancePanel');
        guidancePanel.classList.remove('active');
    }

    function updateGuidancePanel(element) {
        const guidanceContent = document.getElementById('guidanceContent');
        
        let elementType = 'general';
        const classList = element.classList;
        
        // Check for section-specific guidelines first
        const parentSection = element.closest('.section');
        if (parentSection) {
            const sectionType = parentSection.dataset.sectionType;
            if (sectionType === 'image-content') {
                if (element.classList.contains('eyebrow')) {
                    elementType = 'image-content-eyebrow';
                } else if (element.classList.contains('section-title')) {
                    elementType = 'image-content-title';
                } else if (element.classList.contains('body-content')) {
                    elementType = 'image-content-body';
                } else if (element.classList.contains('cta-button')) {
                    elementType = 'image-content-cta';
                }
            }
        }
        
        // If no section-specific guideline found, check general classes
        if (elementType === 'general') {
            for (const className of classList) {
                if (writingGuidelines[className]) {
                    elementType = className;
                    break;
                }
            }
        }
        
        const guidelines = writingGuidelines[elementType] || writingGuidelines.general;
        if (guidelines.maxChars) {
            const currentLength = element.textContent.trim().length;
            const charCountDiv = guidanceContent.querySelector('.guidance-tip .char-count');
            if (charCountDiv) {
                const status = getCharCountStatus(currentLength, guidelines.idealChars, guidelines.maxChars);
                const parentDiv = charCountDiv.parentElement;
                parentDiv.className = `guidance-tip ${status}`;
                
                // Special handling for body-content to show word count
                if (element.classList.contains('body-content')) {
                    const wordCount = element.textContent.trim().split(/\s+/).filter(word => word.length > 0).length;
                    parentDiv.innerHTML = `
                        <strong>Character Count:</strong> ${currentLength} / ${guidelines.idealChars} ideal
                        <div class="char-count ${status}">
                            Max recommended: ${guidelines.maxChars} characters
                        </div>
                        <strong>Word Count:</strong> ${wordCount} / 50-75 ideal
                    `;
                } else {
                    parentDiv.innerHTML = `
                        <strong>Character Count:</strong> ${currentLength} / ${guidelines.idealChars} ideal
                        <div class="char-count ${status}">
                            Max recommended: ${guidelines.maxChars}
                        </div>
                    `;
                }
            }
        }
    }

    // Drag and Drop functionality
    let draggedElement = null;
    let draggedIndex = null;

    function initializeDragAndDrop() {
        canvas.addEventListener('dragstart', handleDragStart);
        canvas.addEventListener('dragover', handleDragOver);
        canvas.addEventListener('drop', handleDrop);
        canvas.addEventListener('dragend', handleDragEnd);
        canvas.addEventListener('dragleave', handleDragLeave);
    }

    function handleDragStart(e) {
        if (!e.target.classList.contains('drag-handle')) return;
        
        const section = e.target.closest('.section');
        if (!section) return;
        
        draggedElement = section;
        draggedIndex = Array.from(canvas.querySelectorAll('.section')).indexOf(section);
        
        section.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', section.innerHTML);
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        
        e.dataTransfer.dropEffect = 'move';
        
        const section = e.target.closest('.section');
        if (section && section !== draggedElement) {
            canvas.querySelectorAll('.section').forEach(s => s.classList.remove('drag-over'));
            section.classList.add('drag-over');
        }
        
        return false;
    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        
        const dropSection = e.target.closest('.section');
        if (!dropSection || dropSection === draggedElement) return;
        
        const dropIndex = Array.from(canvas.querySelectorAll('.section')).indexOf(dropSection);
        
        const [movedSection] = state.sections.splice(draggedIndex, 1);
        state.sections.splice(dropIndex, 0, movedSection);
        
        updateCanvas();
        return false;
    }

    function handleDragEnd(e) {
        canvas.querySelectorAll('.section').forEach(section => {
            section.classList.remove('dragging', 'drag-over');
        });
        
        draggedElement = null;
        draggedIndex = null;
    }

    function handleDragLeave(e) {
        const section = e.target.closest('.section');
        if (section) {
            section.classList.remove('drag-over');
        }
    }

    // History Management with memory optimization
    function saveToHistory() {
        // Clean up old history if needed
        if (state.history.length > state.maxHistorySize) {
            state.history = state.history.slice(-state.maxHistorySize + 10);
            state.historyIndex = state.history.length - 1;
        }
        
        state.history = state.history.slice(0, state.historyIndex + 1);
        
        const historyEntry = {
            sections: JSON.parse(JSON.stringify(state.sections)),
            timestamp: Date.now()
        };
        
        state.history.push(historyEntry);
        state.historyIndex++;
        
        updateHistoryButtons();
    }

    function undo() {
        if (state.historyIndex > 0) {
            state.historyIndex--;
            const historyEntry = state.history[state.historyIndex];
            state.sections = JSON.parse(JSON.stringify(historyEntry.sections));
            updateCanvas(false);
            updateHistoryButtons();
        }
    }

    function redo() {
        if (state.historyIndex < state.history.length - 1) {
            state.historyIndex++;
            const historyEntry = state.history[state.historyIndex];
            state.sections = JSON.parse(JSON.stringify(historyEntry.sections));
            updateCanvas(false);
            updateHistoryButtons();
        }
    }

    function updateHistoryButtons() {
        undoBtn.disabled = state.historyIndex <= 0;
        redoBtn.disabled = state.historyIndex >= state.history.length - 1;
    }

})();