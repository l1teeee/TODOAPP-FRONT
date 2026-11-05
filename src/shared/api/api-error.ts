export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: unknown;

  constructor(status: number, body: unknown) {
    const error =
      typeof body === "object" && body !== null && "error" in body
        ? body.error
        : undefined;
    const code =
      typeof error === "object" && error !== null && "code" in error &&
      typeof error.code === "string"
        ? error.code
        : "HTTP_ERROR";
    const message =
      typeof error === "object" && error !== null && "message" in error &&
      typeof error.message === "string"
        ? error.message
        : `Request failed (${status})`;
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details =
      typeof error === "object" && error !== null && "details" in error
        ? error.details
        : undefined;
  }

  static async fromResponse(response: Response): Promise<ApiError> {
    try {
      const body: unknown = await response.clone().json();
      return new ApiError(response.status, body);
    } catch (cause) {
      const error = new ApiError(response.status, null);
      error.cause = cause;
      return error;
    }
  }
}
