import { escapeHtml } from './utils.js';
import { state } from './state.js';
import sectionTemplates from './sections/index.js';

// Build writing guidelines from section field metadata
// This provides backwards-compatible CSS-class-based lookup
// plus a new field-key-based lookup from the registry.
function buildGuidelinesFromRegistry() {
    const guidelines = {};

    // Map CSS class names to field keys for each section
    const classToFieldKey = {
        'eyebrow': 'eyebrow',
        'section-title': 'title',
        'section-subtitle': 'subtitle',
        'body-content': 'body',
        'cta-button': 'ctaText',
        'submit-btn': 'submitText',
        'stat-number': null, // special handling
        'stat-label': null,
        'column-title': null,
        'column-description': null,
        'program-title': null,
        'program-description': null,
        'form-description': 'description',
        'testimonial-quote': null,
        'testimonial-quote-large': 'quote',
        'testimonial-name': 'name',
        'testimonial-role': 'role'
    };

    // Populate from section templates
    for (const template of Object.values(sectionTemplates)) {
        for (const field of template.fields || []) {
            if (field.maxChars) {
                // Store by field key for direct lookup
                if (!guidelines[field.key]) {
                    guidelines[field.key] = {
                        maxChars: field.maxChars,
                        idealChars: field.idealChars,
                        tips: field.tips || []
                    };
                }
            }
        }
    }

    return guidelines;
}

// Static guidelines for CSS-class-based fields that don't map 1:1 from registry
const staticGuidelines = {
    'stat-number': {
        maxChars: 8, idealChars: 5,
        tips: ['Round to memorable numbers', 'Include unit symbol (%, K, +)', 'Examples: "97%", "10K+", "#1"', 'Make numbers instantly scannable']
    },
    'stat-label': {
        maxChars: 25, idealChars: 18,
        tips: ['Use 2-3 words maximum', 'Focus on the outcome', 'Examples: "Job Placement", "Graduation Rate"', 'Avoid complex metrics']
    },
    'column-title': {
        maxChars: 35, idealChars: 25,
        tips: ['Feature titles need 3-5 words', 'Start with benefit, not feature', 'Make each unique and specific', 'Consider icon pairing']
    },
    'column-description': {
        maxChars: 100, idealChars: 75,
        tips: ['One compelling sentence is best', 'Expand on title benefit', 'Keep under 15 words', 'Use active, present tense']
    },
    'program-title': {
        maxChars: 50, idealChars: 35,
        tips: ['Use official program names', 'Include degree type when relevant', 'Examples: "MBA in Finance", "B.S. Computer Science"', 'Maintain consistency across all cards']
    },
    'program-description': {
        maxChars: 120, idealChars: 90,
        tips: ['Focus on career outcomes', 'Mention 1-2 key differentiators', 'Keep to 15-20 words', 'Highlight demand or growth']
    },
    'testimonial-quote': {
        maxChars: 200, idealChars: 150,
        tips: ['Best testimonials are 20-30 words', 'Include specific outcome or transformation', 'Keep authentic voice and tone', 'One powerful statement beats many']
    },
    'general': {
        tips: ['Mobile users see 30-40% less content', 'Higher ed compliance: avoid guarantees', 'Focus on outcomes, not features', 'Use inclusive, accessible language']
    }
};

// CSS class to guideline key mapping (for elements looked up by class)
const classMap = {
    'eyebrow': 'eyebrow',
    'section-title': 'title',
    'section-subtitle': 'subtitle',
    'body-content': 'body',
    'cta-button': 'ctaText',
    'submit-btn': 'submitText',
    'form-description': 'description',
    'testimonial-quote-large': 'quote',
    'testimonial-name': 'name',
    'testimonial-role': 'role'
};

let registryGuidelines = null;

function getGuidelines() {
    if (!registryGuidelines) {
        registryGuidelines = buildGuidelinesFromRegistry();
    }
    return registryGuidelines;
}

// Look up guideline for an element, considering its section context
export function getGuidelineForElement(element) {
    const parentSection = element.closest('.section');
    const sectionType = parentSection ? parentSection.dataset.sectionType : null;

    // Try section-specific field lookup from registry
    if (sectionType && sectionTemplates[sectionType]) {
        const template = sectionTemplates[sectionType];
        const dataField = element.dataset.field;
        if (dataField && template.fields) {
            const fieldDef = template.fields.find(f => f.key === dataField);
            if (fieldDef && fieldDef.maxChars) {
                return {
                    maxChars: fieldDef.maxChars,
                    idealChars: fieldDef.idealChars,
                    tips: fieldDef.tips || []
                };
            }
        }
    }

    // Try CSS class-based lookup (for sub-items like stat-number, column-title, etc.)
    for (const className of element.classList) {
        // Check static guidelines first (for items not in registry fields)
        if (staticGuidelines[className]) {
            return staticGuidelines[className];
        }
        // Then check registry via class map
        if (classMap[className]) {
            const g = getGuidelines();
            if (g[classMap[className]]) return g[classMap[className]];
        }
    }

    return staticGuidelines.general;
}

