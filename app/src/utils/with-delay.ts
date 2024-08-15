export async function withDelay<T>(func: () => Promise<T>, onDone: (data: T) => void, minDelay: number) {
    const start = new Date().getMilliseconds();
    const res = await func();
    const deltaTime = new Date().getMilliseconds() - start;
    const remainingDelay = minDelay - deltaTime;
    if (remainingDelay > 0) {
        setTimeout(() => onDone(res), remainingDelay);
    } else {
        onDone(res);
    }
}