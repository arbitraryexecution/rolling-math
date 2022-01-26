# rolling-math

The rolling-math library calculates simple moving average and standard deviation on a sliding window
of BigNumber values.

This package was created to support the development of Forta scan agents.  It can be used to filter 
out short-term fluctuations and also detect anomalous value changes.

## Dependencies

This package depends on the `bignumber.js' package.


## Installation

Use the node package manager npm to add the library to your project:

```
$ npm install rolling-math
```

## Usage

Import the rolling-math and BigNumber libraries into a JavaScript file like this:

```
const BigNumber = require('bignumber.js');
const RollingMath = require('rolling-math');
```

For each data set you wish to track over time, create a new RollingMath object and specify the
window size:

```
rollingMath = new RollingMath(5);
```

The window size (5 in this case) represents the maximum number of previous elements the RollingMath
object will store.  Each time a new value is added, the oldest value is removed once the window
size limit has been reached.  Window size corresponds directly with time--if you are sampling once
per day, and the window size is 5, you have a 5-day Simple Moving Average (SMA) filter.


### Functions

**addElement(element):** Add a value to the data set.  The 'element' value must be a BigNumber type.
**getNumElements():** Returns the number of values currently stored
**getWindowSize():** Returns the window size
**getSum():** Returns the sum of the currently stored values
**getAverage():** Return the average of the currently stored values
**getStandardDeviation():** Return the standard deviation of the currently stored values

### Examples

Populate the rolling-math object with data:

```
rollingMath = new RollingMath(5);
rollingMath.addElement(new BigNumber(100));
rollingMath.addElement(new BigNumber(40));
rollingMath.addElement(new BigNumber(55));
rollingMath.addElement(new BigNumber(45));
rollingMath.addElement(new BigNumber(70));
rollingMath.addElement(new BigNumber(10));  // this will pop 100 out of the sliding window
```

Compute statistics:

```
const sum = rollingMath.getSum();                   // 220
const average = rollingMath.getAverage();           // 44
const stdDev = rollingMath.getStandardDeviation();  // 22.19234
```

## License

GNO Affero General Public License (AGPLv3).  See [LICENSE](https://github.com/arbitraryexecution/rolling-math/blob/master/LICENSE).