// Initialize guidance system with debounced updates
let guidanceTimeout;

export function initializeGuidance() {
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
            e.target.style.borderColor = '';
        }
    }, true);

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

function getCharCountStatus(current, ideal, max) {
    if (current > max) return 'error';
    if (current > ideal) return 'warning';
    return '';
}

function showGuidance(element) {
    const guidancePanel = document.getElementById('guidancePanel');
    const guidanceContent = document.getElementById('guidanceContent');
    const guidelines = getGuidelineForElement(element);

    let html = '';

    if (guidelines.maxChars) {
        const currentLength = element.textContent.trim().length;
        const status = getCharCountStatus(currentLength, guidelines.idealChars, guidelines.maxChars);

        if (element.classList.contains('body-content')) {
            const wordCount = element.textContent.trim().split(/\s+/).filter(w => w.length > 0).length;
            html += `
                <div class="guidance-tip ${status}">
                    <strong>Character Count:</strong> ${currentLength} / ${guidelines.idealChars} ideal
                    <div class="char-count ${status}">Max recommended: ${guidelines.maxChars} characters</div>
                    <strong>Word Count:</strong> ${wordCount} / 50-75 ideal
                </div>
            `;
        } else {
            html += `
                <div class="guidance-tip ${status}">
                    <strong>Character Count:</strong> ${currentLength} / ${guidelines.idealChars} ideal
                    <div class="char-count ${status}">Max recommended: ${guidelines.maxChars}</div>
                </div>
            `;
        }
    }

    if (guidelines.tips && guidelines.tips.length > 0) {
        html += '<div class="guidance-tip"><strong>Writing Tips:</strong>';
        html += '<ul style="margin: 0.5rem 0 0 1.25rem; padding: 0;">';
        guidelines.tips.forEach(tip => {
            html += `<li style="margin-bottom: 0.25rem;">${escapeHtml(tip)}</li>`;
        });
        html += '</ul></div>';
    }

    if (state.currentViewport === 'mobile' && element.textContent.length > 50) {
        html += `<div class="guidance-tip warning"><strong>Mobile Alert:</strong> This text may be too long for mobile screens. Consider shortening for better readability.</div>`;
    }

    guidanceContent.innerHTML = html;
    guidancePanel.classList.add('active');
}

function addCharacterCounter(element) {
    if (element.nextElementSibling?.classList.contains('char-indicator')) return;
    const counter = document.createElement('div');
    counter.className = 'char-indicator';
    element.parentNode.insertBefore(counter, element.nextSibling);
    updateCharacterCounter(element);
}

function updateCharacterCounter(element) {
    const counter = element.nextElementSibling;
    if (!counter?.classList.contains('char-indicator')) return;

    const length = element.textContent.trim().length;
    const guideline = getGuidelineForElement(element);

    if (element.classList.contains('body-content') && guideline.maxChars) {
        const wordCount = element.textContent.trim().split(/\s+/).filter(w => w.length > 0).length;
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
    if (counter?.classList.contains('char-indicator')) counter.remove();
}

function checkContentLength(element) {
    const guideline = getGuidelineForElement(element);
    if (guideline?.maxChars) {
        const length = element.textContent.trim().length;
        if (length > guideline.maxChars) {
            element.style.borderColor = 'var(--color-brand-primary)';
        } else if (length > guideline.idealChars) {
            element.style.borderColor = '#F59E0B';
        } else {
            element.style.borderColor = '';
        }
    }
}

function hideGuidance() {
    document.getElementById('guidancePanel').classList.remove('active');
}

function updateGuidancePanel(element) {
    const guidanceContent = document.getElementById('guidanceContent');
    const guidelines = getGuidelineForElement(element);

    if (guidelines.maxChars) {
        const currentLength = element.textContent.trim().length;
        const charCountDiv = guidanceContent.querySelector('.guidance-tip .char-count');
        if (charCountDiv) {
            const status = getCharCountStatus(currentLength, guidelines.idealChars, guidelines.maxChars);
            const parentDiv = charCountDiv.parentElement;
            parentDiv.className = `guidance-tip ${status}`;

            if (element.classList.contains('body-content')) {
                const wordCount = element.textContent.trim().split(/\s+/).filter(w => w.length > 0).length;
                parentDiv.innerHTML = `
                    <strong>Character Count:</strong> ${currentLength} / ${guidelines.idealChars} ideal
                    <div class="char-count ${status}">Max recommended: ${guidelines.maxChars} characters</div>
                    <strong>Word Count:</strong> ${wordCount} / 50-75 ideal
                `;
            } else {
                parentDiv.innerHTML = `
                    <strong>Character Count:</strong> ${currentLength} / ${guidelines.idealChars} ideal
                    <div class="char-count ${status}">Max recommended: ${guidelines.maxChars}</div>
                `;
            }
        }
    }
}
