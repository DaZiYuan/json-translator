import { translate_json, translate } from "./api/baidu.ts";
import { Router, Application, staticFiles } from "./deps.ts";

const router = new Router();
router
  // .get("/", async (context) => {
  //   await context.send({
  //     root: `${Deno.cwd()}\\static`,
  //     index: "index.html",
  //   });
  // })
  .get("/api/baidu/:json", async (context) => {
    if (context.params && context.params.json) {
      // const res = await translate(context.params.json);
      const tmpJson = JSON.stringify(context.params.json);
      const res = await translate_json(tmpJson);
      context.response.body = res;
    }
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
app.use(staticFiles("public"));

await app.listen({ port: 8000 });
