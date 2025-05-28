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
import type { DragRef, Corner, RectState, ResizeRef } from "./types.ts";

type RectangleProps = {
  id: number;
  handleResizeEnd?: () => void,
  handleDragEnd?: () => void,
} & Partial<Omit<RectState, 'id'>>;

const Rectangle = ({
  id,
  handleDragEnd = (() => {}),
  handleResizeEnd = (() => {}),
  ...initialRect
}: RectangleProps) => {
  const [rect, setRect] = useState<RectState>({
    id,
    width: getRandomInt(100, 200),
    height: getRandomInt(100, 200),
    x: getRandomInt(100, 200),
    y: getRandomInt(100, 200),
    selected: false,
    backgroundColor: getRandomColor(),
    ...initialRect,
  })

  const rectRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<ResizeRef | null>(null);
  const dragRef = useRef<DragRef | null>(null);


  const onMouseUp = () => {
    const isResize = resizeRef !== null;
    const isDrag = dragRef !== null;

    if (isResize) handleResizeEnd();
    if (isDrag) handleDragEnd();

    resizeRef.current = null;
    dragRef.current = null;
    document.removeEventListener('mousemove', onResize);
    document.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('mousemove', onDrag);
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


  const onMouseDownDrag = (e: ReactMouseEvent) => {
    dragRef.current = {
      x: rect.x,
      y: rect.y,
      px: e.clientX,
      py: e.clientY,
    }

    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', onMouseUp);
  }

  const onDrag = (e: globalThis.MouseEvent) => {
    if(!dragRef.current) return;
    const dx = e.clientX - dragRef.current.px;
    const dy = e.clientY - dragRef.current.py;
    setRect((prevRect) => ({
      ...prevRect,
      x: dragRef.current!.x + dx,
      y: dragRef.current!.y + dy
    }));
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
        backgroundColor: rect.backgroundColor,
        zIndex: id,
      }}
      onClick={() => setRect(prev => ({ ...prev, selected: true }))}
      onMouseDown={onMouseDownDrag}
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
