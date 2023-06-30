const { Octokit } = require('@octokit/rest');

async function run() {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  const repo = process.env.GITHUB_REPOSITORY;
  const issueNumber = process.env.ISSUE_NUMBER;
  console.log('can you see me?')
  console.log(repo)
  console.log(issueNumber)
  // const issueNumber = process.env.GITHUB_EVENT.issue.number;

  // const { data: comments } = await octokit.issues.listComments({
  //   owner,
  //   repo,
  //   issue_number: issueNumber,
  // });

  // comments.forEach((comment) => {
  //   console.log(`Comment ID: ${comment.id}`);
  //   console.log(`Author: ${comment.user.login}`);
  //   console.log(`Body: ${comment.body}`);
  //   console.log('---');
  // });
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
