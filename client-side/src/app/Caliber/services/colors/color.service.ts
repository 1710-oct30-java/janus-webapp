import { Injectable } from '@angular/core';

@Injectable()
export class ColorService {
  lineColors = [];
  constructor() { }

  /**
   * Gets the required amount of line colors.
   * Spawns new colors if there aren't enough colors stored.
   * @param {number} amount
   * @returns {Array<any>}
   * @memberof ColorService
   */
  public getLineColors(amount: number): Array<any> {
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

  /**
   * Creates a random new color if a color isn't passed in
   * @param {any} incomingcolour
   * @returns {*}
   * @memberof ColorService
   */
  public generateLineColor(incomingcolour): any {
    let gen1Colour;
    if (incomingcolour === undefined) {
      gen1Colour = this.generateRandomRGBA();
    } else {
      gen1Colour = incomingcolour;
    }
    const color = {
      backgroundColor: gen1Colour + '.2)',
      pointBackgroundColor: gen1Colour + '.5)',
      borderColor: gen1Colour + '1)',
      pointHoverBackgroundColor: gen1Colour + '.3)',
      pointHoverBorderColor: gen1Colour + '.3)',
      pointBorderColor: '#fff',
      borderWidth: 2,
    };
    return color;
  }

  /**
   *
   * creates a random rgba string for the generate line color method
   * @private
   * @returns {string}
   * @memberof ColorService
   */
  private generateRandomRGBA(): string {
    return `rgba(${Math.floor(Math.random() * 256) + 1},
    ${Math.floor(Math.random() * 256) + 1},
    ${Math.floor(Math.random() * 256) + 1}, `;
  }

  /**
   * sets vpHomeLineColors
   * @param {Array<any>} colors
   * @memberof ColorService
   */
  public setVPHomeLineColors(colors: Array<any>) {
    this.lineColors = colors;
  }
}
