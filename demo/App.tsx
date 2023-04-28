import './App.css'
import { connect, useState } from '../src';

import { countState, increment, reset, inputState, changeInput } from './counter.model';

const Title = ({ count }: { count: number }): JSX.Element => <h1>svitore-react {count}</h1>

const Input = ({ value, change }: { value: string; change: (value: string) => void }): JSX.Element => {
	return (<input key="input" type="text" value={value} onChange={e => { change(e.target.value) }} />);
}

const CountButton = ({ count, increment }: { count: number; increment: () => void }): JSX.Element => {
	console.log('render CountButton')

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
		console.log('MOUNT CountButtonConnected', props)
	},
	onUnMount: (props) => {
		console.log('UNMOUNT CountButtonConnected', props)
	},
	onUpdate: (props, prevProps) => {
		console.log('ONUPDATE CountButtonConnected', { props, prevProps })
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
				{inputValue === 'hide' ? null : <CountButtonConnected />}
			</div>
			<div className="card">
				<ConnectedResetButton />
			</div>
		</div>
	)
}

export default App
