
export class GreetingHandler {
  private static greetings = ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'];

  public static isGreeting(query: string): boolean {
    return this.greetings.some(greeting => query.toLowerCase().includes(greeting));
  }

  public static getGreetingResponse(): string {
    const greetings = [
      "Hello! I'm here to help you understand and support the Khoisan First Nations mandate. Would you like to learn about our land sovereignty, cultural recognition, representation, or financial reparation initiatives?",
      "Hi there! I'm your guide to the Khoisan First Nations mandate. What would you like to know about our mission for indigenous rights and cultural preservation?",
      "Welcome! I'm dedicated to sharing information about the Khoisan First Nations mandate. How can I help you understand our vital cause today?"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
}
