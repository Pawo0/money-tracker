# Money Tracker — UI direction

A quiet, English-language expense workspace. Primary task: understand monthly spending and quickly add an expense.

Reference: Linear's product UI design notes (https://linear.app/now/how-we-redesigned-the-linear-ui): neutral layers, consistent navigation, restrained visual hierarchy. Adapted for personal spending, not copied.

- Graphite canvas, slightly lighter surfaces, fine neutral borders; mint for actions and spending chart.
- One desktop sidebar, compact page header, three useful monthly metrics, spending curve, category breakdown, transaction table.
- Real expense totals use absolute values of negative transactions; positive transactions remain income. No invented budget or bank balance.
- Guest preview is explicitly marked as sample data. A demo workspace supports local additions and deletions without authentication; real account writes require Google authentication. Demo data can be reset or cleared and never reaches MongoDB.
- English copy, PLN formatting, consistent 8–16px spacing, 10–14px corners, tabular amounts.
- Mobile: bottom navigation, stacked analytics, transaction rows with secondary date; no horizontal page overflow.
- States: loading skeleton, empty transactions/categories, failed fetch with retry, form success/error, disabled submit, accessible category dialog and visible keyboard focus.
