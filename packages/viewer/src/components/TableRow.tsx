import type { JSX } from "solid-js";

export function TableRow(props: { children: JSX.Element }) {
  return <tr>{props.children}</tr>;
}
