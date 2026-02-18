# Deploy Daily Productivity Tracker to Vercel

## Option A: Deploy from this repo (app in subfolder)

1. **Push your code** to GitHub (this workshop repo or your fork).

2. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub.

3. **Add New Project** → Import your repository (`cursor-sdlc-workshop` or your fork).

4. **Configure the project:**
   - **Root Directory:** Click "Edit" and set to `teams/team_6/app`
   - **Framework Preset:** Vite (should auto-detect)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

5. **Deploy.** Vercel will run `npm install` and `npm run build` in that folder and serve the `dist` output.

---

## Option B: Deploy only the app (separate repo)

1. Copy the `teams/team_6/app` folder into a new repo (or create a repo and add only its contents).

2. In Vercel: **Add New Project** → Import that repo.

3. Leave **Root Directory** blank. Use defaults:
   - Build: `npm run build`
   - Output: `dist`

4. Deploy.

---

## Gmail / Email score (optional)

To use the **Email score** feature (track sent/received email and get a score):

1. **Google Cloud Console**
   - Go to [Google Cloud Console](https://console.cloud.google.com/) and create or select a project.
   - Enable the **Gmail API**: APIs & Services → Library → search “Gmail API” → Enable.
   - Create OAuth credentials: APIs & Services → Credentials → Create Credentials → OAuth client ID.
   - Application type: **Web application**.
   - Add **Authorized redirect URIs**:  
     - Production: `https://YOUR_VERCEL_DOMAIN/api/auth/callback`  
     - Local (if using `vercel dev`): `http://localhost:3000/api/auth/callback`
   - Copy the **Client ID** and **Client secret**.

2. **Vercel environment variables**
   - In your Vercel project: Settings → Environment Variables.
   - Add:
     - `GOOGLE_CLIENT_ID` = your Client ID
     - `GOOGLE_CLIENT_SECRET` = your Client secret
   - Optional: `APP_URL` = `https://your-app.vercel.app` (if your app URL is different from `VERCEL_URL`).

3. **Redeploy** so the API routes use the new env vars.

4. In the app, click **Connect Google (Gmail)** and sign in. The **Email score** card will show today’s sent/received counts and a score (sent × 4 + received, capped at 100).

**Note:** The Gmail API routes (`/api/auth/*`, `/api/gmail/stats`) only run when the app is deployed (e.g. on Vercel) or when you run `vercel dev` locally. They are not available when using only `npm run dev` (Vite).

---

## After deploy

- Vercel gives you a URL like `your-project.vercel.app`.
- Every push to the connected branch (e.g. `main`) can trigger a new deployment if you enabled that.
- To use a custom domain: Project → Settings → Domains.
