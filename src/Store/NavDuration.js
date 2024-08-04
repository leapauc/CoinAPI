import {useEffect} from 'react';
import './NavDuration.css';
const default_interval='1 Week';

function NavDuration({ items, setCurrentInterval }) {

  const handleClick = (item) => {
    setCurrentInterval(item);
    console.log(`Current interval set to: ${item}`);
  };

  useEffect(() => {
    setCurrentInterval(default_interval);
  }, [setCurrentInterval]);
  
  return (
    <div className="duration">
        {items.map((item, index) => (
          <button key={index} onClick={() => handleClick(item)}>
            {item}
          </button>
        ))}
    </div>
  );
}

export default NavDuration;