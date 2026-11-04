# 05 Personal data and the DPDP Act 2023

Status: requirements from Sarthak's decision "DPDP basics needed" (4 Nov 2026). The detail below comes from general knowledge of the Digital Personal Data Protection Act 2023 and was not rechecked against the Act or the current Rules. The CA or counsel must confirm before launch, including which provisions are in force and their dates.

## What the site stores
| Data | Where | Source |
|---|---|---|
| Newsletter subscribers (email, consent, status) | Our Postgres | Decided |
| Form entries, if any form exists | Our Postgres | No form is decided yet. Home has none |
| Blog posts and image records | Our Postgres | Decided |
| Admin user (Sarthak) | Our Postgres, password hashed | Decided |
| Call booking details | Calendly, not our database | Calendly is a processor. Name it in the privacy notice |
| Newsletter emails | Free email provider (not chosen) | Processor. Name it in the privacy notice |

## Required behaviour
1. **Consent text at each form**, in plain language, stating what is collected, why, and how to withdraw. Not pre-ticked.
2. **Saved consent record** per person: email, exact consent text version, timestamp, source page. Keep the old text versions.
3. **Unsubscribe** in every email and on a page that works without logging in. Unsubscribing takes effect immediately and is recorded.
4. **Deletion on request**: a documented, working way to erase a person's data from the database and from backups-in-scope. Because backups are monthly dumps, state in the privacy notice how long a deleted record can survive in a backup.
5. **Breach process**: a short written runbook (who is told, in what order, who notifies the regulator and affected people). Sarthak owns it. The site cannot decide this.
6. **Privacy notice** naming data collected, purposes, processors (Calendly, the email provider, the hosting provider), retention, and how to reach the person responsible. Contact route is open because no email is shown on the site. Decide a route (for example a form).
7. **Data minimisation**: collect the email only. No names or phone numbers on the newsletter form.
8. **Security basics**: HTTPS only, parameterised queries, hashed admin password, rate limiting on public endpoints, secrets in environment variables, database not exposed to the internet, regular OS updates.
9. **No personal data in logs, error messages, fixtures or commits.**

## Open
- Retention period for subscribers and form entries.
- Who answers privacy requests, and by which route.
- Double opt-in for the newsletter (recommended, opinion; not decided).
- Where the monthly backup is stored, and who can read it. A backup holds personal data and must be access-controlled.
- Whether the privacy notice and terms are written by counsel or drafted here and reviewed. Drafts must say "Draft for review".
- Cookie and analytics policy: no analytics tool is chosen. Do not add trackers without Sarthak's approval.
