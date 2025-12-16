import './wishlist.css';
import { getImageUrl } from '../api/tmdb';
import { useWishlist } from '../context/WishlistContext';
import MovieCard from '../components/movie/MovieCard';
import { useEffect, useRef, useState } from 'react';

function Wishlist() {
  const { items, toggle } = useWishlist();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || items.length === 0) return;
    const first = track.querySelector<HTMLElement>('.nf-wishlist__item');
    const cardWidth = first?.offsetWidth || 220;
    const gap = 16;
    const interval = window.setInterval(() => {
      if (paused) return;
      setActiveIndex((prev) => {
        const next = (prev + 1) % items.length;
        track.scrollTo({ left: next * (cardWidth + gap), behavior: 'smooth' });
        return next;
      });
    }, 3800);
    return () => window.clearInterval(interval);
  }, [items.length, paused]);

  return (
    <section className="nf-section">
      <div className="nf-section__badge">Wishlist</div>
      <h1 className="nf-section__title">Your curated neon list</h1>
      <p className="nf-section__body">
        내가 담아둔 영화 카드만 모여있는 공간이에요. 부담 없이 보고, 마음 바뀌면 다시 눌러 빼낼 수 있어요.
      </p>

      {items.length === 0 ? (
        <p className="nf-wishlist__state">
          아직 담은 영화가 없어요. 마음에 드는 카드를 눌러 위시리스트에 추가해 보세요.
        </p>
      ) : (
        <div className="nf-wishlist__table-wrapper">
          <div
            className="nf-wishlist__track"
            ref={trackRef}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {items.map((movie, idx) => (
              <div key={movie.id} className={`nf-wishlist__item ${idx === activeIndex ? 'is-active' : ''}`}>
                <MovieCard movie={movie} size="sm" />
              </div>
            ))}
          </div>

          <table className="nf-wishlist__table">
            <thead>
              <tr>
                <th>포스터</th>
                <th>제목</th>
                <th>평점</th>
                <th>개봉</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {items.map((movie) => (
                <tr key={movie.id} className="nf-wishlist__row">
                  <td>
                    {movie.poster_path ? (
                      <img
                        src={getImageUrl(movie.poster_path, 'w200')}
                        alt={movie.title}
                        className="nf-wishlist__thumb"
                        loading="lazy"
                      />
                    ) : (
                      <div className="nf-wishlist__placeholder">No Image</div>
                    )}
                  </td>
                  <td>
                    <div className="nf-wishlist__title">
                      <span className="nf-wishlist__badge">WISHLIST</span>
                      {movie.title}
                    </div>
                    <p className="nf-wishlist__overview">
                      {movie.overview || '설명이 없습니다.'}
                    </p>
                  </td>
                  <td>{movie.vote_average.toFixed(1)}</td>
                  <td>{movie.release_date}</td>
                  <td>
                    <button className="nf-btn nf-btn--ghost" onClick={() => toggle(movie)}>
                      제거
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default Wishlist;
