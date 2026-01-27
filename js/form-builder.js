import { escapeHtml } from './utils.js';
import { state } from './state.js';

export class FormBuilder {
    constructor(updateCanvasFn) {
        this.updateCanvas = updateCanvasFn;
        this.modal = document.getElementById('formBuilderBackdrop');
        this.fieldsList = document.getElementById('formFieldsList');
        this.fieldTypeSelector = document.getElementById('fieldTypeSelector');
        this.fieldCountEl = document.getElementById('fbFieldCount');
        this.currentSectionIndex = null;
        this.expandedFieldId = null;
        this.formFields = [];

        this.fieldTypes = {
            text: { label: 'Text Input', shortLabel: 'text', defaultLabel: 'Text Field' },
            email: { label: 'Email', shortLabel: 'email', defaultLabel: 'Email Address' },
            tel: { label: 'Phone', shortLabel: 'tel', defaultLabel: 'Phone Number' },
            number: { label: 'Number', shortLabel: 'number', defaultLabel: 'Number' },
            date: { label: 'Date', shortLabel: 'date', defaultLabel: 'Date' },
            select: { label: 'Dropdown', shortLabel: 'select', defaultLabel: 'Select Option' },
            radio: { label: 'Radio', shortLabel: 'radio', defaultLabel: 'Radio Group' },
            checkbox: { label: 'Checkbox', shortLabel: 'checkbox', defaultLabel: 'Checkbox' },
            textarea: { label: 'Textarea', shortLabel: 'textarea', defaultLabel: 'Comments' },
            consent: { label: 'Consent', shortLabel: 'consent', defaultLabel: 'I agree to the terms' }
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
        document.getElementById('closeFormBuilder').addEventListener('click', () => this.close());
        document.getElementById('cancelFormBuilder').addEventListener('click', () => this.close());
        document.getElementById('saveFormBuilder').addEventListener('click', () => this.save());
        document.getElementById('addFieldBtn').addEventListener('click', () => this.toggleFieldTypeSelector());

        document.querySelectorAll('.field-type-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.addField(btn.dataset.type);
                this.hideFieldTypeSelector();
            });
        });

        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.addEventListener('click', () => this.loadTemplate(btn.dataset.template));
        });

        this.modal.addEventListener('click', (e) => {
            if (!e.target.closest('.fb-add-dropdown') && !e.target.closest('#addFieldBtn')) {
                this.hideFieldTypeSelector();
            }
        });
    }

    open(sectionIndex) {
        this.currentSectionIndex = sectionIndex;
        const section = state.sections[sectionIndex];

        if (section && section.type === 'lead-form') {
            this.formFields = JSON.parse(JSON.stringify(section.content.fields || [
                { id: this.generateFieldId(), type: 'text', label: 'First Name', required: true },
                { id: this.generateFieldId(), type: 'text', label: 'Last Name', required: true },
                { id: this.generateFieldId(), type: 'email', label: 'Email', required: true },
                { id: this.generateFieldId(), type: 'tel', label: 'Phone', required: false },
                { id: this.generateFieldId(), type: 'date', label: 'Birth Date', required: false }
            ]));

            this.formFields.forEach(field => {
                if (!field.id) field.id = this.generateFieldId();
            });

            this.expandedFieldId = null;
            this.renderFields();
            this.modal.style.display = 'flex';
        }
    }

    close() {
        this.modal.style.display = 'none';
        this.hideFieldTypeSelector();
        this.expandedFieldId = null;
    }

    save() {
        // Capture any open inline edits before saving
        this.captureInlineEdits();
        if (this.currentSectionIndex !== null) {
            const section = state.sections[this.currentSectionIndex];
            if (section && section.type === 'lead-form') {
                section.content.fields = JSON.parse(JSON.stringify(this.formFields));
                this.updateCanvas();
                this.close();
            }
        }
    }

    captureInlineEdits() {
        if (!this.expandedFieldId) return;
        const field = this.formFields.find(f => f.id === this.expandedFieldId);
        if (!field) return;

        const panel = this.fieldsList.querySelector(`.field-card.expanded .field-properties-panel`);
        if (!panel) return;

        const labelInput = panel.querySelector('[data-prop="label"]');
        const placeholderInput = panel.querySelector('[data-prop="placeholder"]');
        const requiredInput = panel.querySelector('[data-prop="required"]');
        const helpTextInput = panel.querySelector('[data-prop="helpText"]');

        if (labelInput) field.label = labelInput.value;
        if (placeholderInput) field.placeholder = placeholderInput.value;
        if (requiredInput) field.required = requiredInput.checked;
        if (helpTextInput) field.helpText = helpTextInput.value;

        // Options
        panel.querySelectorAll('input[data-option-index]').forEach(input => {
            const idx = parseInt(input.dataset.optionIndex);
            if (field.options && field.options[idx] !== undefined) {
                field.options[idx] = input.value;
            }
        });

        // Number min/max
        const minInput = panel.querySelector('[data-prop="min"]');
        const maxInput = panel.querySelector('[data-prop="max"]');
        if (minInput) field.min = minInput.value ? parseInt(minInput.value) : null;
        if (maxInput) field.max = maxInput.value ? parseInt(maxInput.value) : null;

        // Textarea rows
        const rowsInput = panel.querySelector('[data-prop="rows"]');
        if (rowsInput) field.rows = parseInt(rowsInput.value) || 4;
    }

    generateFieldId() {
        return 'field_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    addField(type) {
        // Capture current edits before changing expanded state
        this.captureInlineEdits();

        const fieldType = this.fieldTypes[type];
        const field = {
            id: this.generateFieldId(),
            type,
            label: fieldType.defaultLabel,
            placeholder: '',
            required: false,
            helpText: ''
        };

        if (type === 'select' || type === 'radio' || type === 'checkbox') {
            field.options = ['Option 1', 'Option 2', 'Option 3'];
        }
        if (type === 'number') { field.min = null; field.max = null; }
        if (type === 'textarea') { field.rows = 4; }

        this.formFields.push(field);
        this.expandedFieldId = field.id;
        this.renderFields();

        // Scroll new field into view
        const newCard = this.fieldsList.querySelector(`[data-field-id="${field.id}"]`);
        if (newCard) newCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    removeField(fieldId) {
        const index = this.formFields.findIndex(f => f.id === fieldId);
        if (index > -1) {
            this.formFields.splice(index, 1);
            if (this.expandedFieldId === fieldId) {
                this.expandedFieldId = null;
            }
            this.renderFields();
        }
    }

    toggleExpand(fieldId) {
        // Capture edits from currently expanded field before switching
        this.captureInlineEdits();

        if (this.expandedFieldId === fieldId) {
            this.expandedFieldId = null;
        } else {
            this.expandedFieldId = fieldId;
        }
        this.renderFields();
    }

    renderFields() {
        const count = this.formFields.length;
        this.fieldCountEl.textContent = `${count} field${count !== 1 ? 's' : ''}`;

        this.fieldsList.innerHTML = this.formFields.map((field) => {
            const ft = this.fieldTypes[field.type];
            const isExpanded = this.expandedFieldId === field.id;

            let propertiesHtml = '';
            if (isExpanded) {
                propertiesHtml = this.renderInlineProperties(field);
            }

            return `
                <div class="field-card${isExpanded ? ' expanded' : ''}" data-field-id="${field.id}">
                    <div class="field-card-header">
                        <div class="field-drag-handle" draggable="true">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 3h6M9 7h6M9 11h6M9 15h6M9 19h6"/>
                            </svg>
                        </div>
                        <div class="field-card-info">
                            <span class="field-card-label">${escapeHtml(field.label)}</span>
                            ${field.required ? '<span class="field-required">*</span>' : ''}
                            <span class="field-card-type">${ft.shortLabel}</span>
                        </div>
                        <div class="field-card-actions">
                            <button class="field-expand-btn" data-field-id="${field.id}" title="${isExpanded ? 'Collapse' : 'Expand'}">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M6 9l6 6 6-6"/>
                                </svg>
                            </button>
                            <button class="field-delete-btn" data-field-id="${field.id}" title="Delete field">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M18 6L6 18M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    ${propertiesHtml}
                </div>
            `;
        }).join('');

        // Bind events
        this.fieldsList.querySelectorAll('.field-card-header').forEach(header => {
            header.addEventListener('click', (e) => {
                if (e.target.closest('.field-delete-btn')) return;
                if (e.target.closest('.field-drag-handle')) return;
                const fieldId = header.closest('.field-card').dataset.fieldId;
                this.toggleExpand(fieldId);
            });
        });

        this.fieldsList.querySelectorAll('.field-delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('Delete this field?')) {
                    this.removeField(btn.dataset.fieldId);
                }
            });
        });

        // Inline property change handlers
        this.fieldsList.querySelectorAll('.field-properties-panel input, .field-properties-panel select, .field-properties-panel textarea').forEach(input => {
            input.addEventListener('input', () => this.handleInlinePropertyChange(input));
        });

        // Option remove buttons
        this.fieldsList.querySelectorAll('.option-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                this.captureInlineEdits();
                const field = this.formFields.find(f => f.id === this.expandedFieldId);
                if (!field || !field.options) return;
                const idx = parseInt(btn.dataset.optionIndex);
                field.options.splice(idx, 1);
                this.renderFields();
            });
        });

        // Add option buttons
        this.fieldsList.querySelectorAll('.add-option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.captureInlineEdits();
                const field = this.formFields.find(f => f.id === this.expandedFieldId);
                if (!field || !field.options) return;
                field.options.push(`Option ${field.options.length + 1}`);
                this.renderFields();
            });
        });

        this.initFieldDragDrop();
    }

    renderInlineProperties(field) {
        let html = `<div class="field-properties-panel">`;

        html += `
            <div class="property-row">
                <label>Label</label>
                <input type="text" data-prop="label" value="${escapeHtml(field.label || '')}">
            </div>
            <div class="property-row">
                <label>Placeholder</label>
                <input type="text" data-prop="placeholder" value="${escapeHtml(field.placeholder || '')}">
            </div>
            <div class="checkbox-row">
                <input type="checkbox" data-prop="required" ${field.required ? 'checked' : ''}>
                <span>Required</span>
            </div>
            <div class="property-row">
                <label>Help Text</label>
                <input type="text" data-prop="helpText" value="${escapeHtml(field.helpText || '')}">
            </div>
        `;

        if (field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') {
            html += `
                <div class="property-row">
                    <label>Options</label>
                    <div class="options-list">
                        ${(field.options || []).map((opt, i) => `
                            <div class="option-item">
                                <input type="text" value="${escapeHtml(opt)}" data-option-index="${i}">
                                <button class="option-remove" data-option-index="${i}">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M18 6L6 18M6 6l12 12"/>
                                    </svg>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                    <button class="btn btn-secondary btn-sm add-option-btn" style="margin-top: var(--space-sm)">Add Option</button>
                </div>
            `;
        }

        if (field.type === 'number') {
            html += `
                <div class="property-row">
                    <label>Min Value</label>
                    <input type="number" data-prop="min" value="${field.min != null ? field.min : ''}">
                </div>
                <div class="property-row">
                    <label>Max Value</label>
                    <input type="number" data-prop="max" value="${field.max != null ? field.max : ''}">
                </div>
            `;
        }

        if (field.type === 'textarea') {
            html += `
                <div class="property-row">
                    <label>Rows</label>
                    <input type="number" data-prop="rows" value="${field.rows || 4}" min="1" max="10">
                </div>
            `;
        }

        html += `</div>`;
        return html;
    }

    handleInlinePropertyChange(input) {
        const field = this.formFields.find(f => f.id === this.expandedFieldId);
        if (!field) return;

        const prop = input.dataset.prop;
        if (prop === 'label') {
            field.label = input.value;
            // Update the label in the header row live
            const card = input.closest('.field-card');
            const labelSpan = card.querySelector('.field-card-label');
            if (labelSpan) labelSpan.textContent = input.value;
        } else if (prop === 'placeholder') {
            field.placeholder = input.value;
        } else if (prop === 'required') {
            field.required = input.checked;
            // Update the asterisk live
            const card = input.closest('.field-card');
            const reqSpan = card.querySelector('.field-required');
            if (input.checked && !reqSpan) {
                const labelSpan = card.querySelector('.field-card-label');
                labelSpan.insertAdjacentHTML('afterend', '<span class="field-required">*</span>');
            } else if (!input.checked && reqSpan) {
                reqSpan.remove();
            }
        } else if (prop === 'helpText') {
            field.helpText = input.value;
        } else if (prop === 'min') {
            field.min = input.value ? parseInt(input.value) : null;
        } else if (prop === 'max') {
            field.max = input.value ? parseInt(input.value) : null;
        } else if (prop === 'rows') {
            field.rows = parseInt(input.value) || 4;
        }

        // Handle option edits
        if (input.dataset.optionIndex !== undefined) {
            const idx = parseInt(input.dataset.optionIndex);
            if (field.options && field.options[idx] !== undefined) {
                field.options[idx] = input.value;
            }
        }
    }

    toggleFieldTypeSelector() {
        const addBtn = document.getElementById('addFieldBtn');
        if (this.fieldTypeSelector.style.display === 'none') {
            this.fieldTypeSelector.style.display = 'block';
            addBtn.classList.add('active');
        } else {
            this.hideFieldTypeSelector();
        }
    }

    hideFieldTypeSelector() {
        this.fieldTypeSelector.style.display = 'none';
        const addBtn = document.getElementById('addFieldBtn');
        if (addBtn) addBtn.classList.remove('active');
    }

    loadTemplate(templateName) {
        const template = this.templates[templateName];
        if (!template) return;

        if (confirm(`Load "${template.name}" template? This will replace all current fields.`)) {
            this.formFields = template.fields.map(field => ({
                ...field,
                id: this.generateFieldId()
            }));
            this.expandedFieldId = null;
            this.renderFields();
        }
    }

    initFieldDragDrop() {
        let draggedElement = null;

        this.fieldsList.querySelectorAll('.field-card').forEach((card) => {
            const handle = card.querySelector('.field-drag-handle');
            handle.style.cursor = 'grab';

            handle.addEventListener('dragstart', (e) => {
                e.dataTransfer.effectAllowed = 'move';
                draggedElement = card;
                card.classList.add('dragging');
                e.dataTransfer.setDragImage(card, 0, 0);
            });

            handle.addEventListener('dragend', () => {
                if (draggedElement) {
                    draggedElement.classList.remove('dragging');
                    draggedElement = null;
                    const newOrder = Array.from(this.fieldsList.querySelectorAll('.field-card')).map(el =>
                        this.formFields.find(f => f.id === el.dataset.fieldId)
                    ).filter(Boolean);
                    this.formFields = newOrder;
                }
            });

            handle.addEventListener('mousedown', () => { handle.style.cursor = 'grabbing'; });
            handle.addEventListener('mouseup', () => { handle.style.cursor = 'grab'; });
            handle.addEventListener('mouseleave', () => { handle.style.cursor = 'grab'; });

            card.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                const draggingCard = this.fieldsList.querySelector('.dragging');
                if (!draggingCard || draggingCard === card) return;
                const siblings = [...this.fieldsList.querySelectorAll('.field-card:not(.dragging)')];
                const nextSibling = siblings.find(sibling => {
                    const rect = sibling.getBoundingClientRect();
                    return e.clientY < rect.top + rect.height / 2;
                });
                if (nextSibling) {
                    this.fieldsList.insertBefore(draggingCard, nextSibling);
                } else {
                    this.fieldsList.appendChild(draggingCard);
                }
            });
        });
    }
}
