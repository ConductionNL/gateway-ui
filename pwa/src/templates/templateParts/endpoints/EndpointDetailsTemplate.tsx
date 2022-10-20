import * as React from "react";
import * as styles from "./EndpointDetailsTemplate.module.css";
import { useTranslation } from "react-i18next";
import { QueryClient } from "react-query";
import { useEndpoint } from "../../../hooks/endpoints";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { EditEndpointFormTemplate } from "../endpointsForm/EditEndpointsFormTemplate";

interface EndpointDetailsTemplateProps {
  endpointId: string;
}

export const EndpointDetailTemplate: React.FC<EndpointDetailsTemplateProps> = ({ endpointId }) => {
  const { t } = useTranslation();

  const queryClient = new QueryClient();
  const _useEndpoints = useEndpoint(queryClient);
  const getEndpoints = _useEndpoints.getOne(endpointId);

  return (
    <Container layoutClassName={styles.container}>
      {getEndpoints.isLoading && <Skeleton height="200px" />}
      {getEndpoints.isError && "Error..."}

      {getEndpoints.isSuccess && <EditEndpointFormTemplate endpoint={getEndpoints.data} {...{ endpointId }} />}
    </Container>
  );
};
