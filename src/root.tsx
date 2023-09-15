import { useEffect, useState } from "react";

import { Room } from "./pages/Room";

import './tailwind.css';

export function Root() {
  return <Room />
}

export function useServerProps<T>() {
  const [props, setProps] = useState<T>({} as T);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setProps(window.__SERVER_PROPS__);
  }, []);

  return props;
}