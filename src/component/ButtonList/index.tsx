import clsx from 'clsx';

import styles from './index.module.css'

type ButtonListProp = {
  onCreate?: () => void;
  onDelete?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

const ButtonList = ({
  onCreate,
  onDelete,
  onUndo,
  onRedo,
} : ButtonListProp) => {
  return (
    <div className={styles.buttonList}>
      <button className={clsx(styles.buttonGeneral, styles.createButton)} onClick={onCreate}>Create</button>
      <button className={clsx(styles.buttonGeneral, styles.deleteButton)} onClick={onDelete}>Delete</button>
      <button className={clsx(styles.buttonGeneral, styles.redoButton)} onClick={onUndo}>Undo</button>
      <button className={clsx(styles.buttonGeneral, styles.undoButton)} onClick={onRedo}>Redo</button>
    </div>
  )
}

export default ButtonList;