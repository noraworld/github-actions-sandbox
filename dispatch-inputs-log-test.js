console.log(`process.argv[2]: ${process.argv[2]}`);
console.log(`process.env.ENV_VAR: ${process.env.ENV_VAR}`);
console.log(`inputs.foo: ${{ inputs.foo }}`);
console.log(`github.event.inputs.foo: ${{ github.event.inputs.foo }}`);
