import { useEffect, useState } from "react";
import { Room } from "./components/Room";

import './tailwind.css';

export function App() {
  return <Room />
}

export function useServerProps() {
  const [props, setProps] = useState();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setProps(window.__SERVER_PROPS__);
  }, []);

  return { props };
}