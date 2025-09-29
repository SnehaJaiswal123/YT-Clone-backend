# 🚀 Video Sharing Platform Backend (YouTube Clone)

This repository contains the backend implementation for a modern video-sharing platform, inspired by YouTube. It's built using **Node.js** with **Express** and handles user authentication, video management, subscriptions, playlists, and social interactions like likes and comments.

## 🛠️ Tech Stack

* **Runtime Environment:** Node.js
* **Web Framework:** Express.js
* **Database:** *MongoDB*
* **Other Libraries:** `cookie-parser mongoose bcrypt multer`

## ⚙️ Setup and Installation

Follow these steps to get the project up and running on your local machine.

### Prerequisites

* Node.js (v18+)
* npm (or yarn)

### Steps

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <your-repo-name>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and add your configuration details (e.g., database URI, JWT secret, Cloudinary credentials for video/file storage).

    ```env
    PORT=8000
    MONGODB_URI=<Your MongoDB Connection String>
    ACCESS_TOKEN_SECRET=<Your Secret>
    REFRESH_TOKEN_SECRET=<Your Other Secret>
    # ... other relevant variables
    ```

4.  **Run the application:**
    ```bash
    npm start
    # or use a tool like nodemon for development:
    npm run dev
    ```

## 🗺️ API Endpoints

The application routes are structured under the base path `/api/` and are defined in `app.js` as follows:

| Feature | Base Path | Router File | Description |
| :--- | :--- | :--- | :--- |
| **User Management** | `/api/users` | `user.routes.js` | Register, Login, Logout, User Profile, etc. |
| **Video Operations** | `/api/videos` | `video.routes.js` | Upload, Get, Update, Delete videos. |
| **Subscriptions** | `/api/subscriptions` | `subscription.routes.js` | Subscribe/Unsubscribe to a channel. |
| **Playlists** | `/api/playlist` | `playlist.routes.js` | Create, manage, and view playlists. |
| **Likes** | `/api/like` | `likes.routes.js` | Like/Dislike videos or comments. |
| **Comments** | `/api/comment` | `comment.routes.js` | Add, edit, and delete comments on videos. |

### Example API Usage

* **Register User:** `POST /api/users/register`
* **Upload Video:** `POST /api/videos/upload`
* **Toggle Subscription:** `POST /api/subscriptions/c/:channelId`
