import logo from './logo.svg';
import './App.css';


function CreateWallet() {
  fetch('http://127.0.0.1:1234/create_wallet')
  .then(function(response) {
    console.log(response);
    return response.json();
  })
  .then(function(myJson) {
    console.log(myJson);
    document.getElementById("wallet_address").innerHTML = myJson.address;
    document.getElementById("wallet_private_key").innerHTML = myJson.private_key;
    document.getElementById("wallet_public_key").innerHTML = myJson.public_key;

  });
  
}


function App() {
  return (
    <div className="App">
      <header className="App-header">
      <button onClick={CreateWallet}>Create Wallet</button>
      <p>Address:</p>
      <p id="wallet_address"></p>
      <p>Private Key:</p>
      <p id="wallet_private_key"></p>
      <p>Public Key:</p>
      <p id="wallet_public_key"></p>

    </header>
    </div>
  );

    
}

export default App;
