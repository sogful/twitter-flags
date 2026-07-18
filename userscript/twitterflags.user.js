// ==UserScript==

// @name         twitter flags & more
// @description  browse hidden stuff inside the twitter client with a side panel!
// @version      2.1

// @namespace    https://github.com/sogful/twitter-flags
// @author       cv

// @match        https://x.com/*
// @match        https://*.x.com/*
// @match        https://mobile.x.com/*
// @match        https://twitter.com/*
// @match        https://*.twitter.com/*
// @match        https://mobile.twitter.com/*
// @match        https://twitter.app.link/*
// @match        https://twitter.test-app.link/*
// @match        https://twitter-alternate.test-app.link/*
// @match        https://x.app.link/*
// @match        https://x-alternate.app.link/*
// @match        https://x.test-app.link/*
// @match        https://x-alternate.test-app.link/*

// @exclude      https://ads.x.com/*
// @exclude      https://ads.twitter.com/*
// @exclude      https://ads-api.x.com/*
// @exclude      https://ads-api.twitter.com/*
// @exclude      https://analytics.x.com/*
// @exclude      https://analytics.twitter.com/*
// @exclude      https://business.x.com/*
// @exclude      https://business.twitter.com/*
// @exclude      https://developer.x.com/*
// @exclude      https://developer.twitter.com/*
// @exclude      https://help.x.com/*
// @exclude      https://help.twitter.com/*
// @exclude      https://support.x.com/*
// @exclude      https://support.twitter.com/*
// @exclude      https://blog.x.com/*
// @exclude      https://blog.twitter.com/*
// @exclude      https://about.x.com/*
// @exclude      https://about.twitter.com/*
// @exclude      https://careers.x.com/*
// @exclude      https://careers.twitter.com/*
// @exclude      https://legal.x.com/*
// @exclude      https://legal.twitter.com/*
// @exclude      https://privacy.x.com/*
// @exclude      https://privacy.twitter.com/*
// @exclude      https://pro.x.com/*
// @exclude      https://pro.twitter.com/*
// @exclude      https://transparency.x.com/*
// @exclude      https://transparency.twitter.com/*
// @exclude      https://cards.x.com/*
// @exclude      https://cards.twitter.com/*
// @exclude      https://publish.x.com/*
// @exclude      https://publish.twitter.com/*
// @exclude      https://platform.x.com/*
// @exclude      https://platform.twitter.com/*
// @exclude      https://api.x.com/*
// @exclude      https://api.twitter.com/*
// @exclude      https://upload.x.com/*
// @exclude      https://upload.twitter.com/*
// @exclude      https://ton.x.com/*
// @exclude      https://ton.twitter.com/*
// @exclude      https://media.x.com/*
// @exclude      https://media.twitter.com/*
// @exclude      https://brand.x.com/*
// @exclude      https://brand.twitter.com/*
// @exclude      https://marketing.x.com/*
// @exclude      https://marketing.twitter.com/*
// @exclude      https://investor.x.com/*
// @exclude      https://investor.twitter.com/*
// @exclude      https://engineering.x.com/*
// @exclude      https://engineering.twitter.com/*
// @exclude      https://press.x.com/*
// @exclude      https://press.twitter.com/*
// @exclude      https://pr.x.com/*
// @exclude      https://pr.twitter.com/*
// @exclude      https://gdpr.x.com/*
// @exclude      https://gdpr.twitter.com/*

// @exclude      /\.(?:js|mjs|json|css|map|png|jpe?g|gif|svg|webp|avif|ico|woff2?|ttf|otf|eot|mp4|webm|m3u8|wasm|xml|txt|pdf)(?:[?#].*)?$/i
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMTI4IDEyOCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0wIDk2LjZjMS0xIDMuOC0xMy45IDQuNS0xNi40bDEwLjUtNDEgMy41LTE0cTEtNC45IDIuNC05LjZjMi02IDUuNS00LjYgMTAuMi0zLjRMNDEuNSAxNWwzMCA3LjcgMzQuNiA4LjZxOC43IDIgMTcuMyA0LjVjMiAuNiAzLjQgMi4yIDQuNiAzLjh2Mi45Yy02IDcuMy0xMy4xIDE0LjEtMTkgMjEuNy0yIDIuNy03LjMgNy4yLTcuNyAxMC45LjIgMi42IDEuNyA3LjIgMi4zIDEwbDQgMTcuN2MxIDQuNy42IDQuOSAyLjUgMTBhOSA5IDAgMCAxLTMuMyA0Yy02IDEtMTEtLjktMTYuOC0yLjNMNjkuNiAxMDlhODcyIDg3MiAwIDAgMC00OC43LTExLjdjLjMgMi40LTYuOSAyNi44LTggMzAuN0gweiIvPjxwYXRoIGQ9Ik0wIDk2LjZjMS0xIDMuOC0xMy45IDQuNS0xNi40bDEwLjUtNDEgMy41LTE0cTEtNC45IDIuNC05LjZjMi02IDUuNS00LjYgMTAuMi0zLjRMNDEuNSAxNWwzMCA3LjcgMzQuNiA4LjZxOC43IDIgMTcuMyA0LjVjMiAuNiAzLjQgMi4yIDQuNiAzLjh2Mi45Yy02IDcuMy0xMy4xIDE0LjEtMTkgMjEuNy0yIDIuNy03LjMgNy4yLTcuNyAxMC45LjIgMi42IDEuNyA3LjIgMi4zIDEwbDQgMTcuN2MxIDQuNy42IDQuOSAyLjUgMTBhOSA5IDAgMCAxLTMuMyA0Yy02IDEtMTEtLjktMTYuOC0yLjNMNjkuNiAxMDlhODcyIDg3MiAwIDAgMC00OC43LTExLjdjLjMgMi40LTYuOSAyNi44LTggMzAuN0g4YzEtNC43IDIuNi04LjggMy44LTEzLjRsNi0yMy41YzMgLjkgNyAxLjggMTAgMi42TDQ3IDk4LjVsNTcuMiAxNC41Yy0xLjYtOS41LTQuMy0xOS40LTYuMi0yOC45LS44LTMuNy0yLjItOC43LTIuNi0xMi4zcTEuNy0yLjIgMy43LTQuM2M4LTguNyAxNS41LTE4LjkgMjMuNy0yNy4zLTQuNy0xLjUtMTAuMy0yLjgtMTUtNGwtMjUtNi4zYy0xOC43LTQuNy0zOC40LTEwLTU3LTE0LjMtNS40IDIyLjUtMTEuNiA0NS42LTE3LjMgNjhsLTUuNSAyMmExMDcgMTA3IDAgMCAxLTMgMTEuMnoiLz48cGF0aCBmaWxsPSIjMUJBMUYyIiBkPSJNMzMuNSAyOC42YzIyLjcgNi4zIDQ3IDExLjMgNjkuNyAxNy43TDgzLjYgNjljMiA3LjQgMy43IDE2LjYgNS40IDI0LjJxLjUgMi41IDEuMyA1Yy01LjItMS0xMi44LTMtMTguMi00LjVsLTMzLjktOC41QzM0IDg0IDI0LjUgODEuNCAyMC40IDgwLjljMy44LTE3LjIgOS4yLTM1IDEzLTUyLjMiLz48cGF0aCBmaWxsPSJ3aGl0ZSIgZD0iTTQxLjYgNDNjNy41IDguMiA3LjMgOSAxNy41IDEzIDEtMTAuNSAxMC42LTEzLjMgMTcuNy02LjFxMy41LS41IDYuOC0xLjZjLTIgMi4xLTMuNCAzLjQtNS45IDUgMi40LS4xIDQtLjQgNi40LS44bC02IDQuM2MtMiA4LTMuOCAxMS44LTEwIDE3LjhhMjggMjggMCAwIDEtMjQuOSA0LjJjLTQtMS4yLTcuMi0zLjYtMTAuNi01LjggNiAxLjUgOS41IDEuNiAxNS4zLTEuMi00LjUtMi02LTMuMi04LTcuNmw1LjQuM2MtNS40LTIuMi02LjYtNS03LTEwLjdsNC42IDIuOGMtMy42LTQuNS00LjMtOC42LTEuMy0xMy42Ii8+PC9zdmc+
// @run-at       document-start
// @grant        none

// ==/UserScript==

