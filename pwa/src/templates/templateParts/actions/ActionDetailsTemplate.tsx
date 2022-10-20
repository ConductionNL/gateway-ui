import * as React from "react";
import * as styles from "./ActionDetailsTemplate.module.css";
import { useTranslation } from "react-i18next";
import { useAction } from "../../../hooks/action";
import { QueryClient } from "react-query";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { EditActionFormTemplate } from "../actionsForm/EditActionFormTemplate";

interface ActionDetailsTemplateProps {
  actionId: string;
}

export const ActionsDetailTemplate: React.FC<ActionDetailsTemplateProps> = ({ actionId }) => {
  const { t } = useTranslation();

  const queryClient = new QueryClient();
  const _useActions = useAction(queryClient);
  const getActions = _useActions.getOne(actionId);

  return (
    <Container layoutClassName={styles.container}>
      {getActions.isLoading && <Skeleton height="200px" />}
      {getActions.isError && "Error..."}

      {getActions.isSuccess && <EditActionFormTemplate action={getActions.data} {...{ actionId }} />}
    </Container>
  );
};
