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
function gettx(tx) {
  fetch('http://0.0.0.0:1234/tx/' + tx)
  .then(function(response) {
    console.log(response);
    return response.json();
  })
  .then(function(myJson) {
    console.log(myJson);
    show2(myJson);
  });
}

function getblkhash(acc) {
  fetch('http://0.0.0.0:1234/block/' + acc)
  .then(function(response) {
    console.log(response);
    return response.json();
  })
  .then(function(myJson) {
    console.log(myJson);
    show3(myJson);
  });
}
function show3(data) {
  let tab = 
  `<tr>
  <th>Hash</th>
  <th>Heigt</th>
  <th>Chain</th>
  <th>Parent hash</th>
  <th>Uncle root</th>
  </tr>
`;

      tab +=`
        <tr> 
          <td>${data.hash} </td>
          <td>${data.header.height}</td>
          <td>${data.header.chain}</td> 
          <td>${data.header.parent_hash}</td> 
          <td>${data.header.uncle_root}</td>  
        </tr>`;
  let tab_tx =
  `<tr>
    <th>From</th>
    <th>Amount</th>
    <th>To</th>
    <th>Hash</th>
  </tr>
  `;
  for (let r of data.transactions) {
    tab_tx += `
      <tr>
      <td> <a href="?acc=${r.sender}"> ${r.sender}</a> </td>
      <td>${r.amount}</td>
        <td> <a href="?acc=${r.reciver}"> ${r.reciver}</a> </td>
        <td> <a href="?tx=${r.hash}"> ${r.hash}</a> </td>
      </tr>
    `;
  }
  
  // Setting innerHTML as tab variable
  document.getElementById("blk").innerHTML = tab;
  document.getElementById("blk_tx").innerHTML = tab_tx;





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
          <td> <a href="?blk=${r.hash}"> ${r.hash}</a> </td>
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
let tab1 = 
`<tr>
<th>From</th>
<th>Amount</th>
<th>To</th>
</tr>
`;
        tab +=`
          <tr> 
            <td>${data.Result.address} </td>
            <td>${data.Result.balance}</td>
            <td>${data.Result.smart_contract}</td> 
          </tr>`;
          fetch('http://127.0.0.1:1234/acc_history_rec/' + data.Result.address) 
          .then(function(response) {
            console.log(response);
            return response.json();
          })
          .then(function(myJson) {
            console.log(myJson);
            for (let r of myJson) {
              tab1 += `
                <tr>
                <td> <a href="?acc=${r.sender}"> ${r.sender}</a> </td>
                <td>${r.amount}</td>
                  <td> <a href="?acc=${r.reciver}"> ${r.reciver}</a> </td>
                </tr>
              `;
            }
          })
          fetch('http://127.0.0.1:1234/acc_history_sender/' + data.Result.address) 
          .then(function(response) {
            console.log(response);
            return response.json();
          })
          .then(function(myJson) {
            console.log(myJson);
            for (let r of myJson) {
              tab1 += `
                <tr>
                <td> <a href="?acc=${r.sender}"> ${r.sender}</a> </td>
                <td>${r.amount}</td>
                  <td> <a href="?acc=${r.reciver}"> ${r.reciver}</a> </td>
                </tr>
              `;
            }
          })
    document.getElementById("acc").innerHTML = tab;
  
}
function show2(data) {
  let tab = 
  `<tr>
  <th>From</th>
  <th>Amount</th>
  <th>To</th>
  <th>Hash</th>
  </tr>
`;

      tab +=`
        <tr> 
        <td> <a href="?acc=${data.sender}"> ${data.sender}</a> </td>
        <td>${data.amount}</td>
          <td> <a href="?acc=${data.reciver}"> ${data.reciver}</a> </td>
          <td>${data.hash}</td> 

        </tr>`;
  
  // Setting innerHTML as tab variable
  document.getElementById("tx").innerHTML = tab;

}
function search() {
  // get option of what_to_search
  let op = document.getElementById("what_to_search").option;
  // get value of search_thing
  let input = document.getElementById("search_thing").value;
  // opens link wiht option and input
  window.location.href = "/?" + op +  "=" + input;
}
function App() {
    const windowUrl = window.location.search;
    const params = new URLSearchParams(windowUrl);
    let main = params.get("id");
    let accpar = params.get("acc");
    let blk = params.get("blk");
    let tx = params.get("tx");

    console.log(main);


    if (accpar != null) { 
        let getac = getacc(accpar);
        console.log(getac);
        return (
            <div className="App">
                  <h1>Redstone Network Account: {accpar}</h1>
 
                <a href="/">Go back</a>

                <div class="center">
                  <table class="table1" id="acc">
                        Coult not find  {accpar}?
                        Please try again!
                </table>
                </div>
            </div>
        );
    }   
    if (tx != null) {
      let gettx1 = gettx(tx);
      console.log(gettx);
        return (
            <div className="App">
                  <h1>Redstone Network Transaction: {tx}</h1>
                  <a href="/">Go back</a>
                  <div class="center">
                    <table class="table1" id="tx">
                            Coult not find  {tx}?
                            Please try again!
                    </table>
                  </div>
            </div>
        );
    }
    if (blk != null) { 
      getblkhash(blk);
      console.log(blk);
      return (
          <div className="App">
                <h1>Redstone Network Block Hash: {blk}</h1>
                <a href="/">Go back</a>
                <div class="center">
                <table class="table1" id="blk">
                      Coult not find  {accpar}?
                      Please try again!
                </table>
                </div>
                <h1>Transactions</h1>
                <table class="table1" id="blk_tx">
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
      <div class="topnav">
        <a href="#about">Redstone Network Explorer</a>
        <div class="search-container">
          <form onsubmit="search()">
              <input type="text" id="search_thing" placeholder="Search block hash" name="blk"/>
              <button onclick="search()">Search</button>          </form>
        </div>
      </div>
      
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
