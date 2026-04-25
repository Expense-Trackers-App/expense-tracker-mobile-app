# Team Collaboration & Merge Plan

This document outlines the ownership, deliverables, and branching strategy for the 6-person team working on the Expense Tracker App.

## 👥 Roles & Responsibilities

### Collaborator 1: Auth and Onboarding
- **Branch**: `feat/auth-onboarding`
- **Owned Files**:
  - `src/pages/Login.tsx`
  - `src/pages/Signup.tsx`
  - `src/pages/Splash.tsx`
  - `src/components/ProtectedRoute.tsx`
  - `src/lib/auth.ts`
  - `src/lib/supabaseClient.ts`
- **Deliverables**:
  - Clean Supabase auth flow
  - Forgot password functionality
  - Social login or social login stub with proper architecture
  - Fix auth helper problems
  - Keep authenticated user state consistent

### Collaborator 2: Dashboard and Navigation
- **Branch**: `feat/dashboard-navigation`
- **Owned Files**:
  - `src/pages/Home.tsx`
  - `src/components/AppHeader.tsx`
  - `src/components/BottomNav.tsx`
  - `src/components/MobileLayout.tsx`
  - `src/components/PhoneShell.tsx`
  - `src/components/StatusBar.tsx`
- **Deliverables**:
  - Better home dashboard
  - Quick action polish
  - Better navigation UX
  - Responsive cleanup and reusable shell components

### Collaborator 3: Expenses Module
- **Branch**: `feat/expenses-module`
- **Owned Files**:
  - `src/pages/AddExpense.tsx`
  - `src/pages/Expenses.tsx`
  - `src/lib/categories.ts`
- **Deliverables**:
  - Expense CRUD polish
  - Better filters and validation
  - Search improvements
  - Recurring transactions support (optional/if added)

### Collaborator 4: Budgets Module
- **Branch**: `feat/budgets-module`
- **Owned Files**:
  - `src/pages/Budgets.tsx`
  - `src/pages/BudgetDetails.tsx`
- **Deliverables**:
  - Create/edit/delete budgets
  - Monthly budget progress
  - Budget alerts
  - Rollover or reset rules

### Collaborator 5: Analytics and Reports
- **Branch**: `feat/analytics-reports`
- **Owned Files**:
  - `src/pages/Analytics.tsx`
  - Any new report/export utilities created for analytics
- **Deliverables**:
  - Better charts
  - Time-range comparisons
  - Spending trend views
  - Export/report download

### Collaborator 6: Core Data, Settings, and QA
- **Branch**: `feat/core-settings-qa`
- **Owned Files**:
  - `src/context/AppContext.tsx`
  - `src/lib/storage.ts`
  - `src/lib/types.ts`
  - `src/pages/Settings.tsx`
  - `src/test/*`
- **Deliverables**:
  - Shared types and data flow
  - Settings persistence
  - Notification settings
  - Replace demo settings sections with real pages
  - Testing and merge support for the team

---

## 🔀 Merge Order

To reduce conflicts and ensure core systems are in place before dependent features are merged, we will merge Pull Requests in this strict order:

1. `feat/core-settings-qa` *(Sets up shared types, context, and storage)*
2. `feat/auth-onboarding` *(Sets up user state and protected routes)*
3. `feat/dashboard-navigation` *(Sets up app layout and shell)*
4. `feat/expenses-module` *(Depends on layout and core data)*
5. `feat/budgets-module` *(Depends on expenses and core data)*
6. `feat/analytics-reports` *(Depends on all other data modules)*

---

## 🔄 GitHub Collaboration Flow

Each person should adhere to the following workflow:

1. **Checkout Main**: Ensure you are on the latest `main` branch.
   ```bash
   git checkout main
   git pull origin main
   ```
2. **Create Feature Branch**: Create your designated branch from `main`.
   ```bash
   git checkout -b <your-branch-name>
   ```
3. **Work in Owned Files**: To prevent merge conflicts, **strictly** edit only the files assigned to you. If you need a change in a shared file (outside your ownership), coordinate with the owner of that file or the Core/QA lead.
4. **Commit & Push**: Make atomic commits and push to the remote repository.
   ```bash
   git add .
   git commit -m "feat: your descriptive message"
   git push origin <your-branch-name>
   ```
5. **Open a Pull Request**: Go to GitHub and open a Pull Request (PR) against `main`. Do NOT merge immediately.
6. **Rebase/Pull Before Merge**: When it's your turn in the merge order, pull the latest `main` to resolve any potential conflicts locally before merging.
   ```bash
   git fetch origin
   git rebase origin/main
   # or
   git pull origin main
   ```
7. **Merge**: Once approved and conflicts are resolved, merge your PR.
