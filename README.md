"# jsonpathmapper" 

Small utility for mapping javascript object data into jsonpath-description based structure.

Usage: const myResult2 = jsonpathmap2.jsonpathmap2(extract, data);


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
      "name": "apple"
    },
    {
      "name": "banana"
    }
  ],
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

NEW
Special notation of [!]

Let's say this is data.
~~~
const data = {
  type: 'fruit',
  list: [
    {
      name: 'apple',
      rating: 10,
      metadata: {
        color: 'red',
        size: 'middle',
        records: [
          {
            year: 2020,
            rating: 10
          },
          {
            year: 2021,
            rating: 8
          },
          {
            year: 2022,
            rating: 6
          },
        ]
      }
    },
    {
      name: 'mango',
      rating: 6,
      metadata: {
        color: 'yellow',
        size: 'big',
        records: [
          {
            year: 2020,
            rating: 7
          },
          {
            year: 2021,
            rating: 5
          },
          {
            year: 2022,
            rating: 3
          },
        ]
      }
    },
    {
      name: 'grape',
      rating: 8,
      metadata: {
        color: 'violet',
        size: 'small',
        records: [
          {
            year: 2020,
            rating: 4
          },
          {
            year: 2021,
            rating: 4
          },
          {
            year: 2022,
            rating: 2
          },
        ]
      }
    }
  ]
}
~~~
and query is as follows;
~~~
const extract = {
  count: '%.list[*].name',
  stringCount: '#.list[*].name',
  fruits: [
    {
      name: '$.list[*].name',
      rating: '$.list[*].rating',
      recordsFor2022: '$.list[*].metadata.records[?(@.year === 2022)].rating',
      test: [
        {
          item1: '$.list[!].metadata.records[*].rating',
          item2: '$.list[!].metadata.records[*].year',
        }
      ]
    }
  ]
}
~~~
result will be ([!] iterate within node only)
~~~
{
  "count": 3,
  "stringCount": "3",
  "fruits": [
    {
      "name": "apple",
      "rating": 10,
      "recordsFor2022": 6,
      "test": [
        {
          "item1": 10,
          "item2": 2020
        },
        {
          "item1": 8,
          "item2": 2021
        },
        {
          "item1": 6,
          "item2": 2022
        }
      ]
    },
    {
      "name": "mango",
      "rating": 6,
      "recordsFor2022": 3,
      "test": [
        {
          "item1": 7,
          "item2": 2020
        },
        {
          "item1": 5,
          "item2": 2021
        },
        {
          "item1": 3,
          "item2": 2022
        }
      ]
    },
    {
      "name": "grape",
      "rating": 8,
      "recordsFor2022": 2,
      "test": [
        {
          "item1": 4,
          "item2": 2020
        },
        {
          "item1": 4,
          "item2": 2021
        },
        {
          "item1": 2,
          "item2": 2022
        }
      ]
    }
  ]
}
~~~
