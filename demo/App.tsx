import React, { FC } from 'react';
import './App.css'
import { useState, createConnection, useEvent } from '../src';

import { countState, increment, reset } from './counter.model';

const { connection, useConnection } = createConnection<number>();

connection.state.subscribe(v => console.log('state updated', v));

connection.mounted.subscribe(v => console.log('mounted', v))

connection.unmounted.subscribe(v => console.log('unmounted', v))


const Title: FC = () => {
	const count = useState(countState);

	return <h1>svitore-react {count}</h1>
}

const CountButton: FC = () => {
	const count = useState(countState);
	const incrementCount = useEvent(increment);
	useConnection(count)

	return (
		<button onClick={incrementCount}>
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
	const count = useState(countState);

	return (
		<div className="App">
			<Title />
			<div className="card">
				{count < 5 && <CountButton />}
			</div>
			<div className="card">
				<ResetButton />
			</div>
		</div>
	)
}

export default App
