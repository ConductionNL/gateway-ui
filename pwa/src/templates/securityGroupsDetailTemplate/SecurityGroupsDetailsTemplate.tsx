import * as React from "react";
import * as styles from "./SecurityGroupsDetailsTemplate.module.css";
import { Container } from "@conduction/components";
import { EditSecurityGroupFormTemplate } from "../templateParts/securityGroupsForm/EditSecurityGroupFormTemplate";
import { useSecurityGroup } from "../../hooks/securityGroup";
import { QueryClient } from "react-query";
import Skeleton from "react-loading-skeleton";

interface SecurityGroupsDetailPageProps {
  securityGroupId: string;
}

export const SecurityGroupsDetailsTemplate: React.FC<SecurityGroupsDetailPageProps> = ({ securityGroupId }) => {
  const queryClient = new QueryClient();
  const _useSecurityGroups = useSecurityGroup(queryClient);
  const getSecurityGroups = _useSecurityGroups.getOne(securityGroupId);

  return (
    <Container layoutClassName={styles.container}>
      {getSecurityGroups.isLoading && <Skeleton height="200px" />}
      {getSecurityGroups.isError && "Error..."}

      {getSecurityGroups.isSuccess && (
        <EditSecurityGroupFormTemplate securityGroup={getSecurityGroups.data} {...{ securityGroupId }} />
      )}
    </Container>
  );
};
