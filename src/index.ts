import 'dotenv/config'
import {startOfDay, subWeeks} from 'date-fns'
import {Commit, Repo} from "./types.ts";
import {sendMail} from "./mail/sendMail.ts";
import {mailTemplate} from "./mail/mailTemplate.ts";
import config from "../appconfig.json" assert {type: "json"};
import {filterCommits} from "./commits/filterCommits.ts";
import {groupCommitsByAuthor} from "./commits/groupCommitsByAuthor.ts";
import {getDataFromGithub} from "./commits/getDataFromGithub.ts";
import {getDataFromGitlab} from "./commits/getDataFromGitlab.ts";

const startAt = startOfDay(subWeeks(new Date(), 1))
const repos: Repo[] = [];
const commits: Commit[] = []

if (!process.env.SMTP_HOST) {
    console.error('Please set SMTP_HOST in .env')
    process.exit()
}

if (!process.env.SMTP_PASS) {
    console.error('Please set SMTP_PASS in .env')
    process.exit()
}

if (!process.env.MAIL_TO) {
    console.error('Please set MAIL_TO in .env')
    process.exit()
}

if (!process.env.SMTP_USER) {
    console.error('Please set SMTP_USER in .env')
    process.exit()
}

const githubResults = await getDataFromGithub(startAt)

commits.push(...githubResults.commits)
repos.push(...githubResults.repos)

const gitlabResults = await getDataFromGitlab(startAt)

commits.push(...gitlabResults.commits)
repos.push(...gitlabResults.repos)

const filteredCommits = filterCommits(commits)
const groupedCommits = groupCommitsByAuthor(filteredCommits, config.authors)

const html = mailTemplate(startAt, repos, groupedCommits)

await sendMail(
    html,
    'Статистика коммитов за 7 дней',
    process.env.MAIL_TO,
    {
        host: process.env.SMTP_HOST,
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
)
