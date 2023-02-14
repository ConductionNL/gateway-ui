import * as React from "react";
import * as styles from "./MappingDetailsTemplate.module.css";
import { Container } from "@conduction/components";
import { MappingFormTemplate, formId } from "../templateParts/mappingForm/MappingFormTemplate";
import { useMapping } from "../../hooks/mapping";
import { useQueryClient } from "react-query";
import { useIsLoadingContext } from "../../context/isLoading";
import { useDashboardCard } from "../../hooks/useDashboardCard";
import Skeleton from "react-loading-skeleton";
import { FormHeaderTemplate } from "../templateParts/formHeader/FormHeaderTemplate";

interface MappingDetailsTemplateProps {
  mappingId: string;
}

export const MappingDetailTemplate: React.FC<MappingDetailsTemplateProps> = ({ mappingId }) => {
  const { setIsLoading, isLoading } = useIsLoadingContext();
  const { toggleDashboardCard, getDashboardCard, loading: dashboardLoading } = useDashboardCard();

  const queryClient = useQueryClient();
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
          <FormHeaderTemplate
            title={`Edit ${getMapping.data.name}`}
            {...{ formId }}
            disabled={isLoading.mappingForm}
            handleDelete={handleDelete}
            handleToggleDashboard={{ handleToggle: toggleFromDashboard, isActive: !!dashboardCard }}
          />

          <MappingFormTemplate mapping={getMapping.data} />
        </>
      )}
    </Container>
  );
};
