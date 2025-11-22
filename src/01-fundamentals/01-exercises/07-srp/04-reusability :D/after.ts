
// ✅ AFTER: Legos (Composable Parts)
// The "Data Fetcher" is a reusable Lego brick.
// We can snap it into an HTML generator, a CSV generator, or a JSON API.

// Lego Piece 1: Pure Data Fetching
export class SalesRepository {
  async getSales(date: Date): Promise<{ total: number; count: number }> {
    const data = await db.query('SELECT * FROM sales WHERE date = ?', [date]);
    return {
      total: data.reduce((acc: number, row: any) => acc + row.amount, 0),
      count: data.length
    };
  }
}

// Lego Piece 2: HTML Formatter
export class HtmlReportFormatter {
  format(data: { total: number }): string {
    return `<h1>Total: $${data.total}</h1>`;
  }
}

// Lego Piece 3: CSV Formatter (New requirement? No problem!)
export class CsvReportFormatter {
  format(data: { total: number }): string {
    return `Metric,Value\nTotal,${data.total}`;
  }
}

// Usage: Combine the Legos
const repo = new SalesRepository();
const html = new HtmlReportFormatter().format(await repo.getSales(new Date()));
const csv = new CsvReportFormatter().format(await repo.getSales(new Date()));

const db = { query: async (...args: any[]) => [{ amount: 100 }, { amount: 50 }] };
