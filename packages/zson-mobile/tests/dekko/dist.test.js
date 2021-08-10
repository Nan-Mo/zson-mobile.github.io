const dekko = require('dekko');
const chalk = require('chalk');

dekko('dist')
  .isDirectory()
  .hasFile('zson.css')
  .hasFile('zson.min.css')
  .hasFile('zson.js')
  .hasFile('zson.min.js');

// eslint-disable-next-line no-console
console.log(chalk.green('✨ `dist` directory is valid.'));
