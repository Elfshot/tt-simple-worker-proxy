import { OpenAPIHono, z } from '@hono/zod-openapi'
import { createRoute } from '@hono/zod-openapi'

const servers = {
  main: 'http://server.tycoon.community:30120',
  beta: 'http://server.tycoon.community:30125',
};

const InputParamsSchema = z.object({
  server: z.literal('main').or(z.literal('beta')),
  // If you want to limit what routes are allowed, add literals as follows:
  // forward: z.union([
  //   z.literal('status/char.json'),
  //   z.literal('status/map/positions.json'),
  //   z.literal('status/widget/players.json'),
  // ])
  forward: z.string().min(1).max(100),

})

// The actual min/max values are arbitrary, and the headers themselves are optional
// Remove .optional() to mandate them for your routes
// [Note: this does not ensure the headers are correct, just that if present, they are well-formated]
const TycoonHeadersSchema = z.object({
  'X-Tycoon-Key': z.string().min(10).max(50).optional(),
  'X-Tycoon-Public-Key': z.string().min(12).max(30).regex(/^[1-9][0-9]{0,6}_.+$/).optional(),
})

// If you add more routes, you can serve docs too
// see https://hono.dev/examples/zod-openapi and https://hono.dev/examples/hono-openapi
const forwardRoute = createRoute({
  method: 'get',
  path: '/:server/:forward{.+}',
  request:{
    params: InputParamsSchema,
    headers: TycoonHeadersSchema
  },
  responses: {
    200: {
      description: "Proxied request to the transport tycoon api",
      // Most of the time it's json content, some routes are plain text
      content: {
        'application/json': {schema: z.any()}
      }
    },
    204: {
      description: "No content",
    }
  }
})

const app = new OpenAPIHono<{ Bindings: CloudflareBindings }>();
app.openapi(forwardRoute, async (c) => {
  const {server, forward} = c.req.valid("param");
  const headers = c.req.valid("header");

  const res = await fetch(`${servers[server]}/${forward}`, {
    method: 'GET',
    headers
  })

  if (res.ok === false) {
    const body = await res.text();
    console.error(`Error: ${res.status} ${body}`);
    return c.text(body, res.status as 400);
  }

    const body: any = await res.text();

    if (body)
      return c.text(body, res.status as 200);

    return c.body(null, 204);
  });

export default app;
