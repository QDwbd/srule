const scriptName = 'WeTalk';
const storeKey = 'wetalk_accounts_v1';
const SECRET = '0fOiukQq7jXZV2GRi9LGlO';
const API_HOST = 'api.wetalkapp.com';
const MAX_VIDEO = 5;
const VIDEO_DELAY = 8000;
const ACCOUNT_GAP = 3500;
const HTTP_TIMEOUT = 20000;
const CAPTURE_WATCHDOG = 30000;
const CRON_WATCHDOG = 240000;
const SCRIPT_VERSION = '2026.06.06-loon.4';
let finished = false;
let watchdogTimer = null;
const activeTimers = [];
function trackTimer(callback, ms) {
  const id = setTimeout(function() {
    clearTrackedTimer(id);
    callback();
  }, ms);
  activeTimers.push(id);
  return id;
}
function clearTrackedTimer(id) {
  clearTimeout(id);
  const index = activeTimers.indexOf(id);
  if (index >= 0) activeTimers.splice(index, 1);
}
function clearAllTimers() {
  while (activeTimers.length) clearTimeout(activeTimers.pop());
}
const IOS_VERSIONS = ['17.5.1', '17.6.1', '17.4.1', '17.2.1', '16.7.8', '17.6', '17.3.1', '18.0.1', '17.1.2', '16.6.1'];
const IOS_SCALES = ['2.00', '3.00', '3.00', '2.00', '3.00'];
const IPHONE_MODELS = ['iPhone14,3', 'iPhone13,3', 'iPhone15,3', 'iPhone16,1', 'iPhone14,7', 'iPhone13,2', 'iPhone15,2', 'iPhone12,1'];
const CFN_VERS = ['1410.0.3', '1494.0.7', '1568.100.1', '1209.1', '1474.0.4', '1568.200.2'];
const DARWIN_VERS = ['22.6.0', '23.5.0', '23.6.0', '24.0.0', '22.4.0'];
function MD5(string) {
  function rotateLeft(value, shiftBits) {
    return (value << shiftBits) | (value >>> (32 - shiftBits));
  }
  function addUnsigned(x, y) {
    const x4 = x & 0x40000000;
    const y4 = y & 0x40000000;
    const x8 = x & 0x80000000;
    const y8 = y & 0x80000000;
    const result = (x & 0x3FFFFFFF) + (y & 0x3FFFFFFF);
    if (x4 & y4) return result ^ 0x80000000 ^ x8 ^ y8;
    if (x4 | y4) {
      return (result & 0x40000000) ? (result ^ 0xC0000000 ^ x8 ^ y8) : (result ^ 0x40000000 ^ x8 ^ y8);
    }
    return result ^ x8 ^ y8;
  }
  function f(x, y, z) { return (x & y) | ((~x) & z); }
  function g(x, y, z) { return (x & z) | (y & (~z)); }
  function h(x, y, z) { return x ^ y ^ z; }
  function i(x, y, z) { return y ^ (x | (~z)); }
  function ff(a, b, c, d, x, s, ac) { a = addUnsigned(a, addUnsigned(addUnsigned(f(b, c, d), x), ac)); return addUnsigned(rotateLeft(a, s), b); }
  function gg(a, b, c, d, x, s, ac) { a = addUnsigned(a, addUnsigned(addUnsigned(g(b, c, d), x), ac)); return addUnsigned(rotateLeft(a, s), b); }
  function hh(a, b, c, d, x, s, ac) { a = addUnsigned(a, addUnsigned(addUnsigned(h(b, c, d), x), ac)); return addUnsigned(rotateLeft(a, s), b); }
  function ii(a, b, c, d, x, s, ac) { a = addUnsigned(a, addUnsigned(addUnsigned(i(b, c, d), x), ac)); return addUnsigned(rotateLeft(a, s), b); }
  function convertToWordArray(str) {
    const messageLength = str.length;
    const wordsTemp1 = messageLength + 8;
    const wordsTemp2 = (wordsTemp1 - (wordsTemp1 % 64)) / 64;
    const numberOfWords = (wordsTemp2 + 1) * 16;
    const wordArray = [];
    let bytePosition = 0;
    let byteCount = 0;
    for (let x = 0; x < numberOfWords; x++) wordArray[x] = 0;
    while (byteCount < messageLength) {
      const wordCount = (byteCount - (byteCount % 4)) / 4;
      bytePosition = (byteCount % 4) * 8;
      wordArray[wordCount] |= str.charCodeAt(byteCount) << bytePosition;
      byteCount++;
    }
    const wordCount = (byteCount - (byteCount % 4)) / 4;
    bytePosition = (byteCount % 4) * 8;
    wordArray[wordCount] |= 0x80 << bytePosition;
    wordArray[numberOfWords - 2] = messageLength << 3;
    wordArray[numberOfWords - 1] = messageLength >>> 29;
    return wordArray;
  }
  function wordToHex(value) {
    let hexValue = '';
    for (let count = 0; count <= 3; count++) {
      const byte = (value >>> (count * 8)) & 255;
      const temp = '0' + byte.toString(16);
      hexValue += temp.substr(temp.length - 2, 2);
    }
    return hexValue;
  }
  const x = convertToWordArray(string);
  let a = 0x67452301;
  let b = 0xEFCDAB89;
  let c = 0x98BADCFE;
  let d = 0x10325476;
  const s11 = 7;
  const s12 = 12;
  const s13 = 17;
  const s14 = 22;
  const s21 = 5;
  const s22 = 9;
  const s23 = 14;
  const s24 = 20;
  const s31 = 4;
  const s32 = 11;
  const s33 = 16;
  const s34 = 23;
  const s41 = 6;
  const s42 = 10;
  const s43 = 15;
  const s44 = 21;
  for (let k = 0; k < x.length; k += 16) {
    const aa = a;
    const bb = b;
    const cc = c;
    const dd = d;
    a = ff(a, b, c, d, x[k + 0], s11, 0xD76AA478); d = ff(d, a, b, c, x[k + 1], s12, 0xE8C7B756);
    c = ff(c, d, a, b, x[k + 2], s13, 0x242070DB); b = ff(b, c, d, a, x[k + 3], s14, 0xC1BDCEEE);
    a = ff(a, b, c, d, x[k + 4], s11, 0xF57C0FAF); d = ff(d, a, b, c, x[k + 5], s12, 0x4787C62A);
    c = ff(c, d, a, b, x[k + 6], s13, 0xA8304613); b = ff(b, c, d, a, x[k + 7], s14, 0xFD469501);
    a = ff(a, b, c, d, x[k + 8], s11, 0x698098D8); d = ff(d, a, b, c, x[k + 9], s12, 0x8B44F7AF);
    c = ff(c, d, a, b, x[k + 10], s13, 0xFFFF5BB1); b = ff(b, c, d, a, x[k + 11], s14, 0x895CD7BE);
    a = ff(a, b, c, d, x[k + 12], s11, 0x6B901122); d = ff(d, a, b, c, x[k + 13], s12, 0xFD987193);
    c = ff(c, d, a, b, x[k + 14], s13, 0xA679438E); b = ff(b, c, d, a, x[k + 15], s14, 0x49B40821);
    a = gg(a, b, c, d, x[k + 1], s21, 0xF61E2562); d = gg(d, a, b, c, x[k + 6], s22, 0xC040B340);
    c = gg(c, d, a, b, x[k + 11], s23, 0x265E5A51); b = gg(b, c, d, a, x[k + 0], s24, 0xE9B6C7AA);
    a = gg(a, b, c, d, x[k + 5], s21, 0xD62F105D); d = gg(d, a, b, c, x[k + 10], s22, 0x02441453);
    c = gg(c, d, a, b, x[k + 15], s23, 0xD8A1E681); b = gg(b, c, d, a, x[k + 4], s24, 0xE7D3FBC8);
    a = gg(a, b, c, d, x[k + 9], s21, 0x21E1CDE6); d = gg(d, a, b, c, x[k + 14], s22, 0xC33707D6);
    c = gg(c, d, a, b, x[k + 3], s23, 0xF4D50D87); b = gg(b, c, d, a, x[k + 8], s24, 0x455A14ED);
    a = gg(a, b, c, d, x[k + 13], s21, 0xA9E3E905); d = gg(d, a, b, c, x[k + 2], s22, 0xFCEFA3F8);
    c = gg(c, d, a, b, x[k + 7], s23, 0x676F02D9); b = gg(b, c, d, a, x[k + 12], s24, 0x8D2A4C8A);
    a = hh(a, b, c, d, x[k + 5], s31, 0xFFFA3942); d = hh(d, a, b, c, x[k + 8], s32, 0x8771F681);
    c = hh(c, d, a, b, x[k + 11], s33, 0x6D9D6122); b = hh(b, c, d, a, x[k + 14], s34, 0xFDE5380C);
    a = hh(a, b, c, d, x[k + 1], s31, 0xA4BEEA44); d = hh(d, a, b, c, x[k + 4], s32, 0x4BDECFA9);
    c = hh(c, d, a, b, x[k + 7], s33, 0xF6BB4B60); b = hh(b, c, d, a, x[k + 10], s34, 0xBEBFBC70);
    a = hh(a, b, c, d, x[k + 13], s31, 0x289B7EC6); d = hh(d, a, b, c, x[k + 0], s32, 0xEAA127FA);
    c = hh(c, d, a, b, x[k + 3], s33, 0xD4EF3085); b = hh(b, c, d, a, x[k + 6], s34, 0x04881D05);
    a = hh(a, b, c, d, x[k + 9], s31, 0xD9D4D039); d = hh(d, a, b, c, x[k + 12], s32, 0xE6DB99E5);
    c = hh(c, d, a, b, x[k + 15], s33, 0x1FA27CF8); b = hh(b, c, d, a, x[k + 2], s34, 0xC4AC5665);
    a = ii(a, b, c, d, x[k + 0], s41, 0xF4292244); d = ii(d, a, b, c, x[k + 7], s42, 0x432AFF97);
    c = ii(c, d, a, b, x[k + 14], s43, 0xAB9423A7); b = ii(b, c, d, a, x[k + 5], s44, 0xFC93A039);
    a = ii(a, b, c, d, x[k + 12], s41, 0x655B59C3); d = ii(d, a, b, c, x[k + 3], s42, 0x8F0CCC92);
    c = ii(c, d, a, b, x[k + 10], s43, 0xFFEFF47D); b = ii(b, c, d, a, x[k + 1], s44, 0x85845DD1);
    a = ii(a, b, c, d, x[k + 8], s41, 0x6FA87E4F); d = ii(d, a, b, c, x[k + 15], s42, 0xFE2CE6E0);
    c = ii(c, d, a, b, x[k + 6], s43, 0xA3014314); b = ii(b, c, d, a, x[k + 13], s44, 0x4E0811A1);
    a = ii(a, b, c, d, x[k + 4], s41, 0xF7537E82); d = ii(d, a, b, c, x[k + 11], s42, 0xBD3AF235);
    c = ii(c, d, a, b, x[k + 2], s43, 0x2AD7D2BB); b = ii(b, c, d, a, x[k + 9], s44, 0xEB86D391);
    a = addUnsigned(a, aa);
    b = addUnsigned(b, bb);
    c = addUnsigned(c, cc);
    d = addUnsigned(d, dd);
  }
  return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
}
function readStoreValue(key) {
  if (typeof $persistentStore !== 'undefined' && $persistentStore.read) return $persistentStore.read(key);
  if (typeof $prefs !== 'undefined' && $prefs.valueForKey) return $prefs.valueForKey(key);
  return null;
}
function writeStoreValue(key, value) {
  if (typeof $persistentStore !== 'undefined' && $persistentStore.write) return $persistentStore.write(value, key);
  if (typeof $prefs !== 'undefined' && $prefs.setValueForKey) return $prefs.setValueForKey(value, key);
  return false;
}
function httpGet(options) {
  return new Promise(function(resolve, reject) {
    let settled = false;
    const timeoutMs = options.timeout || HTTP_TIMEOUT;
    const timeoutId = trackTimer(function() {
      settleReject({ error: `HTTP timeout after ${timeoutMs}ms` });
    }, timeoutMs);
    function settleResolve(value) {
      if (settled) return;
      settled = true;
      clearTrackedTimer(timeoutId);
      resolve(value);
    }
    function settleReject(error) {
      if (settled) return;
      settled = true;
      clearTrackedTimer(timeoutId);
      reject(error);
    }
    if (typeof $httpClient !== 'undefined' && $httpClient.get) {
      const req = {
        url: options.url,
        headers: options.headers || {},
        timeout: timeoutMs
      };
      $httpClient.get(req, function(err, response, data) {
        if (err) {
          settleReject({ error: String(err) });
          return;
        }
        settleResolve({
          statusCode: response && (response.status || response.statusCode),
          headers: response && response.headers,
          body: data
        });
      });
      return;
    }
    if (typeof $task !== 'undefined' && $task.fetch) {
      $task.fetch(options).then(settleResolve).catch(settleReject);
      return;
    }
    settleReject({ error: 'No supported HTTP client API' });
  });
}
function log(message) {
  console.log(`[${scriptName}] ${new Date().toLocaleString()} ${message}`);
}
function noticeIcon(title) {
  const text = String(title || '');
  if (/失败|异常|超时/.test(text)) return '⚠️';
  if (/未抓到/.test(text)) return '🔎';
  if (/完成/.test(text)) return '🎀';
  if (/更新|入库|账号/.test(text)) return '💌';
  return '✨';
}
function noticeTitle(title) {
  const text = String(title || '');
  return `${noticeIcon(text)} ${text}`;
}
function notify(title, body) {
  const subtitle = noticeTitle(title);
  const content = body || '';
  log(`${subtitle}${content ? '\n' + content : ''}`);
  if (typeof $notification !== 'undefined' && $notification.post) {
    $notification.post(scriptName, subtitle, content);
  } else if (typeof $notify !== 'undefined') {
    $notify(scriptName, subtitle, content);
  }
}
function maskAccount(value) {
  const text = String(value || '');
  const at = text.indexOf('@');
  if (at > 1) return text.slice(0, 2) + '***' + text.slice(at);
  if (text.length > 8) return text.slice(0, 4) + '***' + text.slice(-4);
  return text || 'unknown';
}
function startWatchdog(ms, label) {
  if (watchdogTimer) return;
  watchdogTimer = trackTimer(function() {
    watchdogTimer = null;
    log(`${label} watchdog timeout, force finish`);
    notify('任务超时结束', `⏰ ${label} 超过 ${Math.round(ms / 1000)} 秒\n✨ 已主动结束，避免 Loon 一直运行中。`);
    done({});
  }, ms);
}
function done(value) {
  if (finished) return;
  finished = true;
  clearAllTimers();
  log('calling $done');
  if (typeof $done !== 'undefined') $done(value || {});
}
function getUTCSignDate() {
  const now = new Date();
  const pad = function(n) { return String(n).padStart(2, '0'); };
  return `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())} ${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}`;
}
function normalizeHeaderNameMap(headers) {
  const out = {};
  Object.keys(headers || {}).forEach(function(k) {
    out[k] = headers[k];
  });
  return out;
}
function parseRawQuery(url) {
  const query = (url.split('?')[1] || '').split('#')[0];
  const rawMap = {};
  query.split('&').forEach(function(pair) {
    if (!pair) return;
    const idx = pair.indexOf('=');
    if (idx < 0) return;
    const k = pair.slice(0, idx);
    const v = pair.slice(idx + 1);
    rawMap[k] = v;
  });
  return rawMap;
}
function safeDecode(value) {
  if (value == null) return '';
  try {
    return decodeURIComponent(String(value));
  } catch (e) {
    return String(value);
  }
}
function emailKeyOf(paramsRaw) {
  const raw = (paramsRaw || {}).email;
  if (!raw) return '';
  return safeDecode(raw).trim().toLowerCase();
}
function fingerprintOf(paramsRaw) {
  const email = emailKeyOf(paramsRaw);
  if (email) return email;
  const drop = { sign: 1, signDate: 1, timestamp: 1, ts: 1, nonce: 1, random: 1, reqTime: 1, reqId: 1, requestId: 1 };
  const base = Object.keys(paramsRaw || {}).filter(function(k) {
    return !drop[k];
  }).sort().map(function(k) {
    return `${k}=${paramsRaw[k]}`;
  }).join('&');
  return 'fp_' + MD5(base).slice(0, 12);
}
function migrateStore(store) {
  if (!store || !store.accounts) return store;
  const newAccounts = {};
  const newOrder = [];
  let migrated = false;
  (store.order || Object.keys(store.accounts)).forEach(function(oldId) {
    const acc = store.accounts[oldId];
    if (!acc) return;
    const email = emailKeyOf(acc.capture && acc.capture.paramsRaw);
    const newId = email || oldId;
    if (newId !== oldId) migrated = true;
    const prev = newAccounts[newId];
    if (!prev || (acc.updatedAt || 0) >= (prev.updatedAt || 0)) {
      newAccounts[newId] = Object.assign({}, acc, { id: newId, alias: acc.alias || email || newId });
      if (newOrder.indexOf(newId) < 0) newOrder.push(newId);
    }
  });
  if (migrated) {
    store.accounts = newAccounts;
    store.order = newOrder;
  }
  return store;
}
function loadStore() {
  const raw = readStoreValue(storeKey);
  if (!raw) return { version: 2, accounts: {}, order: [] };
  try {
    const obj = JSON.parse(raw);
    if (!obj.accounts) obj.accounts = {};
    if (!Array.isArray(obj.order)) obj.order = Object.keys(obj.accounts);
    return migrateStore(obj);
  } catch (e) {
    return { version: 2, accounts: {}, order: [] };
  }
}
function saveStore(store) {
  const ok = writeStoreValue(storeKey, JSON.stringify(store));
  log(`store write ${ok ? 'ok' : 'failed'}`);
  return ok;
}
function pickItem(arr, seed) {
  return arr[seed % arr.length];
}
function buildUA(baseUA, seed) {
  const iosVer = pickItem(IOS_VERSIONS, seed);
  const scale = pickItem(IOS_SCALES, seed + 1);
  const model = pickItem(IPHONE_MODELS, seed + 2);
  const cfn = pickItem(CFN_VERS, seed + 3);
  const darwin = pickItem(DARWIN_VERS, seed + 4);
  if (baseUA && typeof baseUA === 'string') {
    let ua = baseUA;
    let changed = false;
    if (/iOS \d+(\.\d+){0,2}/.test(ua)) { ua = ua.replace(/iOS \d+(\.\d+){0,2}/, `iOS ${iosVer}`); changed = true; }
    if (/Scale\/\d+(\.\d+)?/.test(ua)) { ua = ua.replace(/Scale\/\d+(\.\d+)?/, `Scale/${scale}`); changed = true; }
    if (/iPhone\d+,\d+/.test(ua)) { ua = ua.replace(/iPhone\d+,\d+/, model); changed = true; }
    if (/CFNetwork\/[\d.]+/.test(ua)) { ua = ua.replace(/CFNetwork\/[\d.]+/, `CFNetwork/${cfn}`); changed = true; }
    if (/Darwin\/[\d.]+/.test(ua)) { ua = ua.replace(/Darwin\/[\d.]+/, `Darwin/${darwin}`); changed = true; }
    if (changed) return ua;
  }
  return `WeTalk/30.6.0 (com.innovationworks.wetalk; build:28; iOS ${iosVer}) Alamofire/5.4.3`;
}
function buildSignedParamsRaw(capture, overrideDeviceId) {
  const params = {};
  Object.keys(capture.paramsRaw || {}).forEach(function(k) {
    if (k !== 'sign' && k !== 'signDate') params[k] = capture.paramsRaw[k];
  });
  if (overrideDeviceId && params.uniquedeviceid) {
    params.uniquedeviceid = overrideDeviceId;
  }
  params.signDate = getUTCSignDate();
  const signBase = Object.keys(params).sort().map(function(k) {
    return `${k}=${params[k]}`;
  }).join('&');
  params.sign = MD5(signBase + SECRET);
  return params;
}
function buildUrl(path, capture, overrideDeviceId) {
  const params = buildSignedParamsRaw(capture, overrideDeviceId);
  const qs = Object.keys(params).map(function(k) {
    return `${k}=${encodeURIComponent(params[k])}`;
  }).join('&');
  return `https://${API_HOST}/app/${path}?${qs}`;
}
function randHex(n) {
  let s = '';
  for (let i = 0; i < n; i++) s += Math.floor(Math.random() * 16).toString(16);
  return s.toUpperCase();
}
function genFakeDeviceId() {
  return `${randHex(8)}-${randHex(4)}-${randHex(4)}-${randHex(4)}-${randHex(12)}WeTalkIOS`;
}
function cloneHeaders(headers) {
  const out = {};
  Object.keys(headers || {}).forEach(function(k) {
    out[k] = headers[k];
  });
  return out;
}
function buildHeaders(capture, ua) {
  const headers = cloneHeaders(capture.headers || {});
  let hasAccept = false;
  Object.keys(headers).forEach(function(k) {
    const lk = k.toLowerCase();
    if (lk === 'accept') hasAccept = true;
    if (
      lk === 'content-length' ||
      lk === 'host' ||
      lk === ':authority' ||
      lk === ':method' ||
      lk === ':path' ||
      lk === ':scheme' ||
      lk === 'user-agent' ||
      lk === 'connection' ||
      lk === 'proxy-connection' ||
      lk === 'keep-alive'
    ) {
      delete headers[k];
    }
  });
  headers.Host = API_HOST;
  if (!hasAccept) headers.Accept = 'application/json';
  headers['User-Agent'] = ua;
  headers.Connection = 'close';
  return headers;
}
function sleep(ms) {
  return new Promise(function(resolve) {
    trackTimer(resolve, ms);
  });
}
function getBonus(result) {
  return result && result.bonus ? result.bonus : '?';
}
function getBonusHint(result) {
  return result && result.bonusHint ? result.bonusHint : '';
}
function runAccount(acc, index, total) {
  const accountName = acc.alias || acc.email || acc.id;
  const logName = maskAccount(accountName);
  const tag = `👤 [账号${index + 1}/${total} ${accountName}]`;
  const ua = buildUA(acc.baseUA, acc.uaSeed);
  const headers = buildHeaders(acc.capture, ua);
  const fakeDeviceId = genFakeDeviceId();
  const msgs = [tag];
  function fetchApi(path, useFakeId, retry) {
    retry = (retry === undefined) ? 3 : retry;
    const overrideId = useFakeId ? fakeDeviceId : null;
    const attempt = 4 - retry;
    const req = {
      url: buildUrl(path, acc.capture, overrideId),
      method: 'GET',
      headers: headers,
      timeout: 15000
    };
    log(`account ${index + 1}/${total} ${logName} -> ${path}, attempt=${attempt}${useFakeId ? ', fakeDevice=true' : ''}`);
    return httpGet(req).then(function(res) {
      log(`account ${index + 1}/${total} ${logName} <- ${path}, status=${res.statusCode || 'unknown'}`);
      return res;
    }).catch(function(err) {
      const m = (err && (err.error || String(err))) || '';
      if (retry > 0 && /SSL|SSLSessionState|timeout|timed out|reset|connection|network|stream closed|closed|EOF/i.test(m)) {
        log(`account ${index + 1}/${total} ${logName} retry ${path}, left=${retry - 1}, error=${m}`);
        return sleep(1200).then(function() {
          return fetchApi(path, useFakeId, retry - 1);
        });
      }
      log(`account ${index + 1}/${total} ${logName} failed ${path}, error=${m}`);
      return Promise.reject(err);
    });
  }
  function doVideoLoop(count) {
    let i = 0;
    function next() {
      if (i >= count) return Promise.resolve();
      return new Promise(function(resolve) {
        trackTimer(function() {
          i++;
          fetchApi('videoBonus', true).then(function(res) {
            try {
              const d = JSON.parse(res.body);
              log(`account ${index + 1}/${total} ${logName} video ${i}, retcode=${d.retcode}`);
              if (d.retcode === 0) {
                msgs.push(`🎬 视频${i}: +${getBonus(d.result)} Coins`);
                resolve(next());
              } else {
                msgs.push(`⏸️ 视频${i}: ${d.retmsg}`);
                resolve();
              }
            } catch (e) {
              msgs.push(`🧩 视频${i}: 解析失败`);
              resolve();
            }
          }).catch(function(err) {
            log(`account ${index + 1}/${total} ${logName} video ${i} stopped, error=${err.error || String(err)}`);
            msgs.push(`⚠️ 视频${i}: ${err.error || '请求失败'}`);
            resolve();
          });
        }, i === 0 ? 1500 : VIDEO_DELAY);
      });
    }
    return next();
  }
  return fetchApi('queryBalanceAndBonus').then(function(res) {
    try {
      const d = JSON.parse(res.body);
      log(`account ${index + 1}/${total} ${logName} queryBalanceAndBonus retcode=${d.retcode}`);
      if (d.retcode === 0) msgs.push(`💰 余额: ${d.result.balance} Coins`);
      else msgs.push(`🔎 查询: ${d.retmsg}`);
    } catch (e) {
      msgs.push('🧩 查询: 解析失败');
    }
    return fetchApi('checkIn');
  }).then(function(res) {
    try {
      const d = JSON.parse(res.body);
      log(`account ${index + 1}/${total} ${logName} checkIn retcode=${d.retcode}`);
      if (d.retcode === 0) msgs.push(`✅ 签到: ${(getBonusHint(d.result) || d.retmsg || '').replace(/\n/g, ' ')}`);
      else msgs.push(`⚠️ 签到: ${d.retmsg}`);
    } catch (e) {
      msgs.push('🧩 签到: 解析失败');
    }
    return doVideoLoop(MAX_VIDEO);
  }).then(function() {
    return fetchApi('queryBalanceAndBonus');
  }).then(function(res) {
    try {
      const d = JSON.parse(res.body);
      log(`account ${index + 1}/${total} ${logName} final query retcode=${d.retcode}`);
      if (d.retcode === 0) msgs.push(`💰 最新余额: ${d.result.balance} Coins`);
    } catch (e) {}
    log(`account ${index + 1}/${total} ${logName} done`);
    return msgs.join('\n');
  }).catch(function(err) {
    msgs.push(`⚠️ 异常: ${err.error || String(err)}`);
    log(`account ${index + 1}/${total} ${logName} done with error=${err.error || String(err)}`);
    return msgs.join('\n');
  });
}
function captureAccount() {
  startWatchdog(CAPTURE_WATCHDOG, 'HTTP request');
  log(`HTTP request mode start, version=${SCRIPT_VERSION}`);
  const paramsRaw = parseRawQuery($request.url);
  const headersMap = normalizeHeaderNameMap($request.headers || {});
  let baseUA = '';
  Object.keys(headersMap).forEach(function(k) {
    if (k.toLowerCase() === 'user-agent') baseUA = headersMap[k];
  });
  const email = emailKeyOf(paramsRaw);
  if (!email) {
    log('capture failed: email parameter missing');
    notify('抓取失败', '🔎 请求里未取到 email 参数\n📱 请确认已登录后再触发抓包。');
    done({});
    return;
  }
  const store = loadStore();
  const accId = email;
  const now = Date.now();
  const existed = !!store.accounts[accId];
  const uaSeed = existed ? store.accounts[accId].uaSeed : store.order.length;
  const alias = existed ? (store.accounts[accId].alias || email) : email;
  store.accounts[accId] = {
    id: accId,
    email: email,
    alias: alias,
    uaSeed: uaSeed,
    baseUA: baseUA,
    capture: { url: $request.url, paramsRaw: paramsRaw, headers: headersMap },
    createdAt: existed ? store.accounts[accId].createdAt : now,
    updatedAt: now
  };
  if (!existed) store.order.push(accId);
  saveStore(store);
  const total = store.order.length;
  notify(existed ? '账号参数已更新' : '新账号已入库', `📮 ${email}\n📦 当前账号总数: ${total}`);
  log(`${existed ? 'updated' : 'added'} account, total=${total}`);
  done({});
}
function runTask() {
  startWatchdog(CRON_WATCHDOG, 'CRON');
  log(`CRON mode start, version=${SCRIPT_VERSION}`);
  const store = loadStore();
  const ids = store.order.filter(function(id) {
    return store.accounts[id];
  });
  log(`stored accounts: ${ids.length}`);
  if (!ids.length) {
    notify('未抓到任何账号', '📱 请先打开 WeTalk 触发抓包\n💌 抓到后再运行签到任务。');
    done();
    return;
  }
  const total = ids.length;
  const results = [];
  let chain = Promise.resolve();
  ids.forEach(function(id, idx) {
    chain = chain.then(function() {
      log(`run account ${idx + 1}/${total}`);
      return runAccount(store.accounts[id], idx, total);
    }).then(function(text) {
      results.push(text);
    }).then(function() {
      return idx < ids.length - 1 ? sleep(ACCOUNT_GAP) : null;
    });
  });
  chain.then(function() {
    notify(`全部完成 (${total}个账号)`, results.join('\n🎀 --- 🎀\n'));
    done();
  }).catch(function(err) {
    notify('任务异常', results.join('\n🎀 --- 🎀\n') + '\n⚠️ ' + (err.error || String(err)));
    done();
  });
}
if (typeof $request !== 'undefined' && $request) {
  captureAccount();
} else {
  runTask();
}
