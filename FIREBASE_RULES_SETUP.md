# Firebase Security Rules Setup

## Quick Setup for Migration

To allow the migration script to write data to Firebase, you need to temporarily allow writes.

### Step 1: Go to Firebase Console

Open this URL in your browser:
https://console.firebase.google.com/project/dota-builder/firestore/rules

### Step 2: Replace the rules with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if true;  // TEMPORARY - for migration only
    }
  }
}
```

### Step 3: Click "Publish"

### Step 4: Run the migration

```bash
npm run migrate
```

### Step 5: Secure your database (IMPORTANT!)

After migration is complete, update the rules to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if false;  // Deny all writes
    }
  }
}
```

Or if you want authenticated users to write:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;  // Only authenticated users
    }
  }
}
```

## Alternative: Use Firebase CLI

If you prefer command line:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (if not already done)
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

Then edit `firestore.rules` file in your project root.
