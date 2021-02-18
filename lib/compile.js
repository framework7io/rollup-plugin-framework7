const getScript = require('./get-script');
const getStyle = require('./get-style');
const getTemplate = require('./get-template');

module.exports = ({ source, emitCss, id, cacheEmit }) => {
  const { template } = getTemplate({ source });
  // Parse Styles
  const { style } = getStyle({ source });
  // Parse Script
  const script = getScript({
    source,
    template,
    style,
    emitCss,
    id,
    cacheEmit,
  });
  return script;
};
