const bcrypt = require('bcryptjs');
const { handleCors, signToken } = require('../_lib/auth');

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { supabase } = require('../_lib/supabase');
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    const normalized = username.toLowerCase();

    const { data: player } = await supabase
      .from('players')
      .select('id, username, password_hash')
      .eq('username', normalized)
      .maybeSingle();

    if (!player) return res.status(401).json({ error: 'Invalid username or password' });

    const valid = await bcrypt.compare(password, player.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid username or password' });

    const token = signToken({ playerId: player.id, username: player.username });
    res.status(200).json({ token, username: player.username });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error: ' + (err.message || 'Unknown') });
  }
};
