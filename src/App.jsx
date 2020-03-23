import React from 'react';
import { Container, Item, Icon, Segment } from 'semantic-ui-react';

export default class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			services: []
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
				this.setState({
					services: json.data
				});
			}
		});
	}

	getServiceState() {
		const { services } = this.state;

		services.forEach((service) => {
			fetch(`http://localhost:8080/${service.title}/api/test`)
				.then((res) => res.json())
				.then((json) => {
					if (json.success) {
						service.online = true;
					}
				})
				.catch(() => {
					service.online = false;
				});
		});

		this.setState({ services });
	}

	render() {
		const { services } = this.state;

		return (
			<div id="content">
				<Container>
					<Segment>
						<Item.Group divided>
							{services.map((service, i) => {
								return (
									<Item key={i}>
										{service.online ? (
											<Icon color="green" name="check" size="huge" />
										) : (
											<Icon color="red" name="cancel" size="huge" />
										)}
										<Item.Content verticalAlign="middle">
											<Item.Header
												as="a"
												href={`http://localhost:8080/${service.title}/api/test`}
											>
												{service.title}
											</Item.Header>
											{service.description && (
												<Item.Description>
													<p>{service.description}</p>
												</Item.Description>
											)}
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
