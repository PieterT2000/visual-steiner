import { capitalize } from "@/lib/utils";
import { useCallback, useRef } from "react";

type Subscriber<T> = (data?: T) => void;

export function usePubSub<T>() {
  const subscribers = useRef<Set<Subscriber<T>>>(new Set());

  const publish = useCallback((data?: T) => {
    subscribers.current.forEach((subscriber) => subscriber(data));
  }, []);

  const subscribe = useCallback((callback: Subscriber<T>) => {
    subscribers.current.add(callback);

    // Return unsubscribe function
    return () => {
      subscribers.current.delete(callback);
    };
  }, []);

  return { publish, subscribe };
}

export function createPubSub<const T extends string>(name: T) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { publish, subscribe } = usePubSub<undefined>();
  type PubSub = {
    publish: typeof publish;
    subscribe: typeof subscribe;
  };

  type MappedPubSub<T extends string> = {
    [Property in keyof PubSub as `${Property}${Capitalize<T>}`]: PubSub[Property];
  };

  return {
    [`publish${capitalize(name)}`]: publish,
    [`subscribe${capitalize(name)}`]: subscribe,
  } as MappedPubSub<T>;
}
