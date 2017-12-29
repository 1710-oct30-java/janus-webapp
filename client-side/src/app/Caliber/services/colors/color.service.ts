import { Injectable } from '@angular/core';

@Injectable()
export class ColorService {
  lineColors = [];
  constructor() { }

  public getLineColors(amount: number) {
    console.log(this.lineColors.length);
    if (amount > this.lineColors.length) {
      this.createLineColors(amount - this.lineColors.length);
    }
    console.log(this.lineColors);
    return this.lineColors.slice(0, amount);
  }
  private createLineColors(amount: number) {
    for (let i = 0; i < amount; i++) {
      this.lineColors.push(this.generateLineColor());
    }
  }

  private generateLineColor() {
    const gen1Color = this.generateRandomRGBA();
    const color = {
      backgroundColor: gen1Color + '.5)',
      pointBackgroundColor: gen1Color + '.5)',
      borderColor: gen1Color + '1)',
      pointHoverBackgroundColor: gen1Color + '.3)',
      pointHoverBorderColor: gen1Color + '.3)',
      pointBorderColor: '#fff'
    };
    return color;
  }

  private generateRandomRGBA() {
    return `rgba(${Math.floor(Math.random() * 256) + 1},
    ${Math.floor(Math.random() * 256) + 1},
    ${Math.floor(Math.random() * 256) + 1}, `;
  }
  public setVPHomeLineColors(colors: Array<any>) {
    this.lineColors = colors;
  }
}
