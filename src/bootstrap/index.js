import React from "react";
import { hot } from "react-hot-loader";
import Root from "../containers/Root";
import { Web3Provider } from "../contexts/Web3Context";

/**
 * Application
 * @return {*}
 * @constructor
 */
const App = () => (
  <Web3Provider>
    <Root />
  </Web3Provider>
);

export default hot(module)(App);
