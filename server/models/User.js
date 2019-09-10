export default class User {
    constructor(username, email, crypto, min, max) {
        this.username = username;
        this.email = email;
        this.crypto = crypto;
        this.min = min;
        this.max = max;
        this.current_price = max - 1;
        this.delay = 0;
    }

    print() {
        console.log("Name: " + this.username + "  Email: " + this.email + "  Crypto: " + this.crypto + " Range: " + this.min + " to " + this.max + " Current Price: " + this.current_price);
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

    getCrypto() {
        return this.crypto;
    }

    getMin() {
        return this.min;
    }

    getMax() {
        return this.max;
    }

    getCurrentPrice() {
        return this.current_price;
    }

    setCurrentPrice(new_current_price) {
        this.current_price = new_current_price;
    }

    delayAgain() {
        this.delay += 1;
    }
}