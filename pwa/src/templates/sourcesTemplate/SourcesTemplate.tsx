import * as React from "react";
import * as styles from "./SourcesTemplate.module.css";
import { Button, Heading1, Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { useSource } from "../../hooks/source";
import { QueryClient } from "react-query";
import { Tag, ToolTip } from "@conduction/components";
import _ from "lodash";
import clsx from "clsx";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";
import { translateDate } from "../../services/dateFormat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Skeleton from "react-loading-skeleton";
import { getStatusColor, getStatusIcon } from "../../services/getStatusColorAndIcon";
import { dateTime } from "../../services/dateTime";

export const SourcesTemplate: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [tableIsScrollable, setTableIsScrollable] = React.useState<Boolean>(false);
  const [tableScrollPosition, setTableScrollPosition] = React.useState<"left" | "middle" | "right">("left");
  const TableScrollWrapper = React.useRef();

  /* TODO:
	- replace timer system from line 41 with better one
	- more code cleanup
  */

  const queryClient = new QueryClient();
  const _useSources = useSource(queryClient);
  const getSources = _useSources.getAll();

  const isTableScrollable = () => TableScrollWrapper?.current?.scrollWidth > TableScrollWrapper?.current?.clientWidth;

  React.useEffect(() => {
    const handleWindowResize = () => {
      setTableIsScrollable(isTableScrollable());
    };

    let currentAttempt = 0;
    let attemptsTillFail = 50;
    const checkExist = setInterval(function () {
      if (TableScrollWrapper?.current) {
        handleWindowResize();
        clearInterval(checkExist);
      }
      if (attemptsTillFail == currentAttempt) clearInterval(checkExist);
      else currentAttempt++;
    }, 100);

    window.addEventListener("resize", handleWindowResize);

    () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  const setScrollPosition = () => {
    const maxScrollLeft = TableScrollWrapper?.current?.scrollWidth - TableScrollWrapper?.current?.clientWidth;

    if (TableScrollWrapper?.current?.scrollLeft === 0) setTableScrollPosition("left");
    else if (TableScrollWrapper?.current?.scrollLeft === maxScrollLeft) setTableScrollPosition("right");
    else setTableScrollPosition("middle");
  };

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <Heading1>{t("Sources")}</Heading1>
        <div className={styles.buttons}>
          <Button className={styles.buttonIcon} onClick={() => navigate(`/sources/new`)}>
            <FontAwesomeIcon icon={faPlus} />
            {t("Add")}
          </Button>
        </div>
      </section>

      {getSources.isError && "Error..."}

      {getSources.isSuccess && (
        <div
          className={clsx(
            tableIsScrollable && [
              styles.tableBoxShadow,
              tableScrollPosition === "left" && styles.tableBoxShadowR,
              tableScrollPosition === "right" && styles.tableBoxShadowL,
              tableScrollPosition === "middle" && styles.tableBoxShadowM,
            ],
          )}
        >
          <div className={styles.table} ref={TableScrollWrapper} onScroll={setScrollPosition}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>{t("Name")}</TableHeader>
                  <TableHeader>{t("Status")}</TableHeader>
                  <TableHeader>{t("Related Sync objects")}</TableHeader>
                  <TableHeader>{t("Last call")}</TableHeader>
                  <TableHeader>{t("Created")}</TableHeader>
                  <TableHeader>{t("Modified")}</TableHeader>
                  <TableHeader />
                </TableRow>
              </TableHead>
              <TableBody>
                {getSources.data.map((source) => (
                  <TableRow
                    className={styles.tableRow}
                    onClick={() => navigate(`/sources/${source.id}`)}
                    key={source.id}
                  >
                    <TableCell>{source.name}</TableCell>
                    <TableCell>
                      <div className={clsx(styles[getStatusColor(source.status ?? "no known status")])}>
                        <ToolTip tooltip="Status">
                          <Tag
                            icon={<FontAwesomeIcon icon={getStatusIcon(source.status ?? "no known status")} />}
                            label={source.status?.toString() ?? "no known status"}
                          />
                        </ToolTip>
                      </div>
                    </TableCell>
                    <TableCell>{source.sync ?? "-"}</TableCell>
                    <TableCell>{source.lastCall ?? "-"}</TableCell>
                    <TableCell>{translateDate(i18n.language, source.dateCreated)}</TableCell>
                    <TableCell>{translateDate(i18n.language, source.dateModified)}</TableCell>
                    <TableCell onClick={() => navigate(`/sources/${source.id}`)}>
                      <Link icon={<ArrowRightIcon />} iconAlign="start">
                        {t("Details")}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {getSources.isLoading && <Skeleton height="200px" />}
    </div>
  );
};
