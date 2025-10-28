# Email Template Builder Documentation

## Overview
The Email Template Builder is a visual design tool that allows writers to create and preview email layouts with real-time feedback on content length and best practices. It extends the functionality of the existing landing page builder while focusing specifically on email design constraints and guidelines.

## Core Purpose
- Provide writers with a visual way to design email layouts
- Offer real-time feedback on content length and best practices
- Enable simple export options (JSON and Google Docs)
- Maintain brand consistency with VisionPoint Marketing's design system
- Leverage existing wireframe builder architecture with email-specific adaptations

## Section Architecture

The Email Template Builder follows the same complex variant system as the wireframe builder, with **6 main section types** each containing multiple variants and controls.

### 1. Hero Section
**Variants**: `['single-column', 'split', 'text-only']`
**Layout Direction**: Split variant supports left/right toggle
**Theme Variants**: Light/Dark for all variants
**Visibility Controls**: Eyebrow, headline, subhead, CTA button

#### Single Column Hero
- Headline (40-50 characters)
- Subhead (80-100 characters)
- Optional eyebrow text
- Primary CTA button
- Centered layout, email-safe typography

#### Split Hero
- Text and image in balanced layout
- **Layout Direction Toggle**: Text left/image right ↔ Image left/text right
- Mobile-optimized stacking
- Email client compatibility

#### Text-Only Hero
- Optimized for preview text cutoff
- High-impact typography
- Centered layout
- Minimal design for maximum compatibility

### 2. Content Section
**Variants**: `['single-column', 'two-column', 'bulleted-list', 'standalone-image']`
**Layout Direction**: Two-column variant supports left/right toggle
**Theme Variants**: Light/Dark for all variants
**Visibility Controls**: Headlines, body text, CTA buttons

#### Single Column Content
- 250-300 characters optimal length
- Clear hierarchy
- Optional CTA button
- Email-safe formatting

#### Two Column Content
- 150-200 characters per column
- **Layout Direction Toggle**: Content arrangement options
- Mobile-responsive stacking
- Balanced layout

#### Bulleted List
- 3-5 items recommended
- 30-40 characters per item
- Clear formatting
- Email client bullet compatibility

#### Standalone Image
- Full-width or centered image
- Optional alt text for accessibility
- Responsive sizing for mobile
- Link destination optional

### 3. Product Section
**Variants**: `['single-feature', 'product-grid', 'feature-list']`
**Layout Direction**: Single-feature variant supports left/right toggle
**Theme Variants**: Light/Dark for all variants
**Visibility Controls**: Images, titles, descriptions, prices, CTAs

#### Single Product Feature
- Image + 150 character description
- Product name and price
- **Layout Direction Toggle**: Image left/right positioning
- Clear CTA button

#### Product Grid
- Two-column responsive layout
- 100 characters per product
- Consistent card design
- Mobile stacking

#### Feature List
- Icon + 50 characters per feature
- Three feature maximum
- Clear visual hierarchy
- Email-safe icons

### 4. Social Proof Section
**Variants**: `['testimonial', 'metrics', 'logo-bar']`
**Layout Direction**: Testimonial variant supports left/right toggle
**Theme Variants**: Light/Dark for all variants
**Visibility Controls**: Photos, quotes, names, roles, metrics

#### Testimonial
- 100-150 character quote
- Attribution with name/role
- **Layout Direction Toggle**: Photo left/right positioning
- Optional photo

#### Metrics Block
- Maximum 3 statistics
- 15-20 characters per label
- Responsive grid layout
- Visual impact design

#### Logo Bar
- Responsive grid
- Mobile-optimized spacing
- Optional heading
- Partner/client showcase

### 5. CTA Section
**Variants**: `['primary', 'secondary', 'button-group']`
**Layout Direction**: None (CTAs are centered for email compatibility)
**Theme Variants**: Light/Dark for all variants
**Visibility Controls**: Headlines, supporting text, buttons

#### Primary CTA
- High contrast design
- 2-5 word button text
- Clear action focus
- Email client safe styling

#### Secondary CTA
- Inline text + button
- 2-3 word button text
- Subtle styling
- Supporting text option

#### Button Group
- Mixed primary/secondary styles
- Mobile-optimized stacking
- Consistent spacing
- Maximum 2-3 buttons

### 6. Footer Section
**Variants**: `['standard', 'extended', 'minimal']`
**Layout Direction**: Extended variant supports column arrangements
**Theme Variants**: Light/Dark for all variants
**Visibility Controls**: Social links, contact info, legal text, unsubscribe

