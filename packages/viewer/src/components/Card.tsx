import type { JSX } from "solid-js";

import styles from "./Card.module.css";

export function Card(props: { children?: JSX.Element; customClass?: string }) {
  return (
    <div
      classList={{
        [styles["card"]]: true,
        [props.customClass ?? ""]: !!props.customClass,
      }}
    >
      {props.children}
    </div>
  );
}
