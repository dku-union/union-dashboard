import { deleteSession } from "@/lib/auth/session";
import { getRequestId, jsonData } from "@/lib/api/responses";

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  await deleteSession();
  return jsonData({ success: true }, requestId);
}
