import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');

    const [photos] = await db.execute(`
      SELECT p.*, u.name as uploader_name
      FROM work_photos p
      JOIN users u ON p.uploaded_by = u.id
      WHERE p.booking_id = ?
      ORDER BY p.created_at DESC
    `, [bookingId]);

    return NextResponse.json({ photos });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { booking_id, uploaded_by, photo_url, caption } = await request.json();

    if (!booking_id || !uploaded_by || !photo_url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [result] = await db.execute(
      'INSERT INTO work_photos (booking_id, uploaded_by, photo_url, caption) VALUES (?, ?, ?, ?)',
      [booking_id, uploaded_by, photo_url, caption]
    );

    return NextResponse.json({ message: 'Photo uploaded', photoId: result.insertId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to upload photo' }, { status: 500 });
  }
}