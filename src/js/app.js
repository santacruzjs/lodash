/**
 * Created by albert_chang on 9/15/16.
 */
'use strict';

import $ from 'jquery';
import _ from 'lodash';
import autoMakers from './cars';

(function() {
	var choices, results = {}, options = {}, scenarios = [];

	const filters = {
		makers: {
			'bmw': "BMW",
			'honda': 'Honda',
			'toyota': 'Toyota',
			'mercedes': 'Mercedes Benz'
		},
		engineSize: {},
		color: {},
		type: {}
	};

// Build baseline navigation menu w/ Drop down of scenarios to run
	$(document).ready(function() {
		// scenarios.forEach(scenario => scenario());
		scenarios[0]();
		// scenario[1]();
		scenarios[2]();
	});


	/* _.mapValues vs. _.each vs. [array].forEach
	 * SCENARIO:
	 * 	1. Create list of selected makes, and the makes available
	 * 	2. Build a drop-down menu of vehicle makes
	 */
	scenarios.push(function() {
		// mapValues
		options = _.mapKeys(autoMakers, (maker) => maker.id);
		results = _.mapValues(options, (maker) => false);

		// for-in
		autoMakers.forEach(maker => options[maker.id] = maker);
		for (const id in options) {
			results[id] = false;
		}


		_.each(options, maker => $('#app .dropdown-menu').append(
			`<li><a href="#" data-id=${maker.id}>${maker.name}</a></li>`)
		);
	});

	/* _.find vs. [array].find vs. _.filter
	 * SCENARIO: Find vehicle brand within cars list after use has made a selection
	 *
	 * TODOs:
	 *  	1. Run utility to find the match within origin cars list
	 *   2. Add pop-ups that show all iterations being performed before result is found.
	 * */
	scenarios.push(function() {
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
	});

	/* _.memoize vs. {object} key-value pair caching
	 * SCENARIO: Allow user to see whether a maker has a model in a particular year
	 *
	 * TODOs:
	 *   1. Add 'year' entry to last car maker index
	 *   2. Create numbered pop-ups, along with sub counts for models searched within
	 * */
	scenarios.push(function() {
		const inputTemplate = {id: '', year: 2014};
		results = _.memoize((val) => {
			console.log("Caching input...");
			const autoMakerId = parseInt(val.id);
			const models = options[autoMakerId].models;
			const status = _.some(models, (model) =>
				model.years.find((year) => year.year < val.year) ? true : false);
			return !status ? false : true;
		});

		$('nav #makers .dropdown-menu').on('click', (e) => {
			const autoMakerId = e.target.dataset.id;
			const autoMaker = options[autoMakerId];
			const input = Object.assign(inputTemplate, {id: autoMakerId});
			const status = results(input);
			const state = status ? 'was' : 'not';
			const html = '<div class="well well-lg lead">'
				+`	${autoMaker.name} <b>${state}</b> made before ${inputTemplate.year}`
				+'</div>';

			$('#content').html(html);
		});
	});
})();


/* _.get vs. manual way of accessing nested object (_.set vs. _.setIn (Immutable.js))
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

/* _.pick vs. _.omit (similar to _.every vs. _.some
 * SCENARIO:
 *
 * TODOs:
 * */


/* _.filter vs. _.reduce
 * SCENARIO:
 *
 * TODOs:
 * */

// _.merge vs. Object.assign
// _.reduce vs. {object}.reduce vs. _.each vs. [array].forEach vs. _.map
// _.pluck vs. _.filter

// _.remove vs. for/while-loop
// _.first + _.last vs. [array][0]
// _.every || _.some vs. _.find
// _.groupBy vs. YOUR way of doing it
// _.includes vs. STRING.includes || [array].includes

