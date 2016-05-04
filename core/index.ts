
import {SVGRenderer} from './rendering/svg/SVGRenderer';
import {List} from 'immutable';

document.addEventListener('DOMContentLoaded', () => {
	
	var svg = document.getElementById('svg');

	var svgRenderer = new SVGRenderer(svg);

	var point = {
		getX: () => {
			return 20;
		},

		getY() {
			return 20;
		}
	}

	svgRenderer.render('circle', List.of(point));

}, false);