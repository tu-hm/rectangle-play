import useRectangleStore from '../../store/rectangleStore';
import Rectangle from '../Rectangle';
import styles from './index.module.css';


const Canvas = () => {
  const rectMap = useRectangleStore((state) => state.rectData.rect);
  const updateRect = useRectangleStore((state) => state.update);
  const selectedId = useRectangleStore((state) => state.selectedId);
  const setSelectedId = useRectangleStore((state) => state.setSelectedId);

  const rectArray = Array.from(rectMap.values());

  return (
    <div className={styles.canvas}>
      {rectArray.map((item) => (
        <Rectangle
          key={item.id}
          {...item}
          isSelected={item.id === selectedId}
          handleSelected={setSelectedId}
          handleDragEnd={updateRect}
          handleResizeEnd={updateRect}
        />
      ))}
    </div>
  );
};

export default Canvas;
