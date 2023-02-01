import * as React from "react";
import * as styles from "./MappingDetailsTemplate.module.css";
import { useTranslation } from "react-i18next";

import { Container } from "@conduction/components";
import { Heading1 } from "@gemeente-denhaag/components-react";

interface MappingDetailsTemplateProps {
  mappingId?: string;
}

export const MappingDetailTemplate: React.FC<MappingDetailsTemplateProps> = ({ mappingId }) => {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = React.useState<number>(0);

  return (
    <Container layoutClassName={styles.container}>
      <Heading1>Mapping Detail</Heading1>
      <span>{mappingId ?? "new"}</span>
    </Container>
  );
};
