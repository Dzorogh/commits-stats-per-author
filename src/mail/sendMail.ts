import nodemailer from "nodemailer";

export async function sendMail(html: string, subject: string, to: string, {host, user, pass}: {
    host: string,
    user: string,
    pass: string,
}) {
    const transporter = nodemailer.createTransport({
        host,
        auth: {
            user,
            pass,
        },
    })

    await transporter.sendMail({
        from: user,
        to,
        subject,
        html
    })
}
