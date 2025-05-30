
import useRectangleStore from "../../store/rectangleStore";
import Rectangle from "../Rectangle";
import styles from './index.module.css';

type CanvasProps = {
  onSelectId: (id: number) => void;
}

const Canvas = ({
  onSelectId,
} : CanvasProps) => {
  const { rectData, update: updateRect } = useRectangleStore();

  return (
    <div className={styles.canvas}>
      {
        rectData.rect.map((item) => (
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