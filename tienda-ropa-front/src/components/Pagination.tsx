import React from 'react'

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    itemsPerPage: number
    totalItems: number
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    totalItems
}) => {
    const startItem = (currentPage - 1) * itemsPerPage + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    const getVisiblePages = () => {
        const delta = 2
        const range = []
        const rangeWithDots = []

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i)
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...')
        } else {
            rangeWithDots.push(1)
        }

        rangeWithDots.push(...range)

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages)
        } else {
            if (totalPages > 1) {
                rangeWithDots.push(totalPages)
            }
        }

        return rangeWithDots
    }

    if (totalPages <= 1) return null

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
            {/* Results info */}
            <div className="text-sm text-gray-600">
                Mostrando {startItem} - {endItem} de {totalItems} productos
            </div>

            {/* Pagination controls */}
            <div className="flex items-center gap-2">
                {/* Previous button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`
            flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all
            ${currentPage === 1
                            ? 'text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed'
                            : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                        }
          `}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Anterior
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                    {getVisiblePages().map((page, index) => (
                        <React.Fragment key={index}>
                            {page === '...' ? (
                                <span className="px-3 py-2 text-gray-400">...</span>
                            ) : (
                                <button
                                    onClick={() => onPageChange(page as number)}
                                    className={`
                    px-3 py-2 text-sm font-medium rounded-lg border transition-all min-w-[40px]
                    ${currentPage === page
                                            ? 'text-white bg-blue-600 border-blue-600 shadow-sm'
                                            : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                                        }
                  `}
                                >
                                    {page}
                                </button>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Next button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`
            flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all
            ${currentPage === totalPages
                            ? 'text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed'
                            : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                        }
          `}
                >
                    Siguiente
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default Pagination
