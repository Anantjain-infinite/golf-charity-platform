import '../config/env.js';
import { supabaseAdmin } from '../config/db.js';

const seed = async () => {
  console.log('Starting seed...');

  // ── 1. Charities ──────────────────────────────────────────────
  console.log('Seeding charities...');

  const charities = [
    {
      name: 'Golf Foundation',
      slug: 'golf-foundation',
      description:
        'Growing the game of golf for young people across the UK, providing opportunities regardless of background.',
      website_url: 'https://www.golf-foundation.org',
      is_featured: true,
      is_active: true,
    },
    {
      name: 'Macmillan Cancer Support',
      slug: 'macmillan-cancer-support',
      description:
        'Supporting people living with cancer and their families through treatment and beyond.',
      website_url: 'https://www.macmillan.org.uk',
      is_featured: false,
      is_active: true,
    },
    {
      name: 'Walking With The Wounded',
      slug: 'walking-with-the-wounded',
      description:
        'Supporting injured veterans back into employment and independence through sport and rehabilitation.',
      website_url: 'https://walkingwiththewounded.org.uk',
      is_featured: false,
      is_active: true,
    },
    {
      name: 'Prostate Cancer UK',
      slug: 'prostate-cancer-uk',
      description:
        'Fighting prostate cancer through research, support, and awareness for men and their families.',
      website_url: 'https://prostatecanceruk.org',
      is_featured: false,
      is_active: true,
    },
    {
      name: 'The R&A Foundation',
      slug: 'the-ra-foundation',
      description:
        'Developing golf worldwide through grants, scholarships, and access programmes at all levels.',
      website_url: 'https://www.randa.org',
      is_featured: false,
      is_active: true,
    },
  ];

  const { error: charitiesError } = await supabaseAdmin
    .from('charities')
    .upsert(charities, { onConflict: 'slug' });

  if (charitiesError) {
    console.error('Failed to seed charities:', charitiesError.message);
    process.exit(1);
  }
  console.log('Charities seeded successfully');

  // ── 2. Admin User ──────────────────────────────────────────────
  console.log('Creating admin user...');

  const { data: adminAuth, error: adminAuthError } =
    await supabaseAdmin.auth.admin.createUser({
      email: 'admin@golfcharity.club',
      password: 'Admin@2026!',
      email_confirm: true,
    });

  if (adminAuthError) {
    if (adminAuthError.message.includes('already been registered')) {
      console.log('Admin user already exists, skipping creation');
    } else {
      console.error('Failed to create admin auth user:', adminAuthError.message);
      process.exit(1);
    }
  }

  if (adminAuth?.user) {
    const { error: adminProfileError } = await supabaseAdmin
      .from('profiles')
      .upsert(
        {
          id: adminAuth.user.id,
          full_name: 'Admin',
          email: 'admin@golfcharity.club',
          role: 'admin',
          subscription_status: 'active',
        },
        { onConflict: 'id' }
      );

    if (adminProfileError) {
      console.error('Failed to create admin profile:', adminProfileError.message);
      process.exit(1);
    }
    console.log('Admin user created successfully');
  }

  // ── 3. Test Subscriber ─────────────────────────────────────────
  console.log('Creating test subscriber...');

  const { data: testAuth, error: testAuthError } =
    await supabaseAdmin.auth.admin.createUser({
      email: 'test@golfcharity.club',
      password: 'Test@2026!',
      email_confirm: true,
    });

  if (testAuthError) {
    if (testAuthError.message.includes('already been registered')) {
      console.log('Test user already exists, skipping creation');
    } else {
      console.error('Failed to create test auth user:', testAuthError.message);
      process.exit(1);
    }
  }

  if (testAuth?.user) {
    // Get the golf foundation charity id
    const { data: firstCharity } = await supabaseAdmin
      .from('charities')
      .select('id')
      .eq('slug', 'golf-foundation')
      .single();

    const { error: testProfileError } = await supabaseAdmin
      .from('profiles')
      .upsert(
        {
          id: testAuth.user.id,
          full_name: 'Test User',
          email: 'test@golfcharity.club',
          role: 'subscriber',
          subscription_status: 'active',
          subscription_plan: 'monthly',
          charity_id: firstCharity?.id || null,
          charity_contribution_percent: 10,
        },
        { onConflict: 'id' }
      );

    if (testProfileError) {
      console.error('Failed to create test profile:', testProfileError.message);
      process.exit(1);
    }

    // Insert 5 test scores
    const today = new Date();

    const testScores = [
      {
        user_id: testAuth.user.id,
        score: 28,
        played_date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
      },
      {
        user_id: testAuth.user.id,
        score: 31,
        played_date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
      },
      {
        user_id: testAuth.user.id,
        score: 35,
        played_date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
      },
      {
        user_id: testAuth.user.id,
        score: 22,
        played_date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
      },
      {
        user_id: testAuth.user.id,
        score: 29,
        played_date: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
      },
    ];

    const { error: scoresError } = await supabaseAdmin
      .from('scores')
      .insert(testScores);

    if (scoresError) {
      console.error('Failed to insert test scores:', scoresError.message);
      process.exit(1);
    }

    console.log('Test subscriber created with 5 scores');
  }

  console.log('');
  console.log('Seed completed successfully');
  console.log('');
  console.log('Admin credentials:');
  console.log('  Email:    admin@golfcharity.club');
  console.log('  Password: Admin@2026!');
  console.log('');
  console.log('Test user credentials:');
  console.log('  Email:    test@golfcharity.club');
  console.log('  Password: Test@2026!');

  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
