import React from 'react';
import { Container, Item, Icon, Segment, Header, Divider, Button, List, Grid, Table } from 'semantic-ui-react';

export default class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			services: [],
			activePane: null
		};
	}

	componentDidMount() {
		this.getServices();

		this.intervalID = setInterval(() => this.getServiceState(), 1000);
	}

	componentWillUnmount() {
		clearInterval(this.intervalID);
	}

	getServices() {
		fetch(`http://localhost:8080/status/services/`).then((res) => res.json()).then((json) => {
			if (json.success) {
				this.setState({ services: json.data });
			}
		});
	}

	getServiceState() {
		const { services } = this.state;

		services.forEach((service, i) => {
			fetch(`http://localhost:8080/${service.title}/api/status`)
				.then((res) => res.json())
				.then((json) => {
					service.online = true;
				})
				.catch(() => {
					service.online = false;
				});
		});

		this.setState(services);
	}

	handleChange(e) {
		this.setState({ activePane: e });
	}

	render() {
		const { services, activePane } = this.state;

		console.log(services);

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
											<Icon color="grey" loading name="sync alternate" size="huge" />
										)}
										{service.online === true && <Icon color="green" name="check" size="huge" />}
										{service.online === false && <Icon color="red" name="cancel" size="huge" />}
										<Item.Content verticalAlign="middle">
											<Item.Header
												as="a"
												href={`http://localhost:8080/${service.title}/api/status`}
											>
												{service.title}
											</Item.Header>
											<Button.Group floated="right">
												{service.online === undefined ? (
													''
												) : (
													service.online === false && (
														<Button
															negative
															onClick={() => {
																window.location.href = `mailto:shipyardsuite@gmail.com?Subject=Notice: Service "${service.title}" offline!&body=Hey, i just wanted to inform you that the service "${service.title}" is currently offline!`;
															}}
														>
															Report outage
														</Button>
													)
												)}
												<Button floated="right" onClick={this.handleChange.bind(this, i)}>
													{activePane === i ? '▼' : '▲'}
												</Button>
											</Button.Group>
											<Item.Description>
												{activePane === i && (
													<Table collapsing basic="very">
														<Table.Body>
															<Table.Row>
																<Table.Cell>
																	<Icon name="home" /> Path:
																</Table.Cell>
																<Table.Cell />
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

/** 
 * <p>
													<Icon name="home" /> Path:
												</p>
												<p>
													<Icon name="disk" /> Origin: <a href={service.url}>{service.url}</a>
												</p>
												<p>
													<Icon name="time" /> Uptime:
												</p>
 * 
*/
