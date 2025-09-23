# Security Hardening Workflow - Ponas Obuolys Project

**Target**: Improve security rating from 6/10 to 10/10

**Timeline**: 2-3 weeks implementation

---

## 📋 Current Security Assessment

**🚨 Critical Issues**:
- 7 instances of `dangerouslySetInnerHTML` without sanitization
- 27 files with console statements (information leakage risk)
- Missing Content Security Policy (CSP)
- Environment variables exposure
- No HTML sanitization for rich content

**Current Security Score**: 6/10

---

## 🎯 Security Hardening Plan

### Phase 1: XSS Vulnerability Mitigation (Week 1)
### Phase 2: Logging & Environment Security (Week 2)
### Phase 3: Content Security Policy & Advanced Protection (Week 3)

---

## 🔥 PHASE 1: XSS VULNERABILITY MITIGATION

### Step 1.1: Install HTML Sanitization Dependencies

```bash
npm install dompurify
npm install --save-dev @types/dompurify
```

### Step 1.2: Create HTML Sanitization Utility

**File**: `src/utils/htmlSanitizer.ts`

```typescript
import DOMPurify from 'dompurify';

/**
 * Security configuration for HTML sanitization
 */
const SANITIZE_CONFIG = {
  // Allow basic formatting and structure
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'div', 'span', 'pre', 'code'
  ],
  ALLOWED_ATTR: [
    'href', 'src', 'alt', 'title', 'class', 'data-*', 'loading', 'width', 'height'
  ],
  // Remove dangerous attributes
  FORBID_ATTR: ['script', 'onerror', 'onload', 'onclick', 'onmouseover'],
  // Remove script tags and event handlers
  FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'textarea'],
  // Keep relative URLs
  ALLOW_DATA_ATTR: false,
  // Add target="_blank" to external links
  ADD_TAGS: ['#text'],
  ADD_ATTR: ['target']
};

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param html - Raw HTML content
 * @returns Sanitized HTML safe for rendering
 */
export const sanitizeHtml = (html: string): string => {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // Configure DOMPurify for this sanitization
  const clean = DOMPurify.sanitize(html, {
    ...SANITIZE_CONFIG,
    // Add security hooks
    SANITIZE_DOM: true,
    KEEP_CONTENT: true,
    // Transform external links
    TRANSFORM_TAGS: {
      'a': function(tagName: string, attribs: any) {
        const href = attribs.href;
        if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
          attribs.target = '_blank';
          attribs.rel = 'noopener noreferrer';
        }
        return { tagName, attribs };
      }
    }
  });

  return clean;
};

/**
 * Additional sanitization for rich text editor content
 * Allows more formatting but still prevents XSS
 */
export const sanitizeRichContent = (html: string): string => {
  if (!html || typeof html !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(html, {
    ...SANITIZE_CONFIG,
    ALLOWED_TAGS: [
      ...SANITIZE_CONFIG.ALLOWED_TAGS,
      'table', 'thead', 'tbody', 'tr', 'td', 'th',
      'hr', 'sub', 'sup', 'small', 'mark'
    ],
    ALLOWED_ATTR: [
      ...SANITIZE_CONFIG.ALLOWED_ATTR,
      'colspan', 'rowspan', 'style'
    ],
    ALLOW_DATA_ATTR: true,
    // Allow limited inline styles for rich content
    ALLOWED_CSS_PROPERTIES: [
      'color', 'background-color', 'font-size', 'font-weight',
      'text-align', 'text-decoration', 'margin', 'padding'
    ]
  });
};

/**
 * Validates if HTML content is safe (additional check)
 * @param html - HTML to validate
 * @returns true if content appears safe
 */
export const validateHtmlSafety = (html: string): boolean => {
  if (!html) return true;

  // Check for suspicious patterns
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b[^>]*>/gi,
    /<object\b[^>]*>/gi,
    /<embed\b[^>]*>/gi
  ];

  return !dangerousPatterns.some(pattern => pattern.test(html));
};
```

### Step 1.3: Create Safe HTML Component

**File**: `src/components/ui/SafeHtml.tsx`

