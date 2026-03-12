# Victor Global Initiative (VGI) - Digital Headquarters

**"Building Victors, Not Victims. From Surviving to Thriving."**

Welcome to the official repository for the Victor Global Initiative web platform. This digital headquarters is engineered to provide absolute transparency to our donors, a seamless application process for our JROTC scholars, and a clear articulation of our mission to empower at-risk youth.

---

## 🦅 Mission Overview
Victor Global Initiative was founded by **Pierre-Richard Victor** to honor the legacy of Lucianne Horace. Her "X" signature was not a symbol of limitation, but a multiplier of opportunity. VGI exists to provide foster children and youth in transition with:
1. **A Sanctuary:** Stability for those in transition.
2. **A Mentor:** Guidance rooted in lived experience and military-grade discipline.
3. **A Path to Victory:** Resources to build a global future.

---

## 📂 Digital Architecture (The Flight Plan)

This repository is built using clean, high-performance HTML5, CSS3, and Vanilla JavaScript. It requires no heavy backend frameworks to execute its front-end mission.

### Core Routing
* `/index.html` - Mission Control (Home Page)
* `/our-story.html` - The Founder's Journey & The Legacy of the "X"
* `/initiatives.html` - Phase 1 Programs & Operational Impact
* `/impact.html` - 5-Year Scaling Roadmap & Transparency Metrics
* `/board.html` - Governance, Advisors, and Strategic Leadership

### Scholarship Infrastructure
* `/scholarship.html` - The "X" Promise Scholarship details and 100-point Evaluation Rubric
* `/portal.html` - Secure Candidate Dashboard for document and video impact statement uploads
* `/teacher-upload.html` - Dedicated portal for JROTC Instructors and Educators

### Assets & Styling
* `/assets/css/style.css` - The "Victor Standard" master stylesheet. Contains global variables, mobile-responsive grid stacking, and a CSS-only 3D Flip Engine.
* `/assets/js/scripts.js` - Lightweight client-side interactions and portal authentication routing.
* `/assets/images/` - Brand assets, board headshots, and mission photography.

---

## 🛠️ The "Victor Standard" UI/UX Specifications

To maintain the highest level of professionalism, all future commits must adhere to these established design parameters:

* **Brand Typography:** Montserrat (Weights: 400 Regular, 600 Semi-Bold, 700 Bold, 900 Black).
* **Color Palette:** * Deep Teal (`var(--primary)`: `#0a7d8c`)
  * Mint Seafoam (`var(--secondary)`: `#32c6a6`)
  * Navy Blue (`var(--navy)`: `#002147`) - Reserved strictly for the VGI Stacked Branding and Logo ring.
* **Component Mechanics:** The 3D Flip Engine used on the Board, Impact, and Initiatives pages is driven purely by CSS `:hover` states to ensure maximum compatibility across all mobile and desktop devices without Javascript dependency.
* **Responsive Integrity:** Grids automatically collapse from 3-column (desktop) to 2-column (tablet) to 1-column (mobile) using CSS Grid flex-wrapping.

---

## 🚀 Deployment Protocol

This platform is configured for immediate static deployment via GitHub Pages, Azure Static Web Apps, or AWS Amplify. 

1. Clone the repository to your local command center.
2. Ensure `sitemap.xml` and `robots.txt` remain in the root directory for SEO indexing.
3. Push to the `main` branch to trigger automatic deployment.

```bash
git add .
git commit -m "Routine maintenance and strategic updates"
git push origin main