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
  const canNotUndo = rectData.history.past.length === 0;
  const canNotRedo = rectData.history.future.length === 0;

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
        className={clsx(styles.buttonGeneral, styles.redoButton)} 
        disabled={canNotUndo} 
        onClick={onUndo}
      >
        Undo
      </button>
      <button 
        className={clsx(styles.buttonGeneral, styles.undoButton)} 
        disabled={canNotRedo} 
        onClick={onRedo}
      >
        Redo
      </button>
    </div>
  )
}

export default ButtonList;