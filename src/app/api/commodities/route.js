export async function GET() {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbyOecDO5aeP0_eC_fHHFHYZLVTtH2WDvk5w18wYnQSXBfgMd8RQvCSpyomxlw9RY1K4/exec'); // replace with your real URL

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
