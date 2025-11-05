# How to Clear MongoDB Atlas Database

1. Go to MongoDB Atlas: https://cloud.mongodb.com/
2. Login with your account (vyash1053)
3. Navigate to your cluster (Cluster0)
4. Click **"Browse Collections"**
5. Find the **"users"** collection under the **"ama_app"** database
6. Click the **trash icon** to delete all documents
7. Or click on each user and delete individually

Then restart your dev server and sign up with a new user.

## Alternative: Use MongoDB CLI

```
mongosh "mongodb+srv://vyash1053:vyash1053@cluster0.jfia8.mongodb.net/ama_app" --eval "db.users.deleteMany({})"
```

## Quick Fix for Now:
Just sign out, clear your browser cookies, and **sign up with a completely NEW email address and username**. The app will create a fresh user with proper MongoDB ObjectId.
