# repl-driven-js

Demonstration of doing REPL-driven development on the web with JS

## Summary

![Demo](demo/summary.gif)

## Set-up

You need a modern browser as this approach only works with modern ES features (e.g. `import()`).

1. Install Spacemacs (https://www.spacemacs.org/)
2. In Spacemacs, install the `javascript` layer (_animation_)

## Problem 1: Every Time I Re-evaluate, State gets Duplicated!

- Demonstrate: By calling `load()` (without state checking logic twice and showing that DOM elements, timers, etc get duplicated)
- Solution: Use `window.state`

## Problem 2: Re-evaluating the onInterval() Function does not Affect the Existing Interval!

- Demonstrate: `setInterval(onInterval, 1000);`. This causes the issue
- Solution: `setInterval(() => { onInterval(); }, 1000);` _TODO: I intuitively expected this but I don't know the actual reason_

## Problem 3: How to Import External Libraries?

We can't use CommonJS `require()` as that isn't supported on the web.

We can't use static `import .. from ..` declarations. These cannot be used in a REPL.

So, let's use [Dynamic imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#Dynamic_Imports). This is a native import that can be used anywhere in a program's flow. It loads the module asynchronously, returning it in a `Promise`.

Because this is dynamic, it means we can update our code's dependencies while the app is still running.

This looks like:

```js
async function importLibs() {
  const { default: moment } = await import('https://cdn.pika.dev/moment@2.26.0');
  state.libs = {
    moment,
  };
}
```

If we want to add another dependency, we can easily add it to this function e.g.:

```js
async function importLibs() {
  const { default: moment } = await import('https://cdn.pika.dev/moment@2.26.0');
  const { default: regl } = await import('https://cdn.pika.dev/regl@1.5.0'); // <-- new line
  state.libs = {
    moment,
  };
}
```

Re-evaluate the `importLibs()` function with `SPC m s r` and the new dependencies will immediately become available to your running app.

## skewer-mode issues

If skewer-mode does not work for you, you might be experiencing this issue: https://github.com/skeeto/skewer-mode/issues/18

This happened to me. There must have been some package conflict issue with existing packages. I fixed it by doing a clean re-install of Spacemacs:

```sh
# Backup Emacs / Spacemacs
mv .emacs .emacs.backup
mv .spacemacs .spacemacs.backup
# Re-install (https://www.spacemacs.org/#)
git clone https://github.com/syl20bnr/spacemacs ~/.emacs.d
```

