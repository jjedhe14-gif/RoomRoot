import{c as o}from"./index-oj0OrLgn.js";import{W as c}from"./wrench-D5pWKiWn.js";import{M as r,F as p,C as s}from"./AdminApp-gG5UjHW5.js";import{S as i,M as d}from"./shield-check-4_4YDthO.js";import{C as E}from"./circle-check-BBWoeRC-.js";import{T as m}from"./trash-2-DUhmUJAP.js";import{P as a}from"./pencil-line-B5lr0sfW.js";import{S as l}from"./shield-CZgTMbeP.js";import{B as T}from"./badge-check-cnhSeeGf.js";import{U as A}from"./user-plus-BD_wk5K6.js";/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=o("Activity",[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]]);/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=o("CirclePlus",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"M12 8v8",key:"napkw2"}]]);/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n=o("ToggleRight",[["rect",{width:"20",height:"12",x:"2",y:"6",rx:"6",ry:"6",key:"f2vt7d"}],["circle",{cx:"16",cy:"12",r:"2",key:"4ma0v8"}]]);/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=o("UserCog",[["circle",{cx:"18",cy:"15",r:"3",key:"gjjjvw"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M10 15H6a4 4 0 0 0-4 4v2",key:"1nfge6"}],["path",{d:"m21.7 16.4-.9-.3",key:"12j9ji"}],["path",{d:"m15.2 13.9-.9-.3",key:"1fdjdi"}],["path",{d:"m16.6 18.7.3-.9",key:"heedtr"}],["path",{d:"m19.1 12.2.3-.9",key:"1af3ki"}],["path",{d:"m19.6 18.7-.4-1",key:"1x9vze"}],["path",{d:"m16.8 12.3-.4-1",key:"vqeiwj"}],["path",{d:"m14.3 16.6 1-.4",key:"1qlj63"}],["path",{d:"m20.7 13.8 1-.4",key:"1v5t8k"}]]),R={USER_REGISTERED:{icon:A,tone:"green",caption:"New account"},USER_VERIFIED:{icon:T,tone:"teal",caption:"Email verified"},USER_STATUS_CHANGED:{icon:h,tone:"amber",caption:"Account status changed"},USER_PROFILE_UPDATED:{icon:a,tone:"slate",caption:"Profile updated"},ADMIN_ACTION:{icon:l,tone:"violet",caption:"Admin action"},OTP_REQUESTED:{icon:d,tone:"blue",caption:"Code requested"},OTP_VERIFIED:{icon:i,tone:"green",caption:"Code verified"},LISTING_CREATED:{icon:S,tone:"blue",caption:"Listing created"},LISTING_UPDATED:{icon:a,tone:"slate",caption:"Listing updated"},LISTING_STATUS_CHANGED:{icon:n,tone:"amber",caption:"Listing moderated"},LISTING_DELETED:{icon:m,tone:"red",caption:"Listing deleted"},APPLICATION_CREATED:{icon:s,tone:"teal",caption:"Application submitted"},APPLICATION_STATUS_CHANGED:{icon:E,tone:"green",caption:"Application updated"},REPORT_CREATED:{icon:p,tone:"amber",caption:"Report filed"},REPORT_STATUS_CHANGED:{icon:i,tone:"violet",caption:"Report moderated"},CONVERSATION_CREATED:{icon:r,tone:"blue",caption:"Conversation started"},SERVICE_REQUEST_CREATED:{icon:c,tone:"amber",caption:"Service requested"},SERVICE_REQUEST_STATUS_CHANGED:{icon:n,tone:"amber",caption:"Service request updated"}};function L(e){if(e){const t=R[e.toUpperCase()];if(t)return t}return{icon:C,tone:"slate",caption:"Platform event"}}function P(e){return e?e.toLowerCase().split("_").map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" "):"—"}export{L as a,P as b};
