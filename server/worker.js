import { parentPort } from "worker_threads";

parentPort.on("message", (message) => {
    parentPort.postMessage({pong: message})
}); 

let i = 1;

function checkForNewVals() {
    console.log("Running for the " + i + "th time.");
    i += 1;
}

setInterval(checkForNewVals, 1000);