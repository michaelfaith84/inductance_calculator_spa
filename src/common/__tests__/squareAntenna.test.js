import SquareAntenna from "../squareAntenna.model";
import {expect, test} from '@jest/globals';
import Decimal from "decimal.js";


const testAntenna1 = new SquareAntenna(15,
    20,
    .00006,
    .0003,
    .0005,
    6)

test('Square Antenna: Average Height', ()=>{
    expect(testAntenna1._averageWidth.value).toEqual(new Decimal(14.9952))
})

test('Square Antenna: Average Width', ()=>{
    expect(testAntenna1._averageHeight.value).toEqual(new Decimal(19.9952))
})

test('Square Antenna: Single Axis Width', ()=>{
    expect(testAntenna1.calculateSingleAxisX(testAntenna1._width).toString()).toBe("166.32971049814242837")
})

test('Square Antenna: Single Axis Height', ()=> {
    expect(testAntenna1.calculateSingleAxisX(testAntenna1._height).toString()).toBe("219.41691322617520256")
})

test('Square Antenna: X3', ()=> {
    expect(testAntenna1.calculateX3().toString()).toBe("19.994239963126088306")
})

test('Square Antenna: X4', ()=> {
    expect(testAntenna1.calculateX4().toString()).toBe("8.7476")
})

test('Square Antenna: Inductance', ()=> {
    expect(testAntenna1.inductance.toString()).toBe("3.769 µH")
})