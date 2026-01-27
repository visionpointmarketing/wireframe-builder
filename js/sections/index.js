import contentCta from './content-cta.js';
import imageContent from './image-content.js';
import threeColumn from './three-column.js';
import statistics from './statistics.js';
import programCards from './program-cards.js';
import leadForm from './lead-form.js';
import testimonialSingle from './testimonial-single.js';
import testimonialCarousel from './testimonial-carousel.js';

// Registry: keyed by section type
const sectionTemplates = {
    [contentCta.type]: contentCta,
    [imageContent.type]: imageContent,
    [threeColumn.type]: threeColumn,
    [statistics.type]: statistics,
    [programCards.type]: programCards,
    [leadForm.type]: leadForm,
    [testimonialSingle.type]: testimonialSingle,
    [testimonialCarousel.type]: testimonialCarousel
};

// All templates as an array (for iteration)
export const allSections = [
    contentCta, imageContent, threeColumn, statistics,
    programCards, leadForm, testimonialSingle, testimonialCarousel
];

// Category definitions for sidebar rendering (Phase 5)
export const categories = [
    {
        id: 'content',
        label: 'Content',
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M10 12h4M10 16h4"/></svg>`
    },
    {
        id: 'data',
        label: 'Data Display',
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 13h8l2 6 2-12 2 6h4"/></svg>`
    },
    {
        id: 'forms',
        label: 'Forms & Input',
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6"/></svg>`
    },
    {
        id: 'social',
        label: 'Social Proof',
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/></svg>`
    }
];

export default sectionTemplates;
