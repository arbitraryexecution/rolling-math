const BigNumber = require('bignumber.js');
const RollingMath = require('./rolling.math');

const bigZero = new BigNumber(0);
const bigNaN = new BigNumber(NaN);

const testElements = [new BigNumber(100),
  new BigNumber(110),
  new BigNumber(40),
  new BigNumber(55),
  new BigNumber(45),
  new BigNumber(70)];

const windowSize = 5;

describe('RollingMath library', () => {
  let rollingMath;

  describe('init', () => {
    it('should throw on creation if not provided a windowSize', () => {
      expect(() => {
        const temp = new RollingMath();
        temp();
      }).toThrow();
    });

    it('new object is correctly created when passed windowSize', () => {
      rollingMath = new RollingMath(windowSize);

      expect(rollingMath.elements).toEqual(new Array(windowSize));
      expect(rollingMath.nextIdx).toEqual(0);

      expect(rollingMath.getWindowSize()).toEqual(windowSize);
      expect(rollingMath.getSum()).toEqual(bigNaN);
      expect(rollingMath.getAverage()).toEqual(bigNaN);
      expect(rollingMath.getStandardDeviation()).toEqual(bigNaN);
    });
  });

  describe('operation', () => {
    beforeEach(() => {
      rollingMath = new RollingMath(windowSize);

      // adding without hitting windowSize
      for (let i = 0; i < windowSize; i += 1) {
        rollingMath.addElement(testElements[i]);
      }
    });

    describe('addElement', () => {
      it('test addElement', () => {
        // test adding invalid elements
        expect(() => {
          rollingMath.addElement(10);
        }).toThrow();

        expect(() => {
          rollingMath.addElement(new BigNumber(NaN));
        }).toThrow();

        expect(() => {
          rollingMath.addElement(new BigNumber(Infinity));
        }).toThrow();

        expect(() => {
          rollingMath.addElement(new BigNumber(-Infinity));
        }).toThrow();

        // check if we successfully added elements in the beforeEach
        expect(rollingMath.elements[0]).toEqual(testElements[0]);

        // adding after hitting windowSize
        rollingMath.addElement(testElements[windowSize]);

        expect(rollingMath.elements[0]).toEqual(testElements[windowSize]);
      });
    });

    describe('getSum', () => {
      it('test getSum', () => {
        expect(rollingMath.getSum()).toEqual(BigNumber.sum(...rollingMath.elements));

        const preWindowSize = rollingMath.getSum();

        // adding after hitting windowSize
        rollingMath.addElement(testElements[windowSize]);

        expect(rollingMath.getSum()).toEqual(BigNumber.sum(...rollingMath.elements));

        // ensure they are different values
        expect(rollingMath.getSum()).not.toEqual(preWindowSize);
      });
    });

    describe('getAverage', () => {
      it('test getAverage', () => {
        let calculatedAverage = BigNumber.sum(...rollingMath.elements).div(windowSize);
        expect(rollingMath.getAverage()).toEqual(calculatedAverage);

        const preWindowSize = rollingMath.getAverage();

        // adding after hitting windowSize
        rollingMath.addElement(testElements[windowSize]);

        calculatedAverage = BigNumber.sum(...rollingMath.elements).div(windowSize);
        expect(rollingMath.getAverage()).toEqual(calculatedAverage);

        // ensure they are different values
        expect(rollingMath.getAverage()).not.toEqual(preWindowSize);
      });
    });

    describe('getStandardDeviation', () => {
      it('test getStandardDevation', () => {
        // calculate the true variance
        let squares = rollingMath.elements.map((x) => x.minus(rollingMath.getAverage()).pow(2));
        let sumOfSquares = BigNumber.sum(...squares);
        let variance = sumOfSquares.div(windowSize - 1);

        // we have to round these to account for negligable rounding errors when using
        // square root and division
        expect(rollingMath.variance.toFixed(8)).toEqual(variance.toFixed(8));
        expect(rollingMath.getStandardDeviation().toFixed(8)).toEqual(variance.sqrt().toFixed(8));

        const preWindowSize = rollingMath.getStandardDeviation();

        // adding after hitting windowSize
        rollingMath.addElement(testElements[windowSize]);

        // calculate the true variance
        squares = rollingMath.elements.map((x) => x.minus(rollingMath.getAverage()).pow(2));
        sumOfSquares = BigNumber.sum(...squares);
        variance = sumOfSquares.div(windowSize - 1);

        // we have to round these to account for negligable rounding errors when using
        // square root and division
        expect(rollingMath.variance.toFixed(8)).toEqual(variance.toFixed(8));
        expect(rollingMath.getStandardDeviation().toFixed(8)).toEqual(variance.sqrt().toFixed(8));

        // ensure they are different values
        expect(rollingMath.getStandardDeviation()).not.toEqual(preWindowSize);
      });

      it('test negative variance', () => {
        // Due to miniscule rounding desparancies our function can return a negative variance
        // which is impossible. Make sure we can never return a negative variance.
        //
        // We will see negative variance when we update a non-zero variance to zero by pushing
        // windowSize number elements of the same value

        // add windowSize number of elements
        for (let i = 0; i < windowSize; i += 1) {
          rollingMath.addElement(bigZero);
        }

        // variance should be 0 once all elements are the same
        expect(rollingMath.variance).toEqual(bigZero);
      });
    });
  });
});
