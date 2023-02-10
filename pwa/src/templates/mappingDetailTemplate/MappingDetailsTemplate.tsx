import * as React from "react";
import * as styles from "./MappingDetailsTemplate.module.css";
import { useTranslation } from "react-i18next";

import { Container } from "@conduction/components";
import { Button, Heading1 } from "@gemeente-denhaag/components-react";
import { MappingFormTemplate, formId } from "../templateParts/mappingForm/MappingFormTemplate";
import { useMapping } from "../../hooks/mapping";
import { QueryClient } from "react-query";
import { IsLoadingContext } from "../../context/isLoading";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useDashboardCard } from "../../hooks/useDashboardCard";
import Skeleton from "react-loading-skeleton";

interface MappingDetailsTemplateProps {
  mappingId: string;
}

export const MappingDetailTemplate: React.FC<MappingDetailsTemplateProps> = ({ mappingId }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = React.useContext(IsLoadingContext);
  const { toggleDashboardCard, getDashboardCard, loading: dashboardLoading } = useDashboardCard();

  const queryClient = new QueryClient();
  const getMapping = useMapping(queryClient).getOne(mappingId);
  const deleteMapping = useMapping(queryClient).remove();

  const dashboardCard = getDashboardCard(mappingId);

  const toggleFromDashboard = () => {
    toggleDashboardCard(getMapping.data.name, "mapping", "Mapping", mappingId, dashboardCard?.id);
  };

  const handleDelete = () => {
    const confirmDeletion = confirm("Are you sure you want to delete this mapping?");

    confirmDeletion && deleteMapping.mutate({ id: mappingId });
  };

  React.useEffect(() => {
    setIsLoading({ ...isLoading, mappingForm: deleteMapping.isLoading || dashboardLoading });
  }, [deleteMapping.isLoading, dashboardLoading]);

  return (
    <Container layoutClassName={styles.container}>
      {getMapping.isLoading && <Skeleton height="200px" />}
      {getMapping.isSuccess && (
        <>
          <section className={styles.section}>
            <Heading1>{`Edit ${getMapping.data.name}`}</Heading1>

            <div className={styles.buttons}>
              <Button
                type="submit"
                form={formId}
                disabled={isLoading.mappingForm}
                className={clsx(styles.buttonIcon, styles.button)}
              >
                <FontAwesomeIcon icon={faFloppyDisk} />
                {t("Save")}
              </Button>

              <Button
                className={clsx(styles.buttonIcon, styles.button)}
                onClick={toggleFromDashboard}
                disabled={isLoading.mappingForm}
              >
                <FontAwesomeIcon icon={dashboardCard ? faMinus : faPlus} />
                {dashboardCard ? t("Remove from dashboard") : t("Add to dashboard")}
              </Button>

              <Button
                className={clsx(styles.buttonIcon, styles.button, styles.deleteButton)}
                onClick={handleDelete}
                disabled={isLoading.mappingForm}
              >
                <FontAwesomeIcon icon={faTrash} />
                {t("Delete")}
              </Button>
            </div>
          </section>

          <MappingFormTemplate mapping={getMapping.data} />
        </>
      )}
    </Container>
  );
};
