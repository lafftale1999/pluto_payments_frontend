# PLUTO PAYMENTS – FRONTEND
A lightweight frontend application for a credit card provider that enables users to log in, view invoices, manage their account, and interact with the Pluto Payments ecosystem. The application is built with **Next.js** and serves as the user-facing interface for the system. It communicates with the backend through secure session-based requests.  

For the full project, check out the main repository: [Pluto Payments](https://github.com/lafftale1999/pluto_payments)  

---

## About
The application contains the following functionality:  

**Framework & Tools:**  
- Built with **Next.js** (React + TypeScript)  
- **Axios** for API communication  
- **TanStack Query (React Query)** for data fetching and caching  
- **TailwindCSS** for styling  

**Features:**  
- Session-based login system using backend-issued cookies  
- Secure API communication with the backend  
- Account overview: see card, invoices, and account details  
- Invoice details page with transaction history  

**Security:**  
- Session cookie provided by backend after successful login  
- Automatic revalidation of session on protected routes  
- Logout mechanism clears session and prevents further access  

---

## Usage
After setup, the frontend will provide the following main user flows:  

- **Login**  
  Enter your credentials. On success, a session cookie will be created.  

- **Logout**  
  Ends the current session and clears frontend state.  

- **Account Overview**  
  Displays information about the logged-in account and associated card.  

- **Invoices**  
  Overview of invoices connected to the user.  

- **Invoice Details**  
  Detailed view of one invoice including transactions.  

The frontend communicates with the backend through the following endpoints:  

- `/api/auth/login` – Handles user login and session cookie creation  
- `/api/auth/logout` – Destroys session and clears cookie  
- `/api/auth/account/*` – Accesses account, card, and invoice information  

---

## Dependencies
- **Node.js (v18+)**  
  Required to run and build the application.  

- **npm** or **yarn**  
  Package manager for installing dependencies.  

---

## Build project
1. **Clone project**  
   git clone https://github.com/lafftale1999/pluto_payments_frontend.git
   cd pluto_payments_frontend

2. **Install dependencies**  
   npm install

3. **Run the program localy**  
   npm run dev

## About us
This project has been created by [`Maksym`](https://github.com/Zar000), [`Johann`](https://github.com/hager3737) and [`Carl`](https://github.com/lafftale1999).
