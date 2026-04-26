export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const fid = searchParams.get('fid') || '';

  let username = 'Genesis Holder';
  let displayName = 'Genesis Holder';
  let tokens = '0';
  let pfpUrl = '';

  try {
    const res = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
      headers: { 'api_key': '4D13DD4C-550D-45A6-B887-F83ABA4FF755' }
    });
    const d = await res.json();
    const user = d?.users?.[0];
    if (user) {
      username = '@' + user.username;
      displayName = user.display_name || username;
      pfpUrl = user.pfp_url || '';
    }
  } catch(e) {}

  try {
    const bucket = Math.floor(parseInt(fid) / 100000);
    const r = await fetch(`https://hyper-rewards.vercel.app/data/r${bucket}.json`);
    const d = await r.json();
    tokens = Number(d[String(fid)] || 0).toLocaleString('en-US', {maximumFractionDigits: 2});
  } catch(e) {}

  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#050510"/>
      <stop offset="100%" style="stop-color:#0a0a2e"/>
    </linearGradient>
    <linearGradient id="border" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#00f5ff"/>
      <stop offset="50%" style="stop-color:#a855f7"/>
      <stop offset="100%" style="stop-color:#ff2d9b"/>
    </linearGradient>
    <linearGradient id="card" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#08081e"/>
      <stop offset="100%" style="stop-color:#0d0d30"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Stars -->
  <circle cx="100" cy="50" r="1.5" fill="white" opacity="0.6"/>
  <circle cx="300" cy="120" r="1" fill="white" opacity="0.4"/>
  <circle cx="500" cy="30" r="2" fill="white" opacity="0.7"/>
  <circle cx="700" cy="80" r="1.5" fill="white" opacity="0.5"/>
  <circle cx="900" cy="40" r="1" fill="white" opacity="0.6"/>
  <circle cx="1100" cy="100" r="2" fill="white" opacity="0.4"/>
  <circle cx="150" cy="200" r="1" fill="white" opacity="0.5"/>
  <circle cx="450" cy="180" r="1.5" fill="white" opacity="0.6"/>
  <circle cx="800" cy="150" r="1" fill="white" opacity="0.4"/>
  <circle cx="1050" cy="250" r="2" fill="white" opacity="0.5"/>
  <circle cx="200" cy="500" r="1.5" fill="white" opacity="0.4"/>
  <circle cx="600" cy="550" r="1" fill="white" opacity="0.6"/>
  <circle cx="950" cy="480" r="2" fill="white" opacity="0.5"/>
  <circle cx="50" cy="400" r="1" fill="white" opacity="0.7"/>
  <circle cx="1150" cy="400" r="1.5" fill="white" opacity="0.4"/>

  <!-- Wave lines -->
  <path d="M0 420 Q150 380 300 420 Q450 460 600 420 Q750 380 900 420 Q1050 460 1200 420" stroke="#00f5ff" stroke-width="2" fill="none" opacity="0.15"/>
  <path d="M0 460 Q200 420 400 460 Q600 500 800 460 Q1000 420 1200 460" stroke="#a855f7" stroke-width="2" fill="none" opacity="0.12"/>
  <path d="M0 500 Q180 460 360 500 Q540 540 720 500 Q900 460 1080 500 Q1140 520 1200 500" stroke="#ff2d9b" stroke-width="1.5" fill="none" opacity="0.10"/>
  <path d="M0 540 Q250 510 500 540 Q750 570 1000 540 Q1100 525 1200 540" stroke="#00f5ff" stroke-width="1" fill="none" opacity="0.08"/>

  <!-- Title -->
  <text x="600" y="70" font-family="monospace" font-size="42" font-weight="900" fill="white" text-anchor="middle" letter-spacing="3">$HYPER</text>
  <text x="600" y="110" font-family="monospace" font-size="28" font-weight="700" fill="#00f5ff" text-anchor="middle">Rewards</text>

  <!-- Card border -->
  <rect x="160" y="140" width="880" height="350" rx="18" fill="url(#border)"/>
  <!-- Card inner -->
  <rect x="163" y="143" width="874" height="344" rx="16" fill="url(#card)"/>

  <!-- YOUR ALLOCATION label -->
  <text x="220" y="185" font-family="monospace" font-size="11" fill="rgba(255,255,255,0.6)" letter-spacing="2">YOUR ALLOCATION</text>

  <!-- PFP circle -->
  <circle cx="270" cy="255" r="45" fill="#0a0a2e" stroke="#00f5ff" stroke-width="2"/>
  <text x="270" y="263" font-family="monospace" font-size="28" fill="#00f5ff" text-anchor="middle">${username.charAt(0).toUpperCase()}</text>

  <!-- Username -->
  <text x="340" y="238" font-family="monospace" font-size="26" font-weight="700" fill="#00f5ff">${username}</text>
  <text x="340" y="268" font-family="sans-serif" font-size="16" fill="rgba(255,255,255,0.7)">${displayName} · FID: ${fid}</text>

  <!-- Allocation box -->
  <rect x="200" y="300" width="800" height="130" rx="12" fill="rgba(0,15,40,0.8)" stroke="rgba(0,245,255,0.3)" stroke-width="1"/>
  <text x="600" y="335" font-family="monospace" font-size="11" fill="rgba(255,255,255,0.5)" text-anchor="middle" letter-spacing="2">TOKEN ALLOCATION</text>
  <text x="600" y="395" font-family="monospace" font-size="58" font-weight="900" fill="#00f5ff" text-anchor="middle">${tokens}</text>
  <text x="600" y="420" font-family="sans-serif" font-size="14" fill="rgba(255,255,255,0.6)" text-anchor="middle">$HYPER Tokens · FIP-19 Genesis</text>

  <!-- Footer -->
  <text x="600" y="565" font-family="sans-serif" font-size="14" fill="rgba(255,255,255,0.5)" text-anchor="middle">Built by <tspan fill="#00f5ff">@3hundred</tspan> · Based on Hypersnap by <tspan fill="#00f5ff">@cassie</tspan></text>
</svg>`;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache, no-store'
    }
  });
}
