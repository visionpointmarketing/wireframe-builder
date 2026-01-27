import { escapeHtml, renderIfVisible, wrapSection, unescapeHtml, renderImagePlaceholder } from '../utils.js';

const EXTRA_CONTROLS = `
    <button class="control-btn layout-btn" aria-label="Toggle layout direction">Toggle Layout</button>
    <button class="control-btn form-edit-btn" aria-label="Edit form fields">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
        Edit Form
    </button>
`;

export default {
    type: 'lead-form',
    name: 'Lead Generation Form',
    category: 'forms',
    variants: ['light', 'dark'],
    hasLayout: true,

    defaults: {
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
    },

    fields: [
        { key: 'eyebrow', label: 'Eyebrow Text', exportLabel: 'Eyebrow', maxChars: 35, idealChars: 25, tips: ['Keep eyebrow text to 3-5 words', 'Use as category label or key benefit', 'Examples: "Why Choose Us", "Student Success"', 'Avoid punctuation and full sentences'] },
        { key: 'title', label: 'Heading', exportLabel: 'Headline', maxChars: 70, idealChars: 45, tips: ['Headlines work best at 6-12 words (35-70 characters)', 'Front-load with key benefit or outcome', 'Use power words that evoke emotion', 'Make it specific to your audience'] },
        { key: 'description', label: 'Description', exportLabel: 'Subhead', maxChars: 140, idealChars: 100, tips: ['Set clear expectations about next steps', 'Mention response time to build trust', 'Keep to one compelling sentence', 'Consider privacy reassurance'] },
        { key: 'submitText', label: 'Submit Button', exportLabel: 'Submit Button', maxChars: 20, idealChars: 12, tips: ['Keep form buttons concise', 'Good examples: "Submit", "Get Started", "Get Info"', 'Match button text to form purpose', 'Ensure mobile tap targets are 44px+'] }
    ],

    render(variant, content, layoutDirection, visibility) {
        const data = { ...this.defaults, ...content };
        if (typeof data.eyebrow === 'string') data.eyebrow = escapeHtml(data.eyebrow);
        if (typeof data.title === 'string') data.title = escapeHtml(data.title);
        if (typeof data.description === 'string') data.description = escapeHtml(data.description);
        if (typeof data.submitText === 'string') data.submitText = escapeHtml(data.submitText);

        data.fields = data.fields.map(field => ({
            ...field,
            label: escapeHtml(field.label || ''),
            placeholder: field.placeholder ? escapeHtml(field.placeholder) : '',
            helpText: field.helpText ? escapeHtml(field.helpText) : '',
            options: field.options ? field.options.map(opt => escapeHtml(opt)) : undefined
        }));

        const fieldsHtml = data.fields.map((field, i) => {
            let fieldHtml = '<div class="form-field">';
            fieldHtml += `<label for="field-${i}">${field.label}${field.required ? ' *' : ''}</label>`;

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
                            fieldHtml += `<label class="radio-label"><input type="radio" name="field-${i}" value="${option}" ${field.required && optIndex === 0 ? 'required' : ''}>${option}</label>`;
                        });
                        fieldHtml += '</div>';
                    }
                    break;
                case 'checkbox':
                    if (field.options && field.options.length > 1) {
                        fieldHtml += '<div class="checkbox-group">';
                        field.options.forEach((option) => {
                            fieldHtml += `<label class="checkbox-label"><input type="checkbox" name="field-${i}" value="${option}">${option}</label>`;
                        });
                        fieldHtml += '</div>';
                    } else {
                        fieldHtml = '<div class="form-field checkbox-single">';
                        fieldHtml += `<label class="checkbox-label"><input type="checkbox" id="field-${i}" ${field.required ? 'required' : ''}><span>${field.label}</span></label>`;
                    }
                    break;
                case 'consent':
                    fieldHtml = '<div class="form-field consent-field">';
                    fieldHtml += `<label class="checkbox-label"><input type="checkbox" id="field-${i}" ${field.required ? 'required' : ''}><span>${field.label}</span></label>`;
                    break;
                default:
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
        }).join('');

        const inner = `
            <div class="form-layout ${layoutDirection === 'reversed' ? 'reversed' : ''}">
                <div class="form-content">
                    <div class="form-header">
                        ${renderIfVisible('eyebrow', `<div class="eyebrow editable" contenteditable="true" data-field="eyebrow">${data.eyebrow}</div>`, visibility)}
                        ${renderIfVisible('title', `<h2 class="section-title editable" contenteditable="true" data-field="title">${data.title}</h2>`, visibility)}
                        ${renderIfVisible('description', `<p class="form-description editable" contenteditable="true" data-field="description">${data.description}</p>`, visibility)}
                    </div>
                    <form class="lead-generation-form" onsubmit="return false;">
                        ${fieldsHtml}
                        ${renderIfVisible('submitText', `<button type="submit" class="submit-btn editable" contenteditable="true" data-field="submitText">${data.submitText}</button>`, visibility)}
                    </form>
                </div>
                <div class="form-image">
                    ${renderImagePlaceholder('decorative', data.images, 'decorative-graphic', 'Image Placeholder')}
                </div>
            </div>
        `;

        return wrapSection(this.type, variant, inner, EXTRA_CONTROLS);
    },

    toDocFormat(section) {
        const content = section.content || {};
        const visibility = section.visibility || {};

        const result = this.fields.slice(0, 3) // eyebrow, title, description
            .filter(f => visibility[f.key] !== false && (content[f.key] || this.defaults[f.key]))
            .map(f => ({ label: f.exportLabel, value: content[f.key] || this.defaults[f.key] }));

        result.push({ label: '', value: '' });
        result.push({ label: 'Form Fields', value: '' });

        const fields = content.fields && content.fields.length > 0 ? content.fields : this.defaults.fields;
        fields.forEach((field, index) => {
            const cleanLabel = unescapeHtml(field.label || '');
            const cleanPlaceholder = field.placeholder ? unescapeHtml(field.placeholder) : '';
            const cleanOptions = field.options ? field.options.map(opt => unescapeHtml(opt)) : [];

            let fieldInfo = `${cleanLabel} (${field.type})`;
            if (field.required) fieldInfo += ' - Required';
            if (cleanPlaceholder) fieldInfo += ` - Placeholder: "${cleanPlaceholder}"`;
            if (cleanOptions.length > 0) fieldInfo += ` - Options: ${cleanOptions.join(', ')}`;
            result.push({ label: `  Field ${index + 1}`, value: fieldInfo });
        });

        result.push({ label: '', value: '' });
        result.push({ label: 'Submit Button', value: content.submitText || this.defaults.submitText });

        return result;
    }
};
