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
  const [history, setHistory] = useState<string[]>([]);
  const [minYear, setMinYear] = useState<number | ''>('');
  const [minPopularity, setMinPopularity] = useState<number | ''>('');

  const STORAGE_NAMESPACE = process.env.REACT_APP_STORAGE_NAMESPACE || 'netflix-lite';
  const HISTORY_KEY = `${STORAGE_NAMESPACE}:search-history`;

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchPopular(1);
        const g = await fetchGenres();
        setGenres(g);
        setMovies(data.slice(0, 12));
        setFiltered(data.slice(0, 12));
        // 최근 검색어 로드
        try {
          const raw = localStorage.getItem(HISTORY_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              setHistory(parsed.slice(0, 5));
            }
          }
        } catch {
          setHistory([]);
        }
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
      // 최근 검색어 저장 (중복 제거, 최대 5개)
      setHistory((prev) => {
        const next = [query.trim(), ...prev.filter((q) => q !== query.trim())].slice(0, 5);
        try {
          localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
        } catch {
          // ignore quota errors
        }
        return next;
      });
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
    if (minPopularity !== '' && typeof minPopularity === 'number') {
      next = next.filter((m: any) => (m.popularity || 0) >= minPopularity);
    }
    if (minYear !== '' && typeof minYear === 'number') {
      next = next.filter((m) => {
        const year = m.release_date ? Number(m.release_date.slice(0, 4)) : 0;
        return year >= minYear;
      });
    }
    if (sort === 'release') {
      next = next.sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''));
    } else {
      next = next.sort((a, b) => b.vote_average - a.vote_average);
    }
    setFiltered(next);
  }, [movies, genreId, minRating, sort, minPopularity, minYear]);

  const resetFilters = () => {
    setGenreId('');
    setMinRating('');
    setMinYear('');
    setMinPopularity('');
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
        <input
          type="number"
          placeholder="최소 개봉 연도 (예: 2015)"
          value={minYear}
          onChange={(e) => setMinYear(e.target.value === '' ? '' : Number(e.target.value))}
          min={1900}
          max={2100}
        />
        <input
          type="number"
          placeholder="최소 인기점수 (popularity)"
          value={minPopularity}
          onChange={(e) => setMinPopularity(e.target.value === '' ? '' : Number(e.target.value))}
          min={0}
          step="1"
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

      {history.length > 0 && (
        <div className="nf-search__history">
          <span className="nf-search__history-label">최근 검색</span>
          <div className="nf-search__history-chips">
            {history.map((h) => (
              <button
                key={h}
                type="button"
                className="nf-chip"
                onClick={(e) => {
                  e.preventDefault();
                  setQuery(h);
                  // 즉시 같은 흐름으로 검색 실행
                  (async () => {
                    try {
                      setLoading(true);
                      const data = await searchMovies(h, 1);
                      setMovies(data);
                      setFiltered(data);
                      setError('');
                    } catch {
                      setError('검색에 실패했습니다. API 키와 네트워크를 확인하세요.');
                    } finally {
                      setLoading(false);
                    }
                  })();
                }}
              >
                {h}
              </button>
            ))}
          </div>
        </div>
      )}

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
