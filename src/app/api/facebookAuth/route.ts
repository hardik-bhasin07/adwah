import { NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: true,
  },
};

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const headers = req.headers;
    const code = headers.get('auth');
    const redirectUri = "https://localhost:3000/";

    if (!code) {
      return NextResponse.json({ error: 'Missing authorization code in headers' }, { status: 400 });
    }

    // Step 1: Exchange code for access token
    const tokenExchangeUrl = "https://graph.facebook.com/v21.0/oauth/access_token";
    const tokenResponse = await fetch(tokenExchangeUrl, {
      method: 'POST',
      body: JSON.stringify({
        client_id: '975381434644661',
        client_secret: 'f14f6bd79b132c38741107ac349b5d9e',
        code,
        redirect_uri: redirectUri,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const tokenData = await tokenResponse.json();
    console.log("Token Data:", tokenData);

    if (!tokenData.access_token) {
      return NextResponse.json({ error: 'Failed to exchange code for access token' }, { status: 400 });
    }

    const accessToken = tokenData.access_token;

    // Step 2: Validate token
    const debugTokenUrl = `https://graph.facebook.com/v22.0/debug_token?input_token=${accessToken}`;
    const debugTokenResponse = await fetch(debugTokenUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const debugTokenData = await debugTokenResponse.json();
    console.log("Debug Token Data:", debugTokenData);

    if (debugTokenData.error) {
      return NextResponse.json({ error: 'Invalid access token', details: debugTokenData.error }, { status: 400 });
    }

    // Step 3: Extract WABA ID
    const granularScopes = debugTokenData.data?.granular_scopes;
    const wabaScope = granularScopes?.find(
      (scope: { scope: string }) => scope.scope === 'whatsapp_business_management'
    );

    if (!wabaScope || !wabaScope.target_ids?.length) {
      return NextResponse.json({ error: 'No WABA found for whatsapp_business_management scope' }, { status: 404 });
    }

    const wabaId = wabaScope.target_ids[0];

    // Step 4: Get phone numbers
    const phoneNumberResponse = await fetch(
      `https://graph.facebook.com/v22.0/${wabaId}/phone_numbers?access_token=${accessToken}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const phoneNumberData = await phoneNumberResponse.json();
    console.log("Phone Number Data:", phoneNumberData);

    if (phoneNumberData.error) {
      return NextResponse.json({ error: 'Error fetching phone numbers', details: phoneNumberData.error }, { status: 500 });
    }

    const phoneNumberId = phoneNumberData.data?.[0]?.id;
    if (!phoneNumberId) {
      return NextResponse.json({ error: 'No phone numbers found for the WABA ID' }, { status: 404 });
    }

    return NextResponse.json({
      accessToken,
      wabaId,
      phoneNumberId,
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error during token exchange:", error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
