# Architect Browser Assistant

Planned Chrome extension repository for the Architect SaaS workspace.

The implementation direction is Chromex-inspired, but this repository is currently only initialized for planning and future development. Keep it separate from `architect-saas`:

```text
D:\architect-workspace\
  architect-saas\
  architect-browser-assistant\
```

Future implementation should preserve the SaaS boundary:

- The extension owns browser UI, page context collection, native bridge/local login integration, and calls to SaaS APIs.
- The SaaS app owns authentication, permissions, database access, retrieval, grounded assistant responses, and audit/rate-limit policy.
- The extension must not connect directly to the production database.
