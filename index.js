const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const { execSync } = childProcess;

const mountPoint = '/var/tmp';

const app = () => {
  fs.mkdirSync(path.join(mountPoint, 'source'));

  const output1 = execSync(
    `docker run -v ${mountPoint}:/mnt hexletprojects/css_l1_moon_project:release bash -c 'cp -r /project/. /mnt/source && rm -rf /mnt/source/code'`,
  ).toString();
  console.log(output1);

  fs.mkdirSync(path.join(mountPoint, 'source', 'code'));

  const output2 = execSync(`cp -r ${__dirname}/. ${mountPoint}/source/code`).toString();
  console.log(output2);

  const output3 = execSync(
    'docker tag hexletprojects/css_l1_moon_project:release source_development:latest',
  ).toString();
  console.log(output3);

  const output4 = execSync(
    `cd ${mountPoint}/source && docker-compose run development make setup test lint`,
  ).toString();
  console.log(output4);
};

app();
