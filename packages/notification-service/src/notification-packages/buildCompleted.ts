import { KAFKA_TOPICS } from "@amplication/schema-registry";
import { NotificationContext } from "../util/novuTypes";

export const buildCompleted = async (notificationCtx: NotificationContext) => {
  try {
    if (
      !notificationCtx.message ||
      notificationCtx.topic !== KAFKA_TOPICS.USER_BUILD_TOPIC
    )
      return notificationCtx;

    const { externalId, ...restParams } = notificationCtx.message;
    const shortBuildId = restParams?.buildId.slice(-8);

    notificationCtx.notifications.push({
      notificationMethod:
        notificationCtx.novuService.triggerNotificationToSubscriber,
      subscriberId: externalId,
      eventName: "build-completed",
      payload: {
        payload: {
          ...restParams,
          shortBuildId,
        },
      },
    });

    return notificationCtx;
  } catch (error) {
    await notificationCtx.amplicationLogger.error(error.message, error);

    return notificationCtx;
  }
};
