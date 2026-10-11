import { NextResponse } from 'next/server';

export class RegistrationError extends Error {
  constructor(
    message: string,
    public status = 400,
    public fields?: Record<string, string>
  ) {
    super(message);
  }
}

export function errorResponse(err: unknown) {
  if (err instanceof RegistrationError) {
    return NextResponse.json({ error: err.message, fields: err.fields }, { status: err.status });
  }
  console.error('Registration API error:', err);
  const message = err instanceof Error ? err.message : 'Something went wrong';
  return NextResponse.json({ error: message }, { status: 500 });
}
