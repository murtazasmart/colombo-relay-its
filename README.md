# Mumin Census & Miqaat Registration System

## System Overview
This system manages census data for mumins (community members) and handles miqaat event registrations, attendance tracking, and accommodation management.

## Tech Stack
- **Frontend**: NextJS
- **Backend**: Laravel API
- **Database**: MySQL/PostgreSQL
- **Authentication**: Laravel Sanctum/JWT

## Database Schema

### 1. mumins
- `its_id` (primary key)
- `eits_id`
- `hof_its_id` (foreign key to its_id - head of family)
- `full_name`
- `gender`
- `age`
- `mobile`
- `country`

### 2. miqaats
- `id` (primary key)
- `name`
- `start_date`
- `end_date`
- `description`
- `status` (upcoming, active, completed, cancelled)

### 3. miqaat_events
- `id` (primary key)
- `miqaat_id` (foreign key)
- `name` 
- `datetime`
- `location`
- Other event details

### 4. miqaat_registrations
- `id` (primary key)
- `miqaat_id` (foreign key)
- `its_id` (foreign key)
- `registration_date`

### 5. arrival_scans
- `id` (primary key)
- `its_id` (foreign key)
- `user_id` (foreign key - the scanner)
- `timestamp`
- `miqaat_id` (foreign key)

### 6. accommodations
- `id` (primary key)
- `its_id` (foreign key)
- `miqaat_id` (foreign key)
- `name` (accommodation place name)
- `city`
- `pincode`
- `accommodation_type`
- `check_in_date`
- `check_out_date`

### 7. waaz_centers
- `id` (primary key)
- `center_name`
- `location`
- `capacity`

### 8. waaz_center_preferences
- `id` (primary key)
- `its_id` (foreign key)
- `waaz_center_id` (foreign key)
- `miqaat_id` (foreign key)

### 9. users
- Standard Laravel users table with role-based access

## Security Implementation

### ITS_ID Encryption
- Encrypt ITS_ID when storing on client-side
- Use Laravel's encryption for backend services
- Implement the following:

#### Backend (Laravel):
```php
// app/Services/EncryptionService.php
namespace App\Services;

class EncryptionService
{
    public function encryptItsId($itsId)
    {
        return encrypt($itsId);
    }
    
    public function decryptItsId($encryptedItsId)
    {
        try {
            return decrypt($encryptedItsId);
        } catch (\Exception $e) {
            return null; // Invalid encryption
        }
    }
}
```

#### Frontend (NextJS):
```javascript
// utils/secureId.js
export const secureStorage = {
  // Store encrypted ITS_ID temporarily in memory
  storeSecureId: (encryptedId) => {
    const sessionId = window.sessionStorage.setItem('session_token', encryptedId);
    return sessionId;
  },
  
  // Get the stored encrypted ID
  getSecureId: () => {
    return window.sessionStorage.getItem('session_token');
  },
  
  // Clear on logout
  clearSecureId: () => {
    window.sessionStorage.removeItem('session_token');
  }
};
```

## API Endpoints

### Census API
- `GET /api/mumins` - List all mumins with pagination
- `GET /api/mumins/{its_id}` - Get mumin details
- `POST /api/mumins` - Create new mumin record
- `PUT /api/mumins/{its_id}` - Update mumin details
- `GET /api/mumins/search` - Search with filters

### Miqaat API
- `GET /api/miqaats` - List all miqaats
- `GET /api/miqaats/{id}` - Get miqaat details
- `GET /api/miqaats/{id}/events` - Get miqaat events
- `POST /api/miqaats` - Create miqaat
- `PUT /api/miqaats/{id}` - Update miqaat
- `PATCH /api/miqaats/{id}/status` - Update miqaat status

### Registration API
- `POST /api/registrations` - Register a mumin for a miqaat
- `GET /api/registrations/miqaat/{miqaat_id}` - Get all registrations for a miqaat
- `GET /api/registrations/mumin/{its_id}` - Get all registrations for a mumin

### Arrival Scan API
- `POST /api/scans` - Record an arrival scan
- `GET /api/scans/miqaat/{miqaat_id}` - Get all scans for a miqaat
- `GET /api/scans/stats/{miqaat_id}` - Get scan statistics

