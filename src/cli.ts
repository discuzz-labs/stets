/*
 * Copyright (c) 2024 Discuzz Labs Organization
 * Licensed under the MIT License.
 * See the LICENSE file in the project root for license information.
 */

import  defaultCmd  from "./commands/default.cmd"
import { CLIOptions } from "./types";
import { version } from '../package.json'

class CLI {
  private options: CLIOptions = {};

  constructor() {
    this.parseArgs();
    this.run();
  }

  private parseArgs() {
    const args = process.argv.slice(2);
    args.forEach((arg, index) => {
      switch (arg) {
        case '-v':
        case '--verbose':
          this.options.verbose = true;
          break;
        case '-b':
        case '--bail':
          this.options.bail = true;
          break;
        case '-t':
        case '--timeout':
          this.options.timeout = parseInt(args[index + 1], 10);
          break;
        case '-d':
        case '--testDirectory':
          this.options.testDirectory = args[index + 1];
          break;
        case '-p':
        case '--filePattern':
          this.options.filePattern = args[index + 1];
          break;
      }
    });
  }

  private printHelp() {
    console.log(`
Usage: <command> [options]

Options:
  -v, --verbose           Enable verbose logging
  -b, --bail              Stop on first test failure
  -t, --timeout <ms>      Set the test timeout in milliseconds
  -d, --testDirectory <path> Set the test directory
  -p, --filePattern <pattern> Set the test file pattern
  -h, --help            Display this help message
  -v, -version          Print the version number
    `);
  }

  private run() {
    if (process.argv.includes('--help') || process.argv.includes('-h')) {
      this.printHelp();
      return;
    }

    if (process.argv.includes('--version') || process.argv.includes('-v')) {
      console.log(`Version: ${version}`);
      return;
    }

    defaultCmd()
  }
}

// Instantiate and run the CLI
new CLI();