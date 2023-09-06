const fs = require('fs');
const { Octokit } = require('@octokit/rest');

const repositoryOwner = 'goofyahhstorageaccount';
const repositoryName = 'tom2-data';
const dataFilePath = '../data.json';
const accessToken = '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';
const octokit = new Octokit({ auth: accessToken });
async function commitAndPushChanges() {
  const data = fs.readFileSync(dataFilePath, 'utf8');
  try {
    const { data: mainBranch } = await octokit.repos.getBranch({
      owner: repositoryOwner,
      repo: repositoryName,
      branch: 'main',
    });
    const latestCommitSha = mainBranch.commit.sha;
    const { data: existingFile } = await octokit.repos.getContent({
      owner: repositoryOwner,
      repo: repositoryName,
      path: dataFilePath.replace(/^\.\.\//, ''),
      ref: 'main',
    });
    await octokit.repos.createOrUpdateFileContents({
      owner: repositoryOwner,
      repo: repositoryName,
      path: dataFilePath.replace(/^\.\.\//, ''),
      branch: 'main', 
      content: Buffer.from(data).toString('base64'),
      message: 'Updated data.json',
      sha: existingFile.sha,
    });
    console.log('Changes pushed to GitHub.');
  } catch (error) {
    console.error('Error pushing changes to GitHub:', error);
  }
}
fs.watch(dataFilePath, (eventType) => {
  if (eventType === 'change') {
    console.log('data.json has changed.');
    commitAndPushChanges();
  }
});