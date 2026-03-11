import type { JSX } from "solid-js";

export function TableCell(props: { children: JSX.Element }) {
  return <td>{props.children}</td>;
}
