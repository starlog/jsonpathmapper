"# jsonpathmapper" 

Small utility for mapping javascript object data into jsonpath-description based structure.

Example:

Let's say this is data.
~~~
const _mydata = {
    type: 'fruit',
    list: [
        {
            name: 'apple',
            taste: 'best'
        },
        {
            name: 'banana',
            taste: 'wow'
        },
        {
            name: 'mango',
            taste: 'delicious'
        }
    ]
}
~~~

And this is target structure
~~~
const _myTargetStructure = {
    type: '$.type',
    count: '%.list[0,1]',
    list: [
        {
            name: '$.list[0,1].name'
        }
    ],
    fullcount: '#.list[*]',
    fulllist: [
        {
            name: '$.list[*].name',
            taste: '$.list[*].taste',
        }
    ]
}
~~~

jsonpathmap will produce following result

~~~
{
  "type": "fruit",
  "count": 2,
  "list": [
    {
      "name": [
        "apple",
        "banana"
      ]
    },
    {
      "name": [
        "apple",
        "banana"
      ]
    }
  ],
  "fullcount": "3",
  "fulllist": [
    {
      "name": "apple",
      "taste": "best"
    },
    {
      "name": "banana",
      "taste": "wow"
    },
    {
      "name": "mango",
      "taste": "delicous"
    }
  ]
}
~~~

can use full JSONPath expressions: see https://www.npmjs.com/package/jsonpath

```
$. denotes jsonpath notation
#. denotes jsonpath notation's count in string
%. denotes jsonpath notation's count in number
```