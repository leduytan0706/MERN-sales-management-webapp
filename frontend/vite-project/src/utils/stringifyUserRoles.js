import userRoles from "./userRoles";

const stringifyUserRoles = (roles) => {
    if (roles.length === 0){
        return "";
    }
    else if (roles.length === 1){
        return userRoles[roles[0]];
    }
    else {
        if (roles.includes(role => role === "manager")) {
            return userRoles["manager"];
        }
        else {
            return roles.map(role => userRoles[role]).join(", ");
        }
    }
};

export default stringifyUserRoles;