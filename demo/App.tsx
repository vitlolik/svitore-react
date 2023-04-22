import './App.css'
import { connect, useState } from '../src';

import { countState, increment, reset, inputState, changeInput } from './counter.model';

const Title = ({ count }: { count: number }): JSX.Element => <h1>svitore-react {count}</h1>

const CountButton = ({ count, increment, input }: { count: number; input?: string; increment: () => void }): JSX.Element => {
	console.log("render CountButton", input);

	return (
		<button onClick={increment}>
			count is {count}
		</button>
	)
}

const ResetButton = (props: { reset: () => void }): JSX.Element => {
	console.log("render ResetButton");

	return (
		<button onClick={props.reset}>
			reset
		</button>
	)
}

const TitleConnected = connect(Title, { count: countState });

const CountButtonConnected = connect(CountButton, { count: countState, increment }, {
	onMount: (props) => {
		console.log('MOUNT', props)
	},
	onUnMount: (props) => {
		console.log('UNMOUNT', props)
	},
	onUpdate: (props, prevProps) => {
		console.log('ONUPDATE', { props, prevProps })
	}
});

const ConnectedResetButton = connect(ResetButton, { reset });

function App(): JSX.Element {
	const inputValue = useState(inputState);
	console.log("render app");

	return (
		<div className="App">
			<TitleConnected />
			<input type="text" value={inputValue} onChange={e => { changeInput.dispatch(e.target.value) }} />
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
