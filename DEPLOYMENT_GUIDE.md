# Deployment Guide: Piston Kinematics Suite
> **Author**: Rahul Parmar

This guide explains how to deploy this project across different environments based on your file structure:

```
Rahul's Project/
├── frontend/                     # React + Vite Web App
│   ├── dist/                     # Production build artifacts (generated on build)
│   ├── src/                      # React source code
│   └── package.json
├── python/                       # Python Kinematics & Excel generator
│   ├── engine_kinematics.py
│   ├── generate_spreadsheet.py
│   └── cli_calculator.py
├── vercel.json                   # Ready-to-use Vercel deployment config
├── netlify.toml                  # Ready-to-use Netlify deployment config
└── Dockerfile                    # Production container build
```

---

## 🌐 Method 1: Deploy Free to Cloud (Vercel / Netlify / Render)

### A. Deploy with Vercel (Recommended - 100% Free)
1. Push this project folder to your **GitHub** repository.
2. Go to [https://vercel.com](https://vercel.com) and log in.
3. Click **"Add New Project"** and import your repository.
4. Vercel will automatically detect `vercel.json` and deploy.
5. You will get a live URL (e.g. `https://piston-kinematics-rahul.vercel.app`) accessible worldwide on PC & Mobile!

### B. Deploy with Netlify
1. Go to [https://app.netlify.com](https://app.netlify.com).
2. Drag and drop the `frontend/dist` folder into the Netlify Dashboard, OR connect your GitHub repository (it will auto-detect `netlify.toml`).

---

## 💻 Method 2: Local Network / Production Server (Node / NGINX)

### Step 1: Build the production bundle
From the project root:
```bash
npm run build
```
This generates the optimized static production files inside `frontend/dist/`.

### Step 2: Serve using `serve` or `http-server`
```bash
npx serve -s frontend/dist -p 8080
```
Your team or mobile devices on the same Wi-Fi network can open `http://<YOUR_PC_IP>:8080`.

---

## 🐳 Method 3: Deploy with Docker
Run with Docker in 1 command:
```bash
docker build -t piston-kinematics-app .
docker run -d -p 80:80 piston-kinematics-app
```
Then visit `http://localhost`.

---

## 🐍 Method 4: Python Standalone Packaging (Optional .EXE)
To bundle the Python calculator and Excel generator into a standalone Windows `.exe` without needing Python installed on other PCs:
```bash
pip install pyinstaller
cd python
pyinstaller --onefile cli_calculator.py
```
The standalone `.exe` will be generated in `python/dist/cli_calculator.exe`.
