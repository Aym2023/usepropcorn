import { useEffect, useRef, useState } from "react";
import StarsRating from "./StarsRating";
import useMovies from './useMovies';


const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);


export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectId] = useState(null);
  const [moveis, error, isloading] = useMovies(query);
  const [watched, setWatched] = useLocalStorageState([]);



  function handelSelectMovei(id) {
    setSelectId((selectedId) => (id === selectedId ? null : id));
  }

  function handelCloseMovei() {
    setSelectId(null);
  }

  function handelAddWatched(movei) {
    setWatched((watched) => [...watched, movei]);
    // localStorage.setItem('watched', JSON.stringify([...watched, movei]));
  }

  function handelDeletedWtched (id) {
    setWatched((watched) => watched.filter((movei) => movei.imdbID !== id));
  }

  
  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {/* {isloading ? <Loading /> : <MovieList movies={movies} />} */}
          {isloading && <Loader />}
          {error && <ErrorMessage message={error} />}
          {!error && !isloading && (
            <MovieList
              movies={movies}
              onSelectMovei={handelSelectMovei}
              onCloseMovei={handelSelectMovei}
              selectedId={selectedId}
            />
          )}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMoveiB={handelCloseMovei}
              onAddWatched={handelAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WachtedSummary watched={watched} />
              <WachtedMoviesList watched={watched} onDeletedWatched={handelDeletedWtched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔️</span>
      {message}
    </p>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  useEffect(
    function () {
    function callback (e) {
     if(document.activeElement === inputEl.current) 
        return;
    if (e.code === 'Enter') {
      inputEl.current.focus();
      setQuery('');
    }
    }

    document.addEventListener('Keydown', callback);
    return () => document.addEventListener('downkey', callback);
  }, [setQuery]
);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, onSelectMovei, onCloseMovei, selectedId }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          onSelectMovei={onSelectMovei}
          onCloseMovei={onCloseMovei}
          selectedId={selectedId}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovei, onCloseMovei, selectedId }) {
  return (
    <li onClick={() => onSelectMovei(selectedId ? movie.imdbID : onCloseMovei)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({ selectedId, onCloseMoveiB, onAddWacted, watched }) {
  const [movei, setMovie] = useState({});
  const [isloading, setIsloading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const isWatched = watched.map((movei) => movei.imdbID).includes(selectedId);

  const WatchedUserRating = watched.find((movei) => movei.imdbID === selectedId)?.userRating;

  const countRef = useRef(0) ;

  useEffect(
     function () {
     if (userRating) countRef.current++;

  },
   [userRating]
  );

  const {
    Title: title,
    Actors: actors,
    Poster: poster,
    Director: director,
    Genre: genre,
    Plot: plot,
    Released: released,
    Runtime: runtime,
    Year: year,
    imdbRating,
  } = movei;

  function handelAdd() {
    const getMovieWatched = {
      imdbID: selectedId,
      Poster: poster,
      Runtime: runtime,
      Year: year,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime),
      userRating,
      userRatingDectuons: countRef.current,
    };

    onAddWacted(getMovieWatched);
    onCloseMoveiB();
  }

  useEffect(function () {
     function callback (e) {
        if(e.code === 'Escape') {
          onCloseMoveiB();
        }
    }

    document.addEventListener('keydown' , callback);

    return function () {
      document.addEventListener('keydown' ,callback);
    }
  },
   [onCloseMoveiB]
  );

  useEffect(
    function () {
      async function setMoviedetails() {
        setIsloading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );

        const data = await res.json();
        console.log(data);
        setMovie(data);
        setIsloading(false);
      }
      setMoviedetails();
    },
    [selectedId]
  );

  useEffect(function () {
    if (!title) return;
    document.title =`movei | ${title}`;
 
   return function  () {
    document.title ='usepopcorn';
  }
  }, [title]
);

  return (
    <div className="details">
      {isloading ? (
        <Loader />
      ) : (
        <>
          <header>
            <buuton btn-back className="btn-back" onClick={onCloseMoveiB}>
              &larr;
            </buuton>
            <div className=".details-overview">
              <h2>{title}</h2>
              <img src={poster} alt={`Poster of ${movei} movie`} />
              <p>
                {released} &bull;{runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>🌟{imdbRating} IMDB rating</span>
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? ( 
                <>
               <StarsRating
                size={24}
                maxRating={10}
                onSetrating={setUserRating}
              />
              {userRating > 0 && (
                <button className="btn-add" onClick={handelAdd}>
                  Add to List
                </button>
              )}
             </>
              ) : (
            <p>you rated with movei{WatchedUserRating} <span>🌟</span></p>    
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Staring {actors}</p>
            <p>Directed by {director}</p>
          </section>
          {selectedId}
        </>
      )}
    </div>
  );
}

// function WatchedBox() {
//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//       )}
//     </div>
//   );
// }

function WachtedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WachtedMoviesList({ watched, onDeletedWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
         movie={movie}
         key={movie.imdbID} 
         onDeletedWatched={onDeletedWatched} 
         />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeletedWatched}) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button btn-delete onClick={() => onDeletedWatched(movie.imdbID) }>X</button>
      </div>
    </li>
  );
}
