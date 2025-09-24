# FRIDAY API Documentation

## Overview

The FRIDAY API provides secure endpoints for the signup flow and friend network management. Features structured location data via cities lookup, profile management, enhanced circle management, multi-use invitation links, and comprehensive security. All endpoints require API key authentication and include rate limiting for abuse prevention.

## Authentication

All endpoints require an API key passed in the request header:
```
X-API-Key: your-secure-api-key
```

**Alternative authentication methods:**
```
Authorization: Bearer your-secure-api-key
```

Set your API key in Supabase:
```bash
supabase secrets set WEBSITE_API_KEY=your-secure-api-key
```

**Note:** Supabase Edge Functions only allow specific headers. Use `apikey` or `authorization` headers as shown above.

## Rate Limits

- **Signup**: 3 requests per hour per IP
- **Add Friend**: 10 requests per hour per user
- **Generate Invitation**: 10 requests per hour per user
- **Redeem Invitation**: 5 requests per hour per IP
- **Check Email**: 20 requests per hour per IP
- **Invitation Validation**: 30 requests per hour per IP
- **Cities Search**: 20 requests per hour per IP
- **Profile Update**: 10 requests per hour per token
- **Circle Data**: 20 requests per hour per token
- **Relationship Update**: 10 requests per hour per token
- **Invitation Stats**: 20 requests per hour per token

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

**Request (Option 1 - Using city dropdown):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "city_id": 123
}
```

**Request (Option 2 - Manual city input):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "city": "Lubbock",
  "state": "TX"
}
```

**Note:** Provide either `city_id` OR `city + state`, not both.

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
- `CONFLICTING_LOCATION_INPUT`: Both city_id and city+state provided
- `STATE_REQUIRED_WITH_CITY`: City provided without state
- `CITY_REQUIRED_WITH_STATE`: State provided without city
- `RATE_LIMITED`: Too many requests
- `UNAUTHORIZED`: Invalid API key

---

### 3. POST /add-friend

Directly connect with a friend when you know their email.

**Request (Option 1 - Using city dropdown):**
```json
{
  "user_id": "uuid",
  "friend_email": "friend@example.com",
  "friend_name": "Jane Smith",
  "friend_city_id": 456,
  "relationship_type": "friend"
}
```

**Request (Option 2 - Manual city input):**
```json
{
  "user_id": "uuid",
  "friend_email": "friend@example.com",
  "friend_name": "Jane Smith",
  "friend_city": "Boston",
  "friend_state": "MA",
  "relationship_type": "friend"
}
```

**Note:** Location is optional. If provided, use either `friend_city_id` OR `friend_city + friend_state`, not both.

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
  "message": "Invitation not found or expired"
}
```

---

### 6. POST /redeem-invitation

Redeem invitation link to connect with inviter. Works for both new and existing users, supporting multi-use invitation links. Same invitation can be used by multiple people until 30-day expiration.

**Key Features:**
- **Multi-use Links**: Same invitation works for unlimited users
- **Smart User Handling**: Creates new users or connects existing ones
- **Graceful Relationship Management**: Handles duplicate relationships safely
- **Universal Invitation Sharing**: All users get invitation URLs to share with others
- **Contextual Messaging**: Different success messages based on scenario

**Request (Option 1 - Using city dropdown):**
```json
{
  "token": "secure-random-token",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "city_id": 123,
  "relationship_type": "friend"
}
```

**Request (Option 2 - Manual city input):**
```json
{
  "token": "secure-random-token",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "city": "Austin",
  "state": "TX",
  "relationship_type": "friend"
}
```

**Note:** Location is optional for existing users. For new users, if provided, use either `city_id` OR `city + state`, not both.

**Response for New User:**
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

**Response for Existing User (New Relationship):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "location_city": "Boston",
    "location_state": "MA",
    "location_timezone": "America/New_York"
  },
  "relationship": {
    "connected_with": "John Doe",
    "relationship_type": "friend"
  },
  "invitation": {
    "token": "existing-user-token",
    "invitation_url": "https://yourwebsite.com/invite/existing-user-token",
    "expires_at": "2024-01-20T15:30:00Z"
  },
  "message": "Great! You're now connected with John Doe!"
}
```

