import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as client from 'openid-client';

export async function GET(request: Request) {
  // Ensure we have a base URL to redirect back to
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin;
  
  const issuerUrl = process.env.OIDC_ISSUER;
  const clientId = process.env.OIDC_CLIENT_ID;
  const clientSecret = process.env.OIDC_CLIENT_SECRET;
  const redirectUri = `${baseUrl}/api/auth/callback`;

  if (!issuerUrl || !clientId || !clientSecret) {
    console.error("Missing OIDC Environment Variables");
    return NextResponse.redirect(new URL('/login?error=ConfigurationMissing', baseUrl));
  }

  try {
    const server = new URL(issuerUrl);
    const config = await client.discovery(server, clientId, clientSecret);
    
    const code_challenge_method = 'S256';
    const code_verifier = client.randomPKCECodeVerifier();
    const code_challenge = await client.calculatePKCECodeChallenge(code_verifier);
    const state = client.randomState();
    
    const parameters: Record<string, string> = {
      redirect_uri: redirectUri,
      scope: 'openid email profile',
      code_challenge,
      code_challenge_method,
      state,
    };
    
    const redirectTo = client.buildAuthorizationUrl(config, parameters);

    const cookieStore = await cookies();
    cookieStore.set('oidc_state', state, { httpOnly: true, path: '/' });
    cookieStore.set('oidc_verifier', code_verifier, { httpOnly: true, path: '/' });

    return NextResponse.redirect(redirectTo);
  } catch (error) {
    console.error("OIDC Login Error:", error);
    return NextResponse.redirect(new URL('/login?error=InternalError', baseUrl));
  }
}
