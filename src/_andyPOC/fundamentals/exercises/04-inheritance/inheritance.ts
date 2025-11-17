

class SytemLogger {
  constructor(public message: string) {}

  log(source: string) {
    console.log(`Log [${source}] [${new Date().toISOString()}] ${this.message}`);
  }
}

class EmailAlert extends SytemLogger {
  send() {
    this.log("EmailAlert");
    console.log(`Enviando email ${this.message}`);
  }
}

class SmsAlert extends SytemLogger {
  send() {
    this.log("SmsAlert");
    console.log(`Enviando SMS ${this.message}`);
  }
}

class SlackAlert extends SytemLogger {
  send() {
    this.log("SlackAlert");
    console.log(`Enviando mensaje a Slack ${this.message}`);
  }
}

new EmailAlert("Servidor caído").send();
new SmsAlert("Alta temperatura detectada").send();
new SlackAlert("Nuevo mensaje en canal general").send();