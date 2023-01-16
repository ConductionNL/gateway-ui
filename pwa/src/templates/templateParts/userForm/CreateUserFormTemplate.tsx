import * as React from "react";
import * as styles from "./UserFormTemplate.module.css";
import { UserFormTemplate } from "./UserFormTemplate";
import { QueryClient } from "react-query";
import { useOrganization } from "../../../hooks/organization";

export const CreateUserFormTemplate: React.FC = () => {
  const queryClient = new QueryClient();
  const _useOrganizations = useOrganization(queryClient);
  const getOrganization = _useOrganizations.getAll();

  return (
    <div className={styles.container}>
      <UserFormTemplate {...{ getOrganization }} />
    </div>
  );
};
