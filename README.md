# svitore-react

![example branch parameter](https://github.com/vitlolik/svitore/actions/workflows/ci.yml/badge.svg?branch=master)
[![codecov](https://codecov.io/gh/vitlolik/svitore-react/branch/master/graph/badge.svg)](https://codecov.io/gh/vitlolik/svitore)

React binding for [svitore](https://github.com/vitlolik/svitore)

## Installation

```sh
npm i svitore svitore-react
```

## App examples

- [Github user search](https://codesandbox.io/p/sandbox/search-github-users-forked-93dh8n?file=%2Fsrc%2FApp.tsx)

## Usage

### useState

**Usual**

```js
import { useState } from "svitore-react";
import { countState, increment } from "./model";

const App = () => {
  const count = useState(countState);

  return <button onClick={() => increment.dispatch()}>count is {count}</button>;
};
```

**Advanced**

You can pass a selector function in the `useState`

```js
import { useState } from "svitore-react";
import { countState, increment } from "./model";

const App = () => {
  const count = useState(countState, (count) => count.toFixed(2));

  return <button onClick={() => increment.dispatch()}>count is {count}</button>;
};
```

### connect

```js
import { connect } from "svitore-react";
import { countState, increment } from "./model";
import { CountButton } from "./count-button";

const CountButtonConnected = connect(
  CountButton,
  { count: countState, increment },
  {
    onMount: (props) => {
      console.log("MOUNT", props);
    },
    onUnMount: (props) => {
      console.log("UNMOUNT", props);
    },
    onUpdate: (props, prevProps) => {
      console.log("ONUPDATE", { props, prevProps });
    },
  }
);

const App = () => {
  return <CountButtonConnected />;
};
```
