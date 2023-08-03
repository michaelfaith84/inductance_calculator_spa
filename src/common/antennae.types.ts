import Decimal from "decimal.js";

export interface AntennaMethods {
    type: string;
    inductance: string;
}

export interface StringField {
    key: string,
    verbose: string,
    value: string
}

export interface NumberField {
    key: string,
    verbose: string,
    value: (Decimal)
}

export interface DisplayField {
    key: string,
    verbose: string,
    value: number
}

export interface CommonAntennaInterface {
    _type: string;
    _averageWidth: NumberField
    _diameter: NumberField
    _numberOfTurns: NumberField
    _inductance: NumberField
    _fields: (StringField | DisplayField)[]
}

export interface SquareAntennaInterface {
    _width: NumberField
    _height: NumberField
    _averageHeight: NumberField
    _trackWidth: NumberField
    _trackThickness: NumberField
    _trackSpacing: NumberField
}