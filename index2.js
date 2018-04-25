const {  List,Map } = require('immutable-ext')




const Sum = x => ({
  x,
  concat: ({x : y}) => Sum(x + y),
  inspect:() => `Sum(${x})`
})
Sum.empty = () => Sum(0)

const res  = Sum.empty().concat(Sum(1).concat(Sum(3)))
console.log(res)


const All = x => ({
  x,
  concat: ({x : y}) => All(x && y),
  inspect:() => `All(${x})`,
})

All.empty = () => All(true)

const res2 = All(true).concat(All(true))
console.log(res2)


const Multiply = x => ({
  x,
  concat: ({x : y}) => Multiply(x * y),
  inspect:() => `Multiply(${x})`,
})

Multiply.empty = ()=> Multiply(1)



const First = x => ({
  x,
  concat:() => First(x),
  inspect: () => `First(${x})`
})


const res3 = First('blah').concat(First('a'))

console.log(res3)

const Any = x => ({
  x,
  concat: ({x : y}) => Any(x || y),
  inspect:() => `Any(${x})`,
})

Any.empty = () => Any(false);


const acc1 = Map({
  name:First("Nico"),
  isPaid:All(true),
  points:Sum(10),
  friends:['Franklin']
})

const acc2 = Map(
  {
    name:First("Nico"),
    isPaid:All(false),
    points:Sum(2),
    friends:['Gatsby']
  }
)



const result = acc1.concat(acc2);
console.log(result.toJS())



///


const getFirstArray = new Promise(resolve => {
  resolve([
    {
      name:"Sungmin Yi",
      subscription:true,
      Paid:200
    }
  ])
})

const getSecondArray = new Promise(resolve => {
  resolve([
    {
      name:"Sungmin Yi",
      subscription:false,
      Paid:260
    }
  ])
})




const fetchingData =  () => {
  const a = Map({
    name:First("Sungmin Yi"),
    subscription:Any(true),
    paid:Sum(200),
    friends:['Yonaa']
  });

  const b = Map({
    name:First('Sungmin Yi'),
    subscription:Any(false),
    paid:Sum(300),
    friends:['Sam']
  })
  return a.concat(b)
}


console.log(fetchingData().toJS())



const sumReduce = xs =>
xs.reduce((acc,val) => acc + val, 0);


const allReduce = xs =>
xs.reduce((acc,val) => acc && val, true);

console.log(false || true)





const Right = value => ({
  fold:(f,g) => g(value),
  map: f => Right(f(value)),
  concat: o =>
  o.fold(e => Left(e),
        r => Right(value.concat(r))
        )
})


const Left = value => ({
  fold:(f,g) => f(value),
  map: f => Left(value),
  concat: o =>
  o.fold(o => Left(value))
})



const resSum = [Sum(1),Sum(2),Sum(3)].reduce((acc,value) => acc.concat(value), Sum.empty())


console.log(resSum)



const resList = List.of(Sum(1),Sum(2),Sum(3)).fold(Sum.empty())

console.log(resList)

const resa = Map({brian:3,sara:5})
.foldMap(Sum, Sum.empty())

console.log(resa)


const Box = x => ({
  fold:f => f(x),
  map: f => Box(f(x)),
  inspect: () => `Box(${x})`
})


const LazyBox = g => ({
    map:f => LazyBox(() => f(g())),
    fold:f => f(g())
})

const trimIt = x => x.trim();
const NumberIt = x => Number(x);


const resultA = LazyBox(() => '   64   ')
              .map(trimIt)
              .map(NumberIt)
              .map(x => x +1)
              .map(x => String.fromCharCode(x))
              .fold(x => x.toLowerCase())


console.log(resultA)
