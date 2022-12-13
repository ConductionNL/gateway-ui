import * as React from "react";
import * as styles from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <span className={styles.message}>{message}</span>
);
