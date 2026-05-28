# ChitChat 💬

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge&logo=mongodb)
![Socket.io](https://img.shields.io/badge/Socket.io-Real--Time-black?style=for-the-badge&logo=socket.io)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

A full-stack, real-time messaging application designed for seamless user communication. ChitChat features instant messaging, media sharing, live typing indicators, and a responsive modern UI with a built-in Dark Mode.

## ✨ Features

* **Real-Time Communication:** Instant message delivery and online status tracking powered by Socket.io.
* **Rich Media Sharing:** Secure image uploading and rendering via Cloudinary integration.
* **Interactive Chat UX:** Includes real-time typing indicators, emoji picker integration, and smooth auto-scrolling.
* **Message Management:** Edit and delete sent messages with real-time UI updates for all participants.
* **Authentication & Security:** Secure user signup and login using JWT (JSON Web Tokens) in HTTP-only cookies and bcrypt password hashing.
* **Dynamic Theming:** User-toggled Dark/Light mode that persists across sessions.
* **Global Search:** Easily find and connect with other users on the platform.

## 🛠️ Tech Stack

**Client:**
* React (Vite)
* Redux Toolkit (State Management)
* Tailwind CSS (Styling)
* Socket.io-client
* Emoji-picker-react

**Server:**
* Node.js & Express.js
* MongoDB & Mongoose
* Socket.io (WebSockets)
* JSON Web Tokens (JWT) & Bcryptjs
* Cloudinary & Multer (Image Processing)

## 🏗️ System Architecture & Flow

The following diagram illustrates the data flow and real-time event architecture of the application.

```mermaid
sequenceDiagram
    participant Client (React)
    participant Server (Express)
    participant Socket.IO
    participant Database (MongoDB)
    participant Cloudinary

    %% Authentication Flow
    Client->>Server: POST /api/auth/login (Credentials)
    Server->>Database: Verify User & Password
    Database-->>Server: User Data
    Server-->>Client: Set HTTP-Only JWT Cookie & Return User

    %% Socket Connection
    Client->>Socket.IO: Connect with User ID
    Socket.IO-->>Client: Broadcast Online Status

    %% Messaging Flow
    Client->>Server: POST /api/message/send (Text/Image)
    alt Has Image
        Server->>Cloudinary: Upload Image stream
        Cloudinary-->>Server: Return Secure URL
    end
    Server->>Database: Save Message & Update Conversation
    Database-->>Server: Saved Data
    Server->>Socket.IO: Emit 'newMessage' event to Receiver
    Socket.IO-->>Client: Update UI instantly
