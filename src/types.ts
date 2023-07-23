export interface Commit {
    message: string,
    createdAt?: Date,
    url: string,
    repo: string,
    authorEmail: string,
    authorName: string,
    additions: number,
    deletions: number,
}

export interface AuthorResult {
    email: string,
    name: string,
    additions: number,
    deletions: number,
    count: number,
    commits: Commit[]
}

export interface Author {
    emails: string[],
    name: string
}

export interface Repo {
    name: string,
    updatedAt?: Date,
    url: string
}

export interface GitData {
    repos: Repo[],
    commits: Commit[]
}
