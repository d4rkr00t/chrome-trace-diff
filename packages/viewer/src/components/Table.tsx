import type { JSX } from "solid-js";

export function Table(props: { children: JSX.Element }) {
  return <table>{props.children}</table>;
}
