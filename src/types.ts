export type RectState = {
  id: number;
  width: number;
  height: number;
  x: number;
  y: number;
  backgroundColor: string;
}

export type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export type ResizeRef = {
  id: number;
  corner: Corner;
  x: number;
  y: number;
  px: number;
  py: number;
  width: number;
  height: number;
}

export type DragRef = {
  x: number;
  y: number;
  px: number;
  py: number;
}