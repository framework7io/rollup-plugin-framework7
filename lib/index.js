/* eslint-disable camelcase */
/* eslint-disable global-require */
/* eslint-disable consistent-return */
/* eslint-disable import/no-dynamic-require */

const path = require('path');
const relative = require('require-relative');
const { createFilter } = require('@rollup/pluginutils');
const compile = require('./compile');

const pkgExportErrors = new Set();

function plugin(options = {}) {
  const { emitCss = false } = options;

  const filter = createFilter(options.include, options.exclude);

  const cacheEmit = new Map();

  return {
    /**
     * Resolve an import's full filepath.
     */
    resolveId(importee, importer) {
      if (cacheEmit.has(importee)) return importee;
      if (
        !importer ||
        importee[0] === '.' ||
        importee[0] === '\0' ||
        path.isAbsolute(importee)
      )
        return null;

      // if this is a bare import, see if there's a valid pkg.svelte
      const parts = importee.split('/');

      let dir;
      let pkg;
      let name = parts.shift();
      if (name && name[0] === '@') {
        name += `/${parts.shift()}`;
      }

      try {
        const file = `${name}/package.json`;
        const resolved = relative.resolve(file, path.dirname(importer));
        dir = path.dirname(resolved);
        pkg = require(resolved);
      } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') return null;
        if (err.code === 'ERR_PACKAGE_PATH_NOT_EXPORTED') {
          pkgExportErrors.add(name);
          return null;
        }
        throw err;
      }

      // use pkg.svelte
      if (parts.length === 0 && pkg.svelte) {
        return path.resolve(dir, pkg.svelte);
      }
    },

    /**
     * Returns CSS contents for a file, if ours
     */
    load(id) {
      return cacheEmit.get(id) || null;
    },

    /**
     * Transforms a `.f7.html` file into a `.js` file.
     * NOTE: If `emitCss`, append static `import` to virtual CSS file.
     */
    async transform(source, id) {
      if (!filter(id)) return null;

      if (!id.includes('.f7.js') && !id.includes('.f7.html')) return null;

      const code = compile({ source, emitCss, id, cacheEmit });
      return code;
    },
  };
}
module.exports = plugin;
