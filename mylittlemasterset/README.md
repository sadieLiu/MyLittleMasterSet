# My Little Master Set

**Name:** Sadonna Liu

This is a website for browsing MLP KAYOU cards and adding favorites to a list. Search the
catalog by set, character, or rarity and share a favorites list with others with a link or QR code. This is great for curating cards that you want to collect and add to your collection in real life.

## Features

* Email/password and Google sign-in
* Card search with filters
* Curating a favorites list and sharing of the list with QR or URL
* Recharts chart that display top favorited cards and characters based on user activity
* Responsive design that adjusts to the screen of the user

## Built With
* [React](https://react.dev/)
* [Vite](https://vite.dev/)
* [React Router](https://reactrouter.com/)
* [Firebase](https://firebase.google.com/)
* [Recharts](https://recharts.org/)
* [TinyURL API](https://tinyurl.com/app/dev) 
* [QR Server API](https://goqr.me/api/)

## Additional Files for Design
In this build, I used custom fonts and icons from the following:
* Hatolie Font (https://www.dafont.com/hatolie.font)
* typewcond Font (https://www.dafont.com/typewriter-condensed.font)
* sparkles icon (https://www.flaticon.com/free-icons/star)

## How to deploy

### 1. Clone and install

use these
```
git clone <your-repo-url>
cd mylittlemasterset
npm install
```

### 2. Set up Firebase

This project needs its own Firebase project (Authentication, Firestore, and Storage). 
`src/firebase.js` holds the connection config which you will have to add to.

1. Copy the template: `src/firebase.template.js` to write `src/firebase.js`
2. In the [Firebase console](https://console.firebase.google.com/), create a project (or
   use an existing one), copy config valuese into `src/firebase.js`.
3. Enable Authentication (Email/Password, and Google sign-in), Firestore Database, and Storage for the
   project.

### 3. Firestore data model

The build uses a a cards collection in firestore containing:
characters in an array, r
arity as a string, 
setId as a string, 
filePath as a string (this is used to link to an image in Firebase Storage), 
and favoritesCounter as an int.

Example JSON format:

"cards": {
    "MLPME01-R-001L1": {
      "characters": [
        "Princess Twilight Sparkle"
      ],
      "rarity": "R",
      "setId": "MLPME01",
      "setName": "Moon Edition 1 NA",
      "filePath": "cards/MLPME01-R-001L1.png",
      "favoritesCounter": 0
    }
  }

It also contains a characters collection with a field of:
favoritesCounter as an int.

You will need to add images and card information yourself into Firebase

### 4. Runing locally

Use this to run locally:

```
npm run dev
```
This will run the build locally.

### 5. Build and deploy (optional)

If you want to host this, you will need to have Firebase CLI (npm install -g firebase-tools)
and init hosting (firebase init hosting)
then run the following commands:

```
npm run build
firebase deploy --only hosting
```


## References

This is the script I used to upload a json to Firebase:
 [Stack Overflow — importing CSV/JSON to Firestore](https://stackoverflow.com/questions/46640981/how-to-import-csv-or-json-to-firebase-cloud-firestore)
