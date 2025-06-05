const sortList = (list, sortData) => {
    const { sortCriteria, sortOrder } = sortData;
    if (sortCriteria.length === 0)
        return list;

    return [...list].sort((a, b) => {
        if (a[sortCriteria] > b[sortCriteria]) return sortOrder === 'asc' ? 1 : -1;
        if (a[sortCriteria] < b[sortCriteria]) return sortOrder === 'asc' ? -1 : 1;
        return 0;
    });
};

export default sortList;