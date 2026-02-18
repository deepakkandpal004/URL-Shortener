import { and, eq } from "drizzle-orm";
import db from "../db/index.js";
import { urlsTable } from "../models/url.model.js";

export const createUrl = async ({ shortCode, targetUrl, userId }) => {
  const [result] = await db
    .insert(urlsTable)
    .values({
      shortCode,
      targetUrl,
      userId,
    })

    .returning({
      id: urlsTable.id,
      shortCode: urlsTable.shortCode,
      targetUrl: urlsTable.targetUrl,
    });

  return result;
};

export const updateUrl = async ({ id, userId, targetUrl, shortCode }) => {
  const updatedFields = {};

  if (targetUrl) updatedFields.targetUrl = targetUrl;
  if (shortCode) updatedFields.shortCode = shortCode;

  const [updatedUrl] = await db
    .update(urlsTable)
    .set(updatedFields)
    .where(and(eq(urlsTable.id, id), eq(urlsTable.userId, userId)))
    .returning();

  return updatedUrl;
};
