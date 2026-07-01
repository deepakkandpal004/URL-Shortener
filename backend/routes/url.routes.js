import express from "express";
import {
  shortenPostRequestBodySchema,
  updateUrlRequestBodySchema,
} from "../validation/request.validation.js";
import { nanoid } from "nanoid";
import { ensureAuthenticated } from "../middlewares/auth.middleware.js";
import { createUrl, updateUrl } from "../services/url.service.js";
import { urlsTable } from "../models/url.model.js";
import { and, eq } from "drizzle-orm";
import db from "../db/index.js";

const router = express.Router();

router.post("/shorten", ensureAuthenticated, async (req, res) => {
  const validationResult = await shortenPostRequestBodySchema.safeParseAsync(
    req.body,
  );

  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error.format() });
  }

  const { url, code } = validationResult.data;

  const shortCode = code ?? nanoid(6);
  const userId = req.user.id;

  try {
    const Url = await createUrl({
      shortCode,
      targetUrl: url,
      userId,
    });

    return res.status(201).json({
      id: Url.id,
      shortCode: Url.shortCode,
      targetUrl: Url.targetUrl,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get("/codes", ensureAuthenticated, async (req, res) => {
  const codes = await db
    .select()
    .from(urlsTable)
    .where(eq(urlsTable.userId, req.user.id));

  return res.json({ codes });
});

router.delete("/:id", ensureAuthenticated, async (req, res) => {
  const id = req.params.id;

  await db
    .delete(urlsTable)
    .where(and(eq(urlsTable.id, id), eq(urlsTable.userId, req.user.id)));

  return res.status(200).json({ message: "URL deleted successfully" });
});

router.patch("/:id", ensureAuthenticated, async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;

  const validationResult = await updateUrlRequestBodySchema.safeParseAsync(
    req.body,
  );
  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error.format() });
  }

  const { url, code } = validationResult.data;

  try {
    const updatedUrl = await updateUrl({
      id,
      userId,
      targetUrl: url,
      shortCode: code,
    });

    if (!updatedUrl) {
      return res.status(404).json({ error: "URL not found" });
    }

    return res.status(200).json({
      id: updatedUrl.id,
      targetUrl: updatedUrl.targetUrl,
      shortCode: updatedUrl.shortCode,
    });
  } catch (error) {
    console.log(error);
    if (error.code === "23505") {
      return res.status(400).json({ error: `short code already taken` });
    }
    return res.status(500).json({ error: error.message });
  }
});

router.get("/:shortCode", async (req, res) => {
  const code = req.params.shortCode;

  const [result] = await db
    .select({
      targetUrl: urlsTable.targetUrl,
    })
    .from(urlsTable)
    .where(eq(urlsTable.shortCode, code));

  if (!result) {
    return res.status(404).json({ error: "Invalid URL!" });
  }

  return res.redirect(result.targetUrl);
});

export default router;
