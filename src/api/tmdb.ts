import axios, { AxiosRequestConfig } from 'axios';

// Endpoints used in this app:
// /movie/popular, /movie/now_playing, /movie/top_rated, /movie/upcoming, /search/movie, /genre/movie/list, /movie/{id}

const apiKey = process.env.REACT_APP_TMDB_API_KEY;
const bearer = process.env.REACT_APP_TMDB_BEARER;
const baseURL = process.env.REACT_APP_TMDB_API_BASE || 'https://api.themoviedb.org/3';
const defaultLanguage = process.env.REACT_APP_TMDB_LANGUAGE || 'ko-KR';
const defaultRegion = process.env.REACT_APP_TMDB_REGION || 'KR';

if (!apiKey) {
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
  headers: bearer
    ? {
        Authorization: `Bearer ${bearer}`,
        'Content-Type': 'application/json;charset=utf-8',
      }
    : undefined,
});

// Simple in-memory cache for GET requests
type CacheEntry<T> = { data: T; ts: number };
const cache = new Map<string, CacheEntry<unknown>>();
const DEFAULT_TTL = 1000 * 60 * 5; // 5 minutes

async function getWithCache<T>(url: string, config?: AxiosRequestConfig, ttl = DEFAULT_TTL) {
  const key = `${url}?${JSON.stringify(config?.params || {})}`;
  const now = Date.now();
  const cached = cache.get(key) as CacheEntry<T> | undefined;
  if (cached && now - cached.ts < ttl) {
    return cached.data;
  }
  const res = await tmdb.get<T>(url, config);
  cache.set(key, { data: res.data, ts: now });
  return res.data;
}

export function getImageUrl(path: string | null, size: 'w200' | 'w300' | 'w500' | 'original' = 'w500') {
  if (!path) return '';
  const base = process.env.REACT_APP_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p';
  return `${base}/${size}${path}`;
}

export type TmdbMovie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
};

export async function fetchPopular(page = 1) {
  const data = await getWithCache<{ results: TmdbMovie[] }>('/movie/popular', {
    params: { page },
  });
  return data.results;
}

export async function fetchNowPlaying(page = 1) {
  const data = await getWithCache<{ results: TmdbMovie[] }>('/movie/now_playing', {
    params: { page },
  });
  return data.results;
}

export async function fetchTopRated(page = 1) {
  const data = await getWithCache<{ results: TmdbMovie[] }>('/movie/top_rated', {
    params: { page },
  });
  return data.results;
}

export async function fetchUpcoming(page = 1) {
  const data = await getWithCache<{ results: TmdbMovie[] }>('/movie/upcoming', {
    params: { page },
  });
  return data.results;
}

export async function searchMovies(query: string, page = 1) {
  const data = await getWithCache<{ results: TmdbMovie[] }>('/search/movie', {
    params: { query, page, include_adult: false },
  });
  return data.results;
}

export type TmdbGenre = { id: number; name: string };

export async function fetchGenres() {
  const data = await getWithCache<{ genres: TmdbGenre[] }>('/genre/movie/list');
  return data.genres;
}

export async function fetchMovieDetail(id: number) {
  const data = await getWithCache<TmdbMovie>(`/movie/${id}`);
  return data;
}
