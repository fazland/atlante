/**
 * Provide exclusive locking.
 */
declare class Mutex {
    private _queue: (() => void)[];
    private _pending: boolean;

    /**
     * Whether the mutex is locked.
     */
    public readonly locked: boolean;

    /**
     * Constructor.
     */
    constructor();

    /**
     * Acquires the lock.
     * Use `await` to wait for lock to be available.
     */
    acquire(): Promise<Mutex>;

    /**
     * Runs task exclusively.
     */
    runExclusive<T = any>(callback: () => T): Promise<T>;

    /**
     * Releases the mutex.
     */
    release(): void;

    /**
     * Unfreeze the next task in queue.
     */
    private _dispatchNext(): void;
}

export = Mutex;
