export default class User {
    constructor(username, email, crypto, min, max) {
        this.username = username;
        this.email = email;
        this.crypto = crypto;
        this.min = min;
        this.max = max;
        this,current_price = max - 1;
    }

    print() {
        console.log("Name: " + this.username + "  Email: " + this.email + "  Crypto: " + this.crypto + " Range: " + this.min + " to " + this.max);
    }

    getEmail() {
        return this.email; 
    }
    
    getBody() {
        return "Dear " + this.username + ",\n" + this.crypto + " is at " + this.current_price + ".\nYours faithfully,\nCrypto Notifications Team";
    }

    getSubject() {
        return "Crypto Notification for " + this.crypto;
    }
}