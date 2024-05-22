  import {useEffect, useState} from 'react';

   export default function  useMovies() {
    const [movies, setMovies] = useState([]);
    const [isloading, setIsloading] = useState(false);
    const [error, setError] = useState("");
  
    const KEY = "a0254084";

    useEffect(
        function () {
          const controller = new  AbortController();
    
          async function fetchMoveis() {
            try {
              setIsloading(true);
              setError("");
              const res = await fetch(
                `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, {signal: controller.signal}
              );
              if (!res.ok)
                throw new Error("Something went wrong with fetching moveis");
    
              const data = await res.json();
              if (data.Response === "false") throw new Error("Movie not found");
              setMovies(data.Search);
            } catch (err) {
              console.log(err.message);
              setError(err.message);
            } finally {
              setIsloading(false);
            }
            if (query.length < 3) {
              setMovies([]);
              setError("");
              return;
            }
          }
          fetchMoveis();
    
          return function () {
            controller.abort();
          };
        },
        [query]
      );

 return {movies, error, isloading};
}