

const formatDate = (date) => {
    if (!date || date.length === 0) {
        return new Date();
    }
    
    return new Date(date).toISOString();
};

export default formatDate;