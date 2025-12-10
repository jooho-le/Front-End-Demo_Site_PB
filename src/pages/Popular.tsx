import { useEffect, useState } from 'react';
import { fetchPopular, TmdbMovie } from '../api/tmdb';
import './popular.css';
import MovieCard from '../components/movie/MovieCard';
import Spinner from '../components/common/Spinner';

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

      {loading && (
        <p className="nf-popular__state">
          <Spinner /> 로딩 중...
        </p>
      )}
      {error && <p className="nf-popular__state nf-popular__state--error">{error}</p>}

      <div className="nf-popular__grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}

export default Popular;
