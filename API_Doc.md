# FRIDAY API Documentation

## Overview

The FRIDAY API provides secure endpoints for the signup flow and friend network management. Features structured location data via cities lookup, profile management, and comprehensive security. All endpoints require API key authentication and include rate limiting for abuse prevention.

## Authentication

All endpoints require an API key passed in the request header:
```
X-API-Key: your-secure-api-key
```

Set your API key in Supabase:
```bash
supabase secrets set WEBSITE_API_KEY=your-secure-api-key
```

## Rate Limits

- **Signup**: 3 requests per hour per IP
- **Add Friend**: 10 requests per hour per user
- **Generate Invitation**: 10 requests per hour per user
- **Redeem Invitation**: 5 requests per hour per IP
- **Check Email**: 20 requests per hour per IP
- **Invitation Validation**: 30 requests per hour per IP
- **Cities Search**: 20 requests per hour per IP
- **Profile Update**: 10 requests per hour per token

## API Endpoints

### 1. GET /cities

Search for cities to get structured location data with accurate timezones.

**Parameters:**
- `search` (required): Search term (minimum 2 characters)

**Request:**
```
GET /cities?search=austin
```

**Response:**
```json
{
  "success": true,
  "cities": [
    {
      "id": 123,
      "city": "Austin",
      "state": "TX",
      "timezone": "America/Chicago",
      "display": "Austin, TX"
    },
    {
      "id": 456,
      "city": "Austin",
      "state": "MN", 
      "timezone": "America/Chicago",
      "display": "Austin, MN"
    }
  ],
  "message": "Found 2 cities matching \"austin\""
}
```

**Error Codes:**
- `MISSING_SEARCH_TERM`: Search parameter missing
- `SEARCH_TOO_SHORT`: Search term less than 2 characters
- `RATE_LIMITED`: Too many requests
- `UNAUTHORIZED`: Invalid API key

---

### 2. POST /signup

Creates a new user with structured location data and generates their invitation link.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "city_id": 123
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "location_city": "Austin",
    "location_state": "TX",
    "location_timezone": "America/Chicago"
  },
  "invitation": {
    "token": "secure-random-token",
    "invitation_url": "https://yourwebsite.com/invite/secure-random-token",
    "expires_at": "2024-01-20T15:30:00Z"
  },
  "profile_update_url": "https://yourwebsite.com/profile/update-token",
  "message": "Account created! Share your invitation link to connect with friends"
}
```

**Error Codes:**
- `USER_EXISTS`: Email already registered
- `MISSING_FIELDS`: Name or email missing
- `INVALID_EMAIL`: Invalid email format
- `INVALID_CITY_ID`: Invalid or non-existent city_id
- `RATE_LIMITED`: Too many requests
- `UNAUTHORIZED`: Invalid API key

---

### 3. POST /add-friend

Directly connect with a friend when you know their email.

**Request:**
```json
{
  "user_id": "uuid",
  "friend_email": "friend@example.com",
  "friend_name": "Jane Smith",
  "friend_city_id": 456,
  "relationship_type": "friend"
}
```

**Response:**
```json
{
  "success": true,
  "friend_exists": true,
  "relationship_created": true,
  "friend": {
    "id": "uuid",
    "name": "Jane Smith",
    "email": "friend@example.com",
    "location_city": "Boston",
    "location_state": "MA",
    "location_timezone": "America/New_York"
  },
  "message": "Connected with Jane Smith!"
}
```

---

### 4. POST /generate-invitation

Creates an invitation token and optionally sends email.

**Request:**
```json
{
  "inviter_id": "uuid",
  "relationship_type": "friend",
  "email": "optional@example.com",
  "custom_message": "Let's plan some fun activities!"
}
```

**Response:**
```json
{
  "success": true,
  "invitation_id": "uuid",
  "token": "secure-random-token",
  "invitation_url": "https://yourwebsite.com/invite/secure-random-token",
  "expires_at": "2024-01-20T15:30:00Z",
  "email_sent": true
}
```

---

### 5. GET /invitation/{token}

Validates token and returns invitation context for signup page.

**Response:**
```json
{
  "success": true,
  "valid": true,
  "invitation": {
    "inviter_name": "John Doe",
    "inviter_city": "Austin",
    "relationship_type": "friend",
    "expires_at": "2024-01-20T15:30:00Z"
  }
}
```

**Invalid Token:**
```json
{
  "success": true,
  "valid": false,
  "message": "Invitation not found, expired, or already used"
}
```

---

### 6. POST /redeem-invitation

Complete signup through invitation (creates user + relationship).

**Request:**
```json
{
  "token": "secure-random-token",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "city_id": 123,
  "relationship_type": "friend"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "location_city": "Austin",
    "location_state": "TX",
    "location_timezone": "America/Chicago"
  },
  "relationship": {
    "connected_with": "John Doe",
    "relationship_type": "friend"
  },
  "invitation": {
    "token": "new-secure-token",
    "invitation_url": "https://yourwebsite.com/invite/new-secure-token",
    "expires_at": "2024-01-25T15:30:00Z"
  },
  "profile_update_url": "https://yourwebsite.com/profile/update-token",
  "message": "Welcome! You're connected with John Doe. Share your link to add more friends!"
}
```

---

### 7. GET /check-email/{email}

Check if email already exists (for frontend validation).

**Response:**
```json
{
  "exists": true,
  "message": "This email is already registered on Friday"
}
```

---

### 8. GET /profile/{token}

Get user profile data for email-based profile updates.

**Authentication**: Token + API key + Supabase anon key required

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com", 
    "location_city": "Austin",
    "location_state": "TX",
    "location_timezone": "America/Chicago",
    "profile_updated_at": "2024-01-15T10:30:00Z"
  },
  "message": "Profile data retrieved successfully"
}
```

