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
  console.log("url:", url);
  const resp = await fetch(url);
  return await resp.json();
}

export async function translate_json(json: string): Promise<baidu_result> {
  const _obj = JSON.parse(json);
  const _tmpObj = _ReplaceKey(json);
  console.log("_tmpObj", _tmpObj);
  const tmpRes = await translate(_tmpObj.json);
  const new_trans_result: trans_result[] = [];
  for (const item of tmpRes.trans_result) {
    new_trans_result.push({
      dst: JSON.parse(_RestoreKey(JSON.stringify(item.dst), _tmpObj.map)),
      src: JSON.parse(_RestoreKey(JSON.stringify(item.src), _tmpObj.map)),
    });
  }
  console.log("111111111", tmpRes.trans_result);
  console.log("222222222222", new_trans_result);
  tmpRes.trans_result = new_trans_result;
  return tmpRes;
}

function _ReplaceKey(json: string) {
  const _obj = JSON.parse(json);
  const map: { [name: string]: string } = {};
  for (const pName in _obj) {
    console.log("t11111111111111111", pName, _obj);
    const uuid = crypto.getRandomValues(new Uint32Array(1))[0].toString();
    map[uuid] = pName;
    _obj[uuid] = _obj[pName];
    delete _obj[pName];
  }
  return {
    map,
    json: JSON.stringify(_obj),
  };
}

function _RestoreKey(json: string, map: { [name: string]: string }) {
  //replace “ to "
  json = json.replace(/“/g, '"');
  json = json.replace(/”/g, '"');

  const _obj = JSON.parse(json);
  for (const pName in _obj) {
    console.log("t222222222222222", pName, _obj, map[pName]);
    if (map[pName]) {
      const sourceKey = map[pName];
      _obj[sourceKey] = _obj[pName];
      console.log("sourceKey", sourceKey, _obj[pName]);
      delete _obj[pName];
    }
  }
  return JSON.stringify(_obj);
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
