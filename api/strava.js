let cachedToken = null;
let cachedTokenExpiry = 0;

async function getAccessToken() {
  if (cachedToken && Date.now() < cachedTokenExpiry) {
    return cachedToken;
  }

  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token: process.env.STRAVA_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });

  if (!res.ok) {
    throw new Error(`Strava token refresh failed: ${res.status}`);
  }

  const data = await res.json();
  cachedToken = data.access_token;
  cachedTokenExpiry = data.expires_at * 1000 - 60_000;
  return cachedToken;
}

function decodePolyline(encoded) {
  if (!encoded) return [];

  let index = 0;
  let lat = 0;
  let lng = 0;
  const points = [];

  while (index < encoded.length) {
    let result = 0;
    let shift = 0;
    let byte;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;

    result = 0;
    shift = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;

    points.push([lat / 1e5, lng / 1e5]);
  }

  return points;
}

function metersToMiles(m) {
  return m / 1609.344;
}

function metersToFeet(m) {
  return m * 3.28084;
}

function mpsToMph(mps) {
  return mps * 2.23694;
}

function formatPacePerKm(movingTimeSec, distanceMeters) {
  if (!distanceMeters) return null;
  const secPerKm = movingTimeSec / (distanceMeters / 1000);
  const min = Math.floor(secPerKm / 60);
  const sec = Math.round(secPerKm % 60);
  return `${min}:${String(sec).padStart(2, '0')} /km`;
}

function formatPacePerMile(movingTimeSec, distanceMeters) {
  if (!distanceMeters) return null;
  const miles = metersToMiles(distanceMeters);
  const secPerMile = movingTimeSec / miles;
  const min = Math.floor(secPerMile / 60);
  const sec = Math.round(secPerMile % 60);
  return `${min}:${String(sec).padStart(2, '0')} /mi`;
}

function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function summarizeActivity(activity) {
  return {
    id: activity.id,
    name: activity.name,
    type: activity.type,
    date: formatDate(activity.start_date_local),
    startDate: activity.start_date_local,
    distanceKm: +(activity.distance / 1000).toFixed(2),
    distanceMi: +metersToMiles(activity.distance).toFixed(2),
    movingTimeMin: Math.round(activity.moving_time / 60),
    pacePerKm: formatPacePerKm(activity.moving_time, activity.distance),
    pacePerMile: formatPacePerMile(activity.moving_time, activity.distance),
    elevationGainFt:
      activity.total_elevation_gain != null
        ? Math.round(metersToFeet(activity.total_elevation_gain))
        : null,
    averageHeartrate: activity.average_heartrate ?? null,
    maxSpeedMph: activity.max_speed != null ? +mpsToMph(activity.max_speed).toFixed(1) : null,
    kudosCount: activity.kudos_count ?? null,
    route: decodePolyline(activity.map?.summary_polyline),
  };
}

export default async function handler(req, res) {
  try {
    const token = await getAccessToken();
    const activitiesRes = await fetch(
      'https://www.strava.com/api/v3/athlete/activities?per_page=10',
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!activitiesRes.ok) {
      throw new Error(`Strava activities fetch failed: ${activitiesRes.status}`);
    }

    const activities = await activitiesRes.json();
    const latest = activities.find((a) => a.type === 'Run');
    res.setHeader('Cache-Control', 's-maxage=300');

    if (!latest) {
      return res.status(200).json({ hasActivity: false });
    }

    return res.status(200).json({
      hasActivity: true,
      ...summarizeActivity(latest),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load Strava activity' });
  }
}
