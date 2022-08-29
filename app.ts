import { translate_json, translate } from "./api/baidu.ts";
import { Router, Application, staticFiles } from "./deps.ts";

function _isJson(str: string) {
  try {
    JSON.parse(str);
  } catch (_e) {
    console.log("json invalid", str);
    return false;
  }
  return true;
}

const router = new Router();
router.get("/api/baidu/:json", async (context) => {
  if (context.params && context.params.json) {
    const json = decodeURI(context.params.json);
    console.log("api/baidu/", json);
    if (!_isJson(json)) {
      context.response.body = "json is not valid";
      return;
    }

    const res = await translate_json(json);
    context.response.body = res;
  }
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
app.use(staticFiles("public"));

await app.listen({ port: 8000 });