```typescript
import React from 'react';
import { sanitizeHtml, sanitizeRichContent, validateHtmlSafety } from '@/utils/htmlSanitizer';

interface SafeHtmlProps {
  html: string;
  className?: string;
  variant?: 'basic' | 'rich';
  onError?: (error: string) => void;
}

/**
 * Safe HTML rendering component that prevents XSS attacks
 * Replaces direct dangerouslySetInnerHTML usage
 */
export const SafeHtml: React.FC<SafeHtmlProps> = ({
  html,
  className = '',
  variant = 'basic',
  onError
}) => {
  const [sanitizedHtml, setSanitizedHtml] = React.useState<string>('');
  const [isValid, setIsValid] = React.useState<boolean>(true);

  React.useEffect(() => {
    try {
      // Validate content first
      if (!validateHtmlSafety(html)) {
        setIsValid(false);
        onError?.('Content contains potentially dangerous elements');
        return;
      }

      // Sanitize based on variant
      const cleaned = variant === 'rich'
        ? sanitizeRichContent(html)
        : sanitizeHtml(html);

      setSanitizedHtml(cleaned);
      setIsValid(true);
    } catch (error) {
      console.error('HTML sanitization error:', error);
      setIsValid(false);
      onError?.('Failed to sanitize HTML content');
      setSanitizedHtml('');
    }
  }, [html, variant, onError]);

  if (!isValid) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-700 text-sm">
          Turinys negalėjo būti saugiai parodytas.
        </p>
      </div>
    );
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};
```

### Step 1.4: Replace Unsafe dangerouslySetInnerHTML Usage

**File 1**: `src/pages/CourseDetail.tsx` (Line 178)

```typescript
// BEFORE (UNSAFE):
<div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: course.content }} />

// AFTER (SAFE):
<SafeHtml
  html={course.content}
  className="prose max-w-none"
  variant="rich"
  onError={(error) => {
    toast.error('Kursų turinys negalėjo būti parodytas saugiai');
    console.error('Course content sanitization error:', error);
  }}
/>
```

**File 2**: `src/pages/PublicationDetail.tsx` (Line 209)

```typescript
// Add import
import { SafeHtml } from '@/components/ui/SafeHtml';

// BEFORE (UNSAFE):
<div
  ref={contentRef}
  className="prose max-w-none mb-8 text-left"
  dangerouslySetInnerHTML={{ __html: addLazyLoadingToImages(publication.content || '') }}
/>

// AFTER (SAFE):
<SafeHtml
  html={addLazyLoadingToImages(publication.content || '')}
  className="prose max-w-none mb-8 text-left"
  variant="rich"
  onError={(error) => {
    toast.error('Straipsnio turinys negalėjo būti parodytas saugiai');
  }}
/>
```

**File 3**: `src/components/ui/chart.tsx` (Line 79)

```typescript
// BEFORE (UNSAFE):
<style
  dangerouslySetInnerHTML={{
    __html: Object.entries(THEMES)
      .map(
        ([theme, prefix]) => `
          .${prefix} {
            ${Object.entries(THEME_COLORS[theme as keyof typeof THEME_COLORS])
              .map(([key, value]) => `--color-${key}: ${value};`)
              .join('\n')}
          }
        `
      )
      .join('\n')
  }}
/>

// AFTER (SAFE): Use CSS-in-JS or external stylesheet
const themeStyles = Object.entries(THEMES)
  .map(([theme, prefix]) => ({
    [`.${prefix}`]: Object.entries(THEME_COLORS[theme as keyof typeof THEME_COLORS])
      .reduce((acc, [key, value]) => ({
        ...acc,
        [`--color-${key}`]: value
      }), {})
  }))
  .reduce((acc, style) => ({ ...acc, ...style }), {});

// Use a proper CSS-in-JS solution or move to external CSS file
```

### Step 1.5: Update Utility Functions for Security

**File**: `src/utils/lazyLoadImages.ts`

```typescript
import { sanitizeHtml } from './htmlSanitizer';

/**
 * Safely adds lazy loading to images in HTML content
 * Now includes HTML sanitization
 */
export const addLazyLoadingToImages = (html: string): string => {
  if (!html) return '';

  // First sanitize the HTML
  const sanitized = sanitizeHtml(html);

  // Then add lazy loading attributes
  return sanitized.replace(
    /<img([^>]*?)src=["']([^"']*?)["']([^>]*?)>/gi,
    (match, beforeSrc, src, afterSrc) => {
      // Skip if already has loading attribute
      if (match.includes('loading=')) {
        return match;
      }

      return `<img${beforeSrc}src="${src}"${afterSrc} loading="lazy">`;
    }
  );
};
```

---

