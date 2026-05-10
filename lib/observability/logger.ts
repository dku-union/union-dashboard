type LogLevel = "info" | "warn" | "error";

type LogFields = Record<string, unknown>;

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
    };
  }

  return { message: String(error) };
}

function write(level: LogLevel, event: string, fields: LogFields = {}) {
  const payload = {
    level,
    event,
    timestamp: new Date().toISOString(),
    ...fields,
  };

  const line = JSON.stringify(payload);

  if (level === "error") {
    console.error(line);
    return;
  }

  if (level === "warn") {
    console.warn(line);
    return;
  }

  console.info(line);
}

export const logger = {
  info(event: string, fields?: LogFields) {
    write("info", event, fields);
  },
  warn(event: string, fields?: LogFields) {
    write("warn", event, fields);
  },
  error(event: string, error: unknown, fields?: LogFields) {
    write("error", event, {
      ...fields,
      error: serializeError(error),
    });
  },
};
