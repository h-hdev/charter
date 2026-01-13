import Venn from './demo/venn';
import TreeMap from './demo/treemap';
import scatter from './demo/scatter';
import Polar from './demo/polar';

let types = {
	venn: Venn,
	treemap: TreeMap,
	scatter: scatter,
	polar: Polar
};


let type = (window.location.search && window.location.search.replace('?type=', '')) || 'venn';

types[type]();
