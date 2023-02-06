import * as React from "react";
import * as styles from "./Paginate.module.css";

import ReactPaginate from "react-paginate";
import { Tag } from "@conduction/components";

interface PaginateProps {
  totalPages: number;
  currentPage: number;
  changePage: React.Dispatch<React.SetStateAction<number>>;
}

export const Paginate: React.FC<PaginateProps> = ({ totalPages, currentPage, changePage }) => {
  if (totalPages < 1) return <></>; // no pages available

  return (
    <ReactPaginate
      className={styles.container}
      disabledClassName={styles.disabled}
      activeClassName={styles.currentPage}
      onPageChange={(e: any) => changePage(e.selected + 1)}
      forcePage={currentPage - 1}
      pageRangeDisplayed={3}
      pageCount={totalPages}
      disableInitialCallback
      marginPagesDisplayed={2}
      breakLabel="..."
      nextLabel={<Tag label="Next" />}
      previousLabel={<Tag label="Previous" />}
    />
  );
};
