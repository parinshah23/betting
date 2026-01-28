# Page Specification: Static Pages (FAQ, Terms, Privacy)

> **Page Routes:** `/faq`, `/terms`, `/privacy`
> **Role Access:** Public
> **Priority:** Low
> **Spec Version:** 1.0

---

## 1. Overview

Static content pages managed through the admin panel. Content is fetched from the database and rendered as HTML.

---

## 2. API Endpoints Required

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `GET /api/content/:slug` | GET | Get page content |

---

## 3. Data Model

```typescript
interface ContentPage {
  slug: string;
  title: string;
  content: string; // HTML content
  metaTitle: string;
  metaDescription: string;
  updatedAt: string;
}
```

---

## 4. Pages to Create

### FAQ Page (`/faq`)
- Accordion-style Q&A format
- Categories for organization
- Search functionality optional

### Terms & Conditions (`/terms`)
- Full legal text
- Table of contents
- Last updated date

### Privacy Policy (`/privacy`)
- Full legal text
- Sections with anchors
- Last updated date

---

## 5. Agent Task

```markdown
## Task: Build Static Pages

### Implementation Steps
1. Create `src/app/(public)/faq/page.tsx`
2. Create `src/app/(public)/terms/page.tsx`
3. Create `src/app/(public)/privacy/page.tsx`
4. Fetch content from API
5. Render HTML safely
6. Add SEO meta tags
7. Style with Tailwind

### Acceptance Criteria
- [ ] All pages load content
- [ ] HTML renders safely
- [ ] SEO tags present
- [ ] Responsive layout
- [ ] Last updated shown
```
