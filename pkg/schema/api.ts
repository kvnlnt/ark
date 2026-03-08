/**
 * API request / response schemas.
 *
 * These are the shapes that cross the wire — they intentionally omit
 * server-managed fields like id and timestamps.
 */
import { z } from "zod";

// ── Users ──────────────────────────────────────────

export const CreateUserRequest = z.object({
	email: z.string().email(),
	name: z.string().min(1),
});
export type CreateUserRequest = z.infer<typeof CreateUserRequest>;

export const UpdateUserRequest = z.object({
	email: z.string().email().optional(),
	name: z.string().min(1).optional(),
});
export type UpdateUserRequest = z.infer<typeof UpdateUserRequest>;

// ── Posts ──────────────────────────────────────────

export const CreatePostRequest = z.object({
	title: z.string().min(1),
	body: z.string(),
	published: z.boolean().optional(),
});
export type CreatePostRequest = z.infer<typeof CreatePostRequest>;

export const UpdatePostRequest = z.object({
	title: z.string().min(1).optional(),
	body: z.string().optional(),
	published: z.boolean().optional(),
});
export type UpdatePostRequest = z.infer<typeof UpdatePostRequest>;
