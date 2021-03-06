/* eslint-disable */
import random from './random';

// from http://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
export default function gaussian(mean, stdev, min = -Math.infinity, max = Math.infinity) {
    var y2;
    var use_last = false;
    return function() {
        var y1;
        if(use_last) {
           y1 = y2;
           use_last = false;
        }
        else {
            var x1, x2, w;
            do {
                 x1 = 2.0 * random() - 1.0;
                 x2 = 2.0 * random() - 1.0;
                 w  = x1 * x1 + x2 * x2;
            } while( w >= 1.0);
            w = Math.sqrt((-2.0 * Math.log(w))/w);
            y1 = x1 * w;
            y2 = x2 * w;
            use_last = true;
       }

       var retval = mean + stdev * y1;

       if (retval < min) retval = min;
       if (retval > max) retval = max;

       if(retval < 0) retval = -retval;

       return retval;
   }
}
