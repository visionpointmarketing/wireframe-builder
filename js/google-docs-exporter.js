import { state } from './state.js';
import sectionTemplates from './sections/index.js';

// Replace YOUR_SCRIPT_ID with the actual deployed Apps Script ID
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/a/macros/visionpointmarketing.com/s/AKfycbxfYTH9X-jQkI0Pq8p75U7g6avUSDZz9EOUovQm69xH0JRDD2Uc8zx9sAH7JH7UzIRl/exec';

export class GoogleDocsExporter {
    constructor(config = {}) {
        this.SCRIPT_URL = config.googleAppsScriptUrl || GOOGLE_APPS_SCRIPT_URL;
        this.docTitlePrefix = config.docTitlePrefix || 'Landing Page Wireframe';
    }

    async exportToGoogleDocs(saveContentFn) {
        try {
            saveContentFn();
            const docData = this.convertWireframeToDocFormat(state.sections);

            const encodedData = btoa(encodeURIComponent(JSON.stringify(docData)));
            const url = `${this.SCRIPT_URL}?data=${encodedData}`;
            const newWindow = window.open(url, '_blank');

            if (!newWindow) {
                throw new Error('Popup blocked. Please allow popups for this site.');
            }

            alert('Creating Google Doc... The document will open in a new tab.');
        } catch (error) {
            console.error('Export error:', error);
            alert('Error exporting to Google Docs: ' + error.message);
        }
    }

    convertWireframeToDocFormat(sections) {
        return {
            title: `${this.docTitlePrefix} - ${new Date().toLocaleDateString()}`,
            content: sections.map(section => this.formatSectionContent(section))
        };
    }

    formatSectionContent(section) {
        const template = sectionTemplates[section.type];
        if (template && template.toDocFormat) {
            const content = template.toDocFormat(section);
            // Note any uploaded images
            const images = section.content && section.content.images;
            if (images && Object.keys(images).length > 0) {
                content.push({ label: 'Images', value: `[${Object.keys(images).length} user-uploaded image(s)]` });
            }
            return {
                type: template.name,
                variant: section.variant,
                content
            };
        }

        // Fallback for unknown types
        return {
            type: 'Unknown Section',
            variant: section.variant,
            content: [{ label: 'Data', value: JSON.stringify(section.content) }]
        };
    }
}
