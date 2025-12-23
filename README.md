# Quick - Service Provider Platform

A modern **service provider search and booking platform** similar to Justdial.  
Users can explore services, view details, save favorites, register their own business and also request services from other providers directly from the platform.
The platform also includes role-based access, where admin can manage users and services.

The platform consists of:
- **Frontend**: React.js
- **Backend**: Spring Boot (Java)
- **Database**: PostgreSQL

---

## Features

- **Search & Browse Services** by category or name  
- **Favorite Services** with a heart icon  
- **Service Details** page with images & descriptions  
- **Booking System** for customers to book services  
- **User Authentication & Profiles** (Spring Security)  
- **Service Provider Dashboard** for managing listings and bookings  

---

##  Tech Stack

**Frontend**
- React.js  
- Axios (API calls)  
- Tailwind CSS (styling)  
- React Router DOM (navigation)  

**Backend**
- Spring Boot  
- Spring Data JPA  
- Spring Security (JWT Authentication)  
- MapStruct (DTO mapping)  

**Database**
- PostgreSQL  

---

##  Project Structure

```
justsearch/
│
├── backend/                    # Spring Boot backend
│   ├── src/main/java/com/justsearch/backend/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── model/
│   │   ├── dto/
│   │   └── config/
│   └── src/main/resources/
│       ├── application.properties
│       └── schema.sql
│
├── frontend/                   # React.js frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/          # API call files
│   │   └── App.js
│   └── package.json
└── README.md
```

---

## Installation & Setup

### **Backend**

```bash
# Navigate to backend folder
cd backend

# Configure application.properties
# spring.datasource.url=jdbc:postgresql://localhost:5432/justsearch
# spring.datasource.username=YOUR_DB_USER
# spring.datasource.password=YOUR_DB_PASSWORD
# spring.jpa.hibernate.ddl-auto=update

# Run Spring Boot application
mvn spring-boot:run
```

### **Frontend**

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

--

##  API Endpoints (Sample)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/services` | Get all services |
| GET | `/services/{id}` | Get service details |
| POST | `/bookservice` | Create a booking |
| GET | `/bookservice/GetMyBookings/{userId}` | Get user's bookings |
| POST | `/auth/register` | Register user |
| POST | `/auth/login` | Login user |

---

## Running Tests

```bash
# Backend tests
mvn test

# Frontend tests
npm test
```

---

##  Contribution Guidelines

1. Fork the repo and create a new branch.
2. Follow the existing folder structure and naming conventions.
3. Submit a pull request with a clear description of changes.

---

##  Authors

**Syed Abdul Saleem**

---
## Home page
![Quick Platform Home](https://github.com/67code/Quick/blob/main/FE/justdial/public/images/Home.png?raw=true)
## Book service
![Book service](https://github.com/67code/Quick/blob/main/FE/justdial/public/images/Book%20service.png?raw=true)
## My  Bookings
<img width="1866" height="951" alt="image" src="https://github.com/user-attachments/assets/6d7a7788-87d9-4f24-ac57-9d82fcc69cf2" />
