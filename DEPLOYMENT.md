# Deploying to interview.clementadegbenro.com

Step-by-step guide to deploy this site to Cloudflare Pages with a custom subdomain.

---

## Prerequisites

- [x] GitHub repository: `Clementjatts/star-interview-flashcards`
- [ ] Cloudflare account with `clementadegbenro.com` domain
- [ ] DNS managed by Cloudflare

---

## Step 1: Create Cloudflare Pages Project

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your account → **Workers & Pages** → **Create**
3. Select the **Pages** tab → **Connect to Git**
4. Authorize GitHub if prompted
5. Select repository: `star-interview-flashcards`

### Build Configuration

| Setting | Value |
|---------|-------|
| Production branch | `main` |
| Build command | *(leave empty)* |
| Build output directory | `/` |

> **Note:** No build command needed — this is a static HTML site.

6. Click **Save and Deploy**
7. Wait for deployment (usually < 1 minute)

---

## Step 2: Verify Initial Deployment

Cloudflare will assign a temporary URL like:
```
https://star-interview-flashcards.pages.dev
```

1. Visit this URL to confirm the site works
2. Test all tabs and the PWA installation

---

## Step 3: Add Custom Subdomain

1. In Cloudflare Pages project → **Custom domains**
2. Click **Set up a custom domain**
3. Enter: `interview.clementadegbenro.com`
4. Click **Continue**

### DNS Configuration

Cloudflare will automatically add the required DNS record:

| Type | Name | Content |
|------|------|---------|
| CNAME | interview | star-interview-flashcards.pages.dev |

5. Click **Activate domain**
6. Wait for SSL certificate (usually 1-5 minutes)

---

## Step 4: Verify Custom Domain

1. Visit: https://interview.clementadegbenro.com
2. Confirm HTTPS works (padlock icon)
3. Test PWA installation on the custom domain

---

## Step 5: Configure Redirects (Optional)

To redirect the `.pages.dev` URL to your custom domain, create a `_redirects` file:

```
# Redirect pages.dev to custom domain
https://star-interview-flashcards.pages.dev/* https://interview.clementadegbenro.com/:splat 301
```

Save this file in the project root and push to GitHub.

---

## Automatic Deployments

After setup, every push to `main` will automatically deploy:

```bash
git add -A
git commit -m "Update content"
git push origin main
# Cloudflare auto-deploys in ~30 seconds
```

---

## Troubleshooting

### SSL Certificate Pending
- Wait up to 15 minutes for certificate provisioning
- Ensure DNS is proxied through Cloudflare (orange cloud)

### 404 Errors
- Verify build output directory is `/` (not `dist` or `build`)
- Check that `index.html` is in the root

### Service Worker Issues
- Clear browser cache after deployment
- Verify `sw.js` is being served from root

---

## Summary

| Item | Value |
|------|-------|
| Repository | github.com/Clementjatts/star-interview-flashcards |
| Cloudflare Project | star-interview-flashcards |
| Production URL | https://interview.clementadegbenro.com |
| Staging URL | https://star-interview-flashcards.pages.dev |

---

🎉 **Done!** Your STAR Interview Flashcards are live at `interview.clementadegbenro.com`
