# Page Specification: Admin Content Management

> **Page Route:** `/admin/content`
> **Role Access:** Admin Only
> **Priority:** Low
> **Spec Version:** 1.0

---

## 1. API Endpoints Required

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `GET /api/admin/content` | GET | List content pages |
| `PUT /api/admin/content/:slug` | PUT | Update page |

---

## 2. Manageable Content

- FAQ page content
- Terms & Conditions
- Privacy Policy
- Homepage banners
- Site-wide announcements

---

## 3. Agent Task

```markdown
## Task: Build Admin Content Management

### Implementation Steps
1. Create `src/app/(admin)/admin/content/page.tsx`
2. List all manageable pages
3. Implement rich text editor
4. Add save/publish functionality
5. Preview capability

### Acceptance Criteria
- [ ] Content pages listed
- [ ] Rich text editing works
- [ ] Changes save correctly
- [ ] Preview shows updates
```
