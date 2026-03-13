export function durToMs(dur: number | undefined): number {
  return dur ? parseFloat((dur / 1000).toPrecision(2)) : 0;
}
