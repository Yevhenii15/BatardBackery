import { verifyAdminJWT } from "../../utils/jwt";

export default defineEventHandler((event) => {
  const token = getCookie(event, "batard_token");
  if (!token) {
    setResponseStatus(event, 401);
    return { user: null };
  }

  try {
    const payload = verifyAdminJWT(token);

    return {
      user: {
        _id: payload.sub, 
        email: payload.email,
      },
    };
  } catch {
    deleteCookie(event, "batard_token");
    setResponseStatus(event, 401);
    return { user: null };
  }
});
