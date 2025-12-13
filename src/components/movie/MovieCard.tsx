import * as FaIcons from 'react-icons/fa';
import { TmdbMovie } from '../../api/tmdb';
import { useWishlist } from '../../context/WishlistContext';
import './movie-card.css';

type Props = {
  movie: TmdbMovie;
  size?: 'md' | 'sm';
};

function MovieCard({ movie, size = 'md' }: Props) {
  const { isWishlisted, toggle } = useWishlist();
  const wished = isWishlisted(movie.id);

  const imageBase = process.env.REACT_APP_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p';
  const width = size === 'sm' ? 'w300' : 'w500';
  const HeartIcon = (
    <FaIcons.FaHeart aria-hidden="true" fill={wished ? '#ff6b8a' : 'rgba(255,255,255,0.75)'} />
  );

  return (
    <article className={`nf-card ${size === 'sm' ? 'nf-card--compact' : ''} ${wished ? 'nf-card--wished' : ''}`}>
      <button className="nf-card__wish" onClick={() => toggle(movie)} aria-label="toggle wishlist">
        {HeartIcon}
      </button>
      <div className="nf-card__thumb">
        {movie.poster_path ? (
          <img src={`${imageBase}/${width}${movie.poster_path}`} alt={movie.title} loading="lazy" />
        ) : (
          <div className="nf-card__placeholder">No Image</div>
        )}
        {wished && <span className="nf-card__badge">WISHLIST</span>}
      </div>
      <div className="nf-card__body">
        <h3>{movie.title}</h3>
        <p className="nf-card__meta">
          평점 {movie.vote_average.toFixed(1)} · {movie.release_date}
        </p>
        {size === 'md' && (
          <p className="nf-card__overview">{movie.overview || '설명이 없습니다.'}</p>
        )}
      </div>
    </article>
  );
}

export default MovieCard;
