# Page Specification: Admin Competitions Management

> **Page Route:** `/admin/competitions`
> **Role Access:** Admin Only
> **Priority:** High
> **Spec Version:** 1.0

---

## 1. Page Overview

The admin competitions page allows administrators to create, edit, duplicate, and manage all competitions. It includes the ability to set up instant wins, configure ticket parameters, and manage competition lifecycle.

---

## 2. Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                         Admin Header                             │
├────────────────┬────────────────────────────────────────────────┤
│                │                                                 │
│  Admin         │  Competitions Management                        │
│  Sidebar       │                                                 │
│                │  [+ Create Competition]      [🔍 Search...]     │
│                │                                                 │
│                │  Filter: [All ▼] [Live ▼] [Draft ▼]            │
│                │                                                 │
│                │  ┌─────────────────────────────────────────┐   │
│                │  │ Competition    Status  Sold   Revenue  ⋮ │   │
│                │  │ ───────────────────────────────────────  │   │
│                │  │ Porsche GT3    🟢 Live  450   £4,500  [⋮]│   │
│                │  │ Rolex Watch    🟢 Live  890   £8,900  [⋮]│   │
│                │  │ MacBook Pro    📝 Draft  -     -      [⋮]│   │
│                │  │ iPhone 15      ⏸️ Ended 1000  £10,000 [⋮]│   │
│                │  │ Summer Car     ✅ Done  500   £5,000  [⋮]│   │
│                │  └─────────────────────────────────────────┘   │
│                │                                                 │
│                │  Showing 5 of 24  [< 1 2 3 4 5 >]              │
│                │                                                 │
├────────────────┴────────────────────────────────────────────────┤
│                         Footer                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Sub-Pages

| Route | Purpose |
|-------|---------|
| `/admin/competitions` | List all competitions |
| `/admin/competitions/create` | Create new competition |
| `/admin/competitions/[id]` | Edit existing competition |

---

## 4. Component Tree (List View)

```
AdminCompetitionsPage
├── AdminLayout
├── PageHeader
│   ├── Title
│   ├── CreateButton
│   └── SearchInput
├── FilterBar
│   ├── StatusFilter
│   └── CategoryFilter
├── CompetitionsTable
│   ├── TableHeader
│   └── TableRow[]
│       ├── CompetitionInfo
│       ├── StatusBadge
│       ├── SoldCount
│       ├── Revenue
│       └── ActionsMenu
│           ├── Edit
│           ├── Duplicate
│           ├── View Live
│           ├── Export Entries
│           └── Delete
├── Pagination
└── DeleteConfirmModal
```

---

## 5. API Endpoints Required

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `GET /api/admin/competitions` | GET | List all competitions |
| `POST /api/admin/competitions` | POST | Create competition |
| `GET /api/admin/competitions/:id` | GET | Get single competition |
| `PUT /api/admin/competitions/:id` | PUT | Update competition |
| `DELETE /api/admin/competitions/:id` | DELETE | Delete competition |
| `POST /api/admin/competitions/:id/duplicate` | POST | Duplicate competition |
| `POST /api/admin/competitions/:id/instant-wins` | POST | Set instant win numbers |
| `GET /api/admin/competitions/:id/entries` | GET | Export entries |

---

## 6. Competition Form Fields

```typescript
interface CompetitionFormData {
  // Basic Info
  title: string;
  slug: string; // Auto-generated from title
  shortDescription: string;
  description: string; // Rich text
  category: string;

  // Pricing & Tickets
  prizeValue: number;
  ticketPrice: number;
  totalTickets: number;
  maxTicketsPerUser: number;

  // Dates
  endDate: string; // ISO datetime
  drawDate?: string;

  // Skill Question (Legal requirement)
  skillQuestion: string;
  skillAnswer: string;

  // Images
  images: CompetitionImage[];

  // Status
  status: 'draft' | 'live';
  featured: boolean;

  // Instant Wins (optional)
  instantWins?: InstantWinConfig[];
}

interface InstantWinConfig {
  ticketNumber: number;
  prize: string;
}
```

---

