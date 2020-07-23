import React, { Component, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import { StripeProvider, Elements } from "react-stripe-elements";
import products from "products.json";
import numeral from "numeral";
import CardForm from "./form";
import {
  useWeb3ContextState,
  TOKEN_CONTRACT,
  ISSURANCE_CONTRACT,
} from "contexts/Web3Context";
import { buyCalldata, claimCalldata } from "calldata";

const Article = styled.article`
  padding: 100px 20px 20px;
  width: 900px;
  margin: 0 auto;
  color: #fff;
`;

const Product = styled.div`
  display: flex;
  color: #000;
`;

const Details = styled.div`
  flex-glow: 1;
  padding-left: 20px;
  color: #fff;
`;

const CheckoutForm = styled.div`
  padding: 20px;
  border: 2px solid #39a065;
  background: #fff;
  margin-top: 30px;
  border-radius: 4px;
  color: #000;
`;

const Option = styled.div`
  margin-bottom: 8px;

  span {
    margin-left: 10px;
  }
`;

const Purchase = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
  color: #fff;
`;

const BalanceContainer = styled.div`
  display: flex;
`;

export default ({ match }) => {
  const vendorCode = match.params.vendorCode;
  const product = products[vendorCode];
  const { address, login, balance, library, isLogin } = useWeb3ContextState();
  const [haveTicket, setHaveTicket] = useState(false);

  useEffect(() => {
    if (isLogin()) {
      checkIssurance(vendorCode);
    }
  }, [address, vendorCode]);

  const callFaucet = () => {
    if (isLogin()) {
      library.eth.sendTransaction(
        {
          from: address,
          to: TOKEN_CONTRACT,
          data: "0x8d0033c3",
        },
        (err, result) => {
          if (err) {
            alert(err);
          } else {
            alert(result);
          }
        }
      );
    } else {
      alert("Please login to metamask.");
    }
  };

  const buy = (id) => {
    if (isLogin()) {
      // get hash
      library.eth.call(
        {
          to: ISSURANCE_CONTRACT,
          data: `0x3619112a000000000000000000000000${address.slice(
            2
          )}000000000000000000000000000000000000000000000000000000000000000${id}`,
        },
        (_, hash) => {
          // buy
          library.eth.sendTransaction(
            {
              from: address,
              to: ISSURANCE_CONTRACT,
              data: buyCalldata.replace(
                "b68bc513e988882a97ce6addf7aae0b585d162e7b9c3c6265f7d254eb936d12b",
                hash.slice(2)
              ),
            },
            (err, result) => {
              if (err) {
                alert(err);
              } else {
                alert(result);
              }
            }
          );
        }
      );
    } else {
      alert("Please login to metamask.");
    }
  };

  const checkIssurance = (id) => {
    if (isLogin()) {
      // get hash
      library.eth.call(
        {
          to: ISSURANCE_CONTRACT,
          data: `0x3619112a000000000000000000000000${address.slice(
            2
          )}000000000000000000000000000000000000000000000000000000000000000${id}`,
        },
        (_, hash) => {
          // check
          library.eth.call(
            {
              to: ISSURANCE_CONTRACT,
              data: `0x8993021b${hash.slice(2)}`,
            },
            (_, data) =>
              data && data.length > 840
                ? setHaveTicket(true)
                : setHaveTicket(false)
          );
        }
      );
    } else {
      alert("Please login to metamask.");
    }
  };

  const claim = (id) => {
    if (isLogin()) {
      // get hash
      library.eth.call(
        {
          to: ISSURANCE_CONTRACT,
          data: `0x3619112a000000000000000000000000${address.slice(
            2
          )}000000000000000000000000000000000000000000000000000000000000000${id}`,
        },
        (_, hash) => {
          // claim
          library.eth.sendTransaction(
            {
              from: address,
              to: ISSURANCE_CONTRACT,
              data: claimCalldata.replace(
                "b68bc513e988882a97ce6addf7aae0b585d162e7b9c3c6265f7d254eb936d12b",
                hash.slice(2)
              ),
            },
            (err, result) => {
              if (err) {
                alert(err);
              } else {
                alert(result);
              }
            }
          );
        }
      );
    } else {
      alert("Please login to metamask.");
    }
  };

  return (
    <Article>
      <Helmet>
        <title>Checkout</title>
      </Helmet>

      <Product>
        <div style={{ height: "150px" }}>
          <span
            style={{
              height: "100%",
              verticalAlign: "middle",
              display: "inline-block",
            }}
          ></span>
          <img
            src={product.image}
            style={{ maxHeight: "150px", verticalAlign: "middle" }}
            width="200"
            alt={product.product}
          />
        </div>

        <Details>
          <h2>{product.product}</h2>
          <p>{product.details}</p>
          <p>Date: {product.date}</p>
          <p>Departure: {product.departure}</p>
          <p>Arrival: {product.arrival}</p>

          <p>
            <b>
              Price: {numeral(product.price).format("0,0.00")}{" "}
              {product.currency}
            </b>
          </p>
        </Details>
      </Product>
      {!address ? (
        <button onClick={() => login()}>Login With Metamask</button>
      ) : (
        <>
          <p>Address: {address}</p>
          <BalanceContainer>
            <p>Balance: {balance} EUR</p>
            {balance < 20 ? (
              <button onClick={() => callFaucet()}>Faucet</button>
            ) : (
              React.null
            )}
          </BalanceContainer>
          <p>Have Issurance: {haveTicket ? "Yes" : "No"}</p>
          <button onClick={() => buy(vendorCode)} disabled={haveTicket}>
            Buy
          </button>
          <button onClick={() => claim(vendorCode)} disabled={!haveTicket}>
            Claim
          </button>
        </>
      )}
    </Article>
  );
};
