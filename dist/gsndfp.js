/*!
 * gsndfp
 * version 1.1.24
 * Requires jQuery 1.7.1 or higher
 * git@github.com:gsn/gsndfp.git
 * License: Grocery Shopping Network
 *          MIT from derived work of Copyright (c) 2013 Matt Cooper: https://github.com/coop182/jquery.dfp.js  v1.0.18
 */
(function umd(require){if("object"==typeof exports){module.exports=require("1")}else if("function"==typeof define&&define.amd){define(function(){return require("1")})}else{this["trakless"]=require("1")}})(function outer(modules,cache,entries){var global=function(){return this}();function require(name,jumped){if(cache[name])return cache[name].exports;if(modules[name])return call(name,require);throw new Error('cannot find module "'+name+'"')}function call(id,require){var m=cache[id]={exports:{}};var mod=modules[id];var name=mod[2];var fn=mod[0];fn.call(m.exports,function(req){var dep=modules[id][1][req];return require(dep?dep:req)},m,m.exports,outer,modules,cache,entries);if(name)cache[name]=cache[id];return cache[id].exports}for(var id in entries){if(entries[id]){global[entries[id]]=require(id)}else{require(id)}}require.duo=true;require.cache=cache;require.modules=modules;return require}({1:[function(require,module,exports){(function(){(function(window,document){var $defaultTracker,$defaults,$pixel,$sessionid,$siteid,$trakless2,$uuid,Emitter,attrs,cookie,defaults,domevent,fn,getImage,i,j,k,len,len1,myutil,prefix,query,ref,ref1,script,store,tracker,trakless,traklessParent,uuid,webanalyser;defaults=require("defaults");cookie=require("cookie");Emitter=require("emitter");query=require("querystring");store=require("segmentio-store.js");uuid=require("uuid");webanalyser=require("webanalyser");domevent=require("domevent");$defaultTracker=null;$defaults=null;$siteid=0;$pixel="/pixel.gif";$uuid=store.get("uuid");$sessionid=cookie("pa:usid");$trakless2=trakless;if($uuid==null){$uuid=uuid();store.set("uuid",$uuid)}if($sessionid==null){$sessionid=(new Date).getTime();cookie("tls:usid",$sessionid,{path:"/"})}getImage=function(configTrackerUrl,request,callback){var image;image=new Image(1,1);image.onload=function(){var iterator;iterator=0;if(typeof callback==="function"){callback()}};image.src=configTrackerUrl+(configTrackerUrl.indexOf("?")<0?"?":"&")+request;return image};myutil=function(){function myutil(){}myutil.allData=function(el){var camelCaseName,data,i,k,len,name,ref,v;data={};ref=el.attributes;for(v=i=0,len=ref.length;i<len;v=++i){k=ref[v];name=/^data-/.replace(attr.name,"");camelCaseName=name.replace(/-(.)/g,function($0,$1){return $1.toUpperCase()});data[camelCaseName]=attr.value}return data};myutil.$=domevent;myutil.on=function(ename,cb){domevent(document).on(ename,cb);return this};myutil.off=function(ename,cb){domevent(document).off(ename,cb);return this};myutil.trigger=function(ename,edata){if($trakless2&&$trakless2.util){$trakless2.util.$.trigger({type:ename,detail:edata})}return this};myutil.stringToJSON=function(v){var v2;if(typeof v==="string"){v2=domevent.parseJSON(v);if(!(v2==null)){return v2}}return v};myutil.session=function(k,v){if(v!=null){if(!(typeof v==="string")){v=domevent.toJSON(v)}cookie("tls:"+k,v,{path:"/"});return v}return this.stringToJSON(cookie("tls:"+k))};myutil.onClick=function(el,handler,monitor){domevent(el).on("click",handler,monitor);return this};myutil.ready=domevent.ready;myutil.applyDefaults=defaults;myutil.trim=function(v){return v.replace(/^\s+|\s+$/gm,"")};return myutil}();tracker=function(){function tracker(){}tracker.prototype.defaults=webanalyser.getResult();tracker.prototype.pixel="/pixel.gif";tracker.prototype.siteid=0;tracker.prototype._track=function(ht,extra){var data,i,k,len,myData,myDef,pixel,v;if(extra==null){extra={}}if(this.siteid>0){pixel=myutil.trim(this.pixel);myDef=this.defaults;if(pixel.indexOf("//")===0&&myDef.dl.indexOf("http")!==0){pixel="http:"+pixel}data=ht==="pageview"?defaults(extra,myDef):extra;myData={};for(v=i=0,len=data.length;i<len;v=++i){k=data[v];if(v!=null){if(!(typeof v==="string")||myutil.trim(v).length>0){myData[k]=v}}}myData.z=(new Date).getTime();myData.ht=ht;myData.uuid=$uuid;myData.siteid=this.siteid;myData.usid=$sessionid;getImage(pixel,query.stringify(myData));this.emit("track",ht,data)}return this};tracker.prototype.track=function(ht,extra){var self;self=this;domevent.ready(function(){return self._track(ht||"custom",extra)});return this};tracker.prototype.trackPageView=function(extra){return this.track("pageview",extra)};tracker.prototype.trackEvent=function(category,action,label,value){if(value&&value<0){value=null}return this.track("event",{ec:category||"event",ea:action,el:label,ev:value})};tracker.prototype.trackItemOrTransaction=function(id,name,price,quantity,code,category,currencycode){return this.track("item",{ti:id,"in":name,ip:price,iq:quantity,ic:code,iv:category,cu:currencycode})};tracker.prototype.trackTransaction=function(id,affiliation,revenue,shipping,tax,name,price,quantity,code,category,currencycode){return this.track("transaction",{ti:id,ta:affiliation,tr:revenue,ts:shipping,tt:tax,"in":name,ip:price,iq:quantity,ic:code,iv:category,cu:currencycode})};tracker.prototype.trackSocial=function(network,action,target){return this.track("social",{sn:network,sa:action,st:target})};tracker.prototype.trackException=function(description,isFatal){return this.track("exception",{exf:isFatal?1:0,exd:description})};tracker.prototype.trackApp=function(name,id,version,installerid){return this.track("app",{an:name,aid:id,av:version,aiid:installer})};tracker.prototype.trackCustom=function(customDataObject){return this.track("custom",customDataObject)};return tracker}();Emitter(tracker.prototype);trakless=function(){function trakless(){}trakless.setSiteId=function(siteid){$siteid=siteid>0?siteid:$siteid};trakless.setPixel=function(pixelUrl){$pixel=pixelUrl||$pixel};trakless.getTracker=function(siteid,pixelUrl){var rst;rst=new tracker(siteid,pixelUrl);rst.siteid=siteid||$siteid;rst.pixel=pixelUrl||$pixel;return rst};trakless.getDefaultTracker=function(){if($defaultTracker==null){$defaultTracker=trakless.getTracker()}return $defaultTracker};trakless.util=myutil;return trakless}();if(window.top!==window){traklessParent=window.parent.trakless;try{traklessParent=window.top.trakless}catch(_error){}if(traklessParent!==trakless){$trakless2=traklessParent}}attrs={site:function(value){return trakless.setSiteId(value)},pixel:function(value){if(typeof value!=="string"){return}return $pixel=value}};ref=document.getElementsByTagName("script");for(i=0,len=ref.length;i<len;i++){script=ref[i];if(/trakless/i.test(script.src)){ref1=["","data-"];for(j=0,len1=ref1.length;j<len1;j++){prefix=ref1[j];for(k in attrs){fn=attrs[k];fn(script.getAttribute(prefix+k))}}}}window.trakless=trakless;return module.exports=trakless})(window,document)}).call(this)},{defaults:2,cookie:3,emitter:4,querystring:5,"segmentio-store.js":6,uuid:7,webanalyser:8,domevent:9}],2:[function(require,module,exports){"use strict";var defaults=function(dest,src,recursive){for(var prop in src){if(recursive&&dest[prop]instanceof Object&&src[prop]instanceof Object){dest[prop]=defaults(dest[prop],src[prop],true)}else if(!(prop in dest)){dest[prop]=src[prop]}}return dest};module.exports=defaults},{}],3:[function(require,module,exports){var debug=require("debug")("cookie");module.exports=function(name,value,options){switch(arguments.length){case 3:case 2:return set(name,value,options);case 1:return get(name);default:return all()}};function set(name,value,options){options=options||{};var str=encode(name)+"="+encode(value);if(null==value)options.maxage=-1;if(options.maxage){options.expires=new Date(+new Date+options.maxage)}if(options.path)str+="; path="+options.path;if(options.domain)str+="; domain="+options.domain;if(options.expires)str+="; expires="+options.expires.toUTCString();if(options.secure)str+="; secure";document.cookie=str}function all(){return parse(document.cookie)}function get(name){return all()[name]}function parse(str){var obj={};var pairs=str.split(/ *; */);var pair;if(""==pairs[0])return obj;for(var i=0;i<pairs.length;++i){pair=pairs[i].split("=");obj[decode(pair[0])]=decode(pair[1])}return obj}function encode(value){try{return encodeURIComponent(value)}catch(e){debug("error `encode(%o)` - %o",value,e)}}function decode(value){try{return decodeURIComponent(value)}catch(e){debug("error `decode(%o)` - %o",value,e)}}},{debug:10}],10:[function(require,module,exports){exports=module.exports=require("./debug");exports.log=log;exports.formatArgs=formatArgs;exports.save=save;exports.load=load;exports.useColors=useColors;var storage;if(typeof chrome!=="undefined"&&typeof chrome.storage!=="undefined")storage=chrome.storage.local;else storage=localstorage();exports.colors=["lightseagreen","forestgreen","goldenrod","dodgerblue","darkorchid","crimson"];function useColors(){return"WebkitAppearance"in document.documentElement.style||window.console&&(console.firebug||console.exception&&console.table)||navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31}exports.formatters.j=function(v){return JSON.stringify(v)};function formatArgs(){var args=arguments;var useColors=this.useColors;args[0]=(useColors?"%c":"")+this.namespace+(useColors?" %c":" ")+args[0]+(useColors?"%c ":" ")+"+"+exports.humanize(this.diff);if(!useColors)return args;var c="color: "+this.color;args=[args[0],c,"color: inherit"].concat(Array.prototype.slice.call(args,1));var index=0;var lastC=0;args[0].replace(/%[a-z%]/g,function(match){if("%%"===match)return;index++;if("%c"===match){lastC=index}});args.splice(lastC,0,c);return args}function log(){return"object"===typeof console&&console.log&&Function.prototype.apply.call(console.log,console,arguments)}function save(namespaces){try{if(null==namespaces){storage.removeItem("debug")}else{storage.debug=namespaces}}catch(e){}}function load(){var r;try{r=storage.debug}catch(e){}return r}exports.enable(load());function localstorage(){try{return window.localStorage}catch(e){}}},{"./debug":11}],11:[function(require,module,exports){exports=module.exports=debug;exports.coerce=coerce;exports.disable=disable;exports.enable=enable;exports.enabled=enabled;exports.humanize=require("ms");exports.names=[];exports.skips=[];exports.formatters={};var prevColor=0;var prevTime;function selectColor(){return exports.colors[prevColor++%exports.colors.length]}function debug(namespace){function disabled(){}disabled.enabled=false;function enabled(){var self=enabled;var curr=+new Date;var ms=curr-(prevTime||curr);self.diff=ms;self.prev=prevTime;self.curr=curr;prevTime=curr;if(null==self.useColors)self.useColors=exports.useColors();if(null==self.color&&self.useColors)self.color=selectColor();var args=Array.prototype.slice.call(arguments);args[0]=exports.coerce(args[0]);if("string"!==typeof args[0]){args=["%o"].concat(args)}var index=0;args[0]=args[0].replace(/%([a-z%])/g,function(match,format){if(match==="%%")return match;index++;var formatter=exports.formatters[format];if("function"===typeof formatter){var val=args[index];match=formatter.call(self,val);args.splice(index,1);index--}return match});if("function"===typeof exports.formatArgs){args=exports.formatArgs.apply(self,args)}var logFn=enabled.log||exports.log||console.log.bind(console);logFn.apply(self,args)}enabled.enabled=true;var fn=exports.enabled(namespace)?enabled:disabled;fn.namespace=namespace;return fn}function enable(namespaces){exports.save(namespaces);var split=(namespaces||"").split(/[\s,]+/);var len=split.length;for(var i=0;i<len;i++){if(!split[i])continue;namespaces=split[i].replace(/\*/g,".*?");if(namespaces[0]==="-"){exports.skips.push(new RegExp("^"+namespaces.substr(1)+"$"))}else{exports.names.push(new RegExp("^"+namespaces+"$"))}}}function disable(){exports.enable("")}function enabled(name){var i,len;for(i=0,len=exports.skips.length;i<len;i++){if(exports.skips[i].test(name)){return false}}for(i=0,len=exports.names.length;i<len;i++){if(exports.names[i].test(name)){return true}}return false}function coerce(val){if(val instanceof Error)return val.stack||val.message;return val}},{ms:12}],12:[function(require,module,exports){var s=1e3;var m=s*60;var h=m*60;var d=h*24;var y=d*365.25;module.exports=function(val,options){options=options||{};if("string"==typeof val)return parse(val);return options.long?long(val):short(val)};function parse(str){var match=/^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);if(!match)return;var n=parseFloat(match[1]);var type=(match[2]||"ms").toLowerCase();switch(type){case"years":case"year":case"yrs":case"yr":case"y":return n*y;case"days":case"day":case"d":return n*d;case"hours":case"hour":case"hrs":case"hr":case"h":return n*h;case"minutes":case"minute":case"mins":case"min":case"m":return n*m;case"seconds":case"second":case"secs":case"sec":case"s":return n*s;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return n}}function short(ms){if(ms>=d)return Math.round(ms/d)+"d";if(ms>=h)return Math.round(ms/h)+"h";if(ms>=m)return Math.round(ms/m)+"m";if(ms>=s)return Math.round(ms/s)+"s";return ms+"ms"}function long(ms){return plural(ms,d,"day")||plural(ms,h,"hour")||plural(ms,m,"minute")||plural(ms,s,"second")||ms+" ms"}function plural(ms,n,name){if(ms<n)return;if(ms<n*1.5)return Math.floor(ms/n)+" "+name;return Math.ceil(ms/n)+" "+name+"s"}},{}],4:[function(require,module,exports){var index=require("indexof");module.exports=Emitter;function Emitter(obj){if(obj)return mixin(obj)}function mixin(obj){for(var key in Emitter.prototype){obj[key]=Emitter.prototype[key]}return obj}Emitter.prototype.on=Emitter.prototype.addEventListener=function(event,fn){this._callbacks=this._callbacks||{};(this._callbacks[event]=this._callbacks[event]||[]).push(fn);return this};Emitter.prototype.once=function(event,fn){var self=this;this._callbacks=this._callbacks||{};function on(){self.off(event,on);fn.apply(this,arguments)}fn._off=on;this.on(event,on);return this};Emitter.prototype.off=Emitter.prototype.removeListener=Emitter.prototype.removeAllListeners=Emitter.prototype.removeEventListener=function(event,fn){this._callbacks=this._callbacks||{};if(0==arguments.length){this._callbacks={};return this}var callbacks=this._callbacks[event];if(!callbacks)return this;if(1==arguments.length){delete this._callbacks[event];return this}var i=index(callbacks,fn._off||fn);if(~i)callbacks.splice(i,1);return this};Emitter.prototype.emit=function(event){this._callbacks=this._callbacks||{};var args=[].slice.call(arguments,1),callbacks=this._callbacks[event];if(callbacks){callbacks=callbacks.slice(0);for(var i=0,len=callbacks.length;i<len;++i){callbacks[i].apply(this,args)}}return this};Emitter.prototype.listeners=function(event){this._callbacks=this._callbacks||{};return this._callbacks[event]||[]};Emitter.prototype.hasListeners=function(event){return!!this.listeners(event).length}},{indexof:13}],13:[function(require,module,exports){module.exports=function(arr,obj){if(arr.indexOf)return arr.indexOf(obj);for(var i=0;i<arr.length;++i){if(arr[i]===obj)return i}return-1}},{}],5:[function(require,module,exports){var encode=encodeURIComponent;var decode=decodeURIComponent;var trim=require("trim");var type=require("type");exports.parse=function(str){if("string"!=typeof str)return{};str=trim(str);if(""==str)return{};if("?"==str.charAt(0))str=str.slice(1);var obj={};var pairs=str.split("&");for(var i=0;i<pairs.length;i++){var parts=pairs[i].split("=");var key=decode(parts[0]);var m;if(m=/(\w+)\[(\d+)\]/.exec(key)){obj[m[1]]=obj[m[1]]||[];obj[m[1]][m[2]]=decode(parts[1]);continue}obj[parts[0]]=null==parts[1]?"":decode(parts[1])}return obj};exports.stringify=function(obj){if(!obj)return"";var pairs=[];for(var key in obj){var value=obj[key];if("array"==type(value)){for(var i=0;i<value.length;++i){pairs.push(encode(key+"["+i+"]")+"="+encode(value[i]))}continue}pairs.push(encode(key)+"="+encode(obj[key]))}return pairs.join("&")}},{trim:14,type:15}],14:[function(require,module,exports){exports=module.exports=trim;function trim(str){if(str.trim)return str.trim();return str.replace(/^\s*|\s*$/g,"")}exports.left=function(str){if(str.trimLeft)return str.trimLeft();return str.replace(/^\s*/,"")};exports.right=function(str){if(str.trimRight)return str.trimRight();return str.replace(/\s*$/,"")}},{}],15:[function(require,module,exports){var toString=Object.prototype.toString;module.exports=function(val){switch(toString.call(val)){case"[object Date]":return"date";case"[object RegExp]":return"regexp";case"[object Arguments]":return"arguments";case"[object Array]":return"array";case"[object Error]":return"error"}if(val===null)return"null";if(val===undefined)return"undefined";if(val!==val)return"nan";if(val&&val.nodeType===1)return"element";val=val.valueOf?val.valueOf():Object.prototype.valueOf.apply(val);return typeof val}},{}],6:[function(require,module,exports){var json=require("json"),store={},win=window,doc=win.document,localStorageName="localStorage",namespace="__storejs__",storage;store.disabled=false;store.set=function(key,value){};store.get=function(key){};store.remove=function(key){};store.clear=function(){};store.transact=function(key,defaultVal,transactionFn){var val=store.get(key);if(transactionFn==null){transactionFn=defaultVal;defaultVal=null}if(typeof val=="undefined"){val=defaultVal||{}}transactionFn(val);store.set(key,val)};store.getAll=function(){};store.serialize=function(value){return json.stringify(value)};store.deserialize=function(value){if(typeof value!="string"){return undefined}try{return json.parse(value)}catch(e){return value||undefined}};function isLocalStorageNameSupported(){try{return localStorageName in win&&win[localStorageName]}catch(err){return false}}if(isLocalStorageNameSupported()){storage=win[localStorageName];store.set=function(key,val){if(val===undefined){return store.remove(key)}storage.setItem(key,store.serialize(val));return val};store.get=function(key){return store.deserialize(storage.getItem(key))};store.remove=function(key){storage.removeItem(key)};store.clear=function(){storage.clear()};store.getAll=function(){var ret={};for(var i=0;i<storage.length;++i){var key=storage.key(i);ret[key]=store.get(key)}return ret}}else if(doc.documentElement.addBehavior){var storageOwner,storageContainer;try{storageContainer=new ActiveXObject("htmlfile");storageContainer.open();storageContainer.write("<s"+"cript>document.w=window</s"+'cript><iframe src="/favicon.ico"></iframe>');storageContainer.close();storageOwner=storageContainer.w.frames[0].document;storage=storageOwner.createElement("div")}catch(e){storage=doc.createElement("div");storageOwner=doc.body}function withIEStorage(storeFunction){return function(){var args=Array.prototype.slice.call(arguments,0);args.unshift(storage);storageOwner.appendChild(storage);storage.addBehavior("#default#userData");storage.load(localStorageName);var result=storeFunction.apply(store,args);storageOwner.removeChild(storage);return result}}var forbiddenCharsRegex=new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]","g");function ieKeyFix(key){return key.replace(forbiddenCharsRegex,"___")}store.set=withIEStorage(function(storage,key,val){key=ieKeyFix(key);if(val===undefined){return store.remove(key)}storage.setAttribute(key,store.serialize(val));storage.save(localStorageName);return val});store.get=withIEStorage(function(storage,key){key=ieKeyFix(key);return store.deserialize(storage.getAttribute(key))});store.remove=withIEStorage(function(storage,key){key=ieKeyFix(key);storage.removeAttribute(key);storage.save(localStorageName)});store.clear=withIEStorage(function(storage){var attributes=storage.XMLDocument.documentElement.attributes;storage.load(localStorageName);for(var i=0,attr;attr=attributes[i];i++){storage.removeAttribute(attr.name)}storage.save(localStorageName)});store.getAll=withIEStorage(function(storage){var attributes=storage.XMLDocument.documentElement.attributes;var ret={};for(var i=0,attr;attr=attributes[i];++i){var key=ieKeyFix(attr.name);ret[attr.name]=store.deserialize(storage.getAttribute(key))}return ret})}try{store.set(namespace,namespace);if(store.get(namespace)!=namespace){store.disabled=true}store.remove(namespace)}catch(e){store.disabled=true}store.enabled=!store.disabled;module.exports=store},{json:16}],16:[function(require,module,exports){var json=window.JSON||{};var stringify=json.stringify;var parse=json.parse;module.exports=parse&&stringify?JSON:require("json-fallback")},{"json-fallback":17}],17:[function(require,module,exports){(function(){"use strict";var JSON=module.exports={};function f(n){return n<10?"0"+n:n}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()}}var cx,escapable,gap,indent,meta,rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key)}if(typeof rep==="function"){value=rep.call(holder,key,value)}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null"}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){if(typeof rep[i]==="string"){k=rep[i];v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}}if(typeof JSON.stringify!=="function"){escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"};JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" "}}else if(typeof space==="string"){indent=space}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":value})}}if(typeof JSON.parse!=="function"){cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}})()},{}],7:[function(require,module,exports){module.exports=function uuid(a){return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,uuid)}},{}],8:[function(require,module,exports){(function umd(require){if("object"==typeof exports){module.exports=require("1")}else if("function"==typeof define&&define.amd){define(function(){return require("1")})}else{this["webanalyser"]=require("1")}})(function outer(modules,cache,entries){var global=function(){return this}();function require(name,jumped){if(cache[name])return cache[name].exports;if(modules[name])return call(name,require);throw new Error('cannot find module "'+name+'"')}function call(id,require){var m=cache[id]={exports:{}};var mod=modules[id];var name=mod[2];var fn=mod[0];fn.call(m.exports,function(req){var dep=modules[id][1][req];return require(dep?dep:req)},m,m.exports,outer,modules,cache,entries);if(name)cache[name]=cache[id];return cache[id].exports}for(var id in entries){if(entries[id]){global[entries[id]]=require(id)}else{require(id)}}require.duo=true;require.cache=cache;require.modules=modules;return require}({1:[function(require,module,exports){(function(){(function(document,navigator,screen,location){"use strict";var $defaults,$endTime,$onLoadHandlers,$startTime,$timeoutId,defaults,flashdetect,result,webanalyser;defaults=require("defaults");flashdetect=require("flashdetect");$startTime=(new Date).getTime();$endTime=(new Date).getTime();$timeoutId=null;$onLoadHandlers=[];$defaults={sr:screen.width+"x"+screen.height,vp:screen.availWidth+"x"+screen.availHeight,sd:screen.colorDepth,je:navigator.javaEnabled?navigator.javaEnabled():false,ul:navigator.languages?navigator.languages[0]:navigator.language||navigator.userLanguage||navigator.browserLanguage};webanalyser=function(){function webanalyser(){}webanalyser.prototype.getResult=function(){var rst;if(defaults.dl==null){rst={dr:document.referrer,dl:location.href,dh:location.hostname,dt:document.title,z:(new Date).getTime()};if(flashdetect.installed){rst.fl=flashdetect.major+" "+flashdetect.minor+" "+flashdetect.revisionStr}$defaults=defaults(rst,$defaults)}return $defaults};return webanalyser}();result=new webanalyser;return module.exports=result})(document,navigator,screen,location)}).call(this)},{defaults:2,flashdetect:3}],2:[function(require,module,exports){"use strict";var defaults=function(dest,src,recursive){for(var prop in src){if(recursive&&dest[prop]instanceof Object&&src[prop]instanceof Object){dest[prop]=defaults(dest[prop],src[prop],true)}else if(!(prop in dest)){dest[prop]=src[prop]}}return dest};module.exports=defaults},{}],3:[function(require,module,exports){var flashdetect=new function(){var self=this;self.installed=false;self.raw="";self.major=-1;self.minor=-1;self.revision=-1;self.revisionStr="";var activeXDetectRules=[{name:"ShockwaveFlash.ShockwaveFlash.7",version:function(obj){return getActiveXVersion(obj)}},{name:"ShockwaveFlash.ShockwaveFlash.6",version:function(obj){var version="6,0,21";try{obj.AllowScriptAccess="always";version=getActiveXVersion(obj)}catch(err){}return version}},{name:"ShockwaveFlash.ShockwaveFlash",version:function(obj){return getActiveXVersion(obj)}}];var getActiveXVersion=function(activeXObj){var version=-1;try{version=activeXObj.GetVariable("$version")}catch(err){}return version};var getActiveXObject=function(name){var obj=-1;try{obj=new ActiveXObject(name)}catch(err){obj={activeXError:true}}return obj};var parseActiveXVersion=function(str){var versionArray=str.split(",");return{raw:str,major:parseInt(versionArray[0].split(" ")[1],10),minor:parseInt(versionArray[1],10),revision:parseInt(versionArray[2],10),revisionStr:versionArray[2]}};var parseStandardVersion=function(str){var descParts=str.split(/ +/);var majorMinor=descParts[2].split(/\./);var revisionStr=descParts[3];return{raw:str,major:parseInt(majorMinor[0],10),minor:parseInt(majorMinor[1],10),revisionStr:revisionStr,revision:parseRevisionStrToInt(revisionStr)}};var parseRevisionStrToInt=function(str){return parseInt(str.replace(/[a-zA-Z]/g,""),10)||self.revision};self.majorAtLeast=function(version){return self.major>=version};self.minorAtLeast=function(version){return self.minor>=version};self.revisionAtLeast=function(version){return self.revision>=version};self.versionAtLeast=function(major){var properties=[self.major,self.minor,self.revision];var len=Math.min(properties.length,arguments.length);for(i=0;i<len;i++){if(properties[i]>=arguments[i]){if(i+1<len&&properties[i]==arguments[i]){continue}else{return true}}else{return false}}};self.flashdetect=function(){if(navigator.plugins&&navigator.plugins.length>0){var type="application/x-shockwave-flash";var mimeTypes=navigator.mimeTypes;if(mimeTypes&&mimeTypes[type]&&mimeTypes[type].enabledPlugin&&mimeTypes[type].enabledPlugin.description){var version=mimeTypes[type].enabledPlugin.description;var versionObj=parseStandardVersion(version);self.raw=versionObj.raw;self.major=versionObj.major;self.minor=versionObj.minor;self.revisionStr=versionObj.revisionStr;self.revision=versionObj.revision;self.installed=true}}else if(navigator.appVersion.indexOf("Mac")==-1&&window.execScript){var version=-1;for(var i=0;i<activeXDetectRules.length&&version==-1;i++){var obj=getActiveXObject(activeXDetectRules[i].name);if(!obj.activeXError){self.installed=true;version=activeXDetectRules[i].version(obj);if(version!=-1){var versionObj=parseActiveXVersion(version);self.raw=versionObj.raw;self.major=versionObj.major;self.minor=versionObj.minor;self.revision=versionObj.revision;self.revisionStr=versionObj.revisionStr}}}}}()};flashdetect.JS_RELEASE="1.0.4";module.exports=flashdetect},{}]},{},{1:""}))},{defaults:2,flashdetect:18}],18:[function(require,module,exports){var flashdetect=new function(){var self=this;self.installed=false;self.raw="";self.major=-1;self.minor=-1;self.revision=-1;self.revisionStr="";var activeXDetectRules=[{name:"ShockwaveFlash.ShockwaveFlash.7",version:function(obj){return getActiveXVersion(obj)}},{name:"ShockwaveFlash.ShockwaveFlash.6",version:function(obj){var version="6,0,21";try{obj.AllowScriptAccess="always";version=getActiveXVersion(obj)}catch(err){}return version}},{name:"ShockwaveFlash.ShockwaveFlash",version:function(obj){return getActiveXVersion(obj)}}];var getActiveXVersion=function(activeXObj){var version=-1;try{version=activeXObj.GetVariable("$version")}catch(err){}return version};var getActiveXObject=function(name){var obj=-1;try{obj=new ActiveXObject(name)}catch(err){obj={activeXError:true}}return obj};var parseActiveXVersion=function(str){var versionArray=str.split(",");return{raw:str,major:parseInt(versionArray[0].split(" ")[1],10),minor:parseInt(versionArray[1],10),revision:parseInt(versionArray[2],10),revisionStr:versionArray[2]}};var parseStandardVersion=function(str){var descParts=str.split(/ +/);var majorMinor=descParts[2].split(/\./);var revisionStr=descParts[3];return{raw:str,major:parseInt(majorMinor[0],10),minor:parseInt(majorMinor[1],10),revisionStr:revisionStr,revision:parseRevisionStrToInt(revisionStr)}};var parseRevisionStrToInt=function(str){return parseInt(str.replace(/[a-zA-Z]/g,""),10)||self.revision};self.majorAtLeast=function(version){return self.major>=version};self.minorAtLeast=function(version){return self.minor>=version};self.revisionAtLeast=function(version){return self.revision>=version};self.versionAtLeast=function(major){var properties=[self.major,self.minor,self.revision];var len=Math.min(properties.length,arguments.length);for(i=0;i<len;i++){if(properties[i]>=arguments[i]){if(i+1<len&&properties[i]==arguments[i]){continue}else{return true}}else{return false}}};self.flashdetect=function(){if(navigator.plugins&&navigator.plugins.length>0){var type="application/x-shockwave-flash";var mimeTypes=navigator.mimeTypes;if(mimeTypes&&mimeTypes[type]&&mimeTypes[type].enabledPlugin&&mimeTypes[type].enabledPlugin.description){var version=mimeTypes[type].enabledPlugin.description;var versionObj=parseStandardVersion(version);self.raw=versionObj.raw;self.major=versionObj.major;self.minor=versionObj.minor;self.revisionStr=versionObj.revisionStr;self.revision=versionObj.revision;self.installed=true}}else if(navigator.appVersion.indexOf("Mac")==-1&&window.execScript){var version=-1;for(var i=0;i<activeXDetectRules.length&&version==-1;i++){var obj=getActiveXObject(activeXDetectRules[i].name);

if(!obj.activeXError){self.installed=true;version=activeXDetectRules[i].version(obj);if(version!=-1){var versionObj=parseActiveXVersion(version);self.raw=versionObj.raw;self.major=versionObj.major;self.minor=versionObj.minor;self.revision=versionObj.revision;self.revisionStr=versionObj.revisionStr}}}}}()};flashdetect.JS_RELEASE="1.0.4";module.exports=flashdetect},{}],9:[function(require,module,exports){myObj=null;mydefine=function(h,F){myObj=F().$};mydefine("minified",function(){function A(a){return a!=h?""+a:""}function B(a){return"string"==typeof a}function D(a){return a}function r(a,b,c){return A(a).replace(b,c!=h?c:"")}function E(a,b,c){for(var d in a)a.hasOwnProperty(d)&&b.call(c||a,d,a[d]);return a}function p(a,b,c){if(a)for(var d=0;d<a.length;d++)b.call(c||a,a[d],d);return a}function M(a,b){var c=[],d=l(b)?b:function(a){return b!=a};p(a,function(b,f){d.call(a,b,f)&&c.push(b)});return c}function t(a,b,c){var d=[];a(b,function(a,f){x(a=c.call(b,a,f))?p(a,function(a){d.push(a)}):a!=h&&d.push(a)});return d}function F(a,b){var c=[];p(a,function(d,e){c.push(b.call(a,d,e))});return c}function K(a,b){var c=b||{},d;for(d in a)c[d]=a[d]}function L(a,b,c){if(l(a))return a.apply(c&&b,F(c||b,D))}function N(a){F(a,function(a){return L(a,void 0,void 0)})}function O(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}function l(a){return"function"==typeof a&&!a.item}function x(a){return a&&a.length!=h&&!B(a)&&!(a&&a.nodeType)&&!l(a)&&a!==u}function P(a,b){for(var c=0;a&&c<a.length;c++)a[c]===b&&a.splice(c--,1)}function G(a){return a.Nia=a.Nia||++U}function Q(a,b){var c=[],d={},e;m(a,function(a){m(b(a),function(a){d[e=G(a)]||(c.push(a),d[e]=!0)})});return c}function V(a,b,c,d,e,f){return function(g,k){var v,q=g||u.event,R=!f,n=k||q.target||q.srcElement;if(f)for(;n&&n!=b&&!(R=f(n));)n=n.parentNode;R&&(v=(!a.apply(y(f?n:b),c||[q,d])||""==e)&&"|"!=e)&&!k&&(q.preventDefault&&(q.preventDefault(),q.stopPropagation()),q.cancelBubble=!0);return!v}}function W(a,b){m(b,function(a){a.element.detachEvent("on"+a.a,a.b)})}function S(a){z?z.push(a):setTimeout(a,0)}function y(a,b,c){return l(a)?S(a):new H(w(a,b,c))}function w(a,b,c){function d(a){a=t(m,a,function n(a){return x(a)?t(m,a,n):a});return f?M(a,function(a){for(;a=a.parentNode;)if(a==f||c)return a==f}):a}function e(a,b){var c=RegExp("(^|\\s+)"+a+"(?=$|\\s)","i");return function(d){return a?c.test(d[b]):!0}}var f,g,k,v;if(b&&1!=(b=w(b)).length)return Q(b,function(b){return w(a,b,c)});f=b&&b[0];if(!B(a))return d(a);if(f&&1!=(f&&f.nodeType))return[];if(1<(b=a.split(/\s*,\s*/)).length)return Q(b,function(a){return w(a,f,c)});if(b=/(\S+)\s+(.+)$/.exec(a))return w(b[2],w(b[1],f),c);if(a!=(b=r(a,/^#/)))return d(document.getElementById(b));g=(b=/([\w-]*)\.?([\w-]*)/.exec(a))[1];v=b[2];b=(k=document.getElementsByClassName&&v)?(f||document).getElementsByClassName(v):(f||document).getElementsByTagName(g||"*");if(g=k?g:v)b=M(b,e(g,k?"tagName":"className"));return c?d(b):b}function X(a,b){function c(a,b){var c=RegExp("(^|\\s+)"+a+"(?=$|\\s)","i");return function(d){return a?c.test(d[b]):!0}}var d={},e=d;if(l(a))return a;if("number"==typeof a)return function(b,c){return c==a};if(!a||"*"==a||B(a)&&(e=/^([\w-]*)\.?([\w-]*)$/.exec(a))){var f=c(e[1],"tagName"),g=c(e[2],"className");return function(a){return 1==(a&&a.nodeType)&&f(a)&&g(a)}}if(b)return function(c){return y(a,b).find(c)!=h};y(a).each(function(a){d[G(a)]=!0});return function(a){return d[G(a)]}}function m(a,b){x(a)?p(a,b):a!=h&&b(a,0);return a}function I(){function a(a,d){b==h&&a!=h&&(b=a,g=x(d)?d:[d],setTimeout(function(){p(c,function(a){a()})},0));return b}var b,c=[],d=arguments,e=d.length,f=0,g=[];p(d,function q(c,b){try{c.then?c.then(function(c){var d;(c&&"object"==typeof c||l(c))&&l(d=c.then)?q(d,b):(g[b]=F(arguments,D),++f==e&&a(!0,2>e?g[b]:g))},function(c){g[b]=F(arguments,D);a(!1,2>e?g[b]:[g[b][0],g,b])}):c(function(){a(!0,arguments)},function(){a(!1,arguments)})}catch(d){a(!1,[d,g,b])}});a.stop=function(){p(d,function(a){a.stop&&a.stop()});return L(a.stop0)};var k=a.then=function(d,e){function f(){try{var a=b?d:e;l(a)?function Y(a){try{var c,b=0;if((a&&"object"==typeof a||l(a))&&l(c=a.then)){if(a===k)throw new TypeError;c.call(a,function(a){b++||Y(a)},function(a){b++||k(!1,[a])});k.stop0=a.stop}else k(!0,[a])}catch(d){b++||k(!1,[d])}}(L(a,Z,g)):k(b,g)}catch(c){k(!1,[c])}}var k=I();k.stop0=a.stop;b!=h?setTimeout(f,0):c.push(f);return k};a.always=function(a){return k(a,a)};a.error=function(a){return k(0,a)};return a}function H(a,b){var c=0;if(a)for(var d=0,e=a.length;d<e;d++){var f=a[d];if(b&&x(f))for(var g=0,k=f.length;g<k;g++)this[c++]=f[g];else this[c++]=f}else this[c++]=b;this.length=c;this._=!0}var u=this,U=1,C={},z=/^[ic]/.test(document.readyState)?h:[],J=!!document.all&&!document.addEventListener,h=null,Z;K({each:function(a){return function(b,c,d){return a(this,b,c,d)}}(p),f:0,values:function(a){var b=a||{};this.each(function(a){var d=a.name||a.id,e=A(a.value);if(/form/i.test(a.tagName))for(d=0;d<a.elements.length;d++)y(a.elements[d]).values(b);else!d||/ox|io/i.test(a.type)&&!a.checked||(b[d]=b[d]==h?e:t(m,[b[d],e],D))});return b},on:function(a,b,c,d,e){return l(b)?this.on(h,a,b,c,e):B(d)?this.on(a,b,c,h,d):this.each(function(f,g){m(a?w(a,f):f,function(a){m(A(b).split(/\s/),function(b){var f=r(b,/[?|]/),h=!!e&&("blur"==f||"focus"==f),n=V(c,a,d,g,r(b,/[^?|]/g),e&&X(e,a));b={element:a,b:n,a:f,c:h};(c.M=c.M||[]).push(b);J?(a.attachEvent("on"+b.a+(h?"in":""),n),f=G(a),(C[f]=C[f]||[]).push(b)):(a.addEventListener(f,n,h),(a.M=a.M||[]).push(b))})})})},onClick:function(a,b,c,d){return l(b)?this.on(a,"click",b,c,d):this.onClick(h,a,b,c)},trigger:function(a,b){return this.each(function(c){for(var d,e=c;e&&!d;)m(J?C[e.Nia]:e.M,function(e){e.a==a&&(d=d||!e.b(b,c))}),e=e.parentNode})},e:0},H.prototype);K({request:function(a,b,c,d){d=d||{};var e,f=0,g=I(),k=c&&c.constructor==d.constructor;try{g.xhr=e=u.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Msxml2.XMLHTTP.3.0"),g.stop0=function(){e.abort()},k&&(c=t(E,c,function(a,b){return t(m,b,function(b){return encodeURIComponent(a)+(b!=h?"="+encodeURIComponent(b):"")})}).join("&")),c==h||/post/i.test(a)||(b+="?"+c,c=h),e.open(a,b,!0,d.user,d.pass),k&&/post/i.test(a)&&e.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),E(d.headers,function(a,b){e.setRequestHeader(a,b)}),E(d.xhr,function(a,b){e[a]=b}),e.onreadystatechange=function(){4!=e.readyState||f++||(200==e.status?g(!0,[e.responseText,e]):g(!1,[e.status,e.responseText,e]))},e.send(c)}catch(l){f||g(!1,[0,h,A(l)])}return g},toJSON:function b(c){return c==h?""+c:B(c=c.valueOf())?'"'+r(c,/[\\\"\x00-\x1f\u2028\u2029]/g,O)+'"':x(c)?"["+t(m,c,b).join()+"]":c&&"object"==typeof c?"{"+t(E,c,function(c,e){return b(c)+":"+b(e)}).join()+"}":A(c)},parseJSON:u.JSON?u.JSON.parse:function(b){b=r(b,/[\x00\xad\u0600-\uffff]/g,O);if(/^[[\],:{}\s]*$/.test(r(r(b,/\\["\\\/bfnrtu]/g),/"[^"\\\n\r]*"|true|false|null|[\d.eE+-]+/g)))return eval("("+b+")")},ready:S,off:function(b){m(b.M,function(b){J?(b.element.detachEvent("on"+b.a+(b.c?"in":""),b.b),P(C[b.element.Nia],b)):(b.element.removeEventListener(b.a,b.b,b.c),P(b.element.M,b))});b.M=h},wait:function(b,c){var d=I(),e=setTimeout(function(){d(!0,c)},b);d.stop0=function(){d(!1);clearTimeout(e)};return d}},y);K({each:p,toObject:function(b,c){var d={};p(b,function(b){d[b]=c});return d},d:0,promise:I},function(){return new H(arguments,!0)});if(J){var T=function(){N(z);z=h};document.attachEvent("onreadystatechange",function(){/^[ic]/.test(document.readyState)&&T()});u.attachEvent("onload",T)}else document.addEventListener("DOMContentLoaded",function(){N(z);z=h},!1);u.g=function(){m(C,W)};return{$:y,M:H,getter:{},setter:{}}});module.exports=myObj},{}]},{},{1:""}));

/*!
 *  Project: circplus

 Initialize circplus using the code below:

to init, tag any div with class "circplus"
  $.circPlus({dfpID: '6394/6394.test', setTargeting: {dept: 'beverages'} });
  $.circPlus({ dfpID: '6394/partner-root-3566/123.giantcarlisle', setTargeting: {dept: 'beverages'} });

same command to refresh:
  $.circPlus({ dfpID: '6394/partner-root-3566/123.giantcarlisle', setTargeting: {dept: 'beverages'} });
 */
(function($, window) {
  'use strict';
  var $adCollection, bodyTemplate, count, createAds, dfpBlocked, dfpID, dfpIsLoaded, dfpLoader, dfpOptions, dfpScript, dfpSelector, displayAds, getDimensions, getID, init, isInView, rendered, sessionStorageX, setOptions, storeAs;
  sessionStorageX = sessionStorage;
  if (typeof sessionStorageX === 'undefined') {
    sessionStorageX = {
      getItem: function() {},
      setItem: function() {}
    };
  }
  dfpScript = this;
  dfpID = '';
  count = 0;
  rendered = 0;
  dfpSelector = '.circplus';
  dfpOptions = {};
  dfpIsLoaded = false;
  $adCollection = void 0;
  storeAs = 'circplus';
  bodyTemplate = '<div class="gsn-slot-container"><div class="cpslot cpslot2" data-companion="true" data-dimensions="300x50"></div></div><div class="gsn-slot-container"><div class="cpslot cpslot1" data-dimensions="300x100,300x120"></div></div>';
  init = function(id, selector, options) {
    dfpID = id;
    if ($(selector).html() === '') {
      if (options.templateSelector) {
        $(selector).html($(options.templateSelector).html());
      } else {
        $(selector).html(options.bodyTemplate || bodyTemplate);
      }
    }
    $adCollection = $($('.cpslot').get().reverse());
    dfpLoader();
    setOptions(options);
    $(function() {
      createAds();
      displayAds();
    });
  };
  setOptions = function(options) {
    dfpOptions = {
      setTargeting: {},
      setCategoryExclusion: '',
      setLocation: '',
      enableSingleRequest: false,
      collapseEmptyDivs: true,
      refreshExisting: true,
      disablePublisherConsole: false,
      disableInitialLoad: false,
      inViewOnly: true,
      noFetch: false
    };
    $.extend(true, dfpOptions, options);
    if (dfpOptions.googletag) {
      window.googletag.cmd.push(function() {
        $.extend(true, window.googletag, dfpOptions.googletag);
      });
    }
  };
  createAds = function() {
    $adCollection.each(function() {
      var $adUnit, $existingContent, adUnitID, dimensions;
      $adUnit = $(this);
      count++;
      adUnitID = getID($adUnit, 'gsncircplus', count);
      dimensions = getDimensions($adUnit);
      $existingContent = $adUnit.html();
      $adUnit.html('').addClass('display-none');
      window.googletag.cmd.push(function() {
        var $adUnitData, companion, exclusions, exclusionsGroup, googleAdUnit, targeting, valueTrimmed;
        googleAdUnit = void 0;
        $adUnitData = $adUnit.data(storeAs);
        if ($adUnitData) {
          return;
        }
        dfpID = dfpID.replace(/(\/\/)+/gi, '/').replace(/\s+/gi, '').replace(/(\/)$/, '/');
        if (dfpID.indexOf('/') !== 0) {
          dfpID = '/' + dfpID;
        }
        if ($adUnit.data('outofpage')) {
          googleAdUnit = window.googletag.defineOutOfPageSlot(dfpID, adUnitID).addService(window.googletag.pubads());
        } else {
          googleAdUnit = window.googletag.defineSlot(dfpID, dimensions, adUnitID).addService(window.googletag.pubads());
        }
        companion = $adUnit.data('companion');
        if (companion) {
          googleAdUnit.addService(window.googletag.companionAds());
        }
        targeting = $adUnit.data('targeting');
        if (targeting) {
          if (typeof targeting === 'string') {
            targeting = eval('(' + targeting + ')');
          }
          $.each(targeting, function(k, v) {
            if (k === 'brand') {
              sessionStorageX.setItem('brand', v);
            }
            googleAdUnit.setTargeting(k, v);
          });
        }
        exclusions = $adUnit.data('exclusions');
        if (exclusions) {
          exclusionsGroup = exclusions.split(',');
          valueTrimmed = void 0;
          $.each(exclusionsGroup, function(k, v) {
            valueTrimmed = $.trim(v);
            if (valueTrimmed.length > 0) {
              googleAdUnit.setCategoryExclusion(valueTrimmed);
            }
          });
        }
        googleAdUnit.oldRenderEnded = googleAdUnit.oldRenderEnded || googleAdUnit.renderEnded;
        googleAdUnit.renderEnded = function() {
          var display;
          rendered++;
          display = $adUnit.css('display');
          $adUnit.removeClass('display-none').addClass('display-' + display);
          googleAdUnit.oldRenderEnded();
          if (typeof dfpOptions.afterEachAdLoaded === 'function') {
            dfpOptions.afterEachAdLoaded.call(this, $adUnit);
          }
          if (typeof dfpOptions.afterAllAdsLoaded === 'function' && rendered === count) {
            dfpOptions.afterAllAdsLoaded.call(this, $adCollection);
          }
        };
        $adUnit.data(storeAs, googleAdUnit);
      });
    });
    window.googletag.cmd.push(function() {
      var exclusionsGroup, valueTrimmed;
      if (typeof dfpOptions.setTargeting['brand'] === 'undefined') {
        if (sessionStorageX.getItem('brand')) {
          dfpOptions.setTargeting['brand'] = sessionStorageX.getItem('brand');
        }
      }
      if (dfpOptions.enableSingleRequest === true) {
        window.googletag.pubads().enableSingleRequest();
      }
      $.each(dfpOptions.setTargeting, function(k, v) {
        if (k === 'brand') {
          sessionStorageX.setItem('brand', v);
        }
        window.googletag.pubads().setTargeting(k, v);
      });
      if (typeof dfpOptions.setLocation === 'object') {
        if (typeof dfpOptions.setLocation.latitude === 'number' && typeof dfpOptions.setLocation.longitude === 'number' && typeof dfpOptions.setLocation.precision === 'number') {
          window.googletag.pubads().setLocation(dfpOptions.setLocation.latitude, dfpOptions.setLocation.longitude, dfpOptions.setLocation.precision);
        } else if (typeof dfpOptions.setLocation.latitude === 'number' && typeof dfpOptions.setLocation.longitude === 'number') {
          window.googletag.pubads().setLocation(dfpOptions.setLocation.latitude, dfpOptions.setLocation.longitude);
        }
      }
      if (dfpOptions.setCategoryExclusion.length > 0) {
        exclusionsGroup = dfpOptions.setCategoryExclusion.split(',');
        valueTrimmed = void 0;
        $.each(exclusionsGroup, function(k, v) {
          valueTrimmed = $.trim(v);
          if (valueTrimmed.length > 0) {
            window.googletag.pubads().setCategoryExclusion(valueTrimmed);
          }
        });
      }
      if (dfpOptions.collapseEmptyDivs === true || dfpOptions.collapseEmptyDivs === 'original') {
        window.googletag.pubads().collapseEmptyDivs();
      }
      if (dfpOptions.disablePublisherConsole === true) {
        window.googletag.pubads().disablePublisherConsole();
      }
      if (dfpOptions.disableInitialLoad === true) {
        window.googletag.pubads().disableInitialLoad();
      }
      if (dfpOptions.noFetch === true) {
        window.googletag.pubads().noFetch();
      }
      window.googletag.companionAds().setRefreshUnfilledSlots(true);
      window.googletag.enableServices();
    });
  };
  isInView = function(elem) {
    var docViewBottom, docViewTop, elemBottom, elemTop;
    docViewTop = $(window).scrollTop();
    docViewBottom = docViewTop + $(window).height();
    elemTop = elem.offset().top;
    elemBottom = elemTop + elem.height();
    return elemTop + (elemBottom - elemTop) / 2 >= docViewTop && elemTop + (elemBottom - elemTop) / 2 <= docViewBottom;
  };
  displayAds = function() {
    var toPush;
    toPush = [];
    $adCollection.each(function() {
      var $adUnit, $adUnitData;
      $adUnit = $(this);
      $adUnitData = $adUnit.data(storeAs);
      if (dfpOptions.refreshExisting && $adUnitData && $adUnit.data('gsnDfpExisting')) {
        if (!dfpOptions.inViewOnly || isInView($adUnit)) {
          toPush.push($adUnitData);
        }
      } else {
        $adUnit.data('gsnDfpExisting', true);
        window.googletag.cmd.push(function() {
          window.googletag.display($adUnit.attr('id'));
        });
      }
    });
    if (toPush.length > 0) {
      window.googletag.cmd.push(function() {
        window.googletag.pubads().refresh(toPush);
      });
    }
  };
  getID = function($adUnit, adUnitName, count) {
    if (!dfpOptions.refreshExisting) {
      $adUnit.data(storeAs, null);
      $adUnit.data('gsnDfpExisting', null);
      if ($adUnit.attr('id')) {
        $adUnit.attr('id', adUnitName + '-auto-gen-id-' + count);
      }
    }
    return $adUnit.attr('id') || $adUnit.attr('id', adUnitName + '-auto-gen-id-' + count).attr('id');
  };
  getDimensions = function($adUnit) {
    var dimensionGroups, dimensions, dimensionsData;
    dimensions = [];
    dimensionsData = $adUnit.data('dimensions');
    if (dimensionsData) {
      dimensionGroups = dimensionsData.split(',');
      $.each(dimensionGroups, function(k, v) {
        var dimensionSet;
        dimensionSet = v.split('x');
        dimensions.push([parseInt(dimensionSet[0], 10), parseInt(dimensionSet[1], 10)]);
      });
    } else {
      dimensions.push([$adUnit.width(), $adUnit.height()]);
    }
    return dimensions;
  };
  dfpLoader = function() {
    var gads, node, useSsl;
    dfpIsLoaded = dfpIsLoaded || $('script[src*="googletagservices.com/tag/js/gpt.js"]').length;
    if (dfpIsLoaded) {
      return;
    }
    window.googletag = window.googletag || {};
    window.googletag.cmd = window.googletag.cmd || [];
    gads = document.createElement('script');
    gads.async = true;
    gads.type = 'text/javascript';
    gads.onerror = function() {
      dfpBlocked();
    };
    useSsl = 'https:' === document.location.protocol;
    gads.src = (useSsl ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js';
    node = document.getElementsByTagName('script')[0];
    node.parentNode.insertBefore(gads, node);
    if (gads.style.display === 'none') {
      dfpBlocked();
    }
  };
  dfpBlocked = function() {
    var commands;
    commands = window.googletag.cmd;
    setTimeout((function() {
      var _defineSlot;
      _defineSlot = function(name, dimensions, id, oop) {
        window.googletag.ads.push(id);
        window.googletag.ads[id] = {
          renderEnded: function() {},
          addService: function() {
            return this;
          }
        };
        return window.googletag.ads[id];
      };
      window.googletag = {
        cmd: {
          push: function(callback) {
            callback.call(dfpScript);
          }
        },
        ads: [],
        pubads: function() {
          return this;
        },
        noFetch: function() {
          return this;
        },
        disableInitialLoad: function() {
          return this;
        },
        disablePublisherConsole: function() {
          return this;
        },
        enableSingleRequest: function() {
          return this;
        },
        setTargeting: function() {
          return this;
        },
        collapseEmptyDivs: function() {
          return this;
        },
        enableServices: function() {
          return this;
        },
        defineSlot: function(name, dimensions, id) {
          return _defineSlot(name, dimensions, id, false);
        },
        defineOutOfPageSlot: function(name, id) {
          return _defineSlot(name, [], id, true);
        },
        display: function(id) {
          window.googletag.ads[id].renderEnded.call(dfpScript);
          return this;
        }
      };
      $.each(commands, function(k, v) {
        window.googletag.cmd.push(v);
      });
    }), 50);
  };

  /**
   * Add function to the jQuery / Zepto / tire namespace
   * @param  String id      (Optional) The DFP account ID
   * @param  Object options (Optional) Custom options to apply
   */
  $.circPlus = $.fn.circPlus = function(id, options) {
    var selector;
    options = options || {};
    if (id === void 0) {
      id = dfpID;
    }
    if (typeof id === 'object') {
      options = id;
      id = options.dfpID || dfpID;
    }
    selector = this;
    if (typeof this === 'function') {
      selector = dfpSelector;
    }
    init(id, selector, options);
    return this;
  };
})(window.jQuery || window.Zepto || window.tire || window.$, window);


/*!
 *  Project: gsndfp
 * ===============================
 */

(function($, window) {
  'use strict';
  var $adCollection, count, createAds, dfpBlocked, dfpID, dfpIsLoaded, dfpLoader, dfpOptions, dfpScript, dfpSelector, displayAds, getDimensions, getID, init, isInView, rendered, sessionStorageX, setOptions, storeAs;
  sessionStorageX = sessionStorage;
  if (typeof sessionStorageX === 'undefined') {
    sessionStorageX = {
      getItem: function() {},
      setItem: function() {}
    };
  }
  dfpScript = this;
  dfpID = '';
  count = 0;
  rendered = 0;
  dfpSelector = '.gsnunit';
  dfpOptions = {};
  dfpIsLoaded = false;
  $adCollection = void 0;
  storeAs = 'gsnUnit';
  init = function(id, selector, options) {
    dfpID = id;
    $adCollection = $(selector);
    dfpLoader();
    setOptions(options);
    $(function() {
      createAds();
      displayAds();
    });
  };
  setOptions = function(options) {
    dfpOptions = {
      setTargeting: {},
      setCategoryExclusion: '',
      setLocation: '',
      enableSingleRequest: false,
      collapseEmptyDivs: true,
      refreshExisting: true,
      disablePublisherConsole: false,
      disableInitialLoad: false,
      inViewOnly: true,
      noFetch: false
    };
    $.extend(true, dfpOptions, options);
    if (dfpOptions.googletag) {
      window.googletag.cmd.push(function() {
        $.extend(true, window.googletag, dfpOptions.googletag);
      });
    }
  };
  createAds = function() {
    $adCollection.each(function() {
      var $adUnit, $existingContent, adUnitID, dimensions;
      $adUnit = $(this);
      count++;
      adUnitID = getID($adUnit, 'gsn', count);
      dimensions = getDimensions($adUnit);
      $existingContent = $adUnit.html();
      $adUnit.html('').addClass('display-none');
      window.googletag.cmd.push(function() {
        var $adUnitData, exclusions, exclusionsGroup, googleAdUnit, targeting, valueTrimmed;
        googleAdUnit = void 0;
        $adUnitData = $adUnit.data(storeAs);
        if ($adUnitData) {
          return;
        }
        dfpID = dfpID.replace(/(\/\/)+/gi, '/').replace(/\s+/gi, '').replace(/(\/)$/, '/');
        if (dfpID.indexOf('/') !== 0) {
          dfpID = '/' + dfpID;
        }
        if ($adUnit.data('outofpage')) {
          googleAdUnit = window.googletag.defineOutOfPageSlot(dfpID, adUnitID).addService(window.googletag.pubads());
        } else {
          googleAdUnit = window.googletag.defineSlot(dfpID, dimensions, adUnitID).addService(window.googletag.pubads());
        }
        targeting = $adUnit.data('targeting');
        if (targeting) {
          if (typeof targeting === 'string') {
            targeting = eval('(' + targeting + ')');
          }
          $.each(targeting, function(k, v) {
            if (k === 'brand') {
              sessionStorageX.setItem('brand', v);
            }
            googleAdUnit.setTargeting(k, v);
          });
        }
        exclusions = $adUnit.data('exclusions');
        if (exclusions) {
          exclusionsGroup = exclusions.split(',');
          valueTrimmed = void 0;
          $.each(exclusionsGroup, function(k, v) {
            valueTrimmed = $.trim(v);
            if (valueTrimmed.length > 0) {
              googleAdUnit.setCategoryExclusion(valueTrimmed);
            }
          });
        }
        googleAdUnit.oldRenderEnded = googleAdUnit.oldRenderEnded || googleAdUnit.renderEnded;
        googleAdUnit.renderEnded = function() {
          var display;
          rendered++;
          display = $adUnit.css('display');
          $adUnit.removeClass('display-none').addClass('display-' + display);
          googleAdUnit.oldRenderEnded();
          if (typeof dfpOptions.afterEachAdLoaded === 'function') {
            dfpOptions.afterEachAdLoaded.call(this, $adUnit);
          }
          if (typeof dfpOptions.afterAllAdsLoaded === 'function' && rendered === count) {
            dfpOptions.afterAllAdsLoaded.call(this, $adCollection);
          }
        };
        $adUnit.data(storeAs, googleAdUnit);
      });
    });
    window.googletag.cmd.push(function() {
      var exclusionsGroup, valueTrimmed;
      if (typeof dfpOptions.setTargeting['brand'] === 'undefined') {
        if (sessionStorageX.getItem('brand')) {
          dfpOptions.setTargeting['brand'] = sessionStorageX.getItem('brand');
        }
      }
      if (dfpOptions.enableSingleRequest === true) {
        window.googletag.pubads().enableSingleRequest();
      }
      $.each(dfpOptions.setTargeting, function(k, v) {
        if (k === 'brand') {
          sessionStorageX.setItem('brand', v);
        }
        window.googletag.pubads().setTargeting(k, v);
      });
      if (typeof dfpOptions.setLocation === 'object') {
        if (typeof dfpOptions.setLocation.latitude === 'number' && typeof dfpOptions.setLocation.longitude === 'number' && typeof dfpOptions.setLocation.precision === 'number') {
          window.googletag.pubads().setLocation(dfpOptions.setLocation.latitude, dfpOptions.setLocation.longitude, dfpOptions.setLocation.precision);
        } else if (typeof dfpOptions.setLocation.latitude === 'number' && typeof dfpOptions.setLocation.longitude === 'number') {
          window.googletag.pubads().setLocation(dfpOptions.setLocation.latitude, dfpOptions.setLocation.longitude);
        }
      }
      if (dfpOptions.setCategoryExclusion.length > 0) {
        exclusionsGroup = dfpOptions.setCategoryExclusion.split(',');
        valueTrimmed = void 0;
        $.each(exclusionsGroup, function(k, v) {
          valueTrimmed = $.trim(v);
          if (valueTrimmed.length > 0) {
            window.googletag.pubads().setCategoryExclusion(valueTrimmed);
          }
        });
      }
      if (dfpOptions.collapseEmptyDivs) {
        window.googletag.pubads().collapseEmptyDivs();
      }
      if (dfpOptions.disablePublisherConsole === true) {
        window.googletag.pubads().disablePublisherConsole();
      }
      if (dfpOptions.disableInitialLoad === true) {
        window.googletag.pubads().disableInitialLoad();
      }
      if (dfpOptions.noFetch === true) {
        window.googletag.pubads().noFetch();
      }
      window.googletag.enableServices();
    });
  };
  isInView = function(elem) {
    var docViewBottom, docViewTop, elemBottom, elemTop;
    docViewTop = $(window).scrollTop();
    docViewBottom = docViewTop + $(window).height();
    elemTop = elem.offset().top;
    elemBottom = elemTop + elem.height();
    return elemTop + (elemBottom - elemTop) / 2 >= docViewTop && elemTop + (elemBottom - elemTop) / 2 <= docViewBottom;
  };
  displayAds = function() {
    var toPush;
    toPush = [];
    $adCollection.each(function() {
      var $adUnit, $adUnitData;
      $adUnit = $(this);
      $adUnitData = $adUnit.data(storeAs);
      if (dfpOptions.refreshExisting && $adUnitData && $adUnit.data('gsnDfpExisting')) {
        if (!dfpOptions.inViewOnly || isInView($adUnit)) {
          toPush.push($adUnitData);
        }
      } else {
        $adUnit.data('gsnDfpExisting', true);
        window.googletag.cmd.push(function() {
          window.googletag.display($adUnit.attr('id'));
        });
      }
    });
    if (toPush.length > 0) {
      window.googletag.cmd.push(function() {
        window.googletag.pubads().refresh(toPush);
      });
    }
  };
  getID = function($adUnit, adUnitName, count) {
    if (!dfpOptions.refreshExisting) {
      $adUnit.data(storeAs, null);
      $adUnit.data('gsnDfpExisting', null);
      if ($adUnit.attr('id')) {
        $adUnit.attr('id', adUnitName + '-auto-gen-id-' + count);
      }
    }
    return $adUnit.attr('id') || $adUnit.attr('id', adUnitName + '-auto-gen-id-' + count).attr('id');
  };
  getDimensions = function($adUnit) {
    var dimensionGroups, dimensions, dimensionsData;
    dimensions = [];
    dimensionsData = $adUnit.data('dimensions');
    if (dimensionsData) {
      dimensionGroups = dimensionsData.split(',');
      $.each(dimensionGroups, function(k, v) {
        var dimensionSet;
        dimensionSet = v.split('x');
        dimensions.push([parseInt(dimensionSet[0], 10), parseInt(dimensionSet[1], 10)]);
      });
    } else {
      dimensions.push([$adUnit.width(), $adUnit.height()]);
    }
    return dimensions;
  };
  dfpLoader = function() {
    var gads, node, useSsl;
    dfpIsLoaded = dfpIsLoaded || $('script[src*="googletagservices.com/tag/js/gpt.js"]').length;
    if (dfpIsLoaded) {
      return;
    }
    window.googletag = window.googletag || {};
    window.googletag.cmd = window.googletag.cmd || [];
    gads = document.createElement('script');
    gads.async = true;
    gads.type = 'text/javascript';
    gads.onerror = function() {
      dfpBlocked();
    };
    useSsl = 'https:' === document.location.protocol;
    gads.src = (useSsl ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js';
    node = document.getElementsByTagName('script')[0];
    node.parentNode.insertBefore(gads, node);
    if (gads.style.display === 'none') {
      dfpBlocked();
    }
  };
  dfpBlocked = function() {
    var commands;
    commands = window.googletag.cmd;
    setTimeout((function() {
      var _defineSlot;
      _defineSlot = function(name, dimensions, id, oop) {
        window.googletag.ads.push(id);
        window.googletag.ads[id] = {
          renderEnded: function() {},
          addService: function() {
            return this;
          }
        };
        return window.googletag.ads[id];
      };
      window.googletag = {
        cmd: {
          push: function(callback) {
            callback.call(dfpScript);
          }
        },
        ads: [],
        pubads: function() {
          return this;
        },
        noFetch: function() {
          return this;
        },
        disableInitialLoad: function() {
          return this;
        },
        disablePublisherConsole: function() {
          return this;
        },
        enableSingleRequest: function() {
          return this;
        },
        setTargeting: function() {
          return this;
        },
        collapseEmptyDivs: function() {
          return this;
        },
        enableServices: function() {
          return this;
        },
        defineSlot: function(name, dimensions, id) {
          return _defineSlot(name, dimensions, id, false);
        },
        defineOutOfPageSlot: function(name, id) {
          return _defineSlot(name, [], id, true);
        },
        display: function(id) {
          window.googletag.ads[id].renderEnded.call(dfpScript);
          return this;
        }
      };
      $.each(commands, function(k, v) {
        window.googletag.cmd.push(v);
      });
    }), 50);
  };

  /**
   * Add function to the jQuery / Zepto / tire namespace
   * @param  String id      (Optional) The DFP account ID
   * @param  Object options (Optional) Custom options to apply
   */
  $.gsnDfp = $.fn.gsnDfp = function(id, options) {
    var selector;
    options = options || {};
    if (id === void 0) {
      id = dfpID;
    }
    if (typeof id === 'object') {
      options = id;
      id = options.dfpID || dfpID;
    }
    selector = this;
    if (typeof this === 'function') {
      selector = dfpSelector;
    }
    init(id, selector, options);
    return this;
  };
})(window.jQuery || window.Zepto || window.tire || window.$, window);


/*!
 *  Project: gsnsw2
 * ===============================
 */

(function($, window, doc) {
  'use strict';
  var $adCollection, advertUrl, clean, clearCookie, count, createAds, cssUrl, dfpBlocked, dfpID, dfpIsLoaded, dfpLoader, dfpOptions, dfpScript, dfpSelector, didOpen, displayAds, getCookie, getDimensions, getID, getPopup, init, onCloseCallback, onOpenCallback, rendered, sessionStorageX, setAdvertisingTester, setCookie, setOptions, setResponsiveCss, storeAs;
  sessionStorageX = sessionStorage;
  if (typeof sessionStorageX === 'undefined') {
    sessionStorageX = {
      getItem: function() {},
      setItem: function() {}
    };
  }
  dfpScript = this;
  dfpID = '';
  count = 0;
  rendered = 0;
  dfpSelector = '.gsnsw';
  dfpOptions = {};
  dfpIsLoaded = false;
  $adCollection = void 0;
  storeAs = 'gsnsw';
  cssUrl = 'https://cdn.gsngrocers.com/script/sw2/1.1.0/sw2-override.css';
  advertUrl = 'https://cdn.gsngrocers.com/script/sw2/1.1.0/advertisement.js';
  didOpen = false;
  init = function(id, selector, options) {
    var advert, css;
    setOptions(options);
    css = dfpOptions.cssUrl || cssUrl;
    advert = dfpOptions.advertUrl || advertUrl;
    if (dfpOptions.cancel) {
      onCloseCallback({
        cancel: true
      });
    }
    setResponsiveCss(css);
    setAdvertisingTester(advert);
    if (getCookie('gsnsw2') === null) {
      dfpID = id;
      dfpLoader();
      getPopup(selector);
      Gsn.Advertising.on('clickBrand', function(e) {
        $('.sw-close').click();
      });
    } else {
      onCloseCallback({
        cancel: true
      });
    }
  };
  setResponsiveCss = function(css) {
    var cssTag, el, head;
    el = document.getElementById('respo');
    if (el != null) {
      return;
    }
    head = document.getElementsByTagName('head').item(0);
    cssTag = document.createElement('link');
    cssTag.setAttribute('href', css);
    cssTag.setAttribute('rel', 'stylesheet');
    cssTag.setAttribute('id', 'respo');
    return head.appendChild(cssTag);
  };
  setAdvertisingTester = function(advert) {
    var body, el, scriptTag;
    el = document.getElementById('advertScript');
    if (el != null) {
      return;
    }
    body = document.getElementsByTagName('head').item(0);
    scriptTag = document.createElement('script');
    scriptTag.setAttribute('src', advert);
    scriptTag.setAttribute('id', 'advertScript');
    return body.appendChild(scriptTag);
  };
  onOpenCallback = function(event) {
    didOpen = true;
    setTimeout((function() {
      if (typeof gsnGlobalTester === 'undefined') {
        jQuery('.sw-msg').show();
        jQuery('.sw-header-copy').hide();
        jQuery('.sw-row').hide();
      }
    }), 150);
  };
  onCloseCallback = function(event) {
    $('.sw-pop').remove();
    $('.lean-overlay').remove();
    window.scrollTo(0, 0);
    if (getCookie('gsnsw2') === null) {
      setCookie('gsnsw2', Gsn.Advertising.gsnNetworkId + ',' + Gsn.Advertising.enableCircPlus, 1);
    }
    if (typeof dfpOptions.onClose === 'function') {
      dfpOptions.onClose(didOpen);
    }
  };
  getPopup = function(selector) {
    var dataType, url;
    url = Gsn.Advertising.apiUrl + '/ShopperWelcome/Get/' + Gsn.Advertising.gsnid;
    dataType = 'json';
    if (!!(window.opera && window.opera.version)) {
      if (document.all && !window.atop) {
        url += '?callback=?';
        dataType = 'jsonp';
      }
    }
    $.ajax({
      url: url,
      dataType: dataType,
      success: function(rsp) {
        var body, data, div, evt;
        if (rsp) {
          if (!Gsn.Advertising.gsnNetworkId) {
            Gsn.Advertising.gsnNetworkId = rsp.NetworkId;
          }
          Gsn.Advertising.enableCircPlus = rsp.EnableCircPlus;
          Gsn.Advertising.disableSw = rsp.DisableSw;
          data = rsp.Template;
        }
        dfpID = Gsn.Advertising.getNetworkId();
        evt = {
          data: rsp,
          cancel: false
        };
        dfpOptions.onData(evt);
        if (evt.cancel) {
          data = null;
        }
        if (data) {
          data = data.replace(/%%CACHEBUSTER%%/g, (new Date).getTime()).replace(/%%CHAINID%%/g, Gsn.Advertising.gsnid);
          if (0 === $('#sw').length) {
            body = document.getElementsByTagName('body').item(0);
            div = document.createElement('div');
            div.setAttribute('id', 'sw');
            body.appendChild(div);
          }
          $('#sw').html(clean(data));
          $adCollection = $(selector);
          if ($adCollection) {
            createAds();
            displayAds();
            $('.sw-pop').easyModal({
              autoOpen: true,
              closeOnEscape: false,
              onClose: onCloseCallback,
              onOpen: onOpenCallback,
              top: 25
            });
          }
        } else {
          onCloseCallback({
            cancel: true
          });
        }
      }
    });
  };
  clean = function(data) {
    var template;
    template = $(data.trim());
    $('.remove', template).remove();
    return template.prop('outerHTML');
  };
  getCookie = function(NameOfCookie) {
    var begin, cookieData, cookieDatas, end;
    if (document.cookie.length > 0) {
      begin = document.cookie.indexOf(NameOfCookie + '=');
      end = 0;
      if (begin !== -1) {
        begin += NameOfCookie.length + 1;
        end = document.cookie.indexOf(';', begin);
        if (end === -1) {
          end = document.cookie.length;
        }
        cookieData = decodeURI(document.cookie.substring(begin, end));
        if (cookieData.indexOf(',') > 0) {
          cookieDatas = cookieData.split(',');
          Gsn.Advertising.gsnNetworkId = cookieDatas[0];
          Gsn.Advertising.enableCircPlus = cookieData[1];
          Gsn.Advertising.disableSw = cookieData[2];
        }
        return cookieData;
      }
    }
    return null;
  };
  setCookie = function(NameOfCookie, value, expiredays) {
    var ExpireDate;
    ExpireDate = new Date;
    ExpireDate.setTime(ExpireDate.getTime() + expiredays * 24 * 3600 * 1000);
    document.cookie = NameOfCookie + '=' + encodeURI(value) + (expiredays === null ? '' : '; expires=' + ExpireDate.toGMTString()) + '; path=/';
  };
  clearCookie = function(nameOfCookie) {
    if (nameOfCookie === getCookie(nameOfCookie)) {
      document.cookie = nameOfCookie + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  };
  setOptions = function(options) {
    dfpOptions = {
      setTargeting: {},
      setCategoryExclusion: '',
      setLocation: '',
      enableSingleRequest: false,
      collapseEmptyDivs: true,
      refreshExisting: true,
      disablePublisherConsole: false,
      disableInitialLoad: false,
      noFetch: false
    };
    $.extend(true, dfpOptions, options);
    if (dfpOptions.googletag) {
      window.googletag.cmd.push(function() {
        $.extend(true, window.googletag, dfpOptions.googletag);
      });
    }
  };
  createAds = function() {
    $adCollection.each(function() {
      var $adUnit, $existingContent, adUnitID, dimensions;
      $adUnit = $(this);
      count++;
      adUnitID = getID($adUnit, 'gsnsw', count);
      dimensions = getDimensions($adUnit);
      $existingContent = $adUnit.html();
      $adUnit.html('').addClass('display-none');
      window.googletag.cmd.push(function() {
        var $adUnitData, exclusions, exclusionsGroup, googleAdUnit, targeting, valueTrimmed;
        googleAdUnit = void 0;
        $adUnitData = $adUnit.data(storeAs);
        if ($adUnitData) {
          return;
        }
        dfpID = dfpID.replace(/(\/\/)+/gi, '/').replace(/\s+/gi, '').replace(/(\/)$/, '/');
        if (dfpID.indexOf('/') !== 0) {
          dfpID = '/' + dfpID;
        }
        if ($adUnit.data('outofpage')) {
          googleAdUnit = window.googletag.defineOutOfPageSlot(dfpID, adUnitID).addService(window.googletag.pubads());
        } else {
          googleAdUnit = window.googletag.defineSlot(dfpID, dimensions, adUnitID).addService(window.googletag.pubads());
        }
        targeting = $adUnit.data('targeting');
        if (targeting) {
          if (typeof targeting === 'string') {
            targeting = eval('(' + targeting + ')');
          }
          $.each(targeting, function(k, v) {
            if (k === 'brand') {
              sessionStorageX.setItem('brand', v);
            }
            googleAdUnit.setTargeting(k, v);
          });
        }
        exclusions = $adUnit.data('exclusions');
        if (exclusions) {
          exclusionsGroup = exclusions.split(',');
          valueTrimmed = void 0;
          $.each(exclusionsGroup, function(k, v) {
            valueTrimmed = $.trim(v);
            if (valueTrimmed.length > 0) {
              googleAdUnit.setCategoryExclusion(valueTrimmed);
            }
          });
        }
        googleAdUnit.oldRenderEnded = googleAdUnit.oldRenderEnded || googleAdUnit.renderEnded;
        googleAdUnit.renderEnded = function() {
          var display;
          rendered++;
          display = $adUnit.css('display');
          $adUnit.removeClass('display-none').addClass('display-' + display);
          if (typeof dfpOptions.afterEachAdLoaded === 'function') {
            dfpOptions.afterEachAdLoaded.call(this, $adUnit);
          }
          if (typeof dfpOptions.afterAllAdsLoaded === 'function' && rendered === count) {
            dfpOptions.afterAllAdsLoaded.call(this, $adCollection);
          }
        };
        $adUnit.data(storeAs, googleAdUnit);
      });
    });
    window.googletag.cmd.push(function() {
      var exclusionsGroup, valueTrimmed;
      if (typeof dfpOptions.setTargeting['brand'] === 'undefined') {
        if (sessionStorageX.getItem('brand')) {
          dfpOptions.setTargeting['brand'] = sessionStorageX.getItem('brand');
        }
      }
      if (dfpOptions.enableSingleRequest === true) {
        window.googletag.pubads().enableSingleRequest();
      }
      $.each(dfpOptions.setTargeting, function(k, v) {
        if (k === 'brand') {
          sessionStorageX.setItem('brand', v);
        }
        window.googletag.pubads().setTargeting(k, v);
      });
      if (typeof dfpOptions.setLocation === 'object') {
        if (typeof dfpOptions.setLocation.latitude === 'number' && typeof dfpOptions.setLocation.longitude === 'number' && typeof dfpOptions.setLocation.precision === 'number') {
          window.googletag.pubads().setLocation(dfpOptions.setLocation.latitude, dfpOptions.setLocation.longitude, dfpOptions.setLocation.precision);
        } else if (typeof dfpOptions.setLocation.latitude === 'number' && typeof dfpOptions.setLocation.longitude === 'number') {
          window.googletag.pubads().setLocation(dfpOptions.setLocation.latitude, dfpOptions.setLocation.longitude);
        }
      }
      if (dfpOptions.setCategoryExclusion.length > 0) {
        exclusionsGroup = dfpOptions.setCategoryExclusion.split(',');
        valueTrimmed = void 0;
        $.each(exclusionsGroup, function(k, v) {
          valueTrimmed = $.trim(v);
          if (valueTrimmed.length > 0) {
            window.googletag.pubads().setCategoryExclusion(valueTrimmed);
          }
        });
      }
      if (dfpOptions.collapseEmptyDivs) {
        window.googletag.pubads().collapseEmptyDivs();
      }
      if (dfpOptions.disablePublisherConsole === true) {
        window.googletag.pubads().disablePublisherConsole();
      }
      if (dfpOptions.disableInitialLoad === true) {
        window.googletag.pubads().disableInitialLoad();
      }
      if (dfpOptions.noFetch === true) {
        window.googletag.pubads().noFetch();
      }
      window.googletag.enableServices();
    });
  };
  displayAds = function() {
    var toPush;
    toPush = [];
    $adCollection.each(function() {
      var $adUnit, $adUnitData;
      $adUnit = $(this);
      $adUnitData = $adUnit.data(storeAs);
      if (dfpOptions.refreshExisting && $adUnitData && $adUnit.data('gsnDfpExisting')) {
        toPush.push($adUnitData);
      } else {
        $adUnit.data('gsnDfpExisting', true);
        window.googletag.cmd.push(function() {
          window.googletag.display($adUnit.attr('id'));
        });
      }
    });
    if (toPush.length > 0) {
      window.googletag.cmd.push(function() {
        window.googletag.pubads().refresh(toPush);
      });
    }
  };
  getID = function($adUnit, adUnitName, count) {
    if (!dfpOptions.refreshExisting) {
      $adUnit.data(storeAs, null);
      $adUnit.data('gsnDfpExisting', null);
      if ($adUnit.attr('id')) {
        $adUnit.attr('id', adUnitName + '-auto-gen-id-' + count);
      }
    }
    return $adUnit.attr('id') || $adUnit.attr('id', adUnitName + '-auto-gen-id-' + count).attr('id');
  };
  getDimensions = function($adUnit) {
    var dimensionGroups, dimensions, dimensionsData;
    dimensions = [];
    dimensionsData = $adUnit.data('dimensions');
    if (dimensionsData) {
      dimensionGroups = dimensionsData.split(',');
      $.each(dimensionGroups, function(k, v) {
        var dimensionSet;
        dimensionSet = v.split('x');
        dimensions.push([parseInt(dimensionSet[0], 10), parseInt(dimensionSet[1], 10)]);
      });
    } else {
      dimensions.push([$adUnit.width(), $adUnit.height()]);
    }
    return dimensions;
  };
  dfpLoader = function() {
    var gads, node, useSSL;
    dfpIsLoaded = dfpIsLoaded || $('script[src*="googletagservices.com/tag/js/gpt.js"]').length;
    if (dfpIsLoaded) {
      return;
    }
    window.googletag = window.googletag || {};
    window.googletag.cmd = window.googletag.cmd || [];
    gads = document.createElement('script');
    gads.async = true;
    gads.type = 'text/javascript';
    gads.onerror = function() {
      dfpBlocked();
    };
    useSSL = 'https:' === document.location.protocol;
    gads.src = (useSSL ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js';
    node = document.getElementsByTagName('script')[0];
    node.parentNode.insertBefore(gads, node);
    if (gads.style.display === 'none') {
      dfpBlocked();
    }
  };
  dfpBlocked = function() {
    var commands;
    commands = window.googletag.cmd;
    setTimeout((function() {
      var _defineSlot;
      _defineSlot = function(name, dimensions, id, oop) {
        window.googletag.ads.push(id);
        window.googletag.ads[id] = {
          renderEnded: function() {},
          addService: function() {
            return this;
          }
        };
        return window.googletag.ads[id];
      };
      window.googletag = {
        cmd: {
          push: function(callback) {
            callback.call(dfpScript);
          }
        },
        ads: [],
        pubads: function() {
          return this;
        },
        noFetch: function() {
          return this;
        },
        disableInitialLoad: function() {
          return this;
        },
        disablePublisherConsole: function() {
          return this;
        },
        enableSingleRequest: function() {
          return this;
        },
        setTargeting: function() {
          return this;
        },
        collapseEmptyDivs: function() {
          return this;
        },
        enableServices: function() {
          return this;
        },
        defineSlot: function(name, dimensions, id) {
          return _defineSlot(name, dimensions, id, false);
        },
        defineOutOfPageSlot: function(name, id) {
          return _defineSlot(name, [], id, true);
        },
        display: function(id) {
          window.googletag.ads[id].renderEnded.call(dfpScript);
          return this;
        }
      };
      $.each(commands, function(k, v) {
        window.googletag.cmd.push(v);
      });
    }), 50);
  };

  /**
   * Add function to the jQuery / Zepto / tire namespace
   * @param  String id      (Optional) The DFP account ID
   * @param  Object options (Optional) Custom options to apply
   - network id
   - chain id
   - store id (optional)
   */
  $.gsnSw2 = $.fn.gsnSw2 = function(id, options) {
    var selector;
    options = options || {};
    if (id === void 0) {
      id = dfpID;
    }
    if (typeof id === 'object') {
      options = id;
      id = options.dfpID || dfpID;
    }
    selector = this;
    if (typeof this === 'function') {
      selector = dfpSelector;
    }
    if ($(options.displayWhenExists || '.gsnunit').length) {
      init(id, selector, options);
    }
    return this;
  };
})(window.jQuery || window.Zepto || window.tire, window, document);


/**
 * gsn.easyModal.js v1.0.1
 * A minimal jQuery modal that works with your CSS.
 * Author: Flavius Matis - http://flaviusmatis.github.com/
 * URL: https://github.com/flaviusmatis/easyModal.js
 * Modified: Eric Schmit - GSN
 *========================================================
 */

(function($) {
  'use strict';
  var methods;
  methods = {
    init: function(options) {
      var defaults;
      defaults = {
        top: 'auto',
        autoOpen: false,
        overlayOpacity: 0.5,
        overlayColor: '#000',
        overlayClose: true,
        overlayParent: 'body',
        closeOnEscape: true,
        closeButtonClass: '.close',
        transitionIn: '',
        transitionOut: '',
        onOpen: false,
        onClose: false,
        zIndex: function() {
          return (function(value) {
            if (value === -Infinity) {
              return 0;
            } else {
              return value + 1;
            }
          })(Math.max.apply(Math, $.makeArray($('*').map(function() {
            return $(this).css('z-index');
          }).filter(function() {
            return $.isNumeric(this);
          }).map(function() {
            return parseInt(this, 10);
          }))));
        },
        updateZIndexOnOpen: false,
        adClass: 'gsnsw'
      };
      options = $.extend(defaults, options);
      return this.each(function() {
        var $modal, $overlay, o;
        o = options;
        $overlay = $('<div class="lean-overlay"></div>');
        $modal = $(this);
        $overlay.css({
          'display': 'none',
          'position': 'absolute',
          'z-index': 2147483640,
          'top': 0,
          'left': 0,
          'height': '100%',
          'width': '100%',
          'background': o.overlayColor,
          'opacity': o.overlayOpacity,
          'overflow': 'auto'
        }).appendTo(o.overlayParent);
        $modal.css({
          'display': 'none',
          'position': 'absolute',
          'z-index': 2147483647,
          'left': window.devicePixelRatio >= 2 ? 33 + '%' : 50 + '%',
          'top': parseInt(o.top, 10) > -1 ? o.top + 'px' : 50 + '%'
        });
        $modal.bind('openModal', function() {
          var modalZ, overlayZ;
          overlayZ = o.updateZIndexOnOpen ? o.zIndex() : parseInt($overlay.css('z-index'), 10);
          modalZ = overlayZ + 1;
          if (o.transitionIn !== '' && o.transitionOut !== '') {
            $modal.removeClass(o.transitionOut).addClass(o.transitionIn);
          }
          $modal.css({
            'display': 'block',
            'margin-left': window.devicePixelRatio >= 2 ? 0 : -($modal.outerWidth() / 2) + 'px',
            'margin-top': (parseInt(o.top, 10) > -1 ? 0 : -($modal.outerHeight() / 2)) + 'px',
            'z-index': modalZ
          });
          $overlay.css({
            'z-index': overlayZ,
            'display': 'block'
          });
          if (o.onOpen && typeof o.onOpen === 'function') {
            o.onOpen($modal[0]);
          }
        });
        $modal.bind('closeModal', function() {
          if (o.transitionIn !== '' && o.transitionOut !== '') {
            $modal.removeClass(o.transitionIn).addClass(o.transitionOut);
            $modal.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
              $modal.css('display', 'none');
              $overlay.css('display', 'none');
            });
          } else {
            $modal.css('display', 'none');
            $overlay.css('display', 'none');
          }
          if (o.onClose && typeof o.onClose === 'function') {
            o.onClose($modal[0]);
          }
        });
        $overlay.click(function() {
          if (o.overlayClose) {

          } else {

          }
        });
        $(document).keydown(function(e) {
          if (o.closeOnEscape && e.keyCode === 27) {
            $modal.trigger('closeModal');
          }
        });
        $modal.on('click', o.adClass, function(e) {
          $modal.trigger('closeModal');
          e.preventDefault();
        });
        $modal.on('click', o.closeButtonClass, function(e) {
          $modal.trigger('closeModal');
          e.preventDefault();
        });
        if (o.autoOpen) {
          $modal.trigger('openModal');
        }
      });
    }
  };
  $.fn.easyModal = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    }
    $.error('Method ' + method + ' does not exist on jQuery.easyModal');
  };
})(window.jQuery || window.Zepto || window.tire);


/*!
 *  Project: gsnevent triggering
 * ===============================
 */


/* Usage:
 *   For Publisher:
 *         Gsn.Advertising.clickBrickOffer(clickTrackingUrl, 69);
#
 *   For Consumer:
 *         Gsn.Advertising.on('clickBrickOffer', function(evt)) { alert(evt.OfferCode); });
#
 * The following events are currently available: clickProduct, clickPromotion, clickBrand, clickBrickOffer, clickRecipe, and clickLink
 */

(function(oldGsn, win, doc, gsnContext, gsnDfp, gsnSw2, circplus, trakless) {
  var Plugin, buildQueryString, createFrame, myGsn, myPlugin, oldGsnAdvertising, tickerFrame;
  tickerFrame = void 0;
  myGsn = oldGsn || {};
  oldGsnAdvertising = myGsn.Advertising;
  if (typeof oldGsnAdvertising !== 'undefined') {
    if (oldGsnAdvertising.pluginLoaded) {
      return;
    }
  }
  createFrame = function() {
    var tempIFrame;
    if (typeof tickerFrame === 'undefined') {
      tempIFrame = doc.createElement('iframe');
      tempIFrame.setAttribute('id', 'gsnticker');
      tempIFrame.style.position = 'absolute';
      tempIFrame.style.top = '-9999em';
      tempIFrame.style.left = '-9999em';
      tempIFrame.style.zIndex = '99';
      tempIFrame.style.border = '0px';
      tempIFrame.style.width = '0px';
      tempIFrame.style.height = '0px';
      tickerFrame = doc.body.appendChild(tempIFrame);
      if (doc.frames) {
        tickerFrame = doc.frames['gsnticker'];
      }
    }
  };
  Plugin = (function() {
    function Plugin() {}

    Plugin.prototype.pluginLoaded = true;

    Plugin.prototype.defaultActionParam = {
      page: void 0,
      evtname: '',
      dept: void 0,
      deviceid: '',
      storeid: '',
      consumerid: '',
      isanon: false,
      loyaltyid: '',
      aisle: '',
      category: '',
      shelf: '',
      brand: '',
      pcode: '',
      pdesc: '',
      latlng: [0, 0],
      evtcategory: '',
      evtvalue: 0
    };

    Plugin.prototype.translator = {
      siteid: 'sid',
      page: 'pg',
      evtname: 'en',
      dept: 'dpt',
      deviceid: 'dvc',
      storeid: 'str',
      consumerid: 'cust',
      isanon: 'isa',
      loyaltyid: 'loy',
      aisle: 'asl',
      category: 'cat',
      shelf: 'shf',
      brand: 'brd',
      pcode: 'pcd',
      pdesc: 'pds',
      latlng: 'latlng',
      evtcategory: 'ec',
      evtvalue: 'ev'
    };

    Plugin.prototype.isDebug = false;

    Plugin.prototype.gsnid = 0;

    Plugin.prototype.selector = 'body';

    Plugin.prototype.apiUrl = 'https://clientapi.gsn2.com/api/v1';

    Plugin.prototype.gsnNetworkId = void 0;

    Plugin.prototype.gsnNetworkStore = void 0;

    Plugin.prototype.onAllEvents = void 0;

    Plugin.prototype.oldGsnAdvertising = oldGsnAdvertising;

    Plugin.prototype.minSecondBetweenRefresh = 5;

    Plugin.prototype.enableCircPlus = false;

    Plugin.prototype.disableSw = '';

    Plugin.prototype.source = '';

    Plugin.prototype.targetting = {};

    Plugin.prototype.depts = [];

    Plugin.prototype.circPlusBody = void 0;

    Plugin.prototype.refreshExisting = {
      circPlus: false,
      pods: false
    };

    Plugin.prototype.circPlusDept = void 0;

    Plugin.prototype.timer = void 0;


    /**
     * get network id
    #
     * @return {Object}
     */

    Plugin.prototype.getNetworkId = function() {
      var self;
      self = this;
      return self.gsnNetworkId + ((self.source || "").length > 0 ? "." + self.source : "");
    };


    /**
     * trigger a gsnevent
    #
     * @param {String} en - event name
     * @param {Object} ed - event data
     * @return {Object}
     */

    Plugin.prototype.trigger = function(en, ed) {
      if (en.indexOf('gsnevent') < 0) {
        en = 'gsnevent:' + en;
      }
      win.setTimeout((function() {
        trakless.util.trigger(en, {
          type: en,
          detail: ed
        });
        if (typeof this.onAllEvents === 'function') {
          this.onAllEvents({
            type: en,
            detail: ed
          });
        }
      }), 100);
      return this;
    };


    /**
     * listen to a gsnevent
    #
     * @param {String} en - event name
     * @param {Function} cb - callback
     * @return {Object}
     */

    Plugin.prototype.on = function(en, cb) {
      if (en.indexOf('gsnevent') < 0) {
        en = 'gsnevent:' + en;
      }
      trakless.util.on(en, cb);
      return this;
    };


    /**
     * detach from event
    #
     * @param {String} en - event name
     * @param {Function} cb - cb
     * @return {Object}
     */

    Plugin.prototype.off = function(en, cb) {
      if (en.indexOf('gsnevent') < 0) {
        en = 'gsnevent:' + en;
      }
      trakless.util.off(en, cb);
      return this;
    };

    Plugin.prototype.log = function(message) {
      var self;
      self = myGsn.Advertising;
      if (self.isDebug && console) {
        console.log(message);
      }
      return this;
    };


    /**
     * trigger action tracking
    #
     * @param {String} actionParam
     * @return {Object}
     */

    Plugin.prototype.trackAction = function(actionParam) {
      var i, k, len, self, traker, translatedParam, v;
      self = myGsn.Advertising;
      translatedParam = {};
      if (actionParam != null) {
        for (k = i = 0, len = actionParam.length; i < len; k = ++i) {
          v = actionParam[k];
          translatedParam[self.translator[k]] = v;
        }
        traker = trakless.getDefaultTracker();
        traker.track('gsn', translatedParam);
      }
      self.log(trakless.util.stringToJSON(actionParam));
      return this;
    };


    /**
     * utility method to normalize category
    #
     * @param {String} keyword
     * @return {String}
     */

    Plugin.prototype.cleanKeyword = function(keyword) {
      var result;
      result = keyword.replace(/[^a-zA-Z0-9]+/gi, '_').replace(/^[_]+/gi, '');
      if (result.toLowerCase != null) {
        result = result.toLowerCase();
      }
      return result;
    };


    /**
     * add a dept
    #
     * @param {String} dept
     * @return {Object}
     */

    Plugin.prototype.addDept = function(dept) {
      var depts, goodDepts, i, len, oldDepts, self;
      self = myGsn.Advertising;
      if (dept != null) {
        oldDepts = self.depts;
        depts = [];
        goodDepts = {};
        depts.push(self.cleanKeyword(dept));
        goodDepts[depts[0]] = 1;
        self.circPlusDept = depts[0];
        for (i = 0, len = oldDepts.length; i < len; i++) {
          dept = oldDepts[i];
          if (goodDepts[dept] == null) {
            depts.push(dept);
          }
          goodDepts[dept] = 1;
        }
        while (depts.length > 5) {
          depts.pop();
        }
        self.depts = depts;
      }
      return this;
    };


    /**
     * fire a tracking url
    #
     * @param {String} url
     * @return {Object}
     */

    Plugin.prototype.ajaxFireUrl = function(url) {
      if (typeof url === 'string') {
        if (url.length < 10) {
          return;
        }
        url = url.replace('%%CACHEBUSTER%%', (new Date).getTime());
        createFrame();
        tickerFrame.src = url;
      }
      return this;
    };


    /**
     * Trigger when a product is clicked.  AKA: clickThru
    #
     */

    Plugin.prototype.clickProduct = function(click, categoryId, brandName, productDescription, productCode, quantity, displaySize, regularPrice, currentPrice, savingsAmount, savingsStatement, adCode, creativeId) {
      this.ajaxFireUrl(click);
      this.trigger('clickProduct', {
        myPlugin: this,
        CategoryId: categoryId,
        BrandName: brandName,
        Description: productDescription,
        ProductCode: productCode,
        DisplaySize: displaySize,
        RegularPrice: regularPrice,
        CurrentPrice: currentPrice,
        SavingsAmount: savingsAmount,
        SavingsStatement: savingsStatement,
        AdCode: adCode,
        CreativeId: creativeId,
        Quantity: quantity || 1
      });
      return this;
    };


    /**
     * Trigger when a brick offer is clicked.  AKA: brickRedirect
    #
     */

    Plugin.prototype.clickBrickOffer = function(click, offerCode, checkCode) {
      this.ajaxFireUrl(click);
      this.trigger('clickBrickOffer', {
        myPlugin: this,
        OfferCode: offerCode || 0
      });
      return this;
    };


    /**
     * Trigger when a brand offer or shopper welcome is clicked.
    #
     */

    Plugin.prototype.clickBrand = function(click, brandName) {
      this.ajaxFireUrl(click);
      this.setBrand(brandName);
      this.trigger('clickBrand', {
        myPlugin: this,
        BrandName: brandName
      });
      return this;
    };


    /**
     * Trigger when a promotion is clicked.  AKA: promotionRedirect
    #
     */

    Plugin.prototype.clickPromotion = function(click, adCode) {
      this.ajaxFireUrl(click);
      this.trigger('clickPromotion', {
        myPlugin: this,
        AdCode: adCode
      });
      return this;
    };


    /**
     * Trigger when a recipe is clicked.  AKA: recipeRedirect
    #
     */

    Plugin.prototype.clickRecipe = function(click, recipeId) {
      this.ajaxFireUrl(click);
      this.trigger('clickRecipe', {
        RecipeId: recipeId
      });
      return this;
    };


    /**
     * Trigger when a generic link is clicked.  AKA: verifyClickThru
    #
     */

    Plugin.prototype.clickLink = function(click, url, target) {
      if (target === void 0 || target === '') {
        target = '_top';
      }
      this.ajaxFireUrl(click);
      this.trigger('clickLink', {
        myPlugin: this,
        Url: url,
        Target: target
      });
      return this;
    };


    /**
     * set the brand for the session
    #
     */

    Plugin.prototype.setBrand = function(brandName) {
      trakless.util.session('gsndfp:brand', brandName);
      return this;
    };


    /**
     * get the brand currently in session
    #
     */

    Plugin.prototype.getBrand = function() {
      return trakless.util.session('gsndfp:brand');
    };


    /**
     * handle a dom event
    #
     */

    Plugin.prototype.actionHandler = function(evt) {
      var allData, elem, i, k, len, payLoad, realk, self, v;
      self = myGsn.Advertising;
      elem = evt.target ? evt.target : evt.srcElement;
      payLoad = {};
      if (elem != null) {
        allData = trakless.util.allData(elem);
        for (v = i = 0, len = allData.length; i < len; v = ++i) {
          k = allData[v];
          if (!(/^gsn/gi.test(k))) {
            continue;
          }
          realk = /^gsn/i.replace(k, '').toLowerCase();
          payLoad[realk] = v;
        }
      }
      self.refresh(payLoad);
      return self;
    };


    /**
     * internal method for refreshing adpods
    #
     */

    Plugin.prototype.refreshAdPodsInternal = function(actionParam, forceRefresh) {
      var canRefresh, lastRefreshTime, payLoad, self, targetting;
      self = myGsn.Advertising;
      payLoad = trakless.util.applyDefaults(actionParam, self.defaultActionParam);
      payLoad.siteid = self.gsnid;
      self.trackAction(payLoad);
      canRefresh = lastRefreshTime <= 0 || ((new Date).getTime() / 1000 - lastRefreshTime) >= self.minSecondBetweenRefresh;
      if (forceRefresh || canRefresh) {
        lastRefreshTime = (new Date()).getTime() / 1000;
        self.addDept(payLoad.dept);
        if (forceRefresh) {
          self.refreshExisting.pods = false;
          self.refreshExisting.circPlus = false;
        }
        targetting = {
          dept: self.depts || [],
          brand: self.getBrand()
        };
        if (payLoad.page) {
          targetting.kw = payLoad.page.replace(/[^a-z]/gi, '');
        }
        gsnDfp({
          dfpID: self.getNetworkId().replace(/\/$/gi, '') + (self.gsnNetworkStore || ''),
          setTargeting: targetting,
          refreshExisting: self.refreshExisting.pods
        });
        self.refreshExisting.pods = true;
        if (self.enableCircPlus) {
          targetting.dept = [self.circPlusDept || 'produce'];
          circPlus({
            dfpID: self.getNetworkId().replace(/\/$/gi, '') + (self.gsnNetworkStore || ''),
            setTargeting: targetting,
            circPlusBody: self.circPlusBody,
            refreshExisting: self.refreshExisting.circPlus
          });
          self.refreshExisting.circPlus = true;
        }
      }
      return this;
    };


    /**
     * adpods refresh
    #
     */

    Plugin.prototype.refresh = function(actionParam, forceRefresh) {
      var self;
      self = myGsn.Advertising;
      if (!self.hasGsnUnit()) {
        return self;
      }
      if (self.gsnid) {
        gsnSw2({
          displayWhenExists: '.gsnadunit,.gsnunit',
          onData: function(evt) {
            if ((self.source || '').length > 0) {
              return evt.cancel = self.disableSw.indexOf(self.source) > 0;
            }
          },
          onClose: function() {
            if (self.selector != null) {
              trakless.util.onClick(self.selector, self.actionHandler, '.gsnaction');
              self.selector = null;
            }
            return self.refreshAdPodsInternal(actionParam, forceRefresh);
          }
        });
      }
      return this;
    };


    /**
     * determine if there are adpods on the page
    #
     */

    Plugin.prototype.hasGsnUnit = function() {
      return trakless.util.$('.gsnadunit,.gsnunit,.circplus').length > 0;
    };


    /**
     * set global defaults
    #
     */

    Plugin.prototype.setDefault = function(defaultParam) {
      var self;
      self = myGsn.Advertising;
      self.defaultActionParam = trakless.util.applyDefaults(defaultParam, self.defaultActionParam);
      return this;
    };


    /**
     * method for support refreshing with timer
    #
     */

    Plugin.prototype.refreshWithTimer = function(actionParam) {
      var self, timer;
      self = myGsn.Advertising;
      if (actionParam == null) {
        actionParam = {
          evtname: 'refresh-timer'
        };
      }
      self.refresh(actionParam, true);
      timer = (self.timer || 0) * 1000;
      if (timer > 0) {
        setTimeout(self.refreshWithTimer, timer);
      }
      return this;
    };


    /**
     * the onload method, document ready friendly
    #
     */

    Plugin.prototype.load = function(gsnid, isDebug) {
      var self;
      self = myGsn.Advertising;
      if (gsnid) {
        self.gsnid = gsnid;
        if (!self.isDebug) {
          self.isDebug = isDebug;
        }
      }
      return self.refreshWithTimer({
        evtname: 'loading'
      });
    };

    return Plugin;

  })();
  myPlugin = new Plugin;
  myGsn.Advertising = myPlugin;
  myGsn.Advertising.brickRedirect = myPlugin.clickBrickOffer;
  myGsn.Advertising.clickBrand = myPlugin.clickBrand;
  myGsn.Advertising.clickThru = myPlugin.clickProduct;
  myGsn.Advertising.refreshAdPods = myPlugin.refresh;
  myGsn.Advertising.logAdImpression = function() {};
  myGsn.Advertising.logAdRequest = function() {};
  myGsn.Advertising.promotionRedirect = myPlugin.clickPromotion;
  myGsn.Advertising.verifyClickThru = myPlugin.clickLink;
  myGsn.Advertising.recipeRedirect = myPlugin.clickRecipe;
  win.Gsn = myGsn;
  buildQueryString = function(keyWord, keyValue) {
    if (keyValue !== null) {
      keyValue = new String(keyValue);
      if (keyWord !== 'ProductDescription') {
        keyValue = keyValue.replace(/&/, '`');
      }
      return keyWord + '=' + keyValue.toString();
    } else {
      return '';
    }
  };
  if ((gsnContext != null)) {
    myGsn.Advertising.on('clickRecipe', function(data) {
      if (data.type !== 'gsnevent:clickRecipe') {
        return;
      }
      win.location.replace('/Recipes/RecipeFull.aspx?recipeid=' + data.detail.RecipeId);
    });
    myGsn.Advertising.on('clickProduct', function(data) {
      var product, queryString;
      if (data.type !== 'gsnevent:clickProduct') {
        return;
      }
      product = data.detail;
      if (product) {
        queryString = new String('');
        queryString += buildQueryString('DepartmentID', product.CategoryId);
        queryString += '~';
        queryString += buildQueryString('BrandName', product.BrandName);
        queryString += '~';
        queryString += buildQueryString('ProductDescription', product.Description);
        queryString += '~';
        queryString += buildQueryString('ProductCode', product.ProductCode);
        queryString += '~';
        queryString += buildQueryString('DisplaySize', product.DisplaySize);
        queryString += '~';
        queryString += buildQueryString('RegularPrice', product.RegularPrice);
        queryString += '~';
        queryString += buildQueryString('CurrentPrice', product.CurrentPrice);
        queryString += '~';
        queryString += buildQueryString('SavingsAmount', product.SavingsAmount);
        queryString += '~';
        queryString += buildQueryString('SavingsStatement', product.SavingsStatement);
        queryString += '~';
        queryString += buildQueryString('Quantity', product.Quantity);
        queryString += '~';
        queryString += buildQueryString('AdCode', product.AdCode);
        queryString += '~';
        queryString += buildQueryString('CreativeID', product.CreativeId);
        if (typeof AddAdToShoppingList === 'function') {
          AddAdToShoppingList(queryString);
        }
      }
    });
    myGsn.Advertising.on('clickLink', function(data) {
      var linkData;
      if (data.type !== 'gsnevent:clickLink') {
        return;
      }
      linkData = data.detail;
      if (linkData) {
        if (linkData.Target === void 0 || linkData.Target === '') {
          linkData.Target = '_top';
        }
        if (linkData.Target === '_blank') {
          win.open(linkData.Url);
        } else {
          win.location.replace(linkData.Url);
        }
      }
    });
    myGsn.Advertising.on('clickPromotion', function(data) {
      var linkData;
      if (data.type !== 'gsnevent:clickPromotion') {
        return;
      }
      linkData = data.detail;
      if (linkData) {
        win.location.replace('/Ads/Promotion.aspx?adcode=' + linkData.AdCode);
      }
    });
    return myGsn.Advertising.on('clickBrickOffer', function(data) {
      var linkData, url;
      if (data.type !== 'gsnevent:clickBrickOffer') {
        return;
      }
      linkData = data.detail;
      if (linkData) {
        url = myGsn.Advertising.apiUrl + '/profile/BrickOffer/' + gsnContext.ConsumerID + '/' + linkData.OfferCode;
        win.open(url, '');
      }
    });
  }
})(window.Gsn || {}, window, document, window.GSNContext, $.gsnDfp, $.gsnSw2, $.circplus, trakless);

(function(trakless) {
  var aPlugin, attrs, fn, i, j, k, len, len1, prefix, ref, ref1, script;
  aPlugin = Gsn.Advertising;
  if (!aPlugin) {
    return;
  }
  attrs = {
    debug: function(value) {
      if (typeof value !== "string") {
        return;
      }
      return aPlugin.isDebug = value !== "false";
    },
    api: function(value) {
      if (typeof value !== "string") {
        return;
      }
      return aPlugin.apiUrl = value;
    },
    source: function(value) {
      if (typeof value !== "string") {
        return;
      }
      return aPlugin.source = value;
    },
    gsnid: function(value) {
      if (!value) {
        return;
      }
      aPlugin.gsnid = value;
      return trakless.setSiteId(value);
    },
    timer: function(value) {
      if (!value) {
        return;
      }
      return aPlugin.timer = value;
    },
    selector: function(value) {
      if (typeof value !== "string") {
        return;
      }
      return aPlugin.selector = value;
    }
  };
  ref = document.getElementsByTagName("script");
  for (i = 0, len = ref.length; i < len; i++) {
    script = ref[i];
    if (/gsndfp/i.test(script.src)) {
      ref1 = ['', 'data-'];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        prefix = ref1[j];
        for (k in attrs) {
          fn = attrs[k];
          fn(script.getAttribute(prefix + k));
        }
      }
    }
  }
  trakless.setPixel('//pi.gsngrocers.com/pi.gif');
  if (aPlugin.hasGsnUnit()) {
    aPlugin.load();
  } else {
    trakless.util.ready(function() {
      return aPlugin.load();
    });
  }
})(window.trakless);
