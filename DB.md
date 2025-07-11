# Duomenų bazės struktūra - Obuolys projektas

Šis dokumentas aprašo **ponasObuolys** projekto duomenų bazės struktūrą Supabase platformoje.

## Projekto informacija

- **Projekto ID**: `jzixoslapmlqafrlbvpk`
- **Projekto pavadinimas**: ponasObuolys
- **Regionas**: eu-central-1
- **Statusas**: ACTIVE_HEALTHY
- **PostgreSQL versija**: 15.8.1.054
- **Sukurta**: 2025-03-30T18:14:49.276346Z

## Duomenų bazės schema

```mermaid
erDiagram
    %% AUTH SCHEMA
    auth_users {
        uuid id PK
        varchar email UK
        varchar encrypted_password
        timestamptz email_confirmed_at
        timestamptz invited_at
        varchar confirmation_token
        timestamptz confirmation_sent_at
        varchar recovery_token
        timestamptz recovery_sent_at
        varchar email_change
        timestamptz email_change_sent_at
        varchar email_change_token_new
        varchar email_change_token_current
        smallint email_change_confirm_status
        timestamptz last_sign_in_at
        jsonb raw_app_meta_data
        jsonb raw_user_meta_data
        boolean is_super_admin
        timestamptz created_at
        timestamptz updated_at
        text phone UK
        timestamptz phone_confirmed_at
        varchar phone_change_token
        text phone_change
        timestamptz phone_change_sent_at
        timestamptz confirmed_at
        timestamptz banned_until
        varchar reauthentication_token
        timestamptz reauthentication_sent_at
        boolean is_sso_user
        timestamptz deleted_at
        boolean is_anonymous
    }
    
    auth_identities {
        uuid id PK
        text provider_id
        uuid user_id FK
        jsonb identity_data
        text provider
        timestamptz last_sign_in_at
        timestamptz created_at
        timestamptz updated_at
        text email
    }
    
    auth_sessions {
        uuid id PK
        uuid user_id FK
        timestamptz created_at
        timestamptz updated_at
        uuid factor_id
        aal_level aal
        timestamptz not_after
        timestamp refreshed_at
        text user_agent
        inet ip
        text tag
    }
    
    auth_refresh_tokens {
        bigint id PK
        varchar token UK
        varchar user_id
        boolean revoked
        timestamptz created_at
        timestamptz updated_at
        varchar parent
        uuid session_id FK
    }
    
    auth_mfa_factors {
        uuid id PK
        uuid user_id FK
        text friendly_name
        factor_type factor_type
        factor_status status
        timestamptz created_at
        timestamptz updated_at
        text secret
        text phone
        timestamptz last_challenged_at UK
        jsonb web_authn_credential
        uuid web_authn_aaguid
    }
    
    auth_mfa_challenges {
        uuid id PK
        uuid factor_id FK
        timestamptz created_at
        timestamptz verified_at
        inet ip_address
        text otp_code
        jsonb web_authn_session_data
    }
    
    auth_mfa_amr_claims {
        uuid session_id FK
        timestamptz created_at
        timestamptz updated_at
        text authentication_method
        uuid id PK
    }
    
    auth_audit_log_entries {
        uuid id PK
        json payload
        timestamptz created_at
        varchar ip_address
    }
    
    auth_sso_providers {
        uuid id PK
        text resource_id
        timestamptz created_at
        timestamptz updated_at
    }
    
    auth_sso_domains {
        uuid id PK
        uuid sso_provider_id FK
        text domain
        timestamptz created_at
        timestamptz updated_at
    }
    
    auth_saml_providers {
        uuid id PK
        uuid sso_provider_id FK
        text entity_id UK
        text metadata_xml
        text metadata_url
        jsonb attribute_mapping
        timestamptz created_at
        timestamptz updated_at
        text name_id_format
    }
    
    auth_saml_relay_states {
        uuid id PK
        uuid sso_provider_id FK
        text request_id
        text for_email
        text redirect_to
        timestamptz created_at
        timestamptz updated_at
        uuid flow_state_id FK
    }
    
    auth_flow_state {
        uuid id PK
        uuid user_id
        text auth_code
        code_challenge_method code_challenge_method
        text code_challenge
        text provider_type
        text provider_access_token
        text provider_refresh_token
        timestamptz created_at
        timestamptz updated_at
        text authentication_method
        timestamptz auth_code_issued_at
    }
    
    auth_one_time_tokens {
        uuid id PK
        uuid user_id FK
        one_time_token_type token_type
        text token_hash
        text relates_to
        timestamp created_at
        timestamp updated_at
    }
    
    %% STORAGE SCHEMA
    storage_buckets {
        text id PK
        text name UK
        uuid owner
        timestamptz created_at
        timestamptz updated_at
        boolean public
        boolean avif_autodetection
        bigint file_size_limit
        text[] allowed_mime_types
        text owner_id
    }
    
    storage_objects {
        uuid id PK
        text bucket_id FK
        text name
        uuid owner
        timestamptz created_at
        timestamptz updated_at
        timestamptz last_accessed_at
        jsonb metadata
        text[] path_tokens
        text version
        text owner_id
        jsonb user_metadata
    }
    
    storage_s3_multipart_uploads {
        text id PK
        bigint in_progress_size
        text upload_signature
        text bucket_id FK
        text key
        text version
        text owner_id
        timestamptz created_at
        jsonb user_metadata
    }
    
    storage_s3_multipart_uploads_parts {
        uuid id PK
        text upload_id FK
        bigint size
        integer part_number
        text bucket_id FK
        text key
        text etag
        text owner_id
        text version
        timestamptz created_at
    }
    
    %% PUBLIC SCHEMA
    profiles {
        uuid id PK FK
        text username UK
        text avatar_url
        boolean is_admin
        timestamptz created_at
        timestamptz updated_at
        text pareigos
    }
    
    articles {
        uuid id PK
        text title
        text slug UK
        text description
        text content
        text category
        text read_time
        text author
        date date
        timestamptz created_at
        timestamptz updated_at
        boolean featured
        boolean published
        text image_url
        text content_type
    }
    
    tools {
        uuid id PK
        text name
        text slug UK
        text description
        text url
        text image_url
        text category
        timestamptz created_at
        timestamptz updated_at
        boolean featured
        boolean published
    }
    
    courses {
        uuid id PK
        text title
        text slug UK
        text description
        text content
        text price
        text duration
        text level
        text[] highlights
        timestamptz created_at
        timestamptz updated_at
        boolean published
        text image_url
    }
    
    contact_messages {
        uuid id PK
        text name
        text email
        text subject
        text message
        timestamptz created_at
        text status
    }
    
    hero_sections {
        uuid id PK
        text title
        text subtitle
        text button_text
        text button_url
        text image_url
        boolean active
        timestamptz created_at
        timestamptz updated_at
    }
    
    cta_sections {
        uuid id PK
        text title
        text description
        text button_text
        text button_url
        boolean active
        timestamptz created_at
        timestamptz updated_at
    }
    
    translation_requests {
        bigint id PK
        text source_text
        text translated_text
        varchar source_lang
        varchar target_lang
        integer chars_count
        varchar status
        timestamptz created_at
        varchar request_ip
        varchar origin_domain
    }
    
    migration_documentation {
        uuid id PK
        varchar migration_version UK
        varchar migration_name
        text description
        text sql_changes
        boolean breaking_changes
        text rollback_instructions
        varchar author
        timestamptz applied_at
        timestamptz created_at
        timestamptz updated_at
    }
    
    %% VIEWS
    auth_users_view {
        uuid id
        text email
        timestamptz created_at
    }
    
    user_profiles {
        uuid id
        text username
        text avatar_url
        boolean is_admin
        timestamptz created_at
        timestamptz updated_at
        text email
        timestamptz auth_created_at
    }
    
    %% RYŠIAI
    auth_users ||--o{ auth_identities : "user_id"
    auth_users ||--o{ auth_sessions : "user_id"
    auth_users ||--o{ auth_mfa_factors : "user_id"
    auth_users ||--o{ auth_one_time_tokens : "user_id"
    auth_users ||--|| profiles : "id"
    
    auth_sessions ||--o{ auth_refresh_tokens : "session_id"
    auth_sessions ||--o{ auth_mfa_amr_claims : "session_id"
    
    auth_mfa_factors ||--o{ auth_mfa_challenges : "factor_id"
    
    auth_sso_providers ||--o{ auth_sso_domains : "sso_provider_id"
    auth_sso_providers ||--o{ auth_saml_providers : "sso_provider_id"
    auth_sso_providers ||--o{ auth_saml_relay_states : "sso_provider_id"
    
    auth_flow_state ||--o{ auth_saml_relay_states : "flow_state_id"
    
    storage_buckets ||--o{ storage_objects : "bucket_id"
    storage_buckets ||--o{ storage_s3_multipart_uploads : "bucket_id"
    storage_buckets ||--o{ storage_s3_multipart_uploads_parts : "bucket_id"
    
    storage_s3_multipart_uploads ||--o{ storage_s3_multipart_uploads_parts : "upload_id"
```

