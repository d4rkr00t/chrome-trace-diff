export function durToMs(dur: number | undefined): number {
  return dur ? Math.ceil(dur / 1000) : 0;
}
