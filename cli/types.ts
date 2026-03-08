/** JSON sent to a tool's stdin by the host */
export type ToolRequest<P = Record<string, never>> = {
	params: P;
};

/** JSON written to a tool's stdout back to the host */
export type ToolResponse<R = Record<string, never>> = {
	ok: boolean;
	result?: R;
	error?: string;
};

/** A tool that communicates over STDIO */
export type Tool<P = Record<string, never>, R = Record<string, never>> = {
	name: string;
	description: string;
	run: (request: ToolRequest<P>) => Promise<ToolResponse<R>>;
};
