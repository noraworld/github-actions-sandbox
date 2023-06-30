const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path')

async function run() {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  const repository = process.env.GITHUB_REPOSITORY;
  const [ owner, repo ] = repository.split('/')
  const issueNumber = process.env.ISSUE_NUMBER;
  // console.log('can you see me?')
  // console.log(repo)
  // console.log(issueNumber)
  // const issueNumber = process.env.GITHUB_EVENT.issue.number;

  const { data: comments } = await octokit.issues.listComments({
    owner,
    repo,
    issue_number: issueNumber,
  });

  let content = ''
  comments.forEach((comment) => {
    console.log(`comment: ${JSON.stringify(comment)}`);
    content += `${comment.body}\n\n---\n\n`
  });

  // console.log(`filepath: ${process.env.FILEPATH}`)
  const filename = process.env.FILEPATH
  const dir = path.dirname(filename)

  const existingContent = fs.existsSync(filename) ? `${fs.readFileSync(filename)}\n# From issues\n` : ''

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  fs.writeFileSync(filename, existingContent + content);

  execSync('git config --global user.email "mail@noraworld.com"')
  execSync('git config --global user.name "Kosuke Aoki"')
  execSync(`git add ${filename}`)
  execSync(`git commit -m "Add ${filename}"`)
  execSync('git push')
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
