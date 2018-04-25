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
    street:'140',
    state:'CA'
  }
};



const stateLens = R.lensPath(['address','street']);

log(
  R.view(stateLens,state)
)

log(
  R.set(stateLens,'150 street' ,state)
)