## Lentelių aprašymas

### AUTH schema

#### auth.users
Pagrindinis autentifikavimo vartotojų saugykla.
- **RLS**: Įjungta
- **Komentaras**: Auth: Stores user login data within a secure schema
- **Svarbus laukas**: confirmed_at - generuojamas automatiškai iš email_confirmed_at ir phone_confirmed_at

#### auth.identities
Vartotojų tapatybės saugykla (OAuth, SAML ir kt.).
- **RLS**: Įjungta
- **Komentaras**: Auth: Stores identities associated to a user
- **Svarbus laukas**: email - generuojamas automatiškai iš identity_data

#### auth.sessions
Aktyvių sesijų valdymas.
- **RLS**: Įjungta
- **Komentaras**: Auth: Stores session data associated to a user
- **Enum**: aal (Authentication Assurance Level) - aal1, aal2, aal3

#### auth.refresh_tokens
JWT refresh token'ų saugykla.
- **RLS**: Įjungta
- **Komentaras**: Auth: Store of tokens used to refresh JWT tokens once they expire

#### auth.mfa_factors
Daugiafaktorės autentifikacijos faktoriai.
- **RLS**: Įjungta
- **Komentaras**: auth: stores metadata about factors
- **Enum**: factor_type (totp, webauthn, phone), factor_status (unverified, verified)

