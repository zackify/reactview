import React from 'react'
import Test from './test.css'

export class Testing extends React.Component{
	render(){
		return <div className="test">This won't render, it's not the default export</div>
	}
}

export default class Woah extends React.Component{
	render(){
		return <div className="test">{this.props.message}</div>
	}
}

Woah.defaultProps = {
    message: 'this is sick'
}
