import { useEffect, useRef } from "react";

const useOnMountOnce = (callback: () => void) => {
  const mountedRef = useRef(false);
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    callback();
  }, []);
};

export default useOnMountOnce;
