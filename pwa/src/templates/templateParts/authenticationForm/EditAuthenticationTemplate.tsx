import * as React from "react";
import * as styles from "./AuthenticationFormTemplate.module.css";
import { QueryClient } from "react-query";
import Skeleton from "react-loading-skeleton";
import { useDashboardCard } from "../../../hooks/useDashboardCard";
import { AuthenticationFormTemplate, formId } from "./AuthenticationFormTemplate";
import { useAuthentication } from "../../../hooks/authentication";
import { useIsLoadingContext } from "../../../context/isLoading";
import { FormHeaderTemplate } from "../formHeader/FormHeaderTemplate";

interface EditAuthenticationTemplateProps {
  authenticationId: string;
}

export const EditAuthenticationTemplate: React.FC<EditAuthenticationTemplateProps> = ({ authenticationId }) => {
  const { toggleDashboardCard, getDashboardCard, loading: dashboardToggleLoading } = useDashboardCard();
  const { setIsLoading, isLoading } = useIsLoadingContext();

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
    setIsLoading({ authenticationForm: deleteAuthentication.isLoading || dashboardToggleLoading });
  }, [deleteAuthentication.isLoading, dashboardToggleLoading]);

  const handleDeleteAuthentication = (): void => {
    const confirmDeletion = confirm("Are you sure you want to delete this authentication provider?");

    confirmDeletion && deleteAuthentication.mutateAsync({ id: authenticationId });
  };

  return (
    <div className={styles.container}>
      <FormHeaderTemplate
        title={getAuthentication.isSuccess ? `Edit ${getAuthentication.data.name}` : "Edit Authentication Provider"}
        {...{ formId }}
        disabled={isLoading.authenticationForm}
        handleDelete={handleDeleteAuthentication}
        handleToggleDashboard={{ handleToggle: toggleFromDashboard, isActive: !!dashboardCard }}
      />

      {getAuthentication.isSuccess && <AuthenticationFormTemplate authentication={getAuthentication.data} />}
      {getAuthentication.isLoading && <Skeleton height={200} />}
    </div>
  );
};
