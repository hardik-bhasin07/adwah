// pages/api/getFacebookToken.ts
import type { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers'

// Create a middleware to parse the JSON body
export const config = {
  api: {
    bodyParser: true,
  },
};

export async function POST(req: NextApiRequest) {
  if (req.method === 'POST') {
    const headersList = await headers();
    const code = headersList.get('auth'); // Extract the authorization code
    const redirectUri = "https://localhost:3000/"; // Your redirect URI

    // Step 1: Exchange the authorization code for an access token
    const tokenExchangeUrl = "https://graph.facebook.com/v21.0/oauth/access_token";
    try {
      const tokenResponse = await fetch(tokenExchangeUrl, {
        method: 'POST',
        body: JSON.stringify({
          client_id: '975381434644661',
          client_secret: 'f14f6bd79b132c38741107ac349b5d9e',
          code: code,
          redirect_uri: redirectUri,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const tokenData = await tokenResponse.json();
      console.log(">>>>>>>>", tokenData)

      if (!tokenData.access_token) {
        return NextResponse.json({ error: 'Failed to exchange code for access token' }, { status: 400 });
      }

      const accessToken = tokenData.access_token;
      console.log("Access Token:", accessToken);

      // Step 2: Use the access token to validate and get shared WABA ID
      const debugTokenUrl = `https://graph.facebook.com/v22.0/debug_token?input_token=${accessToken}`;
      const debugTokenResponse = await fetch(debugTokenUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`, // Add the Authorization header
        },
      });

      const debugTokenData = await debugTokenResponse.json();

      if (debugTokenData.error) {
        return NextResponse.json({ error: 'Invalid access token', details: debugTokenData.error }, { status: 400 });
      }

      console.log("Debug Token Data:", debugTokenData);

      // Step 3: Extract the first WABA ID from granular_scopes
      const granularScopes = debugTokenData.data.granular_scopes;
      const wabaScope = granularScopes.find((scope: { scope: string; }) => scope.scope === 'whatsapp_business_management');

      if (wabaScope && wabaScope.target_ids.length > 0) {
        const wabaId = wabaScope.target_ids[0]; // Get the first WABA ID
        console.log("WABA ID:", wabaId);

        // Step 4: Get the phone numbers associated with this WABA ID
        const phoneNumberResponse = await fetch(`https://graph.facebook.com/v22.0/${wabaId}/phone_numbers?access_token=${accessToken}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`, // Include the access token for authorization
          },
        });

        const phoneNumberData = await phoneNumberResponse.json();

        if (phoneNumberData.error) {
          return NextResponse.json({ error: 'Error fetching phone numbers', details: phoneNumberData.error }, { status: 500 });
        }


        // Extract the first phone number ID from the response
        const phoneNumberId = phoneNumberData.data[0]?.id;
        console.log(phoneNumberId);
        if (!phoneNumberId) {
          return NextResponse.json({ error: 'No phone numbers found for the WABA ID' }, { status: 404 });
        }

        // Return the access token, WABA ID, and phone number ID
        return NextResponse.json({
          accessToken,
          wabaId,
          phoneNumberId, // Include the phone number ID here
        }, { status: 200 });

      } else {
        return NextResponse.json({ error: 'No WABA found for whatsapp_business_management scope' }, { status: 404 });
      }

    } catch (error : any) {
      console.error("Error during token exchange:", error);
      return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }
}
