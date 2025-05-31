import { clsx } from "clsx";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent
} from "react";


import { MIN_HEIGHT, MIN_WIDTH } from "../../constant.ts";
import type { Corner, DragRef, RectState, ResizeRef } from "../../types.ts";
import styles from './index.module.css';

type RectangleProps = RectState & {
  handleResizeEnd?: (item: RectState) => void;
  handleDragEnd?: (item: RectState) => void;
  handleSelected?: (id: number) => void;
};

const Rectangle = ({
  id,
  x,
  y,
  width,
  height,
  backgroundColor,
  handleDragEnd = () => { },
  handleResizeEnd = () => { },
  handleSelected = () => { },
}: RectangleProps) => {
  const [rect, setRect] = useState<RectState>({
    id,
    x,
    y,
    width,
    height,
    backgroundColor,
  });
  const [selected, setSelected] = useState(false);

  const rectRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<ResizeRef | null>(null);
  const dragRef = useRef<DragRef | null>(null);
  const curRectRef = useRef<RectState>(rect);


  const onMouseUp = () => {
    const isResize = resizeRef.current !== null;
    const isDrag = dragRef.current !== null;

    if (isResize) handleResizeEnd(curRectRef.current);
    if (isDrag) handleDragEnd(curRectRef.current);

    resizeRef.current = null;
    dragRef.current = null;
    document.removeEventListener('mousemove', onResize);
    document.removeEventListener('mousemove', onDrag);
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
        newRect.width = Math.max(MIN_WIDTH, width + dx);
      }
      if (corner.includes('bottom')) {
        newRect.height = Math.max(MIN_HEIGHT, height + dy);
      }
      if (corner.includes('left')) {
        newRect.width = Math.max(MIN_WIDTH, width - dx);
        newRect.x = x + dx;
      }
      if (corner.includes('top')) {
        newRect.height = Math.max(MIN_HEIGHT, height - dy);
        newRect.y = y + dy;
      }

      curRectRef.current = newRect;

      return newRect;
    });
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
    const drag = dragRef.current;
    if (!drag) return;
    const dx = e.clientX - drag.px;
    const dy = e.clientY - drag.py;
    setRect((prevRect) => {
      const newRect = {
        ...prevRect,
        x: drag.x + dx,
        y: drag.y + dy
      };
      curRectRef.current = newRect;
      return newRect;
    });
  }

  useEffect(() => {
    setRect({
      id,
      x,
      y,
      width,
      height,
      backgroundColor,
    });
  }, [id, x, y, width, height, backgroundColor]);
  
  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (rectRef.current && !rectRef.current.contains(event.target as Node)) {
        setSelected(false);
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
        clsx(styles.rectangle, selected && styles.selectecRectangle)
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
      onClick={() => {
        setSelected(prev => !prev);
        handleSelected(id);
      }}
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
