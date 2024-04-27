import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import StarsRating from './StarsRating';
// import './index.css';./StarsRating
// import App from './App';

function Test () {
  const [moveiRating, setMoveiRating] = useState(0);

  return (
  <div>
      <StarsRating color='blue' maxrating={10} onSetRating={setMoveiRating} />
    <p>This movei was rated {moveiRating} stars</p>
  </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <StarsRating 
    maxrating={5} 
    messages={['Treibble', 'bad', 'Good', 'Okay', 'Ecxellent']}
    />
    <StarsRating 
    size = '24' 
    color='red' 
    className='test' 
    defaultrating={2}
    />
    <Test  />
  </React.StrictMode>
);

