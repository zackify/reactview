##ReactView

##Install

	npm install -g reactview

###Usage

This is the perfect tool for prototyping React components. 
Instead of setting up webpack to convert ES6 features or setup a server, it's as easy as:

    reactview component.jsx

It'll automagically compile it using webpack and babel, then throw up a server where you can view your component.

###Example

The example component looks like:

    import React from 'react'

		export default class Woah extends React.Component{
			render(){
				return <div>this is sick</div>
			}
		}

		React.render(<Woah/>,document.body)

Currently, you do need to call React.render in your component.

###Todos

I'd like to add a way to inject props into the component from the command line and abstract the React.render away from the component.
Feel free to send a pull request.