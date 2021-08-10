<h1 align="center">@zson-design/icons</h1>

<div align="center">

[![npm latest][1]][0] [![NPM downloads][2]][0]

zson Design Icons for React

</div>

## Install

use `npm`

```node
npm i @zson-design/icons
```

or use `yarn`

```node
yarn add @zson-design/icons
```

## Usage

```js
import React from 'react';
import { render } from 'react-dom';
import { Add, Keyboard, Search } from '@zson-design/icons';

const App = () => {
  return (
    <>
      <Add />
      <Keyboard />
      <Search />
    </>
  );
};

render(<App />, document.getElementById('root'));
```

> You can find all the icon components based on React [here](https://github.com/ZhongAnTech/zson/tree/master/packages/zson-icons/src/react).

## Component Interface

```ts
interface IconProps {
  className?: string;
  onClick?: React.MouseEventHandler<SVGSVGElement>;
  style?: React.CSSProperties;
}
```

[0]: https://www.npmjs.org/package/@zson-design/icons
[1]: https://img.shields.io/npm/v/@zson-design/icons.svg
[2]: https://img.shields.io/npm/dm/@zson-design/icons.svg
