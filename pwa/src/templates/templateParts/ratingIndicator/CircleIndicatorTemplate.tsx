import * as React from "react";
import * as styles from "./CircleIndicatorTemplate.module.css";
import { PieChart } from "react-minimal-pie-chart";
import { getTokenValue } from "../../../services/getTokenValue";
import clsx from "clsx";

interface CircleIndicatorTemplateProps {
  maxValue?: number;
  value: number;
  layoutClassName?: string;
}

export const CircleIndicatorTemplate: React.FC<CircleIndicatorTemplateProps> = ({
  maxValue,
  value,
  layoutClassName,
}) => {
  return (
    <div className={clsx(styles.container, [layoutClassName && layoutClassName])}>
      <PieChart
        className={styles.ratingPieChart}
        data={[
          {
            value: 1,
            key: 1,
            color: getTokenValue(styles.ratingActiveColor),
            title: `${value}${value && maxValue && "/" || ""}${maxValue ?? ""}`,
          },
        ]}
        reveal={(value / (maxValue ?? value)) * 100}
        lineWidth={20}
        background={getTokenValue(styles.ratingDisabledColor)}
        startAngle={270}
        lengthAngle={360}
        rounded
        animate
        animationDuration={1750}
        label={({ dataEntry }) => dataEntry.title}
        labelStyle={{
          fontSize: getTokenValue(styles.ratingFontSize),
          fontFamily: getTokenValue(styles.ratingFontFamily),
          fill: getTokenValue(styles.ratingActiveColor),
          userSelect: "none",
        }}
        labelPosition={0}
      />
    </div>
  );
};
