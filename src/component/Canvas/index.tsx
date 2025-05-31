import type { Dispatch, SetStateAction } from 'react';

import useRectangleStore from '../../store/rectangleStore';
import Rectangle from '../Rectangle';
import styles from './index.module.css';

type CanvasProps = {
  onSelectId: Dispatch<SetStateAction<number | null>>,
};

const Canvas = ({ onSelectId }: CanvasProps) => {
  const rectList = useRectangleStore((state) => state.rectData.rect);
  const updateRect = useRectangleStore((state) => state.update);

  return (
    <div className={styles.canvas}>
      {rectList.map((item) => (
        <Rectangle
          key={item.id}
          {...item}
          handleSelected={onSelectId}
          handleDragEnd={updateRect}
          handleResizeEnd={updateRect}
        />
      ))}
    </div>
  );
};

export default Canvas;
