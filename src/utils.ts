import { DEFAULT_ID_MIN, DEFAULT_ID_MAX, POSITION_MIN, POSITION_MAX, SIZE_MIN, SIZE_MAX } from "./constant";
import type { RectState } from "./types";

export const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min)) + min;

export const getRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)]
  }
  return color;
};

export const generateRectangle = (id?: number): RectState => ({
  id: id || getRandomInt(DEFAULT_ID_MIN, DEFAULT_ID_MAX),
  x: getRandomInt(POSITION_MIN, POSITION_MAX),
  y: getRandomInt(POSITION_MIN, POSITION_MAX),
  width: getRandomInt(SIZE_MIN, SIZE_MAX),
  height: getRandomInt(SIZE_MIN, SIZE_MAX),
  backgroundColor: getRandomColor()
});