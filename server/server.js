"use strict";

import { createServer } from "http";
import { createTransport } from "nodemailer";
import { google } from "googleapis";
import * as MailData from "./env";
import User from "./models/User";

createServer((request, response) => {
    try {
        if (request.method == "POST") {

            let body = "";
            request.on("data", (data) => body += data);
            
            request.on("end", () => {
                let data = JSON.parse(body);
                // users.push(new User(data["username"], ));
                // for (let user in users) {
                    // user.print();
                // }
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
                to: "",
                subject: "hi",
                text: "debugging in progress"
            }, (err, info) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Email sent: " + info.response);
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