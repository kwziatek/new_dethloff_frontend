This is vanilla JS frontend project that uses endpoints from the backend project - https://github.com/kwziatek/dethloff_backend.
I use node.js to make the coding easier with following tools:
 - npm
 - vite

There is nothing special in particular in this project - feel free to skip the rest of this file. I'll just store some additional info about it, it might be helpful in terms of development purposes.

Technical data:

Colors:
#636B2F
#BAC095
#D4DE95
#3D4127

Each page has it's own css and js file.
The idea is to have one css template which is then imported to all of the other css files. It contains the default site settings. 
Similarly there is a global js that determins the default behaviour for nodes such as logout or return button.
I also creted a html template to make the process of creating new pages faster and easier - there is a template.html file.