**Response for Existing User (Existing Relationship):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "location_city": "Boston",
    "location_state": "MA",
    "location_timezone": "America/New_York"
  },
  "relationship": {
    "connected_with": "John Doe",
    "relationship_type": "friend"
  },
  "invitation": {
    "token": "existing-user-token",
    "invitation_url": "https://yourwebsite.com/invite/existing-user-token",
    "expires_at": "2024-01-20T15:30:00Z"
  },
  "message": "You're already connected with John Doe!"
}
```

**Error Codes:**
- `INVALID_TOKEN`: Token invalid, expired, or not found
- `CANNOT_CONNECT_TO_SELF`: Trying to use own invitation
- `MISSING_FIELDS`: Required fields not provided
- `INVALID_EMAIL`: Invalid email format
- `CONFLICTING_LOCATION_INPUT`: Both city_id and city+state provided (new users only)
- `STATE_REQUIRED_WITH_CITY`: City provided without state (new users only)
- `CITY_REQUIRED_WITH_STATE`: State provided without city (new users only)
- `RATE_LIMITED`: Too many requests
- `UNAUTHORIZED`: Invalid API key

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

**Request (Option 1 - Using city dropdown):**
```json
{
  "name": "John Smith",
  "city_id": 456
}
```

**Request (Option 2 - Manual city input):**
```json
{
  "name": "John Smith",
  "city": "Dallas",
  "state": "TX"
}
```

**Note:** All fields are optional. If updating location, use either `city_id` OR `city + state`, not both.

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

### 10. GET /user-profile/{token}/circle

Get user's circle of connections with names and relationship types.

**Authentication**: Token + API key required

**Response:**
```json
{
  "success": true,
  "circle": [
    {
      "id": "user-uuid-1",
      "name": "John Smith",
      "relationship_type": "friend",
      "relationship_id": "rel-uuid-1"
    },
    {
      "id": "user-uuid-2", 
      "name": "Sarah Johnson",
      "relationship_type": "family",
      "relationship_id": "rel-uuid-2"
    },
    {
      "id": "user-uuid-3",
      "name": "Mike Chen", 
      "relationship_type": "colleague",
      "relationship_id": "rel-uuid-3"
    }
  ],
  "message": "Circle data retrieved successfully"
}
```

**Error Codes:**
- `INVALID_OR_EXPIRED_TOKEN`: Token invalid or expired
- `FAILED_TO_GET_CIRCLE`: Database error retrieving circle data
- `UNAUTHORIZED`: Invalid API key

---

### 11. PUT /user-profile/{token}/relationship/{relationship_id}

Update the relationship type for a specific connection in user's circle.

**Authentication**: Token + API key required

**Request:**
```json
{
  "relationship_type": "family"
}
```

**Valid relationship types:**
- `friend`
- `family` 
- `colleague`
- `acquaintance`
- `partner`

**Response:**
```json
{
  "success": true,
  "relationship": {
    "id": "rel-uuid-1",
    "user_a_id": "user-uuid-1",
    "user_b_id": "user-uuid-2", 
    "relationship_type": "family",
    "updated_at": "2024-01-15T12:00:00Z"
  },
  "message": "Relationship type updated successfully"
}
```

**Error Codes:**
- `INVALID_OR_EXPIRED_TOKEN`: Token invalid or expired
- `MISSING_RELATIONSHIP_TYPE`: relationship_type not provided
- `INVALID_RELATIONSHIP_TYPE`: Invalid relationship type
- `FAILED_TO_UPDATE_RELATIONSHIP`: Database error updating relationship
- `RATE_LIMITED`: Too many requests
- `UNAUTHORIZED`: Invalid API key

---

### 12. GET /user-profile/{token}/invitation

Get user's invitation link and usage statistics.

**Authentication**: Token + API key required

**Response:**
```json
{
  "success": true,
  "invitation": {
    "link": "https://yourwebsite.com/invitation/secure-random-token",
    "usage_count": 5
  },
  "message": "Invitation data retrieved successfully"
}
```

**Error Codes:**
- `INVALID_OR_EXPIRED_TOKEN`: Token invalid or expired
- `NO_ACTIVE_INVITATION`: User has no active invitation link
- `FAILED_TO_GET_INVITATION_STATS`: Database error retrieving invitation data
- `UNAUTHORIZED`: Invalid API key

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
- `CONFLICTING_LOCATION_INPUT`: Both city_id and city+state provided
- `STATE_REQUIRED_WITH_CITY`: City provided without state
- `CITY_REQUIRED_WITH_STATE`: State provided without city
- `USER_EXISTS`: Email already registered (signup only)
- `INVALID_TOKEN`: Token invalid, expired, or not found
- `MISSING_SEARCH_TERM`: Search parameter missing
- `SEARCH_TOO_SHORT`: Search term less than 2 characters
- `NO_UPDATES_PROVIDED`: No fields provided for update
- `NAME_TOO_LONG`: Name exceeds maximum length
- `FAILED_TO_GET_CIRCLE`: Database error retrieving circle data
- `MISSING_RELATIONSHIP_TYPE`: relationship_type not provided
- `INVALID_RELATIONSHIP_TYPE`: Invalid relationship type
- `FAILED_TO_UPDATE_RELATIONSHIP`: Database error updating relationship
- `NO_ACTIVE_INVITATION`: User has no active invitation link
- `FAILED_TO_GET_INVITATION_STATS`: Database error retrieving invitation data
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
- `invitations_fe`: Manages invitation tokens with 30-day expiration
- `cities_lookup`: ~300 major US cities with timezone data
- Updated `relationships_fe`: Added `relationship_type`, `source`, and `invited_by` fields for relationship tracking
- Updated `users_fe`: Added structured location fields and profile update tokens

### Key Features
- **Structured Location Data**: `location_city`, `location_state`, `location_timezone`
- **Cities Lookup**: Accurate timezone mapping for all major US cities
- **Profile Update Tokens**: Secure 90-day tokens for email-based updates
- **Invitation System**: 30-day expiration with multi-use invitation links
- **Relationship Types**: Flexible relationship categorization
- **Circle Management**: View and manage user's connections with relationship type updates
- **Invitation Analytics**: Track invitation link usage and statistics

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
   - Enhanced Profile: `GET /user-profile/{token}/circle`, `PUT /user-profile/{token}/relationship/{id}`, `GET /user-profile/{token}/invitation`
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

// 2a. Create user with city dropdown selection
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

// 2b. Alternative: Create user with manual city input
const signupResponseManual = await fetch('https://your-project.supabase.co/functions/v1/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': process.env.FRIDAY_API_KEY
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    city: 'Lubbock',
    state: 'TX'
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

// 4a. Update user profile with city dropdown
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

// 4b. Alternative: Update profile with manual city input
const updateResponseManual = await fetch(`https://your-project.supabase.co/functions/v1/profile/${token}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': process.env.FRIDAY_API_KEY,
    'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
  },
  body: JSON.stringify({
    name: 'John Smith',
    city: 'Dallas',
    state: 'TX'
  })
});