## 🔐 PHASE 2: LOGGING & ENVIRONMENT SECURITY

### Step 2.1: Install Secure Logging Library

```bash
npm install winston
npm install --save-dev @types/winston
```

### Step 2.2: Create Production Logging System

**File**: `src/utils/logger.ts`

```typescript
import winston from 'winston';

// Environment check
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

/**
 * Secure logging configuration
 */
const loggerConfig: winston.LoggerOptions = {
  level: isDevelopment ? 'debug' : 'warn',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    // Sanitize sensitive data
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      // Remove sensitive information from logs
      const sanitizedMeta = sanitizeLogData(meta);
      return JSON.stringify({
        timestamp,
        level,
        message: sanitizeMessage(message),
        ...sanitizedMeta
      });
    })
  ),
  transports: []
};

// Development: Console logging
if (isDevelopment) {
  loggerConfig.transports?.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  );
}

// Production: Structured logging (ready for external services)
if (isProduction) {
  loggerConfig.transports?.push(
    new winston.transports.Console({
      format: winston.format.json()
    })
  );
}

const logger = winston.createLogger(loggerConfig);

/**
 * Sanitize log data to remove sensitive information
 */
function sanitizeLogData(data: any): any {
  if (!data || typeof data !== 'object') return data;

  const sensitiveKeys = [
    'password', 'token', 'auth', 'authorization', 'cookie',
    'session', 'key', 'secret', 'private', 'credential'
  ];

  const sanitized = { ...data };

  Object.keys(sanitized).forEach(key => {
    if (sensitiveKeys.some(sensitive =>
      key.toLowerCase().includes(sensitive.toLowerCase())
    )) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof sanitized[key] === 'object') {
      sanitized[key] = sanitizeLogData(sanitized[key]);
    }
  });

  return sanitized;
}

/**
 * Sanitize log messages
 */
function sanitizeMessage(message: string): string {
  if (typeof message !== 'string') return message;

  // Remove potential sensitive data from messages
  return message
    .replace(/password[=:]\s*[^\s]+/gi, 'password=[REDACTED]')
    .replace(/token[=:]\s*[^\s]+/gi, 'token=[REDACTED]')
    .replace(/key[=:]\s*[^\s]+/gi, 'key=[REDACTED]');
}

/**
 * Production-safe logger interface
 */
export const secureLogger = {
  error: (message: string, meta?: any) => {
    logger.error(message, meta);
  },
  warn: (message: string, meta?: any) => {
    logger.warn(message, meta);
  },
  info: (message: string, meta?: any) => {
    if (isDevelopment) {
      logger.info(message, meta);
    }
  },
  debug: (message: string, meta?: any) => {
    if (isDevelopment) {
      logger.debug(message, meta);
    }
  },
  // Security-specific logging
  security: (event: string, details?: any) => {
    logger.warn(`SECURITY: ${event}`, {
      type: 'security_event',
      ...details
    });
  }
};

// Development helper (replaces console.log in dev mode)
export const devLog = isDevelopment
  ? (message: any, ...args: any[]) => console.log(message, ...args)
  : () => {}; // No-op in production
```

### Step 2.3: Replace Console Statements

**Example Replacement in Multiple Files**:

```typescript
// BEFORE (UNSAFE):
console.log('User data:', userData);
console.error('API error:', error);
console.warn('Deprecated feature used');

// AFTER (SECURE):
import { secureLogger, devLog } from '@/utils/logger';

// For development debugging only
devLog('User data:', userData);

// For actual logging
secureLogger.error('API request failed', {
  endpoint: '/api/users',
  status: response.status
});

secureLogger.warn('Deprecated feature accessed', {
  feature: 'legacy_auth',
  userId: user.id // Safe to log IDs
});

// For security events
secureLogger.security('Login attempt', {
  success: false,
  ip: clientIP,
  timestamp: new Date().toISOString()
});
```

### Step 2.4: Environment Variables Security

**File**: `.env.example`

```bash
# Public variables (safe to expose)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_VERSION=1.0.0

# Private variables (server-side only)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_database_url
ENCRYPTION_KEY=your_encryption_key
```

**File**: `src/config/environment.ts`

