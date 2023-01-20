import * as React from "react";
import * as styles from "./UserFormTemplate.module.css";
import { QueryClient } from "react-query";
import Skeleton from "react-loading-skeleton";
import { useUser } from "../../../hooks/user";
import { UserFormTemplate } from "./UserFormTemplate";
import { useOrganization } from "../../../hooks/organization";
import { Heading1 } from "@gemeente-denhaag/typography";
import Button from "@gemeente-denhaag/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useDashboardCard } from "../../../hooks/useDashboardCard";
import { useTranslation } from "react-i18next";

interface EditUserFormTemplateProps {
  userId: string;
}

export const EditUserFormTemplate: React.FC<EditUserFormTemplateProps> = ({ userId }) => {
  const { t } = useTranslation();
  const { addOrRemoveDashboardCard, getDashboardCard } = useDashboardCard();
  const [loading, setLoading] = React.useState<boolean>(false);

  const queryClient = new QueryClient();
  const _useUsers = useUser(queryClient);
  const getUser = _useUsers.getOne(userId);

  const _useOrganizations = useOrganization(queryClient);
  const getOrganization = _useOrganizations.getAll();

  const dashboardCard = getDashboardCard(getUser.data?.id);

  const addOrRemoveFromDashboard = () => {
    addOrRemoveDashboardCard(getUser.data.name, "User", "User", getUser.data.id, dashboardCard?.id);
  };

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <Heading1>{getUser.data?.id ? `Edit ${getUser.data.name}` : "Edit User"}</Heading1>

        <div className={styles.buttons}>
          <Button className={styles.buttonIcon} type="submit" form="UserForm" disabled={loading}>
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

      {getUser.isSuccess && <UserFormTemplate user={getUser.data} {...{ getOrganization }} />}

      {getUser.isLoading && <Skeleton height={200} />}
    </div>
  );
};
