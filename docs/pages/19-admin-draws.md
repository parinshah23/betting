# Page Specification: Admin Draws Management

> **Page Route:** `/admin/draws`
> **Role Access:** Admin Only
> **Priority:** High
> **Spec Version:** 1.0

---

## 1. Page Overview

The draws management page allows administrators to run draws for ended competitions, export entry lists, declare winners, and manage the winners gallery.

---

## 2. Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                         Admin Header                             │
├────────────────┬────────────────────────────────────────────────┤
│                │                                                 │
│  Admin         │  Draw Management                                │
│  Sidebar       │                                                 │
│                │  [Pending Draws] [Completed] [Winners Gallery]  │
│                │                                                 │
│                │  ── PENDING DRAWS ──────────────────────────    │
│                │                                                 │
│                │  ┌─────────────────────────────────────────┐   │
│                │  │ 🏎️ Porsche 911 GT3 Competition          │   │
│                │  │                                          │   │
│                │  │ Ended: Jan 28, 2026 at 6:00 PM           │   │
│                │  │ Total Entries: 1,000 tickets             │   │
│                │  │ Unique Participants: 234                 │   │
│                │  │                                          │   │
│                │  │ [Export Entries CSV]  [Run Draw]         │   │
│                │  └─────────────────────────────────────────┘   │
│                │                                                 │
│                │  ┌─────────────────────────────────────────┐   │
│                │  │ ⌚ Rolex Submariner Draw                 │   │
│                │  │                                          │   │
│                │  │ Ended: Jan 27, 2026 at 8:00 PM           │   │
│                │  │ Total Entries: 500 tickets               │   │
│                │  │ Unique Participants: 89                  │   │
│                │  │                                          │   │
│                │  │ [Export Entries CSV]  [Run Draw]         │   │
│                │  └─────────────────────────────────────────┘   │
│                │                                                 │
├────────────────┴────────────────────────────────────────────────┤
│                         Footer                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Tree

```
AdminDrawsPage
├── AdminLayout
├── PageHeader
├── TabNavigation
│   ├── PendingDrawsTab
│   ├── CompletedDrawsTab
│   └── WinnersGalleryTab
├── PendingDrawsView
│   └── PendingDrawCard[]
│       ├── CompetitionInfo
│       ├── EntryStats
│       ├── ExportButton
│       └── RunDrawButton
├── RunDrawModal
│   ├── CompetitionSummary
│   ├── WinningNumberInput
│   ├── WinnerPreview
│   └── ConfirmButton
├── CompletedDrawsView
│   └── CompletedDrawCard[]
├── WinnersGalleryView
│   └── WinnerCard[] + AddWinnerButton
└── AddWinnerModal
```

---

## 4. API Endpoints Required

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `GET /api/admin/draws/pending` | GET | Get pending draws |
| `GET /api/admin/draws/completed` | GET | Get completed draws |
| `GET /api/admin/competitions/:id/entries` | GET | Export entries |
| `POST /api/admin/competitions/:id/draw` | POST | Declare winner |
| `GET /api/admin/winners-gallery` | GET | Get winners gallery |
| `POST /api/admin/winners-gallery` | POST | Add to gallery |

---

## 5. Data Models

### Pending Draw

```typescript
interface PendingDraw {
  competitionId: string;
  competitionTitle: string;
  competitionImage: string;
  endedAt: string;
  totalTickets: number;
  ticketsSold: number;
  uniqueParticipants: number;
  ticketRange: {
    min: number;
    max: number;
  };
}
```

### Draw Result

```typescript
interface DrawResult {
  competitionId: string;
  winningTicketNumber: number;
  winner: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  drawnAt: string;
  drawnBy: string; // Admin user ID
}
```

### Entry Export

```typescript
// CSV Format
// Ticket Number, User Name, User Email, Purchase Date
// 1, John Doe, john@example.com, 2026-01-15 14:30:00
// 2, John Doe, john@example.com, 2026-01-15 14:30:00
// 3, Jane Smith, jane@example.com, 2026-01-16 09:15:00
```

---

## 6. Run Draw Flow

