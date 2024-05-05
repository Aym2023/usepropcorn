import React from 'react';
import ReactDOM from 'react-dom/client';
// import {useState} from 'react';
import './index.css';
import App from './App';

// import StarsRating from './StarsRating';
// import TextExpand from './TextExpand';

// function Test () {
//   const [moveiRating, setMoveiRating] = useState(0);

//   return (
//   <div>
//       <StarsRating color='blue' maxRating={10} onSetRating={setMoveiRating} />
//     <p>This movei was rated {moveiRating} stars</p>
//   </div>
//   );
// }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

{/* //     <StarsRating  */}
{/* //     maxRating={5} 
//     messages={['Treibble', 'bad', 'Good', 'Okay', 'Ecxellent']}
//     /> */}

   {/* <StarsRating  
    size = '24' 
    color='red' 
    className='test' 
    defaultrating={2}
     />
    <Test  />
 <TextExpand />   */}

         < App />
  </React.StrictMode>
);

