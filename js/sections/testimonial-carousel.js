import { escapeHtml, renderIfVisible, wrapSection } from '../utils.js';

export default {
    type: 'testimonial-carousel',
    name: 'Testimonial Carousel',
    category: 'social',
    variants: ['light', 'dark'],

    defaults: {
        eyebrow: 'Student Stories',
        title: 'Hear from Our Graduates',
        testimonials: [
            { quote: 'The hands-on projects and industry mentors helped me land a job at Google before graduation.', name: 'Michael Chen', role: 'MBA 2023, Product Manager' },
            { quote: 'Balancing work and school was seamless with evening classes. I doubled my salary in 18 months.', name: 'Emily Rodriguez', role: 'Healthcare Management 2024' },
            { quote: 'Career services helped me pivot from retail to data science. Now I work at a Fortune 500.', name: 'James Williams', role: 'Data Science Certificate 2023' }
        ],
        currentIndex: 0
    },

    fields: [
        { key: 'eyebrow', label: 'Eyebrow Text', exportLabel: 'Eyebrow', maxChars: 35, idealChars: 25, tips: ['Keep eyebrow text to 3-5 words', 'Use as category label or key benefit', 'Examples: "Why Choose Us", "Student Success"', 'Avoid punctuation and full sentences'] },
        { key: 'title', label: 'Heading', exportLabel: 'Headline', maxChars: 70, idealChars: 45, tips: ['Headlines work best at 6-12 words (35-70 characters)', 'Front-load with key benefit or outcome', 'Use power words that evoke emotion', 'Make it specific to your audience'] }
    ],

    render(variant, content, layoutDirection, visibility) {
        const data = { ...this.defaults, ...content };
        if (typeof data.eyebrow === 'string') data.eyebrow = escapeHtml(data.eyebrow);
        if (typeof data.title === 'string') data.title = escapeHtml(data.title);

        const firstTestimonial = data.testimonials[0] || this.defaults.testimonials[0];
        const sanitizedTestimonial = {
            quote: escapeHtml(firstTestimonial.quote || ''),
            name: escapeHtml(firstTestimonial.name || ''),
            role: escapeHtml(firstTestimonial.role || '')
        };

        const inner = `
            <div class="section-header">
                ${renderIfVisible('eyebrow', `<div class="eyebrow editable" contenteditable="true" data-field="eyebrow">${data.eyebrow}</div>`, visibility)}
                ${renderIfVisible('title', `<h2 class="section-title editable" contenteditable="true" data-field="title">${data.title}</h2>`, visibility)}
            </div>
            <div class="testimonial-carousel-container">
                <div class="testimonial-slide active">
                    <div class="testimonial-profile">
                        <div class="profile-circle">Profile</div>
                    </div>
                    <blockquote class="testimonial-quote editable" contenteditable="true" data-field="testimonial-quote-0">"${sanitizedTestimonial.quote}"</blockquote>
                    <div class="testimonial-info">
                        <div class="testimonial-name editable" contenteditable="true" data-field="testimonial-name-0">${sanitizedTestimonial.name}</div>
                        <div class="testimonial-role editable" contenteditable="true" data-field="testimonial-role-0">${sanitizedTestimonial.role}</div>
                    </div>
                </div>
                <div class="carousel-dots">
                    <span class="dot active"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                </div>
            </div>
        `;

        return wrapSection(this.type, variant, inner);
    },

    toDocFormat(section) {
        const content = section.content || {};
        const visibility = section.visibility || {};
        const result = this.fields
            .filter(f => visibility[f.key] !== false && (content[f.key] || this.defaults[f.key]))
            .map(f => ({ label: f.exportLabel, value: content[f.key] || this.defaults[f.key] }));

        result.push({ label: 'Testimonial Quote', value: content['testimonial-quote-0'] || '' });
        result.push({ label: 'Testimonial Name', value: content['testimonial-name-0'] || '' });
        result.push({ label: 'Testimonial Role', value: content['testimonial-role-0'] || '' });

        return result;
    }
};
