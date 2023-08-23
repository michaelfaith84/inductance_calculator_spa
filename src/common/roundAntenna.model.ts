import {AntennaMethods, NumberField} from "@/common/antennae";
import Antenna from "@/common/abstractAntenna.model";

export default class RoundAntenna extends Antenna implements AntennaMethods {
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