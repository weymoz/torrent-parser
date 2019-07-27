const pug = require('pug');

const compiledFunction = pug.compileFile('template.pug', {
  pretty: true
});

console.log(compiledFunction({
  name: 'Timoty'
}));

console.log(compiledFunction({
  name: 'Forbes'
}));
