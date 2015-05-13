##ReactView

##Install

	npm install -g reactview

###Usage

This is the perfect tool for prototyping React components. 
Instead of setting up webpack to convert ES6 features or setup a server, it's as easy as:

    reactview component.jsx

It'll automagically compile it using webpack and babel, then start a server and open your browser.
Optionally, you can specify the port as the second argument: `reactview component.jsx 8000`

###Example

The example component looks like:

    import React from 'react'

		export default class Woah extends React.Component{
			render(){
				return <div>this is sick</div>
			}
		}

No need to add React.render either! But if you have it in there, it'll be replaced to mount on the body.
###Todos

- ~~remove the need for React.render in your component~~ done!
- add in hot reloading
- whatever you send in a pull request