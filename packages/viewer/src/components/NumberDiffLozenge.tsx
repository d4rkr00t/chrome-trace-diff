import { createSignal } from "solid-js";
import styles from "./NumberDiffLozenge.module.css";
import { effect } from "solid-js/web";

export function NumberDiffLozenge(props: { value: number; unit?: string }) {
  const [modifier, setModifier] = createSignal(styles["--neutral"]);

  effect(() => {
    setModifier(
      props.value === 0
        ? styles["--neutral"]
        : props.value < 0
          ? styles["--decrease"]
          : styles["--increase"],
    );
  });

  return (
    <span class={[styles.lozenge, modifier()].join(" ")}>
      {props.value > 0 ? "+" + props.value : props.value}
      {props.unit}
    </span>
  );
}