#### auth.audit_log_entries
Autentifikacijos audito žurnalas.
- **RLS**: Įjungta
- **Komentaras**: Auth: Audit trail for user actions

### STORAGE schema

#### storage.buckets
Failų saugyklų konfigūracija.
- **RLS**: Įjungta
- **Aktyvus bucket**: site-images (public: true, sukurtas: 2025-04-02)

#### storage.objects
Failų objektų metaduomenys.
- **RLS**: Įjungta
- **Svarbus laukas**: path_tokens - generuojamas automatiškai iš name lauko

### PUBLIC schema

#### profiles
Vartotojų profilių informacija.
- **RLS**: Įjungta
- **Ryšiai**: Susieta su auth.users per foreign key
- **Naujas laukas**: pareigos - pridėtas migracijoje 20250529060432

#### articles
Straipsnių turinys ir metaduomenys.
- **RLS**: Įjungta
- **Funkcionalumas**: featured, published, image_url, content_type
- **Numatytasis autorius**: 'ponas Obuolys'

#### tools
AI įrankių katalogas.
- **RLS**: Įjungta
- **Funkcionalumas**: featured, published, image_url

#### courses
Kursų informacija ir turinys.
- **RLS**: Įjungta
- **Specifiniai laukai**: highlights (array), image_url

#### contact_messages
Kontaktų formos pranešimai.
- **RLS**: Įjungta
- **Numatytasis status**: 'unread'

#### hero_sections
Pagrindinio puslapio hero sekcijos turinys.
- **RLS**: Įjungta
- **Funkcionalumas**: active flag, image_url

#### cta_sections
Call-to-action sekcijos turinys.
- **RLS**: Įjungta
- **Funkcionalumas**: active flag

#### translation_requests
DeepL API proxy serverio vertimo užklausų žurnalas.
- **RLS**: Įjungta
- **Komentaras**: Vertimo užklausų žurnalas DeepL API proxy serveriui
- **Automatinis**: chars_count apskaičiuojamas automatiškai per trigger

#### migration_documentation
Duomenų bazės migracijų dokumentacija.
- **RLS**: Įjungta
- **Unikalus laukas**: migration_version

## Row Level Security (RLS) politikos

### PUBLIC schema politikos

#### profiles
- **Public profiles are viewable by everyone**: Visi gali peržiūrėti profilius
- **Users can update their own profile**: Vartotojai gali redaguoti savo profilius

