const fs = require('fs');
const json = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH));
console.log(`json.inputs.foo = ${json.inputs.foo}`);

// console.log(`process.argv[2]: ${process.argv[2]}`);
// console.log(`process.env.ENV_VAR: ${process.env.ENV_VAR}`);
// console.log(process.env);
// console.log(`inputs.foo: ${process.env.inputs.foo}`);
// console.log(`github.event.inputs.foo: ${process.env.github.event.inputs.foo}`);
