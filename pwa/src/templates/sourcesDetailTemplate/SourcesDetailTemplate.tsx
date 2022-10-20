import * as React from "react";
import * as styles from "./SourcesDetailTemplate.module.css";
import { QueryClient } from "react-query";
import _ from "lodash";
import { useSources } from "../../hooks/sources";
import { Container } from "@conduction/components";
import { SourcesFormTemplate } from "../templateParts/sourcesForm/SourcesFormTemplate";
import Skeleton from "react-loading-skeleton";

interface SourcesDetailTemplateProps {
  sourceId: string;
}

export const SourcesDetailTemplate: React.FC<SourcesDetailTemplateProps> = ({ sourceId }) => {
  const queryClient = new QueryClient();
  const _useSources = useSources(queryClient);
  const _getSources = _useSources.getOne(sourceId);

  return (
    <Container layoutClassName={styles.container}>
      {_getSources.isLoading && <Skeleton height="200px" />}
      {_getSources.isError && "Error..."}

      {_getSources.isSuccess && (
        <>
          <SourcesFormTemplate source={_getSources.data} sourceId={sourceId} />
        </>
      )}
    </Container>
  );
};
