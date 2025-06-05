const shortenText = (text, maxLength = 25, appendix = "...") =>{
    return text.length <= maxLength? text: text.slice(0, maxLength) + appendix;
};

export default shortenText;