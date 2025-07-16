# Landing Page Wireframe Builder

A secure, accessible visual wireframe builder designed to bridge the gap between content writers and developers, specifically for higher education landing pages. This tool helps writers understand how their content fits within responsive layouts before development begins.

![Wireframe Builder](https://img.shields.io/badge/version-1.1.2-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Security](https://img.shields.io/badge/security-hardened-green.svg)

## 🎯 Purpose

Content writers often struggle to visualize how their copy will appear in responsive layouts, leading to content that's too lengthy or doesn't account for mobile constraints. This browser-based tool provides:

- Visual layout building with pre-approved sections
- Live content editing within the design context
- Responsive preview across devices
- Real-time writing guidance and best practices
- Professional export capabilities

## ✨ Features

### Section Library
- **7 Pre-built Section Types**:
  - Content + CTA
  - Three-Column Features
  - Statistics/Numbers
  - Program Cards
  - Lead Generation Form
  - Single Testimonial
  - Testimonial Carousel

### Content Editing
- **Inline Editing**: Click any text to edit directly in the preview
- **Real-time Updates**: See changes instantly as you type
- **Character Counters**: Visual indicators for optimal content length
- **Writing Tips**: Context-specific guidance for each element type

### Responsive Design
- **Device Preview**: Toggle between desktop, tablet, and mobile views
- **Adaptive Layouts**: Sections automatically adjust for each screen size
- **Mobile Alerts**: Warnings when content may be too long for small screens

### Advanced Features
- **Drag & Drop**: Reorder sections by dragging the handle (with ARIA labels)
- **Dark/Light Themes**: Toggle between color variants
- **Duplicate Sections**: Quick copy functionality
- **Undo/Redo**: Full history support with keyboard shortcuts (Ctrl/Cmd+Z)
- **Sidebar Toggle**: Hide the section library for distraction-free preview
- **Full-Width Preview**: Sections display edge-to-edge like real landing pages
- **Export Options**: 
  - High-quality PNG images
  - JSON data for version control
- **Security Features**:
  - XSS protection with HTML sanitization
  - Secure CDN loading with SRI verification
  - Input validation for all user content
  - Safe paste handling to prevent HTML injection

## 🚀 Getting Started

### Quick Start
1. Clone the repository:
   ```bash
   git clone https://github.com/breonwilliams/wireframe-builder.git
   cd wireframe-builder
   ```

2. Open `index.html` in a modern web browser

3. Start building:
   - Click sections from the sidebar to add them
   - Click any text to edit inline
   - Use the viewport buttons to preview responsive layouts
   - Export your wireframe as an image or JSON

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server or database required
- Works entirely in the browser

## 📖 Usage Guide

### Building a Wireframe
1. **Add Sections**: Click any section type in the sidebar to add it to your canvas
2. **Edit Content**: Click on any text element to edit it directly
3. **Reorder Sections**: Drag the handle (≡) on the left of each section
4. **Toggle Themes**: Use the "Toggle Theme" button for dark/light variants
5. **Preview Responsive**: Use the device buttons to see mobile/tablet views

### Writing Guidelines
The tool provides real-time guidance for optimal content length:

- **Headlines**: 6-12 words (45 characters ideal, 70 max)
- **Body Text**: 50-75 words (400 characters ideal, 600 max) - includes word count display
- **CTAs**: 2-5 words (15 characters ideal, 25 max)
- **Form Labels**: Standard labels (15 characters ideal)
- **Testimonials**: 20-30 words for short, 2-3 sentences for featured

### Exporting Your Work
- **Export as Image**: Creates a high-quality PNG for presentations
- **Export to Google Docs**: Creates a formatted Google Doc with all your content
- **Export JSON**: Saves all content and layout data
- **Import JSON**: Reload previous work to continue editing

#### Setting up Google Docs Export (One-time setup for developers)
1. Go to [script.google.com](https://script.google.com)
2. Create a new project
3. Copy the Google Apps Script code from the comments in `script.js` (lines 944-1001)
4. Deploy as Web App:
   - Execute as: Me
   - Who has access: Anyone
5. Copy the deployment URL's script ID
6. Replace `YOUR_SCRIPT_ID` in `script.js` line 942 with your actual script ID
7. The export button will now work for all users without any configuration needed

### Keyboard Shortcuts
- `Ctrl/Cmd + Z`: Undo
- `Ctrl/Cmd + Y` or `Ctrl/Cmd + Shift + Z`: Redo

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Semantic markup with ARIA labels for accessibility
- **CSS3**: Modern layouts with CSS Grid and Flexbox
- **JavaScript**: Vanilla JS with security-first approach
- **html2canvas**: For high-quality image exports (loaded with SRI hash)

### Security & Accessibility
- **XSS Protection**: All user inputs are sanitized
- **Content Security**: HTML injection prevention
- **ARIA Support**: Full keyboard navigation and screen reader compatibility
- **Performance**: Debounced updates and optimized memory management

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### File Structure
```
wireframe-builder/
├── index.html          # Main application file with SRI-protected dependencies
├── styles.css          # All styling with accessibility considerations
├── script.js           # Secure application logic with XSS protection
├── README.md           # Documentation
└── favicon.svg         # Site favicon
```

## 🎨 Design System

### Colors
- **Primary Red**: #E53E3E
- **Dark Navy**: #1A365D
- **Light Gray**: #F7FAFC
- **Text Dark**: #1A202C
- **Text Gray**: #718096

### Typography
- System font stack for optimal performance
- Responsive type scaling
- Clear hierarchy for scannability

## 🤝 Contributing

This tool was built specifically for Vision Point Marketing's content team. For feature requests or bug reports, please create an issue in the GitHub repository.

### Security Reporting

If you discover a security vulnerability, please email the maintainers directly rather than creating a public issue.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built for Vision Point Marketing's content team
- Designed to streamline higher education landing page creation
- Focuses on writer-developer collaboration
- Security hardening and accessibility improvements in v1.1.0

## 📋 Changelog

### Version 1.1.2 (2025-07-09)
- 🎨 Removed padding from canvas for full-width section preview
- 📐 Removed border radius from first/last sections for authentic landing page look
- 👁️ Added sidebar toggle to preview layouts without distractions
- 🖼️ Improved visual accuracy for landing page creation

### Version 1.1.1 (2025-07-09)
- 📝 Updated character limits to align with landing page best practices
- 📊 Added word count display for body content sections
- 🎯 Improved content guidelines for better conversion optimization
- ✏️ Adjusted ideal character counts for headlines, CTAs, and testimonials

### Version 1.1.0 (2025-07-09)
- 🔒 Added XSS protection and HTML sanitization
- 🔒 Implemented SRI hash for external dependencies
- ♿ Added comprehensive ARIA labels and keyboard navigation
- ⚡ Performance improvements with debounced updates
- 🐛 Fixed memory leaks in history management
- 🔧 Refactored code to eliminate global scope pollution
- ✅ Added input validation for JSON imports
- 🛡️ Enhanced paste handling to prevent HTML injection

### Version 1.0.0
- Initial release

---

**Author:** Breon Williams  
**Website:** [https://breonwilliams.com](https://breonwilliams.com)