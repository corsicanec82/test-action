const childProcess = require('child_process');

const { spawn } = childProcess;

const app = () => {
  // console.log(process.env.ACTIONS_RUNTIME_URL);
  const bash = spawn('bash', ['flow.sh']);

  bash.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  bash.on('exit', (code) => {
    console.log(`exit`);
  });
};

app();
