import { clsx } from "clsx";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent
} from "react";


import { getRandomColor, getRandomInt } from "../../utils.ts";
import { minHeight, minWidth } from "./constant.ts";
import styles from './index.module.css';
import type { Corner, RectState, ResizeRef } from "./types.ts";

type RectangleProps = {
  id: number;
} & Partial<Omit<RectState, 'id'>>;

const backgroundColor = getRandomColor();

const Rectangle = ({
  id,
  ...initialRect
}: RectangleProps) => {
  const [rect, setRect] = useState<RectState>({
    id,
    width: getRandomInt(100, 200),
    height: getRandomInt(100, 200),
    x: getRandomInt(100, 200),
    y: getRandomInt(100, 200),
    selected: false,
    ...initialRect,
  })

  const rectRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<ResizeRef | null>(null)


  const onMouseUp = () => {
    resizeRef.current = null;
    document.removeEventListener('mousemove', onResize);
    document.removeEventListener('mouseup', onMouseUp);
  };


  const onMouseDownResize = (e: ReactMouseEvent, corner: Corner) => {
    e.stopPropagation();
    e.preventDefault();

    resizeRef.current = {
      id,
      corner,
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      px: e.clientX,
      py: e.clientY,
    }

    document.addEventListener('mousemove', onResize);
    document.addEventListener('mouseup', onMouseUp);
  }

  const onResize = (e: globalThis.MouseEvent) => {
    if (!resizeRef.current) return;
    const {
      corner,
      x,
      y,
      px,
      py,
      width,
      height
    } = resizeRef.current;
    const dx = e.clientX - px;
    const dy = e.clientY - py;

    setRect((prevRect) => {
      const newRect = { ...prevRect };

      if (corner.includes('right')) {
        newRect.width = Math.max(minWidth, width + dx);
      }
      if (corner.includes('bottom')) {
        newRect.height = Math.max(minHeight, height + dy);
      }
      if (corner.includes('left')) {
        newRect.width = Math.max(minWidth, width - dx);
        newRect.x = x + dx;
      }
      if (corner.includes('top')) {
        newRect.height = Math.max(minHeight, height - dy);
        newRect.y = y + dy;
      }

      return newRect;
    })
  }

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (rectRef.current && !rectRef.current.contains(event.target as Node)) {
        setRect(prev => ({ ...prev, selected: false }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [])

  return (
    <div
      className={
        clsx(styles.rectangle, rect.selected && styles.selectecRectangle)
      }
      ref={rectRef}
      style={{
        top: `${rect.y}px`,
        left: `${rect.x}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        backgroundColor: backgroundColor,
        zIndex: id,
      }}
      onClick={() => setRect(prev => ({ ...prev, selected: true }))}
    >
      <div
        className={clsx(styles.pointer, styles.topLeftPointer)}
        onMouseDown={(e) => onMouseDownResize(e, 'top-left')}
      />
      <div
        className={clsx(styles.pointer, styles.bottomLeftPointer)}
        onMouseDown={(e) => onMouseDownResize(e, 'bottom-left')}
      />
      <div
        className={clsx(styles.pointer, styles.bottomRightPointer)}
        onMouseDown={(e) => onMouseDownResize(e, 'bottom-right')}
      />
      <div
        className={clsx(styles.pointer, styles.topRightPointer)}
        onMouseDown={(e) => onMouseDownResize(e, 'top-right')}
      />

      {id}
    </div>
  )
}

export default Rectangle;