#### articles
- **Allow public read access for published articles**: Viešas skaitymas publikuotiems straipsniams
- **Allow admin write access for articles**: Administratoriai gali redaguoti straipsnius

#### tools
- **Allow public read access for published tools**: Viešas skaitymas publikuotiems įrankiams
- **Allow admin write access for tools**: Administratoriai gali redaguoti įrankius

#### courses
- **Allow public read access for published courses**: Viešas skaitymas publikuotiems kursams
- **Allow admin write access for courses**: Administratoriai gali redaguoti kursus

#### contact_messages
- **Allow anyone to create contact messages**: Visi gali kurti kontaktų pranešimus
- **Allow admin read/update access for contact messages**: Administratoriai gali skaityti/redaguoti pranešimus

#### hero_sections & cta_sections
- **Allow public read access for active sections**: Viešas skaitymas aktyvių sekcijų
- **Allow admin write access**: Administratoriai gali redaguoti sekcijas

#### translation_requests
- **translation_requests_select_policy**: Autentifikuoti vartotojai gali skaityti
- **translation_requests_insert_policy**: Autentifikuoti vartotojai gali kurti
- **translation_requests_delete_policy**: Autentifikuoti vartotojai gali šalinti

#### migration_documentation
- **Allow public read access to migration docs**: Visi gali skaityti migracijų dokumentaciją
- **Allow admin full access to migration docs**: Administratoriai turi pilną prieigą

### STORAGE schema politikos

#### storage.buckets
- **Public buckets are viewable by everyone**: Visi gali peržiūrėti bucket'us
- **Buckets can be created/updated/deleted by admins**: Administratoriai gali valdyti bucket'us

#### storage.objects
- **Anyone can view site images**: Visi gali peržiūrėti site-images bucket'o failus
- **Any authenticated user can upload to site images**: Autentifikuoti vartotojai gali įkelti failus
- **Admin can insert/update/delete storage**: Administratoriai turi pilną prieigą
- **Only owner can delete own files**: Savininkai gali šalinti savo failus

## Funkcijos ir triggeriai

### Funkcijos

#### auth schema
- **auth.email()**: Gauti vartotojo el. paštą iš JWT
- **auth.jwt()**: Gauti JWT duomenis
- **auth.role()**: Gauti vartotojo rolę
- **auth.uid()**: Gauti vartotojo UUID

#### public schema
- **is_admin(user_id)**: Patikrinti ar vartotojas yra administratorius
- **handle_new_user()**: Automatiškai sukurti profilį naujiems vartotojams
- **get_profiles_with_emails()**: Gauti profilius su el. paštais
- **get_auth_users()**: Gauti autentifikavimo vartotojus
- **update_modified_column()**: Atnaujinti updated_at lauką
- **set_translation_chars_count()**: Apskaičiuoti simbolių skaičių vertimo užklausose
- **update_migration_documentation_updated_at()**: Atnaujinti migracijų dokumentacijos laiką

#### storage schema
- **storage.filename(name)**: Gauti failo pavadinimą
- **storage.extension(name)**: Gauti failo plėtinį
- **storage.foldername(name)**: Gauti aplanko pavadinimą
- **storage.get_size_by_bucket()**: Gauti bucket'o dydį
- **storage.list_objects_with_delimiter()**: Sąrašas objektų su skirtukais
- **storage.search()**: Paieška storage objektuose

### Triggeriai

#### Automatinis profilių kūrimas
- **on_auth_user_created**: Automatiškai sukuria profilį auth.users lentelėje

#### Automatinis updated_at atnaujinimas
- **update_articles_modtime**: articles lentelei
- **update_courses_modtime**: courses lentelei
- **update_tools_modtime**: tools lentelei
- **update_hero_sections_modtime**: hero_sections lentelei
- **update_cta_sections_modtime**: cta_sections lentelei
- **update_objects_updated_at**: storage.objects lentelei

#### Specialūs triggeriai
- **trigger_set_translation_chars_count**: Automatiškai apskaičiuoja simbolių skaičių translation_requests lentelėje
- **migration_documentation_updated_at**: Specialus trigger migracijų dokumentacijai

## Indeksai

### Pagrindiniai indeksai

