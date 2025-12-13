import { createElement, useState, ElementType } from 'react';
import { FaHeart } from 'react-icons/fa';
import { TmdbMovie, getImageUrl } from '../../api/tmdb';
import { useWishlist } from '../../context/WishlistContext';
import MovieDetailModal from './MovieDetailModal';
import './movie-card.css';

type Props = {
  movie: TmdbMovie;
  size?: 'md' | 'sm';
  enableDetail?: boolean;
};

function MovieCard({ movie, size = 'md', enableDetail = true }: Props) {
  const { isWishlisted, toggle } = useWishlist();
  const wished = isWishlisted(movie.id);
  const [detailOpen, setDetailOpen] = useState(false);

  const width = size === 'sm' ? 'w300' : 'w500';
  const HeartIcon = FaHeart as unknown as ElementType;
  const openDetail = () => enableDetail && setDetailOpen(true);

  return (
    <>
      <article
        className={`nf-card ${size === 'sm' ? 'nf-card--compact' : ''} ${wished ? 'nf-card--wished' : ''}`}
        role={enableDetail ? 'button' : undefined}
        tabIndex={enableDetail ? 0 : -1}
        onClick={openDetail}
        onKeyDown={(e) => {
          if (!enableDetail) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openDetail();
          }
        }}
      >
        <button
          type="button"
          className="nf-card__wish"
          onClick={(e) => {
            e.stopPropagation();
            toggle(movie);
          }}
          aria-label="toggle wishlist"
        >
          <HeartIcon aria-hidden="true" fill={wished ? '#ff6b8a' : 'rgba(255,255,255,0.75)'} />
        </button>
        <div className="nf-card__thumb">
          {movie.poster_path ? (
            <img src={getImageUrl(movie.poster_path, width as any)} alt={movie.title} loading="lazy" />
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
      {enableDetail && detailOpen && (
        <MovieDetailModal movieId={movie.id} onClose={() => setDetailOpen(false)} />
      )}
    </>
  );
}

export default MovieCard;
