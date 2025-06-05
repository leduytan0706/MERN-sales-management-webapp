const formateDateVn = (date) => {
    if (!date){
        return new Date().toLocaleDateString('vi-VN');
    }
    return new Date(date).toLocaleDateString('vi-VN');
};

export default formateDateVn;