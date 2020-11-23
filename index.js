const childProcess = require('child_process');

const { execSync } = childProcess;

const app = () => {
  const output = execSync('bash flow.sh').toString();
  // console.log(process.env.ACTIONS_RUNTIME_URL);
  console.log(output);
};

app();
