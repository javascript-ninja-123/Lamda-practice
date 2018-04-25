const axios = require('axios');
const R = require('ramda');
const log = x => console.log(x);
const fetchCall = async url => {
  const {data} = await axios.get(url);
  return data
}

///do not touch here

const newArray = [1,2,3,4,5];

const a = R.aperture(7,newArray);



const b = R.append(6, newArray)

// console.log(
//   b
// )


const addIndexToValue = (value,index) => value + index
const getMax = value => Math.max(...value)

const c = R.pipe(
  R.addIndex(R.map)(addIndexToValue),
  R.append(5),
  R.prepend(3),
  R.apply(Math.max)
)

log(
  c([1,2,3,4,5])
)


log(
  R.unapply(JSON.stringify)(1,2,3)
)


const spread = (...xs) => xs

// log(
//   spread(1,2,3,4,5)
// )
//
//
// log(
//   Math.max(...newArray)
// )




log('applyspec')
log(
  R.applySpec({
    sum:R.add,
    diff:R.flip(R.subtract),
    mul:R.multiply
  })(2,4)
)
log('apployspec ends')



const getBitcoinData = async () => {
  const {bpi} = await fetchCall('https://api.coindesk.com/v1/bpi/currentprice.json')
  const getNums = R.pipe(
    R.map(x => x.rate),
    R.map(R.replace(/[^a-zA-Z0-9]/g,'')),
    R.map(x => Number(x)),
    R.assoc('YB',1223243),
    R.dissoc('EUR')
  )(bpi)


  const addedNumber = R.applySpec({
    sum:R.add,
  })(getNums.USD, getNums.GBP, getNums.EUR)

  console.log(addedNumber)
}


getBitcoinData()


const byAge = R.ascend(R.prop('age'));
const people = [
  {
    age:30,
    name:'s'
  },
  {
    age:10,
    name:'a'
  },
  {
    age:20,
    name:'b'
  }
]


const modifinedPeople = R.sort(byAge)(people)

console.log(modifinedPeople)

const d = {a:20,b:30}
log(
  R.assoc('b',10, d)
)

log(
  R.dissoc('b',d)
)
log(
  {...d, b:10}
)

const w = {a:{
  b:{
    c:{
      d:20
    }
  }
}}


log(
  R.assocPath(["a","b"], 20, w)
)


const maxFromPair = R.binary(Math.max)


log(
  maxFromPair(10,20)
)

const maxFromThree = R.nAry(3, Math.max)

log(
  maxFromThree(1,2,3)
)


const maxFromThree2 = R.nAry(3,Math.max)


log(
  maxFromThree2(1,3,6)
)

function Greeter(phrase){
  this.phrase = phrase;
}

Greeter.prototype.greet = function(name){
  console.log(this.phrase +" "+name)
};



const helloer = new Greeter('Hello');


R.pipe(
  R.toUpper,
  R.bind(helloer.greet, helloer)
)('sung')



class Person{
  constructor(phrase){
    this.phrase = phrase;
  }
  greet(person){
    return `${this.phrase} ${person}`
  }
}

const sung = new Person('sup')

log(
  R.pipe(
    R.toUpper,
    R.bind(sung.greet, sung)
  )('sung')
)

const gt10 = R.gt(R.__,10);
const lt20 = R.lt(R.__, 20);

const x = (x) => {
  return x > 20;
}
const y = y => y < 30;

log(
  R.both(x,y)(45)
)


const both = (f1,f2) => x => f1(x) && f2(x);
const any = (f1,f2) => x => f1(x) || f2(x);

log(
  both(x,y)(25)
)



const duplicate = x => [x,x];
const r = [1,2,3,4,5];

log(
  R.pipe(
    R.chain(duplicate)
  )(r)
)



const user = {
  name:'johgn',
  surname:'Flint'
}


const nameLens = R.lens(
  R.prop('name'),
  R.assoc('name')
)

log(
    R.view(nameLens, user)
)

log(
  R.set(nameLens,'sung', user)
)

log('============')

// const name = R.view(nameLens, user);
// const upperName = R.toUpper(name);
// const result = R.set(nameLens,upperName,user)

