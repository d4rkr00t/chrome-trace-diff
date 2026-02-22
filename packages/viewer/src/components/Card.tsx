import type { JSX } from "solid-js";

import styles from "./Card.module.css";

export function Card(props: { children: JSX.Element }) {
  return <div class={styles["menubar"]}>{props.children}</div>;
}
