/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export const statusCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  REQUEST_ENTITY_LARGE: 413,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

type ErrorResponse = {
  status: string;
  message: string;
};

/**
 * Sends an error response.
 *
 * @param data - The data for the error response.
 * @returns The error response.
 */
export function sendErrorResponse(data: { message: string }): ErrorResponse {
  return {
    status: 'error',
    ...data,
  };
}

function parseError(err: Error): string {
  console.log(err.stack);
  return err.message;
}

/**
 * Get the error message based on the given error.
 * @param err The error object or message.
 * @returns The error message.
 */
export function getErrorMsg(err: unknown): { message: string } {
  if (typeof err === 'string') {
    console.log(err);
    return { message: err };
  } else {
    return { message: parseError(err as Error) };
  }
}

// export function getErrorStatusCode(err: string | Error) {
export function getErrorStatusCode(err: unknown) {
  if (typeof err === 'string') {
    console.log(err);
    return statusCode.BAD_REQUEST;
  } else {
    return statusCode.INTERNAL_SERVER_ERROR;
  }
}

export function generateSKU(name: string, prefix?: string): string {
  // Use first 3 letters of name if no prefix provided
  const safePrefix = prefix
    ? prefix.toUpperCase().slice(0, 3)
    : name
        .replace(/[^a-zA-Z0-9]/g, '')
        .substring(0, 3)
        .toUpperCase();

  // Create a random 6-character alphanumeric string
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();

  return `${safePrefix}-${randomPart}`;
}

interface SuccessResponse {
  status: string;
  message?: string;
  data: unknown;
  // other properties of the data object
}

/**
 * Creates a success response object by merging the provided data with a 'success' status.
 *
 * @param {SuccessResponse} data - The data to be included in the success response.
 * @return {SuccessResponse} - The success response object.
 */
export function sendSuccessResponse({
  message,
  ...data
}: Record<string, unknown>): SuccessResponse {
  return {
    status: 'success',
    ...(message && { message: message as string }),
    data: data as Record<string, unknown>,
  };
}

/**
 * Throws an error and logs it using the logger. The error can be provided as an
 * instance of the Error class or as a string.
 *
 * @param {Error | string} err - The error to throw.
 * @return {void} This function does not return a value.
 */
export function throwError(err: Error | string): void {
  console.log(err);
  throw err;
}

export function generateOTP(): string {
  // const digits = '0123456789';
  // let otp = '';

  // Generate a random 4-digit OTP
  // for (let i = 0; i < 4; i++) {
  //   const randomIndex = Math.floor(Math.random() * digits.length);
  //   otp += digits[randomIndex];
  // }

  // return otp.toString();
  const otp = '1234';

  return otp;
}

