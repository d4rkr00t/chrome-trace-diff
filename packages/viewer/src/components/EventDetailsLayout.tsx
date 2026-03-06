export function EventDetailsLayout(props) {
  return <div>{props.beforeEvent?.name ?? props.afterEvent?.name}</div>;
}
