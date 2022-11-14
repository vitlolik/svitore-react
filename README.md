# svitore-react

React binding for [svitore](https://github.com/vitlolik/svitore) state

## Description

Provides a single `useState` function for subscribe and getting the state

## Installation

```sh
npm i svitore svitore-react
```

## Example

### Usual

```js
// model.ts
import { State, Event } from 'svitore';

export const incrementEvent = new Event();

export const $count = new State(0)
  .on(incrementEvent, (, state) => state + 1);
```

```js
// Component.ts
import { useState } from "svitore-react";
import { $count, incrementEvent } from "./model";

const App = () => {
  const count = useState($count);

  return (
    <button onClick={() => incrementEvent.fire()}>count is {count}</button>
  );
};
```

### Advanced

You can pass a selector function in the `useState`

```js
// Component.ts
import { useState } from "svitore-react";
import { $count, incrementEvent } from "./model";

const App = () => {
  // count will be something like this: 0.00, 1.00, 2.00, ...
  const count = useState($count, (count) => count.toFixed(2));

  return (
    <button onClick={() => incrementEvent.fire()}>count is {count}</button>
  );
};
```
