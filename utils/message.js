// import chalk from 'chalk';
const chalk = require('chalk');

const message = {
  success(text) {
    console.log(chalk.green.bold(text));
  },
  error(text) {
    console.log(chalk.red.bold(text));
  },
  info(text) {
    console.log(chalk.blue.bold(text));
  },
  light(text) {
    console.log(chalk.yellow.bold(text));
  },
};


module.exports = message;