#### Standard Footer
- Social media links
- Contact information
- Required unsubscribe link
- Compliance with email regulations

#### Extended Footer
- Multi-column link layout
- **Layout Direction Toggle**: Column arrangement options
- Social media icons
- Collapsible on mobile

#### Minimal Footer
- Copyright text
- Required legal links
- Single-line design
- Essential compliance only

## Wireframe Builder Logic Inheritance

The Email Template Builder leverages the proven architecture of the existing wireframe builder with email-specific adaptations:

### Core Systems Inherited
- ✅ **Template Rendering System**: `sectionTemplates` object with variant rendering
- ✅ **State Management**: Section data, history, undo/redo functionality
- ✅ **Variant System**: `variants: ['light', 'dark']` theme support
- ✅ **Layout Direction**: `layoutDirection: 'normal'/'reversed'` toggle system
- ✅ **Visibility Controls**: `visibility: {}` object for show/hide elements
- ✅ **Drag & Drop**: Section reordering with accessibility support
- ✅ **Export System**: JSON and Google Docs export (with email adaptations)
- ✅ **Character Counting**: Real-time feedback and limits
- ✅ **Content Management**: Duplicate, delete, customize controls

### Email-Specific Adaptations

#### Viewport Constraints
- **Maximum Width**: 600px (email-safe standard)
- **Viewport Options**: 
  - Desktop: 600px (email client desktop)
  - Tablet: 480px (standard email breakpoint)
  - Mobile: 320px (minimum supported width)

#### Layout System Modifications
- **Table-based layouts** for email client compatibility
- **Limited CSS support** (email-safe properties only)
- **Font restrictions** (web font fallbacks required)
- **Image optimization** for email delivery

#### Content Guidelines (Email-Specific)
- **Subject Line**: 30-40 characters (mobile optimization)
- **Headlines**: 40-50 characters
- **Body Content**: 250-300 characters optimal
- **CTA Buttons**: 2-5 words maximum
- **Alt Text**: Required for all images

#### Section Control Matrix
| Section Type | Theme Toggle | Layout Toggle | Visibility Controls |
|--------------|--------------|---------------|-------------------|
| Hero | ✅ Light/Dark | ✅ Split variant only | Eyebrow, headline, subhead, CTA |
| Content | ✅ Light/Dark | ✅ Two-column only | Headlines, body, CTAs |
| Product | ✅ Light/Dark | ✅ Single-feature only | Images, titles, descriptions, prices |
| Social Proof | ✅ Light/Dark | ✅ Testimonial only | Photos, quotes, names, metrics |
| CTA | ✅ Light/Dark | ❌ Centered only | Headlines, supporting text, buttons |
| Footer | ✅ Light/Dark | ✅ Extended only | Social links, contact, legal text |

## Email Client Compatibility

### Design Constraints
- Maximum width: 600px
- Table-based layouts required
- Limited web font support
- CSS property restrictions
- Image size optimization
- Dark mode compatibility considerations

### Supported Email Clients
- Gmail (Desktop/Mobile)
- Outlook (2016, 2019, Office 365)
- Apple Mail (iOS/macOS)
- Yahoo Mail
- Thunderbird
- Mobile email apps (iOS/Android)

## Content Guidelines

### Character Limits (Email-Optimized)
- **Subject Lines**: 30-40 characters (mobile preview)
- **Preheader**: 85-90 characters maximum
- **Headlines**: 40-50 characters ideal
- **Body Text**: 250-300 characters optimal
- **CTA Buttons**: 2-5 words maximum
- **Footer Text**: Concise compliance language

### Writing Best Practices
- Front-load important information
- Use action-oriented language
- Maintain scannable hierarchy
- Include clear calls-to-action
- Provide value proposition quickly
- Consider mobile reading patterns

## Visual Design System

### Brand Integration
Uses VisionPoint Marketing's design system:
- **Primary Red**: #E53E3E
- **Dark Navy**: #1A365D  
- **Light Gray**: #F7FAFC
- **Text Dark**: #1A202C
- **Text Gray**: #718096

### Email-Safe Typography
- System font stack for maximum compatibility
- Fallback fonts for unsupported clients
- Responsive type scaling
- Clear hierarchy maintenance

### Responsive Features
- Automatic mobile stacking
- Touch-friendly button sizing
- Optimized image scaling
- Email client safe media queries

## User Workflow
1. Select viewport size for email design (600px/480px/320px)
2. Add sections from component library (6 main types)
3. Choose section variants and configure controls
4. Edit content with real-time feedback and character limits
5. Toggle themes (Light/Dark) and layout directions
6. Customize element visibility for each section
7. Preview across email-specific device sizes
8. Export for review/implementation (JSON/Google Docs)

