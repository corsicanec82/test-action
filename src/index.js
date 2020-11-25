const fs = require('fs');
const path = require('path');
// const childProcess = require('child_process');
const artifact = require('@actions/artifact');
const core = require('@actions/core');
const io = require('@actions/io');
const exec = require('@actions/exec');

// const { execSync } = childProcess;

const mountPoint = path.join('/', 'var', 'tmp');
const buildPath = path.join(mountPoint, 'source');
const codePath = path.join(buildPath, 'code');
const projectPath = process.cwd();

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
  console.log('Download snapshots = require(Artifacts');
};

const app = async () => {
  // core.debug('Inside try block');
  // core.warning('myInput was not set');
  // core.info('Output to the actions build log');
  // // 3/4 bit
  // core.info('\u001b[35mThis foreground will be magenta');

  // // 8 bit
  // core.info('\u001b[38;5;6mThis foreground will be cyan');

  // // 24 bit
  // core.info('\u001b[38;2;255;0;0mThis foreground will be bright red');
  // // Background colors:

  // // 3/4 bit
  // core.info('\u001b[43mThis background will be yellow');

  // // 8 bit
  // core.info('\u001b[48;5;6mThis background will be cyan');

  // // 24 bit
  // core.info('\u001b[48;2;255;0;0mThis background will be bright red');
  // // Special styles:

  // core.info('\u001b[1mBold text');
  // core.info('\u001b[3mItalic text');
  // core.info('\u001b[4mUnderlined text');
  // core.error('Error action may still succeed though');

  await io.mkdirP(buildPath);
  await exec.exec(
    `docker run -v ${mountPoint}:/mnt hexletprojects/css_l1_moon_project:release bash -c "cp -r /project/. /mnt/source && rm -rf /mnt/source/code"`,
  );
  await io.mkdirP(codePath);
  await io.cp(`${projectPath}/.`, codePath, { recursive: true });
  await exec.exec(`ls -la ${codePath}`);

  // fs.mkdirSync(path.join(mountPoint, 'source'));

  // execSync(
  //   `docker run -v ${mountPoint}:/mnt hexletprojects/css_l1_moon_project:release bash -c 'cp -r /project/. /mnt/source && rm -rf /mnt/source/code'`,
  //   { stdio: 'inherit' },
  // );

  // fs.mkdirSync(path.join(mountPoint, 'source', 'code'));

  // execSync(
  //   `cp -r $(pwd)/. ${mountPoint}/source/code`,
  //   { stdio: 'inherit' },
  // );

  // execSync(
  //   'docker tag hexletprojects/css_l1_moon_project:release source_development:latest',
  //   { stdio: 'inherit' },
  // );

  // try {
  //   execSync(
  //     'docker-compose run development make setup test lint',
  //     { stdio: 'inherit', cwd: `${mountPoint}/source` },
  //   );
  // } catch (e) {
  //   await uploadArtifacts();
  //   process.exit(1);
  // }
};

app();
