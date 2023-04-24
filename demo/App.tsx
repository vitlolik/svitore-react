import './App.css'
import { connect, useState } from '../src';

import { countState, increment, reset, inputState, changeInput } from './counter.model';
import { useEffect } from 'react';

const Title = ({ count }: { count: number }): JSX.Element => <h1>svitore-react {count}</h1>

const Input = ({ value, change }: { value: string; change: (value: string) => void }): JSX.Element => {
	useEffect(() => {
		console.log('MOUNT Input')
	}, []);
	return (<input key="input" type="text" value={value} onChange={e => { change(e.target.value) }} />);
}

const CountButton = ({ count, increment }: { count: number; input?: string; increment: () => void }): JSX.Element => {

	useEffect(() => {
		console.log('MOUNT CountButton')
	}, []);

	return (
		<button onClick={increment}>
			count is {count}
		</button>
	)
}

const ResetButton = (props: { reset: () => void }): JSX.Element => {

	return (
		<button onClick={props.reset}>
			reset
		</button>
	)
}

const TitleConnected = connect(Title, { count: countState });

const CountButtonConnected = connect(CountButton, { count: countState, increment }, {
	onMount: (props) => {
		// console.log('MOUNT', props)
	},
	onUnMount: (props) => {
		// console.log('UNMOUNT', props)
	},
	onUpdate: (props, prevProps) => {
		// console.log('ONUPDATE', { props, prevProps })
	}
});

const ConnectedResetButton = connect(ResetButton, { reset });

const ConnectedInput = connect(Input, { value: inputState, change: changeInput });

function App(): JSX.Element {
	const inputValue = useState(inputState);

	return (
		<div className="App">
			<TitleConnected />
			<ConnectedInput />
			<div className="card">
				{inputValue === 'hide' ? null : <CountButtonConnected input={inputValue} />}
			</div>
			<div className="card">
				<ConnectedResetButton />
			</div>
		</div>
	)
}

export default App
