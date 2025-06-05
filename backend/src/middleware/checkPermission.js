const checkPermission = (requiredRoles) => {
    return (req, res, next) => {
        const selectedRoles = [...req.user.roles];
        if (!selectedRoles.some(r => requiredRoles.includes(r))){
            return res.status(403).json({message: 'Bạn không có quyền thực hiện chức năng này.'})
        }
        next();
    };
};

export default checkPermission;
