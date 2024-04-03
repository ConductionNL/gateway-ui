import _ from "lodash";
import { StatusTag } from "../components/statusTag/StatusTag";

export const getStatusTag = (value: unknown): JSX.Element => {
  const isInInfoRange = (value: number): boolean => {
    return _.inRange(value, 100, 200);
  };

  const isInSuccesRange = (value: number): boolean => {
    return _.inRange(value, 200, 300);
  };

  const isInRedirectRange = (value: number): boolean => {
    return _.inRange(value, 300, 400);
  };

  if (isInSuccesRange(_.toNumber(value)) || value === true) {
    return <StatusTag type="success" label={_.toString(value === true ? "Success" : value)} />;
  }

  if (isInInfoRange(_.toNumber(value))) {
    return <StatusTag type="info" label={_.toString(value)} />;
  }

  if (isInRedirectRange(_.toNumber(value))) {
    return <StatusTag type="error" label={_.toString(value)} />;
  }

  if (
    value === "No calls have been made yet to this source" ||
    value === "no known status" ||
    value === undefined ||
    value === null
  ) {
    return <StatusTag label={value ?? "No status"} />;
  }

  return <StatusTag type="critical" label={_.toString(value)} />;
};
