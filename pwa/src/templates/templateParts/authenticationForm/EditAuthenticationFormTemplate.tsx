import * as React from "react";
import * as styles from "./AuthenticationFormTemplate.module.css";
import { QueryClient } from "react-query";
import Skeleton from "react-loading-skeleton";
import { Button, Heading1 } from "@gemeente-denhaag/components-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { useDashboardCard } from "../../../hooks/useDashboardCard";
import { AuthenticationFormTemplate } from "./AuthenticationFormTemplate";
import { useAuthentication } from "../../../hooks/authentication";
import clsx from "clsx";

interface EditAuthenticationFormTemplateProps {
  authenticationId: string;
}

export const EditAuthenticationFormTemplate: React.FC<EditAuthenticationFormTemplateProps> = ({ authenticationId }) => {
  const { t } = useTranslation();
  const { addOrRemoveDashboardCard, getDashboardCard } = useDashboardCard();

  const queryClient = new QueryClient();
  const _useAuthentications = useAuthentication(queryClient);
  const getAuthentication = _useAuthentications.getOne(authenticationId);
  const deleteAuthentication = _useAuthentications.remove(authenticationId);

  const dashboardCard = getDashboardCard(getAuthentication.data.id);

  const addOrRemoveFromDashboard = () => {
    addOrRemoveDashboardCard(
      getAuthentication.data.name,
      "Authentication",
      "Authentication",
      getAuthentication.data.id,
      dashboardCard?.id,
    );
  };

  const handleDelete = (): void => {
    deleteAuthentication.mutateAsync({ id: authenticationId });
  };

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <Heading1>
          {getAuthentication.isSuccess ? `Edit ${getAuthentication.data.name}` : "Edit Authentication"}
        </Heading1>

        <div className={styles.buttons}>
          <Button className={styles.buttonIcon} type="submit" form="AuthForm">
            <FontAwesomeIcon icon={faFloppyDisk} />
            {t("Save")}
          </Button>

          <Button className={styles.buttonIcon} onClick={addOrRemoveFromDashboard}>
            <FontAwesomeIcon icon={dashboardCard ? faMinus : faPlus} />
            {dashboardCard ? t("Remove from dashboard") : t("Add to dashboard")}
          </Button>

          <Button className={clsx(styles.buttonIcon, styles.deleteButton)} onClick={handleDelete}>
            <FontAwesomeIcon icon={faTrash} />
            {t("Delete")}
          </Button>
        </div>
      </section>

      {getAuthentication.isSuccess && <AuthenticationFormTemplate authentication={getAuthentication.data} />}
      {getAuthentication.isLoading && <Skeleton height={200} />}
    </div>
  );
};
