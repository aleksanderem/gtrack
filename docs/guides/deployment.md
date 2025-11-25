# Deployment

GTRACK is designed to be deployed as a static frontend (Vercel/Netlify) with a managed backend (Convex).

## Backend (Convex)

1.  **Production Environment**
    Log in to your Convex dashboard and create a Production deployment.

2.  **Deploy Functions**
    ```bash
    npx convex deploy
    ```
    This pushes your `convex/` folder to the production environment.

3.  **Environment Variables**
    Set your secrets (like `DATAFORSEO_API_KEY`) in the Convex Dashboard settings.

## Frontend (Vercel)

1.  **Connect Repository**
    Import your GitHub repo into Vercel.

2.  **Build Settings**
    - **Framework Preset**: Vite
    - **Build Command**: `npm run build`
    - **Output Directory**: `dist`

3.  **Environment Variables**
    Add `VITE_CONVEX_URL` pointing to your **Production** Convex URL.

4.  **Deploy**
    Push to `main` to trigger a deployment.
