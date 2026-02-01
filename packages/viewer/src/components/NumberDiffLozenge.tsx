import styles from "./NumberDiffLozenge.module.css";

export function NumberDiffLozenge({ value }: { value: number }) {
  const modifier =
    value === 0
      ? styles["--neutral"]
      : value < 0
        ? styles["--decrease"]
        : styles["--increase"];

  return (
    <span class={[styles.lozenge, modifier].join(" ")}>
      {value > 0 ? "+" + value : value}
    </span>
  );
}
