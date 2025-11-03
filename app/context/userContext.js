"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useFetch } from "../helpers/hooks";
import { fetchCurrency, fetchSiteSettings, getProfile } from "../helpers/backend";
import Cookies from "js-cookie";
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [otpPayload, setOtpPayload] = useState({});
  const [userdata,getUserdata,{loading:userLoading}]=useFetch(getProfile,{});
  const [user,setUser]=useState(userdata);
  const [settings, getSettings] = useFetch(fetchSiteSettings);
  const [currencies, setCurrencies] = useState([]);
  const [currency, setCurrency] = useState();
  const [currencySymbol, setCurrencySymbol] = useState('');
  const [currencyRate, setCurrencyRate] = useState(1);

  useEffect(() => {
    fetchCurrency().then(({ data }) => {
        const isDefault = data?.find(c => c.default === true);

        if (Array.isArray(data)) {
            setCurrencies(data);

            const savedCurrency = localStorage.getItem('currency') || isDefault?.code;

            const defaultCurrency = data.find(c => c.code === savedCurrency);

            if (defaultCurrency) {
                setCurrency(defaultCurrency.code);
                setCurrencySymbol(defaultCurrency.symbol);
                setCurrencyRate(defaultCurrency.rate);
                localStorage.setItem('currency', defaultCurrency.code);
            }
        } else {
            setCurrencies([]);
        }
    }).catch(error => {
        setCurrencies([]);
    });
}, []);

const changeCurrency = (code) => {
  const selectedCurrency = currencies.find(c => c.code === code);
  if (selectedCurrency) {
      setCurrency(selectedCurrency.code);
      setCurrencySymbol(selectedCurrency.symbol);
      setCurrencyRate(selectedCurrency.rate);
      localStorage.setItem('currency', selectedCurrency.code);
      Cookies.set('currency', selectedCurrency.code, { expires: 365 });
  }
};

const convertAmount = (amount) => {
  return (amount * currencyRate).toFixed(2);
};
//  i will send currency like USD/BDT then give me the symbol
const getCurrencySymbol = (currency) => {
  const selectedCurrency = currencies.find(c => c.code === currency);
  return selectedCurrency ? selectedCurrency.symbol : '';
}
const convertAmoutnWithCurrency = (amount, currency) => {
  const selectedCurrency = currencies.find(c => c.code === currency);
  return (amount * selectedCurrency?.rate).toFixed(2);
}

  useEffect(()=>{
    setUser(userdata);
 
  },[userdata])



  return (
    <UserContext.Provider
      value={{
        otpPayload,
        setOtpPayload,
        user,
        getUserdata,
        setUser,
        userLoading,
        settings,
        currencies,
        currency,
        currencySymbol,
        currencyRate,
        changeCurrency,
        convertAmount,
        getCurrencySymbol,
        convertAmoutnWithCurrency
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