### Accommodation API
- `GET /api/accommodations/miqaat/{miqaat_id}` - List accommodations for a miqaat
- `POST /api/accommodations` - Create accommodation record
- `PUT /api/accommodations/{id}` - Update accommodation
- `GET /api/accommodations/mumin/{its_id}` - Get mumin's accommodation

### Waaz Center API
- `GET /api/waaz-centers` - List all waaz centers
- `POST /api/waaz-centers` - Create waaz center
- `GET /api/waaz-centers/{id}/preferences` - Get preferences for a center
- `POST /api/waaz-preferences` - Set mumin's waaz center preference

## Frontend Structure

### Pages

#### Authentication
- `/login` - Staff login
- `/forgot-password` - Password reset

#### Census Management
- `/census` - Dashboard showing census stats
- `/census/mumins` - List all mumins with search/filter
- `/census/mumins/[its_id]` - Mumin details
- `/census/mumins/new` - Add new mumin
- `/census/mumins/[its_id]/edit` - Edit mumin

#### Miqaat Management
- `/miqaats` - List all miqaats
- `/miqaats/[id]` - Miqaat details with stats
- `/miqaats/new` - Create miqaat
- `/miqaats/[id]/edit` - Edit miqaat
- `/miqaats/[id]/events` - Manage miqaat events

#### Registration
- `/registration/[miqaat_id]` - Registration form
- `/registration/[miqaat_id]/bulk` - Bulk registration
- `/registration/status` - Check registration status

#### Scanning System
- `/scan/[miqaat_id]` - QR scanner interface
- `/scan/[miqaat_id]/manual` - Manual entry form
- `/scan/[miqaat_id]/reports` - Scan reports

#### Accommodation
- `/accommodations/[miqaat_id]` - Manage accommodations
- `/accommodations/[miqaat_id]/allocate` - Allocation interface
- `/accommodations/[miqaat_id]/reports` - Accommodation reports

#### Waaz Centers
- `/waaz-centers` - List and manage centers
- `/waaz-centers/preferences/[miqaat_id]` - Manage preferences
- `/waaz-centers/[id]/capacity` - Center capacity management

### Components
- `Navigation` - Main navigation sidebar
- `AuthenticatedLayout` - Layout for authenticated users
- `DataTable` - Reusable data table with sorting/filtering
- `SearchFilters` - Advanced search filters
- `QRScanner` - QR code scanning component
- `MuminCard` - Mumin information card
- `RegistrationForm` - Registration form component

## Development Phases

### Phase 1: Setup & Core (2-3 weeks)
1. Project scaffolding (Laravel and NextJS)
2. Database migrations
3. Authentication system
4. Basic CRUD for mumins and miqaats

### Phase 2: Registration & Scanning (2-3 weeks)
1. Registration system
2. QR code generation
3. Arrival scanning functionality
4. Basic reporting

### Phase 3: Accommodation & Waaz (2-3 weeks)
1. Accommodation management
2. Waaz center management
3. Preference system
4. Advanced reporting

### Phase 4: Polish & Deploy (1-2 weeks)
1. UI/UX refinements
2. Performance optimizations
3. Security audits
4. Deployment and documentation

## Technical Considerations

1. **Authentication**: Laravel Sanctum with SPA authentication
2. **State Management**: React Query for data fetching and caching
3. **UI Framework**: Tailwind CSS with custom components
4. **Form Handling**: React Hook Form with Zod validation
5. **API Layer**: Axios with custom interceptors for authentication
6. **QR Code**: React QR Reader for scanning, QRCode.js for generation
7. **Encryption**: AES-256-CBC for client-side encryption
8. **Data Visualization**: Chart.js for analytics dashboards

## Security Measures

1. **API Authentication**: Token-based with short expiry
2. **Data Encryption**: ITS_ID encrypted on client-side
3. **Input Validation**: Server-side validation on all inputs
4. **CSRF Protection**: Laravel's built-in CSRF protection
5. **Rate Limiting**: API rate limiting to prevent abuse
6. **Role-Based Access**: Different permissions for different user roles
7. **Data Sanitization**: XSS prevention on all user inputs
8. **Audit Logging**: Maintain logs of sensitive operations
