APPOINTMENT BOOKING SYSTEM - DOCUMENTATION
======================================================

Author: [Your Name]
Date: [Date]
Language: Python (Flask), HTML/CSS/JavaScript, MySQL
Port: 5002

------------------------------------------------------
PROJECT OVERVIEW
------------------------------------------------------

This is a full-stack appointment booking system that allows users
to schedule appointments in 30-minute intervals between 10:00 AM 
and 5:00 PM. The system includes the following features:

- Time slots exclude 1:00 PM to 2:00 PM (lunch break)
- Prevents double-booking of time slots
- Allows booking with name, phone, date, and time
- Edit and Delete options using REST APIs
- Frontend is packaged as a JavaScript plugin embeddable via <script> tag

------------------------------------------------------
TECHNOLOGIES USED
------------------------------------------------------

- Python Flask (Backend)
- MySQL (Database)
- HTML/CSS/JavaScript (Frontend)
- JavaScript plugin (Reusable embeddable widget)

------------------------------------------------------
SETUP INSTRUCTIONS
------------------------------------------------------

1. REQUIREMENTS
------------------------------------------------------
- Python 3.7 or higher
- MySQL Server
- pip (Python package installer)
- A modern web browser (Chrome, Firefox)

------------------------------------------------------
2. DATABASE SETUP
------------------------------------------------------

- Open MySQL client and run the following commands:

CREATE DATABASE appointment_db;

USE appointment_db;

CREATE TABLE appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  phone VARCHAR(20),
  date DATE,
  time_slot VARCHAR(10),
  UNIQUE(date, time_slot) -- Prevents double-booking
);

------------------------------------------------------
3. BACKEND SETUP (FLASK)
------------------------------------------------------

- Navigate to the backend folder:
    cd backend

- Install dependencies:
    pip install flask flask-cors mysql-connector-python

- Configure MySQL credentials in db_config.py:
    db_config = {
        "host": "localhost",
        "user": "your_mysql_username",
        "password": "your_mysql_password",
        "database": "appointment_db"
    }

- Run the Flask app:
    python app.py

- Server will start at:
    http://localhost:5002

------------------------------------------------------
4. FRONTEND SETUP
------------------------------------------------------

- Open the 'frontend' folder
- Ensure the following files exist:
    - index.html
    - appointment-widget.js

- Open index.html in your browser
    (Double-click or open via VS Code Live Server)

- The plugin will:
    - Render the booking form
    - List appointments
    - Allow edit/delete
    - Prevent double-booking

------------------------------------------------------
5. EMBEDDING THE PLUGIN ON OTHER SITES
------------------------------------------------------

- Upload 'appointment-widget.js' to your hosting or server
- Use the following code in any HTML file:

<script src="appointment-widget.js"></script>

- The widget will automatically render the UI and connect to your backend.

------------------------------------------------------
6. API ENDPOINTS
------------------------------------------------------

GET     /api/appointments
POST    /api/appointments
PUT     /api/appointments/<id>
DELETE  /api/appointments/<id>

All responses are in JSON.

------------------------------------------------------
NOTES
------------------------------------------------------

- Ensure that the Flask backend is running before opening the frontend.
- Do not book duplicate time slots (will be blocked by backend).
- Modify time slots or UI layout by editing 'appointment-widget.js'.