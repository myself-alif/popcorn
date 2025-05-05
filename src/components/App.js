import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import Main from "./Main";
import Logo from "./Logo";
import Search from "./Search";
import NumResults from "./NumResults";
import Box from "./Box";
import MovieList from "./MovieList";
import WatchedSummery from "./WatchedSummery";
import WatchedMovieList from "./WatchedMovieList";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import MovieDetails from "./MovieDetails";

const API_URL = "http://www.omdbapi.com/?apikey=ab2296df&";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [movie, setMovie] = useState({});
  const [watched, setWatched] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedID, setSelectedID] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    if (query.length <= 1) {
      setMovies([]);
      setError("Search for movies");
      return;
    }
    setIsLoading(true);
    setError("");
    setSelectedID(null);

    (async function () {
      try {
        const res = await fetch(`${API_URL}s=${query}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Something went wrong");

        const data = await res.json();
        if (data.Response === "False") throw new Error("No movie found");

        setMovies(data.Search);
        setError("");
      } catch (error) {
        if (error.name !== "AbortError") setError(error.message);
      } finally {
        setIsLoading(false);
      }
    })();

    return () => controller.abort();
  }, [query]);

  function handleMovieSelection(id) {
    setSelectedID((val) => (val === id ? null : id));
  }
  function handleCloseMovie() {
    setSelectedID(null);
  }

  function handleAddWatched(movie) {
    setWatched((val) => [...val, movie]);
    setSelectedID(null);
  }

  function handleDeleteWatched(id) {
    setWatched((val) => val.filter((item) => item.imdbID !== id));
  }

  useEffect(() => {
    function handleClose(e) {
      if (e.code === "Escape") handleCloseMovie();
    }
    document.addEventListener("keydown", handleClose);

    return () => document.removeEventListener("keydown", handleClose);
  }, [handleCloseMovie]);

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : (
            <MovieList
              movies={movies}
              handleMovieSelection={handleMovieSelection}
            />
          )}
        </Box>
        <Box>
          {selectedID ? (
            <MovieDetails
              selectedID={selectedID}
              handleCloseMovie={handleCloseMovie}
              movie={movie}
              setMovie={setMovie}
              API_URL={API_URL}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummery watched={watched} />
              <WatchedMovieList
                watched={watched}
                handleDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
