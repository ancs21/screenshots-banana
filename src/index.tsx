import { render } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';
import Editor from './pages/Editor/index';
import Settings from './pages/Settings/index';
import './style.css';

export function App() {
	return (
		<LocationProvider>
			<Router>
				<Route path="/" component={Editor} />
				<Route path="/settings" component={Settings} />
			</Router>
		</LocationProvider>
	);
}

render(<App />, document.getElementById('app'));
