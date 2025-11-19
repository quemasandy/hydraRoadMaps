interface Item {
  name: string;
  total: number;
}

type Sales = Item[];

interface Formatter {
  format(data: Sales): string;
}

class JsonFormatter implements Formatter {
  format(data: Sales): string {
    return JSON.stringify(data, null, 2);
  }
}

class TableFormatter implements Formatter {
  format(data: Sales): string {
    return data.map((item) => `${item.name} | ${item.total}`).join('\n');
  }
}

class HtmlFormatter implements Formatter {
  format(data: Sales): string {
    let html = '<table><tr><th>Name</th><th>Total</th></tr>';
    data.forEach((item) => {
      html += `<tr><td>${item.name}</td><td>${item.total}</td></tr>`;
    });
    html += '</table>';
    return html;
  }
}

class ReportPrinter {
  constructor(private formatter: Formatter) {}

  setFormatter(formatter: Formatter) {
    this.formatter = formatter;
  }

  print(data: Sales) {
    console.log(this.formatter.format(data));
  }
}

const sales = [
  { name: 'Plan Básico', total: 12 },
  { name: 'Plan Pro', total: 7 },
];

const printer = new ReportPrinter(new JsonFormatter());
printer.print(sales);

printer.setFormatter(new TableFormatter());
printer.print(sales);

printer.setFormatter(new HtmlFormatter());
printer.print(sales);
