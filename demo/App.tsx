import { FC } from 'react';
import './App.css'
import { useState } from '../src';

import { countState, increment, reset } from './counter.model';


const Title: FC = () => {
	const count = useState(countState);

	return <h1>svitore-react {count}</h1>
}

const CountButton: FC = () => {
	const count = useState(countState);

	return (
		<button onClick={() => increment.dispatch()}>
			count is {count}
		</button>
	)
}

const ResetButton: FC = () => {
	return (
		<button onClick={() => reset.dispatch()}>
			reset
		</button>
	)
}

function App(): JSX.Element {
	return (
		<div className="App">
			<Title />
			<div className="card">
				<CountButton />
			</div>
			<div className="card">
				<ResetButton />
			</div>
		</div>
	)
}

export default App
