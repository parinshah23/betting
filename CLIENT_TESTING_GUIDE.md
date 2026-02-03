# 🧪 Client Testing Guide: Premium Competition Platform

**Objective:** Verify that the website features work correctly from a user and admin perspective.

---

## 🔑 1. Test Accounts & Credentials

### **Admin Account**
Use this account to access the dashboard and manage competitions.
- **URL:** `/admin` (e.g., `https://your-site.com/admin`)
- **Email:** `admin@example.com`
- **Password:** `admin123`

### **Payment Test Cards (Stripe)**
When making a purchase, use these details to simulate a successful payment. **Do not use a real credit card.**
- **Card Number:** `4242 4242 4242 4242`
- **Expiry:** Any future date (e.g., `12/28`)
- **CVC:** `123`
- **Zip Code:** `12345`

---

## 📝 2. Testing Scenarios

Please go through these steps in order.

### ✅ Scenario A: New User Registration
1.  Open the website in a **Incognito/Private** window.
2.  Click **"Register"** in the top right.
3.  Fill in the form with a test email (e.g., `testuser1@example.com`).
4.  Click **"Create Account"**.
5.  **Verify:**
    *   You are redirected to the Login page or Dashboard.
    *   You receive a "Welcome" email (if email service is active).

### ✅ Scenario B: User Login
1.  Click **"Login"**.
2.  Enter the email and password you just created.
3.  Click **"Sign In"**.
4.  **Verify:**
    *   You are logged in successfully.
    *   Your name appears in the top navigation.

### ✅ Scenario C: Purchasing a Ticket (The "Money" Flow)
1.  Go to the **"Competitions"** page.
2.  Click on any active competition (e.g., "Win a Tesla").
3.  Select **3 Tickets** (or any amount).
4.  Answer the skill question correctly (if asked).
5.  Click **"Enter Now"** or **"Add to Cart"**.
6.  Go to **Cart** and click **"Checkout"**.
7.  **Payment Page:**
    *   Enter the **Test Card Details** (from Section 1 above).
    *   Click **"Pay Now"**.
8.  **Verify:**
    *   Payment succeeds.
    *   You are redirected to a "**Order Confirmed**" page.
    *   You receive an "Order Confirmation" email.
    *   Go to **"My Area"** -> **"My Tickets"** to see your new ticket numbers.

### ✅ Scenario D: Admin Management
1.  **Log out** of the test user account.
2.  **Login** using the **Admin Credentials** (from Section 1).
3.  You should see the **Admin Dashboard**.
4.  **Test: Create Competition**
    *   Go to "Competitions" -> "Create New".
    *   Upload an image (tests Cloudinary).
    *   Set a price and end date.
    *   Save.
    *   **Verify:** The new competition appears on the public homepage.
5.  **Test: View Orders**
    *   Go to "Orders".
    *   **Verify:** You can see the order you just made in Scenario C.

---

## ❓ FAQ / Troubleshooting

**Q: Payment failed?**
A: Ensure you used the `4242...` test card numbers. Real cards will be rejected in Test Mode.

**Q: I didn't get an email?**
A: Check your Spam folder. If using a free testing server, email delivery might be delayed.

**Q: Images aren't uploading?**
A: Ensure file size is under 5MB and is a valid image (JPG/PNG).
