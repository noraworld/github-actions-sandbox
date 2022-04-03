import * as core from '@actions/core';
import { github } from '@actions/github';

async function run() {
  try {
    core.debug('Hello from core.debug');
    console.log('Hello from console.log');
    core.debug(github);
    console.log(github);
  }
  catch(error) {
    core.setFailed(error.message);
  }
}

run();
