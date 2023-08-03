import {RoundAntenna} from "../common/antennae.models";
import {expect, test} from '@jest/globals';

test('Round Antenna Model Test', ()=>{
    const testAntenna1 = new RoundAntenna(15, 20, 6)
    expect(testAntenna1.fields[0].key).toBe('s')
    expect(testAntenna1.fields[0].verbose).toBe('Average Width')
    expect(testAntenna1.fields[0].value).toBe(15)
    expect(testAntenna1.fields[1].key).toBe('d')
    expect(testAntenna1.fields[1].verbose).toBe('Diameter')
    expect(testAntenna1.fields[1].value).toBe(20)
    expect(testAntenna1.fields[2].key).toBe('Na')
    expect(testAntenna1.fields[2].verbose).toBe('Number of Turns')
    expect(testAntenna1.fields[2].value).toBe(6)
    expect(testAntenna1.inductance).toBe('578.351 nH')
    expect(testAntenna1.validateInductance()).toBe(true)
})