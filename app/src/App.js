import React from 'react'
import logo from './logo.svg'
import './App.css'
import Game from './Game'

function App() {
	return (
		<div>
			<Game />
			<Info />
		</div>
	)
}
function Info() {
	return (
		<div style={{ float: 'left' }}>
			<h1>Conway's Game of Life</h1>
			<h3>Rules</h3>
			<ul style={{ listStyle: 'none' }}>
				<li>
					If the cell is alive and has 2 or 3 neighbors, then it remains alive.
					Else it dies.
				</li>
				<li>
					If the cell is dead and has exactly 3 neighbors, then it comes to
					life. Else if remains dead.
				</li>
			</ul>
		</div>
	)
}
export default App
