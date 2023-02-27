import { StatusTag } from "../components/statusTag/StatusTag";

export const getStatusTag = (value: unknown): JSX.Element => {
  if (value === "200" || value === true) {
    return <StatusTag type="success" label="Success" />;
  }

  if (
    value === "No calls have been made yet to this source" ||
    value === "no known status" ||
    value === undefined ||
    value === null
  ) {
    return <StatusTag label="No status" />;
  }

  return <StatusTag type="critical" label="Error" />;
};
