# svitore-react

![example branch parameter](https://github.com/vitlolik/svitore/actions/workflows/ci.yml/badge.svg?branch=master)

React binding for [svitore](https://github.com/vitlolik/svitore)

## Description

Provides a single `useState` function for subscribe and getting the state

## Installation

```sh
npm i svitore svitore-react
```

## App examples

- [Github user search](https://codesandbox.io/p/sandbox/search-github-users-forked-93dh8n)

## Usage

### Usual

```js
// model.ts
import { State, Event } from "svitore";

export const increment = new Event();

export const countState = new State(0);

increment.listen(() => countState.change((state) => state + 1));
```

```js
// Component.ts
import { useState } from "svitore-react";
import { countState, increment } from "./model";

const App = () => {
  const count = useState(countState);

  return <button onClick={() => increment.dispatch()}>count is {count}</button>;
};
```

### Advanced

You can pass a selector function in the `useState`

```js
// Component.ts
import { useState } from "svitore-react";
import { countState, increment } from "./model";

const App = () => {
  // count will be something like this: 0.00, 1.00, 2.00, ...
  const count = useState(countState, (count) => count.toFixed(2));

  return <button onClick={() => increment.dispatch()}>count is {count}</button>;
};
```
