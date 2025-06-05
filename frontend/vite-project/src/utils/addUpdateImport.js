import useProductStore from "../store/useProductStore";
import getTotalAmount from "./getTotalAmount";

const addImportItem = (importItems, selectedProduct) => {
    const newItem = {
        product: selectedProduct,
        importQuantity: 0,
        importPrice: 0,
        exportQuantity: 0,
        exportPrice: selectedProduct.price,
        manufacturingDate: "",
        expiringDate: ""
    };
    newItem.importTotal = newItem.importQuantity*newItem.importPrice;
    newItem.exportTotal = newItem.exportQuantity*newItem.exportPrice;
    newItem.stockTotal = (newItem.importQuantity-newItem.exportQuantity)*newItem.importPrice;
    importItems.push(newItem);
    return importItems;
};  

const updateImportItem = (importItems, index, fieldName, fieldValue) => {
    importItems[index][fieldName] = fieldValue;
    if (fieldName == "importQuantity" || fieldName == "importPrice"){
      importItems[index]["importTotal"] = importItems[index]["importQuantity"]*importItems[index]["importPrice"];
    }
    else if (fieldName == "exportQuantity" || fieldName == "exportPrice"){
      importItems[index]["exportTotal"] = importItems[index]["exportQuantity"]*importItems[index]["exportPrice"];
    }
    importItems[index]["stockTotal"] = (importItems[index]["importQuantity"] - importItems[index]["exportQuantity"])*importItems[index]["importPrice"];
    return importItems;
};


export {addImportItem, updateImportItem}