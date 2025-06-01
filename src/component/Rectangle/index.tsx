import { clsx } from 'clsx';
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react';

import { MIN_HEIGHT, MIN_WIDTH } from '../../constant.ts';
import type { Corner, DragRef, RectState, ResizeRef } from '../../types.ts';
import styles from './index.module.css';

type RectangleProps = RectState & {
  isSelected: boolean,
  handleResizeEnd?: (item: RectState) => void,
  handleDragEnd?: (item: RectState) => void,
  handleSelected?: (id: number | null) => void,
};

const Rectangle = ({
  id,
  x,
  y,
  isSelected,
  width,
  height,
  backgroundColor,
  handleDragEnd = () => {},
  handleResizeEnd = () => {},
  handleSelected = () => {},
}: RectangleProps) => {
  const [rect, setRect] = useState<RectState>({
    id,
    x,
    y,
    width,
    height,
    backgroundColor,
  });

  const rectRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<ResizeRef | null>(null);
  const dragRef = useRef<DragRef | null>(null);
  const curRectRef = useRef<RectState>(rect);
  const movedRef = useRef(false);

  const onMouseUp = () => {
    const isResize = resizeRef.current !== null && movedRef.current;
    const isDrag = dragRef.current !== null && movedRef.current;

    if (isResize) handleResizeEnd(curRectRef.current);
    else if (isDrag) handleDragEnd(curRectRef.current);

    resizeRef.current = null;
    dragRef.current = null;
    movedRef.current = false;
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
    };
    movedRef.current = false;

    document.addEventListener('mousemove', onResize);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onResize = (e: globalThis.MouseEvent) => {
    if (!resizeRef.current) return;
    const { corner, x, y, px, py, width, height } = resizeRef.current;
    const dx = e.clientX - px;
    const dy = e.clientY - py;

    if (dx !== 0 || dy !== 0) movedRef.current = true;

    setRect((prevRect) => {
      const newRect = { ...prevRect };

      if (corner.includes('right')) {
        newRect.width = Math.max(MIN_WIDTH, width + dx);
      }
      if (corner.includes('bottom')) {
        newRect.height = Math.max(MIN_HEIGHT, height + dy);
      }
      if (corner.includes('left')) {
        const calculatedWidth = width - dx;

        if (calculatedWidth < MIN_WIDTH) {
          newRect.width = MIN_WIDTH;
          newRect.x = x + width - MIN_WIDTH;
        } else {
          newRect.width = calculatedWidth;
          newRect.x = x + dx;
        }
      }
      if (corner.includes('top')) {
        const calculatedHeight = height - dy;
        if (calculatedHeight < MIN_HEIGHT) {
          newRect.height = MIN_HEIGHT;
          newRect.y = y + height - MIN_HEIGHT;
        } else {
          newRect.height = calculatedHeight;
          newRect.y = y + dy;
        }
      }

      curRectRef.current = newRect;

      return newRect;
    });
  };

  const onMouseDownDrag = (e: ReactMouseEvent) => {
    dragRef.current = {
      x: rect.x,
      y: rect.y,
      px: e.clientX,
      py: e.clientY,
    };

    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onDrag = (e: globalThis.MouseEvent) => {
    const drag = dragRef.current;
    if (!drag) return;

    const dx = e.clientX - drag.px;
    const dy = e.clientY - drag.py;

    if (dx !== 0 || dy !== 0) movedRef.current = true;

    setRect((prevRect) => {
      const newRect = {
        ...prevRect,
        x: drag.x + dx,
        y: drag.y + dy,
      };
      curRectRef.current = newRect;
      return newRect;
    });
  };

  useEffect(() => {
    const newRect = { id, x, y, width, height, backgroundColor };
    setRect(newRect);
    curRectRef.current = newRect;
  }, [id, x, y, width, height, backgroundColor]);

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (
        rectRef.current &&
        !rectRef.current.contains(event.target as Node) &&
        isSelected
      ) {
        handleSelected(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={clsx(styles.rectangle, isSelected && styles.selectecRectangle)}
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
        if (!movedRef.current && !dragRef.current && !resizeRef.current) {
          handleSelected(id);
        }
      }}
      onMouseDown={onMouseDownDrag}
    >
      <div
        className={clsx(styles.pointer, styles.topLeftPointer)}
        onMouseDown={(e) => onMouseDownResize(e, 'top-left')}
      />
      <div
        className={clsx(styles.pointer, styles.topRightPointer)}
        onMouseDown={(e) => onMouseDownResize(e, 'top-right')}
      />
      <div
        className={clsx(styles.pointer, styles.bottomLeftPointer)}
        onMouseDown={(e) => onMouseDownResize(e, 'bottom-left')}
      />
      <div
        className={clsx(styles.pointer, styles.bottomRightPointer)}
        onMouseDown={(e) => onMouseDownResize(e, 'bottom-right')}
      />

      {id}
    </div>
  );
};

export default Rectangle;
