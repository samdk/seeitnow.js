SeeItNow.js lets you adjust CSS property values on the fly and see the changes in real time, with the goal of making web browsers into better design tools. Different types of property values have associated widgets (like a live-updating color picker for adjusting color and background-color properties). If you're running the optional NodeJS server, SeeItNow.js can also save your changes directly to the underlying stylesheet.

* Adjust CSS values in your browser using property specific tools (currently, the only available tool is a live-updating color picker for changing background color)
* If you're running the NodeJS client...
	* values adjusted in your browser can be automatically applied to the correct stylesheets
	* (in the future) values adjusted in one browser are automatically adjusted in any other browsers connected to the same page (letting you see results in multiple browsers instantly)

Current dependencies for the client are jQuery, the jQuery hotkeys plugin, and socket.io. In some future actually-finished-enough-to-be-useful version, these will be included (and closure-wrapped for safety) automatically. For now, they must be included manually.

Once you have everything included and running, you can bring up the selector by pressing _ctrl+m_. Clicking on an element will bring up a color picker that adjusts that element's background color. Pressing _esc_ will deselect the element and hide the color picker.

This version is just a tech demo to get the very basics working, and so is a hideous mess. Use it at your own risk.

