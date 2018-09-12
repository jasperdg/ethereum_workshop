import React, { Component } from 'react';
import './App.css';
import web3 from 'web3';
import abi from './abi.json';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      highestBidder: '',
      highestBid: 0,
      beneficiary: '',
      pendingReturns: 0,
      auctionEnded: false,
      bidValue:0
    }
    this.contractAddress = "0xd064b20dfe615127ed2d9e9e142225859a8af944"
    this.web3 = new web3(window.web3.currentProvider);
    this.contract = new this.web3.eth.Contract(abi ,this.contractAddress);
    this.account = false;
    this.getAccount();
    this.getAuctionData();
  }

  getAccount = async() => {
    this.account = (await this.web3.eth.getAccounts())[0];
  }

  getAuctionData = async () => {
    const highestBidder = await this.contract.methods.highestBidder().call();
    const highestBid = await this.contract.methods.highestBid().call();
    const beneficiary = await this.contract.methods.beneficiary().call();
    const pendingReturns = await this.contract.methods.getPendingReturns().call();
    this.setState({
      highestBidder,
      highestBid,
      beneficiary,
      pendingReturns
    })
  }

  placeBid = async () => {
    const placeBid = await this.contract.methods.bid().send({from: this.account, value: web3.utils.toWei(this.state.bidValue.toString(), "ether")})
    console.log(placeBid);
  }

  withdrawPending = async () => {
    const withdrawn = await this.contract.methods.withdraw().send({from: this.account});
    console.log(withdrawn);
  }

  endAuction = async () => {
    const auctionEnded = await this.contract.methods.auctionEnd().send({from: this.account});
    console.log(auctionEnded);
  }

  onInputChange = (e) => {
    e.preventDefault();
    this.setState({bidValue: e.target.value});
  }

  render() {
    return (
      <div className={`App`}>
        <header className="App-header">
          <h1 className="App-title">EthAuction</h1>
        </header>
        <div className="auction-data section"> 
          <p>Auction host: {this.state.beneficiary}</p>
          <p>Highest bidder: {this.state.highestBidder}</p>
          <p>Highest bid: {this.state.highestBid}</p>
        </div>
        <div className="bid-section section">
          <input onChange={this.onInputChange} value={this.state.bidValue} type="text"/>
          <button onClick={this.placeBid}>Place bid</button>
        </div>
        <div className="withdraw-section section">
          <p>Pending returns: {this.state.pendingReturns}</p>
          <button onClick={this.withdrawPending}>withdraw</button>
        </div>

        <button onClick={this.endAuction}>End Auction</button>
      </div>
    );
  }
}

export default App;
