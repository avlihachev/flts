var qr=Object.defineProperty;var Zr=(r,e,t)=>e in r?qr(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var w=(r,e,t)=>Zr(r,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=t(i);fetch(i.href,s)}})();/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const st=globalThis,Kt=st.ShadowRoot&&(st.ShadyCSS===void 0||st.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Qt=Symbol(),Un=new WeakMap;let pr=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==Qt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(Kt&&e===void 0){const n=t!==void 0&&t.length===1;n&&(e=Un.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),n&&Un.set(t,e))}return e}toString(){return this.cssText}};const Vr=r=>new pr(typeof r=="string"?r:r+"",void 0,Qt),Jt=(r,...e)=>{const t=r.length===1?r[0]:e.reduce((n,i,s)=>n+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[s+1],r[0]);return new pr(t,r,Qt)},Yr=(r,e)=>{if(Kt)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const n=document.createElement("style"),i=st.litNonce;i!==void 0&&n.setAttribute("nonce",i),n.textContent=t.cssText,r.appendChild(n)}},Hn=Kt?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(const n of e.cssRules)t+=n.cssText;return Vr(t)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Xr,defineProperty:Kr,getOwnPropertyDescriptor:Qr,getOwnPropertyNames:Jr,getOwnPropertySymbols:ei,getPrototypeOf:ti}=Object,ee=globalThis,Bn=ee.trustedTypes,ni=Bn?Bn.emptyScript:"",It=ee.reactiveElementPolyfillSupport,Ne=(r,e)=>r,ct={toAttribute(r,e){switch(e){case Boolean:r=r?ni:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},en=(r,e)=>!Xr(r,e),Fn={attribute:!0,type:String,converter:ct,reflect:!1,useDefault:!1,hasChanged:en};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),ee.litPropertyMetadata??(ee.litPropertyMetadata=new WeakMap);let ke=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Fn){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const n=Symbol(),i=this.getPropertyDescriptor(e,n,t);i!==void 0&&Kr(this.prototype,e,i)}}static getPropertyDescriptor(e,t,n){const{get:i,set:s}=Qr(this.prototype,e)??{get(){return this[t]},set(a){this[t]=a}};return{get:i,set(a){const l=i==null?void 0:i.call(this);s==null||s.call(this,a),this.requestUpdate(e,l,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Fn}static _$Ei(){if(this.hasOwnProperty(Ne("elementProperties")))return;const e=ti(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(Ne("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ne("properties"))){const t=this.properties,n=[...Jr(t),...ei(t)];for(const i of n)this.createProperty(i,t[i])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[n,i]of t)this.elementProperties.set(n,i)}this._$Eh=new Map;for(const[t,n]of this.elementProperties){const i=this._$Eu(t,n);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const n=new Set(e.flat(1/0).reverse());for(const i of n)t.unshift(Hn(i))}else e!==void 0&&t.push(Hn(e));return t}static _$Eu(e,t){const n=t.attribute;return n===!1?void 0:typeof n=="string"?n:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((t=e.hostConnected)==null||t.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Yr(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(t=>{var n;return(n=t.hostConnected)==null?void 0:n.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var n;return(n=t.hostDisconnected)==null?void 0:n.call(t)})}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){var s;const n=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,n);if(i!==void 0&&n.reflect===!0){const a=(((s=n.converter)==null?void 0:s.toAttribute)!==void 0?n.converter:ct).toAttribute(t,n.type);this._$Em=e,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(e,t){var s,a;const n=this.constructor,i=n._$Eh.get(e);if(i!==void 0&&this._$Em!==i){const l=n.getPropertyOptions(i),p=typeof l.converter=="function"?{fromAttribute:l.converter}:((s=l.converter)==null?void 0:s.fromAttribute)!==void 0?l.converter:ct;this._$Em=i;const c=p.fromAttribute(t,l.type);this[i]=c??((a=this._$Ej)==null?void 0:a.get(i))??c,this._$Em=null}}requestUpdate(e,t,n,i=!1,s){var a;if(e!==void 0){const l=this.constructor;if(i===!1&&(s=this[e]),n??(n=l.getPropertyOptions(e)),!((n.hasChanged??en)(s,t)||n.useDefault&&n.reflect&&s===((a=this._$Ej)==null?void 0:a.get(e))&&!this.hasAttribute(l._$Eu(e,n))))return;this.C(e,t,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:i,wrapped:s},a){n&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,a??t??this[e]),s!==!0||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var n;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[s,a]of this._$Ep)this[s]=a;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[s,a]of i){const{wrapped:l}=a,p=this[s];l!==!0||this._$AL.has(s)||p===void 0||this.C(s,void 0,a,p)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),(n=this._$EO)==null||n.forEach(i=>{var s;return(s=i.hostUpdate)==null?void 0:s.call(i)}),this.update(t)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(n=>{var i;return(i=n.hostUpdated)==null?void 0:i.call(n)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}};ke.elementStyles=[],ke.shadowRootOptions={mode:"open"},ke[Ne("elementProperties")]=new Map,ke[Ne("finalized")]=new Map,It==null||It({ReactiveElement:ke}),(ee.reactiveElementVersions??(ee.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Me=globalThis,Gn=r=>r,pt=Me.trustedTypes,jn=pt?pt.createPolicy("lit-html",{createHTML:r=>r}):void 0,hr="$lit$",J=`lit$${Math.random().toFixed(9).slice(2)}$`,ur="?"+J,ri=`<${ur}>`,he=document,Ue=()=>he.createComment(""),He=r=>r===null||typeof r!="object"&&typeof r!="function",tn=Array.isArray,ii=r=>tn(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Dt=`[ 	
\f\r]`,$e=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Wn=/-->/g,qn=/>/g,ae=RegExp(`>|${Dt}(?:([^\\s"'>=/]+)(${Dt}*=${Dt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Zn=/'/g,Vn=/"/g,dr=/^(?:script|style|textarea|title)$/i,si=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),N=si(1),ue=Symbol.for("lit-noChange"),E=Symbol.for("lit-nothing"),Yn=new WeakMap,le=he.createTreeWalker(he,129);function fr(r,e){if(!tn(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return jn!==void 0?jn.createHTML(e):e}const oi=(r,e)=>{const t=r.length-1,n=[];let i,s=e===2?"<svg>":e===3?"<math>":"",a=$e;for(let l=0;l<t;l++){const p=r[l];let c,h,m=-1,d=0;for(;d<p.length&&(a.lastIndex=d,h=a.exec(p),h!==null);)d=a.lastIndex,a===$e?h[1]==="!--"?a=Wn:h[1]!==void 0?a=qn:h[2]!==void 0?(dr.test(h[2])&&(i=RegExp("</"+h[2],"g")),a=ae):h[3]!==void 0&&(a=ae):a===ae?h[0]===">"?(a=i??$e,m=-1):h[1]===void 0?m=-2:(m=a.lastIndex-h[2].length,c=h[1],a=h[3]===void 0?ae:h[3]==='"'?Vn:Zn):a===Vn||a===Zn?a=ae:a===Wn||a===qn?a=$e:(a=ae,i=void 0);const _=a===ae&&r[l+1].startsWith("/>")?" ":"";s+=a===$e?p+ri:m>=0?(n.push(c),p.slice(0,m)+hr+p.slice(m)+J+_):p+J+(m===-2?l:_)}return[fr(r,s+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),n]};class Be{constructor({strings:e,_$litType$:t},n){let i;this.parts=[];let s=0,a=0;const l=e.length-1,p=this.parts,[c,h]=oi(e,t);if(this.el=Be.createElement(c,n),le.currentNode=this.el.content,t===2||t===3){const m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(i=le.nextNode())!==null&&p.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const m of i.getAttributeNames())if(m.endsWith(hr)){const d=h[a++],_=i.getAttribute(m).split(J),b=/([.?@])?(.*)/.exec(d);p.push({type:1,index:s,name:b[2],strings:_,ctor:b[1]==="."?li:b[1]==="?"?ci:b[1]==="@"?pi:ft}),i.removeAttribute(m)}else m.startsWith(J)&&(p.push({type:6,index:s}),i.removeAttribute(m));if(dr.test(i.tagName)){const m=i.textContent.split(J),d=m.length-1;if(d>0){i.textContent=pt?pt.emptyScript:"";for(let _=0;_<d;_++)i.append(m[_],Ue()),le.nextNode(),p.push({type:2,index:++s});i.append(m[d],Ue())}}}else if(i.nodeType===8)if(i.data===ur)p.push({type:2,index:s});else{let m=-1;for(;(m=i.data.indexOf(J,m+1))!==-1;)p.push({type:7,index:s}),m+=J.length-1}s++}}static createElement(e,t){const n=he.createElement("template");return n.innerHTML=e,n}}function we(r,e,t=r,n){var a,l;if(e===ue)return e;let i=n!==void 0?(a=t._$Co)==null?void 0:a[n]:t._$Cl;const s=He(e)?void 0:e._$litDirective$;return(i==null?void 0:i.constructor)!==s&&((l=i==null?void 0:i._$AO)==null||l.call(i,!1),s===void 0?i=void 0:(i=new s(r),i._$AT(r,t,n)),n!==void 0?(t._$Co??(t._$Co=[]))[n]=i:t._$Cl=i),i!==void 0&&(e=we(r,i._$AS(r,e.values),i,n)),e}class ai{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:n}=this._$AD,i=((e==null?void 0:e.creationScope)??he).importNode(t,!0);le.currentNode=i;let s=le.nextNode(),a=0,l=0,p=n[0];for(;p!==void 0;){if(a===p.index){let c;p.type===2?c=new je(s,s.nextSibling,this,e):p.type===1?c=new p.ctor(s,p.name,p.strings,this,e):p.type===6&&(c=new hi(s,this,e)),this._$AV.push(c),p=n[++l]}a!==(p==null?void 0:p.index)&&(s=le.nextNode(),a++)}return le.currentNode=he,i}p(e){let t=0;for(const n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(e,n,t),t+=n.strings.length-2):n._$AI(e[t])),t++}}class je{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,t,n,i){this.type=2,this._$AH=E,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=we(this,e,t),He(e)?e===E||e==null||e===""?(this._$AH!==E&&this._$AR(),this._$AH=E):e!==this._$AH&&e!==ue&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):ii(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==E&&He(this._$AH)?this._$AA.nextSibling.data=e:this.T(he.createTextNode(e)),this._$AH=e}$(e){var s;const{values:t,_$litType$:n}=e,i=typeof n=="number"?this._$AC(e):(n.el===void 0&&(n.el=Be.createElement(fr(n.h,n.h[0]),this.options)),n);if(((s=this._$AH)==null?void 0:s._$AD)===i)this._$AH.p(t);else{const a=new ai(i,this),l=a.u(this.options);a.p(t),this.T(l),this._$AH=a}}_$AC(e){let t=Yn.get(e.strings);return t===void 0&&Yn.set(e.strings,t=new Be(e)),t}k(e){tn(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let n,i=0;for(const s of e)i===t.length?t.push(n=new je(this.O(Ue()),this.O(Ue()),this,this.options)):n=t[i],n._$AI(s),i++;i<t.length&&(this._$AR(n&&n._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){var n;for((n=this._$AP)==null?void 0:n.call(this,!1,!0,t);e!==this._$AB;){const i=Gn(e).nextSibling;Gn(e).remove(),e=i}}setConnected(e){var t;this._$AM===void 0&&(this._$Cv=e,(t=this._$AP)==null||t.call(this,e))}}class ft{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,i,s){this.type=1,this._$AH=E,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=s,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=E}_$AI(e,t=this,n,i){const s=this.strings;let a=!1;if(s===void 0)e=we(this,e,t,0),a=!He(e)||e!==this._$AH&&e!==ue,a&&(this._$AH=e);else{const l=e;let p,c;for(e=s[0],p=0;p<s.length-1;p++)c=we(this,l[n+p],t,p),c===ue&&(c=this._$AH[p]),a||(a=!He(c)||c!==this._$AH[p]),c===E?e=E:e!==E&&(e+=(c??"")+s[p+1]),this._$AH[p]=c}a&&!i&&this.j(e)}j(e){e===E?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class li extends ft{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===E?void 0:e}}class ci extends ft{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==E)}}class pi extends ft{constructor(e,t,n,i,s){super(e,t,n,i,s),this.type=5}_$AI(e,t=this){if((e=we(this,e,t,0)??E)===ue)return;const n=this._$AH,i=e===E&&n!==E||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,s=e!==E&&(n===E||i);i&&this.element.removeEventListener(this.name,this,n),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t;typeof this._$AH=="function"?this._$AH.call(((t=this.options)==null?void 0:t.host)??this.element,e):this._$AH.handleEvent(e)}}class hi{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){we(this,e)}}const Nt=Me.litHtmlPolyfillSupport;Nt==null||Nt(Be,je),(Me.litHtmlVersions??(Me.litHtmlVersions=[])).push("3.3.2");const ui=(r,e,t)=>{const n=(t==null?void 0:t.renderBefore)??e;let i=n._$litPart$;if(i===void 0){const s=(t==null?void 0:t.renderBefore)??null;n._$litPart$=i=new je(e.insertBefore(Ue(),s),s,void 0,t??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ce=globalThis;let pe=class extends ke{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=ui(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return ue}};var cr;pe._$litElement$=!0,pe.finalized=!0,(cr=ce.litElementHydrateSupport)==null||cr.call(ce,{LitElement:pe});const Mt=ce.litElementPolyfillSupport;Mt==null||Mt({LitElement:pe});(ce.litElementVersions??(ce.litElementVersions=[])).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const nn=r=>(e,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(r,e)}):customElements.define(r,e)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const di={attribute:!0,type:String,converter:ct,reflect:!1,hasChanged:en},fi=(r=di,e,t)=>{const{kind:n,metadata:i}=t;let s=globalThis.litPropertyMetadata.get(i);if(s===void 0&&globalThis.litPropertyMetadata.set(i,s=new Map),n==="setter"&&((r=Object.create(r)).wrapped=!0),s.set(t.name,r),n==="accessor"){const{name:a}=t;return{set(l){const p=e.get.call(this);e.set.call(this,l),this.requestUpdate(a,p,r,!0,l)},init(l){return l!==void 0&&this.C(a,void 0,r,l),l}}}if(n==="setter"){const{name:a}=t;return function(l){const p=this[a];e.call(this,l),this.requestUpdate(a,p,r,!0,l)}}throw Error("Unsupported decorator location: "+n)};function gt(r){return(e,t)=>typeof t=="object"?fi(r,e,t):((n,i,s)=>{const a=i.hasOwnProperty(s);return i.constructor.createProperty(s,n),a?Object.getOwnPropertyDescriptor(i,s):void 0})(r,e,t)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function mt(r){return gt({...r,state:!0,attribute:!1})}async function gi(r,e){return(await(await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:r,chat_id:e})})).json()).chat_id}function mi(r,e){const t=new EventSource(`/api/chat/stream/${r}`);for(const n of["log","text","tool","done","error"])t.addEventListener(n,i=>{e({type:n,data:i.data}),n==="done"&&t.close()});return t.onerror=()=>{e({type:"error",data:"Connection lost"}),t.close()},t}var bi=Object.defineProperty,xi=Object.getOwnPropertyDescriptor,bt=(r,e,t,n)=>{for(var i=n>1?void 0:n?xi(e,t):e,s=r.length-1,a;s>=0;s--)(a=r[s])&&(i=(n?a(e,t,i):a(i))||i);return n&&i&&bi(e,t,i),i};let Ae=class extends pe{constructor(){super(...arguments),this.messages=[],this.loading=!1,this.inputValue=""}handleNewChat(){this.chatId=void 0,this.messages=[],this.loading=!1}async handleSubmit(){const r=this.inputValue.trim();if(!r||this.loading)return;this.inputValue="",this.loading=!0,this.messages=[...this.messages,{role:"user",content:r,logs:[]}],this.messages=[...this.messages,{role:"agent",content:"",logs:[]}];const e=this.messages.length-1;this.chatId=await gi(r,this.chatId),mi(this.chatId,t=>{const n=[...this.messages],i={...n[e]};t.type==="log"?i.logs=[...i.logs,t.data]:t.type==="text"?i.content+=t.data+`
`:t.type==="done"?this.loading=!1:t.type==="error"&&(i.content+=`
**Error:** ${t.data}`,this.loading=!1),n[e]=i,this.messages=n,this.scrollToBottom()})}scrollToBottom(){requestAnimationFrame(()=>{var e;const r=(e=this.shadowRoot)==null?void 0:e.querySelector(".messages");r&&(r.scrollTop=r.scrollHeight)})}handleKeyDown(r){r.key==="Enter"&&!r.shiftKey&&(r.preventDefault(),this.handleSubmit())}render(){const r=N`<svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`,e=N`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,t=N`<svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>`;return N`
      <header>
        ${r}
        <div class="logo-text"><span>flts</span> / flight search</div>
        ${this.messages.length>0?N`<button class="new-chat-btn" @click=${this.handleNewChat}>New chat</button>`:""}
      </header>

      <div class="messages">
        ${this.messages.length===0?N`
            <div class="empty-state">
              ${t}
              <div class="empty-text">
                Search for cheap flights by typing a query below.
                Try: "Cheap flights from Helsinki to Bangkok in June"
              </div>
            </div>`:this.messages.map(n=>N`
                <div class="msg-enter">
                  ${n.logs.length?N`<tool-log .lines=${n.logs}></tool-log>`:""}
                  <message-bubble
                    role=${n.role}
                    .content=${n.content}
                  ></message-bubble>
                </div>
              `)}
        ${this.loading?N`<div class="loading-indicator">
              <div class="loading-dot"></div>
              <div class="loading-dot"></div>
              <div class="loading-dot"></div>
            </div>`:""}
      </div>

      <div class="input-area">
        <div class="input-row">
          <input
            .value=${this.inputValue}
            @input=${n=>this.inputValue=n.target.value}
            @keydown=${this.handleKeyDown}
            placeholder="Where do you want to fly?"
            ?disabled=${this.loading}
          />
          <button class="send-btn" @click=${this.handleSubmit} ?disabled=${this.loading}>
            ${e}
          </button>
        </div>
      </div>
    `}};Ae.styles=Jt`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: var(--bg-base);
    }

    header {
      padding: 14px 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid var(--border);
      background: var(--bg-primary);
      backdrop-filter: blur(12px);
      position: relative;
      z-index: 10;
    }

    .logo-icon {
      width: 28px;
      height: 28px;
      color: var(--amber);
    }

    .logo-text {
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--text-secondary);
    }

    .logo-text span {
      color: var(--text-primary);
    }

    .new-chat-btn {
      margin-left: auto;
      background: none;
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      font-family: var(--font-body);
      font-size: 13px;
      padding: 6px 12px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .new-chat-btn:hover {
      border-color: var(--amber-dim);
      color: var(--text-primary);
    }

    .messages {
      flex: 1;
      overflow-y: auto;
      padding: 24px 24px 16px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .empty-state {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      color: var(--text-muted);
    }

    .empty-icon {
      width: 48px;
      height: 48px;
      color: var(--bg-tertiary);
    }

    .empty-text {
      font-size: 14px;
      max-width: 320px;
      text-align: center;
      line-height: 1.6;
    }

    .input-area {
      padding: 16px 24px 20px;
      background: var(--bg-primary);
      border-top: 1px solid var(--border);
    }

    .input-row {
      display: flex;
      gap: 10px;
      align-items: center;
      background: var(--bg-secondary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      padding: 4px 4px 4px 16px;
      transition: border-color 0.2s;
    }

    .input-row:focus-within {
      border-color: var(--amber-dim);
      box-shadow: var(--shadow-glow);
    }

    input {
      flex: 1;
      background: none;
      border: none;
      color: var(--text-primary);
      font-family: var(--font-body);
      font-size: 14px;
      font-weight: 400;
      outline: none;
      padding: 10px 0;
    }

    input::placeholder {
      color: var(--text-muted);
    }

    .send-btn {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      background: var(--amber);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      flex-shrink: 0;
    }

    .send-btn:hover { background: var(--amber-dim); transform: scale(1.05); }
    .send-btn:disabled { opacity: 0.3; cursor: not-allowed; transform: none; }
    .send-btn svg { width: 18px; height: 18px; color: var(--bg-base); }

    .loading-indicator {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      color: var(--text-muted);
      font-size: 13px;
    }

    .loading-dot {
      width: 4px; height: 4px;
      border-radius: 50%;
      background: var(--amber-dim);
      animation: pulse 1.4s infinite;
    }
    .loading-dot:nth-child(2) { animation-delay: 0.2s; }
    .loading-dot:nth-child(3) { animation-delay: 0.4s; }

    @keyframes pulse {
      0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
      40% { opacity: 1; transform: scale(1.2); }
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .msg-enter {
      animation: fadeInUp 0.3s ease-out;
    }
  `;bt([mt()],Ae.prototype,"messages",2);bt([mt()],Ae.prototype,"loading",2);bt([mt()],Ae.prototype,"inputValue",2);Ae=bt([nn("chat-page")],Ae);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const _i={CHILD:2},yi=r=>(...e)=>({_$litDirective$:r,values:e});class ki{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,n){this._$Ct=e,this._$AM=t,this._$Ci=n}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class Wt extends ki{constructor(e){if(super(e),this.it=E,e.type!==_i.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===E||e==null)return this._t=void 0,this.it=e;if(e===ue)return e;if(typeof e!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}}Wt.directiveName="unsafeHTML",Wt.resultType=1;const wi=yi(Wt);function rn(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var fe=rn();function gr(r){fe=r}var ze={exec:()=>null};function k(r,e=""){let t=typeof r=="string"?r:r.source;const n={replace:(i,s)=>{let a=typeof s=="string"?s:s.source;return a=a.replace(M.caret,"$1"),t=t.replace(i,a),n},getRegex:()=>new RegExp(t,e)};return n}var M={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceTabs:/^\t+/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] /,listReplaceTask:/^\[[ xX]\] +/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:r=>new RegExp(`^( {0,3}${r})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:r=>new RegExp(`^ {0,${Math.min(3,r-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:r=>new RegExp(`^ {0,${Math.min(3,r-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:r=>new RegExp(`^ {0,${Math.min(3,r-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:r=>new RegExp(`^ {0,${Math.min(3,r-1)}}#`),htmlBeginRegex:r=>new RegExp(`^ {0,${Math.min(3,r-1)}}<(?:[a-z].*>|!--)`,"i")},Ai=/^(?:[ \t]*(?:\n|$))+/,vi=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Ti=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,We=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Ei=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,sn=/(?:[*+-]|\d{1,9}[.)])/,mr=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,br=k(mr).replace(/bull/g,sn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),Si=k(mr).replace(/bull/g,sn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),on=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,$i=/^[^\n]+/,an=/(?!\s*\])(?:\\.|[^\[\]\\])+/,Ri=k(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",an).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Ci=k(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,sn).getRegex(),xt="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",ln=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Oi=k("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",ln).replace("tag",xt).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),xr=k(on).replace("hr",We).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",xt).getRegex(),Li=k(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",xr).getRegex(),cn={blockquote:Li,code:vi,def:Ri,fences:Ti,heading:Ei,hr:We,html:Oi,lheading:br,list:Ci,newline:Ai,paragraph:xr,table:ze,text:$i},Xn=k("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",We).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",xt).getRegex(),Pi={...cn,lheading:Si,table:Xn,paragraph:k(on).replace("hr",We).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Xn).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",xt).getRegex()},Ii={...cn,html:k(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",ln).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:ze,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:k(on).replace("hr",We).replace("heading",` *#{1,6} *[^
]`).replace("lheading",br).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},Di=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Ni=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,_r=/^( {2,}|\\)\n(?!\s*$)/,Mi=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,_t=/[\p{P}\p{S}]/u,pn=/[\s\p{P}\p{S}]/u,yr=/[^\s\p{P}\p{S}]/u,zi=k(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,pn).getRegex(),kr=/(?!~)[\p{P}\p{S}]/u,Ui=/(?!~)[\s\p{P}\p{S}]/u,Hi=/(?:[^\s\p{P}\p{S}]|~)/u,Bi=/\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g,wr=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,Fi=k(wr,"u").replace(/punct/g,_t).getRegex(),Gi=k(wr,"u").replace(/punct/g,kr).getRegex(),Ar="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",ji=k(Ar,"gu").replace(/notPunctSpace/g,yr).replace(/punctSpace/g,pn).replace(/punct/g,_t).getRegex(),Wi=k(Ar,"gu").replace(/notPunctSpace/g,Hi).replace(/punctSpace/g,Ui).replace(/punct/g,kr).getRegex(),qi=k("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,yr).replace(/punctSpace/g,pn).replace(/punct/g,_t).getRegex(),Zi=k(/\\(punct)/,"gu").replace(/punct/g,_t).getRegex(),Vi=k(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Yi=k(ln).replace("(?:-->|$)","-->").getRegex(),Xi=k("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Yi).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),ht=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,Ki=k(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label",ht).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),vr=k(/^!?\[(label)\]\[(ref)\]/).replace("label",ht).replace("ref",an).getRegex(),Tr=k(/^!?\[(ref)\](?:\[\])?/).replace("ref",an).getRegex(),Qi=k("reflink|nolink(?!\\()","g").replace("reflink",vr).replace("nolink",Tr).getRegex(),hn={_backpedal:ze,anyPunctuation:Zi,autolink:Vi,blockSkip:Bi,br:_r,code:Ni,del:ze,emStrongLDelim:Fi,emStrongRDelimAst:ji,emStrongRDelimUnd:qi,escape:Di,link:Ki,nolink:Tr,punctuation:zi,reflink:vr,reflinkSearch:Qi,tag:Xi,text:Mi,url:ze},Ji={...hn,link:k(/^!?\[(label)\]\((.*?)\)/).replace("label",ht).getRegex(),reflink:k(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",ht).getRegex()},qt={...hn,emStrongRDelimAst:Wi,emStrongLDelim:Gi,url:k(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,"i").replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/},es={...qt,br:k(_r).replace("{2,}","*").getRegex(),text:k(qt.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},nt={normal:cn,gfm:Pi,pedantic:Ii},Re={normal:hn,gfm:qt,breaks:es,pedantic:Ji},ts={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Kn=r=>ts[r];function W(r,e){if(e){if(M.escapeTest.test(r))return r.replace(M.escapeReplace,Kn)}else if(M.escapeTestNoEncode.test(r))return r.replace(M.escapeReplaceNoEncode,Kn);return r}function Qn(r){try{r=encodeURI(r).replace(M.percentDecode,"%")}catch{return null}return r}function Jn(r,e){var s;const t=r.replace(M.findPipe,(a,l,p)=>{let c=!1,h=l;for(;--h>=0&&p[h]==="\\";)c=!c;return c?"|":" |"}),n=t.split(M.splitPipe);let i=0;if(n[0].trim()||n.shift(),n.length>0&&!((s=n.at(-1))!=null&&s.trim())&&n.pop(),e)if(n.length>e)n.splice(e);else for(;n.length<e;)n.push("");for(;i<n.length;i++)n[i]=n[i].trim().replace(M.slashPipe,"|");return n}function Ce(r,e,t){const n=r.length;if(n===0)return"";let i=0;for(;i<n&&r.charAt(n-i-1)===e;)i++;return r.slice(0,n-i)}function ns(r,e){if(r.indexOf(e[1])===-1)return-1;let t=0;for(let n=0;n<r.length;n++)if(r[n]==="\\")n++;else if(r[n]===e[0])t++;else if(r[n]===e[1]&&(t--,t<0))return n;return t>0?-2:-1}function er(r,e,t,n,i){const s=e.href,a=e.title||null,l=r[1].replace(i.other.outputLinkReplace,"$1");n.state.inLink=!0;const p={type:r[0].charAt(0)==="!"?"image":"link",raw:t,href:s,title:a,text:l,tokens:n.inlineTokens(l)};return n.state.inLink=!1,p}function rs(r,e,t){const n=r.match(t.other.indentCodeCompensation);if(n===null)return e;const i=n[1];return e.split(`
`).map(s=>{const a=s.match(t.other.beginningSpace);if(a===null)return s;const[l]=a;return l.length>=i.length?s.slice(i.length):s}).join(`
`)}var ut=class{constructor(r){w(this,"options");w(this,"rules");w(this,"lexer");this.options=r||fe}space(r){const e=this.rules.block.newline.exec(r);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(r){const e=this.rules.block.code.exec(r);if(e){const t=e[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?t:Ce(t,`
`)}}}fences(r){const e=this.rules.block.fences.exec(r);if(e){const t=e[0],n=rs(t,e[3]||"",this.rules);return{type:"code",raw:t,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:n}}}heading(r){const e=this.rules.block.heading.exec(r);if(e){let t=e[2].trim();if(this.rules.other.endingHash.test(t)){const n=Ce(t,"#");(this.options.pedantic||!n||this.rules.other.endingSpaceChar.test(n))&&(t=n.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:t,tokens:this.lexer.inline(t)}}}hr(r){const e=this.rules.block.hr.exec(r);if(e)return{type:"hr",raw:Ce(e[0],`
`)}}blockquote(r){const e=this.rules.block.blockquote.exec(r);if(e){let t=Ce(e[0],`
`).split(`
`),n="",i="";const s=[];for(;t.length>0;){let a=!1;const l=[];let p;for(p=0;p<t.length;p++)if(this.rules.other.blockquoteStart.test(t[p]))l.push(t[p]),a=!0;else if(!a)l.push(t[p]);else break;t=t.slice(p);const c=l.join(`
`),h=c.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");n=n?`${n}
${c}`:c,i=i?`${i}
${h}`:h;const m=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(h,s,!0),this.lexer.state.top=m,t.length===0)break;const d=s.at(-1);if((d==null?void 0:d.type)==="code")break;if((d==null?void 0:d.type)==="blockquote"){const _=d,b=_.raw+`
`+t.join(`
`),L=this.blockquote(b);s[s.length-1]=L,n=n.substring(0,n.length-_.raw.length)+L.raw,i=i.substring(0,i.length-_.text.length)+L.text;break}else if((d==null?void 0:d.type)==="list"){const _=d,b=_.raw+`
`+t.join(`
`),L=this.list(b);s[s.length-1]=L,n=n.substring(0,n.length-d.raw.length)+L.raw,i=i.substring(0,i.length-_.raw.length)+L.raw,t=b.substring(s.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:n,tokens:s,text:i}}}list(r){let e=this.rules.block.list.exec(r);if(e){let t=e[1].trim();const n=t.length>1,i={type:"list",raw:"",ordered:n,start:n?+t.slice(0,-1):"",loose:!1,items:[]};t=n?`\\d{1,9}\\${t.slice(-1)}`:`\\${t}`,this.options.pedantic&&(t=n?t:"[*+-]");const s=this.rules.other.listItemRegex(t);let a=!1;for(;r;){let p=!1,c="",h="";if(!(e=s.exec(r))||this.rules.block.hr.test(r))break;c=e[0],r=r.substring(c.length);let m=e[2].split(`
`,1)[0].replace(this.rules.other.listReplaceTabs,ve=>" ".repeat(3*ve.length)),d=r.split(`
`,1)[0],_=!m.trim(),b=0;if(this.options.pedantic?(b=2,h=m.trimStart()):_?b=e[1].length+1:(b=e[2].search(this.rules.other.nonSpaceChar),b=b>4?1:b,h=m.slice(b),b+=e[1].length),_&&this.rules.other.blankLine.test(d)&&(c+=d+`
`,r=r.substring(d.length+1),p=!0),!p){const ve=this.rules.other.nextBulletRegex(b),Ze=this.rules.other.hrRegex(b),te=this.rules.other.fencesBeginRegex(b),$=this.rules.other.headingBeginRegex(b),ne=this.rules.other.htmlBeginRegex(b);for(;r;){const re=r.split(`
`,1)[0];let ie;if(d=re,this.options.pedantic?(d=d.replace(this.rules.other.listReplaceNesting,"  "),ie=d):ie=d.replace(this.rules.other.tabCharGlobal,"    "),te.test(d)||$.test(d)||ne.test(d)||ve.test(d)||Ze.test(d))break;if(ie.search(this.rules.other.nonSpaceChar)>=b||!d.trim())h+=`
`+ie.slice(b);else{if(_||m.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||te.test(m)||$.test(m)||Ze.test(m))break;h+=`
`+d}!_&&!d.trim()&&(_=!0),c+=re+`
`,r=r.substring(re.length+1),m=ie.slice(b)}}i.loose||(a?i.loose=!0:this.rules.other.doubleBlankLine.test(c)&&(a=!0));let L=null,qe;this.options.gfm&&(L=this.rules.other.listIsTask.exec(h),L&&(qe=L[0]!=="[ ] ",h=h.replace(this.rules.other.listReplaceTask,""))),i.items.push({type:"list_item",raw:c,task:!!L,checked:qe,loose:!1,text:h,tokens:[]}),i.raw+=c}const l=i.items.at(-1);if(l)l.raw=l.raw.trimEnd(),l.text=l.text.trimEnd();else return;i.raw=i.raw.trimEnd();for(let p=0;p<i.items.length;p++)if(this.lexer.state.top=!1,i.items[p].tokens=this.lexer.blockTokens(i.items[p].text,[]),!i.loose){const c=i.items[p].tokens.filter(m=>m.type==="space"),h=c.length>0&&c.some(m=>this.rules.other.anyLine.test(m.raw));i.loose=h}if(i.loose)for(let p=0;p<i.items.length;p++)i.items[p].loose=!0;return i}}html(r){const e=this.rules.block.html.exec(r);if(e)return{type:"html",block:!0,raw:e[0],pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:e[0]}}def(r){const e=this.rules.block.def.exec(r);if(e){const t=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),n=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",i=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:t,raw:e[0],href:n,title:i}}}table(r){var a;const e=this.rules.block.table.exec(r);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;const t=Jn(e[1]),n=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),i=(a=e[3])!=null&&a.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],s={type:"table",raw:e[0],header:[],align:[],rows:[]};if(t.length===n.length){for(const l of n)this.rules.other.tableAlignRight.test(l)?s.align.push("right"):this.rules.other.tableAlignCenter.test(l)?s.align.push("center"):this.rules.other.tableAlignLeft.test(l)?s.align.push("left"):s.align.push(null);for(let l=0;l<t.length;l++)s.header.push({text:t[l],tokens:this.lexer.inline(t[l]),header:!0,align:s.align[l]});for(const l of i)s.rows.push(Jn(l,s.header.length).map((p,c)=>({text:p,tokens:this.lexer.inline(p),header:!1,align:s.align[c]})));return s}}lheading(r){const e=this.rules.block.lheading.exec(r);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(r){const e=this.rules.block.paragraph.exec(r);if(e){const t=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:t,tokens:this.lexer.inline(t)}}}text(r){const e=this.rules.block.text.exec(r);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(r){const e=this.rules.inline.escape.exec(r);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(r){const e=this.rules.inline.tag.exec(r);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(r){const e=this.rules.inline.link.exec(r);if(e){const t=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(t)){if(!this.rules.other.endAngleBracket.test(t))return;const s=Ce(t.slice(0,-1),"\\");if((t.length-s.length)%2===0)return}else{const s=ns(e[2],"()");if(s===-2)return;if(s>-1){const l=(e[0].indexOf("!")===0?5:4)+e[1].length+s;e[2]=e[2].substring(0,s),e[0]=e[0].substring(0,l).trim(),e[3]=""}}let n=e[2],i="";if(this.options.pedantic){const s=this.rules.other.pedanticHrefTitle.exec(n);s&&(n=s[1],i=s[3])}else i=e[3]?e[3].slice(1,-1):"";return n=n.trim(),this.rules.other.startAngleBracket.test(n)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(t)?n=n.slice(1):n=n.slice(1,-1)),er(e,{href:n&&n.replace(this.rules.inline.anyPunctuation,"$1"),title:i&&i.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(r,e){let t;if((t=this.rules.inline.reflink.exec(r))||(t=this.rules.inline.nolink.exec(r))){const n=(t[2]||t[1]).replace(this.rules.other.multipleSpaceGlobal," "),i=e[n.toLowerCase()];if(!i){const s=t[0].charAt(0);return{type:"text",raw:s,text:s}}return er(t,i,t[0],this.lexer,this.rules)}}emStrong(r,e,t=""){let n=this.rules.inline.emStrongLDelim.exec(r);if(!n||n[3]&&t.match(this.rules.other.unicodeAlphaNumeric))return;if(!(n[1]||n[2]||"")||!t||this.rules.inline.punctuation.exec(t)){const s=[...n[0]].length-1;let a,l,p=s,c=0;const h=n[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(h.lastIndex=0,e=e.slice(-1*r.length+s);(n=h.exec(e))!=null;){if(a=n[1]||n[2]||n[3]||n[4]||n[5]||n[6],!a)continue;if(l=[...a].length,n[3]||n[4]){p+=l;continue}else if((n[5]||n[6])&&s%3&&!((s+l)%3)){c+=l;continue}if(p-=l,p>0)continue;l=Math.min(l,l+p+c);const m=[...n[0]][0].length,d=r.slice(0,s+n.index+m+l);if(Math.min(s,l)%2){const b=d.slice(1,-1);return{type:"em",raw:d,text:b,tokens:this.lexer.inlineTokens(b)}}const _=d.slice(2,-2);return{type:"strong",raw:d,text:_,tokens:this.lexer.inlineTokens(_)}}}}codespan(r){const e=this.rules.inline.code.exec(r);if(e){let t=e[2].replace(this.rules.other.newLineCharGlobal," ");const n=this.rules.other.nonSpaceChar.test(t),i=this.rules.other.startingSpaceChar.test(t)&&this.rules.other.endingSpaceChar.test(t);return n&&i&&(t=t.substring(1,t.length-1)),{type:"codespan",raw:e[0],text:t}}}br(r){const e=this.rules.inline.br.exec(r);if(e)return{type:"br",raw:e[0]}}del(r){const e=this.rules.inline.del.exec(r);if(e)return{type:"del",raw:e[0],text:e[2],tokens:this.lexer.inlineTokens(e[2])}}autolink(r){const e=this.rules.inline.autolink.exec(r);if(e){let t,n;return e[2]==="@"?(t=e[1],n="mailto:"+t):(t=e[1],n=t),{type:"link",raw:e[0],text:t,href:n,tokens:[{type:"text",raw:t,text:t}]}}}url(r){var t;let e;if(e=this.rules.inline.url.exec(r)){let n,i;if(e[2]==="@")n=e[0],i="mailto:"+n;else{let s;do s=e[0],e[0]=((t=this.rules.inline._backpedal.exec(e[0]))==null?void 0:t[0])??"";while(s!==e[0]);n=e[0],e[1]==="www."?i="http://"+e[0]:i=e[0]}return{type:"link",raw:e[0],text:n,href:i,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(r){const e=this.rules.inline.text.exec(r);if(e){const t=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:t}}}},X=class Zt{constructor(e){w(this,"tokens");w(this,"options");w(this,"state");w(this,"tokenizer");w(this,"inlineQueue");this.tokens=[],this.tokens.links=Object.create(null),this.options=e||fe,this.options.tokenizer=this.options.tokenizer||new ut,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};const t={other:M,block:nt.normal,inline:Re.normal};this.options.pedantic?(t.block=nt.pedantic,t.inline=Re.pedantic):this.options.gfm&&(t.block=nt.gfm,this.options.breaks?t.inline=Re.breaks:t.inline=Re.gfm),this.tokenizer.rules=t}static get rules(){return{block:nt,inline:Re}}static lex(e,t){return new Zt(t).lex(e)}static lexInline(e,t){return new Zt(t).inlineTokens(e)}lex(e){e=e.replace(M.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let t=0;t<this.inlineQueue.length;t++){const n=this.inlineQueue[t];this.inlineTokens(n.src,n.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,t=[],n=!1){var i,s,a;for(this.options.pedantic&&(e=e.replace(M.tabCharGlobal,"    ").replace(M.spaceLine,""));e;){let l;if((s=(i=this.options.extensions)==null?void 0:i.block)!=null&&s.some(c=>(l=c.call({lexer:this},e,t))?(e=e.substring(l.raw.length),t.push(l),!0):!1))continue;if(l=this.tokenizer.space(e)){e=e.substring(l.raw.length);const c=t.at(-1);l.raw.length===1&&c!==void 0?c.raw+=`
`:t.push(l);continue}if(l=this.tokenizer.code(e)){e=e.substring(l.raw.length);const c=t.at(-1);(c==null?void 0:c.type)==="paragraph"||(c==null?void 0:c.type)==="text"?(c.raw+=`
`+l.raw,c.text+=`
`+l.text,this.inlineQueue.at(-1).src=c.text):t.push(l);continue}if(l=this.tokenizer.fences(e)){e=e.substring(l.raw.length),t.push(l);continue}if(l=this.tokenizer.heading(e)){e=e.substring(l.raw.length),t.push(l);continue}if(l=this.tokenizer.hr(e)){e=e.substring(l.raw.length),t.push(l);continue}if(l=this.tokenizer.blockquote(e)){e=e.substring(l.raw.length),t.push(l);continue}if(l=this.tokenizer.list(e)){e=e.substring(l.raw.length),t.push(l);continue}if(l=this.tokenizer.html(e)){e=e.substring(l.raw.length),t.push(l);continue}if(l=this.tokenizer.def(e)){e=e.substring(l.raw.length);const c=t.at(-1);(c==null?void 0:c.type)==="paragraph"||(c==null?void 0:c.type)==="text"?(c.raw+=`
`+l.raw,c.text+=`
`+l.raw,this.inlineQueue.at(-1).src=c.text):this.tokens.links[l.tag]||(this.tokens.links[l.tag]={href:l.href,title:l.title});continue}if(l=this.tokenizer.table(e)){e=e.substring(l.raw.length),t.push(l);continue}if(l=this.tokenizer.lheading(e)){e=e.substring(l.raw.length),t.push(l);continue}let p=e;if((a=this.options.extensions)!=null&&a.startBlock){let c=1/0;const h=e.slice(1);let m;this.options.extensions.startBlock.forEach(d=>{m=d.call({lexer:this},h),typeof m=="number"&&m>=0&&(c=Math.min(c,m))}),c<1/0&&c>=0&&(p=e.substring(0,c+1))}if(this.state.top&&(l=this.tokenizer.paragraph(p))){const c=t.at(-1);n&&(c==null?void 0:c.type)==="paragraph"?(c.raw+=`
`+l.raw,c.text+=`
`+l.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=c.text):t.push(l),n=p.length!==e.length,e=e.substring(l.raw.length);continue}if(l=this.tokenizer.text(e)){e=e.substring(l.raw.length);const c=t.at(-1);(c==null?void 0:c.type)==="text"?(c.raw+=`
`+l.raw,c.text+=`
`+l.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=c.text):t.push(l);continue}if(e){const c="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(c);break}else throw new Error(c)}}return this.state.top=!0,t}inline(e,t=[]){return this.inlineQueue.push({src:e,tokens:t}),t}inlineTokens(e,t=[]){var l,p,c;let n=e,i=null;if(this.tokens.links){const h=Object.keys(this.tokens.links);if(h.length>0)for(;(i=this.tokenizer.rules.inline.reflinkSearch.exec(n))!=null;)h.includes(i[0].slice(i[0].lastIndexOf("[")+1,-1))&&(n=n.slice(0,i.index)+"["+"a".repeat(i[0].length-2)+"]"+n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(i=this.tokenizer.rules.inline.anyPunctuation.exec(n))!=null;)n=n.slice(0,i.index)+"++"+n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);for(;(i=this.tokenizer.rules.inline.blockSkip.exec(n))!=null;)n=n.slice(0,i.index)+"["+"a".repeat(i[0].length-2)+"]"+n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);let s=!1,a="";for(;e;){s||(a=""),s=!1;let h;if((p=(l=this.options.extensions)==null?void 0:l.inline)!=null&&p.some(d=>(h=d.call({lexer:this},e,t))?(e=e.substring(h.raw.length),t.push(h),!0):!1))continue;if(h=this.tokenizer.escape(e)){e=e.substring(h.raw.length),t.push(h);continue}if(h=this.tokenizer.tag(e)){e=e.substring(h.raw.length),t.push(h);continue}if(h=this.tokenizer.link(e)){e=e.substring(h.raw.length),t.push(h);continue}if(h=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(h.raw.length);const d=t.at(-1);h.type==="text"&&(d==null?void 0:d.type)==="text"?(d.raw+=h.raw,d.text+=h.text):t.push(h);continue}if(h=this.tokenizer.emStrong(e,n,a)){e=e.substring(h.raw.length),t.push(h);continue}if(h=this.tokenizer.codespan(e)){e=e.substring(h.raw.length),t.push(h);continue}if(h=this.tokenizer.br(e)){e=e.substring(h.raw.length),t.push(h);continue}if(h=this.tokenizer.del(e)){e=e.substring(h.raw.length),t.push(h);continue}if(h=this.tokenizer.autolink(e)){e=e.substring(h.raw.length),t.push(h);continue}if(!this.state.inLink&&(h=this.tokenizer.url(e))){e=e.substring(h.raw.length),t.push(h);continue}let m=e;if((c=this.options.extensions)!=null&&c.startInline){let d=1/0;const _=e.slice(1);let b;this.options.extensions.startInline.forEach(L=>{b=L.call({lexer:this},_),typeof b=="number"&&b>=0&&(d=Math.min(d,b))}),d<1/0&&d>=0&&(m=e.substring(0,d+1))}if(h=this.tokenizer.inlineText(m)){e=e.substring(h.raw.length),h.raw.slice(-1)!=="_"&&(a=h.raw.slice(-1)),s=!0;const d=t.at(-1);(d==null?void 0:d.type)==="text"?(d.raw+=h.raw,d.text+=h.text):t.push(h);continue}if(e){const d="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(d);break}else throw new Error(d)}}return t}},dt=class{constructor(r){w(this,"options");w(this,"parser");this.options=r||fe}space(r){return""}code({text:r,lang:e,escaped:t}){var s;const n=(s=(e||"").match(M.notSpaceStart))==null?void 0:s[0],i=r.replace(M.endingNewline,"")+`
`;return n?'<pre><code class="language-'+W(n)+'">'+(t?i:W(i,!0))+`</code></pre>
`:"<pre><code>"+(t?i:W(i,!0))+`</code></pre>
`}blockquote({tokens:r}){return`<blockquote>
${this.parser.parse(r)}</blockquote>
`}html({text:r}){return r}heading({tokens:r,depth:e}){return`<h${e}>${this.parser.parseInline(r)}</h${e}>
`}hr(r){return`<hr>
`}list(r){const e=r.ordered,t=r.start;let n="";for(let a=0;a<r.items.length;a++){const l=r.items[a];n+=this.listitem(l)}const i=e?"ol":"ul",s=e&&t!==1?' start="'+t+'"':"";return"<"+i+s+`>
`+n+"</"+i+`>
`}listitem(r){var t;let e="";if(r.task){const n=this.checkbox({checked:!!r.checked});r.loose?((t=r.tokens[0])==null?void 0:t.type)==="paragraph"?(r.tokens[0].text=n+" "+r.tokens[0].text,r.tokens[0].tokens&&r.tokens[0].tokens.length>0&&r.tokens[0].tokens[0].type==="text"&&(r.tokens[0].tokens[0].text=n+" "+W(r.tokens[0].tokens[0].text),r.tokens[0].tokens[0].escaped=!0)):r.tokens.unshift({type:"text",raw:n+" ",text:n+" ",escaped:!0}):e+=n+" "}return e+=this.parser.parse(r.tokens,!!r.loose),`<li>${e}</li>
`}checkbox({checked:r}){return"<input "+(r?'checked="" ':"")+'disabled="" type="checkbox">'}paragraph({tokens:r}){return`<p>${this.parser.parseInline(r)}</p>
`}table(r){let e="",t="";for(let i=0;i<r.header.length;i++)t+=this.tablecell(r.header[i]);e+=this.tablerow({text:t});let n="";for(let i=0;i<r.rows.length;i++){const s=r.rows[i];t="";for(let a=0;a<s.length;a++)t+=this.tablecell(s[a]);n+=this.tablerow({text:t})}return n&&(n=`<tbody>${n}</tbody>`),`<table>
<thead>
`+e+`</thead>
`+n+`</table>
`}tablerow({text:r}){return`<tr>
${r}</tr>
`}tablecell(r){const e=this.parser.parseInline(r.tokens),t=r.header?"th":"td";return(r.align?`<${t} align="${r.align}">`:`<${t}>`)+e+`</${t}>
`}strong({tokens:r}){return`<strong>${this.parser.parseInline(r)}</strong>`}em({tokens:r}){return`<em>${this.parser.parseInline(r)}</em>`}codespan({text:r}){return`<code>${W(r,!0)}</code>`}br(r){return"<br>"}del({tokens:r}){return`<del>${this.parser.parseInline(r)}</del>`}link({href:r,title:e,tokens:t}){const n=this.parser.parseInline(t),i=Qn(r);if(i===null)return n;r=i;let s='<a href="'+r+'"';return e&&(s+=' title="'+W(e)+'"'),s+=">"+n+"</a>",s}image({href:r,title:e,text:t,tokens:n}){n&&(t=this.parser.parseInline(n,this.parser.textRenderer));const i=Qn(r);if(i===null)return W(t);r=i;let s=`<img src="${r}" alt="${t}"`;return e&&(s+=` title="${W(e)}"`),s+=">",s}text(r){return"tokens"in r&&r.tokens?this.parser.parseInline(r.tokens):"escaped"in r&&r.escaped?r.text:W(r.text)}},un=class{strong({text:r}){return r}em({text:r}){return r}codespan({text:r}){return r}del({text:r}){return r}html({text:r}){return r}text({text:r}){return r}link({text:r}){return""+r}image({text:r}){return""+r}br(){return""}},K=class Vt{constructor(e){w(this,"options");w(this,"renderer");w(this,"textRenderer");this.options=e||fe,this.options.renderer=this.options.renderer||new dt,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new un}static parse(e,t){return new Vt(t).parse(e)}static parseInline(e,t){return new Vt(t).parseInline(e)}parse(e,t=!0){var i,s;let n="";for(let a=0;a<e.length;a++){const l=e[a];if((s=(i=this.options.extensions)==null?void 0:i.renderers)!=null&&s[l.type]){const c=l,h=this.options.extensions.renderers[c.type].call({parser:this},c);if(h!==!1||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(c.type)){n+=h||"";continue}}const p=l;switch(p.type){case"space":{n+=this.renderer.space(p);continue}case"hr":{n+=this.renderer.hr(p);continue}case"heading":{n+=this.renderer.heading(p);continue}case"code":{n+=this.renderer.code(p);continue}case"table":{n+=this.renderer.table(p);continue}case"blockquote":{n+=this.renderer.blockquote(p);continue}case"list":{n+=this.renderer.list(p);continue}case"html":{n+=this.renderer.html(p);continue}case"paragraph":{n+=this.renderer.paragraph(p);continue}case"text":{let c=p,h=this.renderer.text(c);for(;a+1<e.length&&e[a+1].type==="text";)c=e[++a],h+=`
`+this.renderer.text(c);t?n+=this.renderer.paragraph({type:"paragraph",raw:h,text:h,tokens:[{type:"text",raw:h,text:h,escaped:!0}]}):n+=h;continue}default:{const c='Token with "'+p.type+'" type was not found.';if(this.options.silent)return console.error(c),"";throw new Error(c)}}}return n}parseInline(e,t=this.renderer){var i,s;let n="";for(let a=0;a<e.length;a++){const l=e[a];if((s=(i=this.options.extensions)==null?void 0:i.renderers)!=null&&s[l.type]){const c=this.options.extensions.renderers[l.type].call({parser:this},l);if(c!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(l.type)){n+=c||"";continue}}const p=l;switch(p.type){case"escape":{n+=t.text(p);break}case"html":{n+=t.html(p);break}case"link":{n+=t.link(p);break}case"image":{n+=t.image(p);break}case"strong":{n+=t.strong(p);break}case"em":{n+=t.em(p);break}case"codespan":{n+=t.codespan(p);break}case"br":{n+=t.br(p);break}case"del":{n+=t.del(p);break}case"text":{n+=t.text(p);break}default:{const c='Token with "'+p.type+'" type was not found.';if(this.options.silent)return console.error(c),"";throw new Error(c)}}}return n}},jt,ot=(jt=class{constructor(r){w(this,"options");w(this,"block");this.options=r||fe}preprocess(r){return r}postprocess(r){return r}processAllTokens(r){return r}provideLexer(){return this.block?X.lex:X.lexInline}provideParser(){return this.block?K.parse:K.parseInline}},w(jt,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens"])),jt),is=class{constructor(...r){w(this,"defaults",rn());w(this,"options",this.setOptions);w(this,"parse",this.parseMarkdown(!0));w(this,"parseInline",this.parseMarkdown(!1));w(this,"Parser",K);w(this,"Renderer",dt);w(this,"TextRenderer",un);w(this,"Lexer",X);w(this,"Tokenizer",ut);w(this,"Hooks",ot);this.use(...r)}walkTokens(r,e){var n,i;let t=[];for(const s of r)switch(t=t.concat(e.call(this,s)),s.type){case"table":{const a=s;for(const l of a.header)t=t.concat(this.walkTokens(l.tokens,e));for(const l of a.rows)for(const p of l)t=t.concat(this.walkTokens(p.tokens,e));break}case"list":{const a=s;t=t.concat(this.walkTokens(a.items,e));break}default:{const a=s;(i=(n=this.defaults.extensions)==null?void 0:n.childTokens)!=null&&i[a.type]?this.defaults.extensions.childTokens[a.type].forEach(l=>{const p=a[l].flat(1/0);t=t.concat(this.walkTokens(p,e))}):a.tokens&&(t=t.concat(this.walkTokens(a.tokens,e)))}}return t}use(...r){const e=this.defaults.extensions||{renderers:{},childTokens:{}};return r.forEach(t=>{const n={...t};if(n.async=this.defaults.async||n.async||!1,t.extensions&&(t.extensions.forEach(i=>{if(!i.name)throw new Error("extension name required");if("renderer"in i){const s=e.renderers[i.name];s?e.renderers[i.name]=function(...a){let l=i.renderer.apply(this,a);return l===!1&&(l=s.apply(this,a)),l}:e.renderers[i.name]=i.renderer}if("tokenizer"in i){if(!i.level||i.level!=="block"&&i.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");const s=e[i.level];s?s.unshift(i.tokenizer):e[i.level]=[i.tokenizer],i.start&&(i.level==="block"?e.startBlock?e.startBlock.push(i.start):e.startBlock=[i.start]:i.level==="inline"&&(e.startInline?e.startInline.push(i.start):e.startInline=[i.start]))}"childTokens"in i&&i.childTokens&&(e.childTokens[i.name]=i.childTokens)}),n.extensions=e),t.renderer){const i=this.defaults.renderer||new dt(this.defaults);for(const s in t.renderer){if(!(s in i))throw new Error(`renderer '${s}' does not exist`);if(["options","parser"].includes(s))continue;const a=s,l=t.renderer[a],p=i[a];i[a]=(...c)=>{let h=l.apply(i,c);return h===!1&&(h=p.apply(i,c)),h||""}}n.renderer=i}if(t.tokenizer){const i=this.defaults.tokenizer||new ut(this.defaults);for(const s in t.tokenizer){if(!(s in i))throw new Error(`tokenizer '${s}' does not exist`);if(["options","rules","lexer"].includes(s))continue;const a=s,l=t.tokenizer[a],p=i[a];i[a]=(...c)=>{let h=l.apply(i,c);return h===!1&&(h=p.apply(i,c)),h}}n.tokenizer=i}if(t.hooks){const i=this.defaults.hooks||new ot;for(const s in t.hooks){if(!(s in i))throw new Error(`hook '${s}' does not exist`);if(["options","block"].includes(s))continue;const a=s,l=t.hooks[a],p=i[a];ot.passThroughHooks.has(s)?i[a]=c=>{if(this.defaults.async)return Promise.resolve(l.call(i,c)).then(m=>p.call(i,m));const h=l.call(i,c);return p.call(i,h)}:i[a]=(...c)=>{let h=l.apply(i,c);return h===!1&&(h=p.apply(i,c)),h}}n.hooks=i}if(t.walkTokens){const i=this.defaults.walkTokens,s=t.walkTokens;n.walkTokens=function(a){let l=[];return l.push(s.call(this,a)),i&&(l=l.concat(i.call(this,a))),l}}this.defaults={...this.defaults,...n}}),this}setOptions(r){return this.defaults={...this.defaults,...r},this}lexer(r,e){return X.lex(r,e??this.defaults)}parser(r,e){return K.parse(r,e??this.defaults)}parseMarkdown(r){return(t,n)=>{const i={...n},s={...this.defaults,...i},a=this.onError(!!s.silent,!!s.async);if(this.defaults.async===!0&&i.async===!1)return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof t>"u"||t===null)return a(new Error("marked(): input parameter is undefined or null"));if(typeof t!="string")return a(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));s.hooks&&(s.hooks.options=s,s.hooks.block=r);const l=s.hooks?s.hooks.provideLexer():r?X.lex:X.lexInline,p=s.hooks?s.hooks.provideParser():r?K.parse:K.parseInline;if(s.async)return Promise.resolve(s.hooks?s.hooks.preprocess(t):t).then(c=>l(c,s)).then(c=>s.hooks?s.hooks.processAllTokens(c):c).then(c=>s.walkTokens?Promise.all(this.walkTokens(c,s.walkTokens)).then(()=>c):c).then(c=>p(c,s)).then(c=>s.hooks?s.hooks.postprocess(c):c).catch(a);try{s.hooks&&(t=s.hooks.preprocess(t));let c=l(t,s);s.hooks&&(c=s.hooks.processAllTokens(c)),s.walkTokens&&this.walkTokens(c,s.walkTokens);let h=p(c,s);return s.hooks&&(h=s.hooks.postprocess(h)),h}catch(c){return a(c)}}}onError(r,e){return t=>{if(t.message+=`
Please report this to https://github.com/markedjs/marked.`,r){const n="<p>An error occurred:</p><pre>"+W(t.message+"",!0)+"</pre>";return e?Promise.resolve(n):n}if(e)return Promise.reject(t);throw t}}},de=new is;function y(r,e){return de.parse(r,e)}y.options=y.setOptions=function(r){return de.setOptions(r),y.defaults=de.defaults,gr(y.defaults),y};y.getDefaults=rn;y.defaults=fe;y.use=function(...r){return de.use(...r),y.defaults=de.defaults,gr(y.defaults),y};y.walkTokens=function(r,e){return de.walkTokens(r,e)};y.parseInline=de.parseInline;y.Parser=K;y.parser=K.parse;y.Renderer=dt;y.TextRenderer=un;y.Lexer=X;y.lexer=X.lex;y.Tokenizer=ut;y.Hooks=ot;y.parse=y;y.options;y.setOptions;y.use;y.walkTokens;y.parseInline;K.parse;X.lex;/*! @license DOMPurify 3.3.3 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.3.3/LICENSE */const{entries:Er,setPrototypeOf:tr,isFrozen:ss,getPrototypeOf:os,getOwnPropertyDescriptor:as}=Object;let{freeze:z,seal:F,create:at}=Object,{apply:Yt,construct:Xt}=typeof Reflect<"u"&&Reflect;z||(z=function(e){return e});F||(F=function(e){return e});Yt||(Yt=function(e,t){for(var n=arguments.length,i=new Array(n>2?n-2:0),s=2;s<n;s++)i[s-2]=arguments[s];return e.apply(t,i)});Xt||(Xt=function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),i=1;i<t;i++)n[i-1]=arguments[i];return new e(...n)});const rt=U(Array.prototype.forEach),ls=U(Array.prototype.lastIndexOf),nr=U(Array.prototype.pop),Oe=U(Array.prototype.push),cs=U(Array.prototype.splice),lt=U(String.prototype.toLowerCase),zt=U(String.prototype.toString),Ut=U(String.prototype.match),Le=U(String.prototype.replace),ps=U(String.prototype.indexOf),hs=U(String.prototype.trim),B=U(Object.prototype.hasOwnProperty),D=U(RegExp.prototype.test),Pe=us(TypeError);function U(r){return function(e){e instanceof RegExp&&(e.lastIndex=0);for(var t=arguments.length,n=new Array(t>1?t-1:0),i=1;i<t;i++)n[i-1]=arguments[i];return Yt(r,e,n)}}function us(r){return function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return Xt(r,t)}}function x(r,e){let t=arguments.length>2&&arguments[2]!==void 0?arguments[2]:lt;tr&&tr(r,null);let n=e.length;for(;n--;){let i=e[n];if(typeof i=="string"){const s=t(i);s!==i&&(ss(e)||(e[n]=s),i=s)}r[i]=!0}return r}function ds(r){for(let e=0;e<r.length;e++)B(r,e)||(r[e]=null);return r}function q(r){const e=at(null);for(const[t,n]of Er(r))B(r,t)&&(Array.isArray(n)?e[t]=ds(n):n&&typeof n=="object"&&n.constructor===Object?e[t]=q(n):e[t]=n);return e}function Ie(r,e){for(;r!==null;){const n=as(r,e);if(n){if(n.get)return U(n.get);if(typeof n.value=="function")return U(n.value)}r=os(r)}function t(){return null}return t}const rr=z(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),Ht=z(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),Bt=z(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),fs=z(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),Ft=z(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),gs=z(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),ir=z(["#text"]),sr=z(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),Gt=z(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),or=z(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),it=z(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),ms=F(/\{\{[\w\W]*|[\w\W]*\}\}/gm),bs=F(/<%[\w\W]*|[\w\W]*%>/gm),xs=F(/\$\{[\w\W]*/gm),_s=F(/^data-[\-\w.\u00B7-\uFFFF]+$/),ys=F(/^aria-[\-\w]+$/),Sr=F(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),ks=F(/^(?:\w+script|data):/i),ws=F(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),$r=F(/^html$/i),As=F(/^[a-z][.\w]*(-[.\w]+)+$/i);var ar=Object.freeze({__proto__:null,ARIA_ATTR:ys,ATTR_WHITESPACE:ws,CUSTOM_ELEMENT:As,DATA_ATTR:_s,DOCTYPE_NAME:$r,ERB_EXPR:bs,IS_ALLOWED_URI:Sr,IS_SCRIPT_OR_DATA:ks,MUSTACHE_EXPR:ms,TMPLIT_EXPR:xs});const De={element:1,text:3,progressingInstruction:7,comment:8,document:9},vs=function(){return typeof window>"u"?null:window},Ts=function(e,t){if(typeof e!="object"||typeof e.createPolicy!="function")return null;let n=null;const i="data-tt-policy-suffix";t&&t.hasAttribute(i)&&(n=t.getAttribute(i));const s="dompurify"+(n?"#"+n:"");try{return e.createPolicy(s,{createHTML(a){return a},createScriptURL(a){return a}})}catch{return console.warn("TrustedTypes policy "+s+" could not be created."),null}},lr=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}};function Rr(){let r=arguments.length>0&&arguments[0]!==void 0?arguments[0]:vs();const e=g=>Rr(g);if(e.version="3.3.3",e.removed=[],!r||!r.document||r.document.nodeType!==De.document||!r.Element)return e.isSupported=!1,e;let{document:t}=r;const n=t,i=n.currentScript,{DocumentFragment:s,HTMLTemplateElement:a,Node:l,Element:p,NodeFilter:c,NamedNodeMap:h=r.NamedNodeMap||r.MozNamedAttrMap,HTMLFormElement:m,DOMParser:d,trustedTypes:_}=r,b=p.prototype,L=Ie(b,"cloneNode"),qe=Ie(b,"remove"),ve=Ie(b,"nextSibling"),Ze=Ie(b,"childNodes"),te=Ie(b,"parentNode");if(typeof a=="function"){const g=t.createElement("template");g.content&&g.content.ownerDocument&&(t=g.content.ownerDocument)}let $,ne="";const{implementation:re,createNodeIterator:ie,createDocumentFragment:Or,getElementsByTagName:Lr}=t,{importNode:Pr}=n;let I=lr();e.isSupported=typeof Er=="function"&&typeof te=="function"&&re&&re.createHTMLDocument!==void 0;const{MUSTACHE_EXPR:yt,ERB_EXPR:kt,TMPLIT_EXPR:wt,DATA_ATTR:Ir,ARIA_ATTR:Dr,IS_SCRIPT_OR_DATA:Nr,ATTR_WHITESPACE:gn,CUSTOM_ELEMENT:Mr}=ar;let{IS_ALLOWED_URI:mn}=ar,R=null;const bn=x({},[...rr,...Ht,...Bt,...Ft,...ir]);let C=null;const xn=x({},[...sr,...Gt,...or,...it]);let v=Object.seal(at(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),Te=null,Ve=null;const Q=Object.seal(at(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}}));let _n=!0,At=!0,yn=!1,kn=!0,ge=!1,Ye=!0,se=!1,vt=!1,Tt=!1,me=!1,Xe=!1,Ke=!1,wn=!0,An=!1;const zr="user-content-";let Et=!0,Ee=!1,be={},G=null;const St=x({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]);let vn=null;const Tn=x({},["audio","video","img","source","image","track"]);let $t=null;const En=x({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),Qe="http://www.w3.org/1998/Math/MathML",Je="http://www.w3.org/2000/svg",Z="http://www.w3.org/1999/xhtml";let xe=Z,Rt=!1,Ct=null;const Ur=x({},[Qe,Je,Z],zt);let et=x({},["mi","mo","mn","ms","mtext"]),tt=x({},["annotation-xml"]);const Hr=x({},["title","style","font","a","script"]);let Se=null;const Br=["application/xhtml+xml","text/html"],Fr="text/html";let S=null,_e=null;const Gr=t.createElement("form"),Sn=function(o){return o instanceof RegExp||o instanceof Function},Ot=function(){let o=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!(_e&&_e===o)){if((!o||typeof o!="object")&&(o={}),o=q(o),Se=Br.indexOf(o.PARSER_MEDIA_TYPE)===-1?Fr:o.PARSER_MEDIA_TYPE,S=Se==="application/xhtml+xml"?zt:lt,R=B(o,"ALLOWED_TAGS")?x({},o.ALLOWED_TAGS,S):bn,C=B(o,"ALLOWED_ATTR")?x({},o.ALLOWED_ATTR,S):xn,Ct=B(o,"ALLOWED_NAMESPACES")?x({},o.ALLOWED_NAMESPACES,zt):Ur,$t=B(o,"ADD_URI_SAFE_ATTR")?x(q(En),o.ADD_URI_SAFE_ATTR,S):En,vn=B(o,"ADD_DATA_URI_TAGS")?x(q(Tn),o.ADD_DATA_URI_TAGS,S):Tn,G=B(o,"FORBID_CONTENTS")?x({},o.FORBID_CONTENTS,S):St,Te=B(o,"FORBID_TAGS")?x({},o.FORBID_TAGS,S):q({}),Ve=B(o,"FORBID_ATTR")?x({},o.FORBID_ATTR,S):q({}),be=B(o,"USE_PROFILES")?o.USE_PROFILES:!1,_n=o.ALLOW_ARIA_ATTR!==!1,At=o.ALLOW_DATA_ATTR!==!1,yn=o.ALLOW_UNKNOWN_PROTOCOLS||!1,kn=o.ALLOW_SELF_CLOSE_IN_ATTR!==!1,ge=o.SAFE_FOR_TEMPLATES||!1,Ye=o.SAFE_FOR_XML!==!1,se=o.WHOLE_DOCUMENT||!1,me=o.RETURN_DOM||!1,Xe=o.RETURN_DOM_FRAGMENT||!1,Ke=o.RETURN_TRUSTED_TYPE||!1,Tt=o.FORCE_BODY||!1,wn=o.SANITIZE_DOM!==!1,An=o.SANITIZE_NAMED_PROPS||!1,Et=o.KEEP_CONTENT!==!1,Ee=o.IN_PLACE||!1,mn=o.ALLOWED_URI_REGEXP||Sr,xe=o.NAMESPACE||Z,et=o.MATHML_TEXT_INTEGRATION_POINTS||et,tt=o.HTML_INTEGRATION_POINTS||tt,v=o.CUSTOM_ELEMENT_HANDLING||{},o.CUSTOM_ELEMENT_HANDLING&&Sn(o.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(v.tagNameCheck=o.CUSTOM_ELEMENT_HANDLING.tagNameCheck),o.CUSTOM_ELEMENT_HANDLING&&Sn(o.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(v.attributeNameCheck=o.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),o.CUSTOM_ELEMENT_HANDLING&&typeof o.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(v.allowCustomizedBuiltInElements=o.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),ge&&(At=!1),Xe&&(me=!0),be&&(R=x({},ir),C=at(null),be.html===!0&&(x(R,rr),x(C,sr)),be.svg===!0&&(x(R,Ht),x(C,Gt),x(C,it)),be.svgFilters===!0&&(x(R,Bt),x(C,Gt),x(C,it)),be.mathMl===!0&&(x(R,Ft),x(C,or),x(C,it))),B(o,"ADD_TAGS")||(Q.tagCheck=null),B(o,"ADD_ATTR")||(Q.attributeCheck=null),o.ADD_TAGS&&(typeof o.ADD_TAGS=="function"?Q.tagCheck=o.ADD_TAGS:(R===bn&&(R=q(R)),x(R,o.ADD_TAGS,S))),o.ADD_ATTR&&(typeof o.ADD_ATTR=="function"?Q.attributeCheck=o.ADD_ATTR:(C===xn&&(C=q(C)),x(C,o.ADD_ATTR,S))),o.ADD_URI_SAFE_ATTR&&x($t,o.ADD_URI_SAFE_ATTR,S),o.FORBID_CONTENTS&&(G===St&&(G=q(G)),x(G,o.FORBID_CONTENTS,S)),o.ADD_FORBID_CONTENTS&&(G===St&&(G=q(G)),x(G,o.ADD_FORBID_CONTENTS,S)),Et&&(R["#text"]=!0),se&&x(R,["html","head","body"]),R.table&&(x(R,["tbody"]),delete Te.tbody),o.TRUSTED_TYPES_POLICY){if(typeof o.TRUSTED_TYPES_POLICY.createHTML!="function")throw Pe('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof o.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw Pe('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');$=o.TRUSTED_TYPES_POLICY,ne=$.createHTML("")}else $===void 0&&($=Ts(_,i)),$!==null&&typeof ne=="string"&&(ne=$.createHTML(""));z&&z(o),_e=o}},$n=x({},[...Ht,...Bt,...fs]),Rn=x({},[...Ft,...gs]),jr=function(o){let u=te(o);(!u||!u.tagName)&&(u={namespaceURI:xe,tagName:"template"});const f=lt(o.tagName),A=lt(u.tagName);return Ct[o.namespaceURI]?o.namespaceURI===Je?u.namespaceURI===Z?f==="svg":u.namespaceURI===Qe?f==="svg"&&(A==="annotation-xml"||et[A]):!!$n[f]:o.namespaceURI===Qe?u.namespaceURI===Z?f==="math":u.namespaceURI===Je?f==="math"&&tt[A]:!!Rn[f]:o.namespaceURI===Z?u.namespaceURI===Je&&!tt[A]||u.namespaceURI===Qe&&!et[A]?!1:!Rn[f]&&(Hr[f]||!$n[f]):!!(Se==="application/xhtml+xml"&&Ct[o.namespaceURI]):!1},j=function(o){Oe(e.removed,{element:o});try{te(o).removeChild(o)}catch{qe(o)}},oe=function(o,u){try{Oe(e.removed,{attribute:u.getAttributeNode(o),from:u})}catch{Oe(e.removed,{attribute:null,from:u})}if(u.removeAttribute(o),o==="is")if(me||Xe)try{j(u)}catch{}else try{u.setAttribute(o,"")}catch{}},Cn=function(o){let u=null,f=null;if(Tt)o="<remove></remove>"+o;else{const T=Ut(o,/^[\r\n\t ]+/);f=T&&T[0]}Se==="application/xhtml+xml"&&xe===Z&&(o='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+o+"</body></html>");const A=$?$.createHTML(o):o;if(xe===Z)try{u=new d().parseFromString(A,Se)}catch{}if(!u||!u.documentElement){u=re.createDocument(xe,"template",null);try{u.documentElement.innerHTML=Rt?ne:A}catch{}}const P=u.body||u.documentElement;return o&&f&&P.insertBefore(t.createTextNode(f),P.childNodes[0]||null),xe===Z?Lr.call(u,se?"html":"body")[0]:se?u.documentElement:P},On=function(o){return ie.call(o.ownerDocument||o,o,c.SHOW_ELEMENT|c.SHOW_COMMENT|c.SHOW_TEXT|c.SHOW_PROCESSING_INSTRUCTION|c.SHOW_CDATA_SECTION,null)},Lt=function(o){return o instanceof m&&(typeof o.nodeName!="string"||typeof o.textContent!="string"||typeof o.removeChild!="function"||!(o.attributes instanceof h)||typeof o.removeAttribute!="function"||typeof o.setAttribute!="function"||typeof o.namespaceURI!="string"||typeof o.insertBefore!="function"||typeof o.hasChildNodes!="function")},Ln=function(o){return typeof l=="function"&&o instanceof l};function V(g,o,u){rt(g,f=>{f.call(e,o,u,_e)})}const Pn=function(o){let u=null;if(V(I.beforeSanitizeElements,o,null),Lt(o))return j(o),!0;const f=S(o.nodeName);if(V(I.uponSanitizeElement,o,{tagName:f,allowedTags:R}),Ye&&o.hasChildNodes()&&!Ln(o.firstElementChild)&&D(/<[/\w!]/g,o.innerHTML)&&D(/<[/\w!]/g,o.textContent)||o.nodeType===De.progressingInstruction||Ye&&o.nodeType===De.comment&&D(/<[/\w]/g,o.data))return j(o),!0;if(!(Q.tagCheck instanceof Function&&Q.tagCheck(f))&&(!R[f]||Te[f])){if(!Te[f]&&Dn(f)&&(v.tagNameCheck instanceof RegExp&&D(v.tagNameCheck,f)||v.tagNameCheck instanceof Function&&v.tagNameCheck(f)))return!1;if(Et&&!G[f]){const A=te(o)||o.parentNode,P=Ze(o)||o.childNodes;if(P&&A){const T=P.length;for(let H=T-1;H>=0;--H){const Y=L(P[H],!0);Y.__removalCount=(o.__removalCount||0)+1,A.insertBefore(Y,ve(o))}}}return j(o),!0}return o instanceof p&&!jr(o)||(f==="noscript"||f==="noembed"||f==="noframes")&&D(/<\/no(script|embed|frames)/i,o.innerHTML)?(j(o),!0):(ge&&o.nodeType===De.text&&(u=o.textContent,rt([yt,kt,wt],A=>{u=Le(u,A," ")}),o.textContent!==u&&(Oe(e.removed,{element:o.cloneNode()}),o.textContent=u)),V(I.afterSanitizeElements,o,null),!1)},In=function(o,u,f){if(Ve[u]||wn&&(u==="id"||u==="name")&&(f in t||f in Gr))return!1;if(!(At&&!Ve[u]&&D(Ir,u))){if(!(_n&&D(Dr,u))){if(!(Q.attributeCheck instanceof Function&&Q.attributeCheck(u,o))){if(!C[u]||Ve[u]){if(!(Dn(o)&&(v.tagNameCheck instanceof RegExp&&D(v.tagNameCheck,o)||v.tagNameCheck instanceof Function&&v.tagNameCheck(o))&&(v.attributeNameCheck instanceof RegExp&&D(v.attributeNameCheck,u)||v.attributeNameCheck instanceof Function&&v.attributeNameCheck(u,o))||u==="is"&&v.allowCustomizedBuiltInElements&&(v.tagNameCheck instanceof RegExp&&D(v.tagNameCheck,f)||v.tagNameCheck instanceof Function&&v.tagNameCheck(f))))return!1}else if(!$t[u]){if(!D(mn,Le(f,gn,""))){if(!((u==="src"||u==="xlink:href"||u==="href")&&o!=="script"&&ps(f,"data:")===0&&vn[o])){if(!(yn&&!D(Nr,Le(f,gn,"")))){if(f)return!1}}}}}}}return!0},Dn=function(o){return o!=="annotation-xml"&&Ut(o,Mr)},Nn=function(o){V(I.beforeSanitizeAttributes,o,null);const{attributes:u}=o;if(!u||Lt(o))return;const f={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:C,forceKeepAttr:void 0};let A=u.length;for(;A--;){const P=u[A],{name:T,namespaceURI:H,value:Y}=P,ye=S(T),Pt=Y;let O=T==="value"?Pt:hs(Pt);if(f.attrName=ye,f.attrValue=O,f.keepAttr=!0,f.forceKeepAttr=void 0,V(I.uponSanitizeAttribute,o,f),O=f.attrValue,An&&(ye==="id"||ye==="name")&&(oe(T,o),O=zr+O),Ye&&D(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i,O)){oe(T,o);continue}if(ye==="attributename"&&Ut(O,"href")){oe(T,o);continue}if(f.forceKeepAttr)continue;if(!f.keepAttr){oe(T,o);continue}if(!kn&&D(/\/>/i,O)){oe(T,o);continue}ge&&rt([yt,kt,wt],zn=>{O=Le(O,zn," ")});const Mn=S(o.nodeName);if(!In(Mn,ye,O)){oe(T,o);continue}if($&&typeof _=="object"&&typeof _.getAttributeType=="function"&&!H)switch(_.getAttributeType(Mn,ye)){case"TrustedHTML":{O=$.createHTML(O);break}case"TrustedScriptURL":{O=$.createScriptURL(O);break}}if(O!==Pt)try{H?o.setAttributeNS(H,T,O):o.setAttribute(T,O),Lt(o)?j(o):nr(e.removed)}catch{oe(T,o)}}V(I.afterSanitizeAttributes,o,null)},Wr=function g(o){let u=null;const f=On(o);for(V(I.beforeSanitizeShadowDOM,o,null);u=f.nextNode();)V(I.uponSanitizeShadowNode,u,null),Pn(u),Nn(u),u.content instanceof s&&g(u.content);V(I.afterSanitizeShadowDOM,o,null)};return e.sanitize=function(g){let o=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},u=null,f=null,A=null,P=null;if(Rt=!g,Rt&&(g="<!-->"),typeof g!="string"&&!Ln(g))if(typeof g.toString=="function"){if(g=g.toString(),typeof g!="string")throw Pe("dirty is not a string, aborting")}else throw Pe("toString is not a function");if(!e.isSupported)return g;if(vt||Ot(o),e.removed=[],typeof g=="string"&&(Ee=!1),Ee){if(g.nodeName){const Y=S(g.nodeName);if(!R[Y]||Te[Y])throw Pe("root node is forbidden and cannot be sanitized in-place")}}else if(g instanceof l)u=Cn("<!---->"),f=u.ownerDocument.importNode(g,!0),f.nodeType===De.element&&f.nodeName==="BODY"||f.nodeName==="HTML"?u=f:u.appendChild(f);else{if(!me&&!ge&&!se&&g.indexOf("<")===-1)return $&&Ke?$.createHTML(g):g;if(u=Cn(g),!u)return me?null:Ke?ne:""}u&&Tt&&j(u.firstChild);const T=On(Ee?g:u);for(;A=T.nextNode();)Pn(A),Nn(A),A.content instanceof s&&Wr(A.content);if(Ee)return g;if(me){if(Xe)for(P=Or.call(u.ownerDocument);u.firstChild;)P.appendChild(u.firstChild);else P=u;return(C.shadowroot||C.shadowrootmode)&&(P=Pr.call(n,P,!0)),P}let H=se?u.outerHTML:u.innerHTML;return se&&R["!doctype"]&&u.ownerDocument&&u.ownerDocument.doctype&&u.ownerDocument.doctype.name&&D($r,u.ownerDocument.doctype.name)&&(H="<!DOCTYPE "+u.ownerDocument.doctype.name+`>
`+H),ge&&rt([yt,kt,wt],Y=>{H=Le(H,Y," ")}),$&&Ke?$.createHTML(H):H},e.setConfig=function(){let g=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};Ot(g),vt=!0},e.clearConfig=function(){_e=null,vt=!1},e.isValidAttribute=function(g,o,u){_e||Ot({});const f=S(g),A=S(o);return In(f,A,u)},e.addHook=function(g,o){typeof o=="function"&&Oe(I[g],o)},e.removeHook=function(g,o){if(o!==void 0){const u=ls(I[g],o);return u===-1?void 0:cs(I[g],u,1)[0]}return nr(I[g])},e.removeHooks=function(g){I[g]=[]},e.removeAllHooks=function(){I=lr()},e}var Es=Rr(),Ss=Object.defineProperty,$s=Object.getOwnPropertyDescriptor,dn=(r,e,t,n)=>{for(var i=n>1?void 0:n?$s(e,t):e,s=r.length-1,a;s>=0;s--)(a=r[s])&&(i=(n?a(e,t,i):a(i))||i);return n&&i&&Ss(e,t,i),i};const Cr=new y.Renderer;Cr.link=function({href:r,text:e}){return`<a href="${r&&(r.startsWith("http://")||r.startsWith("https://"))?r:"#"}" target="_blank" rel="noopener noreferrer">${e}</a>`};y.setOptions({renderer:Cr});let Fe=class extends pe{constructor(){super(...arguments),this.role="agent",this.content=""}render(){const r=this.role==="agent"?wi(Es.sanitize(y.parse(this.content))):this.content;return N`<div class="bubble ${this.role}">${r}</div>`}};Fe.styles=Jt`
    :host { display: block; margin-bottom: 8px; }

    .bubble {
      padding: 14px 18px;
      font-size: 14px;
      line-height: 1.7;
      word-wrap: break-word;
      max-width: 90%;
    }

    .user {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.08));
      border: 1px solid rgba(59, 130, 246, 0.2);
      border-radius: var(--radius-lg) var(--radius-lg) var(--radius-sm) var(--radius-lg);
      margin-left: auto;
      color: var(--text-primary);
      font-weight: 400;
      max-width: 70%;
    }

    .agent {
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm) var(--radius-lg) var(--radius-lg) var(--radius-lg);
    }

    /* typography */
    .agent h1, .agent h2, .agent h3 {
      font-family: var(--font-body);
      font-weight: 600;
      color: var(--text-primary);
      margin: 20px 0 8px;
      letter-spacing: -0.01em;
    }
    .agent h1 { font-size: 18px; }
    .agent h2 { font-size: 16px; border-bottom: 1px solid var(--border); padding-bottom: 6px; }
    .agent h3 { font-size: 14px; color: var(--amber); }

    .agent p { margin: 6px 0; }

    .agent strong { color: var(--amber); font-weight: 600; }

    .agent a {
      color: var(--accent);
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: border-color 0.2s;
    }
    .agent a:hover {
      border-bottom-color: var(--accent);
    }

    .agent ul, .agent ol {
      padding-left: 20px;
      margin: 6px 0;
    }
    .agent li { margin: 3px 0; }
    .agent li::marker { color: var(--text-muted); }

    /* tables */
    .agent table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      margin: 12px 0;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      overflow: hidden;
    }

    .agent thead {
      background: var(--bg-elevated);
    }

    .agent th {
      padding: 10px 12px;
      text-align: left;
      color: var(--text-secondary);
      font-weight: 500;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      border-bottom: 1px solid var(--border-light);
    }

    .agent td {
      padding: 8px 12px;
      border-bottom: 1px solid var(--border);
      color: var(--text-primary);
    }

    .agent tbody tr {
      transition: background 0.15s;
    }

    .agent tbody tr:hover {
      background: var(--amber-glow);
    }

    .agent tbody tr:last-child td {
      border-bottom: none;
    }

    /* code */
    .agent code {
      font-family: var(--font-mono);
      font-size: 12px;
      background: var(--bg-tertiary);
      padding: 2px 6px;
      border-radius: 4px;
    }

    .agent pre {
      background: var(--bg-tertiary);
      padding: 12px;
      border-radius: var(--radius-md);
      overflow-x: auto;
      margin: 8px 0;
    }
    .agent pre code {
      background: none;
      padding: 0;
    }

    .agent hr {
      border: none;
      border-top: 1px solid var(--border);
      margin: 16px 0;
    }

    .agent blockquote {
      border-left: 3px solid var(--amber-dim);
      padding-left: 12px;
      color: var(--text-secondary);
      margin: 8px 0;
    }
  `;dn([gt()],Fe.prototype,"role",2);dn([gt()],Fe.prototype,"content",2);Fe=dn([nn("message-bubble")],Fe);var Rs=Object.defineProperty,Cs=Object.getOwnPropertyDescriptor,fn=(r,e,t,n)=>{for(var i=n>1?void 0:n?Cs(e,t):e,s=r.length-1,a;s>=0;s--)(a=r[s])&&(i=(n?a(e,t,i):a(i))||i);return n&&i&&Rs(e,t,i),i};let Ge=class extends pe{constructor(){super(...arguments),this.lines=[],this.collapsed=!0}classify(r){return r.includes("✓")?"success":r.includes("search_")||r.includes("resolve_")?"search":r.includes("write_")||r.includes("update_")?"write":""}render(){const r=N`<svg class="log-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,e=N`<svg class="chevron ${this.collapsed?"":"open"}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>`;return N`
      <div class="log-wrapper">
        <div class="log-header" @click=${()=>this.collapsed=!this.collapsed}>
          ${r}
          <span class="log-label">agent activity</span>
          <span class="log-count">${this.lines.length} ops</span>
          ${e}
        </div>
        ${this.collapsed?"":N`<div class="log-body">
              ${this.lines.map(t=>N`<div class="line ${this.classify(t)}">${t}</div>`)}
            </div>`}
      </div>
    `}};Ge.styles=Jt`
    :host { display: block; margin: 6px 0; }

    .log-wrapper {
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      overflow: hidden;
      background: var(--bg-primary);
    }

    .log-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      cursor: pointer;
      user-select: none;
      transition: background 0.15s;
    }
    .log-header:hover {
      background: var(--bg-secondary);
    }

    .log-icon {
      width: 14px;
      height: 14px;
      color: var(--amber-dim);
      flex-shrink: 0;
    }

    .log-label {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-muted);
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .log-count {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-muted);
      margin-left: auto;
    }

    .chevron {
      width: 12px;
      height: 12px;
      color: var(--text-muted);
      transition: transform 0.2s;
      flex-shrink: 0;
    }
    .chevron.open { transform: rotate(90deg); }

    .log-body {
      padding: 0 12px 10px;
      max-height: 180px;
      overflow-y: auto;
    }

    .line {
      font-family: var(--font-mono);
      font-size: 11.5px;
      line-height: 1.7;
      white-space: pre-wrap;
      color: var(--text-secondary);
    }

    .line.search { color: var(--amber-dim); }
    .line.success { color: var(--success); }
    .line.write { color: var(--text-muted); }
  `;fn([gt({type:Array})],Ge.prototype,"lines",2);fn([mt()],Ge.prototype,"collapsed",2);Ge=fn([nn("tool-log")],Ge);
