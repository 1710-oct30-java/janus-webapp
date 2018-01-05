import { Pipe, PipeTransform } from '@angular/core';
/**
 * @author John Hudson
 */
@Pipe({ name: 'graphData' })
export class GraphDataPipe implements PipeTransform {
    /**
     * takes raw json input; outputs list of datasets.
     * @param rawData
     */
    transform(rawData: number[], dataSetLabels: string[]): any {
        const output: any[] = [];
        for (let i = 0; i < rawData.length; i++) {
            output.push(this.dataSet(rawData[i], dataSetLabels[i]));
        }
        return output;
    }
    /**
     * Creates object with map and label. This is a single dataset
    */
    dataSet(rawData: any, label: string) {
        return { data: this.rawDatatoMap(rawData), label: label };
    }
    /**
     * creates map object from raw json map.
    */
    rawDatatoMap(data: any) {
        const map = new Map();

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                map.set(key, data[key].toFixed(2));
            }
        }
        return map;
    }
}
