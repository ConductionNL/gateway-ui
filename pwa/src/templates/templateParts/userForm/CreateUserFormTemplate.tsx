import * as React from "react";
import * as styles from "./UserFormTemplate.module.css";
import { UserFormTemplate } from "./UserFormTemplate";

export const CreateUserFormTemplate: React.FC = () => {
  return (
    <div className={styles.container}>
      <UserFormTemplate />
    </div>
  );
};
