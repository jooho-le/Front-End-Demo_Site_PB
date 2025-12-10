import './wishlist.css';
import MovieCard from '../components/movie/MovieCard';
import { useWishlist } from '../context/WishlistContext';

function Wishlist() {
  const { items } = useWishlist();

  return (
    <section className="nf-section">
      <div className="nf-section__badge">Wishlist</div>
      <h1 className="nf-section__title">Your curated neon list</h1>
      <p className="nf-section__body">
        Local Storage에 저장된 추천/위시리스트를 표시합니다. (이 페이지에서는 TMDB API를
        호출하지 않습니다.)
      </p>

      {items.length === 0 && (
        <p className="nf-wishlist__state">
          저장된 위시리스트가 없습니다. 영화 카드에서 위시 추가 후 다시 확인하세요.
        </p>
      )}

      <div className="nf-wishlist__grid">
        {items.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}

export default Wishlist;
