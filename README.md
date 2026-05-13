# buildsbyash — Portfolio Website

## Project Structure
```
buildsbyash/
├── api/
│   └── contact.js      ← Handles contact form + sends email
├── public/
│   └── index.html      ← Your website frontend
├── .env.example        ← Copy this to .env
├── package.json
└── vercel.json
```

## How to Deploy on Vercel

### Step 1 — Get Gmail App Password
1. Go to your Google Account → Security
2. Enable 2-Step Verification (if not already)
3. Go to Security → App Passwords
4. Select "Mail" and generate a password
5. Copy the 16-character password

### Step 2 — Deploy to Vercel
1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → Import your repo
3. Click "Deploy"

### Step 3 — Add Environment Variables on Vercel
1. Go to your project on Vercel → Settings → Environment Variables
2. Add these two:
   - `GMAIL_USER` = your Gmail address (e.g. ashfaq@gmail.com)
   - `GMAIL_PASS` = the 16-character app password from Step 1
3. Click Save → Redeploy

## How it works
- Someone fills out the contact form on your site
- `/api/contact.js` receives the form data
- It sends YOU a notification email with their details
- It also sends THEM an auto-reply confirming you got their message
