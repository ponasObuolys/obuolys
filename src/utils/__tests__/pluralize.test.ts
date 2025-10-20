import { pluralize, formatViewCount } from '../pluralize';

describe('pluralize', () => {
  const forms = {
    one: 'peržiūra',
    few: 'peržiūros',
    many: 'peržiūrų',
  };

  describe('one form (ends with 1, but not 11)', () => {
    it('should return "one" form for 1', () => {
      expect(pluralize(1, forms)).toBe('peržiūra');
    });

    it('should return "one" form for 21', () => {
      expect(pluralize(21, forms)).toBe('peržiūra');
    });

    it('should return "one" form for 31, 41, 51, etc.', () => {
      expect(pluralize(31, forms)).toBe('peržiūra');
      expect(pluralize(41, forms)).toBe('peržiūra');
      expect(pluralize(51, forms)).toBe('peržiūra');
      expect(pluralize(101, forms)).toBe('peržiūra');
    });
  });

  describe('few form (ends with 2-9, but not 12-19)', () => {
    it('should return "few" form for 2', () => {
      expect(pluralize(2, forms)).toBe('peržiūros');
    });

    it('should return "few" form for 3-9', () => {
      expect(pluralize(3, forms)).toBe('peržiūros');
      expect(pluralize(4, forms)).toBe('peržiūros');
      expect(pluralize(9, forms)).toBe('peržiūros');
    });

    it('should return "few" form for 22-29', () => {
      expect(pluralize(22, forms)).toBe('peržiūros');
      expect(pluralize(29, forms)).toBe('peržiūros');
    });

    it('should return "few" form for 73', () => {
      expect(pluralize(73, forms)).toBe('peržiūros');
    });
  });

  describe('many form (ends with 0 or 10-20)', () => {
    it('should return "many" form for 0', () => {
      expect(pluralize(0, forms)).toBe('peržiūrų');
    });

    it('should return "many" form for 10', () => {
      expect(pluralize(10, forms)).toBe('peržiūrų');
    });

    it('should return "many" form for 11-19', () => {
      expect(pluralize(11, forms)).toBe('peržiūrų');
      expect(pluralize(12, forms)).toBe('peržiūrų');
      expect(pluralize(19, forms)).toBe('peržiūrų');
    });

    it('should return "many" form for 20', () => {
      expect(pluralize(20, forms)).toBe('peržiūrų');
    });

    it('should return "many" form for 30, 40, 50, etc.', () => {
      expect(pluralize(30, forms)).toBe('peržiūrų');
      expect(pluralize(40, forms)).toBe('peržiūrų');
      expect(pluralize(100, forms)).toBe('peržiūrų');
    });
  });
});

describe('formatViewCount', () => {
  it('should format 1 view correctly', () => {
    expect(formatViewCount(1)).toBe('1 peržiūra');
  });

  it('should format 2 views correctly', () => {
    expect(formatViewCount(2)).toBe('2 peržiūros');
  });

  it('should format 7 views correctly', () => {
    expect(formatViewCount(7)).toBe('7 peržiūros');
  });

  it('should format 20 views correctly', () => {
    expect(formatViewCount(20)).toBe('20 peržiūrų');
  });

  it('should format 73 views correctly', () => {
    expect(formatViewCount(73)).toBe('73 peržiūros');
  });

  it('should format large numbers with locale', () => {
    expect(formatViewCount(1234)).toContain('peržiūros');
  });
});
