const babel = require('@babel/core');

function transformToAst(code) {
  const { ast } = babel.transformSync(code, {
    ast: true,
  });
  return ast;
}

function transformFromAst(ast) {
  const { code } = babel.transformFromAst(ast, '', {});
  return code;
}

function generateId(mask = 'xxxxxxxxxx', map = '0123456789abcdef') {
  const length = map.length;
  return mask.replace(/x/g, () => map[Math.floor(Math.random() * length)]);
}

module.exports = ({ script, template, style, emitCss, id: fileName }) => {
  let astExtend;
  const isJSComponent = fileName.includes('.f7.js');
  const id = generateId();
  const astExtendFunction = `
    function {{COMPONENT_NAME}}(props, ctx) {
      
    }
    {{COMPONENT_NAME}}.id = '${id}';
    ${
      style && !emitCss
        ? `
    {{COMPONENT_NAME}}.style = \`${style}\`;
    `.trim()
        : ''
    }
    
    export default {{COMPONENT_NAME}};
  `;

  const ast = transformToAst(
    `${
      isJSComponent
        ? `/** @jsx $jsx */\nimport { $jsx } from 'framework7';\n`
        : ''
    }${script}`,
  );

  ast.program.body.forEach((node, index) => {
    if (node.type === 'ExportDefaultDeclaration') {
      if (
        node.declaration &&
        (node.declaration.type === 'ArrowFunctionExpression' ||
          node.declaration.type === 'FunctionDeclaration')
      ) {
        astExtend = transformToAst(
          astExtendFunction.replace(
            /{{COMPONENT_NAME}}/g,
            'framework7Component',
          ),
        );
        astExtend.program.body[0].params = node.declaration.params;
        astExtend.program.body[0].body = node.declaration.body;
        ast.program.body.splice(index, 1, ...astExtend.program.body);
      }
    }
  });

  const code = transformFromAst(ast).replace(
    '$render',
    `function ($$ctx) {
      var $ = $$ctx.$$;
      var $h = $$ctx.$h;
      var $root = $$ctx.$root;
      var $f7 = $$ctx.$f7;
      var $f7route = $$ctx.$f7route;
      var $f7router = $$ctx.$f7router;
      var $theme = $$ctx.$theme;
      var $update = $$ctx.$update;
      var $store = $$ctx.$store;

      return $h\`${template}\`
    }
    `,
  );

  return code;
};
