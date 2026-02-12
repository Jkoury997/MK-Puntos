// Simple in-memory rate limiter for Next.js API routes
// Note: For production, use Redis or a distributed cache

const rateLimitStore = new Map();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now - data.firstRequest > data.windowMs) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function rateLimit(options = {}) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100, // Max requests per window
    message = 'Demasiadas solicitudes, intente de nuevo más tarde',
    keyGenerator = (req) => {
      // Use forwarded IP or connection IP
      const forwarded = req.headers.get('x-forwarded-for');
      return forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    }
  } = options;

  return async function rateLimitMiddleware(req) {
    const key = keyGenerator(req);
    const now = Date.now();

    let record = rateLimitStore.get(key);

    if (!record || now - record.firstRequest > windowMs) {
      // New window
      record = {
        count: 1,
        firstRequest: now,
        windowMs
      };
      rateLimitStore.set(key, record);
      return { success: true, remaining: max - 1 };
    }

    record.count++;

    if (record.count > max) {
      const resetTime = Math.ceil((record.firstRequest + windowMs - now) / 1000);
      return {
        success: false,
        message,
        resetInSeconds: resetTime
      };
    }

    return { success: true, remaining: max - record.count };
  };
}

// Pre-configured rate limiters
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per 15 minutes
  message: 'Demasiados intentos de autenticación. Intente de nuevo en 15 minutos.'
});

export const otpRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // 5 attempts per 5 minutes
  message: 'Demasiados intentos de verificación. Intente de nuevo en 5 minutos.'
});

export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: 'Límite de solicitudes alcanzado. Intente de nuevo en un momento.'
});
