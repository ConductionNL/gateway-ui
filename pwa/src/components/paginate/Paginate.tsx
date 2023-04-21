import * as React from "react";
import * as styles from "./Paginate.module.css";

import ReactPaginate from "react-paginate";
import { faChevronRight, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@gemeente-denhaag/components-react";
import clsx from "clsx";

interface PaginateProps {
  totalPages: number;
  currentPage: number;
  changePage: React.Dispatch<React.SetStateAction<number>>;
  layoutClassName?: string;
}

export const Paginate: React.FC<PaginateProps> = ({ totalPages, currentPage, changePage, layoutClassName }) => {
  if (totalPages < 1) return <></>; // no pages available

  return (
    <ReactPaginate
      className={clsx(styles.container, layoutClassName && layoutClassName)}
      disabledClassName={styles.disabled}
      activeClassName={styles.currentPage}
      onPageChange={(e: any) => changePage(e.selected + 1)}
      forcePage={currentPage - 1}
      pageRangeDisplayed={3}
      pageCount={totalPages}
      disableInitialCallback
      marginPagesDisplayed={2}
      breakLabel="..."
      nextLabel={
        <Button className={styles.button}>
          <FontAwesomeIcon icon={faChevronRight} />
        </Button>
      }
      previousLabel={
        <Button className={styles.button}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
      }
    />
  );
};
