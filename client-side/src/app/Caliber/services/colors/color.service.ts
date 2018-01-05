import { Injectable } from '@angular/core';

@Injectable()
export class ColorService {
  lineColors = [];
  constructor() { }

  public getLineColors(amount: number) {
    if (amount > this.lineColors.length) {
      this.createLineColors(amount - this.lineColors.length);
    }
    return this.lineColors.slice(0, amount);
  }
  private createLineColors(amount: number) {
    for (let i = 0; i < amount; i++) {
      this.lineColors.push(this.generateLineColor(undefined));
    }
  }

  public generateLineColor(incomingcolour) {
    let gen1Colour;
    if (incomingcolour === undefined) {
      gen1Colour = this.generateRandomRGBA();
    } else {
      gen1Colour = incomingcolour;
    }
    const color = {
      backgroundColor: gen1Colour + '.3)',
      pointBackgroundColor: gen1Colour + '.5)',
      borderColor: gen1Colour + '1)',
      pointHoverBackgroundColor: gen1Colour + '.3)',
      pointHoverBorderColor: gen1Colour + '.3)',
      pointBorderColor: '#fff',
      borderWidth: 2,
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
