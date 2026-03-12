export function durToMs(dur: number | undefined): number {
  return dur ? dur / 1000 : 0;
}
