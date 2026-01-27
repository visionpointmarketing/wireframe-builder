import { escapeHtml, renderIfVisible, wrapSection, renderImagePlaceholder } from '../utils.js';

export default {
    type: 'program-cards',
    name: 'Program Cards',
    category: 'data',
    variants: ['light', 'dark'],

    defaults: {
        eyebrow: 'Popular Programs',
        title: 'Find Your Path to Success',
        subtitle: 'Explore our most in-demand programs designed to launch your career.',
        programs: [
            { title: 'Business Administration MBA', description: 'Launch into C-suite roles with our AACSB-accredited program.' },
            { title: 'Computer Science B.S.', description: 'Join the tech revolution with guaranteed internships at top firms.' },
            { title: 'Healthcare Management', description: 'Lead the future of healthcare in our fastest-growing field.' }
        ],
        ctaText: 'Explore All Programs'
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
        data.programs = data.programs.map(program => ({
            title: escapeHtml(program.title || ''),
            description: escapeHtml(program.description || '')
        }));

        const inner = `
            <div class="section-header">
                ${renderIfVisible('eyebrow', `<div class="eyebrow editable" contenteditable="true" data-field="eyebrow">${data.eyebrow}</div>`, visibility)}
                ${renderIfVisible('title', `<h2 class="section-title editable" contenteditable="true" data-field="title">${data.title}</h2>`, visibility)}
                ${renderIfVisible('subtitle', `<p class="section-subtitle editable" contenteditable="true" data-field="subtitle">${data.subtitle}</p>`, visibility)}
            </div>
            <div class="program-grid">
                ${data.programs.map((program, i) => `
                    <div class="program-card" data-program-index="${i}">
                        ${renderImagePlaceholder('program' + i, data.images, 'program-image', 'Image Placeholder')}
                        <div class="program-content">
                            <h3 class="program-title editable" contenteditable="true" data-field="program-title-${i}">${program.title}</h3>
                            <p class="program-description editable" contenteditable="true" data-field="program-description-${i}">${program.description}</p>
                        </div>
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

        const programs = content.programs || this.defaults.programs;
        programs.forEach((prog, i) => {
            result.splice(result.length - (content.ctaText || this.defaults.ctaText ? 1 : 0), 0, {
                label: `Program ${i + 1}`,
                value: `Headline: ${prog.title}\nSubhead: ${prog.description}`
            });
        });

        return result;
    }
};
