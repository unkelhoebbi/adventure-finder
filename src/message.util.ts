export function createMessage(message: string, temperature: string): string {
  return encodeURI(
    `${message}. Die aktuelle Wassertemperatur beträgt ${temperature} °C`,
  );
}
