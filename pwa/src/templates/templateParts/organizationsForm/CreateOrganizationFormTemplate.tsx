import * as React from "react";
import * as styles from "./OrganizationFormTemplate.module.css";
import { OrganizationForm } from "./OrganizationForm";

export const CreateOrganizationFormTemplate: React.FC = () => {
  return (
    <div className={styles.container}>
      <OrganizationForm />
    </div>
  );
};
