
import Highcharts from 'highcharts';


const Utils = {
   extends: (a, b) => {
      if (!b) {
         return a;
      }

      if (!a) {
         a = {};
      }

      for (let key in b) {
         a[key] = b[key];
      }

      return a;
   },

   merge: (a, b) => {
      return Highcharts.merge(a, b);
   },

   JSONCopy: data => {
      return JSON.parse(JSON.stringify(data));
   },

   isArray: what => {
      return what && typeof what === 'object' && what.constructor.toString().includes('Array');
   }
  
}

export default Utils;