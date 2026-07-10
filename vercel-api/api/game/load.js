const { handleCors, verifyToken } = require('../_lib/auth');

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { supabase } = require('../_lib/supabase');
    const user = verifyToken(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { data, error } = await supabase
      .from('game_saves')
      .select('save_data, updated_at')
      .eq('player_id', user.playerId)
      .maybeSingle();

    if (error || !data) return res.status(404).json({ error: 'No save found' });

    res.status(200).json({ saveData: data.save_data, updatedAt: data.updated_at });
  } catch (err) {
    console.error('Load error:', err);
    res.status(500).json({ error: 'Server error: ' + (err.message || 'Unknown') });
  }
};
