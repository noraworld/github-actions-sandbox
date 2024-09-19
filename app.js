'use strict'

const { Octokit } = require('@octokit/rest')
const fs = require('fs')
const { execSync } = require('child_process')
// const path = require('path')
// const { DateTime } = require('luxon')
// const { Base64 } = require('js-base64')
const { exit } = require('process')
// When "\n" is used, GitHub will warn you of the following:
// We’ve detected the file has mixed line endings. When you commit changes we will normalize them to Windows-style (CRLF).
// const newline = '\r\n'
const tmpFile = 'tmp.md'
// const pushRetryMaximum = 5

async function run() {
  let comments = await getComments()
  transferComments(comments)
}

async function getComments() {
  const octokit = process.env.PERSONAL_ACCESS_TOKEN ?
                  new Octokit({ auth: process.env[process.env.PERSONAL_ACCESS_TOKEN] }) :
                  new Octokit({ auth: process.env.GITHUB_TOKEN })
  const repository = process.env.GITHUB_REPOSITORY
  const [ owner, repo ] = repository.split('/')
  const issueNumber = process.env.ISSUE_NUMBER

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

  return comments
}

async function transferComments(comments) {
  let targetIssueRepo = process.env.TARGET_ISSUE_REPO

  let targetIssueNumber = ''
  if (process.env.TARGET_ISSUE_NUMBER && process.env.TARGET_ISSUE_NUMBER !== 'latest') {
    targetIssueNumber = process.env.TARGET_ISSUE_NUMBER
  }
  else {
    targetIssueNumber = execSync(`gh issue list --repo "${targetIssueRepo}" --limit 1 | awk '{ print $1 }'`).toString().trim()
  }

  for (let comment of comments) {
    try {
      fs.writeFileSync(tmpFile, comment.body)
      execSync(`gh issue comment --repo "${targetIssueRepo}" "${targetIssueNumber}" --body-file "${tmpFile}"`)
      await deleteComment(comment.id)
    }
    catch (error) {
      console.error(error)
      exit(1)
    }
  }

  fs.unlinkSync(tmpFile)
}

async function deleteComment(commentID) {
  const octokit = process.env.PERSONAL_ACCESS_TOKEN ?
                  new Octokit({ auth: process.env[process.env.PERSONAL_ACCESS_TOKEN] }) :
                  new Octokit({ auth: process.env.GITHUB_TOKEN })
  const repository = process.env.GITHUB_REPOSITORY
  const [ owner, repo ] = repository.split('/')

  await octokit.issues.deleteComment({
    owner,
    repo,
    comment_id: commentID,
  })
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
