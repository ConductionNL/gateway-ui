import * as React from "react";
import * as styles from "./SecurityGroupsDetailsTemplate.module.css";
import { Container } from "@conduction/components";
import { useSecurityGroup } from "../../hooks/securityGroup";
import { useQueryClient } from "react-query";
import Skeleton from "react-loading-skeleton";
import { useIsLoadingContext } from "../../context/isLoading";
import { SecurityGroupFormTemplate, formId } from "../templateParts/securityGroupsForm/SecurityGroupFormTemplate";
import { FormHeaderTemplate } from "../templateParts/formHeader/FormHeaderTemplate";

interface SecurityGroupsDetailPageProps {
  securityGroupId: string;
}

export const SecurityGroupsDetailsTemplate: React.FC<SecurityGroupsDetailPageProps> = ({ securityGroupId }) => {
  const { setIsLoading, isLoading } = useIsLoadingContext();

  const queryClient = useQueryClient();

  const _useSecurityGroups = useSecurityGroup(queryClient);
  const getSecurityGroup = _useSecurityGroups.getOne(securityGroupId);
  const deleteSecurityGroup = _useSecurityGroups.remove();

  const handleDeleteSecurityGroup = (): void => {
    const confirmDeletion = confirm("Are you sure you want to delete this security group?");

    confirmDeletion && deleteSecurityGroup.mutate({ id: securityGroupId });
  };

  React.useEffect(() => {
    setIsLoading({ securityGroupForm: deleteSecurityGroup.isLoading });
  }, [deleteSecurityGroup.isLoading]);

  return (
    <Container layoutClassName={styles.container}>
      {getSecurityGroup.isLoading && <Skeleton height="200px" />}
      {getSecurityGroup.isError && "Error..."}

      {getSecurityGroup.isSuccess && (
        <>
          <FormHeaderTemplate
            title={`Edit ${getSecurityGroup.data.name}`}
            {...{ formId }}
            disabled={isLoading.securityGroupForm}
            handleDelete={handleDeleteSecurityGroup}
          />

          <SecurityGroupFormTemplate securityGroup={getSecurityGroup.data} />
        </>
      )}
    </Container>
  );
};
