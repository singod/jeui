export function findParentComponent(context, componentName) {
  let parent = context.$parent
  let name = parent.$options.name
  let component = {}

  while (parent && name) {
    if (componentName === name) {
      component = parent
    }

    parent = parent.$parent
    if (parent) {
      name = parent.$options.name
    }
  }
  return component
}

// export function findComponentUpward(context, componentName, componentNames) {
//   if (typeof componentName === 'string') {
//     componentNames = [componentName]
//   } else {
//     componentNames = componentName
//   }

//   let parent = context.$parent
//   let name = parent.$options.name
//   while (parent && (!name || componentNames.indexOf(name) < 0)) {
//     parent = parent.$parent
//     if (parent) name = parent.$options.name
//   }

//   return parent
// }

// export function findComponentsUpward(context, componentName, components = []) {
//   let parent = context.$parent
//   let name = parent.$options.name

//   while (parent && name) {
//     if (componentName === name) {
//       components.push(parent)
//     }

//     parent = parent.$parent
//     if (parent) {
//       name = parent.$options.name
//     }
//   }

//   return components
// }


// export function findComponentDownward(context, componentName) {
//   const childrens = context.$children
//   let children

//   if (childrens.length) {
//     childrens.forEach(child => {
//       if (child.$options.name === componentName) {
//         children = child
//       }
//     })

//     for (let i = 0, len = childrens.length; i < len; i++) {
//       const child = childrens[i]
//       const name = child.$options.name

//       if (name === componentName) {
//         children = child
//         break
//       } else {
//         children = findComponentDownward(child, componentName)
//         if (children) break
//       }
//     }
//   }

//   return children
// }

// export function findComponentsDownward(context, componentName, components = []) {
//   const childrens = context.$children

//   if (childrens.length) {
//     childrens.forEach(child => {
//       const subChildren = child.$children
//       const name = child.$options.name

//       if (name === componentName) {
//         components.push(child)
//       }
//       if (subChildren.length) {
//         const findChildren = findComponentsDownward(child, componentName, components)
//         if (findChildren.length) {
//           components.concat(findChildren)
//         }
//       }
//     })
//   }

//   return components
// }


// Find components upward
export function findComponentUpward (context, componentName, componentNames) {
  if (typeof componentName === 'string') {
      componentNames = [componentName];
  } else {
      componentNames = componentName;
  }

  let parent = context.$parent;
  let name = parent.$options.name;
  while (parent && (!name || componentNames.indexOf(name) < 0)) {
      parent = parent.$parent;
      if (parent) name = parent.$options.name;
  }
  return parent;
}

// Find component downward
export function findComponentDownward (context, componentName) {
  const childrens = context.$children;
  let children = null;

  if (childrens.length) {
      for (const child of childrens) {
          const name = child.$options.name;
          if (name === componentName) {
              children = child;
              break;
          } else {
              children = findComponentDownward(child, componentName);
              if (children) break;
          }
      }
  }
  return children;
}

// Find components downward
export function findComponentsDownward (context, componentName) {
  return context.$children.reduce((components, child) => {
      if (child.$options.name === componentName) components.push(child);
      const foundChilds = findComponentsDownward(child, componentName);
      return components.concat(foundChilds);
  }, []);
}

// Find components upward
export function findComponentsUpward (context, componentName) {
  let parents = [];
  const parent = context.$parent;
  if (parent) {
      if (parent.$options.name === componentName) parents.push(parent);
      return parents.concat(findComponentsUpward(parent, componentName));
  } else {
      return [];
  }
}
