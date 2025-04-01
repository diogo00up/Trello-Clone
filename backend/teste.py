import requests

# Step 1: Create a test user
url = "http://127.0.0.1:8000/users"
user_data = {
    "username": "testuser",
    "email": "testuser@example.com",
    "password": "testpassword123"
}

# Send POST request to create user
response = requests.post(url, json=user_data)
print("Create User Response:", response.json())  # Prints the created user

# Step 2: Log in with the test user
login_url = "http://127.0.0.1:8000/login"
login_data = {
    "username": "testuser",
    "password": "testpassword123"
}

# Send POST request to login
login_response = requests.post(login_url, json=login_data)
if login_response.status_code == 200:
    print("Login Response:", login_response.json())  # Prints the JWT token
    access_token = login_response.json()['access_token']

   