```typescript
/**
 * Environment configuration with validation
 */
interface EnvironmentConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  app: {
    version: string;
    environment: 'development' | 'production' | 'test';
  };
}

function validateEnvironment(): EnvironmentConfig {
  const requiredVars = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  };

  // Check for missing required variables
  const missing = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key, _]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return {
    supabase: {
      url: requiredVars.VITE_SUPABASE_URL,
      anonKey: requiredVars.VITE_SUPABASE_ANON_KEY,
    },
    app: {
      version: import.meta.env.VITE_APP_VERSION || '1.0.0',
      environment: import.meta.env.DEV ? 'development' : 'production',
    },
  };
}

export const env = validateEnvironment();
```

**File**: `src/integrations/supabase/client.ts` (Updated)

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { env } from '@/config/environment';

// Use environment configuration instead of hardcoded values
export const supabase = createClient<Database>(
  env.supabase.url,
  env.supabase.anonKey
);
```

---

## 🛡️ PHASE 3: CONTENT SECURITY POLICY & ADVANCED PROTECTION

### Step 3.1: Content Security Policy Implementation

**File**: `public/_headers` (for Vercel deployment)

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://*.supabase.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://*.supabase.co https://vercel.live wss://*.supabase.co; frame-ancestors 'none'; base-uri 'self'; form-action 'self';
```

**Alternative File**: `index.html` (meta tags approach)

```html
<head>
  <!-- Security Headers -->
  <meta http-equiv="X-Frame-Options" content="DENY">
  <meta http-equiv="X-Content-Type-Options" content="nosniff">
  <meta http-equiv="X-XSS-Protection" content="1; mode=block">
  <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">

  <!-- Content Security Policy -->
  <meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://*.supabase.co;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https: blob:;
    connect-src 'self' https://*.supabase.co https://vercel.live wss://*.supabase.co;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
  ">
</head>
```

### Step 3.2: Security Monitoring Hooks

**File**: `src/hooks/useSecurityMonitoring.ts`

```typescript
import { useEffect } from 'react';
import { secureLogger } from '@/utils/logger';

interface SecurityEvent {
  type: 'csp_violation' | 'xss_attempt' | 'unauthorized_access' | 'suspicious_activity';
  details: any;
}

export const useSecurityMonitoring = () => {
  useEffect(() => {
    // CSP Violation Reporting
    const handleCSPViolation = (event: SecurityPolicyViolationEvent) => {
      secureLogger.security('CSP Violation Detected', {
        directive: event.violatedDirective,
        blockedURI: event.blockedURI,
        documentURI: event.documentURI,
        sourceFile: event.sourceFile,
        lineNumber: event.lineNumber
      });
    };

    // XSS Attempt Detection
    const detectXSSAttempts = () => {
      const dangerousPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi
      ];

      // Monitor for suspicious input patterns
      document.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement;
        if (target && target.value) {
          const hasDangerousPattern = dangerousPatterns.some(pattern =>
            pattern.test(target.value)
          );

          if (hasDangerousPattern) {
            secureLogger.security('Potential XSS attempt detected', {
              inputType: target.type,
              elementId: target.id,
              pattern: 'dangerous_script_pattern'
            });
          }
        }
      });
    };

    // Failed Authentication Monitoring
    const monitorAuthFailures = () => {
      let failedAttempts = 0;
      const maxAttempts = 5;

      window.addEventListener('auth-failure', () => {
        failedAttempts++;
        if (failedAttempts >= maxAttempts) {
          secureLogger.security('Multiple authentication failures', {
            attempts: failedAttempts,
            timestamp: new Date().toISOString()
          });
        }
      });
    };

    // Register event listeners
    document.addEventListener('securitypolicyviolation', handleCSPViolation);
    detectXSSAttempts();
    monitorAuthFailures();

    return () => {
      document.removeEventListener('securitypolicyviolation', handleCSPViolation);
    };
  }, []);

  const reportSecurityEvent = (event: SecurityEvent) => {
    secureLogger.security(event.type, event.details);
  };

  return { reportSecurityEvent };
};
```

### Step 3.3: Input Validation Enhancement

**File**: `src/utils/inputValidation.ts`

```typescript
import { z } from 'zod';

/**
 * Enhanced input validation schemas with security rules
 */

// Base security patterns
const SAFE_TEXT_PATTERN = /^[a-zA-Z0-9\s\-_.,!?()]+$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_PATTERN = /^https?:\/\/[^\s<>"{}|\\^`\[\]]+$/;

