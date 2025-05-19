export class IdRegistry {
    private used: Set<string> = new Set();
    private counter: Map<string, number> = new Map();

    generateId(prefix: string): string {
        while (true) {
            const counter = this.inclement(prefix);
            const id = prefix + String(counter);
            if (!this.used.has(id)) {
                return id;
            }
            if (counter > 100000) {
                throw "unsupported";
            }
        }
    }

    inclement(prefix: string): number {
        let next = 1;
        if (this.counter.has(prefix)) {
            next += this.counter.get(prefix)!;
        }
        this.counter.set(prefix, next);
        return next;
    }

    reserveId(id: string): void {
        this.used.add(id);
    }

    releaseId(id: string): void {
        this.used.delete(id);
    }
}