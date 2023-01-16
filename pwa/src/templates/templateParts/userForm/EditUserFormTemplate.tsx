import * as React from "react";
import * as styles from "./UserFormTemplate.module.css";
import { QueryClient } from "react-query";
import Skeleton from "react-loading-skeleton";
import { useUser } from "../../../hooks/user";
import { UserFormTemplate } from "./UserFormTemplate";
import { useOrganization } from "../../../hooks/organization";

interface EditUserFormTemplateProps {
  userId: string;
}

export const EditUserFormTemplate: React.FC<EditUserFormTemplateProps> = ({ userId }) => {
  const queryClient = new QueryClient();
  const _useUsers = useUser(queryClient);
  const getUser = _useUsers.getOne(userId);

  const _useOrganizations = useOrganization(queryClient);
  const getOrganization = _useOrganizations.getAll();

  return (
    <div className={styles.container}>
      {getUser.isSuccess && <UserFormTemplate user={getUser.data} {...{ getOrganization }} />}

      {getUser.isLoading && <Skeleton height={200} />}
    </div>
  );
};
