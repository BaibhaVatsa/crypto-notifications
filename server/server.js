"use strict";

import { createServer } from "http";
import { createTransport } from "nodemailer";
import { google } from "googleapis";
import * as MailData from "./env";

createServer((request, response) => {
    let statusCode = 404;
    // try {
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
            subject: "sending with node.js",
            text: "woohoo bitches! progress"
        }, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Email sent: " + info.response);
            }
            transporter.close();
        });

        statusCode = 200;
        response.statusCode = statusCode;
    // } catch(err) {
    //     response.statusCode = statusCode;
    //     console.log(err);
    // }
    response.end(request.data);
}).listen(8000);