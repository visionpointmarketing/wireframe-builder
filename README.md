# Landing Page Wireframe Builder

A visual wireframe builder designed to bridge the gap between content writers and developers, specifically for higher education landing pages. This tool helps writers understand how their content fits within responsive layouts before development begins.

![Wireframe Builder](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

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
- **Drag & Drop**: Reorder sections by dragging the handle
- **Dark/Light Themes**: Toggle between color variants
- **Duplicate Sections**: Quick copy functionality
- **Undo/Redo**: Full history support with keyboard shortcuts (Ctrl/Cmd+Z)
- **Export Options**: 
  - High-quality PNG images
  - JSON data for version control

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

- **Headlines**: 6-10 words (50 characters ideal)
- **Body Text**: 2-3 sentences (150 characters ideal)  
- **CTAs**: 2-3 words (12 characters ideal)
- **Form Labels**: Standard labels (15 characters ideal)

### Exporting Your Work
- **Export as Image**: Creates a high-quality PNG for presentations
- **Export JSON**: Saves all content and layout data
- **Import JSON**: Reload previous work to continue editing

### Keyboard Shortcuts
- `Ctrl/Cmd + Z`: Undo
- `Ctrl/Cmd + Y` or `Ctrl/Cmd + Shift + Z`: Redo

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Modern layouts with CSS Grid and Flexbox
- **JavaScript**: Vanilla JS for maximum performance
- **html2canvas**: For high-quality image exports

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### File Structure
```
wireframe-builder/
├── index.html          # Main application file
├── styles.css          # All styling
├── script.js           # Application logic
├── README.md           # Documentation
└── favicon.ico         # Site favicon
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

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built for Vision Point Marketing's content team
- Designed to streamline higher education landing page creation
- Focuses on writer-developer collaboration

---

**Built with ❤️ for content creators who care about responsive design**