/**
 * Database record schemas.
 *
 * These represent the shapes of rows stored in the database and include
 * system-managed fields like id and timestamps.
 */
import { z } from "zod";
import { Id, Timestamps } from "./common.ts";

/** A user record as stored in the database */
export const UserRecord = z
	.object({
		id: Id,
		email: z.string().email(),
		name: z.string().min(1),
	})
	.extend(Timestamps.shape);

export type UserRecord = z.infer<typeof UserRecord>;

/** A post record as stored in the database */
export const PostRecord = z
	.object({
		id: Id,
		authorId: Id,
		title: z.string().min(1),
		body: z.string(),
		published: z.boolean().default(false),
	})
	.extend(Timestamps.shape);

export type PostRecord = z.infer<typeof PostRecord>;
