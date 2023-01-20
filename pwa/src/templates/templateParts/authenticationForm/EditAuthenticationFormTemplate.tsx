import * as React from "react";
import * as styles from "./AuthenticationFormTemplate.module.css";
import { QueryClient } from "react-query";
import Skeleton from "react-loading-skeleton";
import { Button, Heading1 } from "@gemeente-denhaag/components-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { useDashboardCard } from "../../../hooks/useDashboardCard";
import { AuthenticationFormTemplate } from "./AuthenticationFormTemplate";

interface EditAuthenticationFormTemplateProps {
  authenticationId: string;
}

export const EditAuthenticationFormTemplate: React.FC<EditAuthenticationFormTemplateProps> = ({ authenticationId }) => {
  const { t } = useTranslation();
  const { addOrRemoveDashboardCard, getDashboardCard } = useDashboardCard();
  const [loading, setLoading] = React.useState<boolean>(false);

  const queryClient = new QueryClient();
  const _useAuthentications = useAuthentication(queryClient);
  const getAuthentication = _useAuthentications.getOne(authenticationId);

  const dashboardCard = getDashboardCard(getAuthentication.data?.id);

  const addOrRemoveFromDashboard = () => {
    addOrRemoveDashboardCard(getAuthentication.data?.name, "Authentication", "Authentication", getAuthentication.data?.id, dashboardCard?.id);
  };

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <Heading1>
          {getAuthentication.isSuccess ? `Edit ${getAuthentication.data.name}` : "Edit Authentication"}
        </Heading1>

        <div className={styles.buttons}>
          <Button className={styles.buttonIcon} type="submit" form="AuthForm" disabled={loading}>
            <FontAwesomeIcon icon={faFloppyDisk} />
            {t("Save")}
          </Button>

          <Button className={styles.buttonIcon} onClick={addOrRemoveFromDashboard}>
            <FontAwesomeIcon icon={dashboardCard ? faMinus : faPlus} />
            {dashboardCard ? t("Remove from dashboard") : t("Add to dashboard")}
          </Button>

          {/* <Button className={clsx(styles.buttonIcon, styles.deleteButton)} onClick={handleDelete}>
            <FontAwesomeIcon icon={faTrash} />
            {t("Delete")}
          </Button> */}
        </div>
      </section>

      {getAuthentication.isSuccess && <AuthenticationFormTemplate authentication={getAuthentication.data} />}

      {getAuthentication.isLoading && <Skeleton height={200} />}
    </div>
  );
};
