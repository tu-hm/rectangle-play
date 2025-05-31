import clsx from 'clsx';

import styles from './index.module.css'
import useRectangleStore from '../../store/rectangleStore';

type ButtonListProp = {
  onCreate: () => void;
  onDelete: () => void;
  onUndo: () => void;
  onRedo: () => void;
}

const ButtonList = ({
  onCreate,
  onDelete,
  onUndo,
  onRedo,
}: ButtonListProp) => {
  const { rectData } = useRectangleStore();
  const canUndo = rectData.history.past.length !== 0;
  const canRedo = rectData.history.future.length !== 0;

  return (
    <div className={styles.buttonList}>
      <button
        className={clsx(styles.buttonGeneral, styles.createButton)}
        onClick={onCreate}
      >
        Create
      </button>
      <button 
        className={clsx(styles.buttonGeneral, styles.deleteButton)} 
        onClick={onDelete}
      >
        Delete
      </button>
      <button 
        className={clsx(styles.buttonGeneral, styles.undoButton)} 
        disabled={!canUndo} 
        onClick={onUndo}
      >
        Undo
      </button>
      <button 
        className={clsx(styles.buttonGeneral, styles.redoButton)} 
        disabled={!canRedo} 
        onClick={onRedo}
      >
        Redo
      </button>
    </div>
  )
}

export default ButtonList;