

# 📁 Drive Clone

A Google Drive–style file storage application built with **Node.js**, **Express**, **Prisma**, and **PostgreSQL**.  
Users can securely upload files, organize them into folders, and share folders via public, expiring links.

This project was built as part of **The Odin Project** curriculum, with extra features and UX improvements added.

---

## 🚀 Live Demo

👉 **Live App:** _(coming soon – Railway deployment)_  
`https://your-app-name.up.railway.app`

---

## ✨ Features

### 🔐 Authentication
- User registration and login with **Passport.js**
- Session-based authentication stored in the database using **Prisma Session Store**
- Flash messages for login errors, success messages, and user actions

### 📂 File & Folder Management
- Upload files using **Multer**
- Organize files into folders
- View file details (name, size, type, upload date)
- Download uploaded files
- View files not assigned to any folder directly on the home page

### ☁️ Cloud Storage
- Files uploaded to **Cloudinary**
- Secure file URLs stored in the database

### 🔗 Folder Sharing (Extra Credit)
- Generate public share links for folders
- Set expiration duration (1 day, 7 days, 30 days)
- Anyone with the link can view and download files
- Expired links automatically become inaccessible

### 🎨 User Experience Improvements
- Global navigation bar for easy navigation
- Flash messages for:
  - Invalid login credentials
  - Account creation
  - File uploads
  - Folder creation/deletion
  - Share link generation
- Copy-to-clipboard button for shared folder links
- Styled with **Tailwind CSS**

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express
- **Authentication:** Passport.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **File Uploads:** Multer
- **Cloud Storage:** Cloudinary
- **Templating:** EJS
- **Styling:** Tailwind CSS
- **Sessions:** express-session + Prisma Session Store
- **Deployment:** Railway (planned)

---

## 📐 Architecture

The project follows an **MVC (Model–View–Controller)** pattern:

```
src/
├── controllers/
├── routers/
├── views/
│   ├── partials/
│   ├── folders/
│   ├── files/
│   └── share/
├── config/
├── middlewares/
└── app.js
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory with:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/driveCloneDB

SESSION_SECRET=your_session_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🧪 Running Locally

```bash
# install dependencies
npm install

# run database migrations
npx prisma migrate dev

# generate prisma client
npx prisma generate

# start development server
npm run dev
```

App runs at:

```
http://localhost:3000
```

---

## 📌 What I Learned

- Implementing secure authentication with Passport and sessions
- Managing relational data with Prisma
- Handling file uploads and cloud storage
- Designing user-friendly flows with flash messages and navigation
- Structuring a full-stack app using MVC
- Building shareable, expiring public links securely

---

## 📄 License

This project is for educational purposes as part of **The Odin Project**.

---

## 🙌 Acknowledgements

- [The Odin Project](https://www.theodinproject.com/)
- Prisma Documentation
- Cloudinary Documentation