import React from 'react';

/**
 * Default class for react Application
 * @class App
 */
export default class App extends React.Component {
	componentDidMount() {
		document.title = 'Page Title';
	}

	/**
	 * Renders the current react component.
	 * @method render
	 */
	render() {
		return <div>STATUS</div>;
	}
}
