"use strict";

import { parentPort } from "worker_threads";
import User from "./models/User";
import { createTransport } from "nodemailer";
import { google } from "googleapis";
import * as MailData from "./env";

let users = []

parentPort.on("message", (message) => {
    users = JSON.parse(message).map((data) => new User(data.username, data.email, data.crypto, data.min, data.max));
}); 

const oauth2client = new google.auth.OAuth2(
    MailData.CLIENT_ID,
    MailData.CLIENT_SECRET,
    MailData.REDIRECT_LINK
);
oauth2client.setCredentials({
    refresh_token: MailData.REFRESH_TOKEN
})
const ACCESS_TOKEN  = oauth2client.getAccessToken();

let transporter = createTransport({
    host: MailData.HOST,
    port: MailData.PORT,
    secure: MailData.IS_SECURE,
    auth: {
        type: MailData.AUTH_TYPE,
        user: MailData.FROM,
        clientId: MailData.CLIENT_ID,
        clientSecret: MailData.CLIENT_SECRET,
        refreshToken: MailData.REFRESH_TOKEN,
        accessToken: ACCESS_TOKEN
    }
})

function checkForNewVals() {
    transporter.verify((error) => {
        if (error) {
            console.log(error);
        } else {
            console.log("Server is ready to take our messages");

            for(let user of users) {
                transporter.sendMail({
                    from: MailData.FROM,
                    to: user.getEmail(),
                    subject: user.getSubject(),
                    text: user.getBody()
                }, (err, info) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Email sent to " + user.getEmail() + ": " + info.response);
                    }
                });
                transporter.close();
            }
        }
    });
}

setInterval(checkForNewVals, 5000);