```
┌─────────────────┐
│ Click Run Draw  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Modal Opens     │
│ Show Summary    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Option A: Random Draw           │
│ [Generate Random Winner]        │
│                                 │
│ OR                              │
│                                 │
│ Option B: Third-Party Draw      │
│ Enter Winning Number: [____]    │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────┐
│ Preview Winner  │
│ "John D." - #42 │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Confirm Draw    │
│ [Declare Winner]│
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│ • Competition marked complete   │
│ • Winner notified via email     │
│ • Public winner page updated    │
│ • All participants notified     │
└─────────────────────────────────┘
```

---

## 7. Run Draw Modal

```
┌─────────────────────────────────────────┐
│            Run Draw                  ✕  │
├─────────────────────────────────────────┤
│                                         │
│  Competition: Porsche 911 GT3           │
│  Total Entries: 1,000 tickets           │
│  Valid Ticket Range: 1 - 1000           │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  Select Draw Method:                    │
│                                         │
│  ○ Random (System Generated)            │
│  ● Manual Entry (Third-Party Draw)      │
│                                         │
│  Winning Ticket Number:                 │
│  ┌─────────────────────────────────┐   │
│  │ 42                              │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  WINNER PREVIEW                         │
│  ┌─────────────────────────────────┐   │
│  │  👤 John Doe                     │   │
│  │  📧 john.doe@email.com           │   │
│  │  🎟️ Ticket #42                   │   │
│  │  🛒 Purchased 5 tickets total    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ⚠️ This action cannot be undone.       │
│                                         │
│  [Cancel]            [Declare Winner]   │
│                                         │
└─────────────────────────────────────────┘
```

---

## 8. Export Entries

```typescript
// Export functionality
const exportEntries = async (competitionId: string) => {
  const response = await fetch(`/api/admin/competitions/${competitionId}/entries`, {
    headers: { 'Accept': 'text/csv' }
  });

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `entries-${competitionId}-${Date.now()}.csv`;
  a.click();
};
```

---

## 9. Winners Gallery

```
┌─────────────────────────────────────────┐
│ Winners Gallery              [+ Add]    │
├─────────────────────────────────────────┤
│                                         │
│ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐│
│ │  📷   │ │  📷   │ │  📷   │ │  📷   ││
│ │ John  │ │ Sarah │ │ Mike  │ │ Emma  ││
│ │ GT3   │ │ Rolex │ │ Mac   │ │ iPad  ││
│ │[Edit] │ │[Edit] │ │[Edit] │ │[Edit] ││
│ └───────┘ └───────┘ └───────┘ └───────┘│
│                                         │
└─────────────────────────────────────────┘
```

### Add Winner Form

```typescript
interface WinnerGalleryEntry {
  competitionId: string;
  userId: string;
  displayName: string; // "John D." for privacy
  testimonial?: string;
  photoUrl?: string;
  featured: boolean;
}
```

---

## 10. Agent Task

```markdown
## Task: Build Admin Draws Management

You are assigned to build the Admin Draws pages (/admin/draws).

### Prerequisites
1. Read .ai/context.md
2. Ensure AdminLayout exists
3. Verify draw-related APIs work

### Implementation Steps
1. Create `src/app/(admin)/admin/draws/page.tsx`
2. Implement tab navigation (Pending, Completed, Gallery)
3. Build PendingDrawCard component
4. Create RunDrawModal with both draw methods
5. Implement winner preview lookup
6. Add export entries functionality
7. Build CompletedDrawsView
8. Create WinnersGalleryView with add/edit

### Acceptance Criteria
- [ ] Pending draws list correctly
- [ ] Export entries downloads CSV
- [ ] Run draw modal works
- [ ] Random draw generates winner
- [ ] Manual entry validates ticket number
- [ ] Winner preview shows correct user
- [ ] Confirm draw completes competition
- [ ] Winners gallery displays and edits
- [ ] Winner notification sent

### After Completion
Update .ai/context.md with your changes.
```

---

## 11. Notifications on Draw Complete

```typescript
// Emails sent after draw:
const notifyDraw = async (competitionId: string, winnerId: string) => {
  // 1. Winner notification
  await sendEmail({
    to: winner.email,
    template: 'winner-notification',
    data: { competition, ticketNumber }
  });

  // 2. All participants notification
  await sendBulkEmail({
    to: participants,
    template: 'draw-complete',
    data: { competition, winnerName: 'John D.' }
  });
};
```

---

## 12. Security Considerations

- Only admins can run draws
- Log all draw actions with admin ID
- Prevent multiple draws on same competition
- Validate ticket number is in valid range
- Confirm modal prevents accidental runs
