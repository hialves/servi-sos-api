export class Money {
  public readonly value: number;

  constructor(value: number) {
    if (value < 0) throw new Error('[Money] received negative value');

    if (String(value).indexOf('.')) {
      this.value = Number(value.toFixed(0));
    } else {
      this.value = value;
    }
  }

  readFormatPrice() {
    return `${this.humanFormatPrice().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
  }

  humanFormatPrice() {
    return this.value / 100;
  }
}
