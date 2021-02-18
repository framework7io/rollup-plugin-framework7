import { $jsx } from 'framework7';

function framework7Component(props) {
  let foo = 'bar';
  return function ($ctx) {
      $ctx.$;
      var $h = $ctx.$h;
      $ctx.$root;
      $ctx.$f7;
      $ctx.$f7route;
      $ctx.$f7router;
      $ctx.$theme;
      $ctx.$update;
      $ctx.$store;

      return $h`
  <div>
    <p>Hello world! ${foo}</p>
  </div>
`
    }
    ;
}

framework7Component.id = '93956a0b65';

/** @jsx $jsx */
var AppTemplateJS = (function (props) {
  return $jsx("div", null, $jsx("p", null, "Hello world"));
});

console.log(framework7Component);
console.log(AppTemplateJS);
