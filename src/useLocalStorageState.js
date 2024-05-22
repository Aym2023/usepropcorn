import {useEffect, useState} from 'react';

export  function useLocalStorageState(intitialState, key) {
   const [value, setValue] = useState(function() {
    const  storedValue = localStorage.getItem(key);
     return storedValue ? JSON.parse(storedValue) : intitialState; 
  });

  useEffect(
    function (){
        localStorage.setItem(key.JSON.stringify(value));
    },
    [value, key]
  );
  return [value, setValue];
}