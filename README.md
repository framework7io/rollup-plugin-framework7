# Rollup Framework7 Component Loader

> Rollup & Vite plugin to load Framework7 single file components

## What is Framework7 Component Loader?

`rollup-plugin-framework7` is a plugin for [Rollup](https://rollupjs.org/guide/en/) and [Vite](https://vitejs.dev) that allows you to author [Framework7 Router components](http://framework7.io/docs/router-component.html) in a format called [Single-File Components](http://framework7.io/docs/router-component.html#single-file-component):

```html
<!-- my-page.f7.html -->
<template>
  <div class="page">${msg}</div>
</template>

<script>
  export default () => {
    const msg = 'Hello world';

    return $render;
  };
</script>
```

## Usage with Rollup

Install the plugin itself:

```
npm i rollup-plugin-framework7 --save-dev
```

If we use JSX component, then we also need to install Babel plugins:

```
npm i @rollup/plugin-babel @babel/preset-react @babel/preset-env --save-dev
```

Configure rollup:

```js
const { rollup } = require('rollup');
const { babel } = require('@rollup/plugin-babel');
const framework7 = require('../lib/index');
rollup({
  input: './path/to/app.js',
  plugins: [
    // enable Framework7 plugin
    // it will will process .f7.html and .f7.js(x) files
    framework7({ emitCss: true }),

    // css plugin for bundling content of component styles (`<style>`)
    css({ output: 'app-bundle.css' }),

    // babel plugin if you use JSX components
    babel({
      presets: [
        '@babel/preset-react',
        [
          '@babel/preset-env',
          {
            modules: false,
          },
        ],
      ],
    }),
  ],
});
```

## Usage with Vite

Install the plugin:

```
npm i rollup-plugin-framework7 --save-dev
```

In Vite config (`vite.config.js`):

```js
import framework7 from 'rollup-plugin-framework7';

export default {
  esbuild: {
    jsxFactory: '$jsx',
  },
  plugins: [framework7({ emitCss: false })],
};
```

## JSX

Framework7 v6 single file components also support JSX:

```html
<!-- my-page.f7.html -->
<script>
  export default () => {
    const msg = 'Hello world';

    return () => <div class="page">{msg}</div>;
  };
</script>
```

```js
// my-page.f7.js

export default () => {
  const msg = 'Hello world';

  return () => <div class="page">{msg}</div>;
};
```
