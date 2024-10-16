/*
 * Copyright (c) 2024 Discuzz Labs Organization
 * Licensed under the MIT License.
 * See the LICENSE file in the project root for license information.
 */

import * as path from "path";
import * as fs from "fs";
import config from "../stets.config";
import { StetsConfig, TestConfig } from "../types";
import { Log } from "../utils/Log";
import { ArgsParser } from "../cli/ArgParser";

export class Config {
  private static instance: Config;
  private config: TestConfig = config;
  private loadedConfig: StetsConfig = {}; // Store loaded config from file

  private configFileName: string[] = [
    ArgsParser.has("config")
      ? path.join(process.cwd(), ArgsParser.get("config") as string)
      : "",
    path.join(process.cwd(), "stets.config.ts"),
    path.join(process.cwd(), "stets.config.js"),
  ];

  [key: string]: any;

  // Private constructor to prevent external instantiation
  private constructor() {
    this.loadConfigFromFile();
    this.setConfig();
  }

  // Static method to provide a global access point to the singleton instance
  public static init(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  // Method to load configuration from the available config file
  private loadConfigFromFile(): void {
    for (const filePath of this.configFileName) {
      if (fs.existsSync(filePath)) {
        try {
          const loadedConfig: StetsConfig = require(filePath).default;
          this.loadedConfig = loadedConfig;
          Log.info(`Loaded config from ${filePath}`);
          return;
        } catch (error: any) {
          Log.error(`Failed to load config from ${filePath}: ${error.message}`);
        }
      } else {
        Log.info("No configuration files were found.");
        Log.warn(`Config file ${filePath} not found.`);
      }
    }
  }

  // Dynamically set the configuration by merging default, file-based, and CLI options
  private setConfig() {
    Object.keys(this.config).forEach((key) => {
      if (this.loadedConfig.hasOwnProperty(key)) {
        // If loaded config has the property, override the default config
        (this.config as any)[key] = this.loadedConfig[key as keyof StetsConfig];
        Log.info(
          `Overwritten config ${key} with value from file: ${(this.loadedConfig as any)[key]}`,
        );
      } else if (ArgsParser.has(key as keyof TestConfig)) {
        // If CLI options or environment has the property, override with that
        (this.config as any)[key] = ArgsParser.get(key as keyof TestConfig);
        Log.info(
          `Overwritten config ${key} with value from CLI/ENV: ${ArgsParser.get(key as keyof TestConfig)}`,
        );
      }
    });
  }

  public all(): TestConfig {
    return this.config;
  }

  // Method to get a specific config value
  public get(key: keyof TestConfig): any {
    return this.config[key];
  }
}
