"use strict";

import { createServer } from "http";
import { Worker } from "worker_threads";
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
                worker.postMessage(JSON.stringify(users))
            })

            response.statusCode = 200;
        } else {
            response.statusCode = 400;
        }
    } catch(err) {
        response.statusCode = 500;
        console.log(err);
    }
    response.end();
}).listen(8000);