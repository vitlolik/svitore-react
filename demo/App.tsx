import './App.css'
import { useState } from '../src';

import { $count, increment, reset } from './counter.model';

function App() {
	const count = useState($count);

	return (
		<div className="App">
			<h1>svitore-react</h1>
			<div className="card">
				<button onClick={() => increment.fire()}>
					count is {count}
				</button>
			</div>
			<div className="card">
				<button onClick={() => reset.fire()}>
					reset
				</button>
			</div>
		</div>
	)
}

export default App
