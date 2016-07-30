var funcs={},Listeners=function(){var e={events:{},nodes:{}},t={findInArray:function(e,t){var n=!1;return e.forEach(function(e){n=n||t(e)}),n},addListener:function(e,t,n){var r=this;e.addEventListener(n,function(e){r.applyAllEvents(t,n,function(t){t[0].call(this,e)}.bind(this))})},addPrevListeners:function(t){if(e.events[t]){var n=this,r=Object.keys(e.events[t]);r.forEach(function(e){n.updateClassEvents(t,e)})}},purgeDeadNodes:function(t){e.nodes[t]&&(e.nodes[t]=e.nodes[t].filter(function(e){return document.body.contains(e[0])}))},addIndividualEvent:function(t,n,r,o){e.events[t][n]||(e.events[t][n]=[]);var i=function(e){return e[1]==r};this.findInArray(e.events[t][n],i)?console.warn("A function with the name `"+r+"` already exists."):e.events[t][n].push([o,r])},removeEvent:function(t,n,r){e.events[t]&&e.events[t][n]&&(e.events[t][n]=e.events[t][n].filter(function(e){return e[1]!==r}))},updateClassEvents:function(t,n){if(e.nodes[t]){this.purgeDeadNodes(t);for(var r,o=e.nodes[t].length-1;o>=0&&(r=e.nodes[t][o],!r[1][n]);o--)this.addListener(r[0],t,n),r[1][n]=!0}},applyAllEvents:function(t,n,r){e.events[t][n].forEach(function(e){r(e)})},objectLoop:function(e,t){for(var n in e)e.hasOwnProperty(n)&&t(e[n],n)}};return{add:function(n,r){e.events[n]||(e.events[n]={}),t.objectLoop(r,function(e,r){t.objectLoop(e,function(e,o){t.addIndividualEvent(n,r,o,e),t.updateClassEvents(n,r)})})},remove:function(e,n,r){t.removeEvent(e,n,r)},_addNode:function(n,r){e.nodes[n]||(e.nodes[n]=[]),e.nodes[n].push([r,{}]),t.addPrevListeners(n)},_removeNode:function(t,n){e.nodes[t]&&(e.nodes[t]=e.nodes[t].filter(function(e){return!n.isSameNode(e[0])}))},_test:function(){return e}}};funcs.listeners=Listeners,funcs.ajax=function(e,t,n){var r=new XMLHttpRequest;r.onreadystatechange=function(){r.readyState==XMLHttpRequest.DONE&&(200==r.status?t.success(r.responseText):400==r.status?t.error(r.responseText,{error:400}):t.error(r.responseText,{error:"unknown"}))},n===!1&&(e+="?t="+(new Date).getTime()),r.open("GET",e,!0),r.send()};var Storage={namespace:function(e){return{set:function(t,n,r){var o=(this.get(t),{value:n,lastUpdated:r});localStorage.setItem(e+"_"+t,JSON.stringify(o))},get:function(t){var n=localStorage.getItem(e+"_"+t);return n?JSON.parse(n):null},lastUpdated:function(e){var t=this.get(e);return!!t&&t.lastUpdated}}}};funcs.storage=Storage,funcs.config=function(e,t){for(var n in e)e.hasOwnProperty(n)&&"undefined"!=typeof t.config[n]?t.config[n]=e[n]:console.warn("Warning. Cannot set new property '"+n+"' to config.");return this.proto},funcs.controller={scope:function(e,t){var n=t.routes[t.view.current],r=n.state;setTimeout(function(){e(r,r.data,{container:t.container,loaded:!!n.hasLoaded,loads:n.loads})})}},funcs.DOM={append:function(e,t){t.appendChild(e)},prepend:function(e,t){t.insertBefore(e,t.firstChild)},after:function(e,t){t.parentNode.insertBefore(e,t.nextSibling)},before:function(e,t){t.parentNode.insertBefore(e,t)},remove:function(e){e.parentNode.removeChild(e)},fillWithObjectProperties:function(e,t){var n,r,o=(e.querySelectorAll("[b-prop]"),{"b-prop":"innerHTML","b-src":"src","b-href":"href"});for(var i in o)o.hasOwnProperty(i)&&(n=node.getAttribute(i),"undefined"!=typeof n&&null!==n&&(r=funcs.util.dotToObject(t,path),node.removeAttribute(i),node[o[i]]=r));return e},parentAndChildren:function(e){var t=[e];if(e.querySelectorAll)for(var n=e.querySelectorAll("*"),r=0;r<n.length;r++)t.push(n[r]);return t},allParents:function(e){for(var t=[];e.parentNode;)t.unshift(e.parentNode),e=e.parentNode;return t},hasRepeatParent:function(e){for(;e.parentNode&&e.parentNode.hasAttribute;){if(e.parentNode.hasAttribute("b-repeat"))return!0;e=e.parentNode}return!1}},funcs.hash={"public":{get:function(e){var t=window.location.hash.substr(2),n=t.match(/^[\w_-]+/),r=t.replace(/^[\w_-]+\?{0,}/,""),o={};return r.length>0&&(r=r.split(/&/g).map(function(e){return e.split(/=/g)}),o={},r.forEach(function(e){o[e[0]]=e[1]})),!!n&&("undefined"!=typeof e&&null!==e?o[e]:{view:n[0],get:o})},set:{view:function(e){var t=funcs.hash["public"].get(),n=funcs.hash["private"].concatGet(t.get);t?window.location.hash="/"+e+(n?"?"+n:""):window.location.hash="/"+e},get:function(e){var t=funcs.hash["public"].get(),n=funcs.hash["private"].concatGet(e);if(!t)throw"Error. No view currently set.";window.location.hash="/"+t.view+(n?"?"+n:"")}}},"private":{concatGet:function(e){var t=[];for(var n in e)e.hasOwnProperty(n)&&t.push([n,e[n]]);return t.map(function(e){return e.join("=")}).join("&")}}},funcs.init=function(e,t){window.onhashchange=function(){var t=this.hash["public"].get();this.view["new"](t.view,e)}.bind(this),e.container="string"==typeof t?document.querySelectorAll(t)[0]:t,this.mutation.addEvents(e)},funcs.load={html:function(e,t,n){funcs.ajax(e,{success:function(e){t(e)},error:function(e,n){throw t(e),n}},n)},script:function(e,t,n){e.script&&document.body.removeChild(e.script),e.script=document.createElement("script"),e.script.onload=function(){n()},e.script.src=t,document.body.appendChild(e.script)},page:function(e,t,n){var r={html:!1,script:!1},o=function(){this.script(e,t.url.script,function(){r.script=!0,n()})}.bind(this);if(t.content.html&&e.config.cache){for(r.html=!0;e.container.firstChild;)e.container.removeChild(e.container.firstChild);e.container.innerHTML=t.content.html,o()}else this.html(t.url.html,function(n){for(r.html=!0,t.content.html=n;e.container.firstChild;)e.container.removeChild(e.container.firstChild);e.container.innerHTML=t.content.html,o()},e.config.cache)}},funcs.mutation={observe:function(e,t){var n=new MutationObserver(function(e){e.forEach(function(e){"childList"==e.type&&t(e)})}),r={attributes:!0,childList:!0,characterData:!0,subtree:!0};return n.observe(e.container,r),n},addEventsToNode:function(e,t){var n=["click","input","mousemove"],r=function(){},o=t.getAttribute("b-events"),i=t.getAttribute("b-name");i&&(funcs.scope.create.key(e,i),document.body.contains(t)&&e[i].self.indexOf(t)==-1&&e[i].self.push(t),o&&o.split(/,/).forEach(function(n){e[i][n]=e[i][n]||r,t.addEventListener(n,function(t){e[i][n].call(this,t)})})),n.forEach(function(n){var r=t.getAttribute("b-"+n);r&&t.addEventListener(n,function(t){"function"==typeof e[r]&&e[r].call(this,t)})})},addRepeatToNode:function(e,t){var n=t.getAttribute("b-repeat");funcs.util.immutable(e.data.repeat,n,funcs.repeater(n,t))},removeNode:function(e,t){if(1===t.nodeType&&t.hasAttribute("b-name")){var n=t.getAttribute("b-name"),r=e.current[n]||e.old[n];funcs.util.mutable(r,"self"),r.self=r.self.filter(function(e){return!t.isSameNode(e)}),e.current.event._removeNode(n,t),funcs.util.immutable(r,"self")}},addEvents:function(e){var t=this,n=function(e,n){var r=funcs.DOM.parentAndChildren(n);r.forEach(function(n,r){1===n.nodeType&&(t.addEventsToNode(e.current,n),n.hasAttribute("b-name")&&e.current.event._addNode(n.getAttribute("b-name"),n),n.hasAttribute("b-repeat")&&t.addRepeatToNode(e.current,n),n.hasAttribute("b-repeat-in"))})};e.observe=this.observe(e,function(r){var o,i=r.addedNodes,a=r.removedNodes,s={current:e.routes[e.view.current].state,old:e.view.old?e.routes[e.view.old].state:null};for(o=0;o<a.length;o++)t.removeNode(s,a[o]);for(o=0;o<i.length;o++)n(s,i[o])})}};var Repeater=function(e,t,n){var r={original:null,marker:null,data:[],elems:[],viewModifier:{}},o={normalizeArgs:function(e,t,n,r){var o={index:e,data:t,viewModifier:n,callback:r};return"function"==typeof n&&(o.callback=n,delete o.viewModifier),o},sanitizeData:function(e){return delete e.__meta,e},clone:function(e){var t;if(null===e||"object"!=typeof e)return e;if(e instanceof Date)return t=new Date,t.setTime(e.getTime()),t;if(e instanceof Array){t=[];for(var n=0,r=e.length;n<r;n++)t[n]=this.clone(e[n]);return t}if(e instanceof Object){t={};for(var o in e)e.hasOwnProperty(o)&&(t[o]=this.clone(e[o]));return t}throw new Error("Unable to copy obj! Its type isn't supported.")},objectLoop:function(e,t){for(var n in e)e.hasOwnProperty(n)&&t(e[n],n)},generateID:function(){return(1e16*Math.random()).toString(32)},generateFromArray:function(e){for(var t=0;t<e.length;t++){var n=this.createNodeFromTemplate(e[t]);n.index=t,r.marker.parentNode.insertBefore(n,r.marker),r.elems.push(n),r.data.push(e[t])}r.marker.parentNode.removeChild(r.marker)},init:function(e,t,n,o){window._Repeater||(window._Repeater={}),e&&(window._Repeater[e]=o);this.generateID();r.marker=this.createMarker(this.generateID()),r.original=this.node.store(t),t.parentNode.insertBefore(r.marker,t),t.parentNode.removeChild(t),n&&this.generateFromArray(n,o)},createMarker:function(e){var t=document.createElement("div");return t.className="_marker",t.style.visibility="hidden",t.style.display="none",t.hidden=!0,t.dataset.id=e,t},node:{store:function(e){var t=e.cloneNode(!0);return t.hasAttribute("b-repeat-in")&&(t.removeAttribute("b-repeat-in"),t.setAttribute("b-repeated-in",!0)),t},set:function(e,t,n){var r,i,a,s={"b-prop":"innerHTML","b-src":"src","b-href":"href","b-style":null};o.objectLoop(s,function(s,c){if(r=e.getAttribute(c),"undefined"!=typeof r&&null!==r)switch(c){case"b-style":i=o.parse.dotToObj(t,r),i&&"object"==typeof i&&o.objectLoop(i,function(t,n){e.style[n]=t});break;case"b-prop":i=o.parse.dotToObj(t,r),a=o.parse.dotToObj(n||{},r),e[s]=a?a(i):i;break;default:i=o.parse.dotToObj(t,r),a=o.parse.dotToObj(n||{},r),e.setAttribute(s,a?a(i):i)}})},isInsideBRepeatIn:function(e,t){for(;e.parentNode;){if(e=e.parentNode,e.isSameNode(t))return!1;if(e.hasAttribute("b-repeat-in")||e.hasAttribute("b-repeated-in"))return!0}return!1}},createNodeFromTemplate:function(e,t){var n=r.original.cloneNode(!0),i=n.querySelectorAll("*");t&&(r.viewModifier=t);for(var a,s,c=0;c<i.length;c++){if(i[c].hasAttribute("b-repeat-in")&&(a=i[c].getAttribute("b-repeat-in"),s=o.parse.dotToObj(e,a),!this.node.isInsideBRepeatIn(i[c],n))){n.repeat||(n.repeat={});var u=i[c].getAttribute("b-name");u?n.repeat[u]=Repeater(null,i[c],s):n.repeat[a]=Repeater(null,i[c],s)}this.node.isInsideBRepeatIn(i[c],n)||this.node.set(i[c],e,t)}return n.removeAttribute("b-repeat"),n},createNodeFromNode:function(e,t){for(var n=t.cloneNode(!0),o=n.querySelectorAll("*"),i=0;i<o.length;i++)this.node.isInsideBRepeatIn(o[i],n)||this.node.set(o[i],e,r.viewModifier);return n.removeAttribute("b-repeat"),n},parse:{dotToObj:function(e,t){if("string"==typeof t){t=t.split(/\./);for(var n=0;n<t.length;n++){if("undefined"==typeof e[t[n]]||null===e[t[n]])return;e=e[t[n]]}return e}throw"Error. Path must be a string."}},DOM:{_inner:{after:function(e,t){t?t.nextSibling?this.before(e,t.nextSibling):t.parentNode&&t.parentNode.appendChild(e):this.after(e,r.marker)},before:function(e,t){t.parentNode.insertBefore(e,t)},prepend:function(e){this.after(e,r.marker)},append:function(e){this.after(e,r.elems[r.elems.length-1])},at:function(e,t){r.elems[t]?this.before(e,r.elems[t]):this.append(e)},remove:function(e){e.parentNode.removeChild(e)},removeAt:function(e){r.elems[e]&&this.remove(r.elems[e])}},push:function(e){this._inner.append(e)},unshift:function(e){this._inner.prepend(e)},at:function(e,t){this._inner.at(e,t)},pop:function(){this._inner.removeAt(r.elems.length-1)},shift:function(){this._inner.removeAt(0)},removeAt:function(e){this._inner.removeAt(e)},replace:function(e,t){e.parentNode.replaceChild(t,e)}},bindID:function(e,t){var n=this.generateID();t.__meta={id:n},e.dataset.b_id=n}},i={push:function(e,t){if(Array.isArray(e))e.forEach(function(e,n){this.push(e,t)}.bind(this));else{var n=o.createNodeFromTemplate(e,r.viewModifier);o.bindID(n,e),o.DOM.push(n),r.data.push(e),r.elems.push(n),t&&t(n)}},unshift:function(e,t){if(Array.isArray(e))e.forEach(function(e,n){this.unshift(e,t)});else{var n=o.createNodeFromTemplate(e,r.viewModifier);o.bindID(n,e),o.DOM.unshift(n),r.data.unshift(e),r.elems.unshift(n),t&&t(n)}},at:function(e,t,n){var i=o.createNodeFromTemplate(t,r.viewModifier);o.bindID(i,t),o.DOM.at(i,e),r.data.splice(e,0,t),r.elems.splice(e,0,i),n&&n(i)},pop:function(){o.DOM.pop(),r.data.pop(),r.elems.pop()},shift:function(){o.DOM.shift(),r.data.shift(),r.elems.shift()},remove:function(e){var t;if("object"==typeof e&&(t=e.dataset.b_id,r.data.forEach(function(n,r){n.__meta.id==t&&(e=r)}),"object"==typeof e))throw e=-1,"Error. This node couldn't be found in the repeat sequence.";o.DOM.removeAt(e),r.data.splice(e,1),r.elems.splice(e,1)},filter:function(e){r.data=r.data.map(function(t){return!!e(t)&&t}),r.elems=r.elems.filter(function(e,t){return r.data[t]!==!1||(o.DOM._inner.remove(e),!1)}),r.data=r.data.filter(function(e){return e})},get:function(){var e=o.sanitizeData(r.data);return e.forEach(function(e){delete e.__meta}),e},modify:function(e,t,n){var i,a=o.normalizeArgs(e,null,t,n);if("object"==typeof a.index){if(i=a.index.dataset.b_id,r.data.forEach(function(t,n){t.__meta.id==i&&(e=n)}),"object"==typeof e)throw e=-1,"Error. This node couldn't be found in the repeat sequence."}else e=a.index;var s=r.data[e].__meta;a.callback.call(null,o.sanitizeData(r.data[e])),r.data[e].__meta=s;var c=o.createNodeFromNode(r.data[e],r.elems[e],a.viewModifier||r.viewModifier);c.repeat=r.elems[e].repeat,o.DOM.replace(r.elems[e],c),r.elems[e]=c},modifyEach:function(e,t){for(var n,i=o.normalizeArgs(null,null,e,t),a=0;a<r.elems.length;a++)n=r.data[a].__meta,this.modify(a,i.viewModifier,i.callback.bind(null,r.data[a],a)),r.data[a].__meta=n},modifyView:function(e){r.viewModifier=e,this.modifyEach(function(){})}};return o.init(e,t,n,i),i};funcs.repeater=Repeater,button.addEventListener("focus",function(){window.setTimeout(function(){},0)}),funcs.routes={add:function(e,t,n,r){if(r.routes[e])throw"Error. Route with the name '"+e+"' already exists.";r.routes[e]={name:e,url:{html:t,script:n},content:{html:null},state:{},hasLoaded:!1,loads:0};var o=r.routes[e].state;funcs.scope.create.scope(r,o,r.routes)},deploy:function(e,t,n){var r=e.routes[t];if(r.hasLoaded===!1?r.hasLoaded=0:0===r.hasLoaded&&(r.hasLoaded=!0),r.loads++,!r)throw"Error. Route with the name '"+t+"' does not exist.";return funcs.hash["public"].set.view(t),funcs.scope.removeAllNodeRefs(e.routes[t].state),funcs.load.page(e,r,function(e){console.log("loaded route '"+t+"'!"),n&&n()}),this}},funcs.scope={create:{key:function(e,t){var n=funcs.util.immutable;e[t]||(e[t]={},n(e[t],"data",{}),n(e[t],"self",[]),n(e[t],"each",function(n){var r=e[t].self||[];r.forEach(function(r,o){n(r,o,e[t].self)})}))},scope:function(e,t,n){var r=funcs.util.immutable;funcs.scope.repeat(t),r(t,"data",{}),r(t,"_",{CLEAR_INPUT:!0}),r(t.data,"save",funcs.scope.save.bind(this,t,e)),r(t.data,"retrieve",funcs.scope.retrieve.bind(this,t,e)),r(t.data,"apply",function(n){return funcs.scope.apply(t,e,n)}),r(t.data,"remove",funcs.scope.remove.bind(this,t,e)),r(t.data,"lastUpdated",function(){return funcs.scope.lastUpdated(t,e)}),r(t,"get",function(e){return t[e]?t[e]:(funcs.scope.create.key(t,e),console.warn("Error. This property with name '"+e+"' doesn't exist yet."),t[e])}),r(t,"event",funcs.listeners()),r(t.data,"prop",function(e,n,r){return t[e]||(funcs.scope.create.key(t,e),console.warn("The property with name '"+e+"' doesn't exist yet, but was just created.")),t[e].data[n]=r,t[e].data[n]}),r(t.data,"transfer",function(n,r){var o=t.data[r];if("undefined"==typeof o||null===o)throw"Error. Data associated with key '"+r+"' does not exist.";if(!e.routes[n])throw"Error. View with the name '"+name+"' does not exist.";e.routes[n].state.data[r]=o}),r(t.data,"repeat",{}),funcs.scope.toolkit(t)}},removeAllNodeRefs:function(e){for(var t in e)e[t].self&&funcs.util.tempUnlock(e[t],"self",function(e){e.self=[]});return e}},funcs.scope.save=function(e,t,n){var r=new Storage.namespace(t.view.current);r.set("data",e.data,(new Date).getTime())},funcs.scope.retrieve=function(e,t){var n=new Storage.namespace(t.view.current),r=n.get("data");return r},funcs.scope.lastUpdated=function(e,t){var n=new Storage.namespace(t.view.current);return n.lastUpdated("data")},funcs.scope.remove=function(e,t){var n=new Storage.namespace(t.view.current);n.set("data",{},(new Date).getTime())},funcs.scope.apply=function(e,t){var n=new Storage.namespace(t.view.current),r=n.get("data");if("object"==typeof r&&r){r=r.value;for(var o in r)e.data[o]=r[o];return Object.keys(r).length>0}return!1},funcs.scope.repeat=function(e){var t=funcs.util.immutable;t(e,"repeat",function(t){return e.data.repeat[t]?e.data.repeat[t]:void console.warn("Error. Repeat associated with key '"+t+"' does not exist yet.")})},funcs.scope.toolkit=function(e){var t={setVals:function(e,t,n){if("object"==typeof n)for(var r in n)e.get(r).self.forEach(function(e){e[t]=n[r]})},getVals:function(e,t){return e[0][prop]}},n=funcs.util.immutable;n(e,"edit",{text:function(n){return t.setVals(e,"innerText",n),this},html:function(n){return t.setVals(e,"innerHTML",n),this}}),n(e,"input",{val:function(t,n){if(Array.isArray(t)){var r,o={};return t.forEach(function(t){r=e.get(t).self,r&&r.length>0&&(r.length>1?o[t]=r.map(function(e){return e.value}):o[t]=r[0].value)}),n&&this.clear(t),o}console.warn("Error. `$scope.input.val` must be passed an array parameter of valid b-name nodes.")},clear:function(t){if(Array.isArray(t)){var n;t.forEach(function(t){n=e.get(t).self,n&&n.forEach(function(e){e.value=""})})}else console.warn("Error. `$scope.input.clear` must be passed an array parameter of valid b-name nodes.")}})},funcs.transition={clonePage:function(e){e.copy&&(e.copy.parentNode.removeChild(e.copy),e.copy=null),e.copy=e.container.cloneNode(!0),e.copy.className=e.view.old+"-namespace",e.copy.id="clone_node"},hideContainer:function(e){e.container.style.display="none"},appendCopy:function(e){var t=e.container.parentNode;t.insertBefore(e.copy,e.container.nextSibling),e.container.scrollTop=0},callback:{set:function(e,t){t.transition=e},after:function(e){e.copy&&(e.copy.parentNode.removeChild(e.copy),e.copy=null),"none"==e.container.style.display&&(e.container.style.display="block"),e.animation.inProgress=!1}},before:function(e,t){this.clonePage(e),this.appendCopy(e),console.log("Copy appended at "+(new Date).getTime()),setTimeout(function(){this.hideContainer(e),console.log("Container hidden at "+(new Date).getTime()),t()}.bind(this),50)}},funcs.util={immutable:function(e,t,n){var r={writable:!1,configurable:!0};return n&&(r.value=n),Object.defineProperty(e,t,r),this},mutable:function(e,t){Object.defineProperty(e,t,{writable:!0})},tempUnlock:function(e,t,n){this.mutable(e,t),n(e),this.immutable(e,t)},dotToObject:function(e,t){return t=t.split(/\./),t.forEach(function(t){e[t]&&(e=e[t])}),"object"!=typeof e||Array.isArray(e)?e:""},findNearestParentRepeat:function(e){for(var t;e.parentNode;)e.parentNode.repeat&&(t=e.parentNode),e=e.parentNode;return t},isSample:function(e){for(;e.parentNode;){if(e.parentNode.hasAttribute("b-repeat"))return!0;e=e.parentNode}return!1}},funcs.view={"new":function(e,t){var n={replaceNamespace:function(e,t){return e.className=e.className.split(/\s+/g).filter(function(e){return!/-namespace/g.test(e)&&e}).concat(t+"-namespace").join(" "),e}};if(e!==t.view.current&&null!==t.view.current&&t.routes[e]){t.routes[t.view.current].state;t.view.old=t.view.current,t.view.current=e,t.animation.inProgress=!0,funcs.hash["public"].set.view(e),funcs.transition.before(t,function(){n.replaceNamespace(t.container,e),funcs.routes.deploy(t,e,function(){t.transition?(console.log("Transition started at "+(new Date).getTime()),t.transition.call(null,funcs.transition.callback.after.bind(null,t),{old:t.copy,"new":t.container},{"new":t.view.current,old:t.view.old})):funcs.transition.callback.after(t)})})}else e!==t.view.current&&t.routes[e]?(t.view.old=t.view.current,t.view.current=e,t.animation.inProgress=!0,t.container=n.replaceNamespace(t.container,e),funcs.routes.deploy(t,e,function(){funcs.transition.callback.after(t)})):t.routes[e]?e===t.view.current:console.warn("Error. The route '"+e+"' does not exist.")}};var RouteConfig=function(e){"use strict";var t={script:null,routes:{},config:{cache:!0},container:null,copy:null,view:{current:null,old:null},animation:{inProgress:!1},observer:null,_prototype:n};funcs.init(t,e);var n={add:function(e,n,r){return funcs.routes.add(e,n,r,t),this},deploy:function(e){return funcs.view["new"](e,t),this},config:function(e){funcs.config(e,t)},hash:funcs.hash["public"],transition:function(e){funcs.transition.callback.set(e,t)},controller:function(e){funcs.controller.scope(e,t)}};return n};