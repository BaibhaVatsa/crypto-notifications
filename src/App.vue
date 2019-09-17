<template>
  <div id="app">
    <center>
    <header><h1 class="header">Crypto Notifications</h1></header>
    <div v-if="submitted === -1">
      <p> ❌ Failed! </p>
      <p> Apologies for not being able to submit your request. Error code {{errorCode}}. </p>
    </div>
    <div class="form" v-if="submitted === 0 || submitted === -1">
      <table>
      <tr><td>
      <div class="field">
        <label>Name: </label>
        <input type="text" v-bind:class="nameInput" v-model.trim="username" name="username" placeholder="John Doe">
      </div>
      </td></tr>
      <tr><td>
      <div class="field">
        <label>E-mail: </label>
        <input type="text" v-bind:class="emailInput" v-model.trim="email" name="email" placeholder="abc@example.com">
      </div>
      </td></tr>
      <tr><td>
      <div class="field">
        <label>Crypto Name: <label class="infolink tooltip">
          <p class="tooltiptext">
            Trading names. List: <a href="https://www.example.com" target="_blank">Example.com</a>
          </p>
        </label></label>
        <input type="text" v-bind:class="cryptoInput" v-model.trim="crypto" name="crypto" placeholder="BTC">
      </div>
      </td></tr>
      <tr><td>
      <div class="field">
        <label>Min ($): </label>
        <input type="text" v-bind:class="minInput" v-model.trim="min" name="min" placeholder="100">
      </div>
      <div class="field">
        <label>Max ($): </label>
        <input type="text" v-bind:class="maxInput" v-model.trim="max" name="max" placeholder="10000">
      </div>
      </td></tr>
      </table>
      <div>
        <button v-bind:class="buttonObject" class="button" v-on:click="submitForm" :disabled="disabled" type="submit" name="login">Log In</button>
      </div>
    </div>
    <div v-else-if="submitted === 1">
      <br>
      <p> ✔️ Submitted! </p>
      <p> Thank you for signing up for notifications! </p>
      <br>
    </div>  
    <footer class="footer">
      <p><a href="https://github.com/BaibhaVatsa/crypto-notifications">Code</a> | Made with ❤ by Baibhav Vatsa</p>
    </footer>  
    </center>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      submitted: 0,
      errorCode: 0,
      username: "",
      email: "",
      crypto: "",
      cryptoList: ["bitcoin", "ETH"],
      min: "",
      max: ""
    }
  },
  computed: {
    disabled: function() {
      return !(this.validUsername && this.validEmail && this.validCrypto && this.validMin && this.validMax);
    },
    validUsername: function() {
      if(this.username.length === 0) {
        return false;
      }
      // eslint-disable-next-line
      var alpha = /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/;
      return this.username.match(alpha);
    },
    validEmail: function() {
      if(this.email.length === 0) {
        return false;
      }
      // eslint-disable-next-line
      var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
      return this.email.match(mailformat);
    },
    validCrypto: function() {
      if(this.crypto.length === 0) {
        return false;
      }
      return this.cryptoList.indexOf(this.crypto) !== -1;
    },
    buttonObject: function() {
      return {
        disabledButton: this.disabled,
        enabledButton: !this.disabled
      }
    },
    nameInput: function() {
      return this.borderInput(this.validUsername);
    },
    emailInput: function() {
      return this.borderInput(this.validEmail);
    },
    cryptoInput: function() {
      return this.borderInput(this.validCrypto);  
    },
    minInput: function() {
      return this.borderInput(this.validMin);
    },
    maxInput: function() {
      return this.borderInput(this.validMax);
    },
  },
  methods: {
    validMin: function() {
      if (this.min.length === 0) {
        return false;
      }
      try {
        this.min = parseInt(this.min);
        return this.min >= 0;
      } catch(err) {
        return false;
      }
    },
    validMax: function() {
      if (this.max.length === 0) {
        return false;
      }
      try {
        this.max = parseInt(this.max);
        if (typeof(this.min) === "number") {
          return this.max > this.min;
        } else {
          return this.max >= 0;
        }
      } catch(err) {
        return false;
      }
    },
    submitForm: function() {
        fetch("http://127.0.0.1:8000", {
          method: "POST",
          credentials: "same-origin",
          body: JSON.stringify({
            username: this.username,
            email: this.email,
            crypto: this.crypto,
            min: this.min,
            max: this.max
          })
        }).then((response) => {
          if (response.status !== 200) {
            this.errorCode = response.status;
            this.submitted = -1;
          } else {
            this.submitted = 1;
          }
        }).catch((err) =>{
          this.errorCode = err;
          this.submitted = -1;
      })
    },
    borderInput: function(condition) {
      return {
        greenBorder: condition,
        redBorder: !condition
      }
    }
  }
}
</script>

<style>
.footer {
  position: fixed;
  bottom: 2em;
  width: 100%;
  text-align: center;
}

.button {
  margin: 0.5em;
}

td {
  text-align: left;
}

.field>label {
  display: block;
  margin-left: 0em;
}

.field {
  padding: 0.2em;
  margin: 0.3em;
}

.field>input {
  margin-bottom: 1em;
  margin-top: 0.2em;
}

.greenBorder:focus {
  border: 0.2em solid #5dc0a6;
}

.redBorder:focus {
  border: 0.2em solid #ef4b4b;
}

.header {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin-bottom: 2em;
  margin-top: 1em;
}

.infolink:before
{
  content: '?';
  display: inline-block;
  font-family: sans-serif;
  font-weight: bold;
  text-align: center;
  width: 1.8ex;
  height: 1.8ex;
  font-size: 1.4ex;
  line-height: 1.8ex;
  border-radius: 1.2ex;
  margin-left: 7em;
  padding: 0.1em;
  color: #367565;
  background: white;
  border: 0.1em solid #367565;
  text-decoration: none;
}

.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltiptext {
  visibility: hidden;
  font-size: 75%;
  left: 105%;
  text-align: center;
  background-color: #37977e;
  color: #ffffff;
  padding: 0.5em;
  border-radius: 0.5em;
  position: absolute;
  z-index: 1;
  top: -150%;
}

.tooltip .tooltiptext a {
  color: #ffffff;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}

.tooltip .tooltiptext::after {
  content: " ";
  position: absolute;
  top: 50%;
  right: 100%;
  margin-top: -0.5em;
  border-width: 0.5em;
  border-style: solid;
  border-color: transparent #37977e transparent transparent;
}

.button {
  padding: 0.6em;
  margin-top: 3em;
  border-radius: 0.2em;
  border-color: transparent;
}

.disabledButton {
  background-color: #afb8b5;
  color: #333232;
}

.enabledButton:hover {
  background-color: #3d7c6b;
  color: #ffffff;
}

.enabledButton {
  background-color: #5dc0a6;
  color: #ffffff;
}
</style>
