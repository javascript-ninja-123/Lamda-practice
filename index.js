const axios = require('axios');
const R = require('ramda');

const get = property => value => value[property];
const getIds = obj => obj.map(get('id'));
const map = fn => values => values.map(fn)


const fetchCall = async url => {
  const {data} = await axios.get(url);
  return data
}

// fetchCall('https://jsonplaceholder.typicode.com/posts')
// .then(map(get('title')))
// .then(a => console.log(a))





const newArray = [
  {
    name:'Sungmin Yi',
    age:22
  },
  {
    name:'Yonna Zhong',
    age:23
  }
];


const wst = () => {
  return new Promise(resolve => {
    resolve(
      [
        {
          name:'Sungmin Yi',
          age:22
        },
        {
          name:'Yonna Zhong',
          age:23
        }
      ]
    )
  })
}



const get_f = property => obj => obj[property];
const map_f = fn => values => values.map(fn);



//
// wst()
// .then(map(get_f('name')))
// .then(a => console.log(a))



const curry = fn => {
  const arity = fn.length;
  return function f1(...args){
    if(args.length >= arity){
      return fn(...args);
    }
    else{
      return function f2(...moreArgs){
        const newArgs = [...args,...moreArgs];
        return f1(...newArgs);
      }
    }
  }
}

const curry2 = fn => {
  const arity = fn.length;
  return function f1(...args){
    if(args.length >= arity){
      return fn(...args)
    }
    else{
      return function f2(...moreArgs){
        const newArgs = [...args, ...moreArgs];
        return f1(...newArgs)
      }
    }
  }
}


const newArray2 = [
  {
    name:'Sungmin Yi',
    age:22
  },
  {
    name:'Yonna Zhong',
    age:23
  }
];

const gets = (property,object) => object[property];
const curriedGet = curry(gets);
const a = newArray2.map(curriedGet('age'))



const user = [
  {
    id:1,
    name:'john'
  },
  {
    id:2,
    name:'Alex'
  },
  {
    id:3,
    name:'Bill'
  }
]

const filterReq  =  R.propEq('id',2)
const alex = R.find(filterReq)(user)
console.log(alex)



const wasBornInCountry = R.propEq('birthCountry',"UK")
const wasNaturalized = person => Boolean(person.naturalizationDate);
const isOver18 = person => person.age >=18;


const isCitizen = R.either(wasBornInCountry, wasNaturalized);
const isEligibleToVote = R.both(isOver18,isCitizen)


const testUser = {
  age:20,
  birthCountry:'UK'
}

console.log(isEligibleToVote(testUser))


/// plain javascript way
const bornInKorea = R.propEq('birthCountry','Korea')
const isOver20 = person => person['age'] >= 20;
const eligibleTOVote = R.both(bornInKorea,isOver20);

const testUser2 = {
  age:20,
  birthCountry:'Korea'
}

console.log(eligibleTOVote(testUser2));

const compose = (...fns) => value => fns.reduce((acc,fn) => fn(acc), value)


const toSlug = input => {
  const splitWords = input => input.split(' ');
  const lowerCase = value => value.toLowerCase();
  const map = fn => value => value.map(fn);
  const addSlug = (arr) => {
    return arr.map((value,index,arr) => {
        if(index !== arr.length -1){
          return `${value}-`
        }
        else return value;
      })
  };
  const join = arr => arr.join('')

  return compose(
    splitWords,
    map(lowerCase),
    addSlug,
    join
  )(input)

}


const slug = toSlug('This is composition');


console.log(slug)


///Ramda way
const RtoSlug = input =>
R.compose(
  encodeURIComponent,
  R.join('-'),
  R.map(R.toLower),
  R.split(' '),
)(input)



console.log(RtoSlug('This is composition'))



const extractPhoneNumber = async () => {
  const data = await fetchCall('https://jsonplaceholder.typicode.com/users');
  const map = fn => value => value.map(fn);
  const getPhone = arr => arr.phone;
  const replace = (ref,output) => value => value.replace(ref,output);
  const replaceSpecialCharacter = replace(/[^a-zA-Z0-9]/,'');
  const split = value => value.split('')
  const doubleMap = fn => value => value.map(s => {
    return s.map(fn)
  });
  const join = value => value.join('');
  // const result = R.compose(
  //   R.map(R.join('')),
  //   R.map(R.map(R.replace(/[^a-zA-Z0-9]/,''))),
  //   R.map(getPhone)
  // )(data)

  const result = compose(
    map(getPhone),
    map(split),
    doubleMap(replaceSpecialCharacter),
    map(join)
  )(data)

  return result;
}

// extractPhoneNumber()
// .then(a => console.log(a))

const bill = {
  nickname:'bill',
  country:"UK",
  personal:{
    profile:{
      surname:"Williams",
      age:20
    }
  }
}


const mike = {
  nickname:"Mike",
  country:"US",
  personal:{}
}


const getSurname = user => R.pathOr('not set',['personal','profile','surname'],user);


console.log(getSurname(bill))
console.log(getSurname(mike))

const getNames = async() => {
  //fetch data
  const a = await fetchCall('https://jsonplaceholder.typicode.com/users');
  const b = await fetchCall('https://jsonplaceholder.typicode.com/todos');
  //combine data
  const c = [...a,...b];
  //currying
  const map = fn => value => value.map(fn);
  const filter = predicate => value => value.filter(predicate)

  const onlyGetCity = value => value !== false;
  const getCity = obj => R.pathOr(false, ['address','city'], obj);
  const d = R.compose(
    filter(onlyGetCity),
    map(getCity)
  )(c)
  console.log(d)
}


getNames();
