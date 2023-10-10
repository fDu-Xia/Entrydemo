import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { ethers } from 'ethers';

function App() {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [accountAddress, setAccountAddress] = useState('');
  const [accountBalance, setAccountBalance] = useState('');

  let signer: ethers.JsonRpcSigner | null = null;
  let provider;

  const ConnectMetamask = async () => {


    // Assuming input1 is defined somewhere in the scope of this function
    console.log(`Button 1 clicked with value: ${input1}`);
  
    if (window.ethereum == null) {
      console.log("MetaMask not installed")
      alert("MetaMask not installed！")
    } else {
      provider = new ethers.BrowserProvider(window.ethereum)
      signer = await provider.getSigner();
      const Network = await provider.getNetwork();
      if (Network.chainId !== BigInt(5)) { // Check if the connected network is Goerli (chainId 5)
        console.log("Please connect to the Goerli test network");
        alert("Please connect to the Goerli test network and switch your network to Goerli.");
        
        // 弹出 MetaMask 扩展以切换网络
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x5", // Goerli testnet chain ID
              chainName: "Goerli Test Network",
              nativeCurrency: {
                name: "Ether",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: ["https://goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID"], // Replace with your Infura project ID
            },
          ],
        });
        return;
      }
      alert("Connection successful!")

      // 读取钱包地址
      const accounts = await provider.send("eth_requestAccounts", []);
      const account = accounts[0]
      setAccountAddress(account); // Set the account address
      console.log(`钱包地址: ${account}`)

      // 读取ETH余额
      const balance = await provider.getBalance(signer.getAddress());
      setAccountBalance(ethers.formatUnits(balance)); // Set the account balance
      console.log(`以太坊余额： ${ethers.formatUnits(balance)}`)

    }
  };

  const TransferButton = async() => {
    console.log(`Button 2 clicked with value: ${input2}`);
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    if(accountBalance >= input1){
      if(signer!=null){
        await signer.sendTransaction({
          to: input2,
          value: ethers.parseUnits(input1)
        })
        console.log("transform succesfully!")
        alert("transform succesfully!")
        setInput1('');
        setInput2('');
        signer = null;
        setAccountAddress('Please reconnect MetaMask');
        setAccountBalance('Please reconnect MetaMask');
        alert("Please reconnect MetaMask to fetch account data.");
      }
    }
    else{
      console.log("Insufficient balance!")
      alert("Insufficient balance!");
    }
  };
  return (
    <div className="App">
      <button onClick={ConnectMetamask}>Connect Metamask</button>
      <div>
        <p>Account Address: {accountAddress}</p>
        <p>Account Balance (ETH): {accountBalance}</p>
      </div>
      <div>
        <input
          type="text"
          value={input1}
          onChange={(e) => setInput1(e.target.value)}
          placeholder="Enter Value in ETH"
        />
      </div>
      <div>
        <input
          type="text"
          value={input2}
          onChange={(e) => setInput2(e.target.value)}
          placeholder="Enter Receiver Address"
        />
      </div>
      <button onClick={TransferButton}>Tranasfer</button>
    </div>
  );
}

export default App;
