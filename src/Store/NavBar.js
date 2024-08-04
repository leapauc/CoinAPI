// src/NavBar.js
import {useEffect} from 'react';
import './NavBar.css';
const default_currency='bitcoin';
function NavBar({ items, setCurrentCurrency }) {

  const handleClick = (item) => {
    setCurrentCurrency(item);
    console.log(`Current currency set to: ${item}`);
  };

  useEffect(() => {
    setCurrentCurrency('bitcoin');
  }, [setCurrentCurrency]);
  
  return (
    <div className="nav-bar">
      <ul>
        {items.map((item, index) => (
          <li key={index} onClick={() => handleClick(item)}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NavBar;