import * as React from "react";
import * as styles from "./pagination.module.css";
import ReactPaginate from "react-paginate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";

interface PaginatedItemsProps {
  pages: number;
  currentPage: number;
  setPage: (page: number) => any;
  pageRangeDisplayed: number;
  marginPagesDisplayed: number;
  containerClassName?: string;
  pageClassName?: string;
  previousClassName?: string;
  nextClassName?: string;
  activeClassName?: string;
  disabledClassName?: string;
  breakClassName?: string;
}

export const PaginatedItems: React.FC<PaginatedItemsProps> = ({
  pages,
  currentPage,
  setPage,
  pageRangeDisplayed,
  marginPagesDisplayed,
  containerClassName,
  pageClassName,
  previousClassName,
  nextClassName,
  activeClassName,
  disabledClassName,
  breakClassName,
}) => {
  const handlePageClick = (event: any) => {
    setPage(event.selected + 1);
  };

  return (
    <ReactPaginate
      pageCount={pages}
      onPageChange={handlePageClick}
      forcePage={currentPage - 1}
      pageRangeDisplayed={pageRangeDisplayed}
      marginPagesDisplayed={marginPagesDisplayed}
      containerClassName={clsx(styles.paginationContainer, containerClassName)}
      pageClassName={clsx(pages > 1000 ? styles.paginationLinkSmall : styles.paginationLink, pageClassName)}
      previousClassName={clsx(pages > 1000 ? styles.paginationLinkSmall : styles.paginationLink, previousClassName)}
      nextClassName={clsx(pages > 1000 ? styles.paginationLinkSmall : styles.paginationLink, nextClassName)}
      activeClassName={clsx(
        pages > 1000 ? styles.paginationActivePageSmall : styles.paginationActivePage,
        activeClassName,
      )}
      disabledClassName={clsx(styles.paginationDisabled, disabledClassName)}
      breakClassName={clsx(styles.breakLink, breakClassName)}
      nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
      previousLabel={<FontAwesomeIcon icon={faChevronLeft} />}
      disableInitialCallback={true}
      breakLabel="..."
    />
  );
};
