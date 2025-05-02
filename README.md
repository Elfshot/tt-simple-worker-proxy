# Dev Environment

Copy [.dev.vars.example](.dev.vars.example) to `.dev.vars` and fill in the values.

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

[wrangler.jsonc](wrangler.jsonc) is the configuration file for Cloudflare Workers. You can set up stuff there, see [https://developers.cloudflare.com/workers/wrangler/configuration/](https://developers.cloudflare.com/workers/wrangler/configuration/).

By default, there is a rate limiter with 7 requests per minute, you can change the `limit` to whatever. The only valid settings for `period` are `10` and `60` for seconds.
You can disable the rate limiter by setting `"RATE_LIMIT_ENABLED": "false"`.

The following is a manual deployment, you can link a GitHub repository to Cloudflare and set up automatic deployments.

```txt
bun run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
bun types
```
