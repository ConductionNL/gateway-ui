import { Tag } from "../components/tag/Tag";

export const getStatusTag = (value: unknown): JSX.Element => {
  if (value === "200" || value === true) {
    return <Tag type="success" label="Success" />;
  }

  if (
    value === "No calls have been made yet to this source" ||
    value === "no known status" ||
    value === undefined ||
    value === null
  ) {
    return <Tag label="No status" />;
  }

  return <Tag type="critical" label="Error" />;
};
