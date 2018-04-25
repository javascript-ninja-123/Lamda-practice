const axios = require('axios');
const R = require('ramda');

const get = property => value => value[property];
const getIds = obj => obj.map(get('id'));
const map = fn => values => values.map(fn)
const log = (value) => console.log(value)

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


// getNames();


const isValidAr = [6,3,4,5,2];
const isInvalidAr = [400,203,4,6,1,9];


// const isFirstElementBiggest = arr =>
// arr[0] === arr.sort((a,b) => b-a)[0]

const big = (a,b) => b-a
const isFirstElementBiggest = R.converge(R.equals, [
  R.head,
  elements => R.head(R.sort(big,elements))
])


console.log(isFirstElementBiggest(isValidAr))
console.log(isFirstElementBiggest(isInvalidAr))


//filter


const filterArray = async () => {
  //fetch Data
  const a = await fetchCall('https://jsonplaceholder.typicode.com/albums');
  // const getUserName = users => {
  //  return users
  //  .filter(user => user.id > 5)
  //  .map(user => user.name)
  // }


  const getAlbum = R.compose(
    R.map(album => album.title),
    R.filter(R.where({
      userId:R.gt(R.__,2),
    }))
  )

  console.log(getAlbum(a))
}

// filterArray();




const video = {
  '720p':"funny-video-hd.mp4",
  "480p":"funny-video-480p.mp4",
  "isHD":true
}

const getPath = R.ifElse(
    R.propEq('isHD',true),
    R.prop('720p'),
    R.prop('480p')
  )

console.log(getPath(video))




const vidoes = [
  {
    '720p':"funny-video-hd.mp4",
    "480p":"funny-video-480p.mp4",
    "isHD":true
  },
  {
    '720p':"funny-video-hd.mp4",
    "480p":"funny-video-480p.mp4",
    "isHD":false
  },{
    '720p':"funny-video-hd.mp4",
    "480p":"funny-video-480p.mp4",
    "isHD":false
  }
]


const getVideoPaths = (videos) => {
  return
}


// const getVideoFilePath = video => {
//   const file =  video.isHD ? video['720p'] : video['480p'];
//
//   return `/api/vidoes/${file}`
// }

const Right = x => (
  {
    fold:(l,g) => g(x),
    map:f => Right(f(x)),
    log:() => `Right(${x})`
  }
)

const Left = x => (
  {
    fold:(l,g) => l(x),
    map:f => Left(f),
    log:() => `Right(${x})`
  }
)

const Nullable = fn => x => fn(x) ? Right(x) : Left(x);

const isHD = value => value.isHD
const VideoNullable = Nullable(isHD);


VideoNullable(video)
.fold(
  () => console.log('nope'),
  () => console.log(`${video["720p"]}`)
)

const getVideoFilePath = R.compose(
  R.concat('/api/videos/'),
  R.ifElse(
    R.propEq('isHD',true),
    R.prop('720p'),
    R.prop('480p')
  )
)



console.log(getVideoFilePath(video))


const getMessage = isWorkingTime => {
  const onlineMessage = 'we are online';
  const offline = 'We are offline';
  return isWorkingTime ? onlineMessage : offline;
}


const getCompleted = async () => {
  const a  = await fetchCall('https://jsonplaceholder.typicode.com/todos');

  const w = R.compose(
    R.filter(x => x!== undefined),
    R.map(R.ifElse(
        R.propEq('completed',true),
        R.prop('title'),
        R.always(undefined)
      ))
  )
  console.log(w(a))
}


// getCompleted()


const truncate = R.when(
  R.pipe(
    R.prop('length'),
    R.gt(R.__,10)
  ),
  R.pipe(
    R.take(10),
    R.concat(R.__,'...')
  )
)


console.log(truncate('12345'))
console.log(truncate('12345678910'))










