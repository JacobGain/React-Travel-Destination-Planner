# Europe Destination Planner

Europe Destination Planner is a full-stack web application designed to help users plan and explore their dream destinations across Europe. Users can search for destinations, manage favorite lists, and get detailed information about each destination.

## Features

- **Search Destinations**: Users can search destinations by country, region, or name.
- **Destination Details**: Detailed information about destinations such as region, category, latitude, longitude, and famous foods.
- **Manage Favorite Lists**:
  - Create, edit, and delete favorite destination lists.
  - Add multiple destinations to a list.
  - Manage list visibility (public or private).
- **Public and Private Lists**: 
  - View public lists shared by other users.
  - Manage private lists accessible only by the user.
- **Guest Mode**: Explore the app as a guest with limited functionality.
- **Authentication**: Users can create an account, log in, and log out securely.

## Table of Contents

- [Installation](#installation)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [License](#license)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/europe-destination-planner.git
    cd europe-destination-planner
    ```

2. Install server dependencies:

    ```bash
    cd server
    npm install
    ```

3. Install client dependencies:

    ```bash
    cd ../client
    npm install
    ```

4. Set up the Firebase configuration in `firebase.js`:

    ```javascript
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };

    export const auth = initializeApp(firebaseConfig);
    ```

5. Set up environment variables for the backend API in the `server/.env` file:

    ```bash
    PORT=5000
    JWT_SECRET=your_jwt_secret_key
    ```

6. Start the backend server:

    ```bash
    cd ../server
    npm start
    ```

7. Start the frontend client:

    ```bash
    cd ../client
    npm start
    ```

8. Open the app in your browser at `http://localhost:3000`.

## Technologies Used

- **Frontend**: React.js, CSS
- **Backend**: Node.js, Express.js
- **Database**: File-based secure storage system
- **Authentication**: Firebase Authentication
- **Deployment**: AWS EC2

## Project Structure

```
europe-destination-planner/
│
├── client/                   # React frontend
│   ├── public/
│   ├── src/
│   │   ├── utils/            # Utility functions and components
│   │   ├── App.js            # Main React component
│   │   ├── index.js          # React DOM entry point
│   │   └── firebase.js       # Firebase configuration
│   └── package.json          # Client dependencies and scripts
│
├── server/                   # Express backend
│   ├── routes/               # API routes
│   ├── controllers/          # Controllers for business logic
│   ├── models/               # Database models (if using MongoDB)
│   ├── server.js             # Main server entry point
│   └── package.json          # Server dependencies and scripts
│
├── README.md                 # Project documentation
└── .gitignore                # Files and directories to ignore in Git
```

## API Endpoints

### Public Endpoints

- **GET `/api/open/destinations/:id`**: Fetch detailed information about a destination by ID.
- **GET `/api/open/destinations/search/:field/:pattern/:limit`**: Search destinations by a specific field (country, region, or name).
- **POST `/api/open/JWTlogin`**: Handle JWT login for authenticated users.

### Secure Endpoints (Require JWT)

- **GET `/api/secure/lists/getlists/:email`**: Retrieve all lists for a specific user.
- **POST `/api/secure/lists/newlist/:listname`**: Create a new list.
- **PUT `/api/secure/lists/editlist/:listname`**: Edit an existing list.
- **DELETE `/api/secure/lists/delete/:listname`**: Delete a list.

## Usage

### 1. Home Page

- Create an account, log in, or continue as a guest to explore the app.

### 2. Main Page

- Search destinations by country, region, or destination name.
- View detailed information about each destination.
- Manage favorite lists (if logged in).

### 3. Private Lists

- View and manage your private lists.
- Add or remove destinations and update list details.

### 4. Public Lists

- View public lists shared by other users.

### 5. Edit List

- Edit the details of a specific list, including its name, description, visibility, and destinations.

### 6. Legal Policies

- Security, privacy, acceptable use, and DMCA policies are available under the `/legal` route.

---