(function () {
  "use strict";

  const iconsvg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><path fill="white" d="M0 96.6c1-1 3.8-13.9 4.5-16.4l10.5-41 3.5-14q1-4.9 2.4-9.6c2-6 5.5-4.6 10.2-3.4L41.5 15l30 7.7 34.6 8.6q8.7 2 17.3 4.5c2 .6 3.4 2.2 4.6 3.8v2.9c-6 7.3-13.1 14.1-19 21.7-2 2.7-7.3 7.2-7.7 10.9.2 2.6 1.7 7.2 2.3 10l4 17.7c1 4.7.6 4.9 2.5 10a9 9 0 0 1-3.3 4c-6 1-11-.9-16.8-2.3L69.6 109a872 872 0 0 0-48.7-11.7c.3 2.4-6.9 26.8-8 30.7H0z"/><path d="M0 96.6c1-1 3.8-13.9 4.5-16.4l10.5-41 3.5-14q1-4.9 2.4-9.6c2-6 5.5-4.6 10.2-3.4L41.5 15l30 7.7 34.6 8.6q8.7 2 17.3 4.5c2 .6 3.4 2.2 4.6 3.8v2.9c-6 7.3-13.1 14.1-19 21.7-2 2.7-7.3 7.2-7.7 10.9.2 2.6 1.7 7.2 2.3 10l4 17.7c1 4.7.6 4.9 2.5 10a9 9 0 0 1-3.3 4c-6 1-11-.9-16.8-2.3L69.6 109a872 872 0 0 0-48.7-11.7c.3 2.4-6.9 26.8-8 30.7H8c1-4.7 2.6-8.8 3.8-13.4l6-23.5c3 .9 7 1.8 10 2.6L47 98.5l57.2 14.5c-1.6-9.5-4.3-19.4-6.2-28.9-.8-3.7-2.2-8.7-2.6-12.3q1.7-2.2 3.7-4.3c8-8.7 15.5-18.9 23.7-27.3-4.7-1.5-10.3-2.8-15-4l-25-6.3c-18.7-4.7-38.4-10-57-14.3-5.4 22.5-11.6 45.6-17.3 68l-5.5 22a107 107 0 0 1-3 11.2z"/><path fill="#1BA1F2" d="M33.5 28.6c22.7 6.3 47 11.3 69.7 17.7L83.6 69c2 7.4 3.7 16.6 5.4 24.2q.5 2.5 1.3 5c-5.2-1-12.8-3-18.2-4.5l-33.9-8.5C34 84 24.5 81.4 20.4 80.9c3.8-17.2 9.2-35 13-52.3"/><path fill="white" d="M41.6 43c7.5 8.2 7.3 9 17.5 13 1-10.5 10.6-13.3 17.7-6.1q3.5-.5 6.8-1.6c-2 2.1-3.4 3.4-5.9 5 2.4-.1 4-.4 6.4-.8l-6 4.3c-2 8-3.8 11.8-10 17.8a28 28 0 0 1-24.9 4.2c-4-1.2-7.2-3.6-10.6-5.8 6 1.5 9.5 1.6 15.3-1.2-4.5-2-6-3.2-8-7.6l5.4.3c-5.4-2.2-6.6-5-7-10.7l4.6 2.8c-3.6-4.5-4.3-8.6-1.3-13.6"/></svg>`;
  const panelcss = `    :root {color-scheme: dark}
    * {box-sizing: border-box}

    html, body {
      margin: 0;
      height: 100%
    }

    body {
      background-color: #000; color: #E5EAEC;
      font: 14px "TwitterChirp", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
      display: flex; flex-direction: column;
      overflow: hidden; user-select: none;
    }

    .header {
      padding: 12px 14px;
      border-bottom: 1px solid #242E36;
      display: flex; flex-direction: column;
      gap: 10px; flex-shrink: 0
    }

    /*//////////////////////////////////////////////////////////////////////*/

    .row1 {
      display: flex; gap: 8px;
      align-items: center
    }

    .button {
      background-color: #242E36; color: #E5EAEC;
      border: none; cursor: pointer;
      border-radius: 999px; padding: 8px 16px;
      font: 700 14px "TwitterChirp", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    .button.hot {
      background-color: #1d9bf0;
      color: #fff
    }

    .search, .prefixselect {
      background: black; color: #E5EAEC;
      border: 1px solid #37434D;
      border-radius: 999px; padding: 9px 14px;
      font: 14px "TwitterChirp", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    .searchbox {
      position: relative; display: flex; flex: 1;
      min-width: 0; align-items: center
    }
    .searchicon {
      position: absolute;
      left: 13px; width: 18px; height: 18px;
      fill: #6B7F8E; pointer-events: none}
    .search {width: 100%; min-width: 0; padding-left: 38px}
    .prefixselect {
      cursor: pointer; appearance: none;
      padding-right: 38px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M3.543 8.96l1.414-1.42L12 14.59l7.043-7.05 1.414 1.42L12 17.41 3.543 8.96z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      background-size: 16px
    }
    .search::placeholder {color: #6B7F8E}
    .search:focus, .prefixselect:focus {outline: none; border-color: #1d9bf0}

    .row2 {
      display: flex;
      gap: 14px;
      align-items: center;
      color: #6B7F8E;
      font-size: 13px;
      flex-wrap: wrap
    }

    .row2 label {
      display: flex;
      gap: 5px;
      align-items: center;
      cursor: pointer
    }
    .row2.filters {gap: 8px}

    /*//////////////////////////////////////////////////////////////////////*/

    .fswitch {
      position: relative; display: inline-flex;
      background: #16181c; border-radius: 999px;
      padding: 2px; flex-shrink: 0
    }
    .fhandle {
      position: absolute; top: 2px; bottom: 2px;
      left: 0; width: 0; z-index: 0;
      border-radius: 999px; background-color: #536471;
      transition: left .2s ease, width .2s ease, background-color .2s ease
    }
    .fseg {
      position: relative; z-index: 1;
      border: none; background: none; cursor: pointer;
      color: #6B7F8E; padding: 4px 9px;
      border-radius: 999px; font-size: 11px;
      display: inline-flex; align-items: center; gap: 3px;
      white-space: nowrap; transition: color .15s ease;
      font-family: inherit
    }
    .fseg.on {color: #fff}
    .fseg.on .fseglbl {font-weight: 700}
    .fseg .fico {display: inline-flex; width: 12px; height: 12px}
    .fseg .fico svg {width: 12px; height: 12px}
    /* reserve the bold width so selecting a segment never shifts the layout */
    .fseglbl {display: inline-grid}
    .fseglbl::after {content: attr(data-label); font-weight: 700; height: 0; visibility: hidden}
    .fseglbl, .fseglbl::after {grid-area: 1 / 1}

    .note {
      margin-left: auto;
      color: #536471;
      font-size: 12px
    }

    .bulk {
      display: flex; gap: 8px;
      align-items: center; flex-wrap: wrap
    }
    .flagcount {
      color: #6B7F8E; font-size: 12px;
      margin-top: -2px
    }
    .bulkbtn {
      background: transparent; color: #E5EAEC;
      border: 1px solid #536471; cursor: pointer;
      border-radius: 999px; padding: 3px 10px;
      font: 700 12px "TwitterChirp", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    .bulkbtn:hover {background-color: rgba(239,243,244,.1)}

    .devbar {
      flex-shrink: 0;
      padding: 10px 14px;
      border-top: 1px solid #242E36;
      display: flex; flex-direction: column; gap: 8px
    }
    .row2.dev {
      font-size: 9.75px; gap: 10.5px
    }
    .row2.dev label {gap: 3.75px}
    .row2.swrow {gap: 6px}
    .swbtn {
      background: transparent; color: #E5EAEC;
      border: 1px solid #536471; cursor: pointer;
      border-radius: 999px; padding: 3px 10px;
      font: 700 10.5px "TwitterChirp", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    .swbtn:hover {background-color: rgba(239,243,244,.1)}
    .row2.swrow .checklabel {font-size: 11px; gap: 4px}
    .row2.swrow .checkbox {
      width: 15px; height: 15px;
      border-width: 1.5px; border-radius: 3px
    }
    .row2.swrow .checkbox .tick {width: 15px; height: 15px}
    .row2.dev .checkbox {
      width: 15px; height: 15px;
      border-width: 1.5px; border-radius: 3px
    }
    .row2.dev .checkbox .tick {width: 15px; height: 15px}

    /*//////////////////////////////////////////////////////////////////////*/

    .footer {
      display: flex; gap: 10px;
      align-items: center;
      padding: 0 14px; max-height: 0;
      overflow: hidden; flex-shrink: 0;
      background-color: #1d9bf0;
      transition: max-height 0.22s ease, padding 0.22s ease
    }
    .footer.show {max-height: 80px; padding: 10px 14px}
    .footer .button {background-color: white; color: black}
    .footer .button.undo {background-color: red; color: white}
    .footer .button.undo:hover {background-color: #f4212e}

    .footermessage {flex: 1; color: white}

    /*//////////////////////////////////////////////////////////////////////*/

    .list {
      overflow: auto;
      padding: 4px 0; flex: 1;
      scrollbar-width: thin; scrollbar-color: #536471 transparent
    }
    .list::-webkit-scrollbar {width: 8px}
    .list::-webkit-scrollbar-track {background: transparent}
    .list::-webkit-scrollbar-thumb {background-color: #536471; border-radius: 999px;
      border: 2px solid transparent; background-clip: padding-box;
      min-height: 20px; max-height: 120px}
    .list::-webkit-scrollbar-thumb:hover {background-color: #6B7F8E}

    .item {
      display: flex; align-items: center; gap: 10px;
      padding: 12px 14px;
      border-bottom: 1px solid #242E36;
      content-visibility: auto; contain-intrinsic-size: auto 46px
    }
    .item.danger {background: rgba(244, 33, 46, .10)}
    .item.mod {position: relative}
    .item.mod::before {content: ""; position: absolute;
      left: 5px; top: 12px; bottom: 12px; width: 4px;
      border-radius: 999px; background-color: #1d9bf0}
    .item.mod.danger::before {background-color: #f4212e}

    .info {flex: 1; min-width: 0}

    .name {
      font-weight: 700;
      word-break: break-word
    }

    .controls {
      display: flex;
      gap: 6px;
      align-items: center;
      flex-shrink: 0
    }

    /*//////////////////////////////////////////////////////////////////////*/

    .editfield {
      background: black; color: #E5EAEC;
      border: 1px solid #37434D; border-radius: 8px;
      padding: 6px 9px; width: 150px;
      font: 13px "TwitterChirp", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      white-space: pre-wrap; word-break: break-word;
      resize: none; field-sizing: content; max-height: 160px; overflow: auto
    }
    .editfield:focus {outline: none; border-color: #1d9bf0}
    .editfield.num {width: 90px; field-sizing: auto}

    .checkbox {
      box-sizing: border-box; display: inline-flex;
      align-items: center; justify-content: center;
      width: 20px; height: 20px;
      border: 2px solid #6B7F8E;
      border-radius: 4px; cursor: pointer;
      flex-shrink: 0; background: transparent
    }
    .checkbox .tick {
      width: 20px;
      height: 20px;
      fill: #fff;
      display: none
    }
    .checkbox.on {
      background-color: #1d9bf0;
      border-color: #1d9bf0
    }
    .checkbox.on .tick {
      display: block
    }
    .item.danger .checkbox.on {
      background-color: #f4212e;
      border-color: #f4212e
    }

    .reset {
      background: none; border: none; cursor: pointer;
      color: #1d9bf0; padding: 0;
      width: 20px; height: 20px;
      display: inline-flex; align-items: center; justify-content: center
    }
    .reset svg {width: 18px; height: 18px; fill: currentColor}
    .item.danger .reset {color: #f4212e}
    .reset.off {visibility: hidden; pointer-events: none}

    /*//////////////////////////////////////////////////////////////////////*/

    .meta {
      color: #6B7F8E;
      margin-top: 4px;
      font-size: 12px
    }

    .meta .dangerzone {
      color: #f4212e;
      display: inline-flex;
      align-items: center; gap: 2px
    }
    .meta .dangerzone svg {width: 14px; height: 14px; fill: currentColor}
    .ident {user-select: all}

    .opts {
      color: #536471; font-size: 12px;
      margin-top: 4px; cursor: pointer; width: fit-content
    }
    .opts:hover {color: #6B7F8E; text-decoration: underline}

    .optsdrop {
      position: fixed; z-index: 2147483647;
      display: none; padding: 4px;
      background: #000; color: #E5EAEC;
      font: 14px "TwitterChirp", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      border: 1px solid #37434D; border-radius: 10px;
      max-height: 240px; max-width: 280px; overflow: auto;
      box-shadow: 0 4px 20px rgba(0,0,0,.7);
      scrollbar-width: thin; scrollbar-color: #536471 transparent
    }
    .optsitem {
      padding: 6px 10px; border-radius: 6px; cursor: pointer;
      display: flex; flex-direction: column; gap: 1px
    }
    .optsval {white-space: nowrap; overflow: hidden; text-overflow: ellipsis}
    .optsdesc {font-size: 11px; color: #6B7F8E; line-height: 1.25}
    .optsitem:hover {background-color: #16181c}
    .optsitem.sel .optsval {color: #fff; font-weight: 800}
    .optsempty {padding: 7px 10px; color: #6B7F8E; font-style: italic}

    .empty {
      font-style: italic;
      padding: 4px 10px;
      color: #6B7F8E;
      line-height: 1.6
    }
    .empty.center {
      font-style: normal; min-height: 100%;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 14px; padding: 16px; text-align: center
    }
    .empty.center .face {
      font-size: 64px; line-height: 1;
      font-weight: 700; color: #E5EAEC
    }

    .scan {
      margin-top: 8px;
      background-color: #1d9bf0;
      color: #fff; border: none;
      border-radius: 999px;
      padding: 8px 14px;
      font: 600 13px "TwitterChirp", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      cursor: pointer
    }

    .copied {
      color: #00ba7c;
      margin-left: 8px;
      font-size: 12px
    }

    /*//////////////////////////////////////////////////////////////////////*/

    .cachednote {
      background-color: rgba(29,155,240,.1); color: #8ecdf8;
      border-bottom: 1px solid #242E36;
      padding: 8px 14px; font-size: 12px
    }

    @media (pointer: coarse) {
      body {min-height: 480px}
      .checkbox {width: 24px; height: 24px}
      .checkbox .tick {width: 22px; height: 22px}
      .row2.dev .checkbox {width: 18px; height: 18px}
      .row2.dev .checkbox .tick {width: 18px; height: 18px}
      .reset {width: 24px; height: 24px}
      .reset svg {width: 21px; height: 21px}
      .item {padding: 14px}
    }
`;
  const hostcss = `
    :host {all: initial}
    .tffab {
      position: fixed; z-index: 2147483646;
      right: calc(16px + var(--tfsb, 0px)); bottom: 16px;
      width: 40px; height: 40px; border-radius: 999px;
      background-color: #1d9bf0; border: none; cursor: grab;
      pointer-events: auto; touch-action: none;
      display: flex; align-items: center; justify-content: center;
      padding: 0
    }
    .tffab:active {cursor: grabbing}
    .tffab svg {width: 22px; height: 22px; pointer-events: none}
    .tfpanelwrap {
      position: fixed; top: 0; right: var(--tfsb, 0px);
      width: 390px; max-width: 100vw;
      height: 100vh; height: 100dvh;
      background-color: #000; color: #E5EAEC;
      font: 14px "TwitterChirp", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
      display: flex; flex-direction: column;
      overflow: hidden; user-select: none;
      z-index: 2147483647;
      pointer-events: auto; visibility: hidden;
      border-left: 1px solid #242E36;
      transform: translateX(100%);
      transition: transform 0.18s ease
    }
    .tfpanelwrap.open {transform: none; visibility: visible}
    .tfclose {
      position: absolute; top: 6px; right: 10px; z-index: 3;
      background-color: rgba(42,43,43,0); border: none; cursor: pointer;
      padding: 5px; border-radius: 999px;
      display: inline-flex; align-items: center; justify-content: center;
      transition: background-color 0.15s ease
    }
    .tfclose:hover {background-color: #2a2b2b}
    .tfclose svg {width: 20px; height: 20px; fill: #fff}
`;
  const panelhtml = `<div class="header">
    <div class="row1">
      <div class="searchbox">
        <svg class="searchicon" viewBox="0 0 24 24" aria-hidden="true"><path d="M10.25 4.25c-3.314 0-6 2.686-6 6s2.686 6 6 6c1.657 0 3.155-.67 4.243-1.757 1.087-1.088 1.757-2.586 1.757-4.243 0-3.314-2.686-6-6-6zm-9 6c0-4.971 4.029-9 9-9s9 4.029 9 9c0 1.943-.617 3.744-1.664 5.215l4.475 4.474-2.122 2.122-4.474-4.475c-1.471 1.047-3.272 1.664-5.215 1.664-4.971 0-9-4.029-9-9z"/></svg>
        <input class="search" placeholder="Search">
      </div>
      <select class="prefixselect"></select>
    </div>
    <div class="row2 filters">
      <div class="bulk">
        <button class="bulkbtn" data-bulk="on">all on</button>
        <button class="bulkbtn" data-bulk="off">all off</button>
        <button class="bulkbtn" data-bulk="reset">reset</button>
        <button class="bulkbtn" data-upsell="off">slop off</button>
        <button class="bulkbtn" data-upsell="on">slop on</button>
      </div>
    </div>
    <div class="flagcount">??? flags</div>
  </div>
  <div class="list"></div>
  <div class="devbar">
    <div class="row2 swrow"></div>
    <div class="row2 dev"></div>
  </div>
  <div class="footer">
    <span class="footermessage">You've got unsaved changes!</span>
    <button class="button undo">Undo</button>
    <button class="button hot reload">Save & reload</button>
  </div>`;
  const closesvg = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"/></svg>`;

  /*//////////////////////////////////////////////////////////////////////*/

window.twitterflagsconfigs = {
  "desc": {
    "known": {
      "rweb_conf_only_enabled": "locks the whole site into conference-only mode (redirects to /i/conferences-room)",
      "rweb_conf_dev_enabled": "conference debug overlay: per-feed grid, throttle states, spatial audio panning",
      "rweb_conf_composite_video_enabled": "canvas-composites two media streams into one conference feed",
      "rweb_conf_multi_video_enabled": "multi-video conference with simulcast + presentation tracks",
      "rweb_conf_rnnoise_enabled": "rnnoise ml noise suppression in conferences",
      "rweb_conf_dummy_enabled": "inject a dummy publisher into conferences (testing)",
      "spaces_conference_enabled": "enables the conference product (pair with rweb_conf_only_enabled)",
      "spaces_video_speakers_enabled": "video for space speakers",
      "spaces_video_admins_enabled": "video admin controls in spaces",
      "spaces_video_consumption_enabled": "watch video in spaces",
      "rweb_video_screen_enabled": "video-only 'mixer' timeline (MediaTabVideoMixer) on profiles",
      "responsive_web_tv_cast_enabled": "cast video to a tv (chromecast/airplay)",
      "blue_longer_video_enabled": "allow longer video uploads (premium)",
      "responsive_web_hevc_upload_preview_enabled": "hevc video upload preview",
      "web_video_playback_rate_enabled": "video playback speed control",
      "web_video_transcribed_captions_enabled": "auto-transcribed captions on video",
      "web_video_caption_repositioning_enabled": "drag captions to reposition them",
      "rweb_picture_in_picture_enabled": "picture-in-picture video",
      "rweb_video_pip_enabled": "picture-in-picture video (alt flag)",
      "rweb_save_video_progress_enabled": "remember playback position per video",
      "rweb_live_broadcast_rewind_enabled": "rewind live broadcasts",
      "responsive_web_instream_video_redesign_enabled": "redesigned in-stream video player",
      "dm_video_downloads_enabled": "download videos sent in dms",
      "responsive_web_media_download_video_share_menu_enabled": "'download video' in the share menu",
      "responsive_web_composer_configurable_video_player_enabled": "configurable video player in composer",
      "responsive_web_convert_card_video_to_gif_enabled": "convert card video to gif",
      "media_edge_to_edge_content_enabled": "edge-to-edge media layout",
      "responsive_web_edit_tweet_enabled": "edit posts after sending",
      "responsive_web_edit_tweet_composition_enabled": "show the edit-tweet composer",
      "responsive_web_edit_tweet_api_enabled": "edit-tweet api path",
      "responsive_web_one_hour_edit_window_enabled": "extends the post edit window to one hour",
      "responsive_web_composer_autosave_enabled": "autosave composer drafts",
      "responsive_web_image_poll_composer_enabled": "image polls in the composer",
      "responsive_web_card_image_poll_enabled": "render image polls",
      "responsive_web_tweet_drafts_threads_enabled": "save thread drafts",
      "responsive_web_tweet_drafts_video_enabled": "save drafts that contain video",
      "responsive_web_scheduling_threads_enabled": "schedule whole threads",
      "longform_notetweets_consumption_enabled": "read long-form note tweets",
      "longform_notetweets_rich_text_read_enabled": "render rich text in note tweets",
      "longform_notetweets_inline_media_enabled": "inline media inside note tweets",
      "longform_notetweets_composition_without_claims_enabled": "compose note tweets without monetization claims",
      "disallowed_reply_controls_enabled": "advanced 'who can reply' controls",
      "dont_mention_me_enabled": "let people remove themselves from your replies/mentions",
      "rweb_conversational_replies_downvote_enabled": "downvote button on replies",
      "responsive_web_pinned_replies_enabled": "pin a reply under your post",
      "responsive_web_reply_storm_enabled": "reply-storm (rapid threaded replies) ui",
      "responsive_web_grok_general_availability": "grok available to everyone",
      "responsive_web_grok_voice_mode_enabled": "grok voice mode",
      "responsive_web_grok_image_edit": "edit images with grok",
      "responsive_web_grok_imagine_composer_enabled": "grok imagine image/video composer",
      "responsive_web_grok_imagine_in_composer_enabled": "grok imagine inside the post composer",
      "responsive_web_grok_feed": "a grok-generated feed",
      "responsive_web_grok_personality": "grok personality picker",
      "responsive_web_grok_temporary_chat_enabled": "ephemeral grok chats",
      "responsive_web_grok_debug_enabled": "grok debug ui",
      "responsive_web_grok_show_grok_performance_metrics": "show grok latency/perf metrics",
      "responsive_web_grok_enable_deepersearch": "grok deepersearch mode",
      "responsive_web_grok_model_selector_in_input": "pick the grok model from the input box",
      "responsive_web_grok_420_toggle_enabled": "grok 4.20 beta toggle",
      "responsive_web_grok_05221996": "internal grok codename toggle (dated)",
      "responsive_web_grok_05231996": "internal grok codename toggle (imagine)",
      "responsive_web_grok_fun_mode_disabled": "disables grok fun mode",
      "responsive_web_grok_text_selection_enabled": "ask grok about selected text",
      "responsive_web_grok_analyze_post_followups_enabled": "follow-up questions after analyzing a post",
      "responsive_web_grok_profile_summary_enabled": "grok summary on profiles",
      "xchat_ask_grok_enabled": "ask grok inside chat",
      "payments_cash_deposits_enabled": "twitter money cash deposits",
      "payments_cheques_deposits_enabled": "twitter money cheque deposits",
      "payments_shared_accounts_enabled": "shared twitter money accounts",
      "payments_secondary_accounts_enabled": "secondary twitter money accounts",
      "payments_web_external_app_enabled": "twitter money external app payments",
      "payments_transaction_search_enabled": "search payment transactions",
      "responsive_web_stripe_account_creation_enabled": "create a stripe account in-app",
      "responsive_web_mobile_app_spotlight_v1_config": "profile app/play-store link card (local only unfortunately)",
      "responsive_web_location_spotlight_v1_config": "profile location spotlight card",
      "responsive_web_profile_spotlight_v0_config": "profile spotlight card",
      "responsive_web_profile_about_enabled": "the new structured 'about' profile page",
      "xprofile_editing_enabled": "desktop-only extended bio, which elon removed after it broke (LOL??)",
      "xprofile_work_history_enabled": "work history section on profiles",
      "hidden_profile_subscriptions_enabled": "hide your subscriptions on profile",
      "profile_label_improvements_pcf_edit_profile_enabled": "edit professional category from profile",
      "dm_secret_conversations_enabled": "encrypted dms (xchat secret conversations)",
      "av_chat_encryption_enabled": "encrypted audio/video calls",
      "av_chat_group_e2ee_creator_enabled": "create e2ee group calls",
      "av_chat_group_e2ee_joiner_enabled": "join e2ee group calls",
      "av_chat_xchat_emoji_reactions_enabled": "emoji reactions in calls",
      "dm_bulk_delete_enabled": "bulk delete dms",
      "dm_edit_dms_overflow_menu_enabled": "edit sent dms",
      "dm_voice_rendering_enabled": "voice messages in dms",
      "rweb_xchat_standalone_avcall_enabled": "standalone audio/video calls in xchat",
      "rweb_xchat_delegate_accounts_enabled": "use xchat from delegated accounts",
      "communities_analytics_enabled": "community analytics dashboard",
      "communities_adult_content_setting_enabled": "mark a community as adult-content",
      "communities_non_member_reply_enabled": "non-members can reply in communities",
      "responsive_web_birdwatch_note_writing_enabled": "write community notes",
      "responsive_web_birdwatch_media_notes_enabled": "community notes on media",
      "freedom_of_speech_not_reach_author_label_enabled": "show 'visibility limited' author labels",
      "creator_subscriptions_revamp_enabled": "revamped creator subscriptions",
      "super_follow_exclusive_tweet_creation_api_enabled": "create super-follower-only posts",
      "premium_content_api_read_enabled": "read paywalled premium posts",
      "recruiting_premium_jobs_enabled": "premium job listings",
      "recruiting_global_jobs_search_enabled": "global job search",
      "articles_rest_api_enabled": "long-form articles api",
      "highlights_tweets_tab_ui_enabled": "highlights tab on profile",
      "rweb_debugger_enabled": "in-client network request logger (debugger)",
      "gryphon_underground_enabled": "internal tweetdeck / pro \"underground\" mode",
      "responsive_web_jetfuel_frame": "internal ads (jetfuel) frame",
      "responsive_web_send_jetfuel_preview_image_enabled": "send jetfuel ad preview image",
      "responsive_web_user_spectral_key_enabled": "spectral key (internal user keying)",
      "march_madness_brackets_enabled": "seasonal march madness brackets",
      "responsive_web_grok_user_seconds_debug": "debug grok active-seconds tracking",
      "rweb_xchat_debug_enabled": "xchat (encrypted dm) debug ui",
      "rweb_xchat_dogfood_logs_enabled": "xchat dogfood logging",
      "super_follow_web_debug_enabled": "super-follow debug ui",
      "responsive_web_grok_dev_universal_search_id_enabled": "grok dev universal search id",
      "rweb_debugger_bug_report_email": "bug report email attached by the network logger",
      "responsive_web_birdwatch_note_internal_insights_enabled": "community notes internal insights panel",
      "responsive_web_birdwatch_note_request_download_enabled": "download your community-notes data",
      "responsive_web_birdwatch_top_contributor_enabled": "community notes top-contributor surface",
      "responsive_web_birdwatch_translation_enabled": "translate community notes",
      "voice_rooms_employee_only_enabled": "employee-only spaces (voice rooms)",
      "x_jetfuel_enable_test_cluster": "jetfuel ads test cluster (pairs with jfDev)",
      "new_timeline_experiment_enabled": "new timeline experiment",
      "blue_business_admin_sidebar_module_enabled": "verified-org admin sidebar module",
      "communities_moderation_log_enabled": "community moderation log",
      "oauth_trusted_developer_badge_enabled": "trusted-developer badge on apps",
      "responsive_web_api_transition_enabled": "routes api calls through the transition layer",
      "responsive_web_temporary_ocf_x_migration": "ocf-to-x onboarding migration",
      "responsive_web_redux_use_fragment_enabled": "switches the redux data layer to fragments",
      "responsive_web_graphql_timeline_navigation_enabled": "core graphql timeline navigation",
      "rweb_session_binding_enabled": "binds the session to the device",
      "rweb_client_transaction_id_enabled": "adds client transaction ids to requests",
      "network_layer_503_backoff_mode": "network retry / backoff behavior on 503",
      "responsive_web_timeline_cover_killswitch_enabled": "timeline cover killswitch",
      "responsive_web_extension_compatibility_hide": "hides content flagged by extension-compat checks"
    },
    "danger": {
      "rweb_conf_only_enabled": "replaces the entire web app with conference-only mode",
      "rweb_video_screen_enabled": "swaps the profile media tab for the video mixer layout",
      "responsive_web_api_transition_enabled": "reroutes all api traffic",
      "responsive_web_temporary_ocf_x_migration": "changes onboarding/auth flows",
      "responsive_web_redux_use_fragment_enabled": "swaps the data layer, can break rendering",
      "responsive_web_graphql_timeline_navigation_enabled": "core navigation, timelines can break completely",
      "rweb_session_binding_enabled": "can invalidate your session / log you out",
      "responsive_web_extension_compatibility_hide": "can hide page content",
      "is_maintenance_mode_enabled": "puts the client in maintenance mode"
    }
  },
  "switches": {
    "dev": [
      {
        "key": "jfDev",
        "label": "jetfuel dev mode",
        "title": "sets sessionStorage jfDev, unlocking the super epic emusk rocket emoji mode"
      },
      {
        "key": "inspect",
        "label": "inspector",
        "title": "not actually a twitter feature, but hover any element to see its data-testid!"
      },
      {
        "key": "exposeDebug",
        "label": "expose audio",
        "title": "adds ?exposeDebug=1 so the media stream audio player is reachable"
      },
      {
        "key": "forceDevEnv",
        "label": "force dev environment",
        "title": "tries to revive prod-gated developer code (needs a reload)"
      },
      {
        "key": "forcechirp",
        "label": "on load",
        "title": "force-apply twitterchirp at the earliest moment of every page load so it never fails to appear",
        "row": "sw"
      }
    ],
    "filters": [
      {
        "key": "state",
        "options": [
          {
            "val": "all",
            "label": "all"
          },
          {
            "val": "enabled",
            "label": "enabled",
            "color": "green",
            "icon": "check"
          },
          {
            "val": "modified",
            "label": "modified",
            "color": "yellow",
            "icon": "pencil"
          },
          {
            "val": "disabled",
            "label": "disabled",
            "color": "red",
            "icon": "close"
          }
        ]
      },
      {
        "key": "type",
        "options": [
          {
            "val": "all",
            "label": "all"
          },
          {
            "val": "bool",
            "label": "checkboxes",
            "color": "blue",
            "icon": "tick"
          },
          {
            "val": "input",
            "label": "inputs",
            "color": "blue",
            "icon": "compose"
          },
          {
            "val": "opts",
            "label": "dropdowns",
            "color": "blue",
            "icon": "chevron"
          }
        ]
      },
      {
        "key": "danger",
        "options": [
          {
            "val": "all",
            "label": "all"
          },
          {
            "val": "safe",
            "label": "safe",
            "color": "green",
            "icon": "shield"
          },
          {
            "val": "danger",
            "label": "dangerous",
            "color": "red",
            "icon": "warn"
          }
        ]
      }
    ],
    "actions": [
      {
        "action": "unregister",
        "label": "unregister sw.js",
        "title": "unregister the service worker (fresh assets when reloading)"
      },
      {
        "action": "flush",
        "label": "flush cache",
        "title": "delete the cached html app shell"
      },
      {
        "action": "refresh",
        "label": "refresh cache",
        "title": "reprime the html app shell"
      },
      {
        "action": "chirp",
        "label": "reapply font",
        "title": "fetch + reapply the twitterchirp font (twitter's bundle sometimes quietly fails to load it)"
      }
    ]
  },
  "upsells": {
    "upsell": [
      {
        "flag": "premium_paywall_on_app_load_enabled",
        "off": false
      },
      {
        "flag": "premium_paywall_on_app_load_journey_enabled",
        "off": false
      },
      {
        "flag": "responsive_web_edit_tweet_upsell_enabled",
        "off": false
      },
      {
        "flag": "longform_notetweets_composer_upsell_enabled",
        "off": false
      },
      {
        "flag": "highlights_tweets_action_menu_upsell_enabled",
        "off": false
      },
      {
        "flag": "highlights_tweets_tab_upsell_enabled",
        "off": false
      },
      {
        "flag": "highlights_tweets_upsell_on_pin_action_enabled",
        "off": false
      },
      {
        "flag": "responsive_web_user_badge_education_get_verified_button_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_upsells_get_verified_profile",
        "off": false
      },
      {
        "flag": "subscriptions_upsells_get_verified_profile_card",
        "off": false
      },
      {
        "flag": "subscriptions_upsells_get_verified_profile_card_promo_variant_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_upsells_get_verified_profile_rotation_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_upsells_get_verified_profile_rotation_basic_upgrade_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_upsells_get_verified_button_promo_variant_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_upsells_visitor_get_verified_age_gate_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_upsells_verified_profile_visitor_upsell_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_upsells_verified_profile_sidebar_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_upsells_analytics_profile_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_upsells_analytics_eligibility_query_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_upsells_explore_sidebar_analytics_upsell_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_upsells_profile_sidebar_analytics_upsell_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_upsells_settings_analytics_upsell_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_upsells_app_tab_bar_analytics_upsell_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_upsells_post_analytics_promo_variant_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_upsells_post_details_analytics_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_upsells_post_engagements_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_upsells_post_limit_toast",
        "off": false
      },
      {
        "flag": "subscriptions_upsells_bookmarks_screen_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_upsells_dm_card_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_upsells_edit_post_promo_variant_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_upsells_articles_post_composer_promo_variant_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_upsells_articles_profile_promo_variant_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_upsells_highlights_profile_promo_variant_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_upsells_home_nav_migration_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_upsells_home_sidebar_migration_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_upsells_premium_home_nav_promo_variant_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_upsells_premium_nav_migration_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_upsells_profile_card_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_upsells_radar_sidebar_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_upsells_reply_boost_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_upsells_reply_boost_popup_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_upsells_sidebar_default_promo_variant_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_upsells_vo_nav_decoration_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_offers_dynamic_upsells_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_offers_upgrade_offer_home_nav_upsell_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_offers_upgrade_offer_sidebar_upsell_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_offers_premium_nav_indicator_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_offers_special_perk_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_offers_churn_prevention_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_offers_paywall_urgent_heading_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_offers_in_tier_switch_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_premium_hub_ad_free_link_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_premium_hub_boost_block_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_gifting_tooltip_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_gifting_tooltip_discount_label",
        "off": false
      },
      {
        "flag": "subscriptions_gifting_premium_intro_copy_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_gifting_premium_intervals_enabled",
        "off": false
      },
      {
        "flag": "premium_business_offers_banner_portal_basic_tier",
        "off": false
      },
      {
        "flag": "premium_business_offers_banner_sidebar_basic_tier",
        "off": false
      },
      {
        "flag": "premium_business_offers_nav_indicator_enabled",
        "off": false
      },
      {
        "flag": "premium_business_offers_navbar_discount_label_enabled",
        "off": false
      },
      {
        "flag": "premium_business_offers_signup_navbar_tab_enabled",
        "off": false
      },
      {
        "flag": "premium_business_offers_navbar_premium_signup_hidden",
        "off": true
      },
      {
        "flag": "gryphon_upgrade_premium_plus_banner_enabled",
        "off": false
      },
      {
        "flag": "vo_upsell_enabled",
        "off": false
      },
      {
        "flag": "vo_upsell_profile_button_enabled",
        "off": false
      },
      {
        "flag": "vo_upsell_new_business_query_enabled",
        "off": false
      },
      {
        "flag": "responsive_web_verified_organizations_free_upgrade_promo_enabled",
        "off": false
      },
      {
        "flag": "responsive_web_verified_organizations_new_year_offer_enabled",
        "off": false
      },
      {
        "flag": "responsive_web_verified_organizations_offer_description_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_inapp_grok_upsell_enabled",
        "off": false
      },
      {
        "flag": "responsive_web_grok_v2_upsell_enabled",
        "off": false
      },
      {
        "flag": "responsive_web_grok_route_disabled_search_think_to_paywall",
        "off": false
      },
      {
        "flag": "subscriptions_marketing_page_grok_4_web_paywall",
        "off": false
      },
      {
        "flag": "rweb_premium_business_rebranding_premium_paywall_enabled",
        "off": false
      },
      {
        "flag": "rweb_premium_business_rebranding_entry_point_removed",
        "off": true
      },
      {
        "flag": "responsive_web_twitter_blue_subscriptions_disabled",
        "off": true
      },
      {
        "flag": "subscriptions_verified_to_premium_enabled",
        "off": false
      },
      {
        "flag": "subscriptions_sign_up_enabled",
        "off": false
      },
      {
        "flag": "syscache_vo_paywall_enabled",
        "off": false
      },
      {
        "flag": "responsive_web_verified_ntab_hidden",
        "off": true
      }
    ],
    "ad": [
      {
        "flag": "rweb_ssp_ads_enabled",
        "off": false
      },
      {
        "flag": "rweb_ssp_ads_refresh_enabled",
        "off": false
      },
      {
        "flag": "responsive_web_jetfuel_frame",
        "off": false
      },
      {
        "flag": "responsive_web_send_jetfuel_preview_image_enabled",
        "off": false
      },
      {
        "flag": "unified_cards_clip_long_media_promoted_content_enabled",
        "off": false
      },
      {
        "flag": "unified_cards_dpa_cta_button_enabled",
        "off": false
      },
      {
        "flag": "unified_cards_dpa_metadata_enabled",
        "off": false
      },
      {
        "flag": "unified_cards_install_button_redesign_enabled",
        "off": false
      },
      {
        "flag": "responsive_web_ad_formats_media_overlay_enabled",
        "off": false
      },
      {
        "flag": "responsive_web_ad_formats_website_cta_enabled",
        "off": false
      },
      {
        "flag": "responsive_web_ocf_reportflow_promoted_enabled",
        "off": false
      },
      {
        "flag": "responsive_web_quick_promote_cta_enabled",
        "off": false
      },
      {
        "flag": "rweb_quick_promote_action_menu_enabled",
        "off": false
      },
      {
        "flag": "responsive_web_qp_full_popup_enabled",
        "off": false
      },
      {
        "flag": "rweb_quick_promote_boost_enabled",
        "off": false
      },
      {
        "flag": "rweb_quick_promote_gold_verified_boost_enabled",
        "off": false
      },
      {
        "flag": "rweb_quick_promote_third_party_boost_enabled",
        "off": false
      },
      {
        "flag": "responsive_web_quick_promote_high_budget_tier_enabled",
        "off": false
      },
      {
        "flag": "gryphon_hide_quick_promote",
        "off": true
      },
      {
        "flag": "rweb_tweets_boosting_enabled",
        "off": false
      },
      {
        "flag": "responsive_web_communityboost_form_enabled",
        "off": false
      },
      {
        "flag": "responsive_web_communityboost_mixed_pivot_enabled",
        "off": false
      },
      {
        "flag": "responsive_web_commerce_shop_spotlight_enabled",
        "off": false
      },
      {
        "flag": "responsive_web_live_commerce_enabled",
        "off": false
      },
      {
        "flag": "recruiting_promoted_jobs_enabled",
        "off": false
      },
      {
        "flag": "recruiting_premium_jobs_enabled",
        "off": false
      },
      {
        "flag": "user_ad_accounts_config_enabled",
        "off": false
      }
    ],
    "slop": [
      {
        "flag": "responsive_web_grok_analysis_button_from_backend",
        "off": false
      },
      {
        "flag": "responsive_web_grok_post_understanding_button_on_all_posts",
        "off": false
      },
      {
        "flag": "responsive_web_grok_analyze_focal_post_enabled",
        "off": false
      },
      {
        "flag": "responsive_web_grok_analyze_button_fetch_trends_enabled",
        "off": false
      },
      {
        "flag": "responsive_web_grok_analyze_post_followups_enabled",
        "off": false
      },
      {
        "flag": "responsive_web_grok_profile_summary_enabled",
        "off": false
      },
      {
        "flag": "responsive_web_grok_article_summary_enabled",
        "off": false
      },
      {
        "flag": "responsive_web_grok_search_summary_enabled",
        "off": false
      },
      {
        "flag": "responsive_web_grok_search_summary_sidebar",
        "off": false
      },
      {
        "flag": "responsive_web_grok_show_cards_at_top",
        "off": false
      },
      {
        "flag": "responsive_web_grok_image_annotation_enabled",
        "off": false
      },
      {
        "flag": "responsive_web_grok_imagine_annotation_enabled",
        "off": false
      },
      {
        "flag": "responsive_web_grok_backend_prompts_enabled",
        "off": false
      },
      {
        "flag": "responsive_web_grok_latest_news_preset_enabled",
        "off": false
      },
      {
        "flag": "responsive_web_grok_promo_modal_enabled",
        "off": false
      },
      {
        "flag": "rweb_navbar_grok_indicator_enabled",
        "off": false
      },
      {
        "flag": "responsive_web_grok_feed",
        "off": false
      },
      {
        "flag": "responsive_web_grok_general_availability",
        "off": false
      },
      {
        "flag": "responsive_web_grok_enable_grok_analyze_education",
        "off": false
      },
      {
        "flag": "responsive_web_grok_enable_grok_tab_education",
        "off": false
      },
      {
        "flag": "subscriptions_upsells_home_sidebar_grok_promo",
        "off": false
      },
      {
        "flag": "xchat_ask_grok_enabled",
        "off": false
      },
      {
        "flag": "follow_nudge_conversation_enabled",
        "off": false
      },
      {
        "flag": "rweb_recommendations_sidebar_graphql_enabled",
        "off": false
      },
      {
        "flag": "responsive_web_sidebar_ttf_enabled",
        "off": false
      },
      {
        "flag": "topics_context_controls_inline_prompt_enabled",
        "off": false
      },
      {
        "flag": "responsive_web_birdwatch_signup_prompt_enabled",
        "off": false
      },
      {
        "flag": "graduated_access_user_prompt_enabled",
        "off": false
      },
      {
        "flag": "blue_business_username_change_prompt_enabled",
        "off": false
      },
      {
        "flag": "responsive_web_use_app_prompt_enabled",
        "off": false
      },
      {
        "flag": "responsive_web_open_in_app_prompt_enabled",
        "off": false
      },
      {
        "flag": "responsive_web_install_banner_show_immediate",
        "off": false
      },
      {
        "flag": "responsive_web_login_signup_sheet_app_install_cta_enabled",
        "off": false
      },
      {
        "flag": "responsive_web_suppress_app_button_banner_suppressed",
        "off": true
      },
      {
        "flag": "march_madness_brackets_enabled",
        "off": false
      },
      {
        "flag": "march_madness_brackets_enabled_loggedin_sidebar_popup",
        "off": false
      },
      {
        "flag": "march_madness_brackets_enabled_logout_popup",
        "off": false
      },
      {
        "flag": "dm_education_flags_prompt",
        "off": false
      },
      {
        "flag": "dm_conversation_labels_pinned_education_enabled",
        "off": false
      },
      {
        "flag": "dont_mention_me_mentions_tab_education_enabled",
        "off": false
      },
      {
        "flag": "rweb_timeline_simple_conversation_control_education_enabled",
        "off": false
      }
    ]
  },
  "options": {
    "responsive_web_account_access_language_lo_banners": [
      {
        "val": "control",
        "desc": "default log in / sign up labels"
      },
      {
        "val": "treatment_1",
        "desc": "sign in + sign up wording"
      },
      {
        "val": "treatment_2",
        "desc": "sign in + create account wording"
      },
      {
        "val": "treatment_3",
        "desc": "log in + create account wording"
      },
      {
        "val": "treatment_4",
        "desc": "default labels (not overridden)"
      }
    ],
    "responsive_web_account_access_language_lo_splash_sidebar": [
      {
        "val": "control",
        "desc": "sign up with phone or email"
      },
      {
        "val": "treatment_1",
        "desc": "sign up with phone or email"
      },
      {
        "val": "treatment_2",
        "desc": "create account"
      },
      {
        "val": "treatment_3",
        "desc": "create account with phone or email"
      },
      {
        "val": "treatment_4",
        "desc": "create account (shows sign-up form)"
      }
    ],
    "responsive_web_use_app_button_variations": [
      {
        "val": "control",
        "desc": "default button layout"
      },
      {
        "val": "treatment_1",
        "desc": "adds login + use-app buttons (mobile)"
      },
      {
        "val": "treatment_2",
        "desc": "shrinks login, extends use-app on scroll"
      }
    ],
    "subscriptions_inapp_grok_default_mode": [
      {
        "val": "regular",
        "desc": "grok opens in regular mode"
      },
      {
        "val": "fun",
        "desc": "grok opens in fun mode"
      }
    ],
    "rweb_update_fatigue_switch_to_app_link": [
      {
        "val": "BannerSwitchToApp",
        "desc": "banner switch-to-app prompt"
      },
      {
        "val": "InterstitialSwitchToApp",
        "desc": "full-screen interstitial prompt"
      },
      {
        "val": "NuxAppDownload",
        "desc": "new-user app download prompt"
      },
      {
        "val": "SwitchToAppFooter",
        "desc": "footer switch-to-app link"
      },
      {
        "val": "UseApp",
        "desc": "use-app prompt"
      },
      {
        "val": "UseAppExtended",
        "desc": "extended use-app prompt"
      },
      {
        "val": "SwitchToAppHigh1",
        "desc": "high-intensity campaign, bucket 1"
      },
      {
        "val": "SwitchToAppHigh2",
        "desc": "high-intensity campaign, bucket 2"
      },
      {
        "val": "SwitchToAppHigh3",
        "desc": "high-intensity campaign, bucket 3"
      },
      {
        "val": "SwitchToAppHigh5",
        "desc": "high-intensity campaign, bucket 5"
      },
      {
        "val": "SwitchToAppHigh7",
        "desc": "high-intensity campaign, bucket 7"
      },
      {
        "val": "SwitchToAppLow1",
        "desc": "low-intensity campaign, bucket 1"
      },
      {
        "val": "SwitchToAppLow3",
        "desc": "low-intensity campaign, bucket 3"
      },
      {
        "val": "SwitchToAppLow5",
        "desc": "low-intensity campaign, bucket 5"
      },
      {
        "val": "SwitchToAppLow7",
        "desc": "low-intensity campaign, bucket 7"
      },
      {
        "val": "SwitchToAppLow9",
        "desc": "low-intensity campaign, bucket 9"
      }
    ],
    "subscriptions_upsells_premium_home_nav": [
      {
        "val": "default",
        "desc": "standard premium nav button"
      },
      {
        "val": "try_premium",
        "desc": "try premium button"
      },
      {
        "val": "discount_40_percent",
        "desc": "40% off button"
      },
      {
        "val": "discount_50_percent",
        "desc": "50% off button"
      },
      {
        "val": "premium_upsell_upgrade",
        "desc": "upgrade button"
      },
      {
        "val": "premium_upsell_premium",
        "desc": "premium styled button"
      },
      {
        "val": "premium_upsell_get_premium",
        "desc": "get premium button"
      },
      {
        "val": "expiring_soon",
        "desc": "offer expiring soon button"
      },
      {
        "val": "last_chance",
        "desc": "last chance button"
      }
    ],
    "subscriptions_upsells_post_engagements_variant": [
      {
        "val": "direct_to_paywall",
        "desc": "opens paywall directly"
      },
      {
        "val": "analytics_popup",
        "desc": "shows analytics upsell popup"
      }
    ],
    "subscriptions_upsells_vo_nav_decoration_variant": [
      {
        "val": "30_percent_off",
        "desc": "30% off nav badge"
      },
      {
        "val": "last_week",
        "desc": "last week offer nav badge"
      },
      {
        "val": "last_day",
        "desc": "last day offer nav badge"
      }
    ],
    "subscriptions_upsells_right_sidebar_variant": [
      {
        "val": "choice_step",
        "desc": "plan-choice sidebar module"
      },
      {
        "val": "free_trial_basic_14_days",
        "desc": "14-day basic free trial"
      },
      {
        "val": "free_trial_premium_14_days",
        "desc": "14-day premium free trial"
      },
      {
        "val": "discount_50_percent",
        "desc": "50% off premium"
      },
      {
        "val": "discount_40_percent",
        "desc": "40% off premium"
      },
      {
        "val": "extended_discount_50_percent",
        "desc": "extended 50% off offer"
      },
      {
        "val": "ending_today_discount_50_percent",
        "desc": "50% off, ending today"
      },
      {
        "val": "ending_today_discount_40_percent",
        "desc": "40% off, ending today"
      },
      {
        "val": "thanksgiving_generic",
        "desc": "thanksgiving 40% off offer"
      },
      {
        "val": "thanksgiving_expiring",
        "desc": "thanksgiving offer expiring"
      },
      {
        "val": "thanksgiving_ending",
        "desc": "thanksgiving offer ending"
      },
      {
        "val": "anniversary_generic",
        "desc": "anniversary 40% off offer"
      },
      {
        "val": "anniversary_expiring",
        "desc": "anniversary offer expiring"
      },
      {
        "val": "anniversary_ending",
        "desc": "anniversary offer ending"
      }
    ],
    "subscriptions_upsells_bookmarks_screen_variant": [
      {
        "val": "basic_tier_selected",
        "desc": "bookmarks upsell, basic preselected"
      },
      {
        "val": "premium_tier_selected",
        "desc": "bookmarks upsell, premium preselected"
      }
    ],
    "subscriptions_upsells_explore_sidebar_analytics_upsell_variant": [
      {
        "val": "variant_a",
        "desc": "analytics upsell card, headline a"
      },
      {
        "val": "variant_b",
        "desc": "analytics upsell card, headline b"
      },
      {
        "val": "variant_c",
        "desc": "analytics upsell card, headline c"
      }
    ],
    "subscriptions_upsells_longform_sidebar_variant": [
      {
        "val": "variant_a",
        "desc": "longform upsell, copy a"
      },
      {
        "val": "variant_b",
        "desc": "longform upsell, copy b"
      },
      {
        "val": "variant_c",
        "desc": "longform upsell, copy c"
      },
      {
        "val": "variant_d",
        "desc": "longform upsell, copy d (alt image)"
      }
    ],
    "subscriptions_upsells_profile_sidebar_analytics_upsell_variant": [
      {
        "val": "variant_a",
        "desc": "analytics upsell card, headline a"
      },
      {
        "val": "variant_b",
        "desc": "analytics upsell card, headline b"
      },
      {
        "val": "variant_c",
        "desc": "analytics upsell card, headline c"
      }
    ],
    "subscriptions_upsells_radar_sidebar_variant": [
      {
        "val": "variant_a",
        "desc": "radar upsell, message, non-dismissible"
      },
      {
        "val": "variant_b",
        "desc": "radar upsell, header only, non-dismissible"
      },
      {
        "val": "variant_c",
        "desc": "radar upsell, message, dismissible"
      },
      {
        "val": "variant_d",
        "desc": "radar upsell, header only, dismissible"
      },
      {
        "val": "variant_e",
        "desc": "premium+ upsell, message, non-dismissible"
      },
      {
        "val": "variant_f",
        "desc": "premium+ upsell, header only, non-dismissible"
      },
      {
        "val": "variant_g",
        "desc": "premium+ upsell, message, dismissible"
      },
      {
        "val": "variant_h",
        "desc": "premium+ upsell, header only, dismissible"
      }
    ],
    "subscriptions_upsells_reply_boost_variant": [
      {
        "val": "variant_a",
        "desc": "reply boost upsell, short fatigue"
      },
      {
        "val": "variant_b",
        "desc": "reply boost upsell, longer fatigue"
      },
      {
        "val": "variant_c",
        "desc": "reply boost upsell, alt message"
      }
    ],
    "subscriptions_upsells_get_verified_button_variant": [
      {
        "val": "badge",
        "desc": "standard get-verified button"
      },
      {
        "val": "eu",
        "desc": "eu-region label variant"
      }
    ],
    "responsive_web_card_conversion_hoisted": [
      {
        "val": "off",
        "desc": "card hoisting disabled"
      },
      {
        "val": "legacy",
        "desc": "legacy card conversion enabled"
      }
    ],
    "subscriptions_upsells_post_composer_variant": [
      {
        "val": "alternative",
        "desc": "alternative inline premium callout in composer"
      }
    ]
  }
};
(function () {
  "use strict";

  const LOG = true;
  // very pretty................
  const log = (...a) => {if (LOG) try {console.log("%c[twitter flags]", "color:#1d9bf0;font-weight:700", ...a)} catch {}};

  const flags = {};
  let captured = false;
  let source = "none";
  let onchange = null;

  /*//////////////////////////////////////////////////////////////////////*/

  let overrides = {};
  try {overrides = JSON.parse(localStorage.getItem("twitterflags.overrides") || "{}") || {}} catch {overrides = {}}
  let appliedoverrides = {};
  try {appliedoverrides = JSON.parse(JSON.stringify(overrides))} catch {}
  let dirty = false;
  const saveoverrides = () => { try {localStorage.setItem("twitterflags.overrides", JSON.stringify(overrides))} catch {}};
  const hasoverride = k => Object.prototype.hasOwnProperty.call(overrides, k);
  const effective = k => (hasoverride(k) ? overrides[k] : flags[k]);
  const canon = o => {try {return JSON.stringify(Object.keys(o).sort().map(k => [k, o[k]]))} catch {return ""}};

  function applyoverrides(s) {
    try {
      const fs = s && s.featureSwitch;
      if (!fs) return;
      if (!fs.customoverrides || typeof fs.customoverrides !== "object") fs.customoverrides = {};
      const dc = fs.defaultConfig;
      let c = 0;
      for (const k in overrides) {
        fs.customoverrides[k] = overrides[k];
        if (dc) {
          if (dc[k] && typeof dc[k] === "object" && "value" in dc[k]) dc[k].value = overrides[k];
          else dc[k] = {value: overrides[k]};
        }
        c++;
      }
      if (c) log("applied", c, "saved overrides into customoverrides + defaultConfig for this load!");
    } catch (e) {log("applyoverrides error:", e && e.message)}
  }

  function configingest(cfg, from) {
    if (!cfg || typeof cfg !== "object") return 0;
    let hits = 0;
    for (const k in cfg) {
      const v = cfg[k];
      if (v && typeof v === "object" && "value" in v) { flags[k] = v.value; hits++ }
      else if (Array.isArray(v)) { flags[k] = v; hits++ }
      else if (typeof v === "boolean" || typeof v === "number" || typeof v === "string") { flags[k] = v; hits++ }
    }
    if (hits) {
      captured = true; source = from || source;
      log("ingested", hits, "flags from", from, "- total now", Object.keys(flags).length);
      if (onchange) onchange();
    }
    return hits;
  }

  function manifestingest(d, from) {
    if (!d || typeof d !== "object") return 0;
    const cfg = (d.config && typeof d.config === "object") ? d.config : d;
    return configingest(cfg, from || "manifest");
  }

  function ingestText(text, from) {
    let data; try { data = JSON.parse(text) } catch { return 0 }
    const pools = [data && data.config, data && data.settings, data].filter(x => x && typeof x === "object");
    let total = 0;
    for (const pool of pools) {
      let local = 0;
      for (const k in pool) if (pool[k] && typeof pool[k] === "object" && "value" in pool[k]) local++;
      if (local >= 10) total += configingest(pool, from || "fetch");
    }
    return total;
  }

  /*//////////////////////////////////////////////////////////////////////*/

  let forceenv = null;
  try { const dc = JSON.parse(localStorage.getItem("twitterflags.dev") || "{}"); if (dc && dc.forceDevEnv) forceenv = "devel" } catch {}
  if (forceenv) {
    try {
      let md = window.__META_DATA__;
      const patch = v => { try { if (v && typeof v === "object" && v.env !== forceenv) v.env = forceenv } catch {} return v };
      if (md !== undefined) patch(md);
      Object.defineProperty(window, "__META_DATA__", {
        configurable: true,
        get() { return md },
        set(v) { md = patch(v); log("forced __META_DATA__.env =", forceenv) }
      });
    } catch (e) { log("could not force env:", e && e.message) }
  }

  /*//////////////////////////////////////////////////////////////////////*/

  const IS = "__INITIAL_STATE__";
  function grabState(s, from) {
    try {
      const fs = s && s.featureSwitch;
      if (!fs) return 0;
      let n = 0;
      if (fs.defaultConfig) n += configingest(fs.defaultConfig, from + ":default");
      if (fs.customoverrides) n += configingest(fs.customoverrides, from + ":override");
      return n;
    } catch (e) {log("grabState error:", e && e.message); return 0}
  }
  let isInstalled = false;
  try {
    let bIS = window[IS];
    if (bIS !== undefined) {log(IS, "present at install"); grabState(bIS, "initial(pre)"); applyoverrides(bIS)}
    Object.defineProperty(window, IS, {
      configurable: true,
      get() { return bIS },
      set(v) { bIS = v; log(IS, "set, featureSwitch:", !!(v && v.featureSwitch)); grabState(v, "initial(set)"); applyoverrides(v) }
    });
    isInstalled = true;
  } catch (e) { log("could not define " + IS + " accessor:", e && e.message) }

  const MAN = "__FEATURE_SWITCH_MANIFEST__";
  let manInstalled = false;
  function resolvewrap(real, tag) {
    return function (data) {try {manifestingest(data, tag)} catch {} return real.apply(this, arguments)};
  }
  try {
    let backing = window[MAN];
    if (backing !== undefined) {
      log("manifest already present at install, type:", typeof backing);
      if (typeof backing === "function") { backing = resolvewrap(backing, "manifest(resolve-pre)"); log("wrapped pre-existing resolver") }
      else manifestingest(backing, "manifest(pre)");
    }
    Object.defineProperty(window, MAN, {
      configurable: true,
      get() { return backing },
      set(v) {
        log("manifest set, type:", typeof v, v && typeof v === "object" ? "(has config: " + !!v.config + ")" : "");
        if (typeof v === "function") backing = resolvewrap(v, "manifest(resolve)");
        else {manifestingest(v, "manifest(set)"); backing = v}
      }
    });
    manInstalled = true;
  } catch (e) {log("couldnt define manifest accessor?! ", e && e.message)}

  const somesettings = u => typeof u === "string" && u.indexOf("help/settings") >= 0;
  const veryswag = u => typeof u === "string" && /settings|feature.?switch|manifest/i.test(u);

  let fetchhooked = false;
  const ofetch = window.fetch;
  if (ofetch) {
    window.fetch = function (...a) {
      const u = (typeof a[0] === "string" ? a[0] : a[0] && a[0].url) || "";
      if (veryswag(u)) log("fetch ->", u);
      return ofetch.apply(this, a).then(r => {
        try { 
          if (somesettings(u) || somesettings(r && r.url)) r.clone().text().then(t => 
            {const n = ingestText(t, "fetch"); 
            log("settings fetch parsed", n, "flags")}).catch(() => {})
        } catch {}
        return r;
      });
    };
    fetchhooked = true;
  }

  let xhrhooked = false;
  try {
    const oopen = XMLHttpRequest.prototype.open, osend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (m, u) { this.xfu = u; if (veryswag(u)) log("xhr ->", u); return oopen.apply(this, arguments) };
    XMLHttpRequest.prototype.send = function () {
      this.addEventListener("load", () => { try { if (somesettings(this.xfu)) { const n = ingestText(this.responseText, "xhr"); log("settings xhr parsed", n, "flags") } } catch {} });
      return osend.apply(this, arguments);
    };
    xhrhooked = true;
  } catch (e) { log("could not hook xhr:", e && e.message) }

  /*//////////////////////////////////////////////////////////////////////*/

  const ISASSIGN = /__INITIAL_STATE__\s*=\s*\{/;
  let sourcegrabbed = false;

  function matchbraces(text, start) {
    let depth = 0, str = false, q = "";
    for (let i = start; i < text.length; i++) {
      const c = text[i];
      if (str) {if (c === "\\") {i++; continue} if (c === q) str = false; continue}
      if (c === '"' || c === "'" || c === "`") {str = true; q = c; continue}
      if (c === "{") depth++;
      else if (c === "}") {if (--depth === 0) return text.slice(start, i + 1)}
    }
    return null;
  }
  function extractassign(text, name) {
    let i = text.indexOf(name);
    while (i >= 0) {
      const b = text.indexOf("{", i + name.length);
      if (b >= 0 && b - (i + name.length) < 8) {
        const json = matchbraces(text, b);
        if (json) {try {return JSON.parse(json)} catch {}}
      }
      i = text.indexOf(name, i + name.length);
    }
    return null;
  }
  function scanhtmlsource() {
    if (sourcegrabbed) return 0;
    try {
      const scripts = document.getElementsByTagName("script");
      for (let i = 0; i < scripts.length; i++) {
        const sc = scripts[i];
        if (sc.src) continue;
        const t = sc.textContent;
        if (!t || !ISASSIGN.test(t)) continue;
        const obj = extractassign(t, IS);
        if (obj && obj.featureSwitch) {
          const n = grabState(obj, "html-source");
          if (n) {sourcegrabbed = true; log("read the full flag list straight from the page source:", n, "flags"); return n}
        }
      }
    } catch (e) {log("scanhtmlsource error:", e && e.message)}
    return 0;
  }

  function fetchsourcefallback() {
    if (sourcegrabbed) return;
    try {
      const f = ofetch || window.fetch;
      if (!f) return;
      f.call(window, location.href, {credentials: "include"}).then(r => r.text()).then(t => {
        if (sourcegrabbed) return;
        const obj = extractassign(t, IS);
        if (obj && obj.featureSwitch) {const n = grabState(obj, "html-source(refetch)"); if (n) {sourcegrabbed = true; log("read the full flag list via document refetch:", n, "flags")}}
        else log("refetch had no parseable __INITIAL_STATE__");
      }).catch(e => log("refetch failed:", e && e.message));
    } catch (e) {log("fetchsourcefallback error:", e && e.message)}
  }
  function sourceloop() {
    if (scanhtmlsource()) return;
    let tries = 0, obs = null;
    const stop = () => {if (obs) {obs.disconnect(); obs = null}};
    try {obs = new MutationObserver(() => {if (scanhtmlsource()) stop()}); obs.observe(document.documentElement, {childList: true, subtree: true})} catch {}
    const iv = setInterval(() => {if (scanhtmlsource() || ++tries > 40) {clearInterval(iv); stop(); if (!sourcegrabbed) fetchsourcefallback()}}, 150);
    document.addEventListener("DOMContentLoaded", () => {scanhtmlsource()}, {once: true});
  }
  sourceloop();

  /*//////////////////////////////////////////////////////////////////////*/

  const switchrecievers = ["isTrue", "getValue", "getInt", "getString", "getList", "getStringList", "getDouble", "getFloat", "getLong", "getBoolean", "getJson"];

  function findswitches() {
    try {
      const root = document.querySelector("#react-root");
      const host = root && root.firstElementChild;
      if (!host) return null;
      const el = host.wrappedJSObject || host;
      const key = Object.keys(el).find(x => x.startsWith("__reactProps"));
      if (!key) return null;
      const seen = new Set();
      const stack = [el[key]];
      let n = 0;
      while (stack.length && n < 4000) {
        const cur = stack.pop(); n++;
        if (!cur || typeof cur !== "object" || seen.has(cur)) continue;
        seen.add(cur);
        const fsw = cur.featureSwitches;
        if (fsw && typeof fsw.isTrue === "function") return fsw;
        if (Array.isArray(cur)) {for (const c of cur) stack.push(c); continue}
        stack.push(cur.props, cur.children, cur.contextProviderProps, cur.value);
      }
    } catch (e) {log("findswitches error:", e && e.message)}
    return null;
  }

  function poolsize(pool) {
    if (!pool || typeof pool !== "object" || Array.isArray(pool)) return 0;
    let n = 0;
    try {
      for (const key in pool) {
        const dv = pool[key];
        if (dv && typeof dv === "object" && "value" in dv) n++;
        else if (Array.isArray(dv) || typeof dv === "boolean" || typeof dv === "number" || typeof dv === "string") n++;
        if (n >= 10) break;
      }
    } catch {}
    return n;
  }

  function harvestswitches(fsw) {
    try {
      let best = null, bestN = 0;
      const seen = new Set();
      let o = fsw;
      for (let d = 0; o && d < 3; d++, o = Object.getPrototypeOf(o)) {
        for (const k of Object.getOwnPropertyNames(o)) {
          if (seen.has(k)) continue; seen.add(k);
          let v; try {v = fsw[k]} catch {continue}
          const n = poolsize(v);
          if (n > bestN) {bestN = n; best = v}
        }
      }
      return best && bestN >= 10 ? configingest(best, "features(live)") : 0;
    } catch (e) {log("harvestswitches error:", e && e.message); return 0}
  }

  // retry for a while
  function harvestloop(fsw) {
    let tries = 0;
    const go = () => {const n = harvestswitches(fsw); if (n) log("harvested", n, "flags from the live manager"); return n > 0};
    if (go()) return;
    const iv = setInterval(() => {if (go() || ++tries > 25) {clearInterval(iv); if (tries > 25) log("harvest: no flag map found on the manager")}}, 300);
  }

  let capturetimer = 0;
  function schedcapture() {if (!capturetimer) capturetimer = setTimeout(() => {capturetimer = 0; if (onchange) onchange()}, 250)}

  function hookswitches(fsw) {
    if (!fsw || fsw.tfhooked) return false;
    let wrapped = 0;
    for (const name of switchrecievers) {
      const orig = fsw[name];
      if (typeof orig !== "function") continue;
      fsw[name] = function (k) {
        if (typeof k === "string" && hasoverride(k)) {const v = overrides[k]; return name === "isTrue" ? v === true : v}
        const res = orig.apply(this, arguments);
        if (typeof k === "string" && res !== undefined) {
          const fresh = !(k in flags);
          if (fresh || (name === "getValue" && typeof res !== "object" && flags[k] !== res)) {
            flags[k] = res;
            if (!captured) {captured = true; if (source === "none") source = "live-read"}
            schedcapture();
          }
        }
        return res;
      };
      wrapped++;
    }
    fsw.tfhooked = true;
    log("hooked featureSwitches:", wrapped, "getter(s); overrides apply live now");
    harvestloop(fsw);
    return true;
  }

  let swhooked = false;
  function trackswitches() {if (!swhooked) {const fsw = findswitches(); if (fsw) swhooked = hookswitches(fsw)}}

  trackswitches();
  if (!swhooked) {
    let obs = null, tries = 0;
    const stop = () => {if (obs) {obs.disconnect(); obs = null}};
    try {obs = new MutationObserver(() => {trackswitches(); if (swhooked) stop()}); obs.observe(document.documentElement, {childList: true, subtree: true})} catch {}
    const iv = setInterval(() => {trackswitches(); if (swhooked || ++tries > 150) {clearInterval(iv); stop()}}, 100);
  }

  /*//////////////////////////////////////////////////////////////////////*/

  log("installed!\ninitial-state:", isInstalled, "\nmanifest:", manInstalled, "\nfetch:", fetchhooked, "\nxhr:", xhrhooked,
    "\nexpect an \"ingested N flags from initial(set):default\" line on full reload.\nif it never appears, the script is unfortunately sandboxed :(");

  window.twitterflags = flags;
  window.twitterflagsDebug = {
    flags, overrides,
    effective: k => effective(k),
    findswitches, rehook: () => {const fsw = findswitches(); return fsw ? hookswitches(fsw) : (log("featureSwitches not found yet"), false)},
    set: (k, v) => { overrides[k] = v; saveoverrides(); dirty = true; if (onchange) onchange(); return v },
    clear: k => { delete overrides[k]; saveoverrides(); dirty = true; if (onchange) onchange() },
    clearAll: () => { for (const k in overrides) delete overrides[k]; saveoverrides(); dirty = true; if (onchange) onchange() },
    status: () => ({ captured, source, sourcegrabbed, count: Object.keys(flags).length, overrides: Object.keys(overrides).length, dirty, isInstalled, manInstalled, fetchhooked, xhrhooked }),
    rescan: () => scanhtmlsource(),
    scan: () => {
      let best = null, bestN = 0;
      const seen = new Set();
      function walk(o, depth) {
        if (!o || typeof o !== "object" || depth > 4 || seen.has(o)) return;
        seen.add(o);
        let n = 0;
        for (const k in o) { try { const v = o[k]; if (v && typeof v === "object" && "value" in v && Object.keys(v).length <= 3) n++ } catch {} }
        if (n > bestN) { bestN = n; best = o }
        for (const k in o) { try { walk(o[k], depth + 1) } catch {} }
      }
      try { walk(window, 0) } catch {}
      if (best && bestN >= 10) { const n = configingest(best, "scan"); log("scan found", n, "flags"); return n }
      log("scan found nothing flag-shaped"); return 0;
    }
  };

  /*//////////////////////////////////////////////////////////////////////*/

  const PCHAN = "twitterflagspage", UCHAN = "twitterflagspanel";

  function snapshot() {
    return {
      captured, source, dirty, flags, overrides,
      applied: appliedoverrides,
      status: {count: Object.keys(flags).length, isInstalled, manInstalled, fetchhooked, xhrhooked}
    };
  }
  function prostate() {
    try {window.postMessage({source: PCHAN, type: "state", payload: snapshot()}, location.origin)} catch {}
  }

  window.addEventListener("message", e => {
    if (e.source !== window) return;
    const d = e.data;
    if (!d || d.source !== UCHAN) return;
    switch (d.cmd) {
      case "getstate": prostate(); break;
      case "set": overrides[d.name] = d.value; saveoverrides(); dirty = true; prostate(); break;
      case "setmany":
        if (d.set && typeof d.set === "object") for (const k in d.set) overrides[k] = d.set[k];
        if (Array.isArray(d.clear)) for (const k of d.clear) delete overrides[k];
        saveoverrides(); dirty = true; prostate(); break;
      case "clear": delete overrides[d.name]; saveoverrides(); dirty = true; prostate(); break;
      case "clearall": for (const k in overrides) delete overrides[k]; saveoverrides(); dirty = true; prostate(); break;
      case "syncoverrides": {
        const inc = (d.overrides && typeof d.overrides === "object" && !Array.isArray(d.overrides)) ? d.overrides : {};
        if (canon(inc) === canon(overrides)) break;
        for (const k in overrides) delete overrides[k];
        Object.assign(overrides, inc);
        saveoverrides();
        if (captured) dirty = true;
        applyoverrides(window[IS]);
        log("synced", Object.keys(inc).length, "override(s) from extension storage");
        prostate(); break;
      }
      case "reload": location.reload(); break;
    }
  });
  onchange = () => {try {prostate()} catch {}};
  prostate();
})();

(function () {
  "use strict";

  const PCHAN = "twitterflagspage", UCHAN = "twitterflagspanel";
  const KEY = "twitterflags.dev";
  const DEFAULT = {jfDev: false, inspect: false, exposeDebug: false, forceDevEnv: false, forcechirp: false};
  const log = (...a) => {try {console.log("%c[twitterflags:dev]", "color:#00ba7c;font-weight:700", ...a)} catch {}};

  let cfg;
  try {cfg = Object.assign({}, DEFAULT, JSON.parse(localStorage.getItem(KEY) || "{}"))}
  catch {cfg = Object.assign({}, DEFAULT)}
  // frozen load time snapshot so the panel can tell if a dev toggle is unsaved
  const applieddev = Object.assign({}, cfg);
  const save = () => {try {localStorage.setItem(KEY, JSON.stringify(cfg))} catch {}};

  try { if (cfg.jfDev) sessionStorage.setItem("jfDev", "true") } catch {}
  function exposedebug(on) {
    try {
      const u = new URL(location.href), has = u.searchParams.has("exposeDebug");
      if (on && !has) {u.searchParams.set("exposeDebug", "1"); history.replaceState(history.state, "", u.toString())}
      else if (!on && has) {u.searchParams.delete("exposeDebug"); history.replaceState(history.state, "", u.toString())}
    } catch {}
  }
  exposedebug(!!cfg.exposeDebug);
  if (cfg.forcechirp) try {reapplychirp()} catch {}

  /*//////////////////////////////////////////////////////////////////////*/

  function cssensure() {
    if (document.getElementById("tfdev-style")) return;
    const s = document.createElement("style");
    s.id = "tfdev-style";

    s.textContent = `

    html.tfdev-inspect [data-testid] {cursor: crosshair !important}
    html.tfdev-inspect [data-testid]:hover {outline: 1px solid #1d9bf0 !important; outline-offset: -1px}

    .tfdev-tip {
      position: fixed; z-index: 2147483647; 
      pointer-events: none;
      background: #1d9bf0; color: #fff; 
      font: 12px TwitterChirp, system-ui, sans-serif;
      padding: 3px 8px; border-radius: 6px; 
      transform: translateY(-130%);
      max-width: 60vw; overflow: hidden; 
      text-overflow: ellipsis; white-space: nowrap; display: none
    }
    .tfdev-tip.copied {background: #00ba7c}

    `;

    (document.head || document.documentElement).appendChild(s);
  }

  /*//////////////////////////////////////////////////////////////////////*/

  let tip = null, copyT = 0;
  const SUPPRESS = ["mousedown", "mouseup", "pointerdown", "pointerup", "auxclick", "contextmenu"];

  const onpanel = e => {
    const p = e.composedPath ? e.composedPath() : null;
    if (p) { for (const n of p) if (n && n.id === "tfuserscripthost") return true }
    return !!(e.target && e.target.closest && e.target.closest("#tfuserscripthost"));
  };
  const testidof = e => {
    if (onpanel(e)) return null;
    const p = e.composedPath ? e.composedPath() : null;
    if (p) { for (const n of p) if (n && n.nodeType === 1 && n.hasAttribute && n.hasAttribute("data-testid")) return n }
    return (e.target && e.target.closest) ? e.target.closest("[data-testid]") : null;
  };

  function onmove(e) {
    const t = testidof(e);
    if (!t || !tip) { if (tip) tip.style.display = "none"; return }
    if (!tip.classList.contains("copied")) tip.textContent = t.getAttribute("data-testid");
    tip.style.left = e.clientX + "px"; tip.style.top = e.clientY + "px"; tip.style.display = "block";
  }
  function suppress(e) {if (testidof(e)) {e.preventDefault(); e.stopPropagation()}}
  function onkeypress(e) {if (e.key === "Escape") { 
    cfg.inspect = false; 
    save(); apply(); post(); 
    log("inspector off (esc)")
  }}
  function onclick(e) {
    const t = testidof(e);
    if (!t || !tip) return;
    e.preventDefault(); e.stopPropagation();
    const name = t.getAttribute("data-testid");
    try { navigator.clipboard.writeText(name) } catch {}
    tip.textContent = "copied: " + name; tip.classList.add("copied");
    clearTimeout(copyT); copyT = setTimeout(() => { if (tip) tip.classList.remove("copied") }, 800);
  }

  function inspectset(on) {
    document.documentElement.classList.toggle("tfdev-inspect", on);
    if (on) {
      if (!tip && document.body) { tip = document.createElement("div"); 
      tip.className = "tfdev-tip"; document.body.appendChild(tip) }

      window.addEventListener("mousemove", onmove, true);
      window.addEventListener("click", onclick, true);
      window.addEventListener("keydown", onkeypress, true);
      SUPPRESS.forEach(t => window.addEventListener(t, suppress, true));
    } else {
      window.removeEventListener("mousemove", onmove, true);
      window.removeEventListener("click", onclick, true);
      window.removeEventListener("keydown", onkeypress, true);
      SUPPRESS.forEach(t => window.removeEventListener(t, suppress, true));

      if (tip) tip.style.display = "none";
    }
  }

  /*//////////////////////////////////////////////////////////////////////*/

  function apply() {
    cssensure();
    try {if (cfg.jfDev) sessionStorage.setItem("jfDev", "true");
    else if (sessionStorage.getItem("jfDev") === "true") sessionStorage.removeItem("jfDev")} catch {}
    exposedebug(!!cfg.exposeDebug);
    inspectset(!!cfg.inspect);
    forcechirp(!!cfg.forcechirp);
  }

  function post() {try {window.postMessage({source: PCHAN, type: "dev", config: cfg, applied: applieddev}, location.origin)} catch {}}

  function reapplychirp() {
    try {
      const stack = '"TwitterChirp", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
      if (window.FontFace && document.fonts) {
        [["chirp-regular-web", "400"], ["chirp-medium-web", "500"], ["chirp-bold-web", "700"], ["chirp-heavy-web", "800"]].forEach(([n, weight]) => {
          try {
            const ff = new FontFace("TwitterChirp", 'url("https://abs.twimg.com/fonts/v1/' + n + '.woff2")', {weight: weight, display: "swap"});
            ff.load().then(f => document.fonts.add(f)).catch(e => log("chirp", weight, "failed:", e && e.message));
          } catch (e) {log("chirp", weight, "error:", e && e.message)}
        });
      }
      let s = document.getElementById("tf-chirp-force");
      if (!s) { s = document.createElement("style"); s.id = "tf-chirp-force"; (document.head || document.documentElement).appendChild(s) }
      s.textContent = "*, ::before, ::after { font-family: " + stack + " !important }";
      log("reapplied + forced TwitterChirp onto the page");
    } catch (e) {log("reapplychirp error:", e && e.message)}
  }

  // when the checkbox is on, keep the force live; off tears the style back out
  function forcechirp(on) {
    if (on) {reapplychirp(); return}
    const s = document.getElementById("tf-chirp-force");
    if (s) s.remove();
  }

  function swaction(action) {
    if (action === "chirp") {reapplychirp(); return}
    try {
      const sw = navigator.serviceWorker;
      if (!sw) {log("no serviceWorker api"); return}
      if (action === "unregister") {sw.getRegistrations().then(rs => {rs.forEach(r => r.unregister()); log("unregistered", rs.length, "service worker(s)")}); return}
      const type = action === "flush" ? "ACTION_FLUSH" : action === "refresh" ? "ACTION_REFRESH" : null;
      if (!type) return;
      if (sw.controller) {sw.controller.postMessage({type}); log("sent", type)}
      else log("no active service worker controller");
    } catch (e) {log("sw action failed:", e && e.message)}
  }

  window.addEventListener("message", e => {
    if (e.source !== window) return;
    const d = e.data;
    if (!d || d.source !== UCHAN) return;
    if (d.cmd === "devget") post();
    else if (d.cmd === "devset") { Object.assign(cfg, d.config || {}); save(); apply(); post() }
    else if (d.cmd === "sw") swaction(d.action);
  });

  window.twitterflagsDev = {
    config: cfg,
    set: (k, v) => { cfg[k] = v; save(); apply(); post(); return cfg }
  };

  function init() { apply(); post(); log("ready", cfg) }
  if (document.body) init();
  else document.addEventListener("DOMContentLoaded", init);

})();


  /*//////////////////////////////////////////////////////////////////////*/

  function makeshim() {
    const PCHAN = "twitterflagspage", UCHAN = "twitterflagspanel";
    let last = null;
    const listeners = [];
    window.addEventListener("message", e => {
      if (e.source !== window) return;
      const d = e.data;
      if (!d || d.source !== PCHAN) return;
      if (d.type === "state") last = d;
      listeners.forEach(fn => {try {fn(d)} catch {}});
    });
    const local = {
      get(keys, cb) {
        const out = {};
        const arr = Array.isArray(keys) ? keys : keys == null ? [] : [keys];
        try {for (const k of arr) {const raw = localStorage.getItem("twitterflags.store." + k); if (raw != null) out[k] = JSON.parse(raw)}} catch {}
        if (cb) cb(out);
      },
      set(obj, cb) {
        try {for (const k in obj) localStorage.setItem("twitterflags.store." + k, JSON.stringify(obj[k]))} catch {}
        if (cb) cb();
      }
    };
    return {
      runtime: {onMessage: {addListener: fn => listeners.push(fn)}, lastError: undefined, getURL: p => p},
      tabs: {
        query: (q, cb) => {const t = [{id: 1, url: location.href}]; if (cb) {cb(t); return} return Promise.resolve(t)},
        sendMessage: (id, msg, cb) => {if (msg && msg.cmd === "ping") {if (cb) cb(last); return} try {window.postMessage(msg, location.origin)} catch {}},
        onActivated: {addListener: () => {}},
        onUpdated: {addListener: () => {}},
        reload: () => {try {location.reload()} catch {}},
        create: o => {try {window.open(o.url, "_blank")} catch {}}
      },
      storage: {local}
    };
  }

  function mountpanel() {
    if (document.getElementById("tfuserscripthost")) return;
    const host = document.createElement("div");
    host.id = "tfuserscripthost";
    const root = host.attachShadow({mode: "open"});

    const style = document.createElement("style");
    style.textContent = panelcss + hostcss;
    root.appendChild(style);

    const wrap = document.createElement("div");
    wrap.className = "tfpanelwrap";
    wrap.innerHTML = '<button class="tfclose" title="close">' + closesvg + "</button>" + panelhtml;
    root.appendChild(wrap);

    const fab = document.createElement("button");
    fab.className = "tffab"; fab.title = "drag me twin! (right-click to hide, alt+shift+f to bring back)";
    fab.innerHTML = iconsvg;
    root.appendChild(fab);

    (document.body || document.documentElement).appendChild(host);

    const setsb = () => {try {const w = window.innerWidth - document.documentElement.clientWidth; host.style.setProperty("--tfsb", (w > 0 ? w : 0) + "px")} catch {}};
    setsb();
    window.addEventListener("resize", setsb);

    function squish(on) {
      try {
        const rr = document.querySelector("#react-root");
        if (!rr) return;
        if (on && window.innerWidth > 500) {
          rr.style.setProperty("width", "calc(100vw - 390px)", "important");
          rr.style.setProperty("overflow-x", "hidden", "important");
        } else {
          rr.style.width = ""; rr.style.overflowX = "";
        }
      } catch {}
    }
    const setopen = on => {wrap.classList.toggle("open", on); squish(on)};

    // show / hide the circle
    const sethidden = h => {try {localStorage.setItem("twitterflags.fabhidden", h ? "1" : "0")} catch {} fab.style.display = h ? "none" : ""};
    try {if (localStorage.getItem("twitterflags.fabhidden") === "1") fab.style.display = "none"} catch {}
    fab.addEventListener("contextmenu", e => {e.preventDefault(); sethidden(true)});
    window.addEventListener("keydown", e => {
      if (e.altKey && e.shiftKey && ((e.key || "").toLowerCase() === "f" || e.code === "KeyF")) {e.preventDefault(); sethidden(fab.style.display !== "none")}
    }, true);

    try {
      const pos = JSON.parse(localStorage.getItem("twitterflags.fabpos") || "null");
      if (pos && typeof pos.left === "number") {fab.style.left = pos.left + "px"; fab.style.top = pos.top + "px"; fab.style.right = "auto"; fab.style.bottom = "auto"}
    } catch {}

    let down = false, moved = false, sx = 0, sy = 0, ox = 0, oy = 0;
    fab.addEventListener("pointerdown", e => {
      down = true; moved = false;
      const r = fab.getBoundingClientRect();
      ox = r.left; oy = r.top; sx = e.clientX; sy = e.clientY;
      try {fab.setPointerCapture(e.pointerId)} catch {}
    });
    fab.addEventListener("pointermove", e => {
      if (!down) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;
      const nx = Math.max(0, Math.min(window.innerWidth - fab.offsetWidth, ox + dx));
      const ny = Math.max(0, Math.min(window.innerHeight - fab.offsetHeight, oy + dy));
      fab.style.left = nx + "px"; fab.style.top = ny + "px"; fab.style.right = "auto"; fab.style.bottom = "auto";
    });
    fab.addEventListener("pointerup", e => {
      if (!down) return;
      down = false;
      try {fab.releasePointerCapture(e.pointerId)} catch {}
      if (moved) {try {localStorage.setItem("twitterflags.fabpos", JSON.stringify({left: fab.offsetLeft, top: fab.offsetTop}))} catch {}}
      else setopen(!wrap.classList.contains("open"));
    });
    wrap.querySelector(".tfclose").addEventListener("click", () => setopen(false));

    const __tfshim = makeshim();
    const __tfroot = root;

    /*//////////////////////////////////////////////////////////////////////*/


(function (chrome, root) {
  "use strict";

  const PCHAN = "twitterflagspage", UCHAN = "twitterflagspanel";
  const HOST = /^https:\/\/(x|twitter)\.com\//;
  const EXT = typeof chrome !== "undefined" && !!(chrome.runtime && chrome.runtime.onMessage && chrome.tabs);

  let captured = false, source = "none", dirty = false, cached = false;
  let flags = {}, overrides = {}, status = {}, applied = {};
  let devconfig = { jfDev: false, inspect: false }, applieddev = {};
  const hasoverride = k => Object.prototype.hasOwnProperty.call(overrides, k);
  const effective = k => (hasoverride(k) ? overrides[k] : flags[k]);
  const persist = () => {if (EXT) try {chrome.storage.local.set({overrides})} catch {}};
  const canon = o => {try {return JSON.stringify(Object.keys(o).sort().map(k => [k, o[k]]))} catch {return ""}};
  const clone = o => {try {return JSON.parse(JSON.stringify(o))} catch {return {}}};
  // dev toggles that need a reload to apply count toward unsaved
  const DEVPERSIST = ["jfDev", "exposeDebug", "forceDevEnv"];
  const devkey = c => JSON.stringify(DEVPERSIST.map(k => [k, !!(c && c[k])]));
  const markdirty = () => {dirty = canon(overrides) !== canon(applied) || devkey(devconfig) !== devkey(applieddev)};

  /*//////////////////////////////////////////////////////////////////////*/

  let tabId = null;

  async function resolveTab() {
    let t;
    try { [t] = await chrome.tabs.query({ active: true, lastFocusedWindow: true }) } catch {}
    if (!t || !HOST.test(t.url || "")) {
      let all = [];
      try { all = await chrome.tabs.query({ lastFocusedWindow: true }) } catch {}
      t = all.find(x => HOST.test(x.url || "")) || t;
    }
    if (!t || !HOST.test(t.url || "")) {
      let all = [];
      try { all = await chrome.tabs.query({}) } catch {}
      t = all.find(x => HOST.test(x.url || "")) || t;
    }
    tabId = t && HOST.test(t.url || "") ? t.id : null;
    return tabId;
  }

  function send(cmd, extra) {
    if (!EXT || tabId == null) return;
    try { chrome.tabs.sendMessage(tabId, Object.assign({ source: UCHAN, cmd }, extra || {})) } catch {}
  }

  function ping() {
    if (tabId == null) return;
    try {
      chrome.tabs.sendMessage(tabId, { source: UCHAN, cmd: "ping" }, resp => {
        void chrome.runtime.lastError;
        if (resp && resp.source === PCHAN && resp.payload) stateapply(resp.payload);
      });
    } catch {}
  }

  let livestamp = 0, cachetimer = 0;

  async function refresh() {
    if (!EXT) {loadplaceholder(); return}
    await resolveTab();
    if (tabId == null) {loadcached(() => {captured = false; render(true)}); return}
    const before = livestamp;
    ping();
    send("getstate");
    send("devget");
    clearTimeout(cachetimer);
    cachetimer = setTimeout(() => {if (livestamp === before) loadcached()}, 800);
  }

  function stateapply(p, fromcache) {
    if (!p) return;
    if (fromcache) cached = true;
    else {cached = false; livestamp = Date.now()}
    if (p.captured) captured = true; 
    
    const incoming = p.flags || {};
    if (Object.keys(incoming).length) flags = Object.assign(flags, incoming);
    source = p.source || source; overrides = p.overrides || {}; status = p.status || {};
    applied = p.applied || {}; markdirty();
    rafrender();
  }

  function loadcached(fallback) {
    const before = livestamp;
    try {
      chrome.storage.local.get(["laststate", "overrides"], r => {
        void chrome.runtime.lastError;
        if (livestamp !== before) return;
        const p = r && r.laststate;
        if (!p) {if (fallback) fallback(); return}
        if (r.overrides) p.overrides = r.overrides;
        stateapply(p, true);
      });
    } catch {if (fallback) fallback()}
  }

  function loadplaceholder() {
    captured = true; source = "placeholder";
    flags = {
      responsive_web_grok_voice_mode_enabled: false,
      responsive_web_edit_tweet_enabled: true,
      rweb_conf_only_enabled: false,
      responsive_web_api_transition_enabled: true,
      rweb_debugger_enabled: false,
      rweb_conf_dev_enabled: false,
      network_layer_503_backoff_mode: 2,
      media_async_upload_longer_video_max_video_duration: 600,
      responsive_web_grok_personality: "default",
      responsive_web_some_unknown_preview_enabled: false
    };
    overrides = {
      responsive_web_grok_voice_mode_enabled: true,
      rweb_conf_only_enabled: true,
      network_layer_503_backoff_mode: 5
    };
    devconfig = {jfDev: false, inspect: false, exposeDebug: false};
    status = {count: Object.keys(flags).length, isInstalled: true, manInstalled: true, fetchHooked: true, xhrHooked: true};
    applied = {}; markdirty(); render(); syncdev();
  }

  if (EXT) {
    chrome.runtime.onMessage.addListener(msg => {
      if (!msg || msg.source !== PCHAN) return;
      if (msg.type === "state") stateapply(msg.payload);
      else if (msg.type === "dev") { Object.assign(devconfig, msg.config || {}); if (msg.applied) applieddev = msg.applied; syncdev() }
    });
    chrome.tabs.onActivated.addListener(refresh);
    chrome.tabs.onUpdated.addListener((id, info) => { if (id === tabId && info.status === "complete") refresh() });
    window.addEventListener("focus", refresh);
    window.addEventListener("pageshow", refresh);
    document.addEventListener("visibilitychange", () => {if (!document.hidden) refresh()});
  }

  /*//////////////////////////////////////////////////////////////////////*/

  let knowndesc = {}, dangerknowndesc = {}, switchcfg = {}, upsellflags = [], optionsmap = {};

  // minimal jsonc
  function parsejsonc(text) {
    let o = "", str = false, q = "", i = 0;
    while (i < text.length) {
      const c = text[i], n = text[i + 1];
      if (str) { o += c; if (c === "\\") { o += text[i + 1]; i += 2; continue } if (c === q) str = false; i++ }
      else if (c === '"' || c === "'") { str = true; q = c; o += c; i++ }
      else if (c === "/" && n === "/") { while (i < text.length && text[i] !== "\n") i++ }
      else if (c === "/" && n === "*") { i += 2; while (i < text.length && !(text[i] === "*" && text[i + 1] === "/")) i++; i += 2 }
      else { o += c; i++ }
    }
    return JSON.parse(o.replace(/,(\s*[}\]])/g, "$1"));
  }

  async function loadconfigs() {
    if (window.twitterflagsconfigs) return window.twitterflagsconfigs;
    const get = async f => {
      try {
        const url = (EXT && chrome.runtime.getURL) ? chrome.runtime.getURL("configs/" + f) : "configs/" + f;
        return parsejsonc(await (await fetch(url)).text());
      } catch { return {} }
    };
    const [desc, switches, upsells, options] = await Promise.all([get("descriptions.jsonc"), get("switches.jsonc"), get("upsells.jsonc"), get("options.jsonc")]);
    return { desc, switches, upsells, options };
  }

  const prefixes = ["responsive_web_", "rweb_", "c9s_"];

  function descFor(name) {
    if (knowndesc[name]) return { text: knowndesc[name], auto: false };
    let s = name;
    for (const p of prefixes) { if (s.startsWith(p)) { s = s.slice(p.length); break } }
    s = s.replace(/_enabled$/, "").replace(/_/g, " ").trim();
    return { text: s, auto: true };
  }

  const dangerregex = /(_only_enabled|killswitch|_migration|api_transition|redux_use_fragment|maintenance_mode|session_binding|service_worker|503_backoff)/;
  function dangerFor(name) {
    if (dangerknowndesc[name]) return dangerknowndesc[name];
    if (dangerregex.test(name)) return "matches a risky pattern";
    return null;
  }

  /*//////////////////////////////////////////////////////////////////////*/

  const escapehtml = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  function typeOf(v) {
    if (typeof v === "boolean") return "boolean";
    if (typeof v === "number") return "number";
    if (Array.isArray(v)) return "list";
    if (v && typeof v === "object") return "json";
    return "string";
  }
  function asInputValue(v) {
    if (Array.isArray(v) || (v && typeof v === "object")) return JSON.stringify(v);
    return v == null ? "" : String(v);
  }
  function parseInput(type, raw) {
    if (type === "number") { const n = Number(raw); return raw.trim() === "" || Number.isNaN(n) ? raw : n }
    if (type === "list") {
      const t = raw.trim();
      if (t.startsWith("[")) { try { return JSON.parse(t) } catch {} }
      return t === "" ? [] : t.split(",").map(x => x.trim()).filter(x => x !== "");
    }
    if (type === "json") { try { return JSON.parse(raw) } catch { return raw } }
    return raw;
  }

  /*//////////////////////////////////////////////////////////////////////*/

  const query = selector => root.querySelector(selector);
  const search = query(".search"), prefixselect = query(".prefixselect"), list = query(".list");
  const header = query(".header"), footer = query(".footer"), reload = query(".reload"), undo = query(".undo");
  const flagcount = query(".flagcount");
  // dev toggles + sw buttons live in .devbar (bottom) now, outside .header, so
  // checkbox painting + click delegation scope to their common ancestor
  const panel = header.parentNode;

  const TICK = '<svg class="tick" viewBox="0 0 24 24" aria-hidden="true"><g><path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path></g></svg>';
  const WARN = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10.5 17c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zm1.5-3c.5 0 1 .2 1 .2l.25-5.7h-2.5l.25 5.7s.5-.2 1-.2zm10.568 6.745c.451-.783.45-1.717-.002-2.496l-8.4-14.511C13.712 2.957 12.903 2.49 12 2.49s-1.711.467-2.165 1.249l-8.4 14.509c-.453.78-.454 1.714-.002 2.497C1.886 21.531 2.696 22 3.6 22h16.8c.905 0 1.715-.469 2.168-1.255zM12.435 4.741l8.4 14.511c.125.214.053.402 0 .495-.044.076-.174.253-.435.253H3.6c-.261 0-.391-.177-.435-.253-.053-.093-.125-.281 0-.495l8.4-14.51c.131-.228.348-.252.435-.252s.304.024.435.251z"/></svg>';
  const UNDO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.29 2.29l1.42 1.42L5.41 6H15c3.87 0 7 3.13 7 7s-3.13 7-7 7H8v-2h7c2.76 0 5-2.24 5-5s-2.24-5-5-5H5.41l2.3 2.29-1.42 1.42L1.59 7l4.7-4.71z"/></svg>';

  // switch option icons!
  const FICONS = {
    check: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.75c-4.56 0-8.25 3.69-8.25 8.25s3.69 8.25 8.25 8.25 8.25-3.69 8.25-8.25S16.56 3.75 12 3.75zM1.75 12C1.75 6.34 6.34 1.75 12 1.75S22.25 6.34 22.25 12 17.66 22.25 12 22.25 1.75 17.66 1.75 12zM16.4 9.28l-5.21 7.15-4.1-3.27 1.25-1.57 2.47 1.98 3.97-5.47 1.62 1.18z"/></svg>',
    pencil: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.543 4.04275C15.3142 2.27164 18.1858 2.27164 19.957 4.04275C21.7282 5.81396 21.7282 8.68558 19.957 10.4568L11.2314 19.1834C10.4044 20.0104 9.31319 20.5208 8.14844 20.6267L2.89551 21.1043L3.37305 15.8513C3.47901 14.6866 3.99039 13.5953 4.81738 12.7683L13.543 4.04275ZM6.23145 14.1824C5.73525 14.6786 5.42881 15.3341 5.36523 16.033L5.10449 18.8943L7.9668 18.6346C8.66565 18.571 9.32019 18.2645 9.81641 17.7683L16.585 10.9988L13 7.41385L6.23145 14.1824ZM18.543 5.45682C17.5528 4.46675 15.9472 4.46675 14.957 5.45682L14.4141 5.99979L17.999 9.58475L18.543 9.04275C19.5331 8.05257 19.5331 6.44698 18.543 5.45682Z" fill-rule="evenodd" clip-rule="evenodd"/><path d="M21 20.9998H12.207C12.3582 20.8723 12.5047 20.7382 12.6455 20.5974L14.2432 18.9998H21V20.9998Z"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.75c-4.56 0-8.25 3.69-8.25 8.25s3.69 8.25 8.25 8.25 8.25-3.69 8.25-8.25S16.56 3.75 12 3.75zM1.75 12C1.75 6.34 6.34 1.75 12 1.75S22.25 6.34 22.25 12 17.66 22.25 12 22.25 1.75 17.66 1.75 12zm8.84 0l-2.3-2.29 1.42-1.42 2.29 2.3 2.29-2.3 1.42 1.42-2.3 2.29 2.3 2.29-1.42 1.42-2.29-2.3-2.29 2.3-1.42-1.42 2.3-2.29z"/></svg>',
    tick: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"/></svg>',
    compose: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10.938 4.5H9.9c-1.136 0-1.929 0-2.546.05-.605.05-.953.143-1.216.277-.564.288-1.023.747-1.31 1.31-.135.264-.228.612-.277 1.218C4.5 7.97 4.5 8.765 4.5 9.9v4.2c0 1.136 0 1.929.05 2.546.05.605.143.953.277 1.216.288.565.747 1.023 1.31 1.31.264.135.612.228 1.217.277.617.05 1.41.051 2.546.051h4.2c1.136 0 1.929 0 2.545-.05.606-.05.954-.143 1.217-.277.565-.288 1.023-.746 1.31-1.31.135-.264.228-.612.277-1.217.05-.617.051-1.41.051-2.546v-1.037h2V14.1c0 1.103.001 1.992-.058 2.709-.06.728-.185 1.368-.487 1.96-.48.941-1.245 1.707-2.185 2.186-.593.302-1.233.428-1.961.488-.718.058-1.606.057-2.71.057H9.9c-1.103 0-1.991.001-2.709-.058-.728-.06-1.368-.185-1.96-.487-.941-.48-1.707-1.245-2.186-2.185-.302-.593-.428-1.233-.487-1.961-.059-.718-.058-1.606-.058-2.71V9.9c0-1.103-.001-1.991.058-2.709.06-.728.185-1.368.487-1.96.48-.941 1.245-1.707 2.185-2.186.593-.302 1.233-.428 1.961-.487.718-.059 1.606-.058 2.71-.058h1.037v2z"/><path d="M16.293 3.293c1.219-1.219 3.195-1.219 4.414 0 1.219 1.219 1.219 3.195 0 4.414l-5.491 5.491c-.533.533-.89.896-1.31 1.179-.356.24-.742.433-1.148.574-.478.167-.983.234-1.729.341l-2.708.387.387-2.708c.107-.746.174-1.25.34-1.729.142-.405.335-.792.575-1.148.283-.42.646-.777 1.179-1.31l5.491-5.491zm3 1.414c-.438-.438-1.148-.438-1.586 0l-5.491 5.491c-.587.587-.784.79-.934 1.013-.144.214-.26.445-.345.688-.088.254-.131.533-.248 1.354l-.01.067.068-.008c.82-.118 1.1-.161 1.354-.25.243-.084.474-.2.688-.344.223-.15.426-.347 1.013-.934l5.491-5.491c.438-.438.438-1.148 0-1.586z" fill-rule="evenodd" clip-rule="evenodd"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.543 8.96l1.414-1.42L12 14.59l7.043-7.05 1.414 1.42L12 17.41 3.543 8.96z"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.057L5 6.464v5.448c0 2.165.851 3.687 2.188 4.952 1.275 1.208 2.965 2.155 4.812 3.154 1.847-1 3.537-1.946 4.813-3.154C18.148 15.6 19 14.077 19 11.912V6.464zM11 15v-2.21c-.882-.386-1.5-1.265-1.5-2.29C9.5 9.12 10.62 8 12 8s2.5 1.12 2.5 2.5c0 1.025-.618 1.904-1.5 2.29V15c0 .552-.448 1-1 1s-1-.448-1-1zm10-3.088c0 2.807-1.149 4.83-2.813 6.405-1.615 1.53-3.745 2.66-5.712 3.72-.297.16-.653.16-.95 0-1.967-1.06-4.097-2.19-5.713-3.72C4.15 16.742 3 14.72 3 11.912V6.464c0-.854.542-1.614 1.35-1.892l7-2.406.16-.047c.375-.095.772-.08 1.14.047l7 2.406.149.058C20.524 4.945 21 5.663 21 6.464z"/></svg>',
    warn: WARN
  };
  const FCOLORS = {default: "#536471", green: "#00ba7c", yellow: "#e0b219", red: "#f4212e", blue: "#1d9bf0"};
  const filters = {state: "all", type: "all", danger: "all"};

  function buildswitches() {
    const devrow = query(".row2.dev"), swrow = query(".row2.swrow"), filtrow = query(".row2.filters"), bulk = filtrow.querySelector(".bulk");
    const mk = (s, defgroup) => {
      const lbl = document.createElement("label");
      lbl.className = "checklabel";
      lbl.setAttribute("data-group", s.flag ? "flag" : defgroup);
      if (s.flag) lbl.setAttribute("data-flag", s.flag); else lbl.setAttribute("data-key", s.key);
      if (s.title) lbl.setAttribute("title", s.title);
      const box = document.createElement("span"); box.className = "checkbox"; box.innerHTML = TICK;
      lbl.appendChild(box); lbl.appendChild(document.createTextNode(s.label));
      return lbl;
    };
    const mkswitch = f => {
      const sw = document.createElement("div");
      sw.className = "fswitch"; sw.setAttribute("data-filter", f.key);
      const handle = document.createElement("div"); handle.className = "fhandle";
      sw.appendChild(handle);
      (f.options || []).forEach(o => {
        const seg = document.createElement("button");
        seg.className = "fseg"; seg.type = "button";
        seg.setAttribute("data-val", o.val);
        if (o.color) seg.setAttribute("data-color", o.color);
        const ic = (o.icon && FICONS[o.icon]) ? `<span class="fico">${FICONS[o.icon]}</span>` : "";
        seg.innerHTML = ic + `<span class="fseglbl" data-label="${escapehtml(o.label)}">${escapehtml(o.label)}</span>`;
        sw.appendChild(seg);
      });
      return sw;
    };
    (switchcfg.actions || []).forEach(a => {
      const b = document.createElement("button");
      b.className = "swbtn"; b.textContent = a.label;
      b.setAttribute("data-sw", a.action);
      if (a.title) b.setAttribute("title", a.title);
      swrow.appendChild(b);
    });
    (switchcfg.dev || []).forEach(s => (s.row === "sw" ? swrow : devrow).appendChild(mk(s, "dev")));
    (switchcfg.filters || []).forEach(f => {if (!(f.key in filters)) filters[f.key] = ((f.options || [])[0] || {}).val || "all"; filtrow.insertBefore(mkswitch(f), bulk)});
    paintswitches();
  }

  function paintchecks() {
    panel.querySelectorAll(".checklabel").forEach(lbl => {
      const grp = lbl.getAttribute("data-group");
      let on;
      if (grp === "dev") on = !!devconfig[lbl.getAttribute("data-key")];
      else if (grp === "flag") on = effective(lbl.getAttribute("data-flag")) === true;
      else return;
      lbl.querySelector(".checkbox").classList.toggle("on", on);
    });
  }

  function paintswitches() {
    query(".row2.filters").querySelectorAll(".fswitch").forEach(sw => {
      const cur = filters[sw.getAttribute("data-filter")], handle = sw.querySelector(".fhandle");
      let active = null;
      sw.querySelectorAll(".fseg").forEach(seg => {const on = seg.getAttribute("data-val") === cur; seg.classList.toggle("on", on); if (on) active = seg});
      if (active && handle) {
        handle.style.left = active.offsetLeft + "px";
        handle.style.width = active.offsetWidth + "px";
        handle.style.backgroundColor = FCOLORS[active.getAttribute("data-color")] || FCOLORS.default;
      }
    });
  }

  function bulksafe(mode) {
    const set = {}, clear = [];
    for (const name of Object.keys(flags)) {
      if (typeOf(flags[name]) !== "boolean" || dangerFor(name)) continue;
      if (mode === "reset") { if (hasoverride(name)) { delete overrides[name]; clear.push(name) } }
      else {
        const val = mode === "on";
        if (eq(val, flags[name])) { if (hasoverride(name)) { delete overrides[name]; clear.push(name) } }
        else { overrides[name] = val; set[name] = val }
      }
    }
    if (!Object.keys(set).length && !clear.length) return;
    markdirty(); persist(); send("setmany", { set, clear }); render();
  }

  function applyupsells(mode) {
    const set = {}, clear = [];
    for (const u of upsellflags) {
      if (!u || typeof u.flag !== "string") continue;
      if (mode === "off") { overrides[u.flag] = u.off; set[u.flag] = u.off }
      else if (hasoverride(u.flag)) { delete overrides[u.flag]; clear.push(u.flag) }
    }
    if (!Object.keys(set).length && !clear.length) return;
    markdirty(); persist(); send("setmany", { set, clear }); render();
  }

  panel.addEventListener("click", e => {
    const sw = e.target.closest(".swbtn");
    if (sw) {
      e.preventDefault();
      send("sw", {action: sw.getAttribute("data-sw")});
      const orig = sw.textContent; sw.textContent = "sent";
      setTimeout(() => {sw.textContent = orig}, 900);
      return;
    }
    const up = e.target.closest("[data-upsell]");
    if (up) { e.preventDefault(); applyupsells(up.getAttribute("data-upsell")); return }
    const seg = e.target.closest(".fseg");
    if (seg) { e.preventDefault(); filters[seg.closest(".fswitch").getAttribute("data-filter")] = seg.getAttribute("data-val"); paintswitches(); render(); return }
    const bb = e.target.closest(".bulkbtn");
    if (bb) { e.preventDefault(); bulksafe(bb.getAttribute("data-bulk")); return }
    const lbl = e.target.closest(".checklabel");
    if (!lbl) return;
    e.preventDefault();
    const grp = lbl.getAttribute("data-group"), k = lbl.getAttribute("data-key");
    if (grp === "dev") {devconfig[k] = !devconfig[k]; devpush(); syncdev()}
    else if (grp === "flag") {
      const f = lbl.getAttribute("data-flag");
      const base = flags[f], val = !(effective(f) === true);
      if (eq(val, base)) { delete overrides[f]; send("clear", { name: f }) }
      else { overrides[f] = val; send("set", { name: f, value: val }) }
      markdirty(); persist(); render();
    }
  });

  function syncdev() {paintchecks(); markdirty(); updateFoot()}
  const devpush = () => {send("devset", {config: devconfig}); if (EXT) try {chrome.storage.local.set({devconfig})} catch {}};
  paintchecks();

  const prefof = n => n.startsWith("responsive_web_") ? "responsive_web" : n.split("_")[0];

  function preffill(counts) {
    const cur = prefixselect.value;
    const big = Object.keys(counts).filter(p => counts[p] >= 3).sort();
    const opts = ["", ...big];
    if (Object.keys(counts).some(p => counts[p] <= 2)) opts.push("__other__");
    prefixselect.innerHTML = opts.map(o => `<option value="${o}">${o === "" ? "all prefixes" : o === "__other__" ? "(other...)" : o}</option>`).join("");
    prefixselect.value = opts.includes(cur) ? cur : "";
  }

  function control(name) {
    const eff = effective(name), t = typeOf(flags[name]);
    if (t === "boolean") return `<span class="checkbox${eff === true ? " on" : ""}" role="checkbox" aria-checked="${eff === true}" data-name="${escapehtml(name)}"><svg class="tick" viewBox="0 0 24 24" aria-hidden="true"><g><path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path></g></svg></span>`;
    if (t === "number") return `<input type="number" class="editfield num" data-name="${escapehtml(name)}" data-type="number" value="${escapehtml(asInputValue(eff))}">`;
    return `<textarea class="editfield" data-name="${escapehtml(name)}" data-type="${t}" rows="1" spellcheck="false">${escapehtml(asInputValue(eff))}</textarea>`;
  }

  function eq(a, b) {
    if (a === b) return true;
    if (!a || !b || typeof a !== "object" || typeof b !== "object") return false;
    try { return JSON.stringify(a) === JSON.stringify(b) } catch { return false }
  }
  const isMod = name => hasoverride(name) && !eq(overrides[name], flags[name]);
  function updateFoot() { footer.classList.toggle("show", dirty) }

  let lasthtml = "";
  let lastsig = "";
  let renderraf = 0;
  function rafrender() {
    if (renderraf) return;
    const raf = typeof requestAnimationFrame === "function" ? requestAnimationFrame : (f => setTimeout(f, 16));
    renderraf = raf(() => {renderraf = 0; render()});
  }

  function render(noTab) {
    updateFoot();
    paintchecks();
    if (flagcount) { const n = Object.keys(flags).length; flagcount.textContent = (!noTab && captured && n) ? n + " flags" : "??? flags" }
    if (noTab) {
      lasthtml = "";
      list.innerHTML = `<div class="empty">open x.com/twitter.com first!</div>`;
      return;
    }
    if (!captured) {
      lasthtml = "";
      const s = status || {};
      list.innerHTML = `<div class="empty">no flags captured yet, try reloading the page!</div>`;
      const sb = list.querySelector(".scan");
      if (sb) sb.onclick = () => send("reload");
      return;
    }
    const names = Object.keys(flags).sort();
    const counts = {};
    for (const n of names) { const p = prefof(n); counts[p] = (counts[p] || 0) + 1 }
    const small = new Set(Object.keys(counts).filter(p => counts[p] <= 2));
    preffill(counts);
    const term = search.value.toLowerCase().trim();
    const pref = prefixselect.value;
    let html = "";
    const shown = [];
    for (const name of names) {
      if (pref) { const pf = prefof(name); if (pref === "__other__" ? !small.has(pf) : pf !== pref) continue }
      const mod = isMod(name);
      const dangerinfo = dangerFor(name);
      const tp = typeOf(flags[name]);
      // state axis: all / enabled / modified / disabled
      if (filters.state === "enabled" && effective(name) !== true) continue;
      if (filters.state === "disabled" && effective(name) !== false) continue;
      if (filters.state === "modified" && !mod) continue;
      // type axis: all / checkboxes / inputs / dropdown inputs
      if (filters.type === "bool" && tp !== "boolean") continue;
      if (filters.type === "input" && tp === "boolean") continue;
      if (filters.type === "opts" && !(optionsmap[name] && optionsmap[name].length)) continue;
      // danger axis: all / safe / dangerous
      if (filters.danger === "safe" && dangerinfo) continue;
      if (filters.danger === "danger" && !dangerinfo) continue;
      const d = descFor(name);
      if (term && !(name.toLowerCase().includes(term) || d.text.toLowerCase().includes(term))) continue;
      shown.push(name);
      const meta = dangerinfo ? `<div class="meta"><span class="dangerzone">${WARN}<span>${escapehtml(dangerinfo)}</span></span></div>` : "";
      const opts = typeOf(flags[name]) !== "boolean" ? optionsmap[name] : null;
      const optsline = (opts && opts.length) ? `<div class="opts" data-name="${escapehtml(name)}">${opts.length} available option${opts.length === 1 ? "" : "s"}</div>` : "";
      const title = d.auto
        ? `<div class="name ident" data-name="${escapehtml(name)}">${escapehtml(name)}</div>`
        : `<div class="name">${escapehtml(d.text)}</div><div class="ident" data-name="${escapehtml(name)}">${escapehtml(name)}</div>`;
      html += `<div class="item${dangerinfo ? " danger" : ""}${mod ? " mod" : ""}" data-name="${escapehtml(name)}">
      <div class="info">${title}${meta}${optsline}</div>
      <div class="controls"><button class="reset${mod ? "" : " off"}" data-name="${escapehtml(name)}" title="reset to default" aria-hidden="${!mod}">${UNDO}</button>${control(name)}</div>
    </div>`;
    }
    const note = cached ? `<div class="cachednote">page is asleep or closed, showing last captured flags.. changes still save and apply on next page load</div>` : "";
    const out = note + (html || `<div class="empty center"><div class="face">:(</div><div>no matches</div></div>`);
    if (out === lasthtml) return;
    lasthtml = out;
    // same rows in the same order (just a flag's state flipped) -> geometry is
    // identical, so keep the exact scroll. anchoring via offsetTop drifts here
    // because content-visibility:auto sizes offscreen items from the estimate
    const sig = shown.join("");
    const samerows = sig === lastsig;
    lastsig = sig;
    const rawscroll = list.scrollTop;
    let anchorName = "", anchorTop = 0;
    if (!samerows) try {
      for (const it of list.querySelectorAll(".item")) {
        const top = it.offsetTop - list.scrollTop;
        if (top >= -1) { anchorName = it.getAttribute("data-name") || ""; anchorTop = top; break }
      }
    } catch {}
    list.innerHTML = out;
    if (samerows) { list.scrollTop = rawscroll; return }
    try {
      const sel = anchorName && (window.CSS && CSS.escape ? CSS.escape(anchorName) : anchorName);
      const el = sel && list.querySelector('.item[data-name="' + sel + '"]');
      if (el) list.scrollTop = el.offsetTop - anchorTop;
    } catch {}
  }

  /*//////////////////////////////////////////////////////////////////////*/

  function commit(input) {
    const name = input.getAttribute("data-name"), t = input.getAttribute("data-type");
    const val = parseInput(t, input.value);
    if (eq(val, flags[name])) { delete overrides[name]; send("clear", { name }) }
    else { overrides[name] = val; send("set", { name, value: val }) }
    markdirty(); persist(); render();
  }
  list.addEventListener("change", e => {const el = e.target.closest(".editfield"); if (el) commit(el)});
  list.addEventListener("keydown", e => {if (e.key === "Enter") {const el = e.target.closest(".editfield");
  if (el && el.tagName !== "TEXTAREA") {commit(el); e.preventDefault()}}
  if (e.key === "Escape") hidedrop()});

  /*//////////////////////////////////////////////////////////////////////*/

  let drop = null, dropfield = null;
  function dropparent() { const r = list.getRootNode(); return r.host ? r : document.body }
  function ensuredrop() {
    if (drop) return drop;
    drop = document.createElement("div");
    drop.className = "optsdrop";
    drop.addEventListener("mousedown", e => {
      const it = e.target.closest(".optsitem");
      if (!it || !dropfield) return;
      e.preventDefault();
      dropfield.value = it.getAttribute("data-val");
      commit(dropfield);
      hidedrop();
    });
    dropparent().appendChild(drop);
    return drop;
  }
  function optsfor(field) { const n = field && field.getAttribute("data-name"); const o = n && optionsmap[n]; return (o && o.length) ? o : null }
  function filldrop(field, dofilter) {
    const opts = optsfor(field); if (!opts) return false;
    const cur = field.value.trim(), curl = cur.toLowerCase();
    let html = "";
    for (const o of opts) {
      const s = String(o && typeof o === "object" ? o.val : o);
      const desc = (o && typeof o === "object" && o.desc) ? o.desc : "";
      if (dofilter && curl && s.toLowerCase().indexOf(curl) < 0 && desc.toLowerCase().indexOf(curl) < 0) continue;
      html += `<div class="optsitem${s === cur ? " sel" : ""}" data-val="${escapehtml(s)}"><span class="optsval">${escapehtml(s)}</span>${desc ? `<span class="optsdesc">${escapehtml(desc)}</span>` : ""}</div>`;
    }
    ensuredrop().innerHTML = html || `<div class="optsempty">no match</div>`;
    return true;
  }
  function positiondrop(field) {
    const d = ensuredrop(), r = field.getBoundingClientRect();
    d.style.minWidth = r.width + "px";
    let left = r.left;
    if (left + d.offsetWidth > window.innerWidth - 8) left = Math.max(8, window.innerWidth - 8 - d.offsetWidth);
    d.style.left = left + "px";
    d.style.top = ""; d.style.bottom = "";
    const room = window.innerHeight - r.bottom;
    if (d.offsetHeight > room - 8 && r.top > room) d.style.bottom = (window.innerHeight - r.top + 4) + "px";
    else d.style.top = (r.bottom + 4) + "px";
  }
  function showdrop(field) {
    if (!filldrop(field, false)) { hidedrop(); return }
    dropfield = field;
    ensuredrop().style.display = "block";
    positiondrop(field);
  }
  function hidedrop() { if (drop) drop.style.display = "none"; dropfield = null }

  list.addEventListener("focusin", e => {const el = e.target.closest(".editfield"); if (el) showdrop(el)});
  list.addEventListener("focusout", e => {const el = e.target.closest(".editfield"); if (el) setTimeout(() => {if (list.getRootNode().activeElement !== el) hidedrop()}, 120)});
  list.addEventListener("input", e => {const el = e.target.closest(".editfield"); if (el && dropfield === el) {filldrop(el, true); positiondrop(el)}});
  list.addEventListener("scroll", () => {if (dropfield) hidedrop()});

  list.addEventListener("click", e => {
    const cb = e.target.closest(".checkbox");
    
    if (cb) { const n = cb.getAttribute("data-name");
    const base = flags[n], val = !(effective(n) === true);
    if (eq(val, base)) { delete overrides[n]; send("clear", {name: n}) }
    else { overrides[n] = val; send("set", {name: n, value: val}) }
    markdirty(); persist(); render(); return }
    const resetbtn = e.target.closest(".reset");

    if (resetbtn) {
      const n = resetbtn.getAttribute("data-name");
      delete overrides[n]; markdirty(); persist(); send("clear", {name: n}); render(); return
    }
    const optsel = e.target.closest(".opts");
    if (optsel) { const it = optsel.closest(".item"); const f = it && it.querySelector(".editfield"); if (f) f.focus(); return }
    const id = e.target.closest(".ident");

    if (id) {
      const n = id.getAttribute("data-name");
      try {navigator.clipboard.writeText(n)} catch {}
      if (!id.querySelector(".copied")) { const c = document.createElement("span"); 
      c.className = "copied"; c.textContent = "copied"; 
      id.appendChild(c); setTimeout(() => c.remove(), 900) }
    }
  });

  search.oninput = () => rafrender(); prefixselect.onchange = () => render();
  reload.onclick = () => {
    if (!EXT) {send("reload"); return}
    if (tabId != null) try {chrome.tabs.reload(tabId)} catch {send("reload")}
    else try {chrome.tabs.create({url: "https://x.com/"})} catch {}
  };
  undo.onclick = () => {
    overrides = clone(applied);
    let devchanged = false;
    for (const k of DEVPERSIST) { const base = !!(applieddev && applieddev[k]); if (!!devconfig[k] !== base) {devconfig[k] = base; devchanged = true} }
    markdirty(); persist(); send("syncoverrides", {overrides});
    if (devchanged) devpush();
    render();
  };

  loadconfigs().then(cfg => {
    knowndesc = (cfg.desc && cfg.desc.known) || {};
    dangerknowndesc = (cfg.desc && cfg.desc.danger) || {};
    switchcfg = cfg.switches || {};
    upsellflags = Object.values(cfg.upsells || {}).filter(Array.isArray).flat();
    optionsmap = (cfg.options && typeof cfg.options === "object") ? cfg.options : {};
    buildswitches();
    paintchecks();
    refresh();
    setTimeout(paintswitches, 400);
    try { if (document.fonts && document.fonts.ready) document.fonts.ready.then(paintswitches) } catch {}
    window.addEventListener("resize", paintswitches);
  });

})(__tfshim, __tfroot);


  }

  if (document.body) mountpanel();
  else document.addEventListener("DOMContentLoaded", mountpanel, {once: true});

})();
