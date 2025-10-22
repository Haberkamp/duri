# New npm package (TS, Prettier, ESLint unicorn+perfectionist, Vitest, CI)

## Overview

Scaffold ESM TS lib with opinionated tooling, CI, and type-quality check (attw).

## Current State Analysis

Empty repo. No tooling.

## Desired End State

Publishable ESM package: formatted, linted, type-checked, tested, CI green, `dist/` types, `attw` clean.

### Key Discoveries

- Baseline settings adapt from Total TypeScript guide. See reference.
- Use ESLint flat config, Vitest node env, `exports` map, `types` field.

## What We're NOT Doing

No Changesets/publishing, no bundler, no CJS, no React, no monorepo.

## Implementation Approach

Incremental: init → tsconfig → Prettier → ESLint → Vitest → CI → sample code/tests → attw.

---

## Phase 1: Init + package.json

### Overview

Init repo, author fields, scripts, exports, files.

### Changes Required:

#### 1. package.json

**File**: `package.json`
**Changes**: create

```json
{
  "name": "@your-scope/your-package",
  "version": "0.0.0",
  "description": "...",
  "keywords": [],
  "license": "MIT",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "clean": "rimraf dist",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier . -w",
    "format:check": "prettier . -c",
    "attw": "attw --pack .",
    "ci": "npm run lint && npm run typecheck && npm run test && npm run format:check && npm run attw",
    "prepublishOnly": "npm run ci && npm run build"
  },
  "engines": { "node": ">=18" }
}
```

#### 2. .gitignore

**File**: `.gitignore`
**Changes**: create

```gitignore
node_modules
dist
coverage
.DS_Store
```

#### 3. Install dev deps

**Command**:

```bash
npm i -D typescript @types/node rimraf prettier eslint @eslint/js typescript-eslint eslint-plugin-unicorn eslint-plugin-perfectionist vitest @vitest/coverage-v8 @arethetypeswrong/cli
```

### Success Criteria:

#### Automated Verification:

- [x] `npm pkg get name` returns your name
- [x] `npm run ci` succeeds (after later phases)

#### Manual Verification:

- [x] `npm pack` succeeds (later, after build)

---

## Phase 2: TypeScript config

### Overview

Strict TS for libs, ESM NodeNext, d.ts emit.

### Changes Required:

#### 1. tsconfig.json

**File**: `tsconfig.json`
**Changes**: create

```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "skipLibCheck": true,
    "target": "ES2022",
    "allowJs": false,
    "resolveJsonModule": true,
    "moduleDetection": "force",
    "isolatedModules": true,
    "verbatimModuleSyntax": true,

    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,

    "module": "NodeNext",
    "outDir": "dist",
    "rootDir": "src",
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true
  },
  "include": ["src", "vitest.config.ts"]
}
```

### Success Criteria:

#### Automated Verification:

- [x] `npm run typecheck` passes

#### Manual Verification:

- [x] `dist/*.d.ts` generated after build

---

## Phase 3: Prettier

### Overview

Formatting and CI check.

### Changes Required:

#### 1. .prettierrc.json

**File**: `.prettierrc.json`
**Changes**: create

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

#### 2. .prettierignore

**File**: `.prettierignore`
**Changes**: create

```text
dist
coverage
```

### Success Criteria:

#### Automated Verification:

- [x] `npm run format:check` passes

#### Manual Verification:

- [x] Files auto-format on save (editor)

---

## Phase 4: ESLint (typescript-eslint, unicorn, perfectionist)

### Overview

Flat config, Node + TS rules, import/object sorting.

### Changes Required:

#### 1. eslint.config.js

**File**: `eslint.config.js`
**Changes**: create

```js
// @ts-check
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import unicorn from "eslint-plugin-unicorn";
import perfectionist from "eslint-plugin-perfectionist";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    plugins: {
      unicorn,
      perfectionist,
    },
    rules: {
      // unicorn
      "unicorn/prefer-node-protocol": "error",
      "unicorn/no-abusive-eslint-disable": "error",
      // perfectionist
      "perfectionist/sort-objects": ["warn", { type: "natural", order: "asc" }],
      "perfectionist/sort-imports": [
        "warn",
        {
          type: "natural",
          order: "asc",
          groups: [
            ["type"],
            ["builtin", "external"],
            ["internal"],
            ["parent", "sibling", "index"],
            ["side-effect"],
            ["unknown"],
          ],
          newlinesBetween: "always",
          internalPattern: ["~**", "@/**"],
        },
      ],
    },
  },
];
```

### Success Criteria:

#### Automated Verification:

- [x] `npm run lint` passes

#### Manual Verification:

- [x] Autofix sorts imports/objects

---

## Phase 5: Vitest (Node)

### Overview

Node test env + coverage.

### Changes Required:

#### 1. vitest.config.ts

**File**: `vitest.config.ts`
**Changes**: create

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    coverage: { reporter: ["text", "lcov"] },
  },
});
```

#### 2. Example test

**File**: `src/index.test.ts`
**Changes**: create

```ts
import { describe, expect, it } from "vitest";
import { sum } from "./index.js";

describe("sum", () => {
  it("adds", () => {
    expect(sum(1, 2)).toBe(3);
  });
});
```

### Success Criteria:

#### Automated Verification:

- [x] `npm run test` passes

#### Manual Verification:

- [x] Coverage output present

---

## Phase 6: Sample source

### Overview

Tiny API to validate pipeline.

### Changes Required:

#### 1. src/index.ts

**File**: `src/index.ts`
**Changes**: create

```ts
export function sum(a: number, b: number): number {
  return a + b;
}
```

### Success Criteria:

#### Automated Verification:

- [x] `npm run build` emits `dist/`

#### Manual Verification:

- [x] `node -e "import('./dist/index.js').then(m=>console.log(m.sum(1,2)))"` prints 3

---

## Phase 7: CI (GitHub Actions)

### Overview

Node matrix, cache, run checks.

### Changes Required:

#### 1. .github/workflows/ci.yml

**File**: `.github/workflows/ci.yml`
**Changes**: create

```yaml
name: ci
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node: [18, 20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test
      - run: npm run format:check
      - run: npm run attw
      - run: npm run build
```

### Success Criteria:

#### Automated Verification:

- [ ] CI succeeds on PR

#### Manual Verification:

- [ ] Badge green

---

## Testing Strategy

- **Unit**: pure funcs, error paths, edge inputs
- **Integration**: N/A (lib)
- **Manual**: import from `node -e`, check types in editor

## Performance Considerations

None (small lib). Keep ESM, no bundling.

## Migration Notes

None.

## References

- Total TypeScript: How To Create An NPM Package — `https://www.totaltypescript.com/how-to-create-an-npm-package`
