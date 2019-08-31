"use strict";

import { createServer } from "http";
import { createTransport } from "nodemailer";
import { google } from "googleapis";
import * as MailData from "./env";
import User from "./models/User";

createServer((request, response) => {
    try {
        console.log("Request received. Type: " + request.method)
        if (request.method == "POST") {

            let body = "";
            request.on("data", (data) => body += data);
            
            request.on("end", () => {
                let data = JSON.parse(body);
                var this_user = new User(data.username, data.email, data.crypto, data.min, data.max);
                this_user.print()
                console.log(data);
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
                to: this_user.getEmail(),
                subject: this_user.getSubject(),
                text: this_user.getBody()
            }, (err, info) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Email sent to " + this_user.getEmail() + ": " + info.response);
                }
                transporter.close();
            });

            let statusCode = 200;
            response.statusCode = statusCode;
        } else {

        }
    } catch(err) {
        response.statusCode = statusCode;
        console.log(err);
    }
    response.end(request.data);
}).listen(8000);