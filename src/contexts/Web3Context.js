import React, { createContext, useContext, useEffect, useState } from "react";
import Web3 from "web3";

const Web3Context = createContext();

export const TOKEN_CONTRACT = "0xe6258238e9AB0FFDd331AE6441201d2E666756bd";
export const ISSURANCE_CONTRACT = "0xc7f0c506C9DaFCB5ec4938E2Df61ec6c700e6bfE";

export const Web3Provider = ({ children }) => {
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [library, setLibrary] = useState(null);

  // first load
  useEffect(() => {
    const web3 = new Web3(window.web3.currentProvider);
    setLibrary(web3);

    // for debug
    window.god = web3;
  }, []);

  // update EUR balance
  useEffect(() => {
    if (isLogin()) {
      getEURBalance();
    }
  }, [address]);

  const isLogin = () => {
    return !!address;
  };

  const login = () => {
    window.ethereum.enable().then((addresses) => setAddress(addresses[0]));
  };

  const getEURBalance = () => {
    if (isLogin()) {
      library.eth.call(
        {
          to: TOKEN_CONTRACT,
          data: "0x70a08231000000000000000000000000" + address.slice(2),
        },
        (_, data) => {
          const x = parseInt(data, 16) / 1e18;
          setBalance(x);
        }
      );
    } else {
      alert("Please login to metamask.");
    }
  };

  return (
    <Web3Context.Provider
      value={{
        address: address,
        login: login,
        isLogin: isLogin,
        balance: balance,
        library: library,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3ContextState = () => useContext(Web3Context);
