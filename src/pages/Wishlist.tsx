import './wishlist.css';
import { useWishlist } from '../context/WishlistContext';

function Wishlist() {
  const { items, toggle } = useWishlist();

  return (
    <section className="nf-section">
      <div className="nf-section__badge">Wishlist</div>
      <h1 className="nf-section__title">Your curated neon list</h1>
      <p className="nf-section__body">
        Local Storage에 저장된 추천/위시리스트만 사용합니다. (TMDB API 호출 없음)
      </p>

      {items.length === 0 ? (
        <p className="nf-wishlist__state">
          저장된 위시리스트가 없습니다. 영화 카드에서 위시 추가 후 다시 확인하세요.
        </p>
      ) : (
        <div className="nf-wishlist__table-wrapper">
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
                        src={`${
                          process.env.REACT_APP_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p'
                        }/w200${movie.poster_path}`}
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
