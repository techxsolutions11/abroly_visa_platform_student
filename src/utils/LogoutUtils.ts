

export const handleLogout = (navigate:any) => {
    localStorage.clear()
    navigate("/")
    window.location.reload();
}