import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const fid = searchParams.get('fid') || '';

  let username = 'Genesis Holder';
  let displayName = 'Genesis Holder';
  let tokens = '0';
  let pfpUrl = '';
  let initial = 'G';

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
      initial = (user.display_name || user.username || 'G')[0].toUpperCase();
    }
  } catch(e) {}

  try {
    const bucket = Math.floor(parseInt(fid) / 100000);
    const r = await fetch(`https://hyper-rewards.vercel.app/data/r${bucket}.json`);
    const d = await r.json();
    tokens = Number(d[String(fid)] || 0).toLocaleString('en-US', {maximumFractionDigits: 2});
  } catch(e) {}

  return new ImageResponse(
    <div style={{
      width: '1200px',
      height: '630px',
      background: 'linear-gradient(135deg, #050510 0%, #0a0a2e 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Title */}
      <div style={{color:'white', fontSize:'48px', fontWeight:'900', letterSpacing:'3px', marginBottom:'4px'}}>$HYPER</div>
      <div style={{color:'#00f5ff', fontSize:'28px', fontWeight:'700', marginBottom:'30px'}}>Rewards</div>

      {/* Card */}
      <div style={{
        background:'rgba(8,8,30,0.9)',
        border:'2px solid #00f5ff',
        borderRadius:'18px',
        padding:'30px 40px',
        width:'900px',
        display:'flex',
        flexDirection:'column',
        boxShadow:'0 0 40px rgba(0,245,255,0.2)',
      }}>
        <div style={{color:'rgba(255,255,255,0.5)', fontSize:'11px', letterSpacing:'3px', marginBottom:'20px'}}>YOUR ALLOCATION</div>

        {/* User row */}
        <div style={{display:'flex', alignItems:'center', gap:'20px', marginBottom:'24px'}}>
          {pfpUrl ? (
            <img src={pfpUrl} width="70" height="70" style={{borderRadius:'50%', border:'2px solid #00f5ff'}} />
          ) : (
            <div style={{width:'70px', height:'70px', borderRadius:'50%', border:'2px solid #00f5ff', background:'#0a0a2e', display:'flex', alignItems:'center', justifyContent:'center', color:'#00f5ff', fontSize:'28px', fontWeight:'700'}}>{initial}</div>
          )}
          <div style={{display:'flex', flexDirection:'column'}}>
            <div style={{color:'#00f5ff', fontSize:'28px', fontWeight:'700'}}>{username}</div>
            <div style={{color:'rgba(255,255,255,0.6)', fontSize:'16px', marginTop:'4px'}}>{displayName} · FID: {fid}</div>
          </div>
        </div>

        {/* Allocation box */}
        <div style={{
          background:'rgba(0,15,40,0.8)',
          border:'1px solid rgba(0,245,255,0.3)',
          borderRadius:'12px',
          padding:'20px',
          textAlign:'center',
          display:'flex',
          flexDirection:'column',
          alignItems:'center',
        }}>
          <div style={{color:'rgba(255,255,255,0.5)', fontSize:'11px', letterSpacing:'3px', marginBottom:'8px'}}>TOKEN ALLOCATION</div>
          <div style={{color:'#00f5ff', fontSize:'64px', fontWeight:'900'}}>{tokens}</div>
          <div style={{color:'rgba(255,255,255,0.5)', fontSize:'14px', marginTop:'4px'}}>$HYPER Tokens · FIP-19 Genesis</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{color:'rgba(255,255,255,0.4)', fontSize:'14px', marginTop:'20px'}}>
        Built by <span style={{color:'#00f5ff'}}>@3hundred</span> · Based on Hypersnap by <span style={{color:'#00f5ff'}}>@cassie</span>
      </div>
    </div>,
    { width: 1200, height: 630 }
  );
}
