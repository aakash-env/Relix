# Relix — Realistic Database Seed Generator

[![CI](https://github.com/relix-dev/relix/actions/workflows/ci.yml/badge.svg)](https://github.com/relix-dev/relix/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

> **Generate realistic, relational seed data for your AI SaaS database** — connected users, organizations, conversations, messages, token usage, credits, subscriptions, and invoices — exported as a ready-to-run TypeScript seed script.

---

## 🌟 Key Features

- 🔗 **Relationship-Aware Generation**: Automatically parses PostgreSQL DDL, maps foreign key relationships into a directed acyclic graph (DAG), and executes Kahn's topological sort so parents always exist before children.
- ⚡ **Framework-Ready Exports**: Export directly to **TypeScript (Drizzle ORM)**, **TypeScript (Prisma)**, **SQL INSERT**, **JSON**, or **CSV**.
- 🎲 **Deterministic Seeding**: Powered by a 32-bit `mulberry32` PRNG. Identical seed numbers produce bit-for-bit identical datasets across team members and CI runs.
- 🤖 **Built-In AI SaaS Domain Preset**: Pre-configured with realistic users, multi-tenant organizations, membership roles, plans, subscriptions, AI models, conversation threads, message histories, and token consumption metrics.
- 🛡️ **Client-Side & Privacy First**: Schema parsing and seed generation execute completely within your client browser. No production data or database credentials leave your machine.
- 🧪 **Pre-Export Validation**: Built-in validation engine checks foreign key referential integrity, NOT NULL constraints, unique indices, string length limits, and enum conformance before exporting.

---

## 🚀 Quick Start

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/relix-dev/relix.git
cd relix-app
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Test Suite

```bash
npm test
```

---

## 🧱 Architecture & Project Structure

```
relix-app/
├── public/
│   └── images/              # Hero & atmospheric background assets
├── src/
│   ├── app/
│   │   ├── (marketing)/     # Editorial marketing pages (Hero, Features, Pricing, Docs)
│   │   ├── (auth)/          # Authentication (Login, Signup, Reset Password, Verify)
│   │   ├── (dashboard)/     # Workspace, Schema Editor, Generator, Preview, Settings
│   │   └── api/             # REST endpoints (/api/generate, /api/export, /api/schema/parse)
│   ├── components/
│   │   ├── marketing/       # Editorial hero, interactive preview, pricing toggles
│   │   ├── dashboard/       # Collapsible sidebar, workspace shell, status indicators
│   │   └── ui/              # Accessible design system primitives (Radix UI + Tailwind)
│   ├── config/              # Centralized marketing asset paths and app metadata
│   ├── lib/
│   │   ├── db/              # Drizzle ORM schema and database client
│   │   └── engine/          # Core generation engine
│   │       ├── parser.ts           # PostgreSQL DDL AST parser
│   │       ├── dependency-graph.ts # DAG builder & Kahn's topological sort
│   │       ├── generator.ts        # Seeded PRNG & realistic entity synthesis
│   │       ├── validator.ts        # Referential integrity & constraint verification
│   │       ├── exporter.ts         # Multi-format code generator
│   │       └── presets/            # Domain presets (AI SaaS, E-commerce, Multi-tenant)
│   └── types/               # TypeScript domain models
└── tests/
    └── unit/                # Vitest unit test suites
```

---

## 💻 API Usage

You can also use Relix programmatically via HTTP:

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "schema": "CREATE TABLE users (id UUID PRIMARY KEY, name TEXT, email VARCHAR(255) UNIQUE);",
    "seed": 42,
    "counts": { "users": 25 }
  }'
```

---

## 📜 License

MIT © Relix Team
