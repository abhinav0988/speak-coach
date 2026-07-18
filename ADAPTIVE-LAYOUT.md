# Adaptive Layout Architecture

Speak Coach uses a **three-tier responsive shell** instead of squeezing desktop panels onto phones.

## Breakpoints

| Tier | Width | Tailwind | Hook |
|------|-------|----------|------|
| **Phone** | `< 768px` | `< md` | `useIsPhone()` |
| **Tablet** | `768–1023px` | `md` to `< lg` | `useIsTablet()` |
| **Desktop** | `≥ 1024px` | `lg+` | `useIsDesktop()` |

Use `useBreakpoint()` when you need the active tier as a string.

## Layout by Tier

### Phone (`< 768px`)

- **Bottom navigation** — 5 primary tabs (Practice, Dashboard, Learn, Progress, Coach)
- **Full-screen editor** — main page content uses the full viewport
- **Tree view as bottom sheet** — feature navigation (`SideNav`) opens from FAB or toolbar
- **Table view as full screen** — list-heavy routes (`/analytics`, `/vocabulary`, etc.) can expand to full screen
- **Floating action button** — opens the feature tree
- **AI assistant as bottom sheet** — quick coach panel without leaving the page
- **Collapsible floating toolbar** — secondary actions (tree, AI, table mode)

### Tablet (`768–1024px`)

- **Two-pane layout** — icon rail + optional tree pane + editor
- **Editor + tree** — resizable navigation pane beside main content
- **Slide-over panels** — AI assistant slides in from the right
- **Resizable split view** — drag handle adjusts tree/editor ratio (persisted in `localStorage`)

### Desktop (`> 1024px`)

- **Multi-panel workspace** — left nav rail, editor, optional AI/compare panel
- **Resizable editor / tree / table** — dashboard uses 3-panel layout with sticky AI
- **Compare side-by-side** — voice library before/after, paragraph diff views
- **Multi-document tabs** — command palette preview, dashboard quick modules

## Component Map

| Concept | Component | Phone | Tablet | Desktop |
|---------|-----------|-------|--------|---------|
| Feature tree | `SideNav` | Bottom sheet | Resizable pane | Overlay / dashboard rail |
| Main editor | `<main>` | Full screen | Flex pane | Center workspace |
| Table / lists | Page content | Full-screen mode | In editor pane | In workspace |
| AI assistant | `AdaptiveAIPanel` | Bottom sheet | Slide-over | `StickyAIPanel` |
| Quick actions | `FloatingToolbar` | Collapsible | Collapsible | Hidden (top bar) |
| Primary nav | `MobileBottomNav` | Bottom tabs | Icon rail | `DesktopTopBar` |

## File Structure

```
apps/web/src/
  components/adaptive/
    AdaptiveLayoutProvider.tsx  # Panel state (tree, AI, table, toolbar)
    AdaptiveChrome.tsx          # FAB, toolbar, bottom sheets orchestration
    BottomSheet.tsx             # Phone slide-up panels
    FloatingActionButton.tsx
    FloatingToolbar.tsx
    ResizableSplitView.tsx      # Tablet/desktop split panes
    TabletSidebarRail.tsx       # Tablet icon navigation
    AdaptiveAIPanel.tsx         # Lightweight AI quick panel
  hooks/useBreakpoint.ts        # Phone / tablet / desktop hooks
  lib/adaptive-layout.ts        # Breakpoint constants and helpers
  components/layout/AppShell.tsx # Shell orchestrator
```

## Usage in Pages

Most pages do not need changes — `AppShell` handles tier switching automatically.

For pages that need table full-screen mode, ensure the route is listed in `TABLE_ROUTES` inside `AdaptiveChrome.tsx`, or call:

```tsx
const { enterTableMode, exitTableMode, tableMode } = useAdaptiveLayout();
```

For custom split layouts on tablet/desktop:

```tsx
import { ResizableSplitView } from "@/components/adaptive";

<ResizableSplitView
  sidebar={<MyTreeNav />}
  main={<MyEditor />}
  aside={<MyAIPanel />}  // desktop only
/>
```

## Migration Notes

- Desktop breakpoint moved from **1200px → 1024px** (`lg`)
- Tablet (`768–1023px`) now has its own two-pane shell instead of sharing the phone layout
- All `min-[1200px]:` classes were migrated to `lg:`
- Dashboard 3-panel layout activates at `lg` (1024px+)

## Related Docs

- [`docs/COMPLETE_FLOW.md`](docs/COMPLETE_FLOW.md) — application flows
- [`CODE-REVIEW.md`](CODE-REVIEW.md) — review checklist including responsive behavior
- [`TESTING.md`](TESTING.md) — manual test plan for each tier
