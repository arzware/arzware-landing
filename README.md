# SocialLab Interactive

This is the interactive presentation website for SocialLab.

## Local Setup

1. Install dependencies using pnpm:
   ```bash
   pnpm install
   ```

2. Run the development server:
   ```bash
   pnpm --filter @workspace/sociallab run dev
   ```
   Or from the root:
   ```bash
   pnpm run dev
   ```

## Building for Production

To build the project locally, run:
```bash
pnpm run build
```
This command runs `tsc` for typechecking and `vite build` to output static files to `artifacts/sociallab/dist/public`.

## Local Preview

After building, you can preview the production build locally:
```bash
pnpm --filter @workspace/sociallab run serve
```
(Or run the equivalent Vite preview command).

## GitHub Pages Deployment

This project is configured to deploy automatically to GitHub Pages using GitHub Actions (`.github/workflows/deploy.yml`).

When you push to the `main` branch, the workflow will:
1. Setup Node 20 and pnpm
2. Install dependencies
3. Build the project with `BASE_PATH=/sociallab-interactive/`
4. Deploy the `artifacts/sociallab/dist/public` folder to GitHub Pages

### Expected URL
The site will be available at:
`https://YOUR_USERNAME.github.io/sociallab-interactive/`

### GitHub Settings Configuration
Make sure you enable GitHub Actions to deploy to Pages:
1. Go to your repository **Settings** on GitHub.
2. Select **Pages** on the left sidebar.
3. Under **Source**, select **GitHub Actions**.
