interface Language {
  sayHello(): void;
  sayGoodbye(): void;
}

class English implements Language {
  sayHello() {
    console.log('Hello!!');
  }
  sayGoodbye(): void {
    console.log('Goodbye!!');
  }
}

class Spanish implements Language {
  sayHello() {
    console.log('Hola!!');
  }
  sayGoodbye(): void {
    console.log('Adiós!!');
  }
}

class Agent {
  constructor(private language: Language) {}

  setLanguage(language: Language) {
    this.language = language;
  }

  sayHello() {
    this.language.sayHello();
  }

  sayGoodbye() {
    this.language.sayGoodbye();
  }
}

function main(languageCode: string) {
  const languageMap: { [key: string]: Language } = {
    en: new English(),
    es: new Spanish(),
  };

  const selectedLanguage = languageMap[languageCode] || new English();

  const agent = new Agent(selectedLanguage);
  agent.sayHello();
  agent.sayGoodbye();

  agent.setLanguage(new Spanish());
  agent.sayHello();
  agent.sayGoodbye();
}

main('en');
