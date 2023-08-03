import {
    AntennaMethods,
    CommonAntennaInterface, DisplayField,
    NumberField,
    SquareAntennaInterface,
    StringField
} from "@/common/antennae.types";
import Decimal from "decimal.js";

const DECIMAL_PLACES = 3;

abstract class Antenna implements CommonAntennaInterface {
    _averageWidth: NumberField;
    _diameter: NumberField;
    _numberOfTurns: NumberField;
    _type: string;
    _inductance: NumberField;
    _fields: (StringField | DisplayField)[];

    constructor(type: string,
                averageWidth: (number),
                diameter: number,
                numberOfTurns: number) {
        this._type = type;
        this._averageWidth = {
            key: "s",
            verbose: "Average Width",
            value: new Decimal(averageWidth)
        };
        this._diameter = {
            key: "d",
            verbose: "Diameter",
            value: new Decimal(diameter)
        };
        this._numberOfTurns = {
            key: "Na",
            verbose: "Number of Turns",
            value: new Decimal(numberOfTurns)
        };
        this._inductance = this.initInductance();
        this._fields = this.convertField([this._averageWidth,
            this._diameter,
            this._numberOfTurns])
    }

    get type(): string {
        return this._type;
    }

    initInductance(): NumberField {
        return {
            key: "La",
            verbose: "Inductance",
            value: new Decimal(0)
        }
    }

    private convertInductance():string {
        // Unit prefixes
        const PREFIX_ARRAY = ["f", "p", "n", "µ", "m", "", "k", "M", "G", "T"];
        let inductance = this._inductance.value;

        if (inductance == new Decimal(0)) {
            return "0 fH";
        } else {
            const log10 = Decimal.log10(Decimal.abs(inductance));
            const count = Decimal.floor(log10.div(3));
            const index = count.add(5);
            inductance = inductance.div(Decimal.pow(10, new Decimal(count.mul(3))));
            return index.gte(0)  && index.lt(PREFIX_ARRAY.length) ?
                `${inductance.toFixed(DECIMAL_PLACES)} ${PREFIX_ARRAY[index.toNumber()]}H` :
                inductance.toFixed(DECIMAL_PLACES) + ` fe${count.mul(3)}H`;
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

    protected convertField(fields: NumberField[]) {
        return fields.map(field=> {
            return {...field,
                value: field.value.toNumber()}
        })
    }

    get fields(): (StringField | DisplayField)[] {
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
            value: this._numberOfTurns.value.pow(2).mul(this._diameter.value.div(10)).div((this._averageWidth.value.div(10).div(this._diameter.value.div(10))).mul(2.75).add(1)).mul(24.6).mul(1.0E-9),
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