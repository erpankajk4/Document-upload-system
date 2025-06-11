# 📁 Advanced Document Upload System

A production-ready Document upload system built with Next.js 15, featuring drag-and-drop functionality, real-time progress tracking, and comprehensive file management capabilities.

## 🚀 Deployment Link - 

## ✨ Features

### 🎯 Core Functionality
- **Drag & Drop Upload**: Intuitive file upload with drag-and-drop support
- **Real-time Progress**: Live upload progress tracking with percentage display
- **File Management**: Complete CRUD operations for uploaded files
- **Sortable Interface**: Drag-and-drop reordering with smooth animations
- **Document ShowCasing**: See Document in Animated Modal or on Next Tab

## 🚀 Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[@dnd-kit](https://dndkit.com/)** - Drag and drop toolkit
  - `@dnd-kit/core` - Core drag and drop functionality
  - `@dnd-kit/modifiers` - Drag modifiers and constraints
  - `@dnd-kit/sortable` - Sortable drag and drop lists
- **[React Dropzone](https://react-dropzone.js.org/)** - File upload component
- **[React Hook Form](https://react-hook-form.com/)** - Performant form handling
- **[Zod](https://zod.dev/)** - Schema validation library
- **[Axios](https://axios-http.com/)** - HTTP client
- **[React Toast](https://react-hot-toast.com/)** - Toast notifications
- **[clsx](https://github.com/lukeed/clsx)** - Utility for constructing className strings
- **[@t3-oss/env-nextjs](https://env.t3.gg/)** - Environment variable validation

### Backend
- **[Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)** - Serverless API endpoints
- **[Prisma](https://www.prisma.io/)** - Next-generation ORM
- **[@vercel/blob](https://vercel.com/docs/storage/vercel-blob)** - File storage solution
- **[Vercel Neon](https://neon.tech/)** - Serverless PostgreSQL database

### Deployment
- **[Vercel](https://vercel.com/)** - Frontend deployment and hosting
- **[Vercel Blob](https://vercel.com/docs/storage/vercel-blob)** - File storage
- **[Neon Database](https://neon.tech/)** - PostgreSQL database hosting

## 📋 Database Schema

```prisma
model File {
  id          String   @id @default(cuid())
  fileUrl     String   // URL to the uploaded file
  title       String   // Display name for the file
  slug        String   @unique // URL-friendly identifier
  description String?  // Optional file description
  order       Int      @default(0) // Sort order for arrangement
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("files")
}
```

## 🏗️ Architecture & Approach

### Frontend Architecture
```
📦src
 ┣ 📂app
 ┃ ┣ 📂api
 ┃ ┃ ┗ 📂files
 ┃ ┃ ┃ ┣ 📂reorder
 ┃ ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┃ ┃ ┣ 📂upload
 ┃ ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┃ ┃ ┣ 📂[id]
 ┃ ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┣ 📂css
 ┃ ┃ ┗ 📜globals.css
 ┃ ┣ 📜favicon.ico
 ┃ ┣ 📜layout.tsx
 ┃ ┗ 📜page.tsx
 ┣ 📂components
 ┃ ┣ 📂ui
 ┃ ┃ ┗ 📜input.tsx
 ┃ ┣ 📜FileUpload.tsx
 ┃ ┣ 📜Modal.tsx
 ┃ ┣ 📜Portal.tsx
 ┃ ┣ 📜SortableFileItem.tsx
 ┃ ┣ 📜SortableFileList.tsx
 ┃ ┗ 📜Wrappers.tsx
 ┣ 📂hooks
 ┃ ┣ 📜useFiles.ts
 ┃ ┗ 📜useFileUpload.ts
 ┗ 📂lib
 ┃ ┣ 📜constants.ts
 ┃ ┣ 📜env.ts
 ┃ ┣ 📜performance.ts
 ┃ ┣ 📜prisma.ts
 ┃ ┣ 📜test-utils.ts
 ┃ ┗ 📜utils.ts
```

### Key Design Patterns

#### 1. **Compound Component Pattern**
```typescript
<FileUpload>
  <FileUpload.DropZone />
  <FileUpload.FileList />
  <FileUpload.ProgressBar />
</FileUpload>
```

#### 2. **Custom Hooks for State Management**
```typescript
// useFileUpload hook manages upload state
const { uploadFile, files, progress, isUploading } = useFileUpload();
```

#### 3. **Optimistic Updates**
```typescript
// Immediate UI updates before server confirmation
const handleUpload = async (file: File) => {
  // Optimistically add file to UI
  setFiles(prev => [...prev, tempFile]);
  
  // Then upload to server
  const result = await uploadFile(file);
};
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18.17 or later
- npm or yarn package manager
- Vercel account (for deployment)
- Neon database account

### 1. Clone the Repository
```bash
git clone https://github.com/erpankajk4/file-upload-system.git
cd file-upload-system
```

### 2. Install Dependencies
```bash
npm install
# or
bun install
```

### 3. Environment Setup
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Vercel Blob
BLOB_READ_WRITE_TOKEN="your_blob_token"

# App Configuration
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# File Upload Limits
MAX_FILE_SIZE=10485760  # 10MB in bytes
MAX_FILES_COUNT=5
ALLOWED_FILE_TYPES="image/*,application/pdf,text/*"
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Optional: Seed database
npx prisma db seed
```

### 5. Run Development Server
```bash
npm run dev
# or
bun dev
```

Visit `http://localhost:3000` to see the application.

## 🎯 Usage Guide

### Basic File Upload
1. **Drag & Drop**: Drag files directly onto the upload zone
2. **Click Upload**: Click the upload area to select files
3. **Progress Tracking**: Watch real-time upload progress
4. **File Management**: Edit, reorder, or delete uploaded files

### File Management
- **Edit Metadata**: Click on any file to edit title, slug, and description
- **Reorder Files**: Drag files to change their display order
- **Delete Files**: Remove unwanted files with confirmation
- **View Details**: Access file information and download links

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using Next.js 15 and TypeScript**