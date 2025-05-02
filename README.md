# Dev Environment

```txt
bun install
bun run dev
```

# Deploying

Run the following to get secrets into your cloudflare environment:
This can also be done on the Variables and Secrets page of the Cloudflare dashboard after first deployment.

```txt
bunx wrangler secret put DEFAULT_TYCOON_PRIVATE
bunx wrangler secret put DEFAULT_TYCOON_PUBLIC
```

This is a manual deployment, you can link a GitHub repository to Cloudflare and set up automatic deployments.

```txt
bun run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
bun types
```
