let str = 'element-ui/packages/page-header-ssss'

const sourceRE = /^element-ui\/packages\/([\w]+([-]+)?)+$/i;

console.log(  sourceRE.test(str) )
console.log(  str.match(str) )