import MovieCard from './MovieCard';
import Spinner from '../common/Spinner';
import { TmdbMovie } from '../../api/tmdb';
import './movie-row.css';

type Props = {
  title: string;
  badge: string;
  movies: TmdbMovie[];
  loading?: boolean;
  error?: string;
  size?: 'md' | 'sm';
};

function MovieRow({ title, badge, movies, loading, error, size = 'sm' }: Props) {
  return (
    <div className="nf-row">
      <div className="nf-row__head">
        <span className="nf-section__badge nf-section__badge--small">{badge}</span>
        <h3>{title}</h3>
        {loading && (
          <span className="nf-row__state">
            <Spinner /> 불러오는 중...
          </span>
        )}
        {error && <span className="nf-row__state nf-row__state--error">{error}</span>}
      </div>
      <div className="nf-row__track">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="nf-row__skeleton" />
            ))
          : movies.map((movie) => <MovieCard key={movie.id} movie={movie} size={size} />)}
      </div>
    </div>
  );
}

export default MovieRow;