#### auth schema
- **Unikalūs**: users_email_partial_key, users_phone_key, refresh_tokens_token_unique
- **Performanso**: users_instance_id_email_idx, sessions_user_id_idx, identities_user_id_idx

#### public schema
- **Unikalūs**: profiles_username_key, articles_slug_key, tools_slug_key, courses_slug_key
- **Performanso**: idx_translation_requests_created_at, idx_translation_requests_status

#### storage schema
- **Unikalūs**: bname (bucket name), bucketid_objname (bucket_id + name)
- **Performanso**: idx_objects_bucket_id_name, name_prefix_search

## Apribojimai ir patikros

### Check constraints
- **auth.users**: email_change_confirm_status tarp 0 ir 2
- **auth.sso_providers**: resource_id ne tuščias
- **auth.saml_providers**: entity_id, metadata_xml ne tušti
- **auth.one_time_tokens**: token_hash ne tuščias

### Foreign key constraints
- **profiles.id** → **auth.users.id** (ON DELETE CASCADE)
- **auth.identities.user_id** → **auth.users.id** (ON DELETE CASCADE)
- **auth.sessions.user_id** → **auth.users.id** (ON DELETE CASCADE)
- **storage.objects.bucket_id** → **storage.buckets.id**

## Extensionai

### Įdiegti extensionai
- **pgcrypto**: Kriptografinės funkcijos
- **pgjwt**: JSON Web Token API
- **uuid-ossp**: UUID generavimas
- **pg_stat_statements**: SQL statistikos sekimas
- **pg_graphql**: GraphQL palaikymas
- **pgsodium**: Libsodium kriptografijos funkcijos
- **supabase_vault**: Supabase Vault extensionas

### Prieinami extensionai
- **postgis**: Geografiniai duomenys
- **vector**: Vektoriniai duomenys AI/ML
- **pg_cron**: Užduočių planuoklis
- **timescaledb**: Laiko serijos duomenys
- **hypopg**: Hipotetiški indeksai

## Migracijos

### Taikytos migracijos
1. **20250529060432_add_pareigos_to_profiles**: Pridėtas pareigos laukas profiles lentelei
2. **20250607063748_remove_foreign_tables**: Pašalintos svetimos lentelės
3. **20250607063813_create_migration_log_system**: Sukurta migracijų žurnalo sistema

## Storage konfigūracija

### Buckets
- **site-images**: 
  - Public: true
  - Sukurtas: 2025-04-02
  - Nėra failo dydžio apribojimų
  - Nėra MIME tipų apribojimų

### RLS politikos storage
- Administratoriai gali valdyti visus bucket'us ir objektus
- Autentifikuoti vartotojai gali įkelti failus į site-images
- Visi gali peržiūrėti site-images bucket'o failus
- Failų savininkai gali šalinti savo failus

## Duomenų tipai

- **UUID**: Pirminiai raktai ir nuorodos
- **TEXT**: Turinio laukai
- **VARCHAR**: Trumpi tekstai ir kodai
- **BOOLEAN**: Funkcionalumo valdymas
- **TIMESTAMPTZ**: Laiko žymės su laiko juostomis
- **JSONB**: Struktūrizuoti duomenys
- **ARRAY**: Masyvai (highlights, path_tokens)
- **ENUM**: Apriboti pasirinkimai (aal_level, factor_type, factor_status)

## Saugumo funkcijos

### Autentifikacija
- JWT token'ų valdymas
- Refresh token'ų rotacija
- MFA palaikymas (TOTP, WebAuthn, Phone)
- SSO/SAML integracija

### Autorizacija
- Row Level Security visom lentelėm
- Administravimo teisių tikrinimas per is_admin() funkciją
- Objektų savininkystės kontrolė

### Auditas
- Autentifikavimo veiksmų žurnalas
- Automatinis updated_at laukų atnaujinimas
- Migracijų dokumentavimas

## Performanso optimizacija

### Indeksai
- B-tree indeksai pagrindiniams laukams
- Partial indeksai sąlyginiams duomenims
- Composite indeksai dažniems užklausoms

### Triggeriai
- Automatinis metaduomenų atnaujinimas
- Duomenų validacija įrašymo metu
- Optimizuoti update operacijos

Šis dokumentas atspindi tikrą duomenų bazės būklę projekto **ponasObuolys** Supabase projekte (jzixoslapmlqafrlbvpk) 2025-01-01 datos būklę. 