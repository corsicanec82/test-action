const childProcess = require('child_process');

const { spawnSync } = childProcess;

const app = () => {
  // console.log(process.env.ACTIONS_RUNTIME_URL);
  spawnSync('flow.sh');
};

app();
