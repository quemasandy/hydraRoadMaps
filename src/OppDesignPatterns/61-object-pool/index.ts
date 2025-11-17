/**
 * OBJECT POOL PATTERN
 * Reuse expensive objects instead of creating new ones
 *
 * Big Tech: Connection pools, thread pools, resource management
 */

class DatabaseConnection {
  constructor(public id: number) {
    console.log(`[Connection ${id}] Created (expensive operation)`);
  }

  query(sql: string): string {
    return `[Connection ${this.id}] Executing: ${sql}`;
  }
}

class ConnectionPool {
  private available: DatabaseConnection[] = [];
  private inUse: Set<DatabaseConnection> = new Set();
  private nextId = 1;

  constructor(private maxSize: number = 5) {}

  acquire(): DatabaseConnection {
    let connection: DatabaseConnection;

    if (this.available.length > 0) {
      connection = this.available.pop()!;
      console.log(`[Pool] Reusing connection ${connection.id}`);
    } else if (this.inUse.size < this.maxSize) {
      connection = new DatabaseConnection(this.nextId++);
      console.log(`[Pool] Created new connection ${connection.id}`);
    } else {
      throw new Error('Pool exhausted');
    }

    this.inUse.add(connection);
    return connection;
  }

  release(connection: DatabaseConnection): void {
    this.inUse.delete(connection);
    this.available.push(connection);
    console.log(`[Pool] Released connection ${connection.id}`);
  }

  getStats() {
    return {
      available: this.available.length,
      inUse: this.inUse.size,
      total: this.available.length + this.inUse.size
    };
  }
}

// Demo
console.log('='.repeat(60));
console.log('OBJECT POOL - Database Connection Pool');
console.log('='.repeat(60));

const pool = new ConnectionPool(3);

const conn1 = pool.acquire();
console.log(conn1.query('SELECT * FROM users'));

const conn2 = pool.acquire();
console.log(conn2.query('SELECT * FROM orders'));

pool.release(conn1);

const conn3 = pool.acquire(); // Should reuse conn1

console.log('Pool stats:', pool.getStats());

/**
 * PREGUNTAS:
 * 1. ¿Object Pool vs Flyweight?
 * 2. ¿Pool sizing strategies?
 * 3. ¿Object validation before reuse?
 * 4. ¿Thread-safe pools?
 * 5. ¿Pool exhaustion handling?
 * 6. ¿Connection pools (Postgres, MySQL)?
 * 7. ¿Object Pool in high-concurrency?
 * 8. ¿Pool vs factory pattern?
 */

export { ConnectionPool };
