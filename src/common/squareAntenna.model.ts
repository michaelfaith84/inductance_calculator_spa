import Antenna from "@/common/abstractAntenna.model";
import {AntennaMethods, NumberField, SquareAntennaInterface} from "@/common/antennae";

import Decimal from "decimal.js";

export default class SquareAntenna extends Antenna implements SquareAntennaInterface, AntennaMethods {
    _width: NumberField;
    _height: NumberField;
    _averageHeight: NumberField;
    _trackSpacing: NumberField;
    _trackWidth: NumberField;
    _trackThickness: NumberField;

    constructor(width: number,
                height: number,
                trackThickness: number,
                trackWidth: number,
                trackSpacing: number,
                numberOfTurns: number) {
        super("square",
            SquareAntenna.calculateAverage(width,
                numberOfTurns,
                trackSpacing,
                trackWidth).toNumber(),
            SquareAntenna.calculateDiameter(new Decimal(trackThickness), new Decimal(trackWidth)).toNumber(),
            numberOfTurns);
        this._width = {
            key: "a0",
            verbose: "Width",
            value: new Decimal(width)
        }
        this._height = {
            key: "b0",
            verbose: "Height",
            value: new Decimal(height)
        }
        this._fields.splice(this._fields.indexOf({...this._averageWidth,
            value: this._averageWidth.value.toNumber()}), 1)
        this._averageWidth = {
            ...this._averageWidth,
            key: "Aavg"
        }
        this._averageHeight = {
            key: "Bavg",
            verbose: "Average Height",
            value: SquareAntenna.calculateAverage(height,
                numberOfTurns,
                trackSpacing,
                trackWidth)
        }
        this._trackWidth = {
            key: "w",
            verbose: "Track Width",
            value: new Decimal(trackWidth)
        }
        this._trackThickness = {
            key: "t",
            verbose: "Track Thickness",
            value: new Decimal(trackThickness)
        }
        this._trackSpacing = {
            key: "g",
            verbose: "Track Spacing",
            value: new Decimal(trackSpacing)
        }
        this._inductance = this.calculateInductance();
        this._fields.push(
            ...this.convertField([this._height,
                this._width,
                this._averageHeight,
                this._averageWidth,
                this._trackThickness,
                this._trackWidth,
                this._trackSpacing]),
            {
                ...this._inductance,
                value: this.inductance
            })
        this._fields.sort()
    }

    static calculateAverage(value: number,
                            numberOfTurns: number,
                            trackSpacing: number,
                            trackWidth: number): Decimal {
        return new Decimal(value).minus(new Decimal(numberOfTurns).mul(new Decimal(trackSpacing).add(new Decimal(trackWidth))));
    }

    static calculateDiameter(trackThickness: Decimal, trackWidth: Decimal): Decimal {
        return (trackThickness.add(trackWidth)).div(new Decimal(Math.PI)).mul(2)
    }

    calculateSingleAxisX(dimension: NumberField,
    ): Decimal {
        const widthHeightProduct = this._averageHeight.value.mul(this._averageWidth.value).mul(2)
        const height = this._averageHeight.value.pow(2)
        const width = this._averageWidth.value.pow(2)
        const innerNest = this._diameter.value.mul(dimension.value.add(Decimal.sqrt(height.add(width))))
        const log = Decimal.ln(widthHeightProduct.div(innerNest));
        return dimension.value.mul(log);
    }

    calculateX3(): Decimal {
        return (this._averageWidth.value.add(this._averageHeight.value).minus(Decimal.sqrt(Decimal.pow(this._averageWidth.value, new Decimal(2)).add(Decimal.pow(this._averageHeight.value, new Decimal(2)))))).mul(2);
    }

    calculateX4(): Decimal {
        return  (this._averageWidth.value.add(this._averageHeight.value)).div(4);
    }

    calculateInductance(): NumberField {
        const u0 = new Decimal(1.256637062E-9);
        return {
            key: "La",
            verbose: "Inductance",
            value: u0.div(new Decimal(Math.PI)).mul(this.calculateSingleAxisX(this._width).add(this.calculateSingleAxisX(this._height)).minus(this.calculateX3()).add(this.calculateX4())).mul(Decimal.pow(this._numberOfTurns.value, 1.8))
        }
    }
}