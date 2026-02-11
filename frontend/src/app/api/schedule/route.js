import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const data = await req.json();

    const djangoResponse = await fetch(`${process.env.DJANGO_API_URL}/api/schedules/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${process.env.DJANGO_API_TOKEN}`,
        'ngrok-skip-browser-warning': '69420', 
      },
      body: JSON.stringify({
        vehicle_info: data.vehicleInfo,   
        plate: data.plate,               
        email: data.email,               
        phone: data.phone,               
        pickaddress: data.pickAddress, 
        dropaddress: data.dropAddress, 
        scheduled_date: data.date,       
        comments: data.comments,         
        status: 'pending'               
      }),
    });

    if (!djangoResponse.ok) {
      const errorText = await djangoResponse.text();
      throw new Error(`Django Error: ${errorText}`);
    }

    const djangoData = await djangoResponse.json();

    const rawKey = process.env.GOOGLE_PRIVATE_KEY || "";
    const formattedKey = rawKey.replace(/\\n/g, '\n');

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: formattedKey,
      },
      scopes: ['https://www.googleapis.com/auth/calendar.events'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    const eventDate = data.date.split('T')[0]; 

    const event = {
      summary: `TRASLADO: ${data.vehicleInfo || 'Vehículo'} [${data.plate || 'S/M'}]`,
      location: data.pickAddress || "Dirección no proporcionada", 
      description: `
MATRÍCULA: ${data.plate}
RECOGIDA: ${data.pickAddress}
ENTREGA: ${data.dropAddress}
TELÉFONO: ${data.phone}
NOTAS: ${data.comments}

ID Django: ${djangoData.id}
      `.trim(),
      start: { date: eventDate },
      end: { date: eventDate },
    };

    const calendarResponse = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      resource: event,
    });

    const updateResponse = await fetch(`${process.env.DJANGO_API_URL}/api/schedules/${djangoData.id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${process.env.DJANGO_API_TOKEN}`,
        'ngrok-skip-browser-warning': '69420', 
      },
      body: JSON.stringify({
        google_calendar_event_id: calendarResponse.data.id
      }),
    });

    if (!updateResponse.ok) {
      console.warn("Django update failed, but calendar event was created.");
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('SERVER SIDE ERROR:', error.message);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}