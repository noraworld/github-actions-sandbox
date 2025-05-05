const fs = require('fs');
const json = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH));

console.log(`json.inputs.foo    = ${json.inputs.foo}`);
console.log(`json.inputs.bar    = ${json.inputs.bar}`);
console.log(`json.inputs.baz    = ${json.inputs.baz}`);
console.log(`json.inputs.qux    = ${json.inputs.qux}`);
console.log(`json.inputs.quux   = ${json.inputs.quux}`);
console.log(`json.inputs.corge  = ${json.inputs.corge}`);
console.log(`json.inputs.grault = ${json.inputs.grault}`);
console.log(`json.inputs.garply = ${json.inputs.garply}`);
console.log(`json.inputs.waldo  = ${json.inputs.waldo}`);
console.log(`json.inputs.fred   = ${json.inputs.fred}`);
console.log(`json.inputs.plugh  = ${json.inputs.plugh}`);
console.log(`json.inputs.xyzzy  = ${json.inputs.xyzzy}`);
console.log(`json.inputs.thud   = ${json.inputs.thud}`);
