export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureSchema } from '@/lib/migrate';
import type { RowDataPacket } from 'mysql2';

const FALLBACK_BRANCHES = [
  {
    id: 'branch_east',
    name: 'East Ahmedabad',
    displayTitle: 'East Ahmedabad',
    address: 'C-238, Sumel 7, Odhav, Ahmedabad - 382415',
    city: 'Ahmedabad',
    state: 'Gujarat',
    postalCode: '382415',
    country: 'India',
    phones: [
      { number: '+91 93769 96179', label: 'Office' },
      { number: '+91 97270 27052', label: 'Sales' },
    ],
    email: 'horseveer@gmail.com',
    whatsapp: '919727027052',
    mapUrl: 'https://maps.google.com/?q=Sumel+7+Odhav+Ahmedabad',
    mapEmbedUrl: '',
    facebook: 'https://www.facebook.com/people/Veer-Real-Estate-East-Ahmedabad/61571731020972/',
    instagram: 'https://www.instagram.com/veerrealestateeastahmedabad/?hl=en',
    youtube: 'https://www.youtube.com/@VeerRealEstate',
    googleReview: 'https://g.page/r/CcSCOVV14JRdEAI/review',
    linkedin: '',
    isActive: 1,
    displayOrder: 1,
  },
  {
    id: 'branch_west',
    name: 'West Ahmedabad',
    displayTitle: 'West Ahmedabad',
    address: '431, Yash Arian Complex, Memnagar, Ahmedabad - 380052',
    city: 'Ahmedabad',
    state: 'Gujarat',
    postalCode: '380052',
    country: 'India',
    phones: [
      { number: '+91 88661 13391', label: 'Office' },
      { number: '+91 90672 30240', label: 'Support' },
    ],
    email: 'horseveer@gmail.com',
    whatsapp: '918866113391',
    mapUrl: 'https://maps.google.com/?q=Yash+Arian+Complex+Memnagar+Ahmedabad',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.217236267724!2d72.53583687600862!3d23.052496015209492!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e856a804a4f6b%3A0x5d94e075553982c4!2sVeer%20Real%20Estate!5e0!3m2!1sen!2sin!4v1788493973064!5m2!1sen!2sin',
    facebook: 'https://www.facebook.com/people/Veer-Real-Estate/61558935522154/',
    instagram: 'https://www.instagram.com/veer.real_estate/',
    youtube: 'https://www.youtube.com/@VeerRealEstate',
    googleReview: 'https://g.page/r/CcSCOVV14JRdEAI/review',
    linkedin: 'https://www.linkedin.com/company/veer-real-estate-ahmedabad/?viewAsMember=true',
    isActive: 1,
    displayOrder: 2,
  },
  {
    id: 'branch_bopal',
    name: 'Bopal Branch',
    displayTitle: 'Bopal Branch',
    address: '1120, STC, Opp. Saraswati Hospital, Ambli, Ahmedabad - 380058',
    city: 'Ahmedabad',
    state: 'Gujarat',
    postalCode: '380058',
    country: 'India',
    phones: [
      { number: '+91 81601 53208', label: 'Direct' },
    ],
    email: 'horseveer@gmail.com',
    whatsapp: '918160153208',
    mapUrl: 'https://maps.google.com/?q=STC+Opp+Saraswati+Hospital+Ambli+Ahmedabad',
    mapEmbedUrl: '',
    facebook: '',
    instagram: '',
    youtube: '',
    googleReview: '',
    linkedin: '',
    isActive: 1,
    displayOrder: 3,
  },
];

export async function GET(req: NextRequest) {
  try {
    await ensureSchema();

    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT id, name, displayTitle, address, city, state, postalCode, country,
             phones, email, whatsapp, mapUrl, mapEmbedUrl,
             facebook, instagram, youtube, googleReview, linkedin,
             isActive, displayOrder
      FROM branches
      WHERE isActive = 1
      ORDER BY displayOrder ASC, id ASC
    `);

    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: true, branches: FALLBACK_BRANCHES });
    }

    const branches = rows.map((r) => {
      let phones = r.phones;
      if (typeof phones === 'string') {
        try {
          phones = JSON.parse(phones);
        } catch {
          phones = [];
        }
      }
      return {
        ...r,
        phones: Array.isArray(phones) ? phones : [],
        isActive: Boolean(r.isActive),
      };
    });

    return NextResponse.json(
      { success: true, branches },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  } catch (error: any) {
    console.error('[api/branches] Error fetching active branches:', error);
    // Graceful fallback to prevent footer or contact page breaks
    return NextResponse.json({ success: true, branches: FALLBACK_BRANCHES });
  }
}

