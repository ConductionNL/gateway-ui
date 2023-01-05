import * as React from "react";
import * as styles from "./ToggleButton.module.css";
import clsx from "clsx";

interface ToggleButtonProps {
  startLabel?: string;
  endLabel?: string;
  defaultState?: boolean;
  checked?: boolean;
  onChange?: () => any;
  onEnabled?: () => any;
  onDisabled?: () => any;
  layoutClassName?: any;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  startLabel,
  endLabel,
  defaultState,
  checked,
  onChange,
  onEnabled,
  onDisabled,
  layoutClassName,
}) => {
  const [isEnabled, setIsEnabled] = React.useState<boolean>(defaultState ?? false);

  const uuid = Math.floor(Math.random() * Date.now()).toString();

  const handleChange = () => {
    onChange && onChange();

    setIsEnabled(!isEnabled);
  };

  !!checked && checked !== isEnabled && setIsEnabled(checked);

  React.useEffect(() => {
    if (!!onEnabled && isEnabled) return onEnabled();
    if (!!onDisabled && !isEnabled) return onDisabled();
  }, [isEnabled]);

  return (
    <div className={clsx(styles.container, [layoutClassName && layoutClassName])}>
      {startLabel}
      <div className={styles.switchContainer}>
        <input id={uuid} type="checkbox" checked={checked ?? isEnabled} onChange={handleChange} />
        <label htmlFor={uuid}></label>
      </div>
      {endLabel}
    </div>
  );
};

export default ToggleButton;
