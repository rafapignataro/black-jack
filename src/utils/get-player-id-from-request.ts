import { Request } from "express";
import { parseCookies } from "./cookies";

export function getUserIdFromRequest(request: Request) {
  const cookies = parseCookies(request);

  if (!cookies) return null;

  const userId = cookies['_id_'];

  if (!cookies) return null;

  return userId;
}