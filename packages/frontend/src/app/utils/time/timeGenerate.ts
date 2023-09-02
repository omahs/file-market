export const timeGenerate = (time: number): string => {
  return time < 10 ? `0${time.toString()}` : time.toString()
}
