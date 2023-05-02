"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const convert_format_1 = require("../src/convert_format");
describe('parseDuration', () => {
    it('should parse duration in seconds for a valid duration string', () => {
        // Test valid duration string format
        (0, chai_1.expect)((0, convert_format_1.parseDuration)('PT1M1.2S')).to.equal(61.2);
        (0, chai_1.expect)((0, convert_format_1.parseDuration)('PT1H2M3S')).to.equal(3723);
        (0, chai_1.expect)((0, convert_format_1.parseDuration)('P1DT2H3M4.5S')).to.equal(93784.5);
        (0, chai_1.expect)((0, convert_format_1.parseDuration)('P10Y')).to.equal(315360000);
        (0, chai_1.expect)((0, convert_format_1.parseDuration)('P23DT23H')).to.equal(2073600);
        // Test valid duration strings with omitted elements
        (0, chai_1.expect)((0, convert_format_1.parseDuration)('PT30S')).to.equal(30);
        (0, chai_1.expect)((0, convert_format_1.parseDuration)('PT3M')).to.equal(180);
        (0, chai_1.expect)((0, convert_format_1.parseDuration)('P3D')).to.equal(259200);
        (0, chai_1.expect)((0, convert_format_1.parseDuration)('P3Y')).to.equal(946080000);
        // Test valid zero duration strings
        (0, chai_1.expect)((0, convert_format_1.parseDuration)('PT0S')).to.equal(0);
        (0, chai_1.expect)((0, convert_format_1.parseDuration)('P0D')).to.equal(0);
    });
    it('should throw an error for invalid duration string format', () => {
        // Test invalid duration string format
        (0, chai_1.expect)(() => (0, convert_format_1.parseDuration)('PT')).to.throw(Error);
        (0, chai_1.expect)(() => (0, convert_format_1.parseDuration)('P')).to.throw(Error);
        (0, chai_1.expect)(() => (0, convert_format_1.parseDuration)('P0YT0H0M0S')).to.throw(Error);
    });
    it('should throw an error if month value is not set to 0', () => {
        // Test invalid month value
        (0, chai_1.expect)(() => (0, convert_format_1.parseDuration)('P1M')).to.throw(Error);
        (0, chai_1.expect)(() => (0, convert_format_1.parseDuration)('P1Y1M')).to.throw(Error);
        (0, chai_1.expect)(() => (0, convert_format_1.parseDuration)('P1Y1MT1M')).to.throw(Error);
    });
});
