
class Dragable {

	static moveable = true;
	static editable = true;

	constructor(chart, mousedown, element, object) {
		this.chart = chart;
		this.mousedown = mousedown;
		this.start = mousedown;
		this.element = element;
		this.object = object;
	}

	static attach(element, e, chart) {
		return null;
	}

	moving(e) {

		let moving = {
			x: e.chartX - this.mousedown.x,
			y: e.chartY - this.mousedown.y
		};



		let attr = {
			x: parseInt(this.element.getAttribute('x')) + moving.x,
			y: parseInt(this.element.getAttribute('y')) + moving.y
		};

		this.element.setAttribute('x', attr.x);
		this.element.setAttribute('y', attr.y);

		this.mousedown = {
			x: e.chartX,
			y: e.chartY
		}
	}

	moveEnd(e) {

		
		this.destory()
		return null
	}

	destory() {
		this.mousedown = null;
		this.start = null;
		this.element = null;
	}
}

export default Dragable