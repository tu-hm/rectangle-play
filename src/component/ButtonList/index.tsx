import useRectangleStore from '../../store/rectangleStore';
import Button from './Button';
import styles from './index.module.css';

interface ButtonListProp {
  onCreate: () => void;
  onDelete: () => void;
  onUndo: () => void;
  onRedo: () => void;
}

const ButtonList = ({ onCreate, onDelete, onUndo, onRedo }: ButtonListProp) => {
  const { rectData } = useRectangleStore();
  const canUndo = rectData.historyIndex !== 0;
  const canRedo = rectData.historyIndex !== rectData.history.length;

  return (
    <div className={styles.buttonList}>
      <Button className={styles.createButton} onClick={onCreate}>
        Create
      </Button>
      <Button className={styles.deleteButton} onClick={onDelete}>
        Delete
      </Button>
      <Button
        className={styles.undoButton}
        onClick={onUndo}
        disabled={!canUndo}
      >
        Undo
      </Button>
      <Button
        className={styles.redoButton}
        onClick={onRedo}
        disabled={!canRedo}
      >
        Redo
      </Button>
    </div>
  );
};

export default ButtonList;
