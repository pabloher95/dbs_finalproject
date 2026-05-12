export class UserFacingError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "UserFacingError";
    this.status = status;
  }
}

export function isUserFacingError(value) {
  return value instanceof UserFacingError;
}
