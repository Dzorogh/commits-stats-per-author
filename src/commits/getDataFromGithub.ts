import {Octokit} from "@octokit/rest";
import {formatISO, parseISO} from "date-fns";
import 'dotenv/config'
import {createTokenAuth} from "@octokit/auth-token";
import {Commit, GitData, Repo} from "../types.ts";

if (!process.env.GITHUB_TOKEN) {
    console.error('Please set GITHUB_TOKEN in .env')
    process.exit()
}

if (!process.env.GITHUB_ORG) {
    console.error('Please set GITHUB_ORG in .env')
    process.exit()
}

const githubAuth = createTokenAuth(process.env.GITHUB_TOKEN);
const githubToken = (await githubAuth()).token;
const githubOrg = process.env.GITHUB_ORG;

const githubApi = new Octokit({
    auth: githubToken
});

const githubRepos = (
    await githubApi
        .rest
        .repos
        .listForOrg({
            org: githubOrg
        })
).data

export async function getDataFromGithub(startAt: Date) : Promise<GitData> {
    const commits : Commit[] = []
    const repos: Repo[] = []

    for (const repo of githubRepos) {
        repos.push({
            name: repo.name,
            updatedAt: repo.updated_at ? parseISO(repo.updated_at) : undefined,
            url: repo.html_url
        })

        if (repo.size === 0) {
            continue
        }

        const githubCommits = (
            await githubApi.request(`GET /repos/{owner}/{repo}/commits`, {
                owner: githubOrg,
                repo: repo.name,
                since: formatISO(startAt),
                per_page: 100, // todo add pagination,
            })
        ).data

        for (const c of githubCommits) {
            const email = c.commit.author?.email
            const name = c.commit.author?.name

            const commitData = (
                await githubApi.request('GET /repos/{owner}/{repo}/commits/{ref}', {
                    owner: githubOrg,
                    repo: repo.name,
                    ref: c.sha
                })
            ).data

            commits.push({
                message: c.commit.message,
                repo: repo.name,
                url: c.html_url,
                additions: commitData.stats?.additions ?? 0,
                deletions: commitData.stats?.deletions ?? 0,
                createdAt: c.commit.committer?.date ? parseISO(c.commit.committer.date) : undefined,
                authorEmail: email ?? '',
                authorName: name ?? '',
            })
        }
    }

    return {
        commits,
        repos
    }
}
