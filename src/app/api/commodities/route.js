export async function GET() {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbwVnj3joWYzAZFzzFu3f_Rvv395I1lp-jhNgMTqLvMicsqk5mX1pl9i7SZaa3JVIZjT4Q/exec'); // replace with your real URL

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch commodities data' }), { status: 500 });
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
