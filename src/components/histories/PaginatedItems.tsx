
import React, { useState } from 'react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagenation';

interface PaginatedItemsProps<T> {
    items: T[];
    itemsPerPage: number;
    renderItems: (items: T[]) => React.ReactNode;
    className?: string;
}

export function PaginatedItems<T>({
    items,
    itemsPerPage,
    renderItems,
    className
}: PaginatedItemsProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate total pages
    const totalPages = Math.ceil(items.length / itemsPerPage);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Generate page numbers array
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    // Logic to display page numbers correctly
    let pagesToShow = pageNumbers;
    if (totalPages > 7) {
        if (currentPage <= 3) {
            // Near the start
            pagesToShow = [...pageNumbers.slice(0, 5), -1, totalPages];
        } else if (currentPage >= totalPages - 2) {
            // Near the end
            pagesToShow = [1, -1, ...pageNumbers.slice(totalPages - 5)];
        } else {
            // Middle
            pagesToShow = [
                1,
                -1,
                currentPage - 1,
                currentPage,
                currentPage + 1,
                -1,
                totalPages
            ];
        }
    }

    return (
        <div className={className}>
            {renderItems(currentItems)}

            {totalPages > 1 && (
                <Pagination className="mt-6">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => paginate(Math.max(1, currentPage - 1))}
                                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                            />
                        </PaginationItem>

                        {pagesToShow.map((page, index) => (
                            <React.Fragment key={index}>
                                {page === -1 ? (
                                    <PaginationItem>
                                        <div className="flex h-9 w-9 items-center justify-center">...</div>
                                    </PaginationItem>
                                ) : (
                                    <PaginationItem className=' cursor-pointer'>
                                        <PaginationLink
                                            isActive={page === currentPage}
                                            onClick={() => paginate(page)}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                )}
                            </React.Fragment>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}
