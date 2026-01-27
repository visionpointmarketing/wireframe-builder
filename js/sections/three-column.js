import { escapeHtml, renderIfVisible, wrapSection, renderImagePlaceholder } from '../utils.js';

export default {
    type: 'three-column',
    name: 'Three Column Features',
    category: 'content',
    variants: ['light', 'dark'],

    defaults: {
        eyebrow: 'Why Choose Us',
        title: 'Built for Your Success',
        subtitle: 'Three reasons why 97% of our graduates land jobs within 6 months.',
        columns: [
            { title: 'Industry-Expert Faculty', description: 'Learn from professionals actively working in your field.' },
            { title: 'Career Placement Team', description: 'Dedicated advisors connect you with top employers.' },
            { title: 'Flexible Schedules', description: 'Online, evening, and weekend options for working adults.' }
        ],
        ctaText: 'Learn More'
    },

    fields: [
        { key: 'eyebrow', label: 'Eyebrow Text', exportLabel: 'Eyebrow', maxChars: 35, idealChars: 25, tips: ['Keep eyebrow text to 3-5 words', 'Use as category label or key benefit', 'Examples: "Why Choose Us", "Student Success"', 'Avoid punctuation and full sentences'] },
        { key: 'title', label: 'Heading', exportLabel: 'Headline', maxChars: 70, idealChars: 45, tips: ['Headlines work best at 6-12 words (35-70 characters)', 'Front-load with key benefit or outcome', 'Use power words that evoke emotion', 'Make it specific to your audience'] },
        { key: 'subtitle', label: 'Subtitle', exportLabel: 'Subtitle', maxChars: 160, idealChars: 120, tips: ['Expand on the headline promise', 'Keep to 20-25 words for best readability', 'Include specific value proposition', 'Break into two sentences if needed'] },
        { key: 'ctaText', label: 'CTA Button', exportLabel: 'CTA Text', maxChars: 25, idealChars: 15, tips: ['Best CTAs are 2-3 words', 'Start with action verb', 'Examples: "Get Started", "Learn More", "Apply Now"', 'Match CTA to user intent'] }
    ],

    render(variant, content, layoutDirection, visibility) {
        const data = { ...this.defaults, ...content };
        if (typeof data.eyebrow === 'string') data.eyebrow = escapeHtml(data.eyebrow);
        if (typeof data.title === 'string') data.title = escapeHtml(data.title);
        if (typeof data.subtitle === 'string') data.subtitle = escapeHtml(data.subtitle);
        if (typeof data.ctaText === 'string') data.ctaText = escapeHtml(data.ctaText);
        data.columns = data.columns.map(col => ({
            title: escapeHtml(col.title || ''),
            description: escapeHtml(col.description || '')
        }));

        const inner = `
            <div class="section-header">
                ${renderIfVisible('eyebrow', `<div class="eyebrow editable" contenteditable="true" data-field="eyebrow">${data.eyebrow}</div>`, visibility)}
                ${renderIfVisible('title', `<h2 class="section-title editable" contenteditable="true" data-field="title">${data.title}</h2>`, visibility)}
                ${renderIfVisible('subtitle', `<p class="section-subtitle editable" contenteditable="true" data-field="subtitle">${data.subtitle}</p>`, visibility)}
            </div>
            <div class="three-column-grid">
                ${data.columns.map((col, i) => `
                    <div class="column-item" data-column-index="${i}">
                        ${renderImagePlaceholder('column' + i, data.images, 'column-image', 'Image Placeholder')}
                        <h3 class="column-title editable" contenteditable="true" data-field="column-title-${i}">${col.title}</h3>
                        <p class="column-description editable" contenteditable="true" data-field="column-description-${i}">${col.description}</p>
                    </div>
                `).join('')}
            </div>
            ${renderIfVisible('ctaText', `<div style="text-align: center;">
                <a href="#" class="cta-button editable" contenteditable="true" data-field="ctaText">${data.ctaText}</a>
            </div>`, visibility)}
        `;

        return wrapSection(this.type, variant, inner);
    },

    toDocFormat(section) {
        const content = section.content || {};
        const visibility = section.visibility || {};
        const result = this.fields
            .filter(f => visibility[f.key] !== false && (content[f.key] || this.defaults[f.key]))
            .map(f => ({ label: f.exportLabel, value: content[f.key] || this.defaults[f.key] }));

        // Add columns
        const columns = content.columns || this.defaults.columns;
        columns.forEach((col, i) => {
            result.splice(result.length - (content.ctaText || this.defaults.ctaText ? 1 : 0), 0, {
                label: `Column ${i + 1}`,
                value: `Headline: ${col.title}\nSubhead: ${col.description}`
            });
        });

        return result;
    }
};
