import { escapeHtml, renderIfVisible, wrapSection, renderImagePlaceholder } from '../utils.js';

export default {
    type: 'testimonial-single',
    name: 'Single Testimonial',
    category: 'social',
    variants: ['light', 'dark'],

    defaults: {
        eyebrow: 'Student Success',
        title: 'Real Stories, Real Results',
        quote: 'The personalized mentorship I received transformed my career path. I went from uncertainty to landing my dream job at a Fortune 500 company before graduation. This program truly delivers on its promises.',
        name: 'Sarah Johnson',
        role: 'Computer Science, Class of 2024'
    },

    fields: [
        { key: 'eyebrow', label: 'Eyebrow Text', exportLabel: 'Eyebrow', maxChars: 35, idealChars: 25, tips: ['Keep eyebrow text to 3-5 words', 'Use as category label or key benefit', 'Examples: "Why Choose Us", "Student Success"', 'Avoid punctuation and full sentences'] },
        { key: 'title', label: 'Heading', exportLabel: 'Headline', maxChars: 70, idealChars: 45, tips: ['Headlines work best at 6-12 words (35-70 characters)', 'Front-load with key benefit or outcome', 'Use power words that evoke emotion', 'Make it specific to your audience'] },
        { key: 'quote', label: 'Testimonial Quote', exportLabel: 'Quote', maxChars: 350, idealChars: 250, tips: ['Tell mini success story in 2-3 sentences', 'Include before/after transformation', 'Mention specific achievements', 'Keep conversational and authentic'] },
        { key: 'name', label: 'Author Name', exportLabel: 'Name', maxChars: 30, idealChars: 20, tips: ['Use full name for credibility', 'First and last name only', 'Check privacy permissions', 'Consider using real alumni'] },
        { key: 'role', label: 'Author Role', exportLabel: 'Role', maxChars: 50, idealChars: 35, tips: ['Format: "Program, Class of Year"', 'Can add current job title', 'Example: "MBA 2023, Marketing Director"', 'Keep consistent across testimonials'] }
    ],

    render(variant, content, layoutDirection, visibility) {
        const data = { ...this.defaults, ...content };
        Object.keys(data).forEach(key => {
            if (typeof data[key] === 'string') data[key] = escapeHtml(data[key]);
        });

        const inner = `
            <div class="testimonial-layout">
                <div class="testimonial-image-large">
                    ${renderImagePlaceholder('profile', data.images, 'profile-placeholder', 'Profile Image')}
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
