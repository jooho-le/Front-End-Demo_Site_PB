import { useEffect, useState } from 'react';
import { fetchPopular, TmdbMovie } from '../api/tmdb';
import './popular.css';
import '../styles/cards.css';

function Popular() {
  const [movies, setMovies] = useState<TmdbMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchPopular(1);
        setMovies(data);
      } catch (err) {
        setError('TMDB 데이터를 불러오지 못했습니다. API 키와 네트워크를 확인하세요.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section className="nf-section">
      <div className="nf-section__badge">Popular</div>
      <h1 className="nf-section__title">Trending &amp; popular picks</h1>
      <p className="nf-section__body">
        TMDB 인기 영화를 불러옵니다. 아래 그리드로 첫 페이지 결과를 표시해 키 반영 여부를
        확인할 수 있습니다.
      </p>

      {loading && <p className="nf-popular__state">로딩 중...</p>}
      {error && <p className="nf-popular__state nf-popular__state--error">{error}</p>}

      <div className="nf-popular__grid">
        {movies.map((movie) => (
          <article key={movie.id} className="nf-card">
            <div className="nf-card__thumb">
              {movie.poster_path ? (
                <img
                  src={`${process.env.REACT_APP_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p'}/w500${movie.poster_path}`}
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

export default Popular;
