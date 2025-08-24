import requests
import json

# Base URL for the API
BASE_URL = 'http://localhost:8000/api/accounts'

def register_investor():
    """Register a test investor account"""
    investor_data = {
        'username': 'test_investor',
        'password': 'testpassword123',
        'firstName': 'Test',
        'lastName': 'Investor',
        'email': 'investor@test.com',
        'investmentFirm': 'Test Investment Firm',
        'investmentRange': '$100K - $500K',
        'preferredSectors': 'Technology, Healthcare, FinTech',
        'phone': '+1234567890'
    }
    
    try:
        response = requests.post(f'{BASE_URL}/register/investor/', json=investor_data)
        if response.status_code == 201:
            print("Investor account created successfully!")
            print(f"Response: {response.json()}")
            return response.json()
        else:
            print(f"Failed to create investor account. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"Error creating investor account: {e}")
        return None

def register_startup():
    """Register a test startup account"""
    startup_data = {
        'username': 'test_startup',
        'password': 'testpassword123',
        'email': 'startup@test.com',
        'founderName': 'Test Founder',
        'startupName': 'Test Startup Inc.',
        'industrySector': 'Technology',
        'fundingStage': 'Seed',
        'companyDescription': 'A test startup for demonstration purposes',
        'phone': '+1234567890'
    }
    
    try:
        response = requests.post(f'{BASE_URL}/register/startup/', json=startup_data)
        if response.status_code == 201:
            print("Startup account created successfully!")
            print(f"Response: {response.json()}")
            return response.json()
        else:
            print(f"Failed to create startup account. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"Error creating startup account: {e}")
        return None

def get_auth_token(username, password, role):
    """Get authentication token for a user"""
    login_data = {
        'username': username,
        'password': password,
        'role': role
    }
    
    try:
        response = requests.post(f'{BASE_URL}/login/', json=login_data)
        if response.status_code == 200:
            print(f"Authentication token obtained for {username}!")
            return response.json()
        else:
            print(f"Failed to authenticate {username}. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"Error authenticating {username}: {e}")
        return None

def test_chat_functionality():
    """Test the chat functionality between investor and startup"""
    print("Creating test accounts...")
    
    # Register accounts
    investor = register_investor()
    startup = register_startup()
    
    if not investor or not startup:
        print("Failed to create one or both accounts. Exiting.")
        return
    
    print("\nGetting authentication tokens...")
    
    # Get tokens
    investor_token = get_auth_token('test_investor', 'testpassword123', 'investor')
    startup_token = get_auth_token('test_startup', 'testpassword123', 'startup')
    
    if not investor_token or not startup_token:
        print("Failed to get authentication tokens. Exiting.")
        return
    
    print("\nAccounts created successfully!")
    print(f"Investor username: test_investor")
    print(f"Investor password: testpassword123")
    print(f"Startup username: test_startup")
    print(f"Startup password: testpassword123")
    print("\nTo test real-time chat:")
    print("1. Log in as the investor (test_investor/testpassword123)")
    print("2. Go to the network page and find the test startup")
    print("3. Connect with the startup")
    print("4. Send a message to the startup")
    print("5. Log in as the startup (test_startup/testpassword123) in a different browser/incognito window")
    print("6. Go to the network page and find the test investor")
    print("7. Connect with the investor")
    print("8. You should see the message from the investor in real-time")
    print("9. Reply to the message to test real-time communication in both directions")

if __name__ == "__main__":
    test_chat_functionality()