const fp = () => {
  const Right = value => (
    {
       fold:(f,g) => g(value),
       next:fn =>  Right(fn(value))
    }
  )

  const Left = value => ({
    fold:(f,g) => f(value),
    next:fn =>  Left(value)
  })

  return {
    compose: (...fns) => value => (
     fns.reduceRight((acc,fn) => fn(acc),value)
   ),
    pipe:(...fns) => value => (
     fns.reduce((acc,fn) => fn(acc),value)
   ),
   map:fn => value => value.map(fn),
   filter: precicate => value => value.filter(precicate),
   either:fn => value => fn(value) ? Right(value) : Left(value),
   maybe: fn => value => fn(value) ? [fn(value)] : []
  }
}

const S = fp();
const strCondition =S.either(str => str.length > 10)('12345678910')

strCondition
.next(str => str.substring(0,10))
.next(str => str.concat('...'))
.fold(() => console.log('no'), str => console.log(str))

const f = R.subtract(R.__,10);
console.log(f(5))




const curryify = (fn) => {
  const arity = fn.length;
  return function f1(...args){
    if(args.length === arity){
      return fn(...args);
    }else{
      return (...moreArgs) => {
        const newArgs = [...args,...moreArgs];
        return f1(...newArgs);
      }
    }
  }
}

const multiply = (a,b,c) => a * b * c;
const multiplyFP = curryify(multiply);

console.log(multiplyFP(1)(3)(2))


const add10 = R.add(10);
const double = R.multiply(2);
const indexPlusValue = (v,i) => v + i
const adjustBySubtract =R.adjust(R.subtract(R.__,5))

const ramdaResult = R.pipe(
  R.map(add10),
  R.map(double),
  R.addIndex(R.map)(indexPlusValue),
  adjustBySubtract(1)
)([1,2,3,4]);

console.log(ramdaResult)


const equal5 = R.equals(5);

const zx  = R.pipe(
  R.all(R.gte(10,))
)([5,5,5,5,5])

const firstProp = R.gte(R.__,2);
const secondProp = R.lte(R.__,10);
const allPass = R.allPass([firstProp,secondProp])

console.log(
  R.pipe(
    R.all(allPass)
  )([5,5,5,5,5])
)

const FPmap = fn => value => value.map(fn);

const k = x => R.always(x)
const t = R.always('tttt')
const id = x => R.identity(x)

log(
  k('yes')()
)

log(
  t()
)

log(
  id('2')
)

////
log('wwwwwww===========')

const westman = async() => {
  const w = await fetchCall('https://jsonplaceholder.typicode.com/todos');
  const t = await fetchCall('https://jsonplaceholder.typicode.com/posts');

  return R.and(w.length === t.length,w.length === t.length)
}

// westman()
// .then(s => console.log(s))



log('==========')



const condition1 = R.lte(R.__,10);
const condition2 = R.gte(R.__,5);

log(
  R.pipe(
    R.all(R.anyPass([condition1,condition2]))
  )([9,9,9,9,9])
)




log(
  R.pipe(
    R.ap([R.multiply(5), R.add(2)])
  )([1,2,3,4,5,6,7])
)


log(
  R.pipe(
    R.ap(R.concat, R.toUpper)
  )('Ramda')
)



log(
  R.pipe(
    R.concat('Ramda'),
    R.toUpper
  )('Ramda')
)

const data = {
  text:'hi',
  reps:3
}

log(
    R.ap(
      R.pipe(
        R.prop('text'),
        R.repeat
      ),
      R.prop('reps')
    )(data)
)

log('=====')
log(
  R.repeat(data.text)(data.reps)
)
log('=====')



log(
  R.ap(
    R.concat,
    R.toUpper
  )('Ramda')
)


log(R.concat('Ramda')(R.toUpper('Ramda')))



const add2 = x => x + 2


////review
const a3 =
S.pipe(
  S.map(add2)
)([5,6,7,8])


console.log(a3)
