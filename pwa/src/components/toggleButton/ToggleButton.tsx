import * as React from "react";
import * as styles from "./ToggleButton.module.css";
import clsx from "clsx";

interface ToggleButtonProps {
  layoutClassName?: any;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ layoutClassName }) => {
  const uuid = Math.floor(Math.random() * Date.now()).toString()

  return (
    <div className={clsx([layoutClassName && layoutClassName])}>
      <div className={styles.switchContainer}>
        <input id={uuid} type="checkbox" />
        <label htmlFor={uuid}></label>
      </div>
    </div>
  );
};

export default ToggleButton;
