import './movie-detail.css';
import { getImageUrl } from '../../api/tmdb';
import { useDetailCache } from '../../hooks/useDetailCache';
import Spinner from '../common/Spinner';

type Props = {
  movieId: number | null;
  onClose: () => void;
};

function MovieDetailModal({ movieId, onClose }: Props) {
  const { data, loading, error } = useDetailCache(movieId);

  if (!movieId) return null;

  return (
    <div className="nf-detail__backdrop" onClick={onClose}>
      <div className="nf-detail__card" onClick={(e) => e.stopPropagation()}>
        {loading && (
          <div className="nf-detail__state">
            <Spinner /> 로딩 중...
          </div>
        )}
        {error && <div className="nf-detail__state nf-detail__state--error">{error}</div>}
        {data && (
          <div className="nf-detail__body">
            <div className="nf-detail__poster">
              {data.poster_path ? (
                <img src={getImageUrl(data.poster_path, 'w500')} alt={data.title} loading="lazy" />
              ) : (
                <div className="nf-detail__placeholder">No Image</div>
              )}
            </div>
            <div className="nf-detail__info">
              <h3>{data.title}</h3>
              <p className="nf-detail__meta">
                평점 {data.vote_average.toFixed(1)} · 개봉 {data.release_date}
              </p>
              <p className="nf-detail__overview">{data.overview || '설명이 없습니다.'}</p>
              <button className="nf-btn" onClick={onClose}>
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieDetailModal;
