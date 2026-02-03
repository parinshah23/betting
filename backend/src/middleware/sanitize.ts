/**
 * Sanitization Middleware
 * 
 * Prevents XSS attacks by sanitizing HTML content in request bodies
 * Uses sanitize-html to remove dangerous tags and attributes
 */

import { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';

// Configuration for allowed HTML tags and attributes
const sanitizeConfig: sanitizeHtml.IOptions = {
    // Allow basic formatting tags
    allowedTags: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'hr',
        'strong', 'b', 'em', 'i', 'u', 's', 'strike',
        'ul', 'ol', 'li',
        'blockquote', 'pre', 'code',
        'a', 'span', 'div',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
    ],
    // Allow safe attributes
    allowedAttributes: {
        'a': ['href', 'title', 'target', 'rel'],
        'span': ['class'],
        'div': ['class'],
        'p': ['class'],
        '*': ['class'], // Allow class on all elements
    },
    // Force all links to be safe
    allowedSchemes: ['http', 'https', 'mailto'],
    // Strip href="javascript:..." and other dangerous schemes
    allowProtocolRelative: false,
    // Enforce noopener noreferrer on links
    transformTags: {
        'a': (tagName, attribs) => {
            return {
                tagName,
                attribs: {
                    ...attribs,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                },
            };
        },
    },
};

// Strict config for user-generated content (no HTML allowed)
const strictConfig: sanitizeHtml.IOptions = {
    allowedTags: [],
    allowedAttributes: {},
};

/**
 * Sanitize a string value
 */
export const sanitizeString = (value: string, allowHtml: boolean = false): string => {
    if (typeof value !== 'string') return value;

    if (allowHtml) {
        return sanitizeHtml(value, sanitizeConfig);
    }

    // For non-HTML fields, strip all tags
    return sanitizeHtml(value, strictConfig);
};

/**
 * Recursively sanitize all string values in an object
 */
const sanitizeObject = (obj: any, htmlFields: string[] = []): any => {
    if (obj === null || obj === undefined) return obj;

    if (typeof obj === 'string') {
        return sanitizeString(obj, false);
    }

    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item, htmlFields));
    }

    if (typeof obj === 'object') {
        const sanitized: any = {};
        for (const [key, value] of Object.entries(obj)) {
            // Check if this field should allow HTML (like description)
            const allowHtml = htmlFields.includes(key);

            if (typeof value === 'string') {
                sanitized[key] = sanitizeString(value, allowHtml);
            } else {
                sanitized[key] = sanitizeObject(value, htmlFields);
            }
        }
        return sanitized;
    }

    return obj;
};

/**
 * Middleware to sanitize request body
 * @param htmlFields - Array of field names that should allow HTML content
 */
export const sanitizeBody = (htmlFields: string[] = []) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.body && typeof req.body === 'object') {
            req.body = sanitizeObject(req.body, htmlFields);
        }
        next();
    };
};

/**
 * Middleware to sanitize query parameters
 */
export const sanitizeQuery = (req: Request, res: Response, next: NextFunction) => {
    if (req.query && typeof req.query === 'object') {
        for (const [key, value] of Object.entries(req.query)) {
            if (typeof value === 'string') {
                req.query[key] = sanitizeString(value, false);
            }
        }
    }
    next();
};

/**
 * Middleware to sanitize URL parameters
 */
export const sanitizeParams = (req: Request, res: Response, next: NextFunction) => {
    if (req.params && typeof req.params === 'object') {
        for (const [key, value] of Object.entries(req.params)) {
            if (typeof value === 'string') {
                req.params[key] = sanitizeString(value, false);
            }
        }
    }
    next();
};

/**
 * Combined sanitization middleware
 * Use this for routes that need full protection
 */
export const sanitizeAll = (htmlFields: string[] = []) => {
    return [
        sanitizeBody(htmlFields),
        sanitizeQuery,
        sanitizeParams,
    ];
};
