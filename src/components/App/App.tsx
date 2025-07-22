import css from "./App.module.css";
import MovieGrid from "../MovieGrid/MovieGrid";
import SearchBar from "../SearchBar/SearchBar";
import type { Movie } from "../../types/movie";
import { useState } from "react";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import { fetchMovies } from "../../services/movieService";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import MovieModal from "../MovieModal/MovieModal";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useEffect } from "react";
import Pagination from "../Pagination/Pagination";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query.trim() !== "",
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (data && data.results.length === 0) {
      toast("No movies found for your request.", {
        duration: 2000,
        position: "top-right",
        icon: "⚠️",
      });
    }
  }, [isSuccess, data]);

  const handleSearch = async (query: string) => {
    setQuery(query);
    setPage(1);
  };

  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleClose = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={css.app}>
      <Toaster />
      <SearchBar onSubmit={handleSearch} />
      {isSuccess && data?.results.length > 0 && totalPages > 1 && (
        <Pagination page={page} total={totalPages} onChange={setPage} />
      )}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <ErrorMessage />
      ) : (
        data?.results !== undefined && (
          <MovieGrid onSelect={handleSelect} movies={data?.results} />
        )
      )}
      {selectedMovie !== null && (
        <MovieModal onClose={handleClose} movie={selectedMovie} />
      )}
    </div>
  );
}
