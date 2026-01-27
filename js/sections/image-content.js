import { escapeHtml, renderIfVisible, wrapSection } from '../utils.js';

const LAYOUT_BTN = '<button class="control-btn layout-btn" aria-label="Toggle layout direction">Toggle Layout</button>';

export default {
    type: 'image-content',
    name: 'Image + Content',
    category: 'content',
    variants: ['light', 'dark'],
    hasLayout: true,

    defaults: {
        eyebrow: 'Campus Life',
        title: 'Visit Our Campus',
        body: 'Located in the heart of the city, our campus blends modern facilities with a close-knit community feel.\n\n• Central location with public transit access\n• On-campus housing available\n• Dedicated student success center',
        ctaText: 'Explore Programs'
    },

    fields: [
        { key: 'eyebrow', label: 'Eyebrow Text', exportLabel: 'Eyebrow', maxChars: 35, idealChars: 25, tips: ['Keep eyebrow text to 3-5 words', 'Use as category label or key benefit', 'Examples: "Campus Life", "Our Location", "Student Experience"', 'Avoid punctuation and full sentences'] },
        { key: 'title', label: 'Heading', exportLabel: 'Headline', maxChars: 70, idealChars: 45, tips: ['Headlines work best at 6-12 words (35-70 characters)', 'Front-load with key benefit or outcome', 'Use power words that evoke emotion', 'Make it specific to your audience'] },
        { key: 'body', label: 'Body Content', exportLabel: 'Body', maxChars: 600, idealChars: 400, tips: ['Limit to 50-75 words for best readability', 'Lead with most compelling benefit', 'Use simple, conversational language', 'Can include bullet points using • symbol', 'Each sentence should add new value'] },
        { key: 'ctaText', label: 'CTA Button', exportLabel: 'CTA Text', maxChars: 25, idealChars: 15, tips: ['Best CTAs are 2-3 words', 'Start with action verb', 'Examples: "Learn More", "Explore Campus", "Schedule Visit"', 'Match CTA to user intent'] }
    ],

    render(variant, content, layoutDirection, visibility) {
        const data = { ...this.defaults, ...content };
        Object.keys(data).forEach(key => {
            if (typeof data[key] === 'string') data[key] = escapeHtml(data[key]);
        });

        const formattedBody = data.body.replace(/\n/g, '<br>');

        const inner = `
            <div class="image-content-grid ${layoutDirection === 'reversed' ? 'reversed' : ''}">
                <div class="image-column">
                    <div class="content-image">Image Placeholder</div>
                </div>
                <div class="content-column">
                    ${renderIfVisible('eyebrow', `<div class="eyebrow editable" contenteditable="true" data-field="eyebrow">${data.eyebrow}</div>`, visibility)}
                    ${renderIfVisible('title', `<h2 class="section-title editable" contenteditable="true" data-field="title">${data.title}</h2>`, visibility)}
                    ${renderIfVisible('body', `<div class="body-content editable" contenteditable="true" data-field="body">${formattedBody}</div>`, visibility)}
                    ${renderIfVisible('ctaText', `<a href="#" class="cta-button editable" contenteditable="true" data-field="ctaText">${data.ctaText}</a>`, visibility)}
                </div>
            </div>
        `;

        return wrapSection(this.type, variant, inner, LAYOUT_BTN);
    },

    toDocFormat(section) {
        const content = section.content || {};
        const visibility = section.visibility || {};
        return this.fields
            .filter(f => visibility[f.key] !== false && (content[f.key] || this.defaults[f.key]))
            .map(f => ({ label: f.exportLabel, value: content[f.key] || this.defaults[f.key] }));
    }
};
