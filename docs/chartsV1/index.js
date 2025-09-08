
import PCoA from './module/PCoA';
import CCA from './module/CCA';
import Venn from './module/Venn';
import Ternary from './module/Ternary';
import TTest from './module/TTest';


let map = {
   cca: CCA,
   pcoa: PCoA,
   venn: Venn,
   ternary: Ternary,
   tTest: TTest
}

window.Highcharts = {};
for (let key in map) {
   window.Highcharts[key] = (el, options) => {
      return new map[key](el, options).chart;
   }
}