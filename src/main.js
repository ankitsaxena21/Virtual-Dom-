import createElement from './vdom/createElement';
import render from './vdom/render';
import mount from './vdom/mount';
import diff from './vdom/diff';

// here createVApp is simpliar to creating a component in react js - here count is a prop
const createVApp = (count) => createElement('div', {
  attrs: {
    id: 'app',
    dataCount: count,
  },
  children: [
    createElement('input'),
    createElement('h1', {
      attrs: {
        id: `title`,
      },
      children: [
        `this is the heading`
      ]
    }),
    String(count),
    ...Array.from({ length: count }, () => createElement('img', {
      attrs: {
        src: 'https://media.giphy.com/media/cuPm4p4pClZVC/giphy.gif',
      },
    })),
  ],
});

let count = 0;
let vApp = createVApp(count);
console.log("virtual dom", vApp)
const $app = render(vApp);
console.log("virtual dom as html", $app);

// html format of virtual dom (i.e div containing img, count and input)
let $rootEl = mount($app, document.getElementById('app'));

setInterval(() => {
  // creating a new virtaul dom with new count as a prop
  const vNewApp = createVApp(Math.floor(Math.random() * 10));
  // diff will calculate the difference between old and new dom and return the patches
  const patch = diff(vApp, vNewApp);
  // this patch fn will make the required changes in the html format of virtual dom and return the new root element i.e div with id root like in react
  $rootEl = patch($rootEl);
  vApp = vNewApp;
}, 1000);
