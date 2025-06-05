const isImageUrl = (url) => {
    return /\.(jpeg|jpg|png|gif|bmp|svg|webp)$/i.test(url);
};

export default isImageUrl;