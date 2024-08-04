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
  // créer une classe
  // ou aller chercher l'id
  class Intervals {
    constructor(name, nbDays) {
      this.name = name;
      this.nbDays = nbDays;
    }
  }
  const INTERVALS = [new Intervals("1 Week", 7),new Intervals("1 Month", 30),new Intervals("3 Months", 90),new Intervals("6 Months", 180),new Intervals("1 Year", 365)];
  const [currentCurrency, setCurrentCurrency] = useState(null);
  const [currencyAssets, setCurrencyAssets] = useState(null); // Add state to store fetched data
  const [currentInterval, setCurrentInterval] = useState('1 Week');
  const [currencyHistory, setCurrencyHistory] = useState(null); // Add state to store fetched data
  const [currencies, setCurrencyList] = useState([]);

  Date.prototype.ajouteJours = function(jours) {
    this.setDate(this.getDate() - jours);
    return this;
  };

  const fetchCurrencyList = async (currencies) => {
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
    let start = new Date();
    // Lib moment
    // conversion UTC
		console.log("Date initiale : " + start.toLocaleDateString());
    const intervalValue = INTERVALS.find(interval => interval.name === currentInterval).nbDays;
    start.ajouteJours(intervalValue);
    console.log('start.getTime')
    console.log(start.getTime())
		const end = new Date();
    console.log('end.getTime')
    console.log(end.getTime())
    const response = await fetch(`https://api.coincap.io/v2/assets/${currentCurrency}/history?interval=d1&start=${start.getTime()}&end=${end.getTime()}`);
    const data = await response.json();
    console.table(data);
    setCurrencyHistory(data.data.map((item) => {return item.priceUsd}));
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
    if (currentInterval && currentCurrency) {
      fetchCurrencyHistory(currentInterval, currentCurrency);
      console.log(currentInterval);
      console.log(currentCurrency);
    }
  }, [currencyHistory]);

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
              <NavDuration items={INTERVALS.map((item) => {return item.name})} setCurrentInterval={setCurrentInterval} /> 
              {currentCurrency && <h2>{currentCurrency}   {currencyAssets ? currencyAssets.data.symbol : 'none'}</h2>} 
            </div>
            <div className="rank">   
              <h1>Rank  #{currencyAssets ? currencyAssets.data.rank : 'none'}</h1>
              <h1>Price  {currencyAssets ? Math.round(currencyAssets.data.priceUsd*100)/100 : 'none'} USD</h1>
            </div>
          </section>
          <section className="container2">
            <div className="chart">
              <p>{currencyHistory}</p>
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
