import { escapeHtml, renderIfVisible, wrapSection } from '../utils.js';

export default {
    type: 'content-cta',
    name: 'Content + CTA',
    category: 'content',
    variants: ['light', 'dark'],

    defaults: {
        eyebrow: 'Why Choose Us',
        title: 'Your Future Starts Here',
        body: 'Join 10,000+ graduates now thriving in their careers. Experience personalized mentorship, industry connections, and a 97% job placement rate.',
        ctaText: 'Get Started'
    },

    fields: [
        { key: 'eyebrow', label: 'Eyebrow Text', exportLabel: 'Eyebrow', maxChars: 35, idealChars: 25, tips: ['Keep eyebrow text to 3-5 words', 'Use as category label or key benefit', 'Examples: "Why Choose Us", "Student Success"', 'Avoid punctuation and full sentences'] },
        { key: 'title', label: 'Heading', exportLabel: 'Headline', maxChars: 70, idealChars: 45, tips: ['Headlines work best at 6-12 words (35-70 characters)', 'Front-load with key benefit or outcome', 'Use power words that evoke emotion', 'Make it specific to your audience'] },
        { key: 'body', label: 'Body Content', exportLabel: 'Body', maxChars: 600, idealChars: 400, tips: ['Limit to 50-75 words for best readability', 'Lead with most compelling benefit', 'Use simple, conversational language', 'Each sentence should add new value'] },
        { key: 'ctaText', label: 'CTA Button', exportLabel: 'CTA Text', maxChars: 25, idealChars: 15, tips: ['Best CTAs are 2-3 words', 'Start with action verb', 'Examples: "Get Started", "Learn More", "Apply Now"', 'Match CTA to user intent'] }
    ],

    render(variant, content, layoutDirection, visibility) {
        const data = { ...this.defaults, ...content };
        Object.keys(data).forEach(key => {
            if (typeof data[key] === 'string') data[key] = escapeHtml(data[key]);
        });

        const inner = `
            <div class="section-header">
                ${renderIfVisible('eyebrow', `<div class="eyebrow editable" contenteditable="true" data-field="eyebrow">${data.eyebrow}</div>`, visibility)}
                ${renderIfVisible('title', `<h2 class="section-title editable" contenteditable="true" data-field="title">${data.title}</h2>`, visibility)}
            </div>
            ${renderIfVisible('body', `<div class="body-content editable" contenteditable="true" data-field="body">${data.body}</div>`, visibility)}
            ${renderIfVisible('ctaText', `<a href="#" class="cta-button editable" contenteditable="true" data-field="ctaText">${data.ctaText}</a>`, visibility)}
        `;

        return wrapSection(this.type, variant, inner);
    },

    toDocFormat(section) {
        const content = section.content || {};
        const visibility = section.visibility || {};
        return this.fields
            .filter(f => visibility[f.key] !== false && (content[f.key] || this.defaults[f.key]))
            .map(f => ({ label: f.exportLabel, value: content[f.key] || this.defaults[f.key] }));
    }
};
