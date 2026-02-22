export type Result<T, E = string> =
    | { success: true; data: T }
    | { success: false; error: E };

export function ok<T, E = string>(data: T): Result<T, E> {
    return { success: true, data };
}

export function err<T, E = string>(error: E): Result<T, E> {
    return { success: false, error };
}

export function isOk<T, E>(
    result: Result<T, E>,
): result is { success: true; data: T } {
    return result.success === true;
}

export function isErr<T, E>(
    result: Result<T, E>,
): result is { success: false; error: E } {
    return result.success === false;
}

export function unwrap<T, E>(result: Result<T, E>): T {
    if (isOk(result)) {
        return result.data;
    }
    throw new Error(`Called unwrap on an error result: ${result.error}`);
}

export function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
    return isOk(result) ? result.data : defaultValue;
}

export function map<T, U, E>(
    result: Result<T, E>,
    fn: (value: T) => U,
): Result<U, E> {
    return isOk(result) ? ok(fn(result.data)) : result;
}

export function mapErr<T, E, F>(
    result: Result<T, E>,
    fn: (error: E) => F,
): Result<T, F> {
    return isErr(result) ? err(fn(result.error)) : result;
}

export function andThen<T, U, E>(
    result: Result<T, E>,
    fn: (value: T) => Result<U, E>,
): Result<U, E> {
    return isOk(result) ? fn(result.data) : result;
}
