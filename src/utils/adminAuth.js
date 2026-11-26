const AUTH_SALT = 'e7c0fcc826eeaf23c568a74d0256bd0a';
const AUTH_DIGEST = '8cb596ce8e52539f6083c829341120bf345fd364ecdfa2805855e1f6a1d4c7dc';
const AUTH_ROUNDS = 10000;

const SESSION_KEY = 'cms_admin_session_v1';
const LOCKOUT_KEY = 'cms_admin_lockout_v1';
const SESSION_TTL_MS = 4 * 60 * 60 * 1000; // 4 hours
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds

const SHA256_K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

const SHA256_INIT = [
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
  0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
];

function rotr(val, bits) {
  return (val >>> bits) | (val << (32 - bits));
}

function sha256Bytes(input) {
  const bitLen = input.length * 8;
  const paddedLen = Math.ceil((input.length + 9) / 64) * 64;
  const padded = new Uint8Array(paddedLen);
  padded.set(input);
  padded[input.length] = 0x80;

  const view = new DataView(padded.buffer);
  view.setUint32(paddedLen - 8, Math.floor(bitLen / 0x100000000), false);
  view.setUint32(paddedLen - 4, bitLen >>> 0, false);

  let [h0, h1, h2, h3, h4, h5, h6, h7] = SHA256_INIT;
  const w = new Uint32Array(64);

  for (let offset = 0; offset < paddedLen; offset += 64) {
    for (let i = 0; i < 16; i++) {
      w[i] = view.getUint32(offset + i * 4, false);
    }
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }

    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;
    let f = h5;
    let g = h6;
    let h = h7;

    for (let i = 0; i < 64; i++) {
      const s1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + s1 + ch + SHA256_K[i] + w[i]) >>> 0;
      const s0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (s0 + maj) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
    h5 = (h5 + f) >>> 0;
    h6 = (h6 + g) >>> 0;
    h7 = (h7 + h) >>> 0;
  }

  const out = new Uint8Array(32);
  const outView = new DataView(out.buffer);
  outView.setUint32(0, h0, false);
  outView.setUint32(4, h1, false);
  outView.setUint32(8, h2, false);
  outView.setUint32(12, h3, false);
  outView.setUint32(16, h4, false);
  outView.setUint32(20, h5, false);
  outView.setUint32(24, h6, false);
  outView.setUint32(28, h7, false);
  return out;
}

function bytesToHex(bytes) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function deriveCredentialDigest(username, password) {
  const encoder = new TextEncoder();
  let buf = encoder.encode(`${AUTH_SALT}\0${username}\0${password}`);
  for (let i = 0; i < AUTH_ROUNDS; i++) {
    buf = sha256Bytes(buf);
  }
  return bytesToHex(buf);
}

function computeSessionProof(digest, expiresAt) {
  const encoder = new TextEncoder();
  return bytesToHex(sha256Bytes(encoder.encode(`${digest}:${AUTH_SALT}:${expiresAt}`)));
}

function readLockoutState() {
  try {
    const raw = localStorage.getItem(LOCKOUT_KEY);
    if (!raw) return { attempts: 0, lockedUntil: 0 };
    const parsed = JSON.parse(raw);
    return {
      attempts: typeof parsed.attempts === 'number' ? parsed.attempts : 0,
      lockedUntil: typeof parsed.lockedUntil === 'number' ? parsed.lockedUntil : 0,
    };
  } catch {
    return { attempts: 0, lockedUntil: 0 };
  }
}

function writeLockoutState(state) {
  try {
    localStorage.setItem(LOCKOUT_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

export function getLockoutRemainingSeconds() {
  const { lockedUntil } = readLockoutState();
  const remaining = lockedUntil - Date.now();
  return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
}

export function isAdminAuthenticated() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (typeof parsed.expiresAt !== 'number' || typeof parsed.proof !== 'string') {
      return false;
    }
    if (Date.now() > parsed.expiresAt) {
      sessionStorage.removeItem(SESSION_KEY);
      return false;
    }
    const expected = computeSessionProof(AUTH_DIGEST, parsed.expiresAt);
    return constantTimeEqual(parsed.proof, expected);
  } catch {
    return false;
  }
}

export function verifyAndCreateSession(username, password) {
  const lockedSeconds = getLockoutRemainingSeconds();
  if (lockedSeconds > 0) {
    return { ok: false, lockedSeconds, attemptsLeft: 0 };
  }

  const candidate = deriveCredentialDigest(username.trim(), password);
  if (constantTimeEqual(candidate, AUTH_DIGEST)) {
    const expiresAt = Date.now() + SESSION_TTL_MS;
    const proof = computeSessionProof(candidate, expiresAt);
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ expiresAt, proof }));
      localStorage.removeItem(LOCKOUT_KEY);
    } catch {
      // ignore storage errors
    }
    return { ok: true };
  }

  const prev = readLockoutState();
  const nextAttempts = prev.attempts + 1;
  if (nextAttempts >= MAX_FAILED_ATTEMPTS) {
    writeLockoutState({
      attempts: 0,
      lockedUntil: Date.now() + LOCKOUT_DURATION_MS,
    });
    return {
      ok: false,
      lockedSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
      attemptsLeft: 0,
    };
  }

  writeLockoutState({ attempts: nextAttempts, lockedUntil: 0 });
  return {
    ok: false,
    lockedSeconds: 0,
    attemptsLeft: MAX_FAILED_ATTEMPTS - nextAttempts,
  };
}

export function clearAdminSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore storage errors
  }
}
