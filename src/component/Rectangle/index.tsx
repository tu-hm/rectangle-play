import { clsx } from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";


import { getRandomColor, getRandomInt } from "../../utils.ts";
import styles from './index.module.css';
import type { RectState } from "./types.ts";

const Rectangle = () => {
  const [rect, setRect] = useState<RectState>({
    width: getRandomInt(100, 200),
    height: getRandomInt(100, 200),
    x: getRandomInt(100, 200),
    y: getRandomInt(100, 200),
  })
  const backgroundColor = useMemo(() => getRandomColor(), [])

  const [selected, setSelected] = useState(false);
  const rectRef = useRef<HTMLDivElement>(null);

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
  })

  return (
    <div
      className={
        clsx(styles.rectangle, selected && styles.selectedReectangle)
      }
      ref={rectRef}
      style={{
        top: `${rect.y}px`,
        left: `${rect.x}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        backgroundColor: backgroundColor,
      }}
      onClick={() => setSelected(true)}
    >
      <div 
        className={clsx(styles.pointer, styles.pointer_topLeft)}
      />
      <div className={clsx(styles.pointer, styles.pointer_bottomLeft)} />
      <div className={clsx(styles.pointer, styles.pointer_bottomRight)} />
      <div className={clsx(styles.pointer, styles.pointer_topRight)} />
    </div>
  )
}

export default Rectangle;