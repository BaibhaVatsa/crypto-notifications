"use strict";

import { createServer } from "http";
import { createTransport } from "nodemailer";
import { google } from "googleapis";
import { Worker } from "worker_threads";
import * as MailData from "./env";
import User from "./models/User";

let users = []

const worker = new Worker("./worker.js",);
worker.on("message", message => console.log(message));
worker.on("error", error => console.log(error))

createServer((request, response) => {
    try {
        console.log("Request received. Type: " + request.method)
        if (request.method == "POST") {

            let body = "";
            request.on("data", (data) => body += data);
            
            request.on("end", () => {
                let data = JSON.parse(body);
                let t_user = new User(data.username, data.email, data.crypto, data.min, data.max);
                t_user.print()
                users.push(t_user)
            })

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
            
            transporter.verify((error) => {
                if (error) {
                console.log(error);
                } else {
                console.log("Server is ready to take our messages");
                }
            });

            transporter.sendMail({
                from: MailData.FROM,
                to: users[0].getEmail(),
                subject: users[0].getSubject(),
                text: users[0].getBody()
            }, (err, info) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Email sent to " + users[0].getEmail() + ": " + info.response);
                }
                transporter.close();
            });
            response.statusCode = 200;
        } else {
            // return error
        }
    } catch(err) {
        response.statusCode = 404;
        console.log(err);
    }
    response.end();
}).listen(8000);