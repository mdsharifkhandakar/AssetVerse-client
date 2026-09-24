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

## Key Features

### Public

-   Responsive landing page
-   Hero section with Framer Motion animations
-   About and feature sections
-   Dynamic subscription packages
-   Testimonials and statistics
-   How It Works section
-   FAQ and contact CTA
-   Login and registration pages
-   Custom 404 page

### HR Manager

-   HR dashboard
-   Company asset list
-   Search assets
-   Add assets
-   Edit assets
-   Delete assets
-   Asset type selection: Returnable / Non-returnable
-   Employee request management
-   Approve/reject requests
-   Employee list
-   Employee removal
-   Package upgrade page
-   HR profile management
-   Dashboard charts and analytics

### Employee

-   My Assets
-   Request an Asset
-   Asset search and filtering
-   My Team
-   Company affiliations
-   Profile management
-   Return workflow for returnable assets where supported

## Technology

-   React
-   Vite
-   React Router
-   Firebase Authentication
-   Tailwind CSS
-   DaisyUI
-   Framer Motion
-   Recharts
-   React Icons

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

## Local Setup

### 1. Clone the repository

``` bash
git clone <your-client-repository-url>
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
```

## Deployment

The client is deployed on Netlify.

Production API:

``` text
https://asset-verse-server-jade.vercel.app
```

For SPA route support, the Netlify deployment should serve `index.html`
for client-side routes.

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

## Assignment

This project was developed for the AssetVerse Corporate Asset Management
System assignment.

The implementation follows the required HR and Employee workflows, asset
management flow, request workflow, company affiliations, package
management, and production deployment requirements.

## License

This project is created for educational and portfolio purposes.

