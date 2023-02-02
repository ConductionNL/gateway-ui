import * as React from "react";
import * as styles from "./SecurityGroupsDetailsTemplate.module.css";
import { Container } from "@conduction/components";
import { useSecurityGroup } from "../../hooks/securityGroup";
import { QueryClient } from "react-query";
import Skeleton from "react-loading-skeleton";
import { faFloppyDisk, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Heading1, Button } from "@gemeente-denhaag/components-react";
import clsx from "clsx";
import { t } from "i18next";
import { IsLoadingContext } from "../../context/isLoading";
import { SecurityGroupFormTemplate, formId } from "../templateParts/securityGroupsForm/SecurityGroupFormTemplate";

interface SecurityGroupsDetailPageProps {
  securityGroupId: string;
}

export const SecurityGroupsDetailsTemplate: React.FC<SecurityGroupsDetailPageProps> = ({ securityGroupId }) => {
  const [isLoading, setIsLoading] = React.useContext(IsLoadingContext);

  const queryClient = new QueryClient();

  const _useSecurityGroups = useSecurityGroup(queryClient);
  const getSecurityGroup = _useSecurityGroups.getOne(securityGroupId);
  const deleteSecurityGroup = _useSecurityGroups.remove();

  const handleDelete = (): void => {
    const confirmDeletion = confirm("Are you sure you want to delete this security group?");

    confirmDeletion && deleteSecurityGroup.mutate({ id: securityGroupId });
  };

  React.useEffect(() => {
    setIsLoading({ ...isLoading, securityGroupForm: deleteSecurityGroup.isLoading });
  }, [deleteSecurityGroup.isLoading]);

  return (
    <Container layoutClassName={styles.container}>
      {getSecurityGroup.isLoading && <Skeleton height="200px" />}
      {getSecurityGroup.isError && "Error..."}

      {getSecurityGroup.isSuccess && (
        <>
          <section className={styles.section}>
            <Heading1>{`Edit ${getSecurityGroup.data.name}`}</Heading1>

            <div className={styles.buttons}>
              <Button
                type="submit"
                form={formId}
                disabled={isLoading.securityGroupForm}
                className={clsx(styles.buttonIcon, styles.button)}
              >
                <FontAwesomeIcon icon={faFloppyDisk} />
                {t("Save")}
              </Button>

              <Button
                className={clsx(styles.buttonIcon, styles.button, styles.deleteButton)}
                onClick={handleDelete}
                disabled={isLoading.securityGroupForm}
              >
                <FontAwesomeIcon icon={faTrash} />
                {t("Delete")}
              </Button>
            </div>
          </section>

          <SecurityGroupFormTemplate securityGroup={getSecurityGroup.data} />
        </>
      )}
    </Container>
  );
};