const result = R.over(nameLens,() => 'Sung', user)

console.log(result)



///
const state = {
  count:0,
  name:'sung',
  address:{
    street:1,
    state:'CA'
  }
};



const stateLens = R.lensPath(['address','street']);
const inc = R.over(stateLens,R.inc)


// log(
//   R.view(stateLens,state)
// )

log(
 inc(state)
)
log(
  R.view(stateLens,state)
)


const products = [
  {
    name:'Jacket',
    price:50,
    category:'clothes',
    count:20
  },
  {
    name:'Boots',
    price:120,
    category:'clothes',
    count:30
  },
  {
    name:'Iphone',
    price:600,
    category:'electronics',
    count:10
  }
]


const filteredProudctNames = R.pipe(
  R.filter(R.where({
    category:R.equals('clothes'),
    price:R.lt(R.__,300),
    count:R.lt(R.__,40)
  })),
  R.map(x => x.name)
)


const truncate = R.when(
  str => str.length > 10,
  R.pipe(
    R.take(10),
    R.concat(R.__,'...')
  )
)


log(
  filteredProudctNames(products)
)

log(
  truncate('12345678910')
)




const state2 = [1,2,3,4,5]

const pop = state2.filter((v,i,arr) => i !== arr.length -1)
const newState = [...pop,6]

log(
  newState
)

const cuttedAr = R.init(state2);
log(
  R.append(6,cuttedAr)
)


const newReducer =  R.useWith(
    R.append,
    [
      R.prop('payload'),
      R.init
    ]
  )

log('==========')
log(
  newReducer({payload:6},state2)
)


const state3 = {
  loading:false,
  west:true,
  peopleJoined:['Sung','sw','ews','es','aaa']
}

const action2 = {payload:'dsafdasfadsdds'}

log(
  R.useWith(R.append, [R.prop('payload'),R.init])(action2,R.path(['peopleJoined'], state3))
)

const resultaa = R.useWith(Math.pow, [R.inc,R.dec])(2,3)

log(
  resultaa
)


const ar2 = [1,2,3,4,5];
const str2 = 'abcd'

log(
  R.drop(2,ar2)
)
log(
  R.dropLast(2,str2)
)

const students = [
  {name:'Alex',score:84, isActive:true},
  {name:'Jack',score:65, isActive:false},
  {name:'John',score:46, isActive:true}
]


const byScore = R.groupBy(student => {
    return student.score > 50 ? 'positive' : 'negative'
})
const byActivity = R.groupBy(student =>
  student.isActive ? 'active' : 'not-active'
)

console.log('groups', byScore(students))
console.log('groups', byActivity(students))




const callit = async () => {
  const w = await fetchCall('https://jsonplaceholder.typicode.com/todos')
  return R.pipe(
    R.map(todo => {
      return {completed:todo.completed, title:todo.title}
    }),
    R.groupBy(todo => todo.completed ? 'complete' : 'incomplete')
  )(w)
}

// log('==================')
// callit()
// .then(a => console.log(a))




log('sooooorttttiiinnngg')


const unsorted = [1,2,3,4,5];
const ascend = R.ascend(R.identity);
const descend = R.descend(R.identity);
const asc = R.sort(descend)

log(asc(unsorted))



const usermans = [
  {name:'John'},
  {name:'alex'},
  {name:"james"}
]


const sortFn = R.sortBy(R.pipe(R.prop('name'),R.toLower))


log(
  sortFn(usermans)
)

var alice = {
  name: 'alice',
  age: 40
};
var bob = {
  name: 'bob',
  age: 30
};
var clara = {
  name: 'clara',
  age: 40
};
var peoples = [clara, bob, alice];
var ageNameSort = R.sortWith([
  R.descend(R.prop('age')),
  R.ascend(R.prop('name'))
]);



log(
  ageNameSort(peoples)
)



const studentss = [
  {name:'Alex',score:84, isActive:true},
  {name:'Jack',score:65, isActive:false},
  {name:'John',score:46, isActive:true}
]


const isActive = R.any(R.propEq('isActive',true))


log(
  isActive(studentss)
)
