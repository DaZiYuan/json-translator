import { Router, Application, staticFiles } from "./deps.ts";

const router = new Router();
router
  // .get("/", async (context) => {
  //   await context.send({
  //     root: `${Deno.cwd()}\\static`,
  //     index: "index.html",
  //   });
  // })
  .get("/api/baidu/:json", (context) => {
    if (context.params && context.params.json) {
      context.response.body = context.params.json + "2";
    }
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
app.use(staticFiles("public"));

await app.listen({ port: 8000 });
