import { getImageKit } from '@/lib/imagekit';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const ik = getImageKit();
    const authenticationParameters = ik.getAuthenticationParameters();
    return NextResponse.json(authenticationParameters);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to authenticate with ImageKit';
    console.error('ImageKit Auth Error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
