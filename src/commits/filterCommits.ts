import {Commit} from "../types.ts";

export function filterCommits(commits: Commit[]) {
    return commits.filter((commit) => {
        if (commit.message.includes('Merge branch')) {
            return false
        }

        if (commit.message.includes('Merge pull request')) {
            return false
        }

        return true
    })
}