## Export Options
- **JSON Export**: Complete template data with email-specific metadata
- **Google Docs Export**: Formatted content for review and approval
- **Email-Safe HTML**: Optimized for email service provider integration

## Phased Development Implementation Plan

### Phase 1: Core Infrastructure Foundation
**Goal**: Establish email builder architecture and basic functionality
**Duration**: Sprint 1-2

#### Tasks:
1. **Set up email builder project structure**
   - Create `email-builder/` directory
   - Copy and adapt core files from wireframe builder
   - Configure email-specific viewport settings

2. **Adapt state management system**
   - Modify `state` object for email-specific sections
   - Update section template structure for email variants
   - Implement email viewport controls (600px/480px/320px)

3. **Create base email section template**
   - Define email-safe HTML structure
   - Implement table-based layout system
   - Set up theme variant system (Light/Dark)

**Deliverables**: Working email builder shell with viewport controls

### Phase 2: Hero and Content Sections
**Goal**: Implement most commonly used email sections
**Duration**: Sprint 3-4

#### Tasks:
1. **Hero Section Implementation**
   - Single Column Hero variant
   - Split Hero variant with layout direction toggle
   - Text-Only Hero variant
   - Email-safe typography and constraints

2. **Content Section Implementation**
   - Single Column Content variant
   - Two Column Content with layout direction toggle
   - Bulleted List variant with email client compatibility
   - Standalone Image variant with responsive sizing

3. **Testing and Refinement**
   - Cross-email client testing
   - Mobile responsiveness validation
   - Character limit enforcement

**Deliverables**: Functional Hero and Content sections with all variants and controls

### Phase 3: Product and Social Proof Sections
**Goal**: Add ecommerce and credibility sections
**Duration**: Sprint 5-6

#### Tasks:
1. **Product Section Implementation**
   - Single Product Feature with layout toggle
   - Product Grid for multiple items
   - Feature List with email-safe icons

2. **Social Proof Section Implementation**
   - Testimonial section with layout direction controls
   - Metrics Block for statistics display
   - Logo Bar for partner/client showcase

3. **Integration Testing**
   - Section interaction testing
   - Email client compatibility validation
   - Performance optimization

**Deliverables**: Complete product and social proof functionality

### Phase 4: CTA and Footer Sections
**Goal**: Finalize conversion and compliance sections
**Duration**: Sprint 7-8

#### Tasks:
1. **CTA Section Implementation**
   - Primary CTA with email-safe styling
   - Secondary CTA with supporting text
   - Button Group with mobile optimization

2. **Footer Section Implementation**
   - Standard Footer with compliance elements
   - Extended Footer with layout arrangements
   - Minimal Footer for simple needs

3. **Compliance Features**
   - Required unsubscribe link functionality
   - Legal text and privacy policy support
   - Email regulation compliance checks

**Deliverables**: Complete CTA and Footer functionality with compliance

### Phase 5: Email-Specific Features & Optimization
**Goal**: Add email-specific enhancements and optimizations
**Duration**: Sprint 9-10

#### Tasks:
1. **Email Export Enhancements**
   - Email service provider export formatting
   - HTML optimization for email clients
   - Image optimization and hosting considerations

2. **Advanced Email Features**
   - Preheader/preview text handling
   - Email client specific optimizations
   - Dark mode compatibility improvements

3. **Testing and Quality Assurance**
   - Comprehensive email client testing
   - Accessibility validation
   - Performance optimization
   - Documentation completion

**Deliverables**: Production-ready email template builder

## Development Considerations

### Code Reuse Strategy
- **High Reuse** (80-90%): State management, drag/drop, export system, UI components
- **Moderate Adaptation** (50-70%): Section templates, character limits, viewport controls
- **Email-Specific** (New): Table layouts, email client compatibility, compliance features

### Testing Requirements
- **Email Client Testing**: Gmail, Outlook, Apple Mail, Yahoo, mobile clients
- **Responsive Testing**: 600px, 480px, 320px viewport validation
- **Accessibility Testing**: Screen reader compatibility, keyboard navigation
- **Performance Testing**: Load times, memory usage, large template handling

### Success Metrics
- **Functionality**: All 6 section types with variants working correctly
- **Compatibility**: 95%+ rendering accuracy across major email clients
- **Usability**: Writers can create templates without technical knowledge
- **Performance**: Sub-2 second load times, smooth interactions
- **Adoption**: Successful integration into VisionPoint Marketing workflow
