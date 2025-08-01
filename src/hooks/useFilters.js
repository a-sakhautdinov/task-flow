import { useState, useMemo } from 'react';

/**
 * Custom hook for filtering tasks
 * Provides filtering by status and search query without useEffect
 * 
 * @param {Array} tasks - Array of tasks to filter
 * @returns {Object} Filter state and filtered tasks
 */
const useFilters = (tasks) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [tasks, statusFilter, searchQuery]);

  const clearFilters = () => {
    setStatusFilter('all');
    setSearchQuery('');
  };

  return {
    statusFilter,
    searchQuery,
    filteredTasks,
    setStatusFilter,
    setSearchQuery,
    clearFilters
  };
};

export default useFilters; 