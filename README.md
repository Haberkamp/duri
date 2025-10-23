# @roving-focus/react

<!-- ![CI passing](https://github.com/Haberkamp/roving-focus/actions/workflows/ci.yml/badge.svg?event=push&branch=main) -->

![Created by](https://img.shields.io/badge/created%20by-@n__haberkamp-065afa.svg)
![NPM License](https://img.shields.io/npm/l/duri)

## Overview

Many functions that require a duration, require passing just a number value. This makes it to find out if the duration is in seconds, milliseconds or other.

```ts
sleep(1_000); // are these seconds? milliseconds?
```

```ts
sleep(Duration.seconds(1).toMilliseconds());

// OR

sleep(Duration("1 second").toMilliseconds());
```

### Author

Hey, I'm Nils. In my spare time [I write about things I learned](https://www.haberkamp.dev/) or I [create open source packages](https://github.com/Haberkamp), that help me (and hopefully you) to build better apps.

## Installation

You can install this package with any package manager you like.

```bash
pnpm add duri
```

## Usage

### Static Factory Methods

```ts
const time = Duration.seconds(5);
const timeInMilliseconds = time.toMilliseconds(); // 5_000 milliseconds
```

### Natural Language Parsing

```ts
// Callable factory with string input
const duration = Duration("5 seconds");
duration.toSeconds(); // 5

// Compact forms (no space)
Duration("1s"); // 1 second
Duration("500ms"); // 500 milliseconds
Duration("10m"); // 10 minutes
Duration("2h"); // 2 hours

// Aliases supported (case-insensitive)
Duration("5 sec");
Duration("10 min");
Duration("2 hr");
Duration("500 milliseconds");

// Decimals and underscores
Duration("1.5 hours"); // 1.5 hours
Duration("1_000 seconds"); // 1000 seconds

// Whitespace is flexible
Duration("  5   seconds  ");
```

### Numeric Constructor

```ts
// Direct numeric input (seconds)
const duration = new Duration(5); // 5 seconds
```

### Constraints

- **English only**: US spelling (`second`, `seconds`, not `secs`)
- **Single unit**: Multi-unit strings like `"1 hour 30 minutes"` are not supported
- **No negatives**: Negative durations will throw `TypeError`
- **Unit required**: Bare numbers like `"5"` will throw `TypeError`
- **Supported units**:
  - Milliseconds: `ms`, `millisecond`, `milliseconds`
  - Seconds: `s`, `sec`, `second`, `seconds`
  - Minutes: `m`, `min`, `minute`, `minutes`
  - Hours: `h`, `hr`, `hour`, `hours`

### Error Handling

```ts
// These throw TypeError:
Duration("5"); // No unit
Duration("-5 seconds"); // Negative
Duration("1,000 seconds"); // Comma separator
Duration("5 days"); // Unsupported unit
Duration("1h30m"); // Multi-unit
```

## Feedback and Contributing

I highly appreceate your feedback! Please create an [issue](https://github.com/Haberkamp/typed-storage/issues/new), if you've found any bugs or want to request a feature.
