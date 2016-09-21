/**
 * Created by albert_chang on 9/15/16.
 */
'use strict';

import $ from 'jquery';
import _ from 'lodash';
import autoMakers from './cars';

(function() {
	var choices = {}, results = {}, options = {};
	var scenarios = [{
		name: '_.merge vs. Object.assign',
		fn: null
	}, {
		name: '_.mapValues vs. For-in',
		fn: null
	}, {
		name: '_.find vs. _.filter',
		fn: null
	}, {
		name: '_.memoize vs. object caching',
		fn: null
	}, {
		name: '_.get vs Crazy Traversal',
		fn: null
	}, {
		name: '_.pick vs. direct callout',
		fn: null
	}];

	const slogans = {
		BMW: 'Bimmer',
		Honda: "Ole reliable, or E. Honda from Street Fighter",
		Hyundai: 'Just sounds generic',
		Infinity: '...and Beyond!',
		Kia: 'Are they even a car maker?',
		Lamborghini: 'Vertical Doors',
		Lincoln: 'First Name: Abraham',
		Mini: '(Jason) Bourne Identity',
		Mitsubishi: 'We sell TVs, too',
		Toyota: 'Kanban'
	};

// Build baseline navigation menu w/ Drop down of scenarios to run
	$(document).ready(function() {
		scenarios.forEach((scenario, index) => {
			const html =
				'<li>'
				+ `<a href="#" data-id=${index}>${scenario.name}</a>`
				+'</li>';

			$('nav #scenarios .dropdown-menu').append(html);
		});

		$('nav #scenarios .dropdown-menu').on('click', (e) => {
			const index = e.target.dataset.id;
			const scenario = scenarios[index];
			scenario.fn();
			$('nav #title').html(`(${index}) : ${scenario.name}`);
		});
	});

	/* [0] _.merge vs. Object.assign
	 * SCENARIO:
	 * 	1. Create list of selected makes, and the makes available
	 * 	2. Build a drop-down menu of vehicle makes
	 */
	scenarios[0].fn = function() {
		let optionsWithKeys = _.mapKeys(autoMakers, (maker) => maker.id);
		options = _.mapValues(optionsWithKeys, option => {
			const slogan = slogans[option.name];
			return slogan ? Object.assign(option, {slogan}) : option;
		});
	};

	/* [1] _.mapValues vs. _.each vs. [array].forEach
	 * SCENARIO:
	 * 	1. Create list of selected makes, and the makes available
	 * 	2. Build a drop-down menu of vehicle makes
	 */
	scenarios[1].fn = function() {
		results = _.mapValues(options, (maker) => false);

		// for-in
		// autoMakers.forEach(maker => options[maker.id] = maker);
		// for (const id in options) {
		// 	results[id] = false;
		// }

		_.each(options, maker => {
			let { slogan } = maker;
			$('nav #makers .dropdown-menu').append(
				'<li>'
				+	`<a href="#" data-id=${maker.id}>${slogan ? '*' : ''} ${maker.name}</a>`
				+'</li>'
			);
		});
	};

	/* [2] _.find vs. [array].find vs. _.filter
	 * SCENARIO: Find vehicle brand within cars list after use has made a selection
	 *
	 * TODOs:
	 *  	1. Run utility to find the match within origin cars list
	 *   2. Add pop-ups that show all iterations being performed before result is found.
	 * */
	scenarios[2].fn = function() {
		$('nav #makers .dropdown-menu').on('click', (e) => {
			let content = '';
			const targetId = parseInt(e.target.dataset.id);

			// Array
			const foundMaker = autoMakers.find(maker => (maker.id === targetId));
			// const foundMaker = autoMakers.filter(maker => (maker.id === targetId));
			/*******************************************************************************

			 Add alerts of operation count to right pane of web app

			 *******************************************************************************/
			// Hash - Object
			// const foundMaker = choices[targetId];

			if (foundMaker) {
				content = '<div class="thumbnail">'
					+`<center><h2>${foundMaker.name}</h2></center>`
					+'<div class="caption">'
					+'<h3>Thumbnail label</h3>'
					+'</div>'
					+'</div>'
			} else {
				content = `<div class="well well-lg">Nothing Found for: ${id}</div>`
			}

			$('#content').html(content);
		});
	};

	/* [3] _.memoize vs. {object} key-value pair caching
	 * SCENARIO: Allow user to see whether a maker has a model in a particular year
	 *
	 * TODOs:
	 *   1. Add 'year' entry to last car maker index
	 *   2. Create numbered pop-ups, along with sub counts for models searched within
	 * */
	scenarios[3].fn = function() {
		const YEAR = 2016 - 1000;
		// const inputTemplate = {id: '', year: 2014};

		results = _.memoize((autoMakerId) => {
			// const autoMakerId = parseInt(id);
			const autoMaker = options[autoMakerId];
			const models = autoMaker.models;
			const status = _.some(models, (model) =>
				model.years.find((year) => year.year < YEAR) ? true : false);

			console.log("Caching for: ", autoMaker.name);
			choices[autoMakerId] = true;
			const cachedHtml = _.reduce(choices, (html, choice, key) => {
				if (choice) {
					html += `<li class="list-group-item"><b>${options[key].name}</b> cached...</li>`;
				}

				return html;
			}, '');


			$('#chapters').html('<ul class="list-group">' +cachedHtml +'</ul>');
				return status;
			});

			$('nav #makers .dropdown-menu').on('click', (e) => {
				const autoMakerId = e.target.dataset.id;
				const autoMaker = options[autoMakerId];
				// let start, end;
				// let oldConsoleTime = console.time;
				// console.time = function() {
				// 	start = arguments;
				// 	oldConsoleTime.apply(console, arguments);
				// };
				//
				// let oldConsoleTimeEnd = console.timeEnd;
				// console.timeEnd = function() {
				// 	end = arguments;
				// 	oldConsoleTimeEnd.apply(console, arguments);
				// };

				console.time();
				const status = results(autoMakerId);
				console.timeEnd();

				const state = status ? 'was' : 'not';
				const html = '<div class="well well-lg lead">'
					+`	${autoMaker.name} <b>${state}</b> made before ${YEAR}`
					+'</div>';

				$('#content').html(html);
			});
	};

	/* [4] _.get vs. manual way of accessing nested object (_.set vs. _.setIn (Immutable.js))
	 * SCENARIO: Allow user to access values that are deeply nested
	 * CAVEAT:
	 *  1. works best for objects with nest objects as parameters, unless array
	 * indexes are known.
	 *  2. Address the need to for more memory and extra operations in order to allow
	 *  convenient usage of _.get for situations that involve arrays
	 *
	 * TODOs:
	 *   1. Write logic to access cars list as-is + collections that store indexes of years
	 *   && vehicle models (so that I have a case to use _.get).
	 *   2. Create numbered pop-ups, along with sub counts for models searched within
	 * */
	scenarios[4].fn = function() {
		$('nav #makers .dropdown-menu').on('click', (e) => {
			const place = 0;
			const model = _.get(options , [e.target.dataset.id, 'models', place]);

			const html = '<div class="well well-lg lead">'
				+model ? `Position ${place} model is ${model.name}` : 'No model of that position'
				+'</div>';

			$('#content').html(html);
		});
	};

	/* [5] _.pick vs. _.omit (similar to _.every vs. _.some
	 * SCENARIO:
	 *
	 * TODOs:
	 * */
	scenarios[5].fn = function() {
		results = {};

		$('nav #makers .dropdown-menu').on('click', (e) => {
			const makerId = e.target.dataset.id;
			const maker = _.get(options, [makerId]);
			results[makerId] = _.pick(maker, ['name', 'slogan', 'niceName']);

			const cachedHtml = _.reduce(results, (html, choice, key) => {
				if (choice) {
					const { name, niceName, slogan } = choice;
					html += `<li class="list-group-item"><b>${name} : ${slogan || niceName}</b></li>`;
				}

				return html;
			}, '');

			$('#chapters').html('<ul class="list-group">' +cachedHtml +'</ul>');
		});
	};
})();

/* _.filter vs. _.reduce
 * SCENARIO:
 *
 * TODOs:
 * */

// _.reduce vs. {object}.reduce vs. _.each vs. [array].forEach vs. _.map
// _.pluck vs. _.filter

// _.remove vs. for/while-loop
// _.first + _.last vs. [array][0]
// _.every || _.some vs. _.find
// _.groupBy vs. YOUR way of doing it
// _.includes vs. STRING.includes || [array].includes
