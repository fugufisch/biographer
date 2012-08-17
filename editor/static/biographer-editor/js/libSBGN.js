(function(){function f(a){throw a;}var h=!0,i=null,j=!1,k=this;
function aa(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b}function l(a){return void 0!==a}function m(a){return"string"==typeof a}function n(a,b){var c=a.split("."),d=k;!(c[0]in d)&&d.execScript&&d.execScript("var "+c[0]);for(var e;c.length&&(e=c.shift());)!c.length&&l(b)?d[e]=b:d=d[e]?d[e]:d[e]={}}function o(a,b){function c(){}c.prototype=b.prototype;a.N=b.prototype;a.prototype=new c};function p(a,b){for(var c in a)if(a[c]==b)return h;return j}function ba(a){for(var b in a)return j;return h}function ca(a){"data"in a&&delete a.data}function da(){var a=q,b={},c;for(c in a)b[a[c]]=c;return b};var t={};n("sb.NodeType",t);t.UnspecifiedEntity="unspecified entity";t.SimpleChemical="simple chemical";t.Macromolecule="macromolecule";t.NucleicAcidFeature="nucleic acid feature";t.SimpleChemicalMultimer="simple chemical multimer";t.MacromoleculeMultimer="macromolecule multimer";t.NucleicAcidFeatureMultimer="nucleic acid feature multimer";t.Complex="complex";t.ComplexMultimer="complex multimer";t.SourceAndSink="source and sink";t.Perturbation="perturbation";t.BiologicalActivity="biological activity";
t.PerturbingAgent="perturbing agent";t.Compartment="compartment";t.Submap="submap";t.Tag="tag";t.Terminal="terminal";t.Process="process";t.OmittedProcess="omitted process";t.UncertainProcess="uncertain process";t.Association="association";t.Dissociation="dissociation";t.Phenotype="phenotype";t.And="and";t.Or="or";t.Not="not";t.StateVariable="state variable";t.UnitOfInformation="unit of information";t.Stoichiometry="stoichiometry";t.Entity="entity";t.Outcome="outcome";t.Observable="observable";
t.Interaction="interaction";t.InfluenceTarget="influence target";t.Annotation="annotation";t.VariableValue="variable value";t.ImplicitXor="implicit xor";t.Delay="delay";t.Existence="existence";t.Location="location";t.Cardinality="cardinality";function ea(a){return p(t,a)}n("sb.NodeTypeHelper.isNodeTypeSupported",ea);function fa(a){for(var b=0,c=(""+ga).replace(/^[\s\xa0]+|[\s\xa0]+$/g,"").split("."),a=(""+a).replace(/^[\s\xa0]+|[\s\xa0]+$/g,"").split("."),d=Math.max(c.length,a.length),e=0;0==b&&e<d;e++){var g=c[e]||"",S=a[e]||"",r=RegExp("(\\d*)(\\D*)","g"),A=RegExp("(\\d*)(\\D*)","g");do{var s=r.exec(g)||["","",""],u=A.exec(S)||["","",""];if(0==s[0].length&&0==u[0].length)break;b=((0==s[1].length?0:parseInt(s[1],10))<(0==u[1].length?0:parseInt(u[1],10))?-1:(0==s[1].length?0:parseInt(s[1],10))>(0==u[1].length?
0:parseInt(u[1],10))?1:0)||((0==s[2].length)<(0==u[2].length)?-1:(0==s[2].length)>(0==u[2].length)?1:0)||(s[2]<u[2]?-1:s[2]>u[2]?1:0)}while(0==b)}return b};var v=Array.prototype,ha=v.indexOf?function(a,b,c){return v.indexOf.call(a,b,c)}:function(a,b,c){c=c==i?0:0>c?Math.max(0,a.length+c):c;if(m(a))return!m(b)||1!=b.length?-1:a.indexOf(b,c);for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},w=v.forEach?function(a,b,c){v.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=m(a)?a.split(""):a,g=0;g<d;g++)g in e&&b.call(c,e[g],g,a)},ia=v.filter?function(a,b,c){return v.filter.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=[],g=0,S=m(a)?a.split(""):
a,r=0;r<d;r++)if(r in S){var A=S[r];b.call(c,A,r,a)&&(e[g++]=A)}return e};function ja(a,b){a:for(var c=["jsbgn","sbgn-ml","sbml"],d=c.length,e=m(c)?c.split(""):c,g=0;g<d;g++)if(g in e&&a.call(b,e[g],g,c))break a}function ka(a,b){return 0<=ha(a,b)}function x(a,b){ka(a,b)||a.push(b)};function y(a,b){this.h={};this.c=[];var c=arguments.length;if(1<c){c%2&&f(Error("Uneven number of arguments"));for(var d=0;d<c;d+=2)this.set(arguments[d],arguments[d+1])}else if(a){var e;if(a instanceof y){la(a);d=a.c.concat();la(a);e=[];for(c=0;c<a.c.length;c++)e.push(a.h[a.c[c]])}else{var c=[],g=0;for(d in a)c[g++]=d;d=c;c=[];g=0;for(e in a)c[g++]=a[e];e=c}for(c=0;c<d.length;c++)this.set(d[c],e[c])}}y.prototype.l=0;
y.prototype.remove=function(a){return Object.prototype.hasOwnProperty.call(this.h,a)?(delete this.h[a],this.l--,this.c.length>2*this.l&&la(this),h):j};function la(a){if(a.l!=a.c.length){for(var b=0,c=0;b<a.c.length;){var d=a.c[b];Object.prototype.hasOwnProperty.call(a.h,d)&&(a.c[c++]=d);b++}a.c.length=c}if(a.l!=a.c.length){for(var e={},c=b=0;b<a.c.length;)d=a.c[b],Object.prototype.hasOwnProperty.call(e,d)||(a.c[c++]=d,e[d]=1),b++;a.c.length=c}}
y.prototype.get=function(a,b){return Object.prototype.hasOwnProperty.call(this.h,a)?this.h[a]:b};y.prototype.set=function(a,b){Object.prototype.hasOwnProperty.call(this.h,a)||(this.l++,this.c.push(a));this.h[a]=b};y.prototype.z=function(){return new y(this)};function z(){this.k=new y}n("sb.model.AttributeObject",z);z.prototype.a=function(a,b,c){if(l(b)){var d=this.k.get(a);this.k.set(a,b);c&&"id"==a&&(d&&c.u.remove(d),c.u.set(b,this));return this}return this.k.get(a)};z.prototype.attr=z.prototype.a;function B(a){this.k=new y;this.b=a;this.t=[];this.n=i}o(B,z);n("sb.model.Element",B);B.prototype.id=function(a){if(l(a)){var b=this.b.element(a);b&&b!=this&&f(Error("Given element id "+a+" already existed"))}return this.a("id",a,this.b)};B.prototype.id=B.prototype.id;B.prototype.d=function(a){a.n&&a.n.removeChild(a);x(this.t,a);a.n=this};B.prototype.addChild=B.prototype.d;B.prototype.removeChild=function(a){var b=this.t,c=ha(b,a);0<=c&&v.splice.call(b,c,1);a.n=i};B.prototype.removeChild=B.prototype.removeChild;
B.prototype.children=function(){return this.t};B.prototype.children=B.prototype.children;B.prototype.parent=function(){return this.n};B.prototype.parent=B.prototype.parent;function C(a){B.call(this,a)}o(C,B);n("sb.Port",C);function D(a){B.call(this,a)}o(D,B);n("sb.Node",D);D.prototype.type=function(a){l(a)&&!ea(a)&&f(Error("Given node type "+a+" is not supported."));return this.a("type",a)};D.prototype.type=D.prototype.type;D.prototype.label=function(a){return this.a("label",a)};D.prototype.label=D.prototype.label;D.prototype.q=function(a){a=this.b.createNode(a);this.d(a);return a};D.prototype.createSubNode=D.prototype.q;D.prototype.g=function(a){a=this.b.g(a);this.d(a);return a};D.prototype.createPort=D.prototype.g;var E={};n("sb.ArcType",E);E.Production="production";E.Consumption="consumption";E.Catalysis="catalysis";E.Modulation="modulation";E.Stimulation="stimulation";E.Inhibition="inhibition";E.Assignment="assignment";E.Interaction="interaction";E.AbsoluteInhibition="absolute inhibition";E.AbsoluteStimulation="absolute stimulation";E.PositiveInfluence="positive influence";E.NegativeInfluence="negative influence";E.UnknownInfluence="unknown influence";E.EquivalenceArc="equivalence arc";
E.NecessaryStimulation="necessary stimulation";E.LogicArc="logic arc";function ma(a){return p(E,a)}n("sb.ArcTypeHelper.isArcTypeSupported",ma);function F(a){B.call(this,a)}o(F,B);n("sb.Arc",F);F.prototype.type=function(a){l(a)&&!ma(a)&&f(Error("Given arc type "+a+" is not supported."));return this.a("type",a)};F.prototype.type=F.prototype.type;F.prototype.source=function(a){if(a&&m(a)){var b=this.b.element(a);b||f(Error("Element "+a+" do not exist."));a=b}return this.a("source",a)};F.prototype.source=F.prototype.source;
F.prototype.target=function(a){if(a&&m(a)){var b=this.b.element(a);b||f(Error("Element "+a+" do not exist."));a=b}return this.a("target",a)};F.prototype.target=F.prototype.target;F.prototype.g=function(a){a=this.b.g(a);this.d(a);return a};F.prototype.createPort=F.prototype.g;function na(a){B.call(this,a)}o(na,B);n("sb.ArcGroup",na);function G(a){this.k=new y;this.id=a;this.I=this.B=this.H=1;this.u=new y;this.w=[];this.o=[];this.J=[]}o(G,z);n("sb.Document",G);G.prototype.createNode=function(a){a=a?a:oa(this);a=(new D(this)).id(a);x(this.w,a);return a};G.prototype.createNode=G.prototype.createNode;function oa(a){var b="node"+a.H++;return a.element(b)?oa(a):b}G.prototype.v=function(a){return a?ia(this.w,function(a){return a.parent()?j:h}):this.w};G.prototype.nodes=G.prototype.v;
G.prototype.r=function(a){a=this.element(a);return a instanceof D?a:i};G.prototype.node=G.prototype.r;G.prototype.element=function(a){return this.u.get(a)};G.prototype.e=function(a){a=a?a:pa(this);a=(new F(this)).id(a);x(this.o,a);return a};G.prototype.createArc=G.prototype.e;G.prototype.F=function(a,b){var c=this.e();c.source(a).target(b);return c};G.prototype.connect=G.prototype.F;function pa(a){var b="arc"+a.B++;return a.element(b)?pa(a):b}G.prototype.C=function(){return this.o};
G.prototype.arcs=G.prototype.C;G.prototype.arc=function(a){a=this.element(a);return a instanceof F?a:i};G.prototype.arc=G.prototype.arc;function qa(a){var b="port"+a.I++;return a.element(b)?qa(a):b}G.prototype.g=function(a){a=a?a:qa(this);a=(new C(this)).id(a);x(this.J,a);return a};G.prototype.createPort=G.prototype.g;G.prototype.lang=function(a){l(a)&&!p(ra,a)&&f(Error("Given SBGN language type "+a+" is not supported."));return this.a("language",a)};
var ra={K:"activity flow",L:"entity relationship",M:"process description"};n("sb.Language",ra);function H(a,b){this.x=l(a)?a:0;this.y=l(b)?b:0}n("sb.Point",H);H.prototype.z=function(){return new H(this.x,this.y)};H.prototype.clone=H.prototype.z;function I(a,b,c,d){this.x=l(a)?a:0;this.y=l(b)?b:0;this.width=l(c)?c:0;this.height=l(d)?d:0}n("sb.Box",I);I.prototype.contains=function(a){return a.x>=this.x&&a.y>=this.y&&this.x+this.width>=a.x+a.width&&this.y+this.height>=a.y+a.height};var J,sa,K,ta;function ua(){return k.navigator?k.navigator.userAgent:i}ta=K=sa=J=j;var L;if(L=ua()){var va=k.navigator;J=0==L.indexOf("Opera");sa=!J&&-1!=L.indexOf("MSIE");K=!J&&-1!=L.indexOf("WebKit");ta=!J&&!K&&"Gecko"==va.product}var M=sa,wa=ta,xa=K,ga;
a:{var N="",O;if(J&&k.opera)var ya=k.opera.version,N="function"==typeof ya?ya():ya;else if(wa?O=/rv\:([^\);]+)(\)|;)/:M?O=/MSIE\s+([^\);]+)(\)|;)/:xa&&(O=/WebKit\/(\S+)/),O)var za=O.exec(ua()),N=za?za[1]:"";if(M){var Aa,Ba=k.document;Aa=Ba?Ba.documentMode:void 0;if(Aa>parseFloat(N)){ga=""+Aa;break a}}ga=N}var P={},Ca={};function Da(){return Ca[9]||(Ca[9]=M&&!!document.documentMode&&9<=document.documentMode)};!M||Da();var Ea=!wa&&!M||M&&Da()||wa&&(P["1.9.1"]||(P["1.9.1"]=0<=fa("1.9.1")));M&&(P["9"]||(P["9"]=0<=fa("9")));function Fa(a){return Ea&&void 0!=a.children?a.children:ia(a.childNodes,function(a){return 1==a.nodeType})};function Ga(){if(document.implementation&&document.implementation.createDocument)return document.implementation.createDocument("","",i);if("undefined"!=typeof ActiveXObject){var a=Ha();if(a)return a}f(Error("Your browser does not support creating new documents"))}function Q(a){if("undefined"!=typeof XMLSerializer)return(new XMLSerializer).serializeToString(a);if(a=a.xml)return a;f(Error("Your browser does not support serializing XML documents"))}
function Ha(){var a=new ActiveXObject("MSXML2.DOMDocument");if(a){a.resolveExternals=j;a.validateOnParse=j;try{a.setProperty("ProhibitDTD",h),a.setProperty("MaxXMLSize",2048),a.setProperty("MaxElementDepth",256)}catch(b){}}return a};function Ia(){}function Ja(a){"\ufeff"==a.charAt(0)&&(a=a.substr(1,a.length));new y;var b;"undefined"!=typeof DOMParser?b=(new DOMParser).parseFromString(a,"application/xml"):"undefined"!=typeof ActiveXObject?(b=Ha(),b.loadXML(a)):f(Error("Your browser does not support loading xml documents"));return b}function Ka(a,b){La(a,b);w(b.childNodes,function(a){1==a.nodeType&&Ka(this,a)},a);Ma(a,b)};function R(){this.p=[]}R.prototype.push=function(a){this.p.push(a)};R.prototype.pop=function(){return this.p.pop()};function T(){this.i=this.b=this.m=this.f=i}o(T,Ia);n("sb.io.SbgnReader",T);T.prototype.j=function(a){this.f=new R;this.b=new G;this.i=[];this.m=[];a=Ja(a);"sbgn"!=a.documentElement.tagName.toLowerCase()&&f("sbgn format error, root element is not <sbgn>");Ka(this,a.documentElement);w(this.m,function(a){var c=this.b.arc(a.getAttribute("id")),d=a.getAttribute("target"),a=a.getAttribute("source");c.source(a).target(d)},this);return this.b};T.prototype.parseText=T.prototype.j;
function La(a,b){var c=b.tagName,c=c?c.toLocaleLowerCase():i,d=b.getAttribute("id"),e=a.f.p[a.f.p.length-1];if("glyph"==c)d=e instanceof D?e.q(d):a.b.createNode(d),c=b.getAttribute("class"),d.type(c),a.f.push(d),"compartment"==c&&x(a.i,d);else if("port"==c)(e instanceof D||e instanceof F)&&e.g(d);else if("arc"==c)c=a.b.e(d),d||b.setAttribute("id",c.id()),d=b.getAttribute("class"),c.type(d),a.f.push(c),x(a.m,b);else if("label"==c)e.label(b.getAttribute("text"));else if("bbox"==c){var g=new I(Number(b.getAttribute("x")),
Number(b.getAttribute("y")),Number(b.getAttribute("w")),Number(b.getAttribute("h")));"label"==b.parentNode.tagName.toLocaleLowerCase()?e.a("label.pos",g):(e.a("box",g),e instanceof D&&"compartment"!=e.type()&&w(a.i,function(a){a.a("box").contains(g)&&a.d(e)},a))}else"start"==c||"end"==c?e instanceof F&&e.a(c,new H(Number(b.getAttribute("x")),Number(b.getAttribute("y")))):"map"==c?((d=b.getAttribute("language"))&&a.b.lang(d),a.f.push(a.b)):"entity"==c?e.a("entity",b.getAttribute("name")):"state"==
c?(e.a("variable",b.getAttribute("variable")),e.a("variableValue",b.getAttribute("value"))):"clone"==c&&e.a("clone",h)}function Ma(a,b){var c=b.tagName;("glyph"==c||"arc"==c||"map"==c)&&a.f.pop()};function Na(){this.xml=i}Na.prototype.write=function(a){this.xml=Ga();var b=this.xml.createElement("sbgn");b.setAttribute("xmlns","http://sbgn.org/libsbgn/0.2");var c=this.xml.createElement("map"),d=a.lang();d&&c.setAttribute("language",d);d=a.v(h);w(d,function(a){Oa(this,a,c)},this);w(a.o,function(a){Pa(this,a,c)},this);b.appendChild(c);return Q(b)};
function Oa(a,b,c){var d=b.type(),e=a.xml.createElement("glyph");e.setAttribute("class",d);e.setAttribute("id",b.id());b.label()&&(d=a.xml.createElement("label"),d.setAttribute("text",b.label()),e.appendChild(d));if(b.a("box")){var d=a.xml.createElement("box"),g=b.a("box");d.setAttribute("y",g.x)}c.appendChild(e);Qa(a,b,e)}function Pa(a,b,c){var d=b.type(),e=a.xml.createElement("arc");e.setAttribute("class",d);e.setAttribute("id",b.id());c.appendChild(e);Qa(a,b,e)}
function Qa(a,b,c){w(b.children(),function(a){a instanceof D?Oa(this,a,c):a instanceof F&&Pa(this,a,c)},a)};function U(a,b,c){this.url=a;this.D=c;this.G=Ra(this);c=document.createElement("script");c.setAttribute("type","text/javascript");var d="",b=b||{},e;for(e in b)b.hasOwnProperty(e)&&(d+=encodeURIComponent(e)+"="+encodeURIComponent(b[e])+"&");c.setAttribute("src",a+"?"+d+"callback=sb.io.Jsonp."+this.G);this.A=document.getElementsByTagName("head")[0].appendChild(c)}n("sb.io.Jsonp",U);U.call=function(a,b,c){new U(a,b,c)};
function Ra(a){for(var b="",c=0;15>c;c++)b+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".charAt(Math.floor(52*Math.random()));U[b]=function(c){a.D(c);delete U[b];a.A.parentNode.removeChild(a.A)};return b};var q={};n("sb.sbo.NodeTypeMapping",q);q["unspecified entity"]=285;q.compartment=290;q.macromolecule=245;q["macromolecule multimer"]=420;q["simple chemical"]=247;q["simple chemical multimer"]=421;q.complex=253;q["complex multimer"]=418;q.process=375;q["omitted process"]=379;q["uncertain process"]=396;q.annotation=110003;q.phenotype=358;q["nucleic acid feature"]=250;q["nucleic acid feature multimer"]=250;q.association=177;q.dissociation=180;q.entity=245;q.submap=395;q.terminal=110004;
q["perturbing agent"]=405;q["variable value"]=110001;q["implicit xor"]=-1;q.tag=110002;q.and=173;q.or=174;q.not=238;q.delay=225;q["source and sink"]=291;q.perturbation=405;q["biological activity"]=412;var Sa=da();n("sb.sbo.ReverseNodeTypeMapping",Sa);var V={};n("sb.sbo.ArcTypeMapping",V);V.production=393;V["equivalence arc"]=15;V["logic arc"]=15;V["necessary stimulation"]=461;V.assignment=464;V.interaction=342;V["absolute inhibition"]=407;V.modulation=168;V.inhibition=169;
V["absolute stimulation"]=411;V["unknown influence"]=168;V["positive influence"]=170;V["negative influence"]=169;V.stimulation=170;V.catalysis=172;V.consumption=15;V.production=393;V.catalysis=13;var Ta=da();n("sb.sbo.ReverseArcTypeMapping",Ta);function Ua(a){a=""+a;if(/^\s*$/.test(a)?0:/^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g,"@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x10-\x1f\x80-\x9f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g,"")))try{return eval("("+a+")")}catch(b){}f(Error("Invalid JSON string: "+a))}function Va(){this.s=void 0}function Wa(a){var b=[];Xa(new Va,a,b);return b.join("")}
function Xa(a,b,c){switch(typeof b){case "string":Ya(b,c);break;case "number":c.push(isFinite(b)&&!isNaN(b)?b:"null");break;case "boolean":c.push(b);break;case "undefined":c.push("null");break;case "object":if(b==i){c.push("null");break}if("array"==aa(b)){var d=b.length;c.push("[");for(var e="",g=0;g<d;g++)c.push(e),e=b[g],Xa(a,a.s?a.s.call(b,""+g,e):e,c),e=",";c.push("]");break}c.push("{");d="";for(g in b)Object.prototype.hasOwnProperty.call(b,g)&&(e=b[g],"function"!=typeof e&&(c.push(d),Ya(g,c),
c.push(":"),Xa(a,a.s?a.s.call(b,g,e):e,c),d=","));c.push("}");break;case "function":break;default:f(Error("Unknown type: "+typeof b))}}var Za={'"':'\\"',"\\":"\\\\","/":"\\/","\u0008":"\\b","\u000c":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\x0B":"\\u000b"},$a=/\uffff/.test("\uffff")?/[\\\"\x00-\x1f\x7f-\uffff]/g:/[\\\"\x00-\x1f\x7f-\xff]/g;
function Ya(a,b){b.push('"',a.replace($a,function(a){if(a in Za)return Za[a];var b=a.charCodeAt(0),e="\\u";16>b?e+="000":256>b?e+="00":4096>b&&(e+="0");return Za[a]=e+b.toString(16)}),'"')};function ab(){}n("sb.io.JsbgnWriter",ab);var W=[];W["entity relationship"]="ER";W["activity flow"]="AF";W["process description"]="PD";
ab.prototype.write=function(a){var b={nodes:[],edges:[]};a.lang()&&(b.sbgnlang=W[a.lang()]);w(a.v(),function(a){if(!(a instanceof C)&&!ka(["unit of information","state variable"],a.type())){var d={};d.id=a.id();d.sbo=q[a.type()];d.is_abstract=j;var e={};d.data=e;a.a("clone")&&(e.clone=h);a.label()&&(e.label=a.label());var g=a.a("box");g&&(e.x=g.x,e.y=g.y,e.width=g.width,e.height=g.height);w(a.children(),function(a){if(!(a instanceof C))if(a.type()=="unit of information"){e.unitofinformation||(e.unitofinformation=
[]);x(e.unitofinformation,a.label()?a.label():"")}else if(a.type()=="state variable"){e.statevariable||(e.statevariable=[]);x(e.statevariable,a.a("variable"))}else{e.subnodes||(e.subnodes=[]);x(e.subnodes,a.id())}},this);ba(e)&&ca(d);x(b.nodes,d)}},this);w(a.o,function(a){var d={};d.id=a.id();d.sbo=V[a.type()];d.source=a.source().id();var a=a.target(),e=a.id();"state variable"==a.type()&&(e=a.parent().id()+":"+a.id());d.target=e;a={};d.data=a;ba(a)&&ca(d);x(b.edges,d)},this);return Wa(b)};function X(){this.i=this.b=i}n("sb.io.JsbgnReader",X);
X.prototype.j=function(a){this.f=new R;this.b=new G;this.i=[];var b=Ua(a);b&&b.edges&&b.nodes?(a=b.edges,b=b.nodes,w(b,function(a){this.b.createNode(""+a.id)},this),w(a,function(a){this.b.e(""+a.id)},this),w(b,function(a){var b=this.b.r(""+a.id);b.a("jsbgn.sbo",a.sbo);b.type(Sa[a.sbo]);b.a("jsbgn.is_abstract",a.is_abstract);b.a("jsbgn.type",a.type);if(a=a.data)a.label&&b.label(a.label),a.clone_marker&&b.a("clone",h),a.x&&a.y&&(b.a("jsbgn.data.x",a.x),b.a("jsbgn.data.y",a.y),a.width&&a.height&&(b.a("jsbgn.data.width",
a.width),b.a("jsbgn.data.height",a.height),b.a("box",new I(Number(a.x),Number(a.y),Number(a.width),Number(a.height))))),a.radius&&b.a("jsbgn.data.radius",a.radius),a.subnodes&&(b.a("jsbgn.data.subnodes",a.subnodes),w(a.subnodes,function(a){(a=this.b.r(a))&&b.d(a)},this)),a.compartment&&b.a("jsbgn.data.compartment",a.compartment),a.modifications&&b.a("jsbgn.data.modifications",a.modifications),a.statevariable&&(b.a("jsbgn.data.statevariable",a.statevariable),w(a.statevariable,function(a){var c=b.q(b.id()+
":"+a);c.type("state variable");c.a("variable",a)},this)),a.unitofinformation&&(b.a("jsbgn.data.unitofinformation",a.unitofinformation),w(a.unitofinformation,function(a){var c=b.q(b.id()+":"+a);c.type("unit of information");c.a("label",a)},this)),a.cssClasses&&b.a("jsbgn.data.cssClasses",a.cssClasses)},this),w(a,function(a){var b=this.b.arc(""+a.id);b.a("jsbgn.sbo",a.sbo);b.type(Ta[a.sbo]);b.source(a.source);b.target(a.target);if(a=a.data)a.type&&b.a("jsbgn.data.type",a.type),a.style&&b.a("jsbgn.data.style",
a.style),a.thickness&&b.a("jsbgn.data.thickness",a.thickness),a.label&&b.label(a.label),a.label_x&&b.a("jsbgn.data.label_x",a.label_x),a.label_y&&b.a("jsbgn.data.label_y",a.label_y),a.handles&&b.a("jsbgn.data.handles",a.handles),a.pairs&&b.a("jsbgn.data.pairs",a.pairs)},this)):f("jsbgn JSON format error, it is not a valid JSON string");return this.b};X.prototype.parseText=X.prototype.j;function Y(a,b,c){a=Fa(a);w(a,b,c)}function Z(a,b,c,d){a=ia(Fa(a),function(a){return a.tagName==b});w(a,c,d)};function $(){this.i=this.b=this.m=this.f=i}o($,Ia);n("sb.io.SbmlReader",$);
$.prototype.j=function(a){this.b=new G;this.i=[];this.m=[];var a=Ja(a),b={};Z(a.documentElement,"model",function(a){Z(a,"listOfCompartments",function(a){Y(a,function(a){this.b.createNode(a.getAttribute("id")).type("compartment").label(a.getAttribute("name"))},this)},this);Z(a,"listOfSpecies",function(a){Y(a,function(a){var c=this.b.createNode(a.getAttribute("id"));c.label(a.getAttribute("name"));var d=a.getAttribute("id"),r=a.getAttribute("id")+a.getAttribute("name"),A=this.b.r(a.getAttribute("compartment"));
A.d(c);b[d]=A;-1!=r.toLowerCase().indexOf("sink")||-1!=r.toLowerCase().indexOf("emptyset")?c.type("source and sink"):-1!=r.toLowerCase().indexOf("dna")||-1!=r.toLowerCase().indexOf("rna")?c.type("nucleic acid feature"):-1!=Q(a).indexOf("urn:miriam:obo.chebi")?c.type("simple chemical"):-1!=Q(a).indexOf("urn:miriam:pubchem")?c.type("simple chemical"):-1!=Q(a).indexOf("urn:miriam:uniprot")?c.type("macromolecule"):c.type("unspecified entity")},this)},this);Z(a,"listOfReactions",function(a){Z(a,"reaction",
function(a){var c=a.getAttribute("id"),d=this.b.createNode(c).type("process");d.label(a.getAttribute("name"));d.a("box",new I(0,0,10,10));console.log("reaction_id "+c);var r=j,A=j,s;Z(a,"listOfReactants",function(a){Y(a,function(a){a=a.getAttribute("species");this.b.e(a+"_to_"+c).source(a).target(c).type("consumption");r=h;s=b[a]},this)},this);Z(a,"listOfProducts",function(a){Y(a,function(a){a=a.getAttribute("species");this.b.e(c+"_to_"+a).source(c).target(a).type("production");A=h;s=b[a]},this)},
this);Z(a,"listOfModifiers",function(a){Y(a,function(a){a=a.getAttribute("species");this.b.e(a+"_to_"+c).source(a).target(c).type("modulation")},this)},this);s.d(d);if(!r){var a=c+"_source",u=this.b.createNode(a).type("source and sink"),d=c;s.d(u);this.b.e(a+"_to_"+d).source(a).target(d).type("consumption")}A||(d=c+"_sink",u=this.b.createNode(d).type("source and sink"),a=c,s.d(u),this.b.e(a+"_to_"+d).source(a).target(d).type("production"))},this)},this)},this);return this.b};
$.prototype.parseText=$.prototype.j;function bb(a,b){if(b)return cb(a,b);var c;ja(function(b){try{var e=cb(a,b);if(e)return console.log("format was auto-detected as "+b),c=e,h}catch(g){}return j},this);return c}n("sb.io.read",bb);function cb(a,b){var c;"sbgn-ml"==b?c=new T:"jsbgn"==b?c=new X:"sbml"==b?c=new $:f(Error("Format "+b+" not supported"));return c.j(a)}n("sb.io.readUrl",function(a,b,c){new U("http://chemhack.com/jsonp/ba-simple-proxy.php",{url:a},function(a){200==a.status.http_code&&(a=bb(a.contents,b),c(a))})});
n("sb.io.write",function(a,b){var c;"jsbgn"==b?c=new ab:"sbgn-ml"==b?c=new Na:f(Error("Format "+b+" not supported"));return c.write(a)});})();