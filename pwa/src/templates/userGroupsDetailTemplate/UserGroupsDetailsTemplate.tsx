import * as React from "react";
import * as styles from "./UserGroupsDetailsTemplate.module.css";
import { useTranslation } from "react-i18next";
import { Container } from "@conduction/components";
import { EditUserGroupFormTemplate } from "../templateParts/userGroupsForm/EditUserGroupFormTemplate";
import { TEMPORARY_USERGROUPS } from "../../data/userGroup";

interface UserGroupsDetailPageProps {
  userGroupId: string;
}

export const UserGroupsDetailTemplate: React.FC<UserGroupsDetailPageProps> = ({ userGroupId }) => {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = React.useState<number>(0);

  //   const queryClient = new QueryClient();
  //   const _useUserGroup = useUserGroup(queryClient);
  //   const getUserGroup = _useUserGroup.getOne(userGroupId);

  const userGroup = TEMPORARY_USERGROUPS.find((userGroup) => userGroup.id === userGroupId);

  return (
    <Container layoutClassName={styles.container}>
      {/* {getUserGroup.isError && "Error..."} */}

      {/* {getUserGroup.isSuccess && ( */}
      <EditUserGroupFormTemplate userGroup={userGroup} {...{ userGroupId }} />
      {/* )} */}
      {/* {getUserGroup.isLoading && <Skeleton height="200px" />} */}
    </Container>
  );
};