---

### 9. PUT /profile/{token}

Update user profile via email token. Only name and location updates are allowed.

**Authentication**: Token + API key + Supabase anon key required

**Request:**
```json
{
  "name": "John Smith",
  "city_id": 456
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "name": "John Smith",
    "email": "john@example.com",
    "location_city": "Dallas",
    "location_state": "TX",
    "location_timezone": "America/Chicago",
    "profile_updated_at": "2024-01-15T11:00:00Z"
  },
  "message": "Profile updated successfully"
}
```

---

## Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human readable error message"
}
```

### Common Error Codes

- `UNAUTHORIZED`: Invalid or missing API key
- `RATE_LIMITED`: Too many requests
- `MISSING_FIELDS`: Required fields not provided
- `INVALID_EMAIL`: Email format validation failed
- `INVALID_CITY_ID`: Invalid or non-existent city_id
- `USER_EXISTS`: Email already registered
- `INVALID_TOKEN`: Token invalid, expired, or used
- `MISSING_SEARCH_TERM`: Search parameter missing
- `SEARCH_TOO_SHORT`: Search term less than 2 characters
- `NO_UPDATES_PROVIDED`: No fields provided for update
- `NAME_TOO_LONG`: Name exceeds maximum length
- `INTERNAL_ERROR`: Server error

### Rate Limit Headers

When rate limited, responses include:
- Status: `429 Too Many Requests`
- Header: `X-RateLimit-Reset` (timestamp when limit resets)

---

## Security Features

### API Key Authentication
- All endpoints require valid API key
- Keys are validated against environment variables
- Invalid keys return 401 Unauthorized

### Rate Limiting
- Per-endpoint limits based on use case
- IP-based limiting for signup and redemption
- User-based limiting for friend management
- Automatic cleanup of expired limit entries

### Input Validation
- Email format validation
- Required field checking
- Token format validation (64-char hex)
- Duplicate prevention (users, relationships)

### CORS Support
- Configurable origin restrictions
- Proper preflight handling
- Standard headers for web integration

---

## Database Schema

### New Tables Added
- `invitations_fe`: Manages invitation tokens with 5-day expiration
- `cities_lookup`: ~300 major US cities with timezone data
- Updated `relationships_fe`: Added `relationship_type` field
- Updated `users_fe`: Added structured location fields and profile update tokens

### Key Features
- **Structured Location Data**: `location_city`, `location_state`, `location_timezone`
- **Cities Lookup**: Accurate timezone mapping for all major US cities
- **Profile Update Tokens**: Secure 90-day tokens for email-based updates
- **Invitation System**: 5-day expiration with automatic token generation
- **Relationship Types**: Flexible relationship categorization

---

## Deployment

1. **Deploy functions:**
   ```bash
   chmod +x deploy_functions.sh
   ./deploy_functions.sh
   ```

2. **Set environment variables:**
   ```bash
   supabase secrets set WEBSITE_API_KEY=your-secure-key
   supabase secrets set WEBSITE_BASE_URL=https://your-website.com
   supabase secrets set SENDGRID_API_KEY=your-sendgrid-key
   ```

3. **Available endpoints:**
   - Cities Search: `GET /cities?search=term`
   - User Management: `POST /signup`, `POST /add-friend`
   - Invitations: `POST /generate-invitation`, `GET /invitation/{token}`, `POST /redeem-invitation`
   - Profile: `GET /profile/{token}`, `PUT /profile/{token}`
   - Utilities: `GET /check-email/{email}`

---

## Integration Example

```javascript
// Complete signup flow with cities lookup

// 1. Search for cities
const citiesResponse = await fetch('https://your-project.supabase.co/functions/v1/cities?search=austin', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': process.env.FRIDAY_API_KEY
  }
});

const citiesResult = await citiesResponse.json();
const selectedCity = citiesResult.cities[0]; // User selects Austin, TX

// 2. Create user with structured location data
const signupResponse = await fetch('https://your-project.supabase.co/functions/v1/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': process.env.FRIDAY_API_KEY
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    city_id: selectedCity.id // 123
  })
});

const signupResult = await signupResponse.json();

if (signupResult.success) {
  // User created with structured location data
  console.log('User location:', {
    city: signupResult.user.location_city,     // "Austin"
    state: signupResult.user.location_state,   // "TX"
    timezone: signupResult.user.location_timezone // "America/Chicago"
  });
  
  // Share invitation link
  console.log('Invitation URL:', signupResult.invitation.invitation_url);
  
  // Profile update link for user
  console.log('Profile URL:', signupResult.profile_update_url);
} else {
  // Handle error
  console.error('Signup failed:', signupResult.error);
}

// 3. Access user profile (requires both API key and Supabase anon key)
const profileResponse = await fetch(`https://your-project.supabase.co/functions/v1/profile/${token}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': process.env.FRIDAY_API_KEY,
    'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
  }
});

// 4. Update user profile
const updateResponse = await fetch(`https://your-project.supabase.co/functions/v1/profile/${token}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': process.env.FRIDAY_API_KEY,
    'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
  },
  body: JSON.stringify({
    name: 'John Smith',
    city_id: 456
  })
});
```

---

This API provides a complete foundation for the FRIDAY platform with structured location data, comprehensive user management, secure profile updates, and robust social networking features. All endpoints include proper security, rate limiting, and error handling for production use.
