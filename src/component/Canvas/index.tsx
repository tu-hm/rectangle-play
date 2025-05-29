import useRectangleStore from "../../store/rectangleStore";
import Rectangle from "../Rectangle";

type CanvasProps = {
  onSelectId: (id: number) => void;
}

const Canvas = ({
  onSelectId
} : CanvasProps) => {
  const { rectData, update: updateRect } = useRectangleStore();

  return (
    <div>
      {
        rectData.rect.map((item) => (
          <Rectangle 
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