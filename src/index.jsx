"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_dom_1 = require("react-dom");
require("./index.css");
var App_1 = require("./App");
react_dom_1.default.render(<react_1.default.StrictMode>
        <App_1.default />
    </react_1.default.StrictMode>, document.getElementById("root"));
