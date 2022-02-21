import logo from "./logo.svg";
import "./App.css";
import React from "react";
import web3 from "./web3";
import lottery from "./lottery";

class App extends React.Component {
  
  // if the constructor is only used for initialising the state then we can ommit
  // the contructor below :
  //constructor(props) {
  //  super(props);
  //  this.state = {manager : ''};
  //}
  // and define a variable as state inside our class 
  // inside the constructor
  
  state = {
    manager :'',
    players : [],
    balance : '',
    value : '',
    message : ''
  };
  
  
  async componentDidMount() {
    // this will be fired once when the component is created
    // inside this metamask provider we dont need to provide the {from : accounts[0]}
    // that we did inside the tests. the account will be taken directly from metamask
    // so from is going to be the account connected at any given point.
    // But this applies only for call().   
    const manager= await lottery.methods.manager().call(); 
    const players = await lottery.methods.getPlayers().call();
    // the balance returned below is BN big Number
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({manager, players, balance});
  }

  // we define onSubmit like this so that we dont need to bind it to the form 
  // that is calling it. event is the form submission.
  onSubmit = async (event) => {
    // her we prevent the from to be submitted in the classic html way
    event.preventDefault()

    // we will update a state value here informing the user of the status of the application
    this.setState({message:'Waiting for transaction success!'});

    // since we want to send a transaction here we need to know from which account it will 
    // be sent 
    const accounts = await web3.eth.getAccounts();
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value,'ether')
    });

    this.setState({message:'Your amount has been entered inside the lottery'});
    

  };

  onClick = async () => {
    this.setState({message:'Waiting for transaction success!'});
    const accounts = await web3.eth.getAccounts();
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
    this.setState({message:'A winner has been picked!!!! Its you!'});
  };

  render() { 
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This Contract is managed by {this.state.manager}.
          There are currently {this.state.players.length} people entered competing 
          to win {web3.utils.fromWei(this.state.balance,'ether')} ether!
        </p>

        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of Ether to enter</label>
            <input 
              value = {this.state.value}
              onChange={event => this.setState({value : event.target.value})}
            />
          </div>
          <button>Enter</button>
        </form>

        <hr />

        <h1>{this.state.message}</h1>

        <hr />
          <h4>Ready for picking a winner</h4>
          <button onClick={this.onClick}>Boom!</button> 

      </div>
    );
  }
}
export default App;


//web 3 console logs

    //const account = await web3.eth.getAccounts();
    //console.log('account :' + account[0] );
    //web3.eth.defaultAccount = account[0];
    //lottery.defaultAccount = account[0];
    // console.log(web3.eth.defaultAccount);
    // web3.eth.defaultChain = "ropsten";
    // console.log(web3.eth.defaultChain);
    //console.log(lottery.defaultAccount);
    //lottery.defaultChain = 'ropsten';
    //console.log(lottery.defaultChain);
    //console.log(lottery.options.address);
    //web3.eth.net.getId().then(console.log);
   // we can use either this this.setState({manager : manager})
    // or the below as it is es2015 syntax    
    //console.log('lottery :' + lottery);
    //console.log(manager);
        //console.log(web3.version);
    //console.log(web3.eth.currentProvider);
    //web3.eth.getAccounts().then(console.log);
    //console.log(web3.eth.defaultAccount);
    //console.log("state : " + this.state.manager)
