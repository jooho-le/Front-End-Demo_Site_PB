import { DependencyList, useEffect, useState } from 'react';

type Fetcher<T> = () => Promise<T[]>;

export function useMovies<T>(fetcher: Fetcher<T>, deps: DependencyList = []) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetcher();
        if (mounted) {
          setData(res);
          setError('');
        }
      } catch (err) {
        if (mounted) {
          setError('데이터를 불러오지 못했습니다. API 키와 네트워크를 확인하세요.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, deps);

  return { data, loading, error };
}
