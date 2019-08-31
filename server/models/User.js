export default class User {
    constructor(username, email, crypto, min, max) {
        this.username = username;
        this.email = email;
        this.crypto = crypto;
        this.min = min;
        this.max = max;
    }

    print() {
        console.log("Name: " + this.username + "  Email: " + this.email + "  Crypto: " + this.crypto + " Range: " + this.min + " to " + this.max);
    }
}