/**
 * Common / shared schemas used across API and DB layers.
 */
import { z } from "zod";

/** A branded UUID string */
export const Id = z.string().uuid();

/** ISO-8601 datetime string */
export const Timestamp = z.string().datetime();

/** Standard audit fields present on most records */
export const Timestamps = z.object({
	createdAt: Timestamp,
	updatedAt: Timestamp,
});
