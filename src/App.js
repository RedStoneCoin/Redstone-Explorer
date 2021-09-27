import logo from './logo.svg';
import './App.css';


function getblk(chain) {
  fetch('http://127.0.0.1:1234/lastten')
  .then(function(response) {
    console.log(response);
    return response.json();
  })
  .then(function(myJson) {
    console.log(myJson);
    
    show(myJson);

  });
  
}

function getacc(acc) {
    fetch('http://0.0.0.0:1234/get_acc/' + acc)
    .then(function(response) {
      console.log(response);
      return response.json();
    })
    .then(function(myJson) {
      console.log(myJson);
      show1(myJson);
    });
    
  }

function search() {
 
   // if (urlp["account"] =! "") {


   // } else {
   //     getblk(1);
   // }

}



function show(data) {
  let tab = 
      `<tr>
        <th>Hash</th>
        <th>Height</th>
        <th>Chain</th>
       </tr>`;
  
  // Loop to access all rows 
  for (let r of data) {
        tab += `
        <tr> 
          <td>${r.hash} </td>
          <td>${r.header.height}</td>
          <td>${r.header.chain}</td> 
        </tr>`;
  }
  // Setting innerHTML as tab variable
  document.getElementById("net").innerHTML = tab;

}

function show1(data) {
    let tab = 
    `<tr>
    <th>Account</th>
    <th>Balance</th>
    <th>Smart contract</th>
    </tr>
`;

        tab +=`
          <tr> 
            <td>${data.Result.address} </td>
            <td>${data.Result.balance}</td>
            <td>${data.Result.smart_contract}</td> 
          </tr>`;
    
    // Setting innerHTML as tab variable
    document.getElementById("acc").innerHTML = tab;
  
  }

function App() {
    const windowUrl = window.location.search;
    const params = new URLSearchParams(windowUrl);
    let main = params.get("id");
    let accpar = params.get("acc");

    console.log(main);


    if (accpar != null) { 
        
        let getac = getacc(accpar);
        console.log(getac);
        return (
            <div className="App">
                  <h1>Redstone Network Accounts</h1>
                  <p>Account: {accpar} </p>
                  <table class="table1" id="acc">
                        Coult not find  {accpar}?
                        Please try again!
                </table>
            </div>
        );
        
    }   

    if (main == null) {
    getblk(1);
    return (
    <div className="App">
          <h1>Redstone Network</h1>
          <p>
          </p>
        <section class="section">
        <div class="container">
            <div class="columns">
                <div class="column is-one-quarter">
                    <div class="column curve-box">
                        <div class="curve-box-inner">
                            <h1 class="subtitle is-4"><span id='supply'></span> RS</h1>
                            <p>Total supply</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="columns">
                <div class="column is-one-quarter">
                    <div class="column curve-box">
                        <div class="curve-box-inner">
                            <h1 class="subtitle is-4"><span id='supply'></span>0</h1>
                            <p>Chains</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="column is-one-quarter">
                    <div class="column curve-box">
                        <div class="curve-box-inner">
                            <h1 class="subtitle is-4"><span id='supply'></span>0</h1>
                            <p>Transactions</p>
                        </div>
                    </div>
                </div>
            </div>
            <br></br>
            <div class="column">
                <div class="column curve-box">
                    <div class="curve-box-inner">
                        <table class="table" id="net">
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </section>
    </div>
    );
    } 
}

export default App;
