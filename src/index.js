const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const artifact = require('@actions/artifact');

const { execSync, spawnSync } = childProcess;

const mountPoint = '/var/tmp';

const diffpath = path.join(
  mountPoint,
  'source',
  '__tests__',
  '__image_snapshots__',
  '__diff_output__',
);

const uploadArtifacts = async () => {
  if (!fs.existsSync(diffpath)) {
    return;
  }

  const diffstats = fs.statSync(diffpath);
  if (!diffstats.isDirectory()) {
    return;
  }

  const filepaths = fs
    .readdirSync(diffpath)
    .filter((filename) => {
      const filepath = path.join(diffpath, filename);
      const stats = fs.statSync(filepath);
      return stats.isFile();
    })
    .map((filename) => path.join(diffpath, filename));

  if (filepaths.length === 0) {
    return;
  }

  const artifactClient = artifact.create();
  const artifactName = 'test-results';
  await artifactClient.uploadArtifact(artifactName, filepaths, diffpath);
  console.log('Download snapshots from Artifacts');
};

const app = async () => {
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

  const obj = spawnSync(
    `cd ${mountPoint}/source && docker-compose run development make setup test lint`,
    // { stdio: 'inherit' },
  );
  console.log('STDOUT', obj.stdout);
  console.log('STDERR', obj.stderr);
  console.log('OUTPUT', obj.output);
  console.log('ERR', obj.error);

  if (obj.error) {
    await uploadArtifacts();
    process.exit(1);
  }

  // try {
  //   spawnSync(
  //     `cd ${mountPoint}/source && docker-compose run development make setup test lint`,
  //     { stdio: 'inherit' },
  //   );
  //   spawnSync('echo "JKHKHJK"', { stdio: 'inherit' });
  //   console.log('JOPA');
  // } catch (e) {
  //   await uploadArtifacts();
  //   process.exit(1);
  // }
};

app();
