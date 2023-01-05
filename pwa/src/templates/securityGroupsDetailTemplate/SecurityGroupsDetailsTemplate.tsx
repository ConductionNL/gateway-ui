import * as React from "react";
import * as styles from "./SecurityGroupsDetailsTemplate.module.css";
import { useTranslation } from "react-i18next";
import { Container } from "@conduction/components";
import { EditSecurityGroupFormTemplate } from "../templateParts/securityGroupsForm/EditSecurityGroupFormTemplate";
import { TEMPORARY_USERGROUPS } from "../../data/userGroup";

interface SecurityGroupsDetailPageProps {
  securityGroupId: string;
}

export const SecurityGroupsDetailsTemplate: React.FC<SecurityGroupsDetailPageProps> = ({ securityGroupId }) => {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = React.useState<number>(0);

  const userGroup = TEMPORARY_USERGROUPS.find((userGroup) => userGroup.id === securityGroupId);

  return (
    <Container layoutClassName={styles.container}>
      <EditSecurityGroupFormTemplate securityGroup={userGroup} {...{ securityGroupId }} />
    </Container>
  );
};
