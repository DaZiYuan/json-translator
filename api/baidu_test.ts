import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";
import { translate_json, translate } from "./baidu.ts";

Deno.test("translate", async () => {
  const res = await translate("hello world");
  assertEquals(res.trans_result[0].dst, "你好，世界");
});

Deno.test("translate_json", async () => {
  const testJson = `{"does not work":"does not work","hello":"Hello"}`;
  const res = await translate_json(testJson);
  assertEquals(res, `{"does not work":"不起作用","hello":"你好"}`);
});
