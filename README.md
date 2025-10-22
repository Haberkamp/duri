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

```ts
const time = Duration.seconds(5);

const timeInMilliseconds = time.toMilliseconds(); // 5_000 milliseconds
```

## Feedback and Contributing

I highly appreceate your feedback! Please create an [issue](https://github.com/Haberkamp/typed-storage/issues/new), if you've found any bugs or want to request a feature.
