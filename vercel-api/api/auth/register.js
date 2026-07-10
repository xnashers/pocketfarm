const bcrypt = require('bcryptjs');
const { handleCors, signToken } = require('../_lib/auth');

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { supabase } = require('../_lib/supabase');
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
    if (username.length < 3 || username.length > 20) return res.status(400).json({ error: 'Username must be 3-20 characters' });
    if (password.length < 4) return res.status(400).json({ error: 'Password must be at least 4 characters' });
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return res.status(400).json({ error: 'Username: letters, numbers, underscore only' });

    const normalized = username.toLowerCase();

    // Check duplicate
    const { data: existing } = await supabase.from('players').select('id').eq('username', normalized).maybeSingle();
    if (existing) return res.status(409).json({ error: 'Username already taken' });

    // Hash & insert
    const password_hash = await bcrypt.hash(password, 10);
    const { data: player, error: insertErr } = await supabase
      .from('players')
      .insert({ username: normalized, password_hash })
      .select('id, username')
      .single();

    if (insertErr) return res.status(500).json({ error: 'Failed to create account' });

    // Create initial game save
    const initialSave = {
      player: { level: 1, xp: 0, peso: 100 },
      farmName: normalized + "'s Farm",
      plots: [],
      inventory: [],
      research: {},
      achievements: [],
      loginRewards: { streak: 0, lastClaim: null, totalLoginDays: 0, monthlyClaimed: {} }
    };

    await supabase.from('game_saves').insert({ player_id: player.id, save_data: initialSave });

    const token = signToken({ playerId: player.id, username: player.username });
    res.status(201).json({ token, username: player.username });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error: ' + (err.message || 'Unknown') });
  }
};
