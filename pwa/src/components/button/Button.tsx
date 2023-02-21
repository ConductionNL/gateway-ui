import * as React from "react";
import * as styles from "./Button.module.css";

import { Button as DenHaagButton } from "@gemeente-denhaag/components-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string | JSX.Element;
  variant: "primary" | "danger" | "success";
  icon: IconDefinition;

  onClick?: (event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => any;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ label, variant, icon, ...rest }) => {
  return (
    <DenHaagButton className={clsx(styles.button, styles[variant])} {...rest}>
      <FontAwesomeIcon {...{ icon }} />

      {label}
    </DenHaagButton>
  );
};
