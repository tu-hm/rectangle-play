import { useRef } from 'react';

import useRectangleStore from '../../store/rectangleStore';
import ButtonList from '../ButtonList';
import Canvas from '../Canvas';
import styles from './index.module.css';
import { generateRectangle } from '../../utils';

const Playground = () => {
  const {
    append: appendRect,
    remove: removeRect,
    undo: undoRect,
    redo: redoRect,
  } = useRectangleStore();

  const selectedId = useRectangleStore((state) => state.selectedId);
  const setSelectedId = useRectangleStore((state) => state.setSelectedId);
  const totalRect = useRef(0);

  const onCreate = () => {
    totalRect.current += 1;
    const newRectId = totalRect.current;
    const newRect = generateRectangle(newRectId);
    appendRect(newRect);
  };

  const onDelete = () => {
    if (selectedId === null) return;
    removeRect(selectedId);
    setSelectedId(null);
  };

  return (
    <div className={styles.playground}>
      <ButtonList
        onCreate={onCreate}
        onDelete={onDelete}
        onUndo={undoRect}
        onRedo={redoRect}
      />
      <Canvas />
    </div>
  );
};

export default Playground;
