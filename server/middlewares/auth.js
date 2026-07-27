import { clerkClient } from "@clerk/express";

const auth = async (req, res, next) => {
  try {
    const { userId, has } = await req.auth();

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const hasPremiumPlan = await has({ plan: "premium" });
    const user = await clerkClient.users.getUser(userId);

    const existingFreeUsage = user.privateMetadata?.free_usage;

    if (!hasPremiumPlan && existingFreeUsage !== undefined) {
      // Fixed: `!existingFreeUsage` was falsy when usage was 0, resetting it on every request
      req.free_usage = existingFreeUsage;
    } else {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: 0,
        },
      });
      req.free_usage = 0;
    }

    req.plan = hasPremiumPlan ? "premium" : "free";
    req.userId = userId;

    next();
  } catch (error) {
    console.error(error);
    // Propagate the real status (e.g. 429 from Clerk rate limiting) instead of always 401
    const status = error?.status || 401;
    res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

export default auth;