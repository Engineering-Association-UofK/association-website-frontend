export const roles = [
    {value: "ROLE_CONTENT_EDITOR", name: "Content Editor"},
    {value: "ROLE_PAPER_CERTIFIER", name: "Paper Certifier"},
    {value: "ROLE_USER_MANAGER", name: "Users Manager"},
    {value: "ROLE_ADMIN_MANAGER", name: "Admins Manager"},
    {value: "ROLE_CERTIFICATE_ISSUER", name: "Certificates Issuer"},
    {value: "ROLE_BLOG_MANAGER", name: "Blogs Manager"},
    {value: "ROLE_SUPER_ADMIN", name: "Super Admin"},
]

export const displayRole = (roleValue) => {
    const filteredRoles = roles.filter((role) => role.value == roleValue)
    return filteredRoles.length > 0 ? filteredRoles[0].name : ''
}