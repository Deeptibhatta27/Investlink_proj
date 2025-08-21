# 🗄️ pgAdmin Setup Guide for InvestLink

## ✅ **Permissions Fixed**

All necessary permissions have been granted to access the database tables in pgAdmin.

## 🔧 **How to Connect to pgAdmin**

### **Option 1: Use the Superuser Account (Recommended)**

**Connection Details:**
- **Host**: `localhost`
- **Port**: `5433`
- **Database**: `investlink_db`
- **Username**: `pgadmin_user`
- **Password**: `pgadmin123`

### **Option 2: Use the Application User**

**Connection Details:**
- **Host**: `localhost`
- **Port**: `5433`
- **Database**: `investlink_db`
- **Username**: `investlink_user`
- **Password**: `123deepti`

## 📊 **How to View Registered Users**

### **Step 1: Connect to Database**
1. Open pgAdmin
2. Right-click on "Servers" → "Register" → "Server"
3. Fill in the connection details above
4. Click "Save"

### **Step 2: Navigate to Users Table**
1. Expand your server connection
2. Expand `investlink_db` → `Schemas` → `public` → `Tables`
3. Find `accounts_user` table
4. Right-click → "View/Edit Data" → "All Rows"

### **Step 3: Alternative - Use Query Tool**
1. Right-click on `investlink_db`
2. Select "Query Tool"
3. Run this SQL query:

```sql
SELECT 
    id,
    username,
    email,
    first_name,
    last_name,
    role,
    date_joined,
    is_active
FROM accounts_user
ORDER BY date_joined DESC;
```

## 🚀 **Quick Commands**

### **View Users from Command Line**
```bash
# Using the script I created
python3 view_users.py

# Direct database query
PGPASSWORD=123deepti psql -h localhost -p 5433 -U investlink_user -d investlink_db -c "SELECT username, email, role, date_joined FROM accounts_user;"
```

### **Django Admin (Web Interface)**
- **URL**: http://localhost:8000/admin
- **Username**: `admin`
- **Password**: `admin123`

## 🔍 **Current Users in Database**

Based on the latest query, you have **2 users**:
1. **admin** (admin@example.com) - Role: investor
2. **deepti123@gmail.com** - Role: investor

## 🛠️ **Troubleshooting**

### **If you still get permission denied:**

1. **Check Connection Details:**
   - Make sure you're using port `5433` (not 5432)
   - Verify the database name is `investlink_db`

2. **Try the Superuser Account:**
   - Use `pgadmin_user` with password `pgadmin123`

3. **Restart pgAdmin:**
   - Close and reopen pgAdmin
   - Clear any cached connections

4. **Verify PostgreSQL is Running:**
   ```bash
   sudo systemctl status postgresql
   ```

## 📋 **Database Tables Available**

- `accounts_user` - User accounts and profiles
- `accounts_user_groups` - User group associations
- `accounts_user_user_permissions` - User permissions
- `auth_group` - Django auth groups
- `auth_permission` - Django permissions
- `django_admin_log` - Admin action logs
- `django_content_type` - Content types
- `django_migrations` - Migration history
- `django_session` - User sessions

---

**The permission issue should now be resolved! 🎉** 