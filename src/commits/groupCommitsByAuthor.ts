import {Author, Commit, AuthorResult} from "../types.ts";

export function groupCommitsByAuthor(commits: Commit[], authors: Author[]) {
    const result: AuthorResult[] = []

    authors.forEach((author) => {
        const commitsForAuthor = commits.filter((commit) => author.emails.includes(commit.authorEmail))

        result.push({
            email: author.emails.join(', '),
            commits: commitsForAuthor,
            name: author.name,
            additions: commitsForAuthor.reduce((previousValue, currentValue) => previousValue + currentValue.additions, 0),
            deletions: commitsForAuthor.reduce((previousValue, currentValue) => previousValue + currentValue.deletions, 0),
            count: commitsForAuthor.length
        })
    })

    const knownEmails = authors.flatMap(item => {
        return item.emails
    })

    const commitsFromUnknownEmails = commits.filter((commit) => !knownEmails.includes(commit.authorEmail))

    const unknownEmails = commitsFromUnknownEmails.reduce((previousValue, currentValue) => {
        previousValue.push(currentValue.authorEmail)

        return previousValue
    }, [] as string[])

    const unknownEmailsUnique = [...new Set(unknownEmails)]

    unknownEmailsUnique.forEach((email) => {
        const commitsForEmail = commits.filter((commit) => commit.authorEmail === email)

        result.push({
            email: email,
            commits: commitsForEmail,
            name: commitsForEmail[0].authorName,
            additions: commitsForEmail.reduce((previousValue, currentValue) => previousValue + currentValue.additions, 0),
            deletions: commitsForEmail.reduce((previousValue, currentValue) => previousValue + currentValue.deletions, 0),
            count: commitsForEmail.length
        })
    })

    return result
}
