const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const { execSync } = childProcess;

const mountPoint = '/var/tmp';

const app = () => {
  fs.mkdirSync(path.join(mountPoint, 'source'));

  execSync(
    `docker run -v ${mountPoint}:/mnt hexletprojects/css_l1_moon_project:release bash -c 'cp -r /project/. /mnt/source && rm -rf /mnt/source/code'`,
    { stdio: 'inherit' },
  );

  fs.mkdirSync(path.join(mountPoint, 'source', 'code'));

  execSync(
    `cp -r ${__dirname}/. ${mountPoint}/source/code`,
    { stdio: 'inherit' },
  );

  execSync(
    'docker tag hexletprojects/css_l1_moon_project:release source_development:latest',
    { stdio: 'inherit' },
  );

  try {
    execSync(
      `cd ${mountPoint}/source && docker-compose run development make setup test lint`,
      { stdio: 'inherit' },
    );
  } catch (e) {
    console.log('JOPA');
  }
};

app();