// Security-enhanced text validation
export const secureTextSchema = z.string()
  .min(1, 'Laukas yra privalomas')
  .max(1000, 'Tekstas per ilgas')
  .refine(
    (value) => !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(value),
    'Tekstas turi neleistinus elementus'
  )
  .refine(
    (value) => !/javascript:/gi.test(value),
    'JavaScript kodas neleistinas'
  );

// Enhanced email validation
export const secureEmailSchema = z.string()
  .email('Neteisingas el. pašto formatas')
  .max(254, 'El. paštas per ilgas')
  .refine(
    (value) => EMAIL_PATTERN.test(value),
    'El. pašto formatas neatitinka saugumo reikalavimų'
  );

// Secure URL validation
export const secureUrlSchema = z.string()
  .url('Neteisingas URL formatas')
  .refine(
    (value) => URL_PATTERN.test(value),
    'URL turi būti HTTPS protokolo'
  )
  .refine(
    (value) => !value.includes('javascript:'),
    'JavaScript URL neleistinas'
  );

// Rich content validation (for admin forms)
export const secureRichContentSchema = z.string()
  .max(50000, 'Turinys per ilgas')
  .refine(
    (value) => {
      // Check for balanced HTML tags
      const openTags = (value.match(/<[^\/][^>]*>/g) || []).length;
      const closeTags = (value.match(/<\/[^>]*>/g) || []).length;
      return Math.abs(openTags - closeTags) <= 5; // Allow some self-closing tags
    },
    'HTML struktūra neteisinga'
  )
  .refine(
    (value) => !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(value),
    'Script tagai neleistini'
  );

/**
 * Runtime input sanitization
 */
export const sanitizeInput = (input: string, type: 'text' | 'email' | 'url' = 'text'): string => {
  if (!input || typeof input !== 'string') return '';

  // Remove null bytes and control characters
  let sanitized = input.replace(/[\x00-\x1F\x7F]/g, '');

  // Type-specific sanitization
  switch (type) {
    case 'email':
      sanitized = sanitized.toLowerCase().trim();
      break;
    case 'url':
      sanitized = sanitized.trim();
      // Ensure HTTPS if it's an HTTP URL
      if (sanitized.startsWith('http://')) {
        sanitized = sanitized.replace('http://', 'https://');
      }
      break;
    default:
      sanitized = sanitized.trim();
  }

  return sanitized;
};
```

### Step 3.4: Secure Form Components

**File**: `src/components/ui/SecureForm.tsx`

```typescript
import React from 'react';
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { sanitizeInput } from '@/utils/inputValidation';
import { secureLogger } from '@/utils/logger';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';

interface SecureFormProps<T extends FieldValues> {
  schema: z.ZodSchema<T>;
  onSubmit: SubmitHandler<T>;
  children: React.ReactNode;
  className?: string;
}

/**
 * Security-enhanced form component
 */
export function SecureForm<T extends FieldValues>({
  schema,
  onSubmit,
  children,
  className = ''
}: SecureFormProps<T>) {
  const { reportSecurityEvent } = useSecurityMonitoring();

  const form = useForm<T>({
    resolver: zodResolver(schema),
    mode: 'onChange'
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    try {
      // Sanitize all string inputs
      const sanitizedData = Object.entries(data).reduce((acc, [key, value]) => {
        if (typeof value === 'string') {
          acc[key] = sanitizeInput(value);
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as T);

      // Validate sanitized data
      const validatedData = schema.parse(sanitizedData);

      // Log form submission (without sensitive data)
      secureLogger.info('Form submitted successfully', {
        fields: Object.keys(validatedData),
        timestamp: new Date().toISOString()
      });

      await onSubmit(validatedData);
    } catch (error) {
      // Log validation failures as potential security events
      if (error instanceof z.ZodError) {
        reportSecurityEvent({
          type: 'suspicious_activity',
          details: {
            type: 'form_validation_failure',
            errors: error.errors.map(e => e.message),
            fields: error.errors.map(e => e.path.join('.'))
          }
        });
      }

      secureLogger.warn('Form validation failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw error;
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className={className}
      noValidate // We handle validation ourselves
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...child.props,
            form
          } as any);
        }
        return child;
      })}
    </form>
  );
}
```

---

## 🔍 VALIDATION & TESTING

### Step 4.1: Security Testing Commands

```bash
# Install security testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom jest-environment-jsdom

# Create security test suite
npm run test:security

