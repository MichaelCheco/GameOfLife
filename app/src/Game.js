import React from 'react'
import './Game.css'

const height = 700
const cell = 20
const width = 600

function Cell({ x, y }) {
	return (
		<div
			className="Cell"
			style={{
				left: `${cell * x + 1}px`,
				top: `${cell * y + 1}px`,
				width: `${cell - 1}px`,
				height: `${cell - 1}px`,
			}}
		/>
	)
}

class Game extends React.Component {
	constructor() {
		super()
		this.rows = height / cell
		this.cols = width / cell

		this.board = this.makeBoard()
	}

	state = {
		cells: [],
		running: false,
		interval: 100,
	}

	makeBoard() {
		let board = []
		for (let y = 0; y < this.rows; y++) {
			board[y] = []
			for (let x = 0; x < this.cols; x++) {
				board[y][x] = false
			}
		}

		return board
	}

	getOffset() {
		const rect = this.boardRef.getBoundingClientRect()
		const doc = document.documentElement

		return {
			x: rect.left + window.pageXOffset - doc.clientLeft,
			y: rect.top + window.pageYOffset - doc.clientTop,
		}
	}

	generateCells() {
		let cells = []
		for (let y = 0; y < this.rows; y++) {
			for (let x = 0; x < this.cols; x++) {
				if (this.board[y][x]) {
					cells.push({ x, y })
				}
			}
		}

		return cells
	}

	handleClick = event => {
		const elemOffset = this.getOffset()
		const offsetX = event.clientX - elemOffset.x
		const offsetY = event.clientY - elemOffset.y

		const x = Math.floor(offsetX / cell)
		const y = Math.floor(offsetY / cell)

		if (x >= 0 && x <= this.cols && y >= 0 && y <= this.rows) {
			this.board[y][x] = !this.board[y][x]
		}

		this.setState({ cells: this.generateCells() })
	}

	startGame = () => {
		this.setState({ running: true })
		this.runIteration()
	}

	endGame = () => {
		this.setState({ running: false })
		if (this.timeoutHandler) {
			window.clearTimeout(this.timeoutHandler)
			this.timeoutHandler = null
		}
	}

	runIteration() {
		let newBoard = this.makeBoard()

		for (let y = 0; y < this.rows; y++) {
			for (let x = 0; x < this.cols; x++) {
				let neighbors = this.calculateNeighbors(this.board, x, y)
				if (this.board[y][x]) {
					if (neighbors === 2 || neighbors === 3) {
						newBoard[y][x] = true
					} else {
						newBoard[y][x] = false
					}
				} else {
					if (!this.board[y][x] && neighbors === 3) {
						newBoard[y][x] = true
					}
				}
			}
		}

		this.board = newBoard
		this.setState({ cells: this.generateCells() })

		this.timeoutHandler = window.setTimeout(() => {
			this.runIteration()
		}, this.state.interval)
	}

	calculateNeighbors(board, x, y) {
		let neighbors = 0
		const dirs = [
			[-1, -1],
			[-1, 0],
			[-1, 1],
			[0, 1],
			[1, 1],
			[1, 0],
			[1, -1],
			[0, -1],
		]
		for (let i = 0; i < dirs.length; i++) {
			const dir = dirs[i]
			let y1 = y + dir[0]
			let x1 = x + dir[1]

			if (
				x1 >= 0 &&
				x1 < this.cols &&
				y1 >= 0 &&
				y1 < this.rows &&
				board[y1][x1]
			) {
				neighbors++
			}
		}

		return neighbors
	}

	handleIntervalChange = e => {
		this.setState({ interval: e.target.value })
	}

	handleClear = () => {
		this.board = this.makeBoard()
		this.setState({ cells: this.generateCells() })
	}

	handleRandom = () => {
		for (let y = 0; y < this.rows; y++) {
			for (let x = 0; x < this.cols; x++) {
				this.board[y][x] = Math.random() >= 0.5
			}
		}

		this.setState({ cells: this.generateCells() })
	}

	render() {
		const { cells, running } = this.state
		return (
			<div className="container">
				<div
					className="Board"
					style={{
						width: width,
						height: height,
						backgroundSize: `${cell}px ${cell}px`,
					}}
					onClick={this.handleClick}
					ref={a => {
						this.boardRef = a
					}}>
					{cells.map(cell => (
						<Cell x={cell.x} y={cell.y} key={`${cell.x},${cell.y}`} />
					))}
				</div>

				<div className="controls">
					miliseconds
					<input
						value={this.state.interval}
						onChange={this.handleIntervalChange}
					/>{' '}
					{running ? (
						<button className="button" onClick={this.endGame}>
							Stop
						</button>
					) : (
						<button className="button" onClick={this.startGame}>
							Run
						</button>
					)}
					<button className="button" onClick={this.handleRandom}>
						Random
					</button>
					<button className="button" onClick={this.handleClear}>
						Clear
					</button>
				</div>
			</div>
		)
	}
}

export default Game
