# 📌 Project Overview: Task Management App (Trello Clone)
This project is a full-stack task management application where users can create boards, lists, and tasks (similar to Trello). It will be built using React + TypeScript for the frontend, Express (Node.js) or FastAPI (Python) for the backend, PostgreSQL or MySQL for the database, and Docker to containerize everything.


✅ Step 1: Create a Google Cloud Project
Go to Google Cloud Console.

Create a new project.

Go to APIs & Services > Credentials.

Click “Create Credentials” > OAuth client ID.

Choose “Web application”.

Set an authorized redirect URI (e.g. http://localhost:3000/oauth2callback for local dev).

Copy your Client ID and Client Secret.

✅ Step 2: Enable the Google Calendar API

Go to APIs & Services > Library.

Search for "Google Calendar API".

Click it and Enable.

✅ Step 3: Implement OAuth 2.0 in React
Since React is frontend-only, it's not ideal for securely managing OAuth tokens and secrets. You have two options:

🔸 Option A: Use Backend (FastAPI) to handle OAuth
This is the recommended approach:

The user logs in with Google via your backend.

FastAPI handles token exchange and uses the Calendar API.

FastAPI stores refresh tokens securely and calls the Calendar API on behalf of the user.

✅ Step 4: Trigger Calendar Creation on Ticket Submission
After a user creates a ticket, call a function that adds it to their calendar, passing the ticket's relevant time/date info.




