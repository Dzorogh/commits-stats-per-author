import {Commit, AuthorResult, Repo} from "../types";
import {format} from "date-fns";

const dateFormat = 'iii dd.MM.yyyy'

export const mailTemplate = (startAt: Date, repos: Repo[], results: AuthorResult[]) => {
    const startAtDate = format(startAt, dateFormat)

    //language=HTML
    return `
        <div>
            Дата начала: ${startAtDate}
        </div>
        <div>
            Дата окончания: ${format(new Date(), dateFormat)}
        </div>
        <div>
            Репозитории:
        </div>
        <div>
            ${repos.map(repo => repoTemplate(repo)).join(", ")}
        </div>
        <div>
            ${results.map(result => rowTemplate(result)).join("")}
        </div>
    `
}

const repoTemplate = (repo: Repo) => {
    //language=HTML
    return `
        <a href="${repo.url}">
            ${repo.name}
        </a>
    `
}

const rowTemplate = (data: AuthorResult) => {
    //language=HTML
    return `
        <h2>
            ${data.name}
        </h2>
        <div style="font-weight: bold">
            ${data.email}
        </div>
        <div>
            Коммитов: ${data.count}
        </div>
        <div>
            Изменений: +${data.additions} / −${data.deletions}
        </div>
        ${data.commits ? commitsTemplate(data.commits) : ''}
    `
}

const commitsTemplate = (commits: Commit[]) => {
    //language=HTML
    return `
        <div style="font-weight: bold; margin-top: 10px">
            Коммиты:
        </div>
        <div style="margin-bottom: 30px">
            ${commits.map(commit => commitTemplate(commit)).join("")}
        </div>
    `
}

const commitTemplate = (commit: Commit) => {
    const formattedDate = commit.createdAt ? format(commit.createdAt, dateFormat) : 'Дата неизвестна'

    //language=HTML
    return `
        <div>
            <a href="${commit.url}">${commit.message}</a>
            
            <span>
                (${formattedDate})
            </span>
        </div>
    `
}
