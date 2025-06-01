import clsx from 'clsx';

import styles from './Button.module.css';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

const Button = ({ onClick, children, disabled, className }: ButtonProps) => (
  <button
    className={clsx(styles.buttonGeneral, className)}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export default Button;
