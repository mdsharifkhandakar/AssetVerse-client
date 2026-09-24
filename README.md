# AssetVerse Client

AssetVerse is a B2B corporate asset management web application that
helps HR managers manage company assets, employees, requests, and
assignments while allowing employees to request and track assets.

## Live Website

https://assetverse-client.netlify.app/

## Project Purpose

The client application provides the user interface for AssetVerse,
including public pages, authentication, HR management pages, employee
dashboard pages, asset management, requests, team information, profiles,
and package management.

Employees request company assets; HR approves/rejects requests, tracks
inventory, manages team affiliations, and upgrades packages.

## Key Features

### Public

-   Responsive landing page
-   Hero section with Framer Motion animations
-   About and feature sections
-   Dynamic subscription packages from the database
-   Testimonials and statistics
-   How It Works section
-   FAQ and contact CTA
-   Login and registration pages
-   Custom 404 page

### HR Manager

-   HR dashboard
-   Company asset list with server-side pagination (`?page=&limit=`)
-   Search assets
-   Add assets
-   Edit assets
-   Delete assets
-   Asset type selection: Returnable / Non-returnable
-   Employee request management (employee, asset, date, status)
-   Approve/reject requests
-   Employee list
-   Employee removal
-   Direct asset assign for already affiliated employees
-   Package upgrade page with Stripe checkout and payment history
-   HR profile management (email read-only)
-   Dashboard charts (returnable vs non-returnable pie, top 5 requested bar)

### Employee

-   My Assets from all companies
-   Request an Asset
-   Asset search and filtering
-   Request date, approval date, and status columns
-   My Team with position and upcoming birthdays
-   Company affiliations
-   Profile management (email read-only)
-   Return workflow for returnable approved assets
-   Print/PDF download of assigned assets

## Technology

-   React
-   Vite
-   React Router
-   Firebase Authentication
-   Tailwind CSS
-   DaisyUI
-   motion (Framer Motion animations)
-   Recharts
-   axios, jspdf, jspdf-autotable
-   lucide-react, react-hot-toast
-   React Icons

## npm Packages

- react, react-dom, react-router
- firebase, axios
- recharts, jspdf, jspdf-autotable
- daisyui, tailwindcss, @tailwindcss/vite
- motion (animations), lucide-react, react-hot-toast

## Environment Variables

Create a `.env` file in the client project root:

``` env
VITE_API_URL=https://asset-verse-server-jade.vercel.app

VITE_apiKey=your_firebase_api_key
VITE_authDomain=your_firebase_auth_domain
VITE_projectId=your_firebase_project_id
VITE_storageBucket=your_firebase_storage_bucket
VITE_messagingSenderId=your_firebase_messaging_sender_id
VITE_appId=your_firebase_app_id
```

Do not commit `.env` or real Firebase configuration values that should
remain private to your deployment setup.

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL (e.g. `https://asset-verse-server-jade.vercel.app` or `http://localhost:3000`) |
| `VITE_apiKey`, `VITE_authDomain`, `VITE_projectId`, `VITE_storageBucket`, `VITE_messagingSenderId`, `VITE_appId` | Firebase web config |

## Local Setup

### 1. Clone the repository

``` bash
git clone https://github.com/mdsharifkhandakar/AssetVerse-client.git
cd AssetVerse-client
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Configure environment variables

Create `.env` and add the required Firebase and API configuration.

### 4. Start the development server

``` bash
npm run dev
```

The development server normally runs at:

``` text
http://localhost:5173
```

### 5. Create a production build

``` bash
npm run build
npm run preview
```

## Deployment

The client is deployed on Netlify.

Production API:

``` text
https://asset-verse-server-jade.vercel.app
```

For SPA route support, `public/_redirects` is included:

``` text
/* /index.html   200
```

## Project Structure

``` text
src/
├── assets/
├── components/
├── layouts/
├── pages/
├── providers/
├── routes/
├── utils/
└── main.jsx
```

The exact folder structure may change as the project evolves.

## Authentication

Firebase Authentication is used for email/password authentication.

The production Firebase project must authorize the production frontend
domain:

``` text
assetverse-client.netlify.app
```

## UI

AssetVerse uses DaisyUI with Tailwind CSS for the interface and is
designed for desktop, tablet, and mobile screens.

## Repositories

- Client: https://github.com/mdsharifkhandakar/AssetVerse-client
- Server: https://github.com/mdsharifkhandakar/AssetVerse-server

## Assignment

This project was developed for the AssetVerse Corporate Asset Management
System assignment.

The implementation follows the required HR and Employee workflows, asset
management flow, request workflow, company affiliations, package
management, and production deployment requirements.

## License

This project is created for educational and portfolio purposes.
