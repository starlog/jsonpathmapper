'use strict';
let jsonpathmap = require('../lib/jsonpathmap');
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

let resultObj = jsonpathmap.jsonpathmap(_myTargetStructure,_mydata);
console.log('resultObj\n'+JSON.stringify(resultObj, null, 2));

