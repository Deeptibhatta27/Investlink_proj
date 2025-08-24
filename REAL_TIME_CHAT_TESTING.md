# Real-Time Chat Testing Guide

This guide will help you test the real-time chat functionality between investors and startups in the InvestLink platform.

## Test Accounts

Two test accounts have been created for you:

### Investor Account
- **Username**: `test_investor`
- **Password**: `testpassword123`
- **Role**: Investor
- **Company**: Test Investment Firm

### Startup Accounts
- **Username**: `test_startup`
- **Password**: `testpassword123`
- **Role**: Startup
- **Company**: Test Startup Inc.

- **Username**: `test_startup2`
- **Password**: `testpassword123`
- **Role**: Startup
- **Company**: Test Startup Inc. 2

## Testing Real-Time Chat

Follow these steps to test the real-time chat functionality:

### Step 1: Log in as the Investor
1. Open your browser and navigate to the login page
2. Enter the investor credentials:
   - Username: `test_investor`
   - Password: `testpassword123`
   - Role: Select "Investor"
3. Click "Login"

### Step 2: Connect with a Startup
1. After logging in, you'll be redirected to the investor dashboard
2. Navigate to the "Network" page
3. You should see "Test Startup Inc." or "Test Startup Inc. 2" in the list of startups
4. Click the "Connect" button next to the startup's profile
5. Click the "Message" button to open the chat window

### Step 3: Send a Message
1. In the chat window, type a message in the input field at the bottom
2. Click the send button (paper plane icon) or press Enter
3. The message should appear in the chat window immediately

### Step 4: Log in as a Startup (in a different browser/incognito window)
1. Open a different browser or an incognito/private window
2. Navigate to the login page
3. Enter one of the startup credentials:
   - For first startup:
     - Username: `test_startup`
     - Password: `testpassword123`
     - Role: Select "Startup"
   - For second startup:
     - Username: `test_startup2`
     - Password: `testpassword123`
     - Role: Select "Startup"
4. Click "Login"

### Step 5: Connect with the Investor
1. After logging in, you'll be redirected to the startup dashboard
2. Navigate to the "Network" page
3. You should see "Test Investor" in the list of investors
4. Click the "Connect" button next to the investor's profile
5. Click the "Message" button to open the chat window

### Step 6: View and Reply to Messages
1. In the startup's chat window, you should see the message sent by the investor
2. Type a reply message in the input field
3. Click the send button or press Enter
4. Switch back to the investor's browser window
5. You should see the startup's reply appear in real-time

## Expected Behavior

- Messages should appear instantly in both chat windows when sent
- Both users should see a "Connected" status indicator in the chat window
- Messages should be saved to the database and persist between sessions
- Only investors and startups can communicate with each other (admins can communicate with anyone)

## Troubleshooting

If you encounter any issues:

1. **WebSocket Connection Errors**:
   - Ensure you're using the correct protocol (http:// or https://)
   - Check that the backend server is running
   - Verify that Django Channels is properly configured

2. **Authentication Issues**:
   - Make sure you're selecting the correct role when logging in
   - Ensure your credentials are correct
   - Check that the user accounts exist in the database

3. **Messages Not Sending**:
   - Check the browser console for JavaScript errors
   - Verify that the WebSocket connection is established
   - Ensure both users are connected to each other

4. **Messages Not Receiving**:
   - Check that both users have connected to each other
   - Verify that the WebSocket connection is active
   - Check the backend logs for any errors

5. **Network Members Not Showing**:
   - Ensure the backend API is running and accessible
   - Check that the test accounts were created successfully
   - Verify that the network service is correctly fetching data from the API

## Technical Details

The real-time chat functionality is implemented using:

- **Django Channels** for WebSocket support
- **JWT Token Authentication** for secure connections
- **Role-based Access Control** to restrict communication between investors and startups
- **React Components** for the frontend interface
- **PostgreSQL** for message persistence

The WebSocket connection is established when the chat modal is opened and automatically reconnects if the connection is lost.

## Recent Improvements

- Fixed network page to fetch real data from the API instead of using sample data
- Improved error handling in network service
- Enhanced WebSocket connection reliability
- Better user feedback for connection status
- Added additional test accounts to prevent conflicts