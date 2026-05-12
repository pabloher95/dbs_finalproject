export declare class UserFacingError extends Error {
  readonly status: number;

  constructor(message: string, status?: number);
}

export declare function isUserFacingError(value: unknown): value is UserFacingError;
