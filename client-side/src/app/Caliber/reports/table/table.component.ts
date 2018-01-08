import { Component, OnInit, Input, OnChanges, sequence } from '@angular/core';
/**
 * @author John Hudson
 */
@Component({
    selector: 'app-table',
    templateUrl: './table.component.html'
})

export class TableComponent implements OnInit, OnChanges {
    @Input() data: any;
    @Input() type: string;

    public tableMaps: any = null;
    public tableData: any[] = null;
    public tableLabels: any[] = null;
    public tableType: string = null;
    ngOnInit() {
        this.tableMaps = this.data;
        this.tableType = this.type;

        const _tableData: any[] = [];
        let _tableLabels: string[] = [];
        let label = true;
        // gets data from input
        for (const tableMap of this.tableMaps) {
            const _tableDataRow: number[] = [];
            tableMap.data.forEach((value: number, key: string) => {
                _tableDataRow.push(value);
                if (label) {
                    _tableLabels.push(key);
                }
            });
            label = false;
            _tableData.push({ data: _tableDataRow, label: tableMap.label });
        }

        // Labels weeks since the label would just be numbers otherwise
        if (this.tableType === 'line') {
            for (let i = 0; i < _tableLabels.length; i++) {
                _tableLabels[i] = 'Week ' + _tableLabels[i];
            }
        }
        if (_tableData[0].data.length === 1 && _tableData[1] !== undefined) {
            _tableLabels = [];
            this.tableMaps[1].data.forEach((value: number, key: string) => {
                _tableLabels.push(key);
            });
        }
        this.tableData = _tableData;
        this.tableLabels = _tableLabels;

        // creates a sequence of numbers for iterating in ngFor

    }
    /**
     * do this when the data changes
     * @param changes
     */
    public ngOnChanges(changes) {
        if (changes['data']) {
            this.ngOnInit();
        }
    }
    /**
     * tells html how to display things
     */
    typeCheck() {
        if (this.tableType === 'bar') {
            if (this.tableData[0].data.length === 1 && this.tableData[1] !== undefined) {
                return 3;
            } else {
                return 4;
            }
        }
        if (this.tableType === 'line') {
            if (this.tableData.length > 1) {
                return 2;
            }
            return 1;
        }
        return 0;
    }
    /**
     * @param step number of steps for sequence
     * @returns indexSequence; and array based in length of labels for ngFor iterating
     */
    indexSequence(step: number) {
        const indexSequence = [];
        for (let i = 0; i < this.tableLabels.length; i += step) {
            indexSequence.push(i);
        }
        return indexSequence;
    }
    /**
     * @param n number of steps for sequence
     * @returns indexSequence; and array length n for ngFor iterating
     */
    numberSequence(n: number) {
        const iSequence = [];
        for (let i = 0; i < n; i++) {
            iSequence.push(i);
        }
        return iSequence;
    }
}
