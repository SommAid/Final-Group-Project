import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as client from 'openid-client';

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin;
  const issuerUrl = process.env.OIDC_ISSUER;
  const clientId = process.env.OIDC_CLIENT_ID;
  const clientSecret = process.env.OIDC_CLIENT_SECRET;

  if (!issuerUrl || !clientId || !clientSecret) {
    return NextResponse.redirect(new URL('/login?error=ConfigurationMissing', baseUrl));
  }

  try {
    const server = new URL(issuerUrl);
    const config = await client.discovery(server, clientId, clientSecret);
    
    const cookieStore = await cookies();
    const state = cookieStore.get('oidc_state')?.value;
    const verifier = cookieStore.get('oidc_verifier')?.value;
    
    if (!state || !verifier) {
      return NextResponse.redirect(new URL('/login?error=MissingCookies', baseUrl));
    }
    
    const currentUrl = new URL(request.url);
    
    const tokens = await client.authorizationCodeGrant(config, currentUrl, {
      pkceCodeVerifier: verifier,
      expectedState: state,
      idTokenExpected: true
    });

    if (tokens.access_token) {
      cookieStore.set('session', tokens.access_token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 });
      cookieStore.delete('oidc_state');
      cookieStore.delete('oidc_verifier');
    }

    return NextResponse.redirect(new URL('/', baseUrl));
  } catch (error) {
    console.error("OIDC Callback Error:", error);
    return NextResponse.redirect(new URL('/login?error=CallbackFailed', baseUrl));
  }
}
