import { escapeHtml, renderIfVisible, wrapSection } from '../utils.js';

export default {
    type: 'statistics',
    name: 'Statistics/Numbers',
    category: 'data',
    variants: ['light', 'dark'],

    defaults: {
        eyebrow: 'Our Impact',
        title: 'Success by the Numbers',
        subtitle: 'Data-driven results that showcase our commitment to student achievement.',
        stats: [
            { number: '97%', label: 'Job Placement' },
            { number: '4.8/5', label: 'Student Rating' },
            { number: '45K+', label: 'Alumni Network' }
        ],
        ctaText: 'View Stats'
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
        data.stats = data.stats.map(stat => ({
            number: escapeHtml(stat.number || ''),
            label: escapeHtml(stat.label || '')
        }));

        const inner = `
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
        `;

        return wrapSection(this.type, variant, inner);
    },

    toDocFormat(section) {
        const content = section.content || {};
        const visibility = section.visibility || {};
        const result = this.fields
            .filter(f => visibility[f.key] !== false && (content[f.key] || this.defaults[f.key]))
            .map(f => ({ label: f.exportLabel, value: content[f.key] || this.defaults[f.key] }));

        const stats = content.stats || this.defaults.stats;
        stats.forEach((stat, i) => {
            result.splice(result.length - (content.ctaText || this.defaults.ctaText ? 1 : 0), 0, {
                label: `Stat ${i + 1}`,
                value: `${stat.number} - ${stat.label}`
            });
        });

        return result;
    }
};
