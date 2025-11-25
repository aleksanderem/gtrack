# SEO Audits

The SEO Audit feature provides a technical analysis of the user's website to identify issues that might affect local ranking.

## Workflow

1.  **Trigger**: User clicks "Skanuj stronę" in **Business Settings**.
2.  **Action**: The frontend calls `seo.runAuditAction` with the website URL.
3.  **External API**: The backend sends a request to DataForSEO's On-Page API (`v3/on_page/task_post`).
4.  **Persistence**:
    - A new record is created in `seoAudits` with status `pending`.
    - Once DataForSEO responds, the record is updated to `completed` with the full JSON result.
5.  **Display**: The frontend (`SeoAuditDialog.vue`) displays the results, categorized by severity (High, Medium, Low).

## Data Points

The audit captures:
- **Meta Tags**: Title, Description checks.
- **Performance**: Load times, page size.
- **Images**: Alt tags, broken links.
- **Content**: Keyword density (used for suggestions).

## Limits
Audits are expensive operations, so they are limited by plan:
- **Basic**: 5 / month
- **Professional**: 20 / month
- **Enterprise**: Unlimited
