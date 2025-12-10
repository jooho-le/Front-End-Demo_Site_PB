import { FormEvent, useEffect, useState } from 'react';
import { searchMovies, fetchPopular, TmdbMovie } from '../api/tmdb';
import './search.css';
import '../styles/cards.css';

function Search() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<TmdbMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchPopular(1);
        setMovies(data.slice(0, 12));
      } catch {
        setError('TMDB 데이터를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    try {
      setLoading(true);
      const data = await searchMovies(query.trim(), 1);
      setMovies(data);
      setError('');
    } catch {
      setError('검색에 실패했습니다. API 키와 네트워크를 확인하세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="nf-section">
      <div className="nf-section__badge">Search</div>
      <h1 className="nf-section__title">Find films by mood, genre, or title</h1>
      <p className="nf-section__body">
        검색어를 입력해 TMDB 영화 데이터를 조회합니다. 초기 상태는 인기 영화 일부를
        보여줍니다.
      </p>

      <form className="nf-search__form" onSubmit={onSubmit}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="영화 제목 또는 키워드로 검색"
        />
        <button type="submit">검색</button>
      </form>

      {loading && <p className="nf-search__state">로딩 중...</p>}
      {error && <p className="nf-search__state nf-search__state--error">{error}</p>}

      <div className="nf-search__grid">
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

export default Search;
