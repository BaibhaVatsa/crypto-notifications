"use strict";

import { parentPort } from "worker_threads";
import User from "./models/User";
import { createTransport } from "nodemailer";
import { google } from "googleapis";
import * as MailData from "./env";
const CoinGecko = require("coingecko-api");

let users = []
let coins = []

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

const CoinGeckoClient = new CoinGecko();

CoinGeckoClient.coins.list()
.then((response) => {
    coins = response.data;
});

function sendIfNewVals() {
    CoinGeckoClient.ping()
    .then(
        transporter.verify()
        .then(() => {
            for(let user of users) {
                CoinGeckoClient.coins.fetch(user.getCrypto())
                .then((response) => {
                    let current_price = response.data.market_data.current_price.usd;
                    user.setCurrentPrice(current_price);
                    // console.log(user.getCrypto())
                    // console.log(user.getCurrentPrice())
                    // console.log(current_price);
                    // console.log("Max: " + user.getMax() + " Min: " + user.getMin());
                    // console.log(current_price > user.getMax() || current_price < user.getMin());
                    return current_price > user.getMax() || current_price < user.getMin();
                })
                .then((result) => {
                    // console.log(result+"\n")
                    if (result) {
                        // console.log(user.getBody());
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
                });
            }
        })
    );
}

setInterval(sendIfNewVals, 5000);