const childProcess = require('child_process');

const { execSync } = childProcess;

const app = () => {
  // console.log(process.env.ACTIONS_RUNTIME_URL);
  const output = execSync('flow.sh');
  console.log(output);
};

app();
