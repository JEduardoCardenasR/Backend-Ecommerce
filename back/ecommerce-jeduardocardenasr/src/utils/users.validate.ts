export function validateUser(user: any): boolean {
  const validUser =
    user.email && user.name && user.password && user.address && user.phone;
  return validUser;
}
