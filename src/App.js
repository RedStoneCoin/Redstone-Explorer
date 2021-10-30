import logo from './logo.svg';
import React, { useState } from 'react';
import './App.css';
import Popup from './popup';
import { enc } from 'crypto-js';
var CryptoJS = require("crypto-js");
function CreateWallet(pass) {
  fetch('http://127.0.0.1:1235/create_wallet')
  .then(function(response) {
    console.log(response);
    return response.json();
  })
  .then(function(myJson) {
    console.log(myJson);
    localStorage.setItem('wallet_address', myJson.address);
    myJson.private_key = CryptoJS.AES.encrypt(myJson.private_key, pass).toString();
    localStorage.setItem('wallet_private_key', myJson.private_key);
    localStorage.setItem('wallet_public_key', myJson.public_key);
    localStorage.setItem('logged_in', "true");
    //refrash page
    window.location.reload();
  });
}
function delite() {
  localStorage.setItem('logged_in', "false");
  localStorage.setItem('wallet_address', null);
  window.location.reload();

}
function log_in() {
  localStorage.setItem('logged_in', "create");
  window.location.reload();
}

function import_wallet(pik,pass) {
  fetch('http://127.0.0.1:1235/from_key/' + pik)
  .then(function(response) {
    console.log(response);
    return response.json();
  })
  .then(function(myJson) {
    console.log(myJson);
    localStorage.setItem('wallet_address', myJson.address);
    myJson.private_key = CryptoJS.AES.encrypt(myJson.private_key, pass).toString();
    localStorage.setItem('wallet_private_key', myJson.private_key);
    localStorage.setItem('wallet_public_key', myJson.public_key);
    localStorage.setItem('logged_in', "true");
    //refrash page
    window.location.reload();
  });
}
function decrypt(encrypted, password) {
  var bytes  = CryptoJS.AES.decrypt(encrypted.toString(), password);
  try {
  var plaintext = bytes.toString(CryptoJS.enc.Utf8);
  return plaintext;
  }
  catch(err) {
    return "";
  }
}

function get_key(pass) {
  var private_key = localStorage.getItem('wallet_private_key');
  var decrypted = decrypt(private_key, pass);
  if (decrypt == "") {
    alert("Wrong password");
    return;
  }
  // check for errors
  if (decrypted.length != 64) {
    alert("Wrong password");
    return;
  }
  // return wallet
  localStorage.setItem('wallet_private_key', decrypted);
  localStorage.setItem('logged_in', "true_wallet");
  window.location.reload();
}
  
function other() {
  localStorage.setItem('logged_in', "import");
  window.location.reload();
}
function other1() {
  localStorage.setItem('logged_in', "false");
  localStorage.setItem('wallet_address', null);
  window.location.reload();
}

// function logged_in() wallet function
function log_out(pass) {
  localStorage.setItem('logged_in', "false1");
  let private_key = localStorage.getItem('wallet_private_key');
  private_key = CryptoJS.AES.encrypt(private_key, pass).toString();
  localStorage.setItem('wallet_private_key', private_key);
  window.location.reload();
}


function send(to,amout){

}

function App() {
  let logged_in = localStorage.getItem('logged_in');
  console.log(logged_in);
  let wallet_address = localStorage.getItem('wallet_address');
  const [isOpen, setIsOpen] = useState(false);
 
  const togglePopup = () => {
    setIsOpen(!isOpen);
  }

  if (logged_in === "create") {
    // import private key with import_key
    return (
      <div className="App">
        <header className="App-header">
          <p> Create Redstone Wallet </p>
          <input type="text" placeholder="password" id="pik" />
          <p></p>
          <button onClick={() => CreateWallet(document.getElementById('pik').value)}> Create </button>
          <p></p>
          <button onClick={() => other1()}> Delite Wallet </button>
        </header>
      </div>
    );
  }
  if (logged_in === "import") {
    // import private key with import_key
    return (
      <div className="App">
        <header className="App-header">
          <p> Import private key </p>
          <input type="text" placeholder="private key" id="pik" />
          <p></p>
          <input type="text" placeholder="password" id="pik1" />
          <p></p>
          <button onClick={() => import_wallet(document.getElementById('pik').value,document.getElementById("pik1").value)}> Import </button>
          <p></p>
          
          <button onClick={() => other1()}> Cancel </button>
        </header>
      </div>
    );
  }
  if (logged_in === "false") {
    return (
      <div className="App">
        <header className="App-header">
        <button onClick={log_in}>Create Wallet</button>
        <p></p>

        <button onClick={other}> Import private key </button>
      </header>
      </div>
    );
  } 
  if (logged_in === "true_wallet") {
    let wallet_private_key = localStorage.getItem('wallet_private_key');

    return (
      <div className="App">
        <header className="App-header">
        <ul>
        <li><a class="button" onClick={togglePopup} >Settings</a></li>
      </ul>
          <p> Redstone Wallet </p>
          <p> Address: {wallet_address} </p>
          <p> Balance: 0</p>
          <p></p>
          <form>
          <input type="text" placeholder="address" id="address" />
          <p></p>
          <input type="text" placeholder="amount" id="amount" />
          <p></p>
          <button onClick={() => send(document.getElementById('address').value,document.getElementById('amount').value)}> Send </button>
          </form>
          {isOpen && <Popup
            content={<>
              <p> Password to log out</p>
              <input type="text" placeholder="password" id="pik"/>
              <p> Enter password you want to use for private key encryption</p>
              <p></p>
              <button onClick={() => log_out(document.getElementById('pik').value)}> Log out </button>
              <p>PLEASE BACK UP YOUR PRIVATE KEY: {wallet_private_key}</p>
              <div class="dropdown">
                 <button class="dropbtn">Delite Wallet</button>
                <div class="dropdown-content">
                  <a href="#">NO</a>
                  <a href="#">NO</a>
                  <button onClick={delite}> Delite Wallet </button>
                </div>
              </div> 
            </>}
            handleClose={togglePopup}
          />}
        </header>

      </div>
    );
  }
  if (wallet_address != null) {
    // decrypt private key
    // ask user to enter password
    return (
      <div className="App">
        <header className="App-header">
          <p> Please enter your password </p>
          <input type="text" placeholder="password" id="pik" />
          <p></p>
          <button onClick={() => get_key(document.getElementById('pik').value)}> Login </button>
          <p></p>
          <button onClick={() => other1()}> Delite Wallet </button>
        </header>
      </div>
    );
    
    // check get_key 
  }
  
}

export default App;
