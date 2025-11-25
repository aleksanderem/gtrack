# Setup & Development

## Prerequisites
- Node.js 18+
- NPM or Bun
- A [Convex](https://convex.dev) account
- A [DataForSEO](https://dataforseo.com) account (for SEO features)

## Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/aleksanderem/gtrack.git
    cd gtrack
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Variables**
    Create a `.env.local` file:
    ```env
    VITE_CONVEX_URL="https://your-convex-url.convex.cloud"
    CONVEX_DEPLOYMENT="dev:your-deployment-name"
    ```

4.  **Start the Backend**
    ```bash
    npx convex dev
    ```
    This will sync your schema and functions to the cloud.

5.  **Start the Frontend**
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` in your browser.

## Project Structure
- `src/`: Vue frontend code.
- `convex/`: Backend functions and schema.
- `docs/`: This documentation.
