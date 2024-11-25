# Secure-web-app
Secure-web-app

# Secure web app

This project is a secure web application with modern authentication and user management capabilities, built using Express.js and MongoDB. It is designed with robust security measures, including JWT-based authentication, rate limiting, and strict CORS policies.

## Features

-Secure Authentication: JWT-based authentication for secure user sessions.
-Rate Limiting: Protects the API from overuse with request rate limits.
-CORS Control: Restricts API access to specific trusted domains.
-Public and Protected Routes: Granular access controls for API endpoints.
## Technologies Used


### Backend

- Node.js
- Express
- JavaScript
- JWT for authentication



### Prerequisites

- Node.js (v14 or above)
- MongoDB (locally or via MongoDB Atlas)

### Installation

#### Set up the environment variables
# Server Configuration
PORT=5000

# Database Configuration
MONGO_URI=mongodb://localhost:27017/secure-web-app

# JWT Secret Key
JWT_SECRET=your_jwt_secret

# CORS Configuration
ALLOWED_ORIGINS=https://api.example.com


1. **Clone the repository:**

```bash
git clone https://github.com/your-username/secure-web-app.git
cd secure-web-app

2. **Install Dependencies**
npm install

3. **Start the Server**
npm start

4. **Testing the Application**
npm test
