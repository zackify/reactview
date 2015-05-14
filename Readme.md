##ReactView

###Recent Changes

**0.4.0**

- Added babel compilation so that reactview plays nice with node (you should be using iojs :P)
- added css loader

**0.3.1**
- added babel stage 0 transforms

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
		import Test from './test.css'

		class Woah extends React.Component{
			render(){
				return <div className="test">this is sick</div>
			}
		}

No need to add React.render. CSS importing is also included.

##Contributing

To modify reactview, take a look at src/reactview.js. After making changes you'll need to do 
`npm run build` then `npm install . -g` if you're wanting to access it without doing `node bin/reactview.js`

###Todos

- add in hot reloading
- whatever you send in a pull request