export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const fid = searchParams.get('fid') || '';
  if (!fid) return Response.redirect('https://hyper-rewards.vercel.app', 302);

  let username = 'FID ' + fid;
  let displayName = 'Genesis Holder';
  let tokens = '0';

  try {
    const res = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
      headers: { 'api_key': '4D13DD4C-550D-45A6-B887-F83ABA4FF755' }
    });
    const d = await res.json();
    const user = d?.users?.[0];
    if (user) {
      username = '@' + user.username;
      displayName = user.display_name || 'Genesis Holder';
    }
  } catch(e) {}

  try {
    const bucket = Math.floor(parseInt(fid) / 100000);
    const r = await fetch(`https://hyper-rewards.vercel.app/data/r${bucket}.json`);
    const d = await r.json();
    tokens = Number(d[String(fid)] || 0).toLocaleString('en-US', {maximumFractionDigits: 2});
  } catch(e) {}

  const imageUrl = `https://hyper-rewards.vercel.app/api/og-image?fid=${fid}`;
  const miniappUrl = `https://hyper-rewards.vercel.app?fid=${fid}`;

  const miniappMeta = JSON.stringify({
    version: "next",
    imageUrl: imageUrl,
    button: {
      title: "Check My HYPER",
      action: {
        type: "launch_miniapp",
        url: miniappUrl,
        name: "HYPER Genesis Allocation",
        iconUrl: "https://hyper-rewards.vercel.app/og-image-v2.png",
        splashImageUrl: "https://hyper-rewards.vercel.app/og-image-v2.png",
        splashBackgroundColor: "#050510"
      }
    }
  });

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta property="og:title" content="${username} got ${tokens} $HYPER!" />
<meta property="og:description" content="Check your $HYPER Genesis allocation. Built by @3hundred" />
<meta property="og:image" content="${imageUrl}" />
<meta property="og:url" content="https://hyper-rewards.vercel.app/api/og?fid=${fid}" />
<meta name="fc:miniapp" content='${miniappMeta}' />
<title>${username} — ${tokens} $HYPER</title>
</head>
<body>
<script>
setTimeout(()=>{ window.location.href='https://hyper-rewards.vercel.app?fid=${fid}'; }, 2000);
</script>
</body>
</html>`;

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
