import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('providerId');

    if (!providerId) {
      return NextResponse.json({ reviews: [] });
    }

    const [reviews] = await db.execute(`
      SELECT r.*, u.name as customer_name, u.profile_image
      FROM reviews r
      JOIN users u ON r.customer_id = u.id
      WHERE r.provider_id = ?
      ORDER BY r.created_at DESC
    `, [providerId]);

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Reviews fetch error:', error);
    return NextResponse.json({ reviews: [] });
  }
}

export async function POST(request) {
  try {
    const { booking_id, customer_id, provider_id, rating, comment } = await request.json();

    if (!booking_id || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const [result] = await db.execute(
      'INSERT INTO reviews (booking_id, customer_id, provider_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [booking_id, customer_id, provider_id, rating, comment || '']
    );

    return NextResponse.json({ message: 'Review created', reviewId: result.insertId }, { status: 201 });
  } catch (error) {
    console.error('Review creation error:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}