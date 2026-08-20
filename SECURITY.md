# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Privacy & Client-Side Execution

Relix processes database schemas and generates mock data entirely within your browser or your local Node.js environment:
- **Zero Schema Telemetry**: Your DDL schemas, table structures, and generated records are never sent to external servers unless you explicitly call authenticated cloud endpoints.
- **Deterministic Seeding**: Relix uses an isolated pseudo-random number generator (`mulberry32`) that runs locally without querying external random oracles.

## Reporting a Vulnerability

If you discover a potential security vulnerability in Relix, please report it responsibly by emailing **security@relix.dev**.

Please include:
- A detailed description of the issue and potential impact
- Clear reproduction steps or proof of concept
- Your environment details (Node version, OS, browser)

We will acknowledge receipt within 24 hours and provide an estimated timeline for resolution.
