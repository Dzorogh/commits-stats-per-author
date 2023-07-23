import {formatISO, parseISO} from "date-fns";
import {Gitlab} from "@gitbeaker/rest";
import {Commit, GitData, Repo} from "../types.ts";

if (!process.env.GITLAB_TOKEN) {
    console.error('Please set GITLAB_TOKEN in .env')
    process.exit()
}

if (!process.env.GITLAB_USER_ID) {
    console.error('Please set GITLAB_USER_ID in .env')
    process.exit()
}

const gitlabApi = new Gitlab({
    host: process.env.GITLAB_HOST,
    token: process.env.GITLAB_TOKEN,
});

const gitlabRepos = await gitlabApi.Users.allProjects(Number(process.env.GITLAB_USER_ID))

export async function getDataFromGitlab(startAt: Date): Promise<GitData> {
    const commits: Commit[] = []
    const repos: Repo[] = []

    for (const repo of gitlabRepos) {
        repos.push({
            name: repo.name,
            updatedAt: parseISO(repo.updated_at),
            url: repo.web_url
        })

        const gitlabCommits = await gitlabApi.Commits.all(repo.id, {
            since: formatISO(startAt),
            perPage: 100, // todo add pagination,
            withStats: true
        })

        for (const commit of gitlabCommits) {
            const stats = commit.stats as {
                deletions: number,
                additions: number
            }

            commits.push({
                message: commit.message,
                repo: repo.name,
                url: commit.web_url,
                additions: stats.additions,
                deletions: stats.deletions,
                createdAt: parseISO(commit.created_at),
                authorEmail: commit.committer_email ?? commit.author_email,
                authorName: commit.committer_name ?? commit.author_name
            })
        }
    }

    return {
        commits,
        repos
    }
}
