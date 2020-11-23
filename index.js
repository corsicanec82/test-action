const childProcess = require('child_process');

const { execSync } = childProcess;

const app = () => {
  const output = execSync('docker -v').toString();
  // console.log(process.env.ACTIONS_RUNTIME_URL);
  console.log(output);
};

app();
