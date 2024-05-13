import { useEffect, useState } from "react";
import StarsRating from "./StarsRating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "a0254084";

export default function App() {
  const [query, setQuery] = useState("inception");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isloading, setIsloading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectId] = useState(null);

  function handelSelectMovei(id) {
    setSelectId((selectedId) => (id === selectedId ? null : id));
  }

  function handelCloseMovei() {
    setSelectId(null);
  }

  function handelAddWatched(movei) {
    setWatched((watched) => [...watched, movei]);
  }

  function handelDeletedWtched (id) {
    setWatched((watched) => watched.filter((movei) => movei.imdbID !== id));
  }

  useEffect(
    function () {
      async function fetchMoveis() {
        try {
          setIsloading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
          );
          if (!res.ok)
            throw new Error("Something went wrong with fetching moveis");

          const data = await res.json();
          if (data.Response === "false") throw new Error("Movie not found");
          setMovies(data.Search);
        } catch (err) {
          console.error(err.message);
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
    },
    [query]
  );

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
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
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
    };

    onAddWacted(getMovieWatched);
    onCloseMoveiB();
  }

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
    document.title =`${title}`;

  }, [title])

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
          <span>{avgImdbRating.fix(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.fix(2)}</span>
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
