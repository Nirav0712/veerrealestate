import pool from '../lib/db.ts';

async function seed() {
  await pool.query(`
    INSERT INTO social_videos (id, title, platform, video_url, project_id, project_url, thumbnail_url, description, display_order, is_active)
    VALUES 
    (3, 'Avalon DHS Floora — Luxury Landscape & Amenities', 'youtube', 'https://www.youtube.com/shorts/dQw4w9WgXcQ', 3, '/projects/east/avalon-dhs-floora', '/images/east/Avalon-DHS.jpeg', 'Modern living residences with landscaped gardens & clubhouse', 3, 1),
    (4, 'Eleven 04 Homes — Architectural Tour', 'instagram', 'https://www.instagram.com/reel/C3bX_eleven', 4, '/projects/east/eleven-04-homes', '/images/east/Eleven.jpeg', 'Thoughtfully designed 3 BHK apartments in East Ahmedabad', 4, 1)
    ON DUPLICATE KEY UPDATE title=VALUES(title), thumbnail_url=VALUES(thumbnail_url);
  `);
  console.log('Seeded successfully!');
  await pool.end();
}

seed().catch(console.error);

