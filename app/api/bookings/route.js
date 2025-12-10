import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ bookings: [] });
    }

    const [bookings] = await db.execute(`
      SELECT b.*, s.title as service_title, s.hourly_rate, s.provider_id,
             u1.name as customer_name, u1.email as customer_email,
             u2.name as provider_name, u2.email as provider_email
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN users u1 ON b.customer_id = u1.id
      JOIN users u2 ON s.provider_id = u2.id
      WHERE b.customer_id = ? OR s.provider_id = ?
      ORDER BY b.booking_date DESC, b.booking_time DESC
    `, [userId, userId]);

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Bookings fetch error:', error);
    return NextResponse.json({ bookings: [] });
  }
}

export async function POST(request) {
  try {
    const { service_id, customer_id, booking_date, booking_time, notes } = await request.json();

    if (!service_id || !customer_id || !booking_date || !booking_time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [result] = await db.execute(
      'INSERT INTO bookings (service_id, customer_id, booking_date, booking_time, notes) VALUES (?, ?, ?, ?, ?)',
      [service_id, customer_id, booking_date, booking_time, notes || null]
    );

    return NextResponse.json({ message: 'Booking created', bookingId: result.insertId }, { status: 201 });
  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { bookingId, status } = await request.json();

    if (!bookingId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await db.execute(
      'UPDATE bookings SET status = ? WHERE id = ?',
      [status, bookingId]
    );

    return NextResponse.json({ message: 'Booking updated' });
  } catch (error) {
    console.error('Booking update error:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}