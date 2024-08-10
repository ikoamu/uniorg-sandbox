import './App.css'
import { unified } from 'unified';
import parse from 'uniorg-parse';
import uniorg2rehype from 'uniorg-rehype';
// import highlight from 'rehype-highlight';
import rehypePrism from '@mapbox/rehype-prism';
import katex from 'rehype-katex';
import stringify from 'rehype-stringify';
import * as prod from 'react/jsx-runtime'
import rehype2react from 'rehype-react'
import { ReactNode, useEffect, useState } from 'react';
import React from 'react';

const text = `
:PROPERTIES:
:ID:       FFCEA18C-EBA4-445F-8C66-E18867AC6EE5
:END:
#+title: test


- ~test~
- =test=

* Syntax
#+begin_src js
function test() {
  console.log("hello");
}
#+end_src

#+begin_src ts
function test(value: string) => console.log(value);
#+end_src

#+begin_src elisp
(require 'package)
(setq package-archives
      '(("melpa" . "https://melpa.org/packages/")
        ;; ("melpa-stable" . "https://stable.melpa.org/packages/")
        ("org" . "https://orgmode.org/elpa/")
        ("gnu" . "https://elpa.gnu.org/packages/")))
#+end_src

#+begin_src css
p { color: red }
#+end_src

* Image
#+NAME:   fig:SED-HR4049
#+ATTR_HTML: :width 300px :alt test-image :style background-color: white; border-radius: 8px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
[[./vite.svg]]
`

function App() {
  const [value, setValue] = useState<ReactNode>("");

  useEffect(() => {
    const processor = unified()
      .use(parse)
      .use(katex)
      .use(uniorg2rehype)
      .use(rehypePrism, { ignoreMissing: true })
      .use(rehype2react, {
        Fragment: prod.Fragment,
        jsx: prod.jsx,
        jsxs: prod.jsxs,
        createElement: React.createElement,
        components: {
          a: ({ children, href }) => {
            return <a href={href}>{children}</a>
          },
          img: (props: any) => {
            console.log(props)
            return <img {...props} />
          },
          image: (props: any) => {
            return <img {...props} />
          }
        }
      })
    // .use(stringify);
    processor.process(text).then(v => {
      console.log(v.value)
      setValue(v.result as ReactNode);

    }).catch(e => {
      console.error(e)
    }
    )
  }, [])

  return (
    <div style={{ display: "flex" }}>
      <div>
        <h1>processed</h1>
        <br />
        {value}
        <br />
      </div>
    </div>
  )
}

export default App
