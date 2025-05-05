import { useState } from "react";
import Movie from "./Movie";

export default function MovieList({ movies, handleMovieSelection }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          handleMovieSelection={handleMovieSelection}
        />
      ))}
    </ul>
  );
}