// 5. Enhanced Profile Features - Get user's circle
const circleResponse = await fetch(`https://your-project.supabase.co/functions/v1/user-profile/${token}/circle`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': process.env.FRIDAY_API_KEY
  }
});

const circleResult = await circleResponse.json();

if (circleResult.success) {
  // Display user's connections
  circleResult.circle.forEach(connection => {
    console.log(`${connection.name} - ${connection.relationship_type}`);
  });
}

// 6. Update relationship type
const updateRelationshipResponse = await fetch(`https://your-project.supabase.co/functions/v1/user-profile/${token}/relationship/${relationshipId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': process.env.FRIDAY_API_KEY
  },
  body: JSON.stringify({
    relationship_type: 'family'
  })
});

// 7. Get invitation stats
const invitationStatsResponse = await fetch(`https://your-project.supabase.co/functions/v1/user-profile/${token}/invitation`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': process.env.FRIDAY_API_KEY
  }
});

const invitationStats = await invitationStatsResponse.json();

if (invitationStats.success) {
  console.log('Your invitation link:', invitationStats.invitation.link);
  console.log('People who joined using your link:', invitationStats.invitation.usage_count);
}
```

---

This API provides a complete foundation for the FRIDAY platform with structured location data, comprehensive user management, secure profile updates, enhanced circle management, and robust social networking features. All endpoints include proper security, rate limiting, and error handling for production use.
