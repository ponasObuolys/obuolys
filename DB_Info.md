# Supabase Database Structure

This document outlines the database structure for the Ponas Obuolys website.

## Tables

### 1. profiles
Stores user profile information.
- `id` (UUID, PK): User ID, linked to auth.users
- `username` (TEXT, nullable): Username
- `avatar_url` (TEXT, nullable): Profile picture URL
- `is_admin` (BOOLEAN, nullable): Administrator status
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

### 2. articles
Stores articles for the /straipsniai section.
- `id` (UUID, PK): Unique identifier
- `title` (TEXT): Article title
- `slug` (TEXT, unique): URL-friendly identifier
- `description` (TEXT): Short description
- `content` (TEXT): Full article content
- `category` (TEXT): Article category
- `read_time` (TEXT): Estimated reading time
- `author` (TEXT): Author name
- `date` (DATE): Publication date
- `featured` (BOOLEAN): Featured article status
- `published` (BOOLEAN): Publication status
- `image_url` (TEXT, nullable): Article cover image URL
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

### 3. news
Stores news items for the /naujienos section.
- `id` (UUID, PK): Unique identifier
- `title` (TEXT): News title
- `slug` (TEXT, unique): URL-friendly identifier
- `description` (TEXT): Short description
- `content` (TEXT): Full news content
- `author` (TEXT): Author name
- `date` (DATE): Publication date
- `published` (BOOLEAN): Publication status
- `image_url` (TEXT, nullable): News cover image URL
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

### 4. tools
Stores tools for the /irankiai section.
- `id` (UUID, PK): Unique identifier
- `name` (TEXT): Tool name
- `slug` (TEXT, unique): URL-friendly identifier
- `description` (TEXT): Tool description
- `url` (TEXT): Tool URL
- `image_url` (TEXT, nullable): Tool image URL
- `category` (TEXT): Tool category
- `featured` (BOOLEAN): Featured tool status
- `published` (BOOLEAN): Publication status
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

### 5. courses
Stores courses for the /kursai section.
- `id` (UUID, PK): Unique identifier
- `title` (TEXT): Course title
- `slug` (TEXT, unique): URL-friendly identifier
- `description` (TEXT): Course description
- `content` (TEXT): Full course content
- `price` (TEXT): Course price
- `duration` (TEXT): Course duration
- `level` (TEXT): Course difficulty level
- `highlights` (TEXT[]): Course highlights/features as array
- `published` (BOOLEAN): Publication status
- `image_url` (TEXT, nullable): Course cover image URL
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

### 6. contact_messages
Stores contact form submissions from /kontaktai.
- `id` (UUID, PK): Unique identifier
- `name` (TEXT): Sender's name
- `email` (TEXT): Sender's email
- `subject` (TEXT): Message subject
- `message` (TEXT): Message content
- `status` (TEXT): Message status (e.g., "unread", "read", "replied")
- `created_at` (TIMESTAMP): Submission timestamp

### 7. hero_sections
Stores hero section content for the homepage.
- `id` (UUID, PK): Unique identifier
- `title` (TEXT): Section title
- `subtitle` (TEXT): Section subtitle
- `button_text` (TEXT, nullable): CTA button text
- `button_url` (TEXT, nullable): CTA button URL
- `image_url` (TEXT, nullable): Hero image URL
- `active` (BOOLEAN): Active status
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

### 8. cta_sections
Stores call-to-action section content.
- `id` (UUID, PK): Unique identifier
- `title` (TEXT): CTA title
- `description` (TEXT): CTA description
- `button_text` (TEXT): Button text
- `button_url` (TEXT): Button URL
- `active` (BOOLEAN): Active status
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

## Row Level Security (RLS) Policies

All tables have Row Level Security enabled with the following policies:

1. **Public Access Policies**:
   - Anyone can view published articles, news, tools, courses, and active hero/CTA sections
   - Anyone can submit contact messages

2. **Admin Access Policies**:
   - Admins (users with is_admin=true) can perform all operations on all tables
   - Admin status is checked via the `is_admin(auth.uid())` function

## Storage Buckets

Supabase Storage is used to store media files:

1. **site-images**:
   - Purpose: Stores all website images
   - Structure:
     - `articles/covers/`: Article cover images
     - `articles/content/`: Images used within article content
     - `news/covers/`: News cover images
     - `news/content/`: Images used within news content
     - `tools/`: Tool images
     - `courses/covers/`: Course cover images
     - `courses/content/`: Images used within course content
   - Permissions:
     - READ: Public
     - INSERT/UPDATE/DELETE: Only admin users

## Functions

1. **update_modified_column()**: Automatically updates the `updated_at` timestamp on record modification
2. **is_admin(user_id)**: Checks if a user has admin privileges

## Development Guidelines

1. Always use the appropriate RLS policies when adding new tables
2. Keep the `updated_at` column updated via triggers
3. Use slugs for URL-friendly identifiers
4. Ensure proper validation for all user inputs
5. Implement proper error handling in the application
6. For content management, leverage the admin dashboard
7. When uploading images, use the FileUpload component which handles storage and URL generation
