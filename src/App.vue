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
        <input type="text">
      </div>
      </td></tr>
      <tr><td>
      <div class="field">
        <label>E-mail: </label>
        <input type="text">
      </div>
      </td></tr>
      <tr><td>
      <div class="field">
        <label>Crypto Name: <a href="https://www.example.com"><label class="infolink"></label></a></label>
        <input type="text">
      </div>
      </td></tr>
      </table>
      <div>
        <button class="button" v-on:click="logIn" :disabled="disabled" type="submit" name="login">Log In</button>
        <button class="button" v-on:click="signUp" :disabled="disabled" type="submit" name="signup">Sign Up</button>
      </div>
    </div>
    <div v-else-if="submitted === 1">
      <br>
      <p> ✔️ Submitted! </p>
      <p> Thank you for signing up for notifications! </p>
      <br>
    </div>  
    <footer class="footer">
      <p><a href="https://github.com/BaibhaVatsa">Code</a> | Made with ❤ by Baibhav Vatsa</p>
    </footer>  
    </center>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      submitted: 0,
      errorCode: 404,
      disabled: false
    }
  },
  methods: {
    submitForm: function() {
      this.submitted = 1;
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

.field>input:focus {
  border: 0.2em solid #5dc0a6
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
  margin-left: 3em;
  padding: 0.1em;
  color: #367565;
  background: white;
  border: 0.1em solid #367565;
  text-decoration: none;
}
</style>
