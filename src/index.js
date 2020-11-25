const fs = require('fs');
const path = require('path');
const artifact = require('@actions/artifact');
const core = require('@actions/core');
const io = require('@actions/io');
const exec = require('@actions/exec');

const apiUrl = 'https://hexlet.io/api/github_workflow/v1/project';

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
  core.warning('Download snapshots from Artifacts.');
  core.warning('The link is above the output window.');
};

const app = async () => {
  core.info('Checking the possibility of starting testing...');
  core.info('\u001b[38;5;6mChecking completed.');

  core.info('Preparing to start testing. Please wait...');
  await io.mkdirP(buildPath);
  await exec.exec(
    `docker run -v ${mountPoint}:/mnt hexletprojects/css_l1_moon_project:release bash -c "cp -r /project/. /mnt/source && rm -rf /mnt/source/code"`,
    [],
    { silent: false },
  );
  await io.mkdirP(codePath);
  await io.cp(`${projectPath}/.`, codePath, { recursive: true });
  await exec.exec('docker', ['tag', 'hexletprojects/css_l1_moon_project:release', 'source_development:latest'], { silent: false });
  await exec.exec('docker-compose', ['build'], { cwd: buildPath, silent: false });
  core.info('\u001b[38;5;6mPreparing completed.');

  try {
    await exec.exec('docker-compose', ['run', 'development', 'make', 'setup', 'test', 'lint'], { cwd: buildPath });
  } catch (e) {
    core.error('Testing failed. See the output.');
    await uploadArtifacts();
    process.exit(1);
  }
};

app();
