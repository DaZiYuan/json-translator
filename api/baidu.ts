import { configAsync } from "../deps.ts";
import { crypto } from "https://deno.land/std@0.126.0/crypto/mod.ts";

export class trans_result {
  dst?: string;
  src?: string;
}

export class baidu_result {
  from?: string;
  to?: string;
  trans_result: trans_result[] = [];
}

export async function translate(query: string): Promise<baidu_result> {
  const from = "en";
  const to = "zh";

  const envConfig = await configAsync();
  const appid: string = envConfig.appid;
  const key: string = envConfig.secret;
  const salt = new Date().getTime().toString();
  const sign: string = await _MD5(appid + query + salt + key);

  const param = {
    q: query,
    appid,
    salt: salt,
    from: from,
    to: to,
    sign: sign,
  };
  const urlParams = new URLSearchParams(param);
  const url = `http://api.fanyi.baidu.com/api/trans/vip/translate?${urlParams}`;
  console.info("query:", query);
  console.info("url:", url);
  const resp = await fetch(url);
  return await resp.json();
}

export async function translate_json(json: string): Promise<string> {
  let _obj = JSON.parse(json);
  //if obj is string
  if (typeof _obj === "string") {
    _obj = {
      content: _obj,
    };
  }
  const contents = _GetContents(json);
  console.log(_obj, contents);
  const translateRes = await translate("\r\n" + contents.join("\r\n"));
  let i = 0;
  for (const pName in _obj) {
    _obj[pName] = translateRes.trans_result[i++].dst;
  }
  return JSON.stringify(_obj);
}

function _GetContents(json: string) {
  const _obj = JSON.parse(json);
  const contents = [];
  for (const pName in _obj) {
    contents.push(_obj[pName]);
  }
  return contents;
}

async function _MD5(message: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("MD5", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); //
  return hashHex;
}
