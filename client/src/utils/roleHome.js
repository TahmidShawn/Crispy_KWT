export const getRoleHome = (role) => {
    if (role === "admin") {
        return "/admin";
    }

    if (role === "user") {
        return "/dashboard";
    }

    return "/";
};

export default getRoleHome;
