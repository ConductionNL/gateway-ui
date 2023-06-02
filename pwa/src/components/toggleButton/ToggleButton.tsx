import * as React from "react";
import * as styles from "./ToggleButton.module.css";
import clsx from "clsx";

interface ToggleButtonProps {
  defaultState: boolean;
  startLabel?: string;
  endLabel?: string;
  onChange?: () => any;
  layoutClassName?: any;
  disabled?: boolean;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  startLabel,
  endLabel,
  defaultState,
  onChange,
  layoutClassName,
  disabled,
}) => {
  const [isEnabled, setIsEnabled] = React.useState<boolean>(defaultState);

  const uuid = Math.floor(Math.random() * Date.now()).toString();

  const handleChange = () => {
    onChange && onChange();

    setIsEnabled(!isEnabled);
  };

  return (
    <div className={clsx(styles.container, [layoutClassName && layoutClassName, disabled && styles.disabled])}>
      {startLabel}
      <div className={styles.switchContainer}>
        <input id={uuid} type="checkbox" checked={isEnabled} onChange={handleChange} {...{ disabled }} />
        <label htmlFor={uuid}></label>
      </div>
      {endLabel}
    </div>
  );
};

export default ToggleButton;
