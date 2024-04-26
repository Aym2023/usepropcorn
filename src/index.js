import React from 'react';
import ReactDOM from 'react-dom/client';
import StarsRating from './StarsRating';
// import './index.css';./StarsRating
// import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <StarsRating maxrating={5} />
  </React.StrictMode>
);

