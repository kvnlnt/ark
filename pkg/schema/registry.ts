/**
 * Schema registry — a single map of every named schema in the package.
 *
 * Used by CLI tools (validate, list, export) to discover schemas at runtime.
 */
import type { z } from "zod";
import * as api from "./api.ts";
import * as common from "./common.ts";
import * as db from "./db.ts";

export const registry: Record<string, z.ZodType> = {
	// common
	"common.Id": common.Id,
	"common.Timestamp": common.Timestamp,
	"common.Timestamps": common.Timestamps,

	// db
	"db.UserRecord": db.UserRecord,
	"db.PostRecord": db.PostRecord,

	// api
	"api.CreateUserRequest": api.CreateUserRequest,
	"api.UpdateUserRequest": api.UpdateUserRequest,
	"api.CreatePostRequest": api.CreatePostRequest,
	"api.UpdatePostRequest": api.UpdatePostRequest,
};
