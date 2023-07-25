import {
    AntennaMethods,
    CommonAntennaInterface,
    NumberField,
    SquareAntennaInterface,
    StringField
} from "@/common/Antennae.types";

const DECIMAL_PLACES = 3;

abstract class Antenna implements CommonAntennaInterface {
    _averageWidth: NumberField;
    _diameter: NumberField;
    _numberOfTurns: NumberField;
    _type: string;
    _inductance: NumberField;
    _fields: (StringField | NumberField)[];

    constructor(type: string,
                averageWidth: number,
                diameter: number,
                numberOfTurns: number) {
        this._type = type;
        this._averageWidth = {
            key: "s",
            verbose: "Average Width",
            value: averageWidth
        };
        this._diameter = {
            key: "d",
            verbose: "Diameter",
            value: diameter
        };
        this._numberOfTurns = {
            key: "Na",
            verbose: "Number of Turns",
            value: numberOfTurns
        };
        this._inductance = this.initInductance();
        this._fields = [
            this._averageWidth,
            this._diameter,
            this._numberOfTurns
        ]
    }

    get type(): string {
        return this._type;
    }

    initInductance(): NumberField {
        return {
            key: "La",
            verbose: "Inductance",
            value: 0
        }
    }

    private convertInductance():string {
        // Unit prefixes
        const PREFIX_ARRAY = ["f", "p", "n", "µ", "m", "", "k", "M", "G", "T"];
        let inductance = this._inductance.value;

        if (inductance == 0) {
            return "0 fH";
        } else {
            const log10 = Math.log10(Math.abs(inductance));
            const count = Math.floor(log10 / 3.0);
            const index = count + 5;
            inductance /= Math.pow(10.0, count * 3);
            return index >= 0 && index < PREFIX_ARRAY.length ?
                `${inductance.toFixed(DECIMAL_PLACES)} ${PREFIX_ARRAY[index]}H` :
                inductance.toFixed(DECIMAL_PLACES) + ` fe${count * 3}H`;
        }
    }

    get inductance(): string {
        return this.convertInductance();
    }

    validateInductance(): boolean {
        const inductance = this.convertInductance();
        const units = inductance.substring(inductance.length - 2);
        const number = parseInt(inductance.substring(0, inductance.length -2).split("\\.")[0]);
        return (units === "nH" && number >= 300) || (units === "µH" && number <= 3)
    }
    get fields(): (StringField | NumberField)[] {
        return this._fields;
    }
}

export class RoundAntenna extends Antenna implements AntennaMethods {
    constructor(averageWidth: number,
                diameter: number,
                numberOfTurns: number) {
        super("round", averageWidth, diameter, numberOfTurns);
        this._inductance = this.calculateInductance();
        this._fields.push({
            ...this._inductance,
            value: this.inductance
        })
        this._fields.sort()
    }

    calculateInductance(): NumberField {
        return {
            key: "La",
            verbose: "Inductance",
            value:
                24.6
                * Math
                    .pow(this._numberOfTurns.value, 2.0) * (this._diameter.value / 10.0) / (1.0 + 2.75 * (this._averageWidth.value / 10.0 / (this._diameter.value / 10.0))) * 1.0E-9
        };
    }
}

export class SquareAntenna extends Antenna implements SquareAntennaInterface, AntennaMethods {
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
            SquareAntenna.calculateAverage(width, numberOfTurns, trackSpacing, trackWidth),
            SquareAntenna.calculateDiameter(trackThickness, trackWidth),
            numberOfTurns);
        this._width = {
            key: "a0",
            verbose: "Width",
            value: width
        }
        this._height = {
            key: "b0",
            verbose: "Height",
            value: height
        }
        this._fields.splice(this._fields.indexOf(this._averageWidth), 1)
        this._averageWidth = {
            ...this._averageWidth,
            key: "Aavg"
        }
        this._averageHeight = {
            key: "Bavg",
            verbose: "Average Height",
            value: SquareAntenna.calculateAverage(height, numberOfTurns, trackSpacing, trackWidth)
        }
        this._trackWidth = {
            key: "w",
            verbose: "Track Width",
            value: trackWidth
        }
        this._trackThickness = {
            key: "t",
            verbose: "Track Thickness",
            value: trackThickness
        }
        this._trackSpacing = {
            key: "g",
            verbose: "Track Spacing",
            value: trackSpacing
        }
        this._inductance = this.calculateInductance();
        this._fields.push(
            this._height,
            this._width,
            this._averageHeight,
            this._averageWidth,
            this._trackThickness,
            this._trackWidth,
            this._trackSpacing,
            {
            ...this._inductance,
            value: this.inductance
        })
        this._fields.sort()
    }

    static calculateAverage(value: number,
                            numberOfTurns: number,
                            trackSpacing: number,
                            trackWidth: number): number {
        return value - numberOfTurns * (trackSpacing + trackWidth);
    }

    static calculateDiameter(trackThickness: number, trackWidth: number): number {
        return 2 * (trackThickness / trackWidth) / Math.PI
    }

    calculateSingleAxisX(dimension: NumberField,
                                ): number {
        return dimension.value * Math.log(2.0 * this._averageWidth.value * this._averageHeight.value / (this._diameter.value * (this._averageWidth.value + Math.sqrt(Math.pow(this._averageWidth.value, 2.0) + Math.pow(this._averageHeight.value, 2.0)))));
    }

    calculateX3(): number {
        return 2.0 * (this._averageWidth.value + this._averageHeight.value - Math.sqrt(Math.pow(this._averageWidth.value, 2.0) + Math.pow(this._averageHeight.value, 2.0)));
    }

    calculateX4(): number {
        return  (this._averageWidth.value + this._averageHeight.value) / 4.0;
    }

    calculateInductance(): NumberField {
        const u0 = 1.256637062E-9;
        return {
            key: "La",
            verbose: "Inductance",
            value: u0 / Math.PI * (this.calculateSingleAxisX(this._width) + this.calculateSingleAxisX(this._height) - this.calculateX3() + this.calculateX4()) * Math.pow(this._numberOfTurns.value, 1.8)
        }
    }
}