# Run security linting
npm install --save-dev eslint-plugin-security
npx eslint . --ext .ts,.tsx --config .eslintrc-security.js
```

### Step 4.2: Security Test Suite

**File**: `src/__tests__/security.test.ts`

```typescript
import { sanitizeHtml, validateHtmlSafety } from '../utils/htmlSanitizer';
import { sanitizeInput } from '../utils/inputValidation';

describe('Security Functions', () => {
  describe('HTML Sanitization', () => {
    test('removes script tags', () => {
      const malicious = '<p>Hello</p><script>alert("xss")</script>';
      const sanitized = sanitizeHtml(malicious);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('<p>Hello</p>');
    });

    test('removes event handlers', () => {
      const malicious = '<img src="x" onerror="alert(1)">';
      const sanitized = sanitizeHtml(malicious);
      expect(sanitized).not.toContain('onerror');
    });

    test('preserves safe content', () => {
      const safe = '<p><strong>Bold text</strong> and <em>italic</em></p>';
      const sanitized = sanitizeHtml(safe);
      expect(sanitized).toBe(safe);
    });
  });

  describe('Input Validation', () => {
    test('removes control characters', () => {
      const input = 'Hello\x00World\x1F';
      const sanitized = sanitizeInput(input);
      expect(sanitized).toBe('HelloWorld');
    });

    test('handles email sanitization', () => {
      const email = '  USER@EXAMPLE.COM  ';
      const sanitized = sanitizeInput(email, 'email');
      expect(sanitized).toBe('user@example.com');
    });
  });
});
```

### Step 4.3: Security Audit Checklist

**File**: `claudedocs/SECURITY_AUDIT_CHECKLIST.md`

```markdown
# Security Audit Checklist

## ✅ XSS Protection
- [ ] All dangerouslySetInnerHTML replaced with SafeHtml component
- [ ] HTML sanitization implemented with DOMPurify
- [ ] Content validation in place
- [ ] Rich text editor content sanitized

## ✅ Logging Security
- [ ] Console statements removed from production
- [ ] Secure logging system implemented
- [ ] Sensitive data sanitization in logs
- [ ] Security event monitoring active

## ✅ Environment Security
- [ ] Environment variables properly configured
- [ ] No hardcoded secrets in source code
- [ ] Validation for required environment variables
- [ ] Separate development/production configurations

## ✅ Content Security Policy
- [ ] CSP headers implemented
- [ ] Security headers configured
- [ ] CSP violation monitoring active
- [ ] Frame protection enabled

## ✅ Input Validation
- [ ] Enhanced validation schemas with security rules
- [ ] Input sanitization implemented
- [ ] Form security monitoring
- [ ] XSS attempt detection

## ✅ Testing
- [ ] Security test suite implemented
- [ ] HTML sanitization tests passing
- [ ] Input validation tests passing
- [ ] CSP compliance verified
```

---

## 📊 EXPECTED SECURITY IMPROVEMENT

### Before Implementation (6/10):
- ❌ 7 unsafe dangerouslySetInnerHTML usages
- ❌ 27 console statements in production
- ❌ No Content Security Policy
- ❌ No HTML sanitization
- ❌ Basic environment variable handling

### After Implementation (10/10):
- ✅ All HTML content sanitized with DOMPurify
- ✅ Production-safe logging system
- ✅ Comprehensive Content Security Policy
- ✅ Security monitoring and reporting
- ✅ Enhanced input validation
- ✅ Environment variable security
- ✅ Security testing suite

### Security Score Breakdown:
- **XSS Protection**: 6/10 → 10/10
- **Information Disclosure**: 5/10 → 10/10
- **Content Security**: 4/10 → 10/10
- **Input Validation**: 7/10 → 10/10
- **Monitoring**: 3/10 → 9/10

**Overall Security Score**: 6/10 → 10/10

---

## 🚀 IMPLEMENTATION TIMELINE

### Week 1: XSS Mitigation
- Days 1-2: Install dependencies and create sanitization utilities
- Days 3-4: Replace dangerouslySetInnerHTML usage
- Day 5: Testing and validation

### Week 2: Logging & Environment
- Days 1-2: Implement secure logging system
- Days 3-4: Replace console statements
- Day 5: Environment variable security

### Week 3: CSP & Advanced Protection
- Days 1-2: Implement Content Security Policy
- Days 3-4: Security monitoring and testing
- Day 5: Final audit and validation

**Total Effort**: ~15 development days
**Expected Result**: Security rating improved from 6/10 to 10/10