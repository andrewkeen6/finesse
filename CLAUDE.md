# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Finesse Detailing is a professional car detailing website built with Astro v5.13.10. The site features a modern, responsive design with a professional red and black color palette, showcasing premium automotive detailing services.

## Architecture

- **Framework**: Astro v5.13.10 with TypeScript
- **Build System**: Astro's built-in build system (Vite-based)
- **Styling**: CSS-in-Astro with CSS custom properties for theming
- **TypeScript Configuration**: Extends `astro/tsconfigs/strict` for strict type checking
- **Font**: Inter from Google Fonts for clean, professional typography

## Color Palette

```css
--primary-red: #DC143C
--dark-red: #B71C1C
--black: #1A1A1A
--dark-gray: #2D2D2D
--light-gray: #F5F5F5
--white: #FFFFFF
--accent-gray: #666666
```

## Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server (usually localhost:4321, may use 4322 if 4321 is in use) |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm run astro` | Run Astro CLI commands |

## Site Structure

### Pages
- `/` - Homepage with hero, services, gallery, testimonials, contact sections
- `/services` - Detailed service offerings and process information
- `/gallery` - Portfolio showcase with Instagram integration placeholders
- `/contact` - Contact form, business info, FAQ, and Google Maps integration
- `/book` - Multi-step booking form for service appointments

### Components
- `Layout.astro` - Main layout wrapper with navigation and footer
- `Navigation.astro` - Responsive navbar with mobile hamburger menu
- `Hero.astro` - Homepage hero section with animated elements
- `Services.astro` - Service packages with pricing cards and features
- `Gallery.astro` - Photo gallery with Instagram integration placeholders
- `Testimonials.astro` - Customer reviews with Google Reviews styling
- `Contact.astro` - Contact form and business information with maps

## Key Features

### Responsive Design
- Mobile-first approach with breakpoints at 768px and 480px
- Hamburger navigation menu for mobile devices
- Grid layouts that adapt to screen sizes
- Touch-friendly interactive elements

### Interactive Elements
- Animated hero section with shine effects
- Smooth scroll behavior and hover animations
- Multi-step booking form with validation
- Carousel testimonials with navigation dots
- Mobile menu toggle functionality

### Third-Party Integrations (Placeholders)
- Instagram feed integration (placeholder structure ready)
- Google Reviews display (styled components ready)
- Google Maps embed (iframe placeholder included)
- Contact form submission (client-side validation ready)

## Development Notes

- All components use CSS custom properties for consistent theming
- Interactive JavaScript is included inline within Astro components
- Forms include validation and loading states
- Images use placeholder backgrounds with gradients
- Icons use emoji for universal compatibility
- All external links open in new tabs where appropriate