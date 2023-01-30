'use strict'
let jsonpathmap2 = require('../lib/jsonpathmap2');

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
};


const startTime = new Date().valueOf();
const myResult2 = jsonpathmap2.jsonpathmap2(extract, data);
const endTime = new Date().valueOf();
console.log(`Time=${endTime - startTime}`);
console.log(JSON.stringify(myResult2, null, 2));
