import { useEffect, useMemo, useRef, useState } from 'react';
import { fetchPopular, TmdbMovie } from '../api/tmdb';
import './popular.css';
import MovieCard from '../components/movie/MovieCard';
import Spinner from '../components/common/Spinner';
import TopButton from '../components/common/TopButton';
import { useMovies } from '../hooks/useMovies';

function Popular() {
  const [view, setView] = useState<'table' | 'infinite'>('table');
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const { data: tableData, loading } = useMovies<TmdbMovie>(() => fetchPopular(page), [page]);
  const [infinitePage, setInfinitePage] = useState(1);
  const [infiniteItems, setInfiniteItems] = useState<TmdbMovie[]>([]);
  const [infiniteLoading, setInfiniteLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadMore = async () => {
      if (infiniteLoading) return;
      try {
        setInfiniteLoading(true);
        const next = await fetchPopular(infinitePage);
        setInfiniteItems((prev) => [...prev, ...next]);
      } catch {
        setError('무한스크롤 데이터를 불러오지 못했습니다.');
      } finally {
        setInfiniteLoading(false);
      }
    };
    loadMore();
  }, [infinitePage, infiniteLoading]);

  useEffect(() => {
    if (view !== 'infinite') return;
    const node = observerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !infiniteLoading) {
          setInfinitePage((prev) => prev + 1);
        }
      },
      { threshold: 1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [view, infiniteLoading]);

  const memoTable = useMemo(() => tableData, [tableData]);

  return (
    <section className="nf-section">
      <div className="nf-section__badge">Popular</div>
      <h1 className="nf-section__title">Trending &amp; popular picks</h1>
      <p className="nf-section__body">
        TMDB 인기 영화를 불러옵니다. 아래 그리드로 첫 페이지 결과를 표시해 키 반영 여부를
        확인할 수 있습니다.
      </p>

      <div className="nf-popular__toolbar">
        <div className="nf-popular__toggle">
          <button
            className={view === 'table' ? 'is-active' : ''}
            onClick={() => setView('table')}
          >
            Table View
          </button>
          <button
            className={view === 'infinite' ? 'is-active' : ''}
            onClick={() => setView('infinite')}
          >
            Infinite Scroll
          </button>
        </div>
        {view === 'table' && (
          <div className="nf-popular__pager">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              ← 이전
            </button>
            <span>Page {page}</span>
            <button onClick={() => setPage((p) => p + 1)}>다음 →</button>
          </div>
        )}
      </div>

      {view === 'table' && (
        <>
          {loading && (
            <p className="nf-popular__state">
              <Spinner /> 로딩 중...
            </p>
          )}
          {error && <p className="nf-popular__state nf-popular__state--error">{error}</p>}
          <div className="nf-popular__grid">
            {memoTable.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </>
      )}

      {view === 'infinite' && (
        <div className="nf-popular__infinite">
          <div className="nf-popular__grid">
            {infiniteItems.map((movie) => (
              <MovieCard key={`${movie.id}-${movie.release_date}`} movie={movie} />
            ))}
          </div>
          {error && <p className="nf-popular__state nf-popular__state--error">{error}</p>}
          {infiniteLoading && (
            <p className="nf-popular__state">
              <Spinner /> 더 불러오는 중...
            </p>
          )}
          <div ref={observerRef} className="nf-popular__observer" />
        </div>
      )}
      <TopButton />
    </section>
  );
}

export default Popular;
