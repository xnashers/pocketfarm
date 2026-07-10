const { handleCors, verifyToken } = require('../_lib/auth');

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { supabase } = require('../_lib/supabase');
    const user = verifyToken(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { saveData } = req.body || {};
    if (!saveData || typeof saveData !== 'object') return res.status(400).json({ error: 'Invalid save data' });

    const { error } = await supabase
      .from('game_saves')
      .update({ save_data: saveData, updated_at: new Date().toISOString() })
      .eq('player_id', user.playerId);

    if (error) return res.status(500).json({ error: 'Failed to save' });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ error: 'Server error: ' + (err.message || 'Unknown') });
  }
};
