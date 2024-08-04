import {useState, useContext, useEffect} from "react";
import './App.css';
import NavBar from './Store/NavBar';
import NavDuration from './Store/NavDuration';
import LineChart from './components/LineChart';

const OPTION_MONTH_DAY = {
	day: "numeric",
	month: "long",
};

const OPTION_MONTH_YEAR = {
	year: "numeric",
	month: "short",
	day: "numeric",
};

function App() {  
  const navItems = ['bitcoin', 'ethereum', 'bitcoin-cash', 'eos','stellar','litecoin','cardano','tether','iota','tron','ethereum-classic','monero','neo','dash', 'binance-coin','nem','tezos',
    'zcash','omisego','vechain','qtum','0x','bitcoin-gold','bytecoin-bcn','bitshares','lisk','decred','zilliqa','aeternity','maker','digibyte','icon','ontology','dogecoin','augur','steem',
    'moac','verge','siacoin','bytom'];
  // créer une classe
  // ou aller chercher l'id
  const Intervals = ["1 Week","1 Month","3 Months","6 Months","1 Year"];
  const nbDayIntervals =[7,30,90,180,365];
  const [currentCurrency, setCurrentCurrency] = useState(null);
  const [currencyAssets, setCurrencyAssets] = useState(null); // Add state to store fetched data
  const [currentInterval, setCurrentInterval] = useState(null);
  const [currencyHistory, setCurrencyHistory] = useState(null); // Add state to store fetched data
  const [currencies, setCurrencyList] = useState([]);

  const fetchCurrencyList = async (currencies) => {
    //dataT.data.map((item) => {return item.name});
    // Replace with the actual API endpoint and fetch logic
    const response = await fetch(`https://api.coincap.io/v2/assets`);
    const data = await response.json();
    setCurrencyList(data.data.map((item) => {return item.id}));
  };

  const fetchCurrencyAssets = async (currencyAssets) => {
    // Replace with the actual API endpoint and fetch logic
    const response = await fetch(`https://api.coincap.io/v2/assets/${currentCurrency}`);
    const data = await response.json();
    setCurrencyAssets(data);
  };

  const fetchCurrencyHistory = async (currencyHistory) => {
    // Replace with the actual API endpoint and fetch logic
    const start = new Date();
    // Lib moment
    // conversion UTC
		start.setDate(
			start.getDate() - nbDayIntervals[currentInterval]
		);
		const end = new Date();
    const response = await fetch(`https://api.coincap.io/v2/assets/${currentCurrency}/history?interval=d1&start=${start.getTime()}&end=${end.getTime()}`);
    const data = await response.json();
    console.table(data);
    setCurrencyHistory(data);
  };

  const generateLabels = () => {
		console.log(currentInterval);
		let options =
    currentInterval === "1 Week" || "1 Month"
				? OPTION_MONTH_DAY
				: OPTION_MONTH_YEAR;
		return currencyHistory.map((item) => {
			const date = new Date(item.date);
			return date.toLocaleString(
				"en-US",
				options
			);
		});
	};

  useEffect(() => {
    if (currentCurrency) {
      fetchCurrencyAssets(currentCurrency);
    }
  }, [currentCurrency]);
  useEffect(() => {
    if (currentInterval) {
      fetchCurrencyHistory(currentInterval);
    }
  }, [currentInterval]);

  useEffect(() => {
    if (currencies) {
      fetchCurrencyList(currencies);
    }
  }, [currencies]);

  return (
    <main> 
      <div className="App">
        <h1>Crypto statistics - Dashboard</h1>
        <div className="MainContainer">
          <div className="crypto"> 
            <NavBar items={currencies} setCurrentCurrency={setCurrentCurrency} />  
          </div>
          <section> 
          </section>
          <section className="container">
            <div className="duration">
              <NavDuration items={Intervals} setCurrentInterval={setCurrentInterval} /> 
              {currentCurrency && <h2>{currentCurrency}   {currencyAssets ? currencyAssets.data.symbol : 'none'}</h2>} 
            </div>
            <div className="rank">   
              <h1>Rank  #{currencyAssets ? currencyAssets.data.rank : 'none'}</h1>
              <h1>Price  {currencyAssets ? Math.round(currencyAssets.data.priceUsd*100)/100 : 'none'} USD</h1>
            </div>
          </section>
          <section className="container2">
            <div className="chart">
              
            </div>
            <div className="table">
              <div className="statgeneral1">
                <h2>Market Cap</h2>
                <p> {currencyAssets ? Math.round(currencyAssets.data.marketCapUsd,7)/1000000000 : 'none'} T USD</p>
              </div>
              <div className="statgeneral2">
                <h2>24h Volume</h2>
                <p> {currencyAssets ? Math.round(currencyAssets.data.volumeUsd24Hr,7)/1000000000 : 'none'} T USD</p>
              </div>
              <div className="statgeneral3">
                <h2>Available for trading {currencyAssets ? currencyAssets.data.symbol : 'none'}</h2>
                <p> {currencyAssets ? Math.round(currencyAssets.data.supply,7)/1000000 : 'none'} B USD</p>
              </div>
              <div className="statgeneral4">
                <h2>Volume Weighted Average {currencyAssets ? currencyAssets.data.symbol : 'none'}</h2>
                <p> {currencyAssets ? Math.round(currencyAssets.data.vwap24Hr*100,7)/100 : 'none'} USD</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default App;
