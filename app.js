'use strict'

const { Octokit } = require('@octokit/rest')
const fs = require('fs')
const { execSync } = require('child_process')
const path = require('path')

async function run() {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

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

  let content = ''
  comments.forEach((comment) => {
    content += `${comment.body}\n\n---\n\n`
  })

  const filename = process.env.FILEPATH
  const dir = path.dirname(filename)

  const existingContent = fs.existsSync(filename) ? `${fs.readFileSync(filename)}\n${process.env.EXTRA_TEXT_WHEN_MODIFIED}\n` : ''

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  fs.writeFileSync(filename, `${existingContent}${process.env.ISSUE_BODY}\n\n---\n\n${content}`)

  execSync(`git config --global user.name "${process.env.COMMITTER_NAME}"`)
  execSync(`git config --global user.email "${process.env.COMMITTER_EMAIL}"`)
  execSync(`git add "${filename}"`)
  execSync(`git commit -m "${filename}"`)
  execSync('git push')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
