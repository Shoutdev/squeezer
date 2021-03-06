'use strict';

const _ = require('lodash');
const path = require('path');

class Functions {
  constructor(sqz) {
    this.sqz = sqz;
  }

  add(functionName, functionPath, functionService) {
    const options = this.sqz.cli.params.get().options;
    const configFilePath = path.join(functionPath, 'squeezer.yml');
    const functionObject = this.sqz.yaml.parse(configFilePath);
    const functionIdentifier = this.sqz.utils.getIdentifier(functionName);
    const functionOpt = options.function || null;

    let flagged = true;
    let force = false;

    if (functionOpt && functionName !== functionOpt) {
      flagged = false;
    }

    if (_.has(options, 'force')) {
      force = true;
    }

    _.assign(functionObject, {
      name: functionName,
      handler: 'handler',
      timeout: functionObject.timeout || 6,
      memory: functionObject.memory || 128,
      identifier: functionIdentifier,
      service: functionService,
      serviceIdentifier: this.sqz.utils.getIdentifier(functionService),
      path: functionPath,
      packagePath: path.join(this.sqz.vars.project.buildPath, 'deploy', 'functions'),
      packageFile: `${functionIdentifier}.zip`,
      flagged: flagged,
      force: force
    });

    if (_.has(this.sqz.vars.functions, functionName)) {
      this.sqz.cli.log.error(`There is a duplicated function with name "${functionName}"`);
    }

    this.sqz.vars.functions[functionObject.name] = functionObject;
  }

  get() {
    return this.sqz.vars.functions;
  }
}

module.exports = Functions;
