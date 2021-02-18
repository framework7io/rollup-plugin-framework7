const { rollup } = require('rollup');
const { babel } = require('@rollup/plugin-babel');
const css = require('rollup-plugin-css-only');
const framework7 = require('../lib/index');

rollup({
  input: './test/app.js',
  plugins: [
    framework7({ emitCss: true }),
    css({ output: 'app-bundle.css' }),
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
  external: ['framework7'],
}).then((bundle) =>
  bundle.write({
    format: 'esm',
    file: `./test/app-bundle.js`,
  }),
);
