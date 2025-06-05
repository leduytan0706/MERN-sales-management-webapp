const checkPermission = (userRoles, allowedRoles) => {
    return userRoles.some((role) => allowedRoles.includes(role));
};

export default checkPermission;