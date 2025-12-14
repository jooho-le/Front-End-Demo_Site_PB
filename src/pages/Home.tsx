import { useEffect, useState } from 'react';
import {
  fetchNowPlaying,
  fetchPopular,
  fetchTopRated,
  fetchUpcoming,
  fetchTrending,
  TmdbMovie,
  fetchGenres,
} from '../api/tmdb';
import './home.css';
import MovieRow from '../components/movie/MovieRow';
import Spinner from '../components/common/Spinner';

type Section = {
  title: string;
  badge: string;
  data: TmdbMovie[];
};

function Home() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [genreMap, setGenreMap] = useState<Record<number, string>>({});

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [popular, nowPlaying, topRated, upcoming, trending, genres] = await Promise.all([
          fetchPopular(1),
          fetchNowPlaying(1),
          fetchTopRated(1),
          fetchUpcoming(1),
          fetchTrending(1),
          fetchGenres(),
        ]);
        const map: Record<number, string> = {};
        genres.forEach((g) => {
          map[g.id] = g.name;
        });
        setGenreMap(map);
        setSections([
          { title: '지금 뜨는 작품', badge: 'Trending', data: trending.slice(0, 6) },
          { title: '인기 급상승', badge: 'Popular', data: popular.slice(0, 6) },
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
        트렌딩, 인기, 상영중, 평점 상위, 개봉 예정 작품을 TMDB에서 가져와 하이라이트로 보여줍니다.
      </p>

      {loading && (
        <div className="nf-home__state">
          <Spinner /> 로딩 중...
        </div>
      )}
      {error && <p className="nf-home__state nf-home__state--error">{error}</p>}

      <div className="nf-home__rows">
        {sections.map((section) => (
          <MovieRow
            key={section.title}
            title={section.title}
            badge={section.badge}
            movies={section.data}
            loading={loading}
            error={error}
            size="sm"
            genreMap={genreMap}
          />
        ))}
      </div>
    </section>
  );
}

export default Home;