## 7. Create/Edit Form Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Create Competition                              [Save as Draft] │
│                                                  [Publish Live]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  BASIC INFORMATION                                               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Title                                                      │  │
│  │ [Porsche 911 GT3 Competition                           ]  │  │
│  │                                                            │  │
│  │ Slug (URL)                                                 │  │
│  │ [porsche-911-gt3-competition                           ]  │  │
│  │                                                            │  │
│  │ Short Description (max 200 chars)                          │  │
│  │ [Win this stunning Porsche 911 GT3...                  ]  │  │
│  │                                                            │  │
│  │ Full Description                                           │  │
│  │ ┌─────────────────────────────────────────────────────┐   │  │
│  │ │ [Rich Text Editor]                                  │   │  │
│  │ │                                                      │   │  │
│  │ └─────────────────────────────────────────────────────┘   │  │
│  │                                                            │  │
│  │ Category                                                   │  │
│  │ [Cars ▼]                                                   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  PRICING & TICKETS                                               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Prize Value (£)        Ticket Price (£)                    │  │
│  │ [150000            ]   [10.00             ]               │  │
│  │                                                            │  │
│  │ Total Tickets          Max Per User                        │  │
│  │ [1000              ]   [100               ]               │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  SCHEDULE                                                        │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Competition End Date & Time                                │  │
│  │ [2026-02-15] [18:00]                                      │  │
│  │                                                            │  │
│  │ Draw Date & Time (optional)                                │  │
│  │ [2026-02-15] [20:00]                                      │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  SKILL QUESTION (Legal Requirement)                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Question                                                   │  │
│  │ [What is 15 + 27?                                      ]  │  │
│  │                                                            │  │
│  │ Correct Answer                                             │  │
│  │ [42                                                    ]  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  IMAGES                                                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ [📷 +] [img1] [img2] [img3] [img4]                        │  │
│  │                                                            │  │
│  │ Drag to reorder. First image is primary.                  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  INSTANT WINS (Optional)                                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ [+ Add Instant Win]                                        │  │
│  │                                                            │  │
│  │ Ticket #    Prize                              Action      │  │
│  │ 42          £50 Cash                           [Remove]    │  │
│  │ 156         Free Entry                         [Remove]    │  │
│  │ 789         £100 Voucher                       [Remove]    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  SETTINGS                                                        │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ [✓] Feature on homepage                                    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Status Lifecycle

```
Draft → Live → Ended → Completed
  │       │       │
  │       │       └── Draw has been run
  │       └── End date passed
  └── Not yet published
```

---

## 9. Agent Task

```markdown
## Task: Build Admin Competitions Management

You are assigned to build the Admin Competitions pages.

### Prerequisites
1. Read .ai/context.md
2. Ensure AdminLayout exists
3. Ensure DataTable component exists
4. Verify admin competition APIs work

### Implementation Steps

**List Page:**
1. Create `src/app/(admin)/admin/competitions/page.tsx`
2. Build CompetitionsTable with sorting
3. Add status filters
4. Implement search
5. Add actions menu (edit, duplicate, delete)
6. Add pagination

**Create/Edit Page:**
1. Create `src/app/(admin)/admin/competitions/create/page.tsx`
2. Create `src/app/(admin)/admin/competitions/[id]/page.tsx`
3. Build multi-section form
4. Implement image upload
5. Add instant wins configuration
6. Add form validation
7. Handle save/publish actions

### Acceptance Criteria
- [ ] List shows all competitions
- [ ] Filters and search work
- [ ] Create form validates correctly
- [ ] Images can be uploaded and reordered
- [ ] Instant wins can be configured
- [ ] Edit loads existing data
- [ ] Duplicate creates new copy
- [ ] Delete with confirmation

### After Completion
Update .ai/context.md with your changes.
```

---

## 10. Component Specifications

### CompetitionForm

```typescript
interface CompetitionFormProps {
  initialData?: CompetitionFormData;
  onSubmit: (data: CompetitionFormData, status: 'draft' | 'live') => Promise<void>;
  isLoading?: boolean;
}
```

### ImageUploader

```typescript
interface ImageUploaderProps {
  images: CompetitionImage[];
  onChange: (images: CompetitionImage[]) => void;
  maxImages?: number;
}

// Features:
// - Drag and drop upload
// - Drag to reorder
// - Delete with confirmation
// - Primary image indicator
```

### InstantWinEditor

```typescript
interface InstantWinEditorProps {
  wins: InstantWinConfig[];
  totalTickets: number;
  onChange: (wins: InstantWinConfig[]) => void;
}

// Features:
// - Add new instant win
// - Validate ticket number in range
// - Prevent duplicate numbers
// - Remove instant win
```

---

## 11. Validation Rules

```typescript
const competitionSchema = z.object({
  title: z.string().min(5).max(255),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  shortDescription: z.string().max(200),
  description: z.string().min(50),
  category: z.string().min(1),
  prizeValue: z.number().positive(),
  ticketPrice: z.number().positive().max(1000),
  totalTickets: z.number().int().min(10).max(100000),
  maxTicketsPerUser: z.number().int().min(1).max(1000),
  endDate: z.string().datetime(),
  skillQuestion: z.string().min(5),
  skillAnswer: z.string().min(1),
  images: z.array(z.object({
    url: z.string().url(),
    altText: z.string().optional(),
  })).min(1),
});
```
