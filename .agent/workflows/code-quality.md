---
description: Code quality standards and patterns to prevent TypeScript/ESLint errors
---

# Code Quality Workflow

This workflow documents the coding standards, patterns, and best practices for the gambling-web project. **All AI agents and developers MUST follow these guidelines** to prevent TypeScript and ESLint errors during development.

---

## 🚨 CRITICAL RULES

### 1. Never Import Unused Modules

**Before adding ANY import, verify it will be used in the file.**

```typescript
// ❌ BAD - Importing unused modules
import { useState, useEffect, useCallback } from 'react'; // Only using useState
import { Button, Card, Badge } from '@/components/ui'; // Only using Button

// ✅ GOOD - Only import what you use
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
```

### 2. Never Declare Unused Variables

**If you destructure from hooks but don't use a value, omit it or prefix with `_`**

```typescript
// ❌ BAD - Unused error variable
const { data, error, isLoading } = useSWR('/api/data', fetcher);
// Only using data and isLoading

// ✅ GOOD - Omit unused variables
const { data, isLoading } = useSWR('/api/data', fetcher);

// ✅ ALSO GOOD - Prefix with underscore if needed for type inference
const { data, error: _error, isLoading } = useSWR('/api/data', fetcher);
```

### 3. Always Type API Responses

**Never use `any` type. Always define interfaces for API responses.**

```typescript
// ❌ BAD - Using any type
const data = response.data as any;

// ✅ GOOD - Define and use proper interfaces
interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

const data = response.data as UserResponse;
```

### 4. Escape Special Characters in JSX

**Always escape apostrophes (') and quotes (") in JSX text content.**

```tsx
// ❌ BAD - Unescaped entities in JSX
<p>You don't have permission</p>
<p>Click "Submit" to continue</p>

// ✅ GOOD - Escaped entities
<p>You don&apos;t have permission</p>
<p>Click &quot;Submit&quot; to continue</p>

// ✅ ALSO GOOD - Use template literals in JS expressions
<p>{`You don't have permission`}</p>
```

**Escape reference:**
- `'` → `&apos;`
- `"` → `&quot;`
- `<` → `&lt;`
- `>` → `&gt;`
- `&` → `&amp;`

### 5. Type useSWR Fetchers Correctly

**Ensure your fetcher function matches useSWR's expected signature.**

```typescript
// ❌ BAD - Untyped fetcher
const fetcher = (url: string) => api.get(url).then(res => res.data);
const { data } = useSWR<MyType>('/api/data', fetcher); // Type mismatch!

// ✅ GOOD - Generic typed fetcher
const fetcher = <T,>(url: string): Promise<T> => 
  api.get<T>(url).then(res => res.data as T);

// Or define response wrapper
interface ApiResponseWrapper<T> {
  data: T;
  meta?: { total?: number; totalPages?: number };
}
const fetcher = (url: string) => api.get<ApiResponseWrapper<MyType>>(url);
```

### 6. Handle Optional Properties Safely

**Always check for undefined before accessing optional properties.**

```typescript
// ❌ BAD - Accessing potentially undefined property
{meta.totalPages > 1 && <Pagination />}

// ✅ GOOD - Check for undefined first
{meta && meta.totalPages && meta.totalPages > 1 && <Pagination />}

// ✅ ALSO GOOD - Use optional chaining with fallback
{(meta?.totalPages ?? 0) > 1 && <Pagination />}
```

---

## 📋 Pre-Commit Checklist

Before committing any code changes, run through this checklist:

### Import Verification
- [ ] All imported modules are actually used in the file
- [ ] lucide-react icons are individually imported only when used
- [ ] Utility functions (formatDate, cn, etc.) are only imported when used
- [ ] Context hooks (useAuth, etc.) are only imported when used

### Type Safety
- [ ] No `any` types used - all data has proper interfaces
- [ ] API responses have defined interfaces
- [ ] useSWR hooks have proper generic types
- [ ] Optional properties are safely accessed with null checks

### JSX Content
- [ ] All apostrophes in JSX text use `&apos;`
- [ ] All double quotes in JSX text use `&quot;`
- [ ] Error messages and user-facing text are properly escaped

### Variables
- [ ] No unused variables declared
- [ ] Destructured values from hooks are all used
- [ ] Function parameters are all used (or prefixed with `_`)

---

## 🔧 Common Patterns

### Pattern 1: SWR Data Fetching with Types

```typescript
// Define response interface
interface CompetitionData {
  competitions: Competition[];
}

// Type the fetcher
const fetcher = (url: string) => 
  api.get<CompetitionData>(url).then(res => {
    if (res.success && res.data) return res.data;
    throw new Error('Failed to fetch');
  });

// Use in component
const { data, isLoading } = useSWR('competitions', fetcher);
const competitions = data?.competitions || [];
```

### Pattern 2: Admin Action Responses

```typescript
// Define action result interface
interface DrawResult {
  winner?: {
    ticket_number?: number;
    first_name?: string;
    email?: string;
  };
  total_entries?: number;
}

// Type the API call
const response = await api.post<DrawResult>('/api/admin/draw', payload);
if (response.success && response.data) {
  alert(`Winner: ${response.data.winner?.ticket_number}`);
}
```

### Pattern 3: Form Data Types

```typescript
// Define form interface matching API expectations
interface CompetitionFormData {
  title: string;
  slug: string;
  description: string;
  prize_value: number;
  ticket_price: number;
  status: 'draft' | 'live' | 'ended' | 'completed';
}

// Use for both state and API casting
const [formData, setFormData] = useState<CompetitionFormData>({...});
const data = response.data as CompetitionFormData;
```

---

## 🛠️ Commands to Verify

### Run Before Every Commit

```bash
# Check for ESLint errors
cd frontend && npm run lint

# Check TypeScript compilation
cd frontend && npm run build

# Quick type check without full build
cd frontend && npx tsc --noEmit
```

### Fix Common Issues

```bash
# Auto-fix ESLint issues where possible
cd frontend && npm run lint -- --fix

# Find unused imports
grep -r "import.*from" src/ | grep -v node_modules
```

---

## 📁 Files Commonly Affected

These files frequently have the issues documented above:

| File Pattern | Common Issues |
|--------------|---------------|
| `app/(admin)/admin/*.tsx` | Unused imports, untyped API responses |
| `app/(dashboard)/*.tsx` | Unused useAuth, unused error variables |
| `app/(public)/*.tsx` | Unescaped apostrophes/quotes in content |
| `components/layout/*.tsx` | Unused icon imports |
| `lib/api.ts` | ApiResponse type missing properties |

---

## ⚠️ AI Agent Instructions

When working on this codebase:

1. **ALWAYS run `npm run lint` after making changes**
2. **NEVER import a module without using it**
3. **ALWAYS define TypeScript interfaces for API data**
4. **ALWAYS escape special characters in JSX text**
5. **ALWAYS check optional properties before accessing**
6. **NEVER use `any` type - define proper interfaces instead**

If you encounter ESLint or TypeScript errors:
1. Read the error message carefully
2. Refer to the patterns in this document
3. Fix the root cause, not just the symptom
4. Verify the fix with `npm run lint && npm run build`
