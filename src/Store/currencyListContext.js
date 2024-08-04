import { useState, createContext } from "react";
import axios from "axios";

const BASE_URL = "https://api.coincap.io/v2";

class API {
	static get = (path) => {
		return axios.get(`${BASE_URL}${path}`);
	};
}
const currencyListContext = createContext({});

export const CurrencyListProvider = (props) => {
	const [currencyList, setCurrencyList] =
		useState([]);

	const getCurrencyList = () => {
		API.get("/assets")
			.then((res) => {
				setCurrencyList(res.data.data);
			})
			.catch((error) => {
				setCurrencyList([]);
				console.log(error);
			});
	};

	const values = {
		currencyList: currencyList,
		getCurrencyList: getCurrencyList,
	};

	return (
		<currencyListContext.Provider
			value={values}>
			{props.children}
		</currencyListContext.Provider>
	);
};

export default currencyListContext;