import { useEffect, useState } from 'react';
import {
  fetchNowPlaying,
  fetchPopular,
  fetchTopRated,
  fetchUpcoming,
  TmdbMovie,
} from '../api/tmdb';
import './home.css';
import '../styles/cards.css';

type Section = {
  title: string;
  badge: string;
  data: TmdbMovie[];
};

function Home() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [popular, nowPlaying, topRated, upcoming] = await Promise.all([
          fetchPopular(1),
          fetchNowPlaying(1),
          fetchTopRated(1),
          fetchUpcoming(1),
        ]);
        setSections([
          { title: '지금 뜨는 작품', badge: 'Popular', data: popular.slice(0, 6) },
          { title: '현재 상영중', badge: 'Now Playing', data: nowPlaying.slice(0, 6) },
          { title: '평점 상위', badge: 'Top Rated', data: topRated.slice(0, 6) },
          { title: '개봉 예정', badge: 'Upcoming', data: upcoming.slice(0, 6) },
        ]);
      } catch (err) {
        setError('TMDB 데이터를 불러오지 못했습니다. API 키와 네트워크를 확인하세요.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section className="nf-section nf-home">
      <div className="nf-section__badge">Home</div>
      <h1 className="nf-section__title">Your neon-curated cinema hub</h1>
      <p className="nf-section__body">
        인기, 상영중, 평점 상위, 개봉 예정 작품을 TMDB에서 가져와 하이라이트로 보여줍니다.
      </p>

      {loading && <p className="nf-home__state">로딩 중...</p>}
      {error && <p className="nf-home__state nf-home__state--error">{error}</p>}

      <div className="nf-home__grid">
        {sections.map((section) => (
          <div key={section.title} className="nf-home__column">
            <div className="nf-home__column-head">
              <span className="nf-section__badge nf-section__badge--small">
                {section.badge}
              </span>
              <h3>{section.title}</h3>
            </div>
            <div className="nf-home__cards">
              {section.data.map((movie) => (
                <article key={movie.id} className="nf-card nf-card--compact">
                  <div className="nf-card__thumb">
                    {movie.poster_path ? (
                      <img
                        src={`${
                          process.env.REACT_APP_TMDB_IMAGE_BASE ||
                          'https://image.tmdb.org/t/p'
                        }/w300${movie.poster_path}`}
                        alt={movie.title}
                        loading="lazy"
                      />
                    ) : (
                      <div className="nf-card__placeholder">No Image</div>
                    )}
                  </div>
                  <div className="nf-card__body">
                    <h4>{movie.title}</h4>
                    <p className="nf-card__meta">
                      평점 {movie.vote_average.toFixed(1)} · {movie.release_date}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Home;
