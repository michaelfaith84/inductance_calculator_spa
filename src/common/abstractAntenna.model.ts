import {
    AntennaMethods,
    CommonAntennaInterface, DisplayField,
    NumberField,
    SquareAntennaInterface,
    StringField
} from "@/common/antennae";
import Decimal from "decimal.js";

const DECIMAL_PLACES = 3;

export default abstract class Antenna implements CommonAntennaInterface {
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

