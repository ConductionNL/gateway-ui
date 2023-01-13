import * as React from "react";
import * as styles from "./UserDetailTemplate.module.css";
import { Container } from "@conduction/components";
import { EditUserFormTemplate } from "../templateParts/userForm/EditUserFormTemplate";

interface UserDetailsTemplateProps {
  userId: string;
}

export const UserDetailsTemplate: React.FC<UserDetailsTemplateProps> = ({ userId }) => {
  return (
    <Container layoutClassName={styles.container}>
      <EditUserFormTemplate {...{ userId }} />
    </Container>
  );
};
