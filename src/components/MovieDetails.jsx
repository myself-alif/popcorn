import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import Loader from "./Loader";

export default function MovieDetails({
  selectedID,
  handleCloseMovie,
  movie,
  setMovie,
  API_URL,
  onAddWatched,
  watched,
}) {
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  useEffect(() => {
    setIsLoading(true);
    (async function () {
      const res = await fetch(`${API_URL}i=${selectedID}`);
      const data = await res.json();
      setMovie(data);
      setIsLoading(false);
    })();
  }, [selectedID]);

  function handleAddition() {
    const watchedMovie = {
      imdbID: selectedID,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      userRating,
      runtime: Number(runtime.split(" ").at(0)),
    };
    onAddWatched(watchedMovie);
  }

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;
    return () => (document.title = "popcorn");
  }, [title]);

  const isAlreadyInTheWatchedList = watched.find(
    (item) => item.imdbID === selectedID
  );
  return isLoading ? (
    <Loader />
  ) : (
    <div className="details">
      <header>
        <button className="btn-back" onClick={handleCloseMovie}>
          &larr;
        </button>
        <img src={poster} alt="Poster" />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>{released}</p> &bull; {runtime}
          <p>{genre}</p>
          <p>
            <span>⭐</span>
            {imdbRating} IMDb rating
          </p>
        </div>
      </header>
      <section>
        <div className="rating">
          {isAlreadyInTheWatchedList ? (
            <p>
              You gave this movie a {isAlreadyInTheWatchedList.userRating} ⭐
            </p>
          ) : (
            <StarRating
              maxRating={10}
              starSize={24}
              onSetRating={setUserRating}
            />
          )}
          {userRating !== "" && (
            <button className="btn-add" onClick={handleAddition}>
              + Add to list
            </button>
          )}
        </div>
        <p>
          <em>{plot}</em>
        </p>
        <p>Starring {actors}</p>
        <p>Directed by {director}</p>
      </section>
    </div>
  );
}
