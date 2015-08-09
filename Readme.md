##No longer maintained

**Go use [heatpack](https://github.com/insin/react-heatpack), it does the same thing.**

##ReactView

##Install

	npm install -g reactview

###Usage

This is the perfect tool for prototyping React components.
Instead of setting up webpack to convert ES6 features or setup a server, it's as easy as:

		reactview component.jsx

It'll automagically compile it using webpack and babel, then start a server and open your browser.
Optionally, you can specify the port as the second argument: `reactview component.jsx 8000`

It will also read json from stdin and pass them in as component props, eg:

		cat props.json | reactview example.jsx

###Example

The example component looks like:

		import React from 'react'
		import Test from './test.css'

		export default class Woah extends React.Component{
			render(){
				return <div className="test">this is sick</div>
			}
		}

No need to add React.render. CSS importing is also included. 

**How do I set what gets rendered?**

You need to specify `export default` on the component you want rendered. 
In 0.5.2, you can explicitly pass the component / class name you want
rendered: `reactview component.jsx ComponentName`. 
Useful if you're importing components and there are multiple exports.

##Contributing

To modify reactview, take a look at src/reactview.js. After making changes you'll need to do
`npm run build` then `npm install . -g` if you're wanting to access it without doing `node bin/reactview.js`

###Todos

- passing props like `--props {test: 'value'}`
- allow .js files to be compiled (only .jsx is supported now)
- display error if component doesn't have a default export
- whatever you send in a pull request
