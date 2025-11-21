
// ❌ BEFORE: The "Glue" Code
// Logic and Presentation are glued together.
// You cannot reuse the "Data Fetching" part without also dragging in the "HTML Generation" part.

export class SalesReport {
  async generate(date: Date): Promise<string> {
    // 1. Fetch Data (Valuable logic!)
    const data = await db.query('SELECT * FROM sales WHERE date = ?', [date]);
    const total = data.reduce((acc: number, row: any) => acc + row.amount, 0);

    // 2. Format Output (Hardcoded to HTML)
    // What if we need a CSV export next week? We can't reuse the fetch logic above!
    // We'd have to copy-paste the SQL query into a new "CsvSalesReport" class.
    return `
      <html>
        <body>
          <h1>Sales Report</h1>
          <p>Total: $${total}</p>
        </body>
      </html>
    `;
  }
}

const db = { query: async (...args: any[]) => [{ amount: 100 }, { amount: 50 }] };
