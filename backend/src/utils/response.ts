/**
 * Response Helpers
 *
 * Standardized API response formatters.
 */

import { Response } from 'express';

interface SuccessOptions<T> {
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  message?: string;
}

export const sendSuccess = <T>(res: Response, options: SuccessOptions<T>, statusCode: number = 200) => {
  return res.status(statusCode).json({
    success: true,
    data: options.data,
    ...(options.meta && { meta: options.meta }),
    ...(options.message && { message: options.message }),
  });
};

export const sendCreated = <T>(res: Response, data: T, message?: string) => {
  return sendSuccess(res, { data, message }, 201);
};

export const sendNoContent = (res: Response) => {
  return res.status(204).send();
};

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number
) => {
  return sendSuccess(res, {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};
