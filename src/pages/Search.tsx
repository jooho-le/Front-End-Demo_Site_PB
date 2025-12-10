import { FormEvent, useEffect, useMemo, useState } from 'react';
import { searchMovies, fetchPopular, fetchGenres, TmdbGenre, TmdbMovie } from '../api/tmdb';
import './search.css';
import MovieCard from '../components/movie/MovieCard';
import Spinner from '../components/common/Spinner';

function Search() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<TmdbMovie[]>([]);
  const [filtered, setFiltered] = useState<TmdbMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [genres, setGenres] = useState<TmdbGenre[]>([]);
  const [genreId, setGenreId] = useState<number | ''>('');
  const [minRating, setMinRating] = useState<number | ''>('');
  const [sort, setSort] = useState<'release' | 'popularity'>('popularity');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchPopular(1);
        const g = await fetchGenres();
        setGenres(g);
        setMovies(data.slice(0, 12));
        setFiltered(data.slice(0, 12));
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
      setFiltered(data);
      setError('');
    } catch {
      setError('검색에 실패했습니다. API 키와 네트워크를 확인하세요.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let next = [...movies];
    if (genreId) {
      next = next.filter((m) => (m as any).genre_ids?.includes(genreId));
    }
    if (minRating !== '' && typeof minRating === 'number') {
      next = next.filter((m) => m.vote_average >= minRating);
    }
    if (sort === 'release') {
      next = next.sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''));
    } else {
      next = next.sort((a, b) => b.vote_average - a.vote_average);
    }
    setFiltered(next);
  }, [movies, genreId, minRating, sort]);

  const resetFilters = () => {
    setGenreId('');
    setMinRating('');
    setSort('popularity');
    setFiltered(movies);
  };

  const genreOptions = useMemo(
    () => genres.map((g) => ({ value: g.id, label: g.name })),
    [genres],
  );

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

      <div className="nf-search__filters">
        <select value={genreId} onChange={(e) => setGenreId(e.target.value ? Number(e.target.value) : '')}>
          <option value="">장르 전체</option>
          {genreOptions.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="최소 평점 (0~10)"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value === '' ? '' : Number(e.target.value))}
          min={0}
          max={10}
        />
        <select value={sort} onChange={(e) => setSort(e.target.value as 'release' | 'popularity')}>
          <option value="popularity">평점 높은 순</option>
          <option value="release">개봉일 최신 순</option>
        </select>
      </div>

      <div className="nf-search__actions">
        <button type="submit" onClick={onSubmit}>
          검색
        </button>
        <button type="button" onClick={resetFilters}>
          필터 초기화
        </button>
      </div>

      {loading && (
        <p className="nf-search__state">
          <Spinner /> 로딩 중...
        </p>
      )}
      {error && <p className="nf-search__state nf-search__state--error">{error}</p>}

      <div className="nf-search__grid">
        {filtered.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}

export default Search;
