export default async function handler(req, res) {
  const { fid } = req.query;
  if (!fid) { res.status(400).end(); return; }

  let username = 'Genesis Holder';
  let displayName = 'Genesis Holder';
  let tokens = '0';
  let initial = 'G';

  try {
    const r = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
      headers: { 'api_key': '4D13DD4C-550D-45A6-B887-F83ABA4FF755' }
    });
    const d = await r.json();
    const user = d?.users?.[0];
    if (user) {
      username = '@' + user.username;
      displayName = user.display_name || username;
      initial = (user.display_name || user.username || 'G')[0].toUpperCase();
    }
  } catch(e) {}

  try {
    const bucket = Math.floor(parseInt(fid) / 100000);
    const r = await fetch(`https://hyper-rewards.vercel.app/data/r${bucket}.json`);
    const d = await r.json();
    tokens = Number(d[String(fid)] || 0).toLocaleString('en-US', {maximumFractionDigits: 2});
  } catch(e) {}

  const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#050510"/>
      <stop offset="100%" stop-color="#0a0a2e"/>
    </linearGradient>
    <linearGradient id="border" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#00f5ff"/>
      <stop offset="50%" stop-color="#a855f7"/>
      <stop offset="100%" stop-color="#ff2d9b"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="80" cy="60" r="2" fill="white" opacity="0.6"/>
  <circle cx="200" cy="30" r="1.5" fill="white" opacity="0.5"/>
  <circle cx="400" cy="80" r="2" fill="white" opacity="0.7"/>
  <circle cx="600" cy="40" r="1.5" fill="white" opacity="0.4"/>
  <circle cx="800" cy="70" r="2" fill="white" opacity="0.6"/>
  <circle cx="1000" cy="30" r="1.5" fill="white" opacity="0.5"/>
  <circle cx="1150" cy="80" r="2" fill="white" opacity="0.4"/>
  <circle cx="150" cy="550" r="1.5" fill="white" opacity="0.4"/>
  <circle cx="500" cy="580" r="2" fill="white" opacity="0.5"/>
  <circle cx="900" cy="560" r="1.5" fill="white" opacity="0.4"/>
  <path d="M0 500 Q300 470 600 500 Q900 530 1200 500" stroke="#00f5ff" stroke-width="2" fill="none" opacity="0.15"/>
  <path d="M0 530 Q300 505 600 530 Q900 555 1200 530" stroke="#a855f7" stroke-width="2" fill="none" opacity="0.12"/>
  <path d="M0 560 Q300 540 600 560 Q900 580 1200 560" stroke="#ff2d9b" stroke-width="1.5" fill="none" opacity="0.10"/>
  <text x="600" y="72" font-family="monospace" font-size="48" font-weight="900" fill="white" text-anchor="middle" letter-spacing="3">$HYPER</text>
  <text x="600" y="112" font-family="monospace" font-size="30" font-weight="700" fill="#00f5ff" text-anchor="middle">Rewards</text>
  <rect x="100" y="135" width="1000" height="375" rx="18" fill="url(#border)"/>
  <rect x="103" y="138" width="994" height="369" rx="16" fill="#08081e"/>
  <text x="160" y="182" font-family="monospace" font-size="11" fill="rgba(255,255,255,0.6)" letter-spacing="3">YOUR ALLOCATION</text>
  <circle cx="230" cy="258" r="50" fill="#0a0a2e" stroke="#00f5ff" stroke-width="2.5"/>
  <text x="230" y="268" font-family="monospace" font-size="36" font-weight="700" fill="#00f5ff" text-anchor="middle">${initial}</text>
  <text x="310" y="238" font-family="monospace" font-size="30" font-weight="700" fill="#00f5ff">${username}</text>
  <text x="310" y="272" font-family="sans-serif" font-size="16" fill="rgba(255,255,255,0.7)">${displayName} · FID: ${fid}</text>
  <rect x="140" y="308" width="920" height="155" rx="14" fill="rgba(0,15,40,0.8)" stroke="rgba(0,245,255,0.25)" stroke-width="1.5"/>
  <text x="600" y="348" font-family="monospace" font-size="11" fill="rgba(255,255,255,0.5)" text-anchor="middle" letter-spacing="3">TOKEN ALLOCATION</text>
  <text x="600" y="422" font-family="monospace" font-size="66" font-weight="900" fill="#00f5ff" text-anchor="middle">${tokens}</text>
  <text x="600" y="448" font-family="sans-serif" font-size="14" fill="rgba(255,255,255,0.55)" text-anchor="middle">$HYPER Tokens · FIP-19 Genesis</text>
  <text x="600" y="594" font-family="sans-serif" font-size="14" fill="rgba(255,255,255,0.45)" text-anchor="middle">Built by @3hundred · Based on Hypersnap by @cassie</text>
</svg>`;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'no-cache, no-store');
  res.status(200).send(svg);
}
