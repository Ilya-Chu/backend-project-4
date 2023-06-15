#!/usr/bin/env node

import { Command } from 'commander';
import downloadPage from '../src/index.js';

const program = new Command();

program
  .version('1.0.0')
  .description('Page loader CLI utility')
  .option('-o, --output [dir]', 'output  directory', process.cwd())
  .argument('<URL>')
  .action((url, options) => {
    return downloadPage(url, options.output);
  });

program.parse(process.argv);