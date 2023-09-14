import { Request } from "express";

export function parseCookies(request: Request) {
  const rawCookies: string | undefined = request.headers['cookie'];

  if (!rawCookies) return null;

  return rawCookies
    .split(';')
    .map(cookie => cookie.split('='))
    .reduce((cookies, [key, value]) => {
      cookies[key.trim()] = decodeURIComponent(value.trim());

      return cookies;
    }, {} as Record<string, string>)
}