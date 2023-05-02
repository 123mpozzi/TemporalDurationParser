"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
//import { parseDuration } from "../src/convert_format";
const duration_1 = require("../src/duration");
const rewire_1 = __importDefault(require("rewire"));
const rewiredModule = (0, rewire_1.default)('../src/dateParser');
const rewiredParses = rewiredModule.__get__('DateParser');
describe('parseDuration', () => {
    it('test parsing time component', () => {
        (0, chai_1.expect)(new rewiredParses().parseTimeComponent('1M1S').createModel().toSeconds()).to.equal(61);
        (0, chai_1.expect)(new rewiredParses().parseTimeComponent('1M1.2S').createModel().toSeconds()).to.equal(61.2);
    });
    it('test throw error on invalid formats', () => {
        // throw errors on invalid formats
        // non funziona il test perché non ho ben capito come usare 'bind' per controllare
        // che l'errore sia proprio lo stesso
        (0, chai_1.expect)(function () {
            duration_1.Duration.from('T1M1.2S').toSeconds();
        }).to.throw(new RangeError(duration_1.Duration.ERRORS.INVALID_FORMAT));
        (0, chai_1.expect)(function () {
            duration_1.Duration.from('PT').toSeconds();
        }).to.throw(new RangeError(duration_1.Duration.ERRORS.INVALID_FORMAT));
    });
    it('test throw error on months not set to 0', () => {
        // With months not set to 0
        // non funziona il test perché non ho ben capito come usare 'bind' per controllare
        // che l'errore sia proprio lo stesso
        (0, chai_1.expect)(duration_1.Duration.from('P11MT1M1S').toSeconds()).to.throw(new RangeError(duration_1.Duration.ERRORS.BANNED_PARAM));
        (0, chai_1.expect)(duration_1.Duration.from('P9MT1M1S').toSeconds()).to.throw(new RangeError(duration_1.Duration.ERRORS.BANNED_PARAM));
    });
    it('test normal strings', () => {
        (0, chai_1.expect)(duration_1.Duration.from('PT1M1.2S').toSeconds()).to.equal(61.2);
        (0, chai_1.expect)(duration_1.Duration.from('PT1M1S').toSeconds()).to.equal(61);
        //expect(new Duration.parseDuration('P1Y1M1DT1H1M1.1S')).to.equal(61);
    });
    it('test minutes vs months (both have designator M)', () => {
        (0, chai_1.expect)(duration_1.Duration.from('P1M').toSeconds()).to.equal(-1);
        (0, chai_1.expect)(duration_1.Duration.from('PT1M').toSeconds()).to.equal(60);
    });
    it('test zeros', () => {
        (0, chai_1.expect)(duration_1.Duration.from('PT0S').toSeconds()).to.equal(0);
        (0, chai_1.expect)(duration_1.Duration.from('P0D').toSeconds()).to.equal(0);
    });
    it('test fractional values', () => {
        (0, chai_1.expect)(duration_1.Duration.from('PT0.0021S').toSeconds()).to.equal(0.0021);
        (0, chai_1.expect)(duration_1.Duration.from('PT0.5H').toSeconds()).to.equal(1800);
    });
    it('test overflowing params', () => {
        (0, chai_1.expect)(duration_1.Duration.from('PT36H').toSeconds()).to.equal(129600);
        (0, chai_1.expect)(duration_1.Duration.from('PT1M120S').toSeconds()).to.equal(180);
    });
});
