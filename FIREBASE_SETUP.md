# Firebase Setup Guide

## 🎯 Quick Start

### Option 1: Use Local JSON (Default)
No setup needed! The app works with local JSON files by default.

### Option 2: Use Firebase

#### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Follow the setup wizard
4. Enable Firestore Database

#### Step 2: Get Firebase Config
1. In Firebase Console, go to Project Settings (⚙️ icon)
2. Scroll to "Your apps" section
3. Click the web icon (`</>`) to add a web app
4. Copy the config object

#### Step 3: Configure Environment
```bash
# Copy the example env file
cp .env.example .env

# Edit .env and set:
VITE_USE_FIREBASE=true
# Add your Firebase credentials
```

#### Step 4: Run Migration
```bash
npm run migrate
```

#### Step 5: Start App
```bash
npm run dev
```

## 🔄 Switching Between Data Sources

### Use Local JSON
```bash
# In .env
VITE_USE_FIREBASE=false
```

### Use Firebase
```bash
# In .env
VITE_USE_FIREBASE=true
```

Restart the dev server after changing.

## 📊 Database Structure

### Firestore Collections

```
/heroes/{heroSlug}
  - name, primaryAttr, roles, abilities, stats, etc.

/hero_counters/{heroSlug}
  - strongAgainst: [heroSlug1, heroSlug2, ...]
  - weakAgainst: [heroSlug1, heroSlug2, ...]

/items/{itemSlug}
  - name, cost, category, attributes, etc.
  - countersHeroes: [heroSlug1, heroSlug2, ...]

/metadata/item_categories
  - Category definitions
```

## 🔐 Security Rules

For development, use these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if false; // Only allow writes via migration script
    }
  }
}
```

For production with user contributions:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null; // Requires authentication
    }
  }
}
```

## 🚀 Benefits of Firebase

1. **Real-time Updates**: Changes sync across all users instantly
2. **Scalability**: Handles millions of users
3. **User Data**: Store user preferences, builds, guides
4. **Authentication**: Add login with Google, GitHub, etc.
5. **Offline Support**: Works offline with local cache
6. **Analytics**: Track usage patterns
7. **Hosting**: Deploy with `firebase deploy`

## 📈 Future Enhancements

With Firebase, you can add:

- **User Accounts**: Save favorite heroes, builds
- **Community Builds**: Share item/skill builds
- **Match History**: Track your games
- **Hero Guides**: User-generated content
- **Comments & Ratings**: Community feedback
- **Real-time Matchmaking**: Find teammates
- **Leaderboards**: Rank players

## 💡 Tips

- Keep local JSON as backup
- Test migrations on a separate Firebase project first
- Use Firebase Emulator Suite for local development
- Monitor Firebase usage in the console
- Set up billing alerts to avoid surprises

## 🐛 Common Issues

### "Module not found" error
```bash
npm install
```

### Migration fails
- Check Firebase config
- Verify Firestore is enabled
- Check security rules allow writes

### Data not showing
- Check console for errors
- Verify `VITE_USE_FIREBASE` is set correctly
- Restart dev server after env changes
