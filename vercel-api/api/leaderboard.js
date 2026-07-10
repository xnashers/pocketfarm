const { handleCors, verifyToken } = require('./_lib/auth');

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { supabase } = require('./_lib/supabase');

    const { data, error } = await supabase
      .from('leaderboard')
      .select('username, farm_name, level, xp, peso')
      .order('level', { ascending: false })
      .order('xp', { ascending: false })
      .order('peso', { ascending: false })
      .limit(50);

    if (error) return res.status(500).json({ error: 'Failed to fetch leaderboard' });

    // Identify current user's rank
    const user = verifyToken(req);
    let myRank = null;
    if (user && data) {
      const idx = data.findIndex(e => e.username === user.username);
      if (idx !== -1) myRank = idx + 1;
    }

    res.status(200).json({ leaderboard: data || [], myRank });
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ error: 'Server error: ' + (err.message || 'Unknown') });
  }
};
