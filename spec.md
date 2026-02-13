# Specification

## Summary
**Goal:** Provide clear, developer-facing instructions for editing The3GareebsGantu Cafe site content (text, images, menu, contact details, and optional promo widgets) directly in the codebase.

**Planned changes:**
- Add a new English documentation file (e.g., `CONTENT_EDITING_GUIDE.md`) describing where and how to update site content.
- Document the exact files to edit for common updates, including:
  - `frontend/src/config/siteConfig.ts` (tagline/description/phone/address/map links/CTAs)
  - `frontend/src/data/menuData.ts` (menu categories/items/prices/badges/images)
  - `frontend/src/config/boostersConfig.ts` (promo banner/student discount/embeds toggles and text)
  - `frontend/src/components/about/StorySection.tsx` (About page story text)
  - Page components for headings/section copy: `frontend/src/pages/HomePage.tsx`, `AboutPage.tsx`, `MenuPage.tsx`, `GalleryPage.tsx`, `ContactPage.tsx`
- Explain how to replace static images under `frontend/public/assets/generated`, including keeping existing referenced filenames and how to update code references when filenames change.
- Include end-to-end examples for: updating phone/address, editing a menu item name/price, and swapping a hero or dish image.

**User-visible outcome:** Developers have a single, step-by-step guide that tells them exactly which files to edit to update site text, menu content, contact details, promo widgets, and images without changing app structure or adding a CMS.
