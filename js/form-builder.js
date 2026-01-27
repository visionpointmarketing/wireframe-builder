import { escapeHtml } from './utils.js';
import { state } from './state.js';

export class FormBuilder {
    constructor(updateCanvasFn) {
        this.updateCanvas = updateCanvasFn;
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
        document.getElementById('closeFormBuilder').addEventListener('click', () => this.close());
        document.getElementById('cancelFormBuilder').addEventListener('click', () => this.close());
        document.getElementById('saveFormBuilder').addEventListener('click', () => this.save());
        document.getElementById('addFieldBtn').addEventListener('click', () => this.showFieldTypeSelector());

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
            if (!e.target.closest('.field-type-selector') && !e.target.closest('#addFieldBtn')) {
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
                this.updateCanvas();
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

        this.fieldsList.querySelectorAll('.field-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.field-delete')) {
                    this.selectField(item.dataset.fieldId);
                }
            });
        });

        this.fieldsList.querySelectorAll('.field-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('Delete this field?')) {
                    this.removeField(btn.dataset.fieldId);
                }
            });
        });

        this.initFieldDragDrop();
    }

    renderProperties() {
        const field = this.formFields.find(f => f.id === this.selectedFieldId);

        if (!field) {
            this.fieldProperties.innerHTML = `<div class="empty-properties"><p>Select a field to edit its properties</p></div>`;
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

        this.fieldProperties.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => this.updateFieldProperty(input));
        });

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
            case 'fieldLabel': field.label = input.value; break;
            case 'fieldPlaceholder': field.placeholder = input.value; break;
            case 'fieldRequired': field.required = input.checked; break;
            case 'fieldHelpText': field.helpText = input.value; break;
            case 'fieldMin': field.min = input.value ? parseInt(input.value) : null; break;
            case 'fieldMax': field.max = input.value ? parseInt(input.value) : null; break;
            case 'fieldRows': field.rows = parseInt(input.value) || 4; break;
        }

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

        this.fieldsList.querySelectorAll('.field-item').forEach((item) => {
            const handle = item.querySelector('.field-drag-handle');
            handle.style.cursor = 'grab';
            handle.draggable = true;

            handle.addEventListener('dragstart', (e) => {
                e.dataTransfer.effectAllowed = 'move';
                draggedElement = item;
                item.classList.add('dragging');
                e.dataTransfer.setDragImage(item, 0, 0);
            });

            handle.addEventListener('dragend', () => {
                if (draggedElement) {
                    draggedElement.classList.remove('dragging');
                    draggedElement = null;
                    const newOrder = Array.from(this.fieldsList.querySelectorAll('.field-item')).map(el =>
                        this.formFields.find(f => f.id === el.dataset.fieldId)
                    ).filter(Boolean);
                    this.formFields = newOrder;
                }
            });

            handle.addEventListener('mousedown', () => { handle.style.cursor = 'grabbing'; });
            handle.addEventListener('mouseup', () => { handle.style.cursor = 'grab'; });
            handle.addEventListener('mouseleave', () => { handle.style.cursor = 'grab'; });

            item.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                const draggingItem = this.fieldsList.querySelector('.dragging');
                if (!draggingItem || draggingItem === item) return;
                const siblings = [...this.fieldsList.querySelectorAll('.field-item:not(.dragging)')];
                const nextSibling = siblings.find(sibling => {
                    const rect = sibling.getBoundingClientRect();
                    return e.clientY < rect.top + rect.height / 2;
                });
                if (nextSibling) {
                    this.fieldsList.insertBefore(draggingItem, nextSibling);
                } else {
                    this.fieldsList.appendChild(draggingItem);
                }
            });

            item.addEventListener('dragstart', (e) => {
                if (!e.target.closest('.field-drag-handle')) e.preventDefault();
            });
        });
    }
}
