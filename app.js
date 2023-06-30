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

  // const { data: comments } = await octokit.issues.listComments({
  //   owner,
  //   repo,
  //   issue_number: issueNumber,
  // });

  let comments = []
  let page = 1
  const perPage = 100
  let response = null

  do {
    response = await octokit.issues.listComments({
      owner,
      repo,
      issue_number: issueNumber,
      page,
      per_page: perPage
    })

    comments = comments.concat(response.data)
    page++
  } while (response.data.length === perPage)

  let content = ''
  comments.forEach((comment) => {
    // console.log(`comment: ${JSON.stringify(comment)}`);
    content += `${comment.body}\n\n---\n\n`
  });

  // console.log(`filepath: ${process.env.FILEPATH}`)
  const filename = process.env.FILEPATH
  const dir = path.dirname(filename)

  const existingContent = fs.existsSync(filename) ? `${fs.readFileSync(filename)}\n# From issues\n` : ''

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  console.log(`process.env.ISSUE_BODY: ${process.env.ISSUE_BODY}`)
  fs.writeFileSync(filename, process.env.ISSUE_BODY + existingContent + content);

  execSync('git config --global user.email "mail@noraworld.com"')
  execSync('git config --global user.name "Kosuke Aoki"')
  execSync(`git add "${filename}"`)
  execSync(`git commit -m "Add ${filename}"`)
  execSync('git push')
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
