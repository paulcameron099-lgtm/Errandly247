type CreateNotificationParams = {
  admin: any;
  userId: string;
  actorId?: string | null;
  title: string;
  message: string;
  type: string;
  link?: string | null;
};

export async function createNotification({
  admin,
  userId,
  actorId = null,
  title,
  message,
  type,
  link = null,
}: CreateNotificationParams) {
  const { error } = await admin.from("notifications").insert({
    user_id: userId,
    actor_id: actorId,
    title,
    message,
    type,
    link,
  });

  if (error) {
    console.error("Notification error:", error.message);
  }
}