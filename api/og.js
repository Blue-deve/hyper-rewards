export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const fid = searchParams.get('fid') || '';
  if (!fid) return Response.redirect('https://hyper-rewards.vercel.app', 302);

  let username = 'FID ' + fid;
  let displayName = 'Genesis Holder';
  let pfpUrl = '';
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
      pfpUrl = `https://unavatar.io/farcaster/${user.username}`;
    }
  } catch(e) {}

  try {
    const bucket = Math.floor(parseInt(fid) / 100000);
    const r = await fetch(`https://hyper-rewards.vercel.app/data/r${bucket}.json`);
    const d = await r.json();
    tokens = Number(d[String(fid)] || 0).toLocaleString('en-US', {maximumFractionDigits: 2});
  } catch(e) {}

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta property="og:title" content="${username} got ${tokens} $HYPER!" />
<meta property="og:description" content="Check your $HYPER Genesis allocation. Built by @3hundred" />
<meta property="og:image" content="https://hyper-rewards.vercel.app/og-image-v2.png" />
<meta property="og:url" content="https://hyper-rewards.vercel.app/api/og?fid=${fid}" />
<meta name="fc:miniapp" content='{"version":"next",'imageUrl":"https://hyper-rewards.vercel.app/api/og-image?fid=${fid}',"button":{"title":"Check My HYPER","action":{"type":"launch_miniapp","url":"https://hyper-rewards.vercel.app?fid=${fid}","name":"HYPER Genesis Allocation","iconUrl":"https://hyper-rewards.vercel.app/og-image-v2.png","splashImageUrl":"https://hyper-rewards.vercel.app/og-image-v2.png","splashBackgroundColor":"#050510"}}}' />
<title>${username} — ${tokens} $HYPER</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{background:#050510;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'Orbitron',monospace;overflow:hidden;position:relative}
canvas{position:absolute;top:0;left:0;width:100%;height:100%;z-index:0}
.stars{position:absolute;top:0;left:0;width:100%;height:100%;z-index:0}
.star{position:absolute;background:#fff;border-radius:50%;animation:twinkle 3s infinite alternate}
@keyframes twinkle{0%{opacity:0.1}100%{opacity:0.8}}
.wrap{position:relative;z-index:10;width:480px;max-width:90%;margin:0 auto}
.title-area{text-align:center;margin-bottom:18px}
.title-area h1{font-family:'Orbitron',monospace;font-size:32px;font-weight:900;color:#fff;letter-spacing:2px}
.title-area h2{font-family:'Rajdhani',sans-serif;font-size:26px;font-weight:700;color:#00f5ff;margin-top:-2px}
.title-area p{font-family:'Rajdhani',sans-serif;font-size:13px;color:rgba(255,255,255,0.6);margin-top:4px}
.card{background:rgba(8,8,30,0.88);border-radius:18px;padding:24px;position:relative}
.card::before{content:'';position:absolute;inset:-1.5px;border-radius:19px;background:linear-gradient(135deg,#00f5ff,#a855f7,#ff2d9b);z-index:-1}
.label{font-family:'Orbitron',monospace;font-size:10px;font-weight:700;color:rgba(255,255,255,0.6);letter-spacing:2px;margin-bottom:14px}
.user-row{display:flex;align-items:center;gap:14px;margin-bottom:18px}
.pfp-wrap{position:relative;width:68px;height:68px;flex-shrink:0}
.pfp-wrap img{width:62px;height:62px;border-radius:50%;border:2px solid #00f5ff;object-fit:cover;position:absolute;top:3px;left:3px}
.pfp-ring{position:absolute;inset:0;border-radius:50%;border:2px solid transparent;border-top-color:#00f5ff;border-right-color:#a855f7;animation:spin 2s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.user-info h3{font-family:'Orbitron',monospace;font-size:18px;font-weight:700;color:#00f5ff}
.user-info p{font-family:'Rajdhani',sans-serif;font-size:14px;color:rgba(255,255,255,0.7);margin-top:2px}
.alloc-box{background:rgba(0,15,40,0.7);border:1px solid rgba(0,245,255,0.2);border-radius:12px;padding:18px;text-align:center;margin-bottom:16px}
.alloc-label{font-family:'Orbitron',monospace;font-size:9px;color:rgba(255,255,255,0.5);letter-spacing:2px;margin-bottom:6px}
.alloc-num{font-family:'Orbitron',monospace;font-size:38px;font-weight:900;color:#00f5ff}
.alloc-sub{font-family:'Rajdhani',sans-serif;font-size:12px;color:rgba(255,255,255,0.6);margin-top:4px}
.footer{text-align:center;margin-top:12px;font-family:'Rajdhani',sans-serif;font-size:12px;color:rgba(255,255,255,0.5)}
.footer span{color:#00f5ff}
</style>
</head>
<body>
<div class="stars" id="stars"></div>
<canvas id="bg"></canvas>
<div class="wrap">
  <div class="title-area">
    <h1>$HYPER</h1>
    <h2>Rewards</h2>
    <p>Check your token allocation · Top holders · Countdown</p>
  </div>
  <div class="card">
    <div class="label">YOUR ALLOCATION</div>
    <div class="user-row">
      <div class="pfp-wrap">
        <img src="${pfpUrl}" referrerpolicy="no-referrer" onerror="this.style.display='none'">
        <div class="pfp-ring"></div>
      </div>
      <div class="user-info">
        <h3>${username}</h3>
        <p>${displayName} · FID: ${fid}</p>
      </div>
    </div>
    <div class="alloc-box">
      <div class="alloc-label">TOKEN ALLOCATION</div>
      <div class="alloc-num">${tokens}</div>
      <div class="alloc-sub">$HYPER Tokens · FIP-19 Genesis</div>
    </div>
  </div>
  <div class="footer">Built by <span>@3hundred</span> · Based on Hypersnap by <span>@cassie</span></div>
</div>
<script>
const canvas=document.getElementById('bg');
const ctx=canvas.getContext('2d');
function resize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}
resize();window.addEventListener('resize',resize);
const waves=[
  {color:'#00f5ff',amp:55,freq:0.012,speed:0.018,phase:0,y:0.65,alpha:0.15,width:5},
  {color:'#ff2d9b',amp:40,freq:0.018,speed:0.022,phase:2,y:0.78,alpha:0.12,width:4},
  {color:'#a855f7',amp:65,freq:0.009,speed:0.014,phase:4,y:0.72,alpha:0.10,width:6},
];
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  waves.forEach(w=>{
    w.phase+=w.speed;
    ctx.beginPath();ctx.moveTo(0,canvas.height*w.y);
    for(let x=0;x<=canvas.width;x+=2)ctx.lineTo(x,canvas.height*w.y+Math.sin(x*w.freq+w.phase)*w.amp);
    ctx.strokeStyle=w.color;ctx.globalAlpha=w.alpha;ctx.lineWidth=w.width;
    ctx.shadowColor=w.color;ctx.shadowBlur=15;ctx.stroke();ctx.globalAlpha=1;ctx.shadowBlur=0;
  });
  requestAnimationFrame(draw);
}
draw();
const st=document.getElementById('stars');
for(let i=0;i<80;i++){
  const s=document.createElement('div');s.className='star';
  const sz=Math.random()*2+1;
  s.style.cssText='width:'+sz+'px;height:'+sz+'px;top:'+Math.random()*100+'%;left:'+Math.random()*100+'%;animation-delay:'+Math.random()*3+'s;animation-duration:'+(2+Math.random()*3)+'s;';
  st.appendChild(s);
}
setTimeout(()=>{ window.location.href='https://hyper-rewards.vercel.app?fid=${fid}'; }, 3000);
</script>
</body>
</html>`;

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
