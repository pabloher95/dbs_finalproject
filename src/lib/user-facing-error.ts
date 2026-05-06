/** Thrown when the message is safe to return to API clients (validation / domain rules). */
export class UserFacingError extends Error {
  readonly status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "UserFacingError";
    this.status = status;
  }
}

export function isUserFacingError(value: unknown): value is UserFacingError {
  return value instanceof UserFacingError;
}
