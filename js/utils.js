import { getImage } from './image-store.js';

// HTML Sanitization utility
export const sanitizeHTML = (str) => {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
};

// Escape HTML for safe display
export const escapeHtml = (unsafe) => {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

// Unescape HTML entities for export
export const unescapeHtml = (safe) => {
    const temp = document.createElement('div');
    temp.innerHTML = safe;
    return temp.textContent || temp.innerText || '';
};

// Helper function to conditionally render elements based on visibility
export function renderIfVisible(field, html, visibility) {
    if (!visibility || visibility[field] !== false) {
        return html;
    }
    return '';
}

// Camera SVG icon for image upload overlay
const CAMERA_SVG = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
    <circle cx="12" cy="13" r="4"/>
</svg>`;

// Render an image placeholder that supports uploaded images
export function renderImagePlaceholder(imageSlot, images, cssClass, placeholderText) {
    const imageKey = images && images[imageSlot];
    const imageData = imageKey ? getImage(imageKey) : null;

    const content = imageData
        ? `<img class="uploaded-image" src="${imageData}" alt="${placeholderText}">`
        : placeholderText;

    return `<div class="${cssClass} image-placeholder-wrapper" data-image-slot="${imageSlot}">
        ${content}
        <div class="image-upload-overlay">${CAMERA_SVG}</div>
    </div>`;
}

// WCAG 2.1 contrast ratio utilities
function luminance(hex) {
    const rgb = [hex.slice(1,3), hex.slice(3,5), hex.slice(5,7)]
        .map(h => parseInt(h, 16) / 255)
        .map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

export function getContrastRatio(hex1, hex2) {
    const l1 = luminance(hex1);
    const l2 = luminance(hex2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

export function filterAccessibleColors(colors, textColor, minRatio = 4.5) {
    return colors.filter(c => getContrastRatio(c, textColor) >= minRatio);
}

// Wrap a section's inner content with the standard drag-handle + section-controls boilerplate
export function wrapSection(type, variant, innerHtml, extraControls = '') {
    return `
        <div class="section ${type} ${variant}" data-section-type="${type}">
            <div class="section-container">
                ${innerHtml}
            </div>
            <div class="drag-handle" draggable="true" aria-label="Drag to reorder section">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path d="M9 3h6M9 7h6M9 11h6M9 15h6M9 19h6" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </div>
            <div class="section-controls">
                <button class="control-btn duplicate-btn" aria-label="Duplicate section">Duplicate</button>
                <button class="control-btn variant-btn" aria-label="Toggle theme variant">Toggle Theme</button>
                ${extraControls}
                <button class="control-btn customize-btn" aria-label="Customize elements">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                    </svg>
                    Customize
                </button>
                <button class="control-btn delete delete-btn" aria-label="Delete section">Delete</button>
            </div>
        </div>
    `;
}
