let cachedToken = null;
let cachedTokenExpiry = 0;

async function getAccessToken() {
  if (cachedToken && Date.now() < cachedTokenExpiry) {
    return cachedToken;
  }

  const basicAuth = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
    }),
  });

  if (!res.ok) {
    throw new Error(`Spotify token refresh failed: ${res.status}`);
  }

  const data = await res.json();
  cachedToken = data.access_token;
  cachedTokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return cachedToken;
}

function toTrackSummary(item) {
  return {
    track: item.name,
    artist: item.artists.map((a) => a.name).join(', '),
    albumArt: item.album?.images?.[0]?.url ?? null,
    url: item.external_urls?.spotify ?? null,
  };
}

// Spotify's rate limit is a rolling window, not a fixed daily cap — refreshing
// recently-played at most this often keeps us far under it while still serving
// the cached list on every request in between.
const RECENT_REFRESH_INTERVAL_MS = 5 * 60 * 1000;

let cachedRecentTracks = [];
let cachedRecentTracksAt = 0;

export default async function handler(req, res) {
  try {
    const token = await getAccessToken();
    const headers = { Authorization: `Bearer ${token}` };

    const shouldRefreshRecent = Date.now() - cachedRecentTracksAt > RECENT_REFRESH_INTERVAL_MS;

    const [nowPlayingRes, recentRes] = await Promise.all([
      fetch('https://api.spotify.com/v1/me/player/currently-playing', { headers }),
      shouldRefreshRecent
        ? fetch('https://api.spotify.com/v1/me/player/recently-played?limit=6', { headers })
        : Promise.resolve(null),
    ]);

    let current = null;
    if (nowPlayingRes.status === 200) {
      const data = await nowPlayingRes.json();
      if (data && data.item && data.is_playing) {
        current = { isPlaying: true, ...toTrackSummary(data.item) };
      }
    }

    let recentDebug = null;
    if (recentRes) {
      if (recentRes.ok) {
        const recentData = await recentRes.json();
        cachedRecentTracks = (recentData.items ?? []).map((item) => ({
          ...toTrackSummary(item.track),
          playedAt: item.played_at,
        }));
        cachedRecentTracksAt = Date.now();
      } else {
        const bodyText = await recentRes.text();
        const retryAfter = recentRes.headers.get('retry-after');
        console.error(`Spotify recently-played failed: ${recentRes.status} ${bodyText}`);
        recentDebug = { status: recentRes.status, body: bodyText, retryAfter };
      }
    }

    res.setHeader('Cache-Control', 's-maxage=60');

    if (current) {
      return res.status(200).json({
        ...current,
        recentTracks: cachedRecentTracks.slice(0, 5),
        ...(recentDebug ? { recentDebug } : {}),
      });
    }

    const [last, ...rest] = cachedRecentTracks;

    if (!last) {
      return res.status(200).json({
        isPlaying: false,
        track: null,
        recentTracks: [],
        ...(recentDebug ? { recentDebug } : {}),
      });
    }

    return res.status(200).json({
      isPlaying: false,
      ...last,
      recentTracks: rest.slice(0, 5),
      ...(recentDebug ? { recentDebug } : {}),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load Spotify status' });
  }
}
