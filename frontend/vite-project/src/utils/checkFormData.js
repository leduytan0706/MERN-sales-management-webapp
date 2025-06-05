const checkLoginData = (formData) => {
    if (!formData.authInfo || formData.authInfo.length === 0) 
        return "Bạn chưa nhập email hoặc tên đăng nhập";
    if (!formData.password || formData.password.length === 0)
        return "Bạn chưa nhập mật khẩu";
    return null;
};

const checkUserFormData = (formData) => {
    if (!formData.email || formData.email.length === 0){
        return "Bạn chưa nhập email."
    }
    if (!formData.password || formData.password.length < 8) {
        return "Mật khẩu phải tối thiểu 8 kí tự.";
    }
    if (!formData.role || formData.employeeRoles.length <= 0){
        return "Bạn chưa phân quyền cho người dùng."
    }
    return null;
}

const checkSuppplierFormData = (formData) => {
    if (!formData.name || formData.name.length === 0)
        return "Name is required";
    if (!formData.phone || formData.phone.length === 0)
        return "Phone number is required";
    return null;
};

const checkProductFormData = (formData) => {
    if (!formData.name || formData.name.length === 0)
        return "Name is required";
    if (!formData.unit || formData.unit.length === 0)
        return "Unit is required";
    if (!formData.price || formData.price <= 0)
        return "Price must be greater than 0";
    if (!formData.categoryId || formData.categoryId.length == 0)
        return "Category is required";
    return null;
};

const checkImportFormData = (formData) => {
    if (!formData.supplierId || formData.supplierId.length === 0)
        return "Supplier is required";
    if (!formData.items || formData.items.length === 0)
        return "No items added";
    return null;
};

const checkOrderFormData = (formData) => {
    if (!formData.items || formData.items.length === 0){
        return "No items added";
    }
    return null;
};

const checkDiscountFormData = (formData) => {
    if (!formData.autoApply && formData.code === ""){
        return "Chương trình không áp dụng tự động thì phải có mã.";
    }
    if (formData.name === ""){
        return "Tên chương trình cần được điền.";
    }
    if (formData.conditionType === ""){
        return "Hãy chọn điều kiện áp dụng.";
    }
    if ((formData.conditionType === "minQuantity" && formData.minQuantity === "") || (formData.conditionType === "minAmount" && formData.minAmount === "")){
        return "Hãy điền số lượng hoặc số tiền tối thiểu giảm giá.";
    }
    if (formData.discountType === ""){
        return "Hãy điền loại giảm giá áp dụng.";
    }
    if ((formData.discountType === "percentage" && formData.discountPercentage === "") || (formData.discountType === "amount" && formData.discountAmount === "")){
        return "Hãy điền phần trăm hoặc số tiền giảm giá.";
    }
    if (formData.discountFor === ""){
        return "Hãy chọn loại sản phẩm áp dụng.";
    }
    if (formData.discountFor === "category" && formData.categoryId === ""){
        return "Hãy chọn danh mục sản phẩm áp dụng.";
    }
    if (formData.discountFor === "optional" && formData.items.length === 0){
        return "Hãy chọn sản phẩm tùy chọn áp dụng.";
    }
    return null;
}

export {checkLoginData, checkUserFormData, checkSuppplierFormData, checkProductFormData, checkImportFormData, checkOrderFormData, checkDiscountFormData}