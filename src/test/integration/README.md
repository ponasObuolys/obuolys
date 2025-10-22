# Integration Tests

This directory contains integration tests that test the interaction between your application and external services, primarily Supabase.

## Setup

Integration tests require a test Supabase instance and are not run by default. To run integration tests:

1. **Set up test environment variables:**

```bash
# .env.test.local
VITE_SUPABASE_URL=your-test-supabase-url
VITE_SUPABASE_ANON_KEY=your-test-supabase-anon-key
INTEGRATION_TESTS=true
```

2. **Set up test database:**
   - Create a separate Supabase project for testing
   - Apply the same migrations and RLS policies
   - Use test data that can be safely created/deleted

3. **Run integration tests:**

```bash
npm run test:integration
```

## Test Categories

### Database Operations

- CRUD operations for all main tables (articles, tools, courses, etc.)
- Complex queries and joins
- Pagination and performance testing

### Authentication & Authorization

- User registration and login flows
- RLS (Row Level Security) policy enforcement
- Admin vs. regular user permissions

### Storage Operations

- File uploads and downloads
- Public URL generation
- File management operations

### Real-time Features

- WebSocket connections
- Real-time data updates
- Subscription management

## Best Practices

1. **Data Isolation:** Each test creates and cleans up its own test data
2. **Environment Separation:** Never run integration tests against production
3. **Test Independence:** Tests should not depend on each other
4. **Resource Cleanup:** Always clean up created resources in `afterEach`

## Debugging

If integration tests fail:

1. Check test database connectivity
2. Verify RLS policies are correctly applied
3. Ensure test user has appropriate permissions
4. Check for data conflicts between tests

## Performance Benchmarks

Integration tests include performance assertions:

- Database queries should complete within 1 second
- File uploads should complete within 5 seconds
- Real-time subscriptions should connect within 100ms
