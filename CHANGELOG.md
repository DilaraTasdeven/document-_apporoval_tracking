# Changelog

All notable changes to this project are documented in this file.

## [1.4.3] - 2026-05-05
- Removed the manager detail text `Red sonrasi revize ile tekrar onaylanabilir` from `Yonetici Takip`.
- Replaced the named manager login with `admin / 12345678`.
- Migrated existing manager sessions to display `admin` in the top navigation.
- Kept generated employee passwords valid while allowing employees to set 8-character passwords with letters and numbers.
- Updated page version badges to `v1.4.3`.

## [1.4.2] - 2026-05-05
- Fixed quick decision note in `Onay Kutum` so clicking the note field no longer refreshes the request card.
- Quick approve/reject now preserves and applies the note written in the request card.
- Removed the account hint block from the bottom of the login form.
- Updated page version badges to `v1.4.2`.

## [1.4.1] - 2026-05-05
- Added random 8-digit employee passwords for existing and newly added employees.
- Updated employee login to validate against per-employee passwords instead of a shared default.
- Added `Bilgi` action in manager-side `Calisan Yonetimi` to reveal each employee password.
- Added employee `Sifre Degistir` action in the top navigation.
- Kept employee password changes synchronized with manager password info.
- Updated page version badges to `v1.4.1`.

## [1.4.0] - 2026-05-05
- Added login page `giris.html` and shared auth module `auth.js`.
- Added fixed manager credentials for the manager role.
- Replaced user selector on `index.html` with session-based logged-in employee identity.
- Implemented role-based access and navigation visibility:
- Manager sees only `Talep Olustur` and `Yonetici Takip`.
- Employee sees only `Onay Kutum` and `Talep Olustur`.
- Added protected-page redirects to `giris.html` when session is missing or unauthorized.
- Added `Cikis` action to top navigation on protected pages.
- Updated page version badges to `v1.4.0`.

## [1.3.1] - 2026-05-05
- Renamed manager-side worker section to `Calisan Yonetimi`.
- Replaced large inline management block with a compact modal window opened via button.
- Removed manager ability to add/remove departments from UI; management now focuses on employees only.
- Kept employee add/remove per selected department and preserved persistence in `onay-zinciri-organizasyon`.
- Updated page version badges to `v1.3.1`.

## [1.3.0] - 2026-05-05
- Added organization management block to `yonetici-paneli.html`:
- Add/remove department
- Add/remove person under selected department
- Persisted organization data in `localStorage` using `onay-zinciri-organizasyon`.
- Connected `talep-olustur.html` department/person dropdowns to managed organization data.
- Added validation to prevent adding approval step when selected department has no person.
- Updated page version badges to `v1.3.0`.

## [1.2.4] - 2026-05-05
- Removed the explicit `Kural` text block from user approval detail panel.
- Updated user card status label from `Sende Bekliyor` to `Bekleyen Onay`.
- Added returned-request label and color: `Revize Bekleniyor` for rollback/revision flows.

## [1.2.3] - 2026-05-05
- Refined rollback visibility rule in user approval flow.
- Rejection reason is now shown only up to (and including) the rejecting step.
- After the rejecting approver re-approves, return-reason context is cleared so later steps do not see the rejection reason.
- Updated page version badges to `v1.2.3`.

## [1.2.2] - 2026-05-05
- Added rollback rule for rejections after step 1 in user panel workflow.
- When a later step rejects, the request returns to previous approvers sequentially with the rejection reason.
- Added `returnContext` tracking in request model for return-flow metadata.
- Synced manager panel to display active return reason and current holder correctly during rollback.
- Updated page version badges to `v1.2.2`.

## [1.2.1] - 2026-05-05
- Converted `index.html` into a true user action panel (`Onay Kutum`) focused on assigned pending requests.
- Added direct in-card quick actions (`Onayla` / `Reddet`) with optional note for faster status updates.
- Kept detail-side approval controls for selected request and preserved full chain visibility.
- Added separate manager monitoring page: `yonetici-paneli.html` (without removing user panel).
- Updated top navigation across pages to include user panel, request creation, and manager tracking.
- Updated page version badges to `v1.2.1`.

## [1.1.1] - 2026-05-05
- Removed `Taslagi Kaydet` button from `talep-olustur.html`.
- Removed unused draft save/load logic to avoid confusion.
- Kept auto preview and `Onay Surecini Baslat` as the primary flow.
- Updated on-page version badges to `v1.1.1` on both pages.

## [1.1.0] - 2026-05-05
- Added bottom-right version badge on both pages.
- Removed "Ornek Rota Doldur" button from request creation page.
- Reworked preview behavior to render reliably without blocking alerts.
- Added "Onay Surecini Baslat" button to create active approval requests.
- Linked request creation and tracking pages via localStorage (`onay-zinciri-aktif-talepler`).
- Added reject policy note: rejected requests can be revised and re-submitted.

## [1.0.0] - 2026-05-05
- Created `index.html` for digital approval chain tracking.
- Added request list, approval timeline, status indicators, and filters.
- Created `talep-olustur.html` for request creation and approval route definition.
- Added responsive layout improvements for different screen sizes.
- Added top navigation links between `index.html` and `talep-olustur.html`.
- Removed JSON/code preview block from request creation page.
- Stored release snapshot under `versions/v1.0.0/`.
