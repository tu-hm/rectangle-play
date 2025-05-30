import { useEffect, useState } from "react";

import type { RectState } from "../../types";
import Rectangle from "../Rectangle";
import styles from './index.module.css';
import useRectangleStore from "../../store/rectangleStore";

type CanvasProps = {
  rectangle: RectState[];
  onSelectId: (id: number) => void;
}

const Canvas = ({
  rectangle,
  onSelectId,
} : CanvasProps) => {
  const [rectangleState, setRectangleState] = useState<RectState[]>(rectangle);
  const { update: updateRect } = useRectangleStore();

  useEffect(() => {
    setRectangleState(rectangle);
  }, [rectangle])

  return (
    <div className={styles.canvas}>
      {
        rectangleState.map((item) => (
          <Rectangle 
            key={item.id}
            id={item.id}
            width={item.width}
            height={item.height}
            x={item.x}
            y={item.y}
            backgroundColor={item.backgroundColor}
            handleSelected={onSelectId}
            handleDragEnd={updateRect}
            handleResizeEnd={updateRect}
          />
        ))
      }
    </div>
  )
}

export default Canvas;