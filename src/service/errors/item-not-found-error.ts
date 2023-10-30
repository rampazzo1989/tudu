export class ItemNotFoundError extends Error {
  constructor(msg: string, additionalData?: any) {
    super(`${msg} ${additionalData}`);

    this.name = 'ItemNotFoundError';
  }
}
