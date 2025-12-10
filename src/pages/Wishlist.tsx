import { useEffect, useState } from 'react';
import { TmdbMovie } from '../api/tmdb';
import './wishlist.css';
import '../styles/cards.css';

const STORAGE_NAMESPACE = process.env.REACT_APP_STORAGE_NAMESPACE || 'netflix-lite';
const STORAGE_KEY_WISHLIST = `${STORAGE_NAMESPACE}:wishlist`;

function Wishlist() {
  const [movies, setMovies] = useState<TmdbMovie[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY_WISHLIST);
    if (stored) {
      try {
        setMovies(JSON.parse(stored));
      } catch {
        setMovies([]);
      }
    }
  }, []);

  return (
    <section className="nf-section">
      <div className="nf-section__badge">Wishlist</div>
      <h1 className="nf-section__title">Your curated neon list</h1>
      <p className="nf-section__body">
        Local Storage에 저장된 추천/위시리스트를 표시합니다. (이 페이지에서는 TMDB API를
        호출하지 않습니다.)
      </p>

      {movies.length === 0 && (
        <p className="nf-wishlist__state">
          저장된 위시리스트가 없습니다. 영화 카드에서 위시 추가 후 다시 확인하세요.
        </p>
      )}

      <div className="nf-wishlist__grid">
        {movies.map((movie) => (
          <article key={movie.id} className="nf-card">
            <div className="nf-card__thumb">
              {movie.poster_path ? (
                <img
                  src={`${
                    process.env.REACT_APP_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p'
                  }/w500${movie.poster_path}`}
                  alt={movie.title}
                  loading="lazy"
                />
              ) : (
                <div className="nf-card__placeholder">No Image</div>
              )}
            </div>
            <div className="nf-card__body">
              <h3>{movie.title}</h3>
              <p className="nf-card__meta">
                평점 {movie.vote_average.toFixed(1)} · {movie.release_date}
              </p>
              <p className="nf-card__overview">{movie.overview || '설명이 없습니다.'}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Wishlist;
