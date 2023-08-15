const nodemailer = require("nodemailer");
exports.mailSend = async (subject,to,text,html) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'ernesto.rempel@ethereal.email',
            pass: 'm4DbQSfs3V6qC3pUZv'
        }
    });
    const info = await transporter.sendMail({
        from: 'Todo App <todo@mail.com>', 
        to: to, 
        subject: subject, 
        text: text, 
        html: html, 
    });
    return info;
}