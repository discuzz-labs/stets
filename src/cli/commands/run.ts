/*
 * Copyright (c) 2024 Discuzz Labs Organization
 * Licensed under the MIT License.
 * See the LICENSE file in the project root for license information.
 */

import { Config } from "../../config/Config";
import { SuitesLoader } from "../../core/SuitesLoader";
import { SuitesRunner } from "../../core/SuitesRunner";
import { Reporter } from "../../reporters/Reporter";
import { Log } from "../../utils/Log";

const run = async () => {
  Log.info("Running default command")
  const config = Config.init()

  const loader = new SuitesLoader()
  await loader.loadSuites()
  const runner = new SuitesRunner(loader.get());
  await runner.runSuites()
  const reporter = new Reporter(runner.get());
  
  if(config.get("clearConsole").toString() === "true") console.clear()
  
  reporter.reportSuites()
  
  Log.info("Default Command finished")
};

export default run;