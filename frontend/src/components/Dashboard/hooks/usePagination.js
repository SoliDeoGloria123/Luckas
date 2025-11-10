import { useState, useMemo } from 'react';

/**
 * Hook personalizado para manejar paginación
 * @param {Array} data - Array de datos a paginar
 * @param {number} itemsPerPage - Número de items por página
 * @returns {Object} { currentPage, totalPages, paginatedData, goToPage, nextPage, prevPage, setPage }
 */
export const usePagination = (data = [], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);

    return {
      totalPages,
      paginatedData,
      startIndex,
      endIndex
    };
  }, [data, itemsPerPage, currentPage]);

  const goToPage = (page) => {
    const validPage = Math.max(1, Math.min(page, paginationData.totalPages));
    setCurrentPage(validPage);
  };

  const nextPage = () => {
    goToPage(currentPage + 1);
  };

  const prevPage = () => {
    goToPage(currentPage - 1);
  };

  const resetToFirstPage = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages: paginationData.totalPages,
    paginatedData: paginationData.paginatedData,
    goToPage,
    nextPage,
    prevPage,
    setPage: setCurrentPage,
    resetToFirstPage
  };
};