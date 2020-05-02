import React from 'react';
import { Container, Item, Icon, Segment, Header, Divider, Button, List, Grid, Table } from 'semantic-ui-react';

/**
 * Default class for react Application
 * @class App
 */
export default class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			services: [],
			activePane: null,
			realtime: false
		};
	}

	componentDidMount() {
		this.getServices();

		this.intervalID = setInterval(() => this.getServiceState(), 1000);
	}

	componentWillUnmount() {
		clearInterval(this.intervalID);
	}

	getServiceState() {
		const { services, realtime } = this.state;

		services.forEach((service, i) => {
			if (service.title !== 'httpbin') {
				fetch(`http://${window.location.host}/${service.title}/api/status`)
					.then((res) => res.json())
					.then((json) => {
						service.online = json.success;
					})
					.catch(() => {
						service.online = false;
					});
			}
		});

		this.setState(services);
	}

	getServices() {
		fetch(`http://localhost:8080/status/api/list/services`).then((res) => res.json()).then((json) => {
			if (json.success) {
				this.setState({ services: json.data });
			}
		});
	}

	handleChange(e) {
		this.setState({ activePane: e });
	}

	/**
	 * Renders the current react component.
	 * @method render
	 */
	render() {
		const { services, activePane } = this.state;

		/**
		 * @todo Add uptime function
		 * @body Each entry should show the services updtime
		 */

		/**
		 * @todo Reimplement Button styles and functionality
		 * @body the semantic-ui Button element does not work currently right now
		 */
		return (
			<div id="content">
				<Container>
					<Segment>
						<Header as="h1">Service Status</Header>
						<Divider />
						<Item.Group divided unstackable>
							{services.map((service, i) => {
								return (
									<Item key={i}>
										{service.online === undefined && (
											<Icon color="grey" loading name="sync alternate" size="large" />
										)}
										{service.online === true && (
											<Icon color="green" name="check circle" size="large" />
										)}
										{service.online === false && (
											<Icon color="red" name="times circle" size="large" />
										)}
										<Item.Content verticalAlign="middle">
											<Item.Header
												as="a"
												href={`http://${window.location.host}/${service.title}/api/status`}
											>
												{service.title}
											</Item.Header>

											<div class="ui right floated buttons">
												<button class="ui button" onClick={this.handleChange.bind(this, i)}>
													{activePane === i ? '▼' : '▲'}
												</button>
												{service.online === false || service.online === undefined ? (
													<button
														class="ui negative button"
														onClick={() => {
															window.location.href = `mailto:shipyardsuite@gmail.com?Subject=Notice: Service "${service.title}" offline!&body=Hey, i just wanted to inform you that the service "${service.title}" is currently offline!`;
														}}
													>
														Report outage
													</button>
												) : (
													''
												)}
											</div>

											<Item.Description>
												{activePane === i && (
													<Table collapsing basic="very">
														<Table.Body>
															<Table.Row>
																<Table.Cell>
																	<Icon name="home" /> Path:
																</Table.Cell>
																<Table.Cell>
																	<a
																		href={`${window.location
																			.host}/${service.title}/`}
																	>
																		{window.location.host}/{service.title}/
																	</a>
																</Table.Cell>
															</Table.Row>
															<Table.Row>
																<Table.Cell>
																	<Icon name="disk" /> Origin:
																</Table.Cell>
																<Table.Cell>
																	<a href={service.url}>{service.url}</a>
																</Table.Cell>
															</Table.Row>
															<Table.Row>
																<Table.Cell>
																	<Icon name="time" /> Uptime:
																</Table.Cell>
																<Table.Cell />
															</Table.Row>
														</Table.Body>
													</Table>
												)}
											</Item.Description>
										</Item.Content>
									</Item>
								);
							})}
						</Item.Group>
					</Segment>
				</Container>
			</div>
		);
	}
}
