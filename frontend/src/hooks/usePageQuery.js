import { useState, useEffect } from "react";

const usePageQuery = (queryFn, options) => {
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState();
  const [params, setParams] = useState();
  const [error, setError] = useState();
  const [triggerHistory, setTriggerHistory] = useState({totalCount: 0});

  const trigger = async (...params) => {
    setIsFetching(true);
    setParams(params);
    setError(null);
    setTriggerHistory((th) => ({ totalCount: (th?.totalCount || 0) + 1 }));
    try {
      const response = await queryFn(...params);
      setData(response);
      setIsFetching(false);
    } catch (error) {
      setData(null);
      setError(error);
      console.error(error);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!options?.preventInitialTrigger)
      trigger(...(options?.initialParams || []));
  }, []);

  return { isFetching, data, error, params, triggerHistory, trigger };
};

export default usePageQuery;
