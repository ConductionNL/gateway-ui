import * as React from "react";
import { DashboardTemplate } from "../../templates/dashboard/DashboardTemplate";
import { useObject } from "../../hooks/object";

import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/core";
import { useSchemaEnricher } from "./useSchemaEnricher";

const GenerationPage: React.FC = () => {
  const [formData, setFormData] = React.useState(null);

  const _useObject = useObject();
  const { enrichProperties } = useSchemaEnricher();

  const getObject = _useObject.getSchema("859bffe4-ab17-4c18-9cd1-b50dee043fad");

  if (getObject.isLoading) return <>Loading...</>;

  if (getObject.isError) return <>Error...</>;

  const schema = getObject.data;

  return (
    <DashboardTemplate>
      <Form schema={schema} formData={formData} onChange={(e) => setFormData(e.formData)} validator={validator} />
    </DashboardTemplate>
  );
};

export default GenerationPage;

// update the schema object to add a new property "characters"
// schema.properties.characters = {
//   type: "string",
//   title: "Characters",
//   description: "The characters affected by this condition",

//   widget: "asyncSelect",
//   nullable: true,
//   multiple: true,
//   readOnly: false,
// };
