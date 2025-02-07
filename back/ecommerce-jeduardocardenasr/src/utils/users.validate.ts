export function validateUser(user: any): boolean {
  // Verifica que al menos un campo requerido esté presente
  const validUser =
    user.email ||
    user.name ||
    user.password ||
    user.phone ||
    user.address ||
    user.city ||
    user.country;
  return !!validUser; // Asegúrate de devolver un booleano
}
