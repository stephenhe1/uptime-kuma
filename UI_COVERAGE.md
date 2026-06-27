# UI Coverage (Progress: 25/29)
Legend: [ ] not yet tested  -  [x] test written and passing  -  [~] intentionally skipped (reason)

## Setup & Onboarding
- [x] /setup - Admin account creation form (username, password, repeat, language, create button)
- [x] /setup-database - Database selection form (SQLite / MariaDB/MySQL, language, next button)

## Public Pages (no socket required)
- [x] /status-page - Public status page (empty state, no monitors configured)
- [x] /status - Public status alias page (empty state)
- [x] /status/:slug - Status page by slug (renders or shows not found)

## 404 / Error Pages
- [x] /:pathMatch(.*)*  - Not Found page (renders with error and navigation links)

## Dashboard & Monitor Views (socket error shown, layout renders)
- [x] / (Entry) - Redirects to /dashboard (entry page redirect flow)
- [x] /dashboard - Dashboard home (shows socket error banner)
- [~] /dashboard/:id - Monitor details (skipped: requires existing monitor with numeric ID)
- [x] /list - Monitor list view (socket error banner)
- [x] /add - Add monitor form (socket error banner)
- [~] /add/clone/:id - Clone monitor (skipped: requires existing monitor)

## Maintenance Pages
- [x] /maintenance - Manage maintenance windows (socket error banner)
- [x] /add-maintenance - Add maintenance window (socket error banner)
- [~] /maintenance/edit/:id - Edit maintenance (skipped: requires existing maintenance)
- [~] /maintenance/clone/:id - Clone maintenance (skipped: requires existing maintenance)

## Status Page Management
- [x] /manage-status-page - Manage status pages (socket error banner)
- [x] /add-status-page - Create new status page (socket error banner)

## Settings Pages (all require auth + socket)
- [x] /settings/general - General settings (socket error banner)
- [x] /settings/appearance - Appearance/theme settings (socket error banner)
- [x] /settings/notifications - Notification settings (socket error banner)
- [x] /settings/reverse-proxy - Reverse proxy config (socket error banner)
- [x] /settings/tags - Tag management (socket error banner)
- [x] /settings/monitor-history - Monitor history (socket error banner)
- [x] /settings/docker-hosts - Docker hosts (socket error banner)
- [x] /settings/remote-browsers - Remote browsers (socket error banner)
- [x] /settings/security - Security settings (socket error banner)
- [x] /settings/api-keys - API key management (socket error banner)
- [x] /settings/proxies - Proxy configuration (socket error banner)
- [x] /settings/about - About page (socket error banner)

## Cross-Cutting Concerns (covered in dedicated spec files)
- [x] App theming (light theme class on body)
- [x] Header layout with Uptime Kuma branding
- [x] Socket error banner structure and content
- [x] Form validation (setup page HTML5 required validation)
- [x] Form interactivity (database type selection, SSL toggle)
- [x] Accessibility (meta tags, labels, focus management)
- [x] Navigation links (404 page links, title link routing)
