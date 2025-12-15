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
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const infiniteTrackRef = useRef<HTMLDivElement | null>(null);
  const [activeInfiniteIndex, setActiveInfiniteIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // 뷰 전환 시 무한스크롤 상태 리셋
  useEffect(() => {
    if (view === 'infinite') {
      setInfiniteItems([]);
      setInfinitePage(1);
      setHasMore(true);
    }
  }, [view]);

  useEffect(() => {
    const loadMore = async () => {
      if (infiniteLoading || !hasMore) return;
      try {
        setInfiniteLoading(true);
        const next = await fetchPopular(infinitePage);
        if (next.length === 0) {
          setHasMore(false);
        } else {
          setInfiniteItems((prev) => [...prev, ...next]);
        }
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

  // infinite view 자동 슬라이드 (현재까지 로드된 항목 대상)
  useEffect(() => {
    const track = infiniteTrackRef.current;
    if (!track || infiniteItems.length === 0 || view !== 'infinite') return;
    const first = track.querySelector<HTMLElement>('.nf-popular__item');
    const cardWidth = first?.offsetWidth || 220;
    const gap = 16;
    const handleScroll = () => {
      const idx = Math.round(track.scrollLeft / (cardWidth + gap));
      setActiveInfiniteIndex(idx >= 0 ? idx : 0);
    };
    track.addEventListener('scroll', handleScroll, { passive: true });
    const timer = window.setInterval(() => {
      if (paused) return;
      setActiveInfiniteIndex((prev) => {
        const next = infiniteItems.length > 0 ? (prev + 1) % infiniteItems.length : 0;
        track.scrollTo({ left: next * (cardWidth + gap), behavior: 'smooth' });
        return next;
      });
    }, 3800);
    track.scrollTo({ left: 0, behavior: 'smooth' });
    return () => {
      track.removeEventListener('scroll', handleScroll);
      window.clearInterval(timer);
    };
  }, [infiniteItems.length, view, paused]);

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
              <div key={movie.id} className="nf-popular__item">
                <MovieCard movie={movie} size="md" />
              </div>
            ))}
          </div>
        </>
      )}

      {view === 'infinite' && (
        <div className="nf-popular__infinite">
          <div
            className="nf-popular__track"
            ref={infiniteTrackRef}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {infiniteItems.map((movie) => (
              <div
                key={`${movie.id}-${movie.release_date}`}
                className={`nf-popular__item ${
                  infiniteItems.indexOf(movie) === activeInfiniteIndex ? 'is-active' : ''
                }`}
              >
                <MovieCard movie={movie} size="md" />
              </div>
            ))}
          </div>
          {error && <p className="nf-popular__state nf-popular__state--error">{error}</p>}
          {infiniteLoading && (
            <p className="nf-popular__state">
              <Spinner /> 더 불러오는 중...
            </p>
          )}
          {!hasMore && !infiniteLoading && (
            <p className="nf-popular__state">마지막 페이지입니다.</p>
          )}
          <div ref={observerRef} className="nf-popular__observer" />
        </div>
      )}
      <TopButton />
    </section>
  );
}

export default Popular;
