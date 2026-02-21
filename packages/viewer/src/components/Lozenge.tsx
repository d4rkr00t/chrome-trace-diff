import type { JSX } from "solid-js";

import styles from "./Lozenge.module.css";

export function Lozenge(props: {
  children: JSX.Element;
  color?: "green" | "orange" | "neutral" | "red";
}) {
  return (
    <span
      classList={{
        [styles.lozenge]: true,
        [styles["--" + (props.color ?? "neutral")]]: true,
      }}
    >
      {props.children}
    </span>
  );
}
