import axios from 'axios';

// Endpoints used in this app:
// /movie/popular, /movie/now_playing, /movie/top_rated, /movie/upcoming, /search/movie, /genre/movie/list

const apiKey = process.env.REACT_APP_TMDB_API_KEY;
const baseURL = process.env.REACT_APP_TMDB_API_BASE || 'https://api.themoviedb.org/3';
const defaultLanguage = process.env.REACT_APP_TMDB_LANGUAGE || 'ko-KR';
const defaultRegion = process.env.REACT_APP_TMDB_REGION || 'KR';

if (!apiKey) {
  // 표면적으로라도 이유를 알려주기 위해 런타임에 콘솔 경고를 남긴다.
  // (빌드 시점 에러 대신 실행 중 확인 가능)
  // eslint-disable-next-line no-console
  console.warn('TMDB API key is missing. Set REACT_APP_TMDB_API_KEY in your .env file.');
}

export const tmdb = axios.create({
  baseURL,
  params: {
    api_key: apiKey,
    language: defaultLanguage,
    region: defaultRegion,
  },
});

export type TmdbMovie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
};

export async function fetchPopular(page = 1) {
  const res = await tmdb.get<{ results: TmdbMovie[] }>('/movie/popular', {
    params: { page },
  });
  return res.data.results;
}

export async function fetchNowPlaying(page = 1) {
  const res = await tmdb.get<{ results: TmdbMovie[] }>('/movie/now_playing', {
    params: { page },
  });
  return res.data.results;
}

export async function fetchTopRated(page = 1) {
  const res = await tmdb.get<{ results: TmdbMovie[] }>('/movie/top_rated', {
    params: { page },
  });
  return res.data.results;
}

export async function fetchUpcoming(page = 1) {
  const res = await tmdb.get<{ results: TmdbMovie[] }>('/movie/upcoming', {
    params: { page },
  });
  return res.data.results;
}

export async function searchMovies(query: string, page = 1) {
  const res = await tmdb.get<{ results: TmdbMovie[] }>('/search/movie', {
    params: { query, page, include_adult: false },
  });
  return res.data.results;
}

export type TmdbGenre = { id: number; name: string };

export async function fetchGenres() {
  const res = await tmdb.get<{ genres: TmdbGenre[] }>('/genre/movie/list');
  return res.data.genres;
}
