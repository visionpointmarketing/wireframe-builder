// State management
const state = {
    sections: [],
    currentViewport: 'desktop',
    history: [],
    historyIndex: -1,
    maxHistorySize: 50
};

// DOM elements
const canvas = document.getElementById('canvas');
const sectionLibrary = document.querySelector('.section-library');
const viewportBtns = document.querySelectorAll('.viewport-btn');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importFile = document.getElementById('importFile');
const exportImageBtn = document.getElementById('exportImageBtn');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');

// Section templates
const sectionTemplates = {
    'content-cta': {
        name: 'Content + CTA',
        variants: ['light', 'dark'],
        render: (variant = 'light', content = {}) => {
            const defaults = {
                eyebrow: 'Why Choose Us',
                title: 'Your Future Starts Here',
                body: 'Join 10,000+ graduates now thriving in their careers. Experience personalized mentorship, industry connections, and a 97% job placement rate.',
                ctaText: 'Get Started'
            };
            const data = { ...defaults, ...content };
            
            return `
                <div class="section content-cta ${variant}">
                    <div class="section-container">
                        <div class="section-header">
                            <div class="eyebrow" contenteditable="true">${data.eyebrow}</div>
                            <h2 class="section-title" contenteditable="true">${data.title}</h2>
                        </div>
                        <div class="body-content" contenteditable="true">${data.body}</div>
                        <a href="#" class="cta-button" contenteditable="true">${data.ctaText}</a>
                    </div>
                    <div class="drag-handle" draggable="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M9 3h6M9 7h6M9 11h6M9 15h6M9 19h6" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <div class="section-controls">
                        <button class="control-btn" onclick="duplicateSection(this)">Duplicate</button>
                        <button class="control-btn" onclick="toggleVariant(this)">Toggle Theme</button>
                        <button class="control-btn delete" onclick="deleteSection(this)">Delete</button>
                    </div>
                </div>
            `;
        }
    },
    'three-column': {
        name: 'Three Column Features',
        variants: ['light', 'dark'],
        render: (variant = 'light', content = {}) => {
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
            
            return `
                <div class="section three-column ${variant}">
                    <div class="section-container">
                        <div class="section-header">
                            <div class="eyebrow" contenteditable="true">${data.eyebrow}</div>
                            <h2 class="section-title" contenteditable="true">${data.title}</h2>
                            <p class="section-subtitle" contenteditable="true">${data.subtitle}</p>
                        </div>
                        <div class="three-column-grid">
                            ${data.columns.map((col, i) => `
                                <div class="column-item">
                                    <div class="column-image">Mountain Graphic</div>
                                    <h3 class="column-title" contenteditable="true">${col.title}</h3>
                                    <p class="column-description" contenteditable="true">${col.description}</p>
                                </div>
                            `).join('')}
                        </div>
                        <div style="text-align: center;">
                            <a href="#" class="cta-button" contenteditable="true">${data.ctaText}</a>
                        </div>
                    </div>
                    <div class="drag-handle" draggable="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M9 3h6M9 7h6M9 11h6M9 15h6M9 19h6" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <div class="section-controls">
                        <button class="control-btn" onclick="duplicateSection(this)">Duplicate</button>
                        <button class="control-btn" onclick="toggleVariant(this)">Toggle Theme</button>
                        <button class="control-btn delete" onclick="deleteSection(this)">Delete</button>
                    </div>
                </div>
            `;
        }
    },
    'statistics': {
        name: 'Statistics/Numbers',
        variants: ['light', 'dark'],
        render: (variant = 'light', content = {}) => {
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
            
            return `
                <div class="section statistics ${variant}">
                    <div class="section-container">
                        <div class="section-header">
                            <div class="eyebrow" contenteditable="true">${data.eyebrow}</div>
                            <h2 class="section-title" contenteditable="true">${data.title}</h2>
                            <p class="section-subtitle" contenteditable="true">${data.subtitle}</p>
                        </div>
                        <div class="stats-grid">
                            ${data.stats.map((stat, i) => `
                                <div class="stat-item">
                                    <div class="stat-number" contenteditable="true">${stat.number}</div>
                                    <div class="stat-label" contenteditable="true">${stat.label}</div>
                                </div>
                            `).join('')}
                        </div>
                        <div style="text-align: center; margin-top: 2rem;">
                            <a href="#" class="cta-button" contenteditable="true">${data.ctaText}</a>
                        </div>
                    </div>
                    <div class="drag-handle" draggable="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M9 3h6M9 7h6M9 11h6M9 15h6M9 19h6" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <div class="section-controls">
                        <button class="control-btn" onclick="duplicateSection(this)">Duplicate</button>
                        <button class="control-btn" onclick="toggleVariant(this)">Toggle Theme</button>
                        <button class="control-btn delete" onclick="deleteSection(this)">Delete</button>
                    </div>
                </div>
            `;
        }
    },
    'program-cards': {
        name: 'Program Cards',
        variants: ['light', 'dark'],
        render: (variant = 'light', content = {}) => {
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
            
            return `
                <div class="section program-cards ${variant}">
                    <div class="section-container">
                        <div class="section-header">
                            <div class="eyebrow" contenteditable="true">${data.eyebrow}</div>
                            <h2 class="section-title" contenteditable="true">${data.title}</h2>
                            <p class="section-subtitle" contenteditable="true">${data.subtitle}</p>
                        </div>
                        <div class="program-grid">
                            ${data.programs.map((program, i) => `
                                <div class="program-card">
                                    <div class="program-image">Mountain Graphic</div>
                                    <div class="program-content">
                                        <h3 class="program-title" contenteditable="true">${program.title}</h3>
                                        <p class="program-description" contenteditable="true">${program.description}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div style="text-align: center; margin-top: 2rem;">
                            <a href="#" class="cta-button" contenteditable="true">${data.ctaText}</a>
                        </div>
                    </div>
                    <div class="drag-handle" draggable="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M9 3h6M9 7h6M9 11h6M9 15h6M9 19h6" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <div class="section-controls">
                        <button class="control-btn" onclick="duplicateSection(this)">Duplicate</button>
                        <button class="control-btn" onclick="toggleVariant(this)">Toggle Theme</button>
                        <button class="control-btn delete" onclick="deleteSection(this)">Delete</button>
                    </div>
                </div>
            `;
        }
    },
    'lead-form': {
        name: 'Lead Generation Form',
        variants: ['light', 'dark'],
        render: (variant = 'light', content = {}) => {
            const defaults = {
                eyebrow: 'Get Started',
                title: 'Request Information',
                description: 'Connect with an advisor within 24 hours.',
                fields: [
                    { label: 'First Name', type: 'text', required: true },
                    { label: 'Last Name', type: 'text', required: true },
                    { label: 'Email', type: 'email', required: true },
                    { label: 'Phone', type: 'tel', required: false },
                    { label: 'Birth Date', type: 'date', required: false }
                ],
                dropdownLabel: 'Start Term',
                dropdownOptions: ['Fall 2025', 'Spring 2026', 'Summer 2026'],
                submitText: 'Send'
            };
            const data = { ...defaults, ...content };
            
            return `
                <div class="section lead-form ${variant}">
                    <div class="section-container">
                        <div class="form-layout">
                            <div class="form-content">
                                <div class="form-header">
                                    <div class="eyebrow" contenteditable="true">${data.eyebrow}</div>
                                    <h2 class="section-title" contenteditable="true">${data.title}</h2>
                                    <p class="form-description" contenteditable="true">${data.description}</p>
                                </div>
                                <form class="lead-generation-form">
                                    ${data.fields.map((field, i) => `
                                        <div class="form-field">
                                            <label contenteditable="true">${field.label}${field.required ? ' *' : ''}</label>
                                            <input type="${field.type}" placeholder="${field.label}" ${field.required ? 'required' : ''}>
                                        </div>
                                    `).join('')}
                                    <div class="form-field">
                                        <label contenteditable="true">${data.dropdownLabel}</label>
                                        <select>
                                            ${data.dropdownOptions.map(option => `
                                                <option>${option}</option>
                                            `).join('')}
                                        </select>
                                    </div>
                                    <button type="submit" class="submit-btn" contenteditable="true">${data.submitText}</button>
                                </form>
                            </div>
                            <div class="form-image">
                                <div class="decorative-graphic">Mountain Graphic</div>
                            </div>
                        </div>
                    </div>
                    <div class="drag-handle" draggable="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M9 3h6M9 7h6M9 11h6M9 15h6M9 19h6" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <div class="section-controls">
                        <button class="control-btn" onclick="duplicateSection(this)">Duplicate</button>
                        <button class="control-btn" onclick="toggleVariant(this)">Toggle Theme</button>
                        <button class="control-btn delete" onclick="deleteSection(this)">Delete</button>
                    </div>
                </div>
            `;
        }
    },
    'testimonial-single': {
        name: 'Single Testimonial with Large Quote',
        variants: ['light', 'dark'],
        render: (variant = 'light', content = {}) => {
            const defaults = {
                eyebrow: 'Student Success',
                title: 'Real Stories, Real Results',
                quote: 'The personalized mentorship I received transformed my career path. I went from uncertainty to landing my dream job at a Fortune 500 company before graduation. This program truly delivers on its promises.',
                name: 'Sarah Johnson',
                role: 'Computer Science, Class of 2024'
            };
            const data = { ...defaults, ...content };
            
            return `
                <div class="section testimonial-single ${variant}">
                    <div class="section-container">
                        <div class="testimonial-layout">
                            <div class="testimonial-image-large">
                                <div class="profile-placeholder">Profile Image</div>
                            </div>
                            <div class="testimonial-content-large">
                                <div class="testimonial-header">
                                    <div class="eyebrow" contenteditable="true">${data.eyebrow}</div>
                                    <h2 class="section-title" contenteditable="true">${data.title}</h2>
                                </div>
                                <blockquote class="testimonial-quote-large" contenteditable="true">"${data.quote}"</blockquote>
                                <div class="testimonial-attribution">
                                    <div class="testimonial-name" contenteditable="true">${data.name}</div>
                                    <div class="testimonial-role" contenteditable="true">${data.role}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="drag-handle" draggable="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M9 3h6M9 7h6M9 11h6M9 15h6M9 19h6" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <div class="section-controls">
                        <button class="control-btn" onclick="duplicateSection(this)">Duplicate</button>
                        <button class="control-btn" onclick="toggleVariant(this)">Toggle Theme</button>
                        <button class="control-btn delete" onclick="deleteSection(this)">Delete</button>
                    </div>
                </div>
            `;
        }
    },
    'testimonial-carousel': {
        name: 'Testimonial Carousel',
        variants: ['light', 'dark'],
        render: (variant = 'light', content = {}) => {
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
            
            return `
                <div class="section testimonial-carousel ${variant}">
                    <div class="section-container">
                        <div class="section-header">
                            <div class="eyebrow" contenteditable="true">${data.eyebrow}</div>
                            <h2 class="section-title" contenteditable="true">${data.title}</h2>
                        </div>
                        <div class="testimonial-carousel-container">
                            <div class="testimonial-slide active">
                                <div class="testimonial-profile">
                                    <div class="profile-circle">Profile</div>
                                </div>
                                <blockquote class="testimonial-quote" contenteditable="true">"${data.testimonials[0].quote}"</blockquote>
                                <div class="testimonial-info">
                                    <div class="testimonial-name" contenteditable="true">${data.testimonials[0].name}</div>
                                    <div class="testimonial-role" contenteditable="true">${data.testimonials[0].role}</div>
                                </div>
                            </div>
                            <div class="carousel-dots">
                                <span class="dot active"></span>
                                <span class="dot"></span>
                                <span class="dot"></span>
                            </div>
                        </div>
                    </div>
                    <div class="drag-handle" draggable="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M9 3h6M9 7h6M9 11h6M9 15h6M9 19h6" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <div class="section-controls">
                        <button class="control-btn" onclick="duplicateSection(this)">Duplicate</button>
                        <button class="control-btn" onclick="toggleVariant(this)">Toggle Theme</button>
                        <button class="control-btn delete" onclick="deleteSection(this)">Delete</button>
                    </div>
                </div>
            `;
        }
    }
};

// Add class mappings for elements that use different class names
const classNameMappings = {
    'program-title': 'program-title',
    'program-description': 'program-description',
    'form-description': 'form-description',
    'submit-btn': 'submit-btn'
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    updateCanvas();
});

// Event listeners
function setupEventListeners() {
    // Section library clicks
    sectionLibrary.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const btn = e.target.closest('.section-btn');
        if (btn && !btn.disabled) {
            const sectionType = btn.dataset.section;
            
            // Temporarily disable button to prevent double clicks
            btn.disabled = true;
            
            addSection(sectionType);
            
            // Re-enable button after a short delay
            setTimeout(() => {
                btn.disabled = false;
            }, 300);
        }
    });

    // Viewport controls
    viewportBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            viewportBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.currentViewport = btn.dataset.viewport;
            canvas.className = `canvas ${state.currentViewport}`;
        });
    });

    // Export/Import
    exportBtn.addEventListener('click', exportJSON);
    importBtn.addEventListener('click', () => importFile.click());
    importFile.addEventListener('change', handleImport);
    exportImageBtn.addEventListener('click', exportAsImage);
    deleteAllBtn.addEventListener('click', deleteAllSections);
    
    // Undo/Redo
    undoBtn.addEventListener('click', undo);
    redoBtn.addEventListener('click', redo);
    
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
}

// Add section to canvas
function addSection(type, variant = 'light', content = {}) {
    const template = sectionTemplates[type];
    if (!template) return;

    const sectionData = {
        id: Date.now(),
        type,
        variant,
        content
    };

    state.sections.push(sectionData);
    updateCanvas();
}

// Update canvas with current sections
function updateCanvas() {
    if (state.sections.length === 0) {
        canvas.innerHTML = '<div class="empty-state"><p>Click a section from the library to get started</p></div>';
        return;
    }

    const wireframeHtml = state.sections.map(section => {
        const template = sectionTemplates[section.type];
        return template ? template.render(section.variant, section.content) : '';
    }).join('');

    canvas.innerHTML = `<div class="wireframe-container">${wireframeHtml}</div>`;
}

// Toggle section variant
function toggleVariant(btn) {
    const section = btn.closest('.section');
    const index = Array.from(canvas.querySelectorAll('.section')).indexOf(section);
    
    if (state.sections[index]) {
        state.sections[index].variant = state.sections[index].variant === 'light' ? 'dark' : 'light';
        updateCanvas();
    }
}

// Delete section
function deleteSection(btn) {
    const section = btn.closest('.section');
    const index = Array.from(canvas.querySelectorAll('.section')).indexOf(section);
    
    if (confirm('Are you sure you want to delete this section?')) {
        state.sections.splice(index, 1);
        updateCanvas();
    }
}

// Export functions
function exportJSON() {
    // Capture current content from contenteditable elements
    const sections = canvas.querySelectorAll('.section');
    sections.forEach((section, index) => {
        if (!state.sections[index]) return;
        
        const content = {};
        
        // Capture common elements
        const eyebrow = section.querySelector('.eyebrow');
        if (eyebrow) content.eyebrow = eyebrow.textContent.trim();
        
        const title = section.querySelector('.section-title');
        if (title) content.title = title.textContent.trim();
        
        const subtitle = section.querySelector('.section-subtitle');
        if (subtitle) content.subtitle = subtitle.textContent.trim();
        
        // Section-specific content
        if (section.classList.contains('content-cta')) {
            const body = section.querySelector('.body-content');
            if (body) content.body = body.textContent.trim();
            
            const cta = section.querySelector('.cta-button');
            if (cta) content.ctaText = cta.textContent.trim();
        }
        
        if (section.classList.contains('three-column')) {
            const columns = [];
            section.querySelectorAll('.column-item').forEach(col => {
                const colTitle = col.querySelector('.column-title');
                const colDesc = col.querySelector('.column-description');
                columns.push({
                    title: colTitle ? colTitle.textContent.trim() : '',
                    description: colDesc ? colDesc.textContent.trim() : ''
                });
            });
            content.columns = columns;
            
            const cta = section.querySelector('.cta-button');
            if (cta) content.ctaText = cta.textContent.trim();
        }
        
        state.sections[index].content = content;
    });

    const exportData = {
        version: '1.0',
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
}

// Import functions
function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            if (data.sections && Array.isArray(data.sections)) {
                state.sections = data.sections;
                updateCanvas();
                alert('Wireframe imported successfully!');
            } else {
                alert('Invalid file format');
            }
        } catch (error) {
            alert('Error importing file: ' + error.message);
        }
    };
    reader.readAsText(file);
}

// Export as image
async function exportAsImage() {
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
        // Show loading state
        exportImageBtn.disabled = true;
        exportImageBtn.textContent = 'Generating...';
        
        // Hide controls temporarily for cleaner export
        const controls = wireframe.querySelectorAll('.section-controls, .drag-handle');
        controls.forEach(el => el.style.display = 'none');
        
        // Generate canvas from HTML
        const canvas = await html2canvas(wireframe, {
            backgroundColor: '#ffffff',
            scale: 2, // Higher quality
            logging: false,
            useCORS: true,
            allowTaint: true
        });
        
        // Restore controls
        controls.forEach(el => el.style.display = '');
        
        // Convert to blob
        canvas.toBlob(function(blob) {
            // Create download link
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            // Generate filename with date
            const date = new Date().toISOString().split('T')[0];
            a.download = `wireframe-${date}.png`;
            
            // Trigger download
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            // Cleanup
            URL.revokeObjectURL(url);
            
            // Reset button
            exportImageBtn.disabled = false;
            exportImageBtn.textContent = 'Export as Image';
        }, 'image/png');
        
    } catch (error) {
        alert('Error exporting image: ' + error.message);
        console.error('Export error:', error);
        
        // Reset button
        exportImageBtn.disabled = false;
        exportImageBtn.textContent = 'Export as Image';
    }
}

// Delete all sections
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

// Educational guidance system
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
        idealChars: 50,
        tips: [
            'Headlines work best at 6-10 words',
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
        maxChars: 250,
        idealChars: 150,
        tips: [
            'Limit to 2-3 concise sentences',
            'Lead with most compelling benefit',
            'Use simple, conversational language',
            'Each sentence should add new value'
        ]
    },
    'cta-button': {
        maxChars: 20,
        idealChars: 12,
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
            'Good examples: "Send", "Submit", "Get Info"',
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
    'form-field label': {
        maxChars: 25,
        idealChars: 15,
        tips: [
            'Use standard labels users expect',
            'Examples: "Email", "First Name", "Phone Number"',
            'Mark required fields with asterisk (*)',
            'Keep forms to 5-7 fields maximum for conversion'
        ]
    },
    'form-description': {
        maxChars: 100,
        idealChars: 75,
        tips: [
            'Set expectations clearly',
            'Mention response time',
            'Keep to one sentence',
            'Build trust with privacy note'
        ]
    },
    'testimonial-quote': {
        maxChars: 180,
        idealChars: 140,
        tips: [
            'Best testimonials are 20-30 words',
            'Include specific outcome or transformation',
            'Keep authentic voice and tone',
            'One powerful statement beats many'
        ]
    },
    'testimonial-quote-large': {
        maxChars: 280,
        idealChars: 200,
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
    'general': {
        tips: [
            'Mobile users see 30-40% less content',
            'Higher ed compliance: avoid guarantees',
            'Focus on outcomes, not features',
            'Use inclusive, accessible language'
        ]
    }
};

// Initialize guidance system
function initializeGuidance() {
    const guidancePanel = document.getElementById('guidancePanel');
    const guidanceContent = document.getElementById('guidanceContent');
    
    // Add event delegation for contenteditable elements
    document.addEventListener('focus', (e) => {
        if (e.target.contentEditable === 'true') {
            showGuidance(e.target);
            addCharacterCounter(e.target);
            checkContentLength(e.target);
        }
    }, true);
    
    document.addEventListener('blur', (e) => {
        if (e.target.contentEditable === 'true') {
            removeCharacterCounter(e.target);
            hideGuidance();
            // Reset border color on blur
            e.target.style.borderColor = '';
        }
    }, true);
    
    // Use 'input' event for real-time updates
    document.addEventListener('input', (e) => {
        if (e.target.contentEditable === 'true') {
            updateCharacterCounter(e.target);
            checkContentLength(e.target);
            updateGuidancePanel(e.target);
        }
    }, true);
    
    // Also listen for keyup to catch all changes
    document.addEventListener('keyup', (e) => {
        if (e.target.contentEditable === 'true') {
            updateCharacterCounter(e.target);
            checkContentLength(e.target);
        }
    }, true);
}

// Show guidance for specific element
function showGuidance(element) {
    const guidancePanel = document.getElementById('guidancePanel');
    const guidanceContent = document.getElementById('guidanceContent');
    
    // Determine element type
    let elementType = 'general';
    const classList = element.classList;
    
    for (const className of classList) {
        if (writingGuidelines[className]) {
            elementType = className;
            break;
        }
    }
    
    // Special case for form labels
    if (element.tagName === 'LABEL') {
        elementType = 'form-field label';
    }
    
    // Build guidance content
    const guidelines = writingGuidelines[elementType] || writingGuidelines.general;
    let html = '';
    
    if (guidelines.maxChars) {
        const currentLength = element.textContent.trim().length;
        const status = getCharCountStatus(currentLength, guidelines.idealChars, guidelines.maxChars);
        
        html += `
            <div class="guidance-tip ${status}">
                <strong>Character Count:</strong> ${currentLength} / ${guidelines.idealChars} ideal
                <div class="char-count ${status}">
                    Max recommended: ${guidelines.maxChars}
                </div>
            </div>
        `;
    }
    
    if (guidelines.tips && guidelines.tips.length > 0) {
        html += '<div class="guidance-tip">';
        html += '<strong>Writing Tips:</strong>';
        html += '<ul style="margin: 0.5rem 0 0 1.25rem; padding: 0;">';
        guidelines.tips.forEach(tip => {
            html += `<li style="margin-bottom: 0.25rem;">${tip}</li>`;
        });
        html += '</ul>';
        html += '</div>';
    }
    
    // Add responsive warning if needed
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

// Get character count status
function getCharCountStatus(current, ideal, max) {
    if (current > max) return 'error';
    if (current > ideal) return 'warning';
    return '';
}

// Add character counter to element
function addCharacterCounter(element) {
    if (element.nextElementSibling?.classList.contains('char-indicator')) {
        return; // Already has counter
    }
    
    const counter = document.createElement('div');
    counter.className = 'char-indicator';
    element.parentNode.insertBefore(counter, element.nextSibling);
    updateCharacterCounter(element);
}

// Update character counter
function updateCharacterCounter(element) {
    const counter = element.nextElementSibling;
    if (!counter?.classList.contains('char-indicator')) return;
    
    const length = element.textContent.trim().length;
    let guideline = null;
    
    // Find matching guideline
    for (const className of element.classList) {
        if (writingGuidelines[className]) {
            guideline = writingGuidelines[className];
            break;
        }
    }
    
    if (guideline?.maxChars) {
        const status = getCharCountStatus(length, guideline.idealChars, guideline.maxChars);
        counter.textContent = `${length} / ${guideline.idealChars}`;
        counter.className = `char-indicator ${status}`;
    } else {
        counter.textContent = `${length} chars`;
    }
}

// Remove character counter
function removeCharacterCounter(element) {
    const counter = element.nextElementSibling;
    if (counter?.classList.contains('char-indicator')) {
        counter.remove();
    }
    
    // Guidance will be hidden by hideGuidance() function on blur
}

// Check content length and show warnings
function checkContentLength(element) {
    let guideline = null;
    
    for (const className of element.classList) {
        if (writingGuidelines[className]) {
            guideline = writingGuidelines[className];
            break;
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

// Hide guidance panel
function hideGuidance() {
    const guidancePanel = document.getElementById('guidancePanel');
    guidancePanel.classList.remove('active');
}

// Update guidance panel content
function updateGuidancePanel(element) {
    const guidanceContent = document.getElementById('guidanceContent');
    
    // Determine element type
    let elementType = 'general';
    const classList = element.classList;
    
    for (const className of classList) {
        if (writingGuidelines[className]) {
            elementType = className;
            break;
        }
    }
    
    // Update character count in guidance panel
    const guidelines = writingGuidelines[elementType] || writingGuidelines.general;
    if (guidelines.maxChars) {
        const currentLength = element.textContent.trim().length;
        const charCountDiv = guidanceContent.querySelector('.guidance-tip .char-count');
        if (charCountDiv) {
            const status = getCharCountStatus(currentLength, guidelines.idealChars, guidelines.maxChars);
            const parentDiv = charCountDiv.parentElement;
            parentDiv.className = `guidance-tip ${status}`;
            parentDiv.innerHTML = `
                <strong>Character Count:</strong> ${currentLength} / ${guidelines.idealChars} ideal
                <div class="char-count ${status}">
                    Max recommended: ${guidelines.maxChars}
                </div>
            `;
        }
    }
}

// Duplicate section
function duplicateSection(btn) {
    const section = btn.closest('.section');
    const index = Array.from(canvas.querySelectorAll('.section')).indexOf(section);
    
    if (state.sections[index]) {
        const originalSection = state.sections[index];
        const duplicatedSection = {
            ...originalSection,
            id: Date.now(),
            content: { ...originalSection.content }
        };
        
        // Insert after the original
        state.sections.splice(index + 1, 0, duplicatedSection);
        updateCanvas();
    }
}

// Drag and Drop functionality
let draggedElement = null;
let draggedIndex = null;

function initializeDragAndDrop() {
    // Use event delegation for drag events
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
        // Remove all drag-over classes first
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
    
    // Reorder the sections array
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

// History Management
function saveToHistory() {
    // Remove any states after current index (for when we've undone and then make a new change)
    state.history = state.history.slice(0, state.historyIndex + 1);
    
    // Add current state to history
    const historyEntry = {
        sections: JSON.parse(JSON.stringify(state.sections)),
        timestamp: Date.now()
    };
    
    state.history.push(historyEntry);
    
    // Limit history size
    if (state.history.length > state.maxHistorySize) {
        state.history.shift();
    } else {
        state.historyIndex++;
    }
    
    updateHistoryButtons();
}

function undo() {
    if (state.historyIndex > 0) {
        state.historyIndex--;
        const historyEntry = state.history[state.historyIndex];
        state.sections = JSON.parse(JSON.stringify(historyEntry.sections));
        updateCanvas(false); // false to skip saving to history
        updateHistoryButtons();
    }
}

function redo() {
    if (state.historyIndex < state.history.length - 1) {
        state.historyIndex++;
        const historyEntry = state.history[state.historyIndex];
        state.sections = JSON.parse(JSON.stringify(historyEntry.sections));
        updateCanvas(false); // false to skip saving to history
        updateHistoryButtons();
    }
}

function updateHistoryButtons() {
    undoBtn.disabled = state.historyIndex <= 0;
    redoBtn.disabled = state.historyIndex >= state.history.length - 1;
}

// Update the updateCanvas function to save history
const originalUpdateCanvas = updateCanvas;
updateCanvas = function(saveHistory = true) {
    originalUpdateCanvas();
    if (saveHistory && state.sections.length >= 0) {
        saveToHistory();
    }
};

// Update initialization
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    initializeGuidance();
    initializeDragAndDrop();
    
    // Initialize with empty canvas (don't save to history yet)
    updateCanvas(false);
    
    // Now save initial empty state to history
    saveToHistory();
});