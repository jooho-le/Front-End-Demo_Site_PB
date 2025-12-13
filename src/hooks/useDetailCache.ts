import { useEffect, useState } from 'react';
import { fetchMovieDetail, TmdbMovie } from '../api/tmdb';

const detailCache = new Map<number, TmdbMovie>();

export function useDetailCache(id: number | null) {
  const [data, setData] = useState<TmdbMovie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const cached = detailCache.get(id);
    if (cached) {
      setData(cached);
      return;
    }
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchMovieDetail(id);
        detailCache.set(id, res);
        setData(res);
        setError('');
      } catch {
        setError('상세 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  return { data, loading, error };
}
