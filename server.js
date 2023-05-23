const express = require('express');
const Mailgen = require('mailgen');
const app = express()
const nodeMailer = require('nodemailer')
const cors = require('cors')
const path = __dirname+'/views/';
require('dotenv').config();

app.use(express.json());
let corsOption = {
    origin: "*"
};

app.use(cors(corsOption));

app.post('/api/send/', async (req, res) => {
    let {subject, textBody, name, emailAcc} = req.body;
    let config = {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    }
    let transporter = await nodeMailer.createTransport(config);
    let mailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'Mailgen',
            link: 'https://mailgen.js/'
        }
    })
    let mail = {
        body: {
            signature: false,
            greeting: false,
            name,
            intro: `my email account is ${emailAcc}`,
            outro: textBody
        }
    }
    let emailBody = mailGenerator.generate(mail);
    let message = {
        from : process.env.EMAIL,
        to: process.env.USERMAIL,
        subject: subject,
        html: emailBody
    }

    transporter.sendMail(message)
        .then(info => {
            return res.status(201).json({
                msg: 'Email has been sent to Hein Pyae',
                messageId: info.messageId,
                preview: nodeMailer.getTestMessageUrl(info)
            })
        })
        .catch(err => {
            return res.status(500).json({err: err.message})
        })
});
app.use(express.static(path));
let port = process.env.PORT || 3000;
app.listen(port, () => console.log('App listen at', port));