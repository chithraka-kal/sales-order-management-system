# Sales Order Management System

A full-stack web application for managing sales orders, developed using **.NET 8 Web API** and **React 18**, strictly adhering to **Layered (N-Tier) Architecture** and **Clean Architecture** principles.

## 🚀 Features

### Screen 1: Sales Order Form
- **Customer Selection:** Dropdown populated from the database; automatically fills address fields upon selection.
- **Item Management:** Linked dropdowns for Item Code and Description (selecting one auto-selects the other).
- **Real-time Calculations:** Automatically calculates Excl Amount, Tax Amount, and Incl Amount based on quantity and tax rate.
- **Multiple Items:** Supports adding multiple line items to a single order.
- **Print Support:** Built-in option to print the sales order invoice.

### Screen 2: Home (Order List)
- **Dashboard:** Displays a grid of all saved sales orders with total values.
- **Edit Capability:** Double-clicking a row re-opens the Sales Order screen with populated data for editing.
- **Update Flow:** Supports editing an existing order and saving changes (PUT request).

## 🏗️ Architecture & Design

### Backend: N-Tier Architecture
The solution is separated into four distinct layers to decouple concerns:
1.  **API Layer (`/API`):** Controllers, DTOs, and AutoMapper configuration.
2.  **Application Layer (`/Application`):** Business logic interfaces and service implementations.
3.  **Domain Layer (`/Domain`):** Core entity models and repository interfaces.
4.  **Infrastructure Layer (`/Infrastructure`):** Data access, EF Core DbContext, and Repository implementations.

### Frontend: React + Redux
- **State Management:** Uses **Redux Toolkit** for centralized state (Order List) and Custom Hooks for local form logic.
- **Styling:** Built with **Tailwind CSS** using a consistent design system (colors, spacing) defined in `tailwind.config.js`.
- **Structure:** Organized into `/components`, `/pages`, `/services`, `/hooks`, and `/utils`.

## 🛠️ Tech Stack
- **Backend:** .NET 8, Entity Framework Core, SQL Server, AutoMapper, Dependency Injection.
- **Frontend:** React 18, Redux Toolkit, React Router, Axios, Tailwind CSS.

## 📂 Project Structure
This project follows the recommended folder structure:

```text
/backend
  ├── API (Controllers, Models/DTOs)
  ├── Application (Interfaces, Services)
  ├── Domain (Entities)
  └── Infrastructure (Data, Repositories)

/Frontend
  ├── src
  │   ├── components (Reusable UI controls)
  │   ├── pages (Home, SalesOrder)
  │   ├── redux (Slices, Store)
  │   ├── services (API calls)
  │   ├── hooks (useOrderForm)
  │   └── utils (Calculations)

```

## ⚙️ Setup Instructions

### 1. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend

   
2. Update the database (Code-First Migration):
    ```bash
    dotnet ef database update --project Infrastructure --startup-project API

3. Run the API:
    ```bash
    cd API
    dotnet run

The API will run on http://localhost:5278 (or similar).

### 2. Frontend Setup
1. Open a new terminal and navigate to the client folder:
    ```bash
    cd frontend

2. Install dependencies:
    ```bash
    npm install

3. Run the app:
    ```bash
    npm run dev
