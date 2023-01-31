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

interface EditAuthenticationTemplateProps {
  authenticationId: string;
}

export const EditAuthenticationTemplate: React.FC<EditAuthenticationTemplateProps> = ({ authenticationId }) => {
  const { t } = useTranslation();
  const { toggleDashboardCard, getDashboardCard, loading: dashboardToggleLoading } = useDashboardCard();

  const [loading, setLoading] = React.useState<boolean>(false);

  const queryClient = new QueryClient();
  const _useAuthentications = useAuthentication(queryClient);
  const getAuthentication = _useAuthentications.getOne(authenticationId);
  const deleteAuthentication = _useAuthentications.remove(authenticationId);

  const dashboardCard = getDashboardCard(authenticationId);

  const toggleFromDashboard = () => {
    toggleDashboardCard(
      getAuthentication.data.name,
      "authentication",
      "Authentication Provider",
      getAuthentication.data.id,
      dashboardCard?.id,
    );
  };

  React.useEffect(() => {
    setLoading(deleteAuthentication.isLoading || dashboardToggleLoading);
  }, [deleteAuthentication.isLoading, dashboardToggleLoading]);

  const handleDelete = (): void => {
    deleteAuthentication.mutateAsync({ id: authenticationId });
  };

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <Heading1>
          {getAuthentication.isSuccess ? `Edit ${getAuthentication.data.name}` : "Edit Authentication Provider"}
        </Heading1>

        <div className={styles.buttons}>
          <Button className={clsx(styles.buttonIcon, styles.button)} type="submit" form="AuthForm" disabled={loading}>
            <FontAwesomeIcon icon={faFloppyDisk} />
            {t("Save")}
          </Button>

          <Button className={clsx(styles.buttonIcon, styles.button)} onClick={toggleFromDashboard}>
            <FontAwesomeIcon icon={dashboardCard ? faMinus : faPlus} />
            {dashboardCard ? t("Remove from dashboard") : t("Add to dashboard")}
          </Button>

          <Button
            className={clsx(styles.buttonIcon, styles.button, styles.deleteButton)}
            onClick={handleDelete}
            disabled={loading}
          >
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
