import './App.css'
import { useState } from '../src';

import { countState, increment, reset } from './counter.model';

function App(): JSX.Element {
	const count = useState(countState);

	return (
		<div className="App">
			<h1>svitore-react</h1>
			<div className="card">
				<button onClick={() => increment.dispatch()}>
					count is {count}
				</button>
			</div>
			<div className="card">
				<button onClick={() => reset.dispatch()}>
					reset
				</button>
			</div>
		</div>
	)
}

export default App
