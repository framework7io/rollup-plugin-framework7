const transformScript = require('./transform-script');

module.exports = ({ source, template, style, emitCss, id, cacheEmit }) => {
  let code = '';
  const isJSComponent = id.includes('.f7.js');

  if (isJSComponent) {
    code = `/** @jsx $jsx */\nimport { $jsx } from 'framework7';\n${source}`;
  } else {
    // Parse Script
    let script;
    if (source.indexOf('<script>') >= 0) {
      const scripts = source.split('<script>');
      script = scripts[scripts.length - 1].split('</script>')[0].trim();
    } else {
      script = 'export default () => { return $render }';
    }
    if (!script || !script.trim()) script = 'export default { return $render }';

    code = transformScript({
      script,
      template,
      style,
      id,
      emitCss,
    });
  }

  if (emitCss && style) {
    const fname = id
      .replace('.f7.html', '.css')
      .replace('.f7.jsx', '.css')
      .replace('.f7.js', '.css')
      .replace('.f7', '.css');
    code += `\nimport ${JSON.stringify(fname)};\n`;
    cacheEmit.set(fname, style);
  }

  return code;
};
