# Privacy Policy

**Last Updated: September 11, 2026**

## Introduction

Veritas Bank is a demonstration banking platform. This Privacy Policy explains how we collect, use, store, and protect your information.

## What This Policy Covers

This policy applies to all users of the Veritas Bank platform - both regular users and administrators.

## Information We Collect

### 1. Account Information
When you register, we collect:
- **First Name** and **Last Name**
- **Email Address** (used for login)
- **Phone Number** (optional)
- **Password** (hashed with bcrypt before storage)

### 2. Account Details
We automatically generate and store:
- **Unique Account Number**: 12-digit number starting with 2025
- **Account Balance**: Your current balance (starts at $0)
- **Currency Preference**: Default is USD
- **Account Status**: ACTIVE, SUSPENDED, or CLOSED
- **Role**: USER or ADMIN

### 3. Transaction Data
Every transaction creates a permanent record including:
- Transaction type (credit, debit, transfer, withdrawal, deposit)
- Amount and currency
- Description and category
- Previous balance and resulting balance
- Unique transaction reference number
- Timestamp (when it occurred)
- Status (completed, pending, failed)

### 4. Usage Information
We track:
- **Login Times**: When you last logged in
- **Support Requests**: Subject, message, status, timestamps
- **Savings Goals**: Goal names, target amounts, deadlines, progress
- **Session Data**: JWT tokens for authentication (expires after 7 days)

### 5. Security and Audit Data
For security and administrative oversight, we log:
- **IP Address**: When you log in or perform actions
- **Browser Information**: User agent string
- **Admin Actions**: Every action performed by administrators, including:
  - What was changed (old value → new value)
  - Who made the change
  - When it was made
  - Why it was made (reason field)

## How We Store Your Data

### Database
- We use SQLite database stored on our server
- Data is organized in separate tables (users, accounts, transactions, etc.)
- Each record has a unique UUID identifier

### Password Security
- We NEVER store your actual password
- Passwords are hashed using bcrypt with salt rounds
- Even administrators cannot see your password
- Password hashes are one-way (cannot be reversed)

### Session Management
- Login creates a JWT token valid for 7 days
- Token stored in your browser's LocalStorage
- Token expires automatically for security
- No password saved in browser

## How We Use Your Information

### Account Management
- Create and maintain your account
- Generate your unique account number
- Track your balance and transactions

### Platform Features
- Process your transactions (deposits, withdrawals, transfers)
- Display transaction history
- Manage savings goals
- Handle support requests
- Send account notifications

### Security
- Authenticate your login sessions
- Detect unusual activity
- Audit administrative actions
- Maintain platform integrity

### Demonstration Purposes
As a demo platform, your data helps demonstrate:
- Banking features
- Transaction processing
- Account management
- Administrative controls

## Who Can Access Your Data

### You
You can access:
- Your account details
- Your complete transaction history
- Your savings goals
- Your support requests
- Your profile information

### Administrators
Admins can:
- View your account details and balance
- See your transaction history
- Adjust your balance (with reason logging)
- Apply or remove account restrictions
- View all audit logs
- Manage support requests

### What Admins CANNOT See
- Your actual password (only the hash)
- Your session tokens

## Your Rights

### Access
- View all your data through the platform
- See your complete transaction history
- Check your account status and restrictions

### Modification
- Update your profile (name, phone, email)
- Change your password
- Modify currency preference

### Restrictions
You CANNOT:
- Delete transaction history (permanent for integrity)
- Change your account number
- Modify past transactions

### Deletion
- Contact support to request account deletion
- Some data may be retained for audit purposes

## Data Sharing

### We Do NOT:
- Sell your data to third parties
- Share data with advertisers
- Send marketing emails
- Share data with external services

### We DO Share Data With:
- Administrators (for platform management)
- Support staff (when you request help)
- Audit logs (for transparency and security)

## Data Retention

### Active Accounts
Data is retained as long as your account is active.

### Transactions
Transaction history is permanent and cannot be deleted to maintain audit integrity.

### Audit Logs
Administrative actions are logged permanently for accountability.

### Deleted Accounts
After account deletion:
- Personal information may be anonymized
- Transaction history retained for audit purposes
- Audit logs preserved

## Security Measures

### Technical Protections
- **Password Hashing**: bcrypt with automatic salting
- **Session Tokens**: JWT with 7-day expiration
- **Authentication**: Token-based with automatic logout
- **Database Security**: Stored on secure server

### Access Controls
- Authentication required for all protected routes
- Role-based access (USER vs ADMIN)
- Admin-only endpoints for sensitive operations
- Automatic token validation on each request

### Monitoring
- Audit logs for all administrative actions
- IP address tracking for security
- User agent logging for suspicious activity detection

## Cookies and LocalStorage

### LocalStorage
We store in your browser's LocalStorage:
- **JWT Token**: For maintaining your login session
- **User Data**: Basic account information for quick access

### No Cookies
This platform does not use cookies.

### Third-Party
No third-party tracking or analytics.

## Children's Privacy

This platform is a demonstration tool and is not intended for children under 13. We do not knowingly collect data from children.

## Changes to This Policy

We may update this Privacy Policy at any time. Continued use of the platform after changes means you accept the updated policy.

## Data Breach Protocol

In the event of a data breach:
- We will investigate immediately
- Affected users will be notified
- Appropriate measures will be taken to secure the platform

## Your Responsibilities

### Protect Your Credentials
- Keep your password secure
- Don't share your account
- Log out on shared computers

### Accurate Information
- Provide truthful information
- Update your profile when details change

## Technical Details

### Data Format
- User IDs: UUID format
- Account Numbers: 12-digit numeric starting with 2025
- Transaction References: TXN-{timestamp}-{random}
- Timestamps: ISO 8601 format with timezone

### API Security
- Bearer token authentication
- CORS protection
- Request validation
- Error handling without data exposure

## Transparency

### What You Should Know
- All transactions create permanent records
- Administrators can see your account details
- Every admin action is logged and auditable
- Your password is never visible to anyone (including admins)
- Transaction history cannot be deleted or modified

### Audit Trail
Every administrative action includes:
- Admin username
- Action performed
- Old and new values
- Reason provided
- Timestamp and IP address

## Demo Platform Disclaimer

**IMPORTANT**: This is a demonstration banking platform. 

### Not Real Banking
- No actual money is involved
- Transactions are simulated
- Not connected to real financial institutions
- Not subject to banking regulations

### Data Usage
Your data is used solely for demonstrating banking platform features.

## Contact Us

### Questions About Privacy
Submit a support request through the platform.

### Data Access Requests
Contact support to:
- Request your data
- Update your information
- Delete your account

---

**By using Veritas Bank, you acknowledge that you have read and understood this Privacy Policy and agree to our data practices as described.**
