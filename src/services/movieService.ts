import axios from "axios";
import type { Movie } from "../types/movie";

interface MoviesHttpResponse {
  results: Movie[];
  total_pages: number;
}

export async function fetchMovies(
  query: string,
  page: number
): Promise<MoviesHttpResponse> {
  const myKey = import.meta.env.VITE_TMDB_TOKEN;
  const BASE_URL: string = "https://api.themoviedb.org/3/search/movie";

  try {
    const response = await axios.get<MoviesHttpResponse>(BASE_URL, {
      params: {
        query,
        page,
      },
      headers: {
        Authorization: `Bearer ${myKey}`,
      },
    });
    return response.data;
  } catch {
    throw new Error("Fetch failed");
  }
}
