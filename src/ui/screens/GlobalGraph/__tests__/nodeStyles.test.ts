import { describe, it, expect } from 'vitest';
import { colorForType, colorForLayer } from '../nodeStyles';

describe('nodeStyles', () => {
  it('returns correct color for Business layer type', () => {
    expect(colorForType('BusinessProcess')).toBe('#FFFFB5');
    expect(colorForType('BusinessActor')).toBe('#FFFFB5');
  });

  it('returns correct color for Application layer type', () => {
    expect(colorForType('ApplicationComponent')).toBe('#B5FFFF');
    expect(colorForType('DataObject')).toBe('#B5FFFF');
  });

  it('returns correct color for Technology layer type', () => {
    expect(colorForType('Node')).toBe('#B5FFB5');
    expect(colorForType('Artifact')).toBe('#B5FFB5');
  });

  it('returns correct color for Strategy layer type', () => {
    expect(colorForType('Capability')).toBe('#FFB5B5');
  });

  it('returns correct color for Motivation layer type', () => {
    expect(colorForType('Goal')).toBe('#CCCCFF');
    expect(colorForType('Stakeholder')).toBe('#CCCCFF');
  });

  it('returns correct color for Implementation layer type', () => {
    expect(colorForType('WorkPackage')).toBe('#FFD4B5');
  });

  it('returns correct color for Physical layer type', () => {
    expect(colorForType('Equipment')).toBe('#C9E7CB');
  });

  it('returns gray for unknown type', () => {
    expect(colorForType('UnknownType')).toBe('#E0E0E0');
  });

  it('colorForLayer returns correct colors', () => {
    expect(colorForLayer('Business')).toBe('#FFFFB5');
    expect(colorForLayer('Application')).toBe('#B5FFFF');
    expect(colorForLayer('Technology')).toBe('#B5FFB5');
    expect(colorForLayer('Unknown')).toBe('#E0E0E0');
  });
});
