import * as React from "react";
import * as styles from "./PropertyDetailTemplate.module.css";
import { Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { navigate } from "gatsby";
import { QueryClient } from "react-query";
import _ from "lodash";
import { ArrowLeftIcon } from "@gemeente-denhaag/icons";

import Skeleton from "react-loading-skeleton";
import { useAttribute } from "../../hooks/attribute";
import { Container } from "@conduction/components";
import { EditPropertyFormTemplate } from "../templateParts/propertyForm/EditPropertyFormTemplate";

interface PropertyDetailTemplateProps {
  propertyId: string;
  schemaId: string;
}

export const PropertyDetailTemplate: React.FC<PropertyDetailTemplateProps> = ({ propertyId, schemaId }) => {
  const { t } = useTranslation();

  const queryClient = new QueryClient();
  const _useAttribute = useAttribute(queryClient);
  const _getAttribute = _useAttribute.getOne(propertyId);

  return (
    <Container layoutClassName={styles.container}>
      <div onClick={() => navigate(`/schemas/${schemaId}`)}>
        <Link icon={<ArrowLeftIcon />} iconAlign="start">
          {t("Back to schema")}
        </Link>
      </div>
      {_getAttribute.isError && "Error..."}

      {_getAttribute.isSuccess && (
        <EditPropertyFormTemplate property={_getAttribute.data} {...{ propertyId, schemaId }} />
      )}
      {_getAttribute.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};
