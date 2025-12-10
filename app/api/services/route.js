import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const [services] = await db.execute(`
      SELECT s.*, u.name as provider_name, u.profile_image, u.phone
      FROM services s
      JOIN users u ON s.provider_id = u.id
      ORDER BY s.created_at DESC
    `);
    return NextResponse.json({ services });
  } catch (error) {
    console.error('Services GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Received data:', body); // Debug log
    
    const { provider_id, title, description, category, hourly_rate } = body;

    if (!provider_id || !title || !hourly_rate) {
      console.error('Missing fields:', { provider_id, title, hourly_rate });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [result] = await db.execute(
      'INSERT INTO services (provider_id, title, description, category, hourly_rate) VALUES (?, ?, ?, ?, ?)',
      [provider_id, title, description || '', category || '', parseFloat(hourly_rate)]
    );

    console.log('Service created with ID:', result.insertId); // Debug log
    return NextResponse.json({ message: 'Service created', serviceId: result.insertId }, { status: 201 });
  } catch (error) {
    console.error('Service creation error:', error);
    return NextResponse.json({ 
      error: 'Failed to create service: ' + error.message 
    }, { status: 500 });
  }
}