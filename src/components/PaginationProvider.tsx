import React from "react";
import {
    Pagination,
} from "react-bootstrap";

type PaginationProviderProps = {
    activePage: number;
    setActivePage: (page: number) => void;
    itemsPerPage: number;
    list: any;
}

export const PaginationProvider: React.FC<PaginationProviderProps> = ({
                                                                          activePage,
                                                                          setActivePage,
                                                                            itemsPerPage,
                                                                          list,
                                                                      }) => {
    let paginationItems = [];
    const lastPage = Math.ceil(list.length / itemsPerPage);

    if (lastPage > 1) {
        // render first, prev
        paginationItems.push(
            <Pagination.First disabled={activePage === 1} onClick={() => setActivePage(1)}/>,
            <Pagination.Prev disabled={activePage === 1} onClick={() => setActivePage(activePage - 1)}/>
        );

        if (activePage > 4) {
            paginationItems.push(
                // show first page
                <Pagination.Item key={1} active={1 === activePage} onClick={() => setActivePage(1)}>
                    {1}
                </Pagination.Item>,
                // add an ellipsis and only show numbers within two before active page
                <Pagination.Ellipsis/>,
                <Pagination.Item key={activePage - 2} active={false} onClick={() => setActivePage(activePage - 2)}>
                    {activePage - 2}
                </Pagination.Item>,
                <Pagination.Item key={activePage - 1} active={false} onClick={() => setActivePage(activePage - 1)}>
                    {activePage - 1}
                </Pagination.Item>,
            );
        } else {
            // render every page before active one
            for (let number = 1; number < activePage; number++) {
                paginationItems.push(
                    <Pagination.Item key={number} active={number === activePage} onClick={() => setActivePage(number)}>
                        {number}
                    </Pagination.Item>,
                );
            }
        }

        // render active page index
        paginationItems.push(
            <Pagination.Item key={activePage} active={true}>
                {activePage}
            </Pagination.Item>,
        );

        if (activePage < lastPage - 3) {
            // only show numbers within two after active page
            paginationItems.push(
                <Pagination.Item key={activePage + 1} active={false} onClick={() => setActivePage(activePage + 1)}>
                    {activePage + 1}
                </Pagination.Item>,
                <Pagination.Item key={activePage + 2} active={false} onClick={() => setActivePage(activePage + 2)}>
                    {activePage + 2}
                </Pagination.Item>,
                // add an ellipsis
                <Pagination.Ellipsis/>,
                // render last page
                <Pagination.Item key={lastPage} active={false} onClick={() => setActivePage(lastPage)}>
                    {lastPage}
                </Pagination.Item>,
            );
        } else {
            // render every page after active one
            for (let number = activePage + 1; number <= lastPage; number++) {
                paginationItems.push(
                    <Pagination.Item key={number} active={number === activePage} onClick={() => setActivePage(number)}>
                        {number}
                    </Pagination.Item>,
                );
            }
        }
    }

    return (
        <Pagination className={"mx-auto"}>
            {paginationItems}
        </Pagination>
    );
}


