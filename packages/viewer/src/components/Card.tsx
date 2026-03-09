import { Show, type JSX } from "solid-js";

import styles from "./Card.module.css";

export function Card(props: {
  children?: JSX.Element;
  customClass?: string;
  title?: JSX.Element;
  spacing?: "none" | "sm" | "lg";
}) {
  return (
    <div
      classList={{
        [styles["card"]]: true,
        [styles[`--spacing-${props.spacing ?? "none"}`]]: true,
      }}
    >
      <Show when={props.title}>
        <h3 class={styles["card__title"]}>{props.title}</h3>
      </Show>

      <div
        classList={{
          [styles["card__content"]]: true,
          [props.customClass ?? ""]: !!props.customClass,
        }}
      >
        {props.children}
      </div>
    </div>
  );
}
