'use strict';
let jp = require('jsonpath');
let _ = require('lodash');

///////////////////////////////////////////////////////////////////////////////////////////////////
// JSON data mapper
//
// map data into jsonpath flavored structure
// can use full JSONPath expressions: see https://www.npmjs.com/package/jsonpath
// $. denotes jsonpath notation
//
// Extended expressions:
// #. denotes jsonpath notation's count in string
// %. denotes jsonpath notation's count in number
///////////////////////////////////////////////////////////////////////////////////////////////////
exports.jsonpathmap = function(targetStructure, dataObject)
{
    let obj = _.clone(targetStructure);
    preparation(obj, dataObject);
    traverse(obj, dataObject);

    return obj;
}
///////////////////////////////////////////////////////////////////////////////////////////////////
function isArray(obj)
{
    return Object.prototype.toString.call(obj) === '[object Array]';
}
///////////////////////////////////////////////////////////////////////////////////////////////////
// Analyse structure and prepare(expand array)
///////////////////////////////////////////////////////////////////////////////////////////////////
function preparation(obj,document)
{
    if (isArray(obj)) // Array check
    {
        handleArray(obj,document);
    }
    else
    {
        for (let k in obj)
        {
            if (obj.hasOwnProperty(k))
            {
                if (obj[k] && typeof obj[k] === 'object')
                {
                    preparation(obj[k],document)
                }
            }
        }
    }
}
///////////////////////////////////////////////////////////////////////////////////////////////////
// Convert JSONPath into actual data
///////////////////////////////////////////////////////////////////////////////////////////////////
function traverse(obj,document)
{
    for (let k in obj)
    {
        if (obj.hasOwnProperty(k))
        {
            if (obj[k] && typeof obj[k] === 'object')
            {
                traverse(obj[k],document)
            }
            else
            {
                switch (typeof obj[k])
                {
                    case 'string':
                        if (obj[k].startsWith('$'))
                        {
                            let data = jp.query(document, obj[k]);
                            if (data.length === 1 && isArray(data))
                            {
                                obj[k] = data[0];
                            }
                            else
                            {
                                obj[k] = data;
                            }
                        }
                        else if (obj[k].startsWith('#'))
                        {
                            obj[k] = jp.query(document, '$' + obj[k].substring(1)).length.toString();
                        }
                        else if (obj[k].startsWith('%'))
                        {
                            obj[k] = jp.query(document, '$' + obj[k].substring(1)).length;
                        }
                        break;
                    default:
                        // Skipping other types
                        break;
                }
            }
        }
    }
}
///////////////////////////////////////////////////////////////////////////////////////////////////
// Handle array ('[..]' element and expand to proper size
///////////////////////////////////////////////////////////////////////////////////////////////////
function handleArray(obj,document)
{
    let deleteArray = [];
    let placeHolder = obj;
    for (let k in obj)
    {
        if (obj.hasOwnProperty(k))
        {
            let savedObject = obj[k];
            let testString = null;

            for (let j in obj[k])
            {
                if (obj[k].hasOwnProperty(j))
                {
                    if (typeof obj[k][j] === 'string')
                    {
                        testString = obj[k][j];
                        break;
                    }
                }
            }

            if (testString !== null && (testString.startsWith('$') || testString.startsWith('#')))
            {
                // Get total count
                let count = jp.query(document, testString).length;

                deleteArray.push(k);
                for (let i = 0; i < count; i++)
                {
                    let newElement = _.clone(savedObject);
                    for (let c in newElement)
                    {
                        if (newElement.hasOwnProperty(c))
                        {
                            newElement[c] = newElement[c].replace('*', i.toString());
                        }
                    }
                    placeHolder.push(newElement);
                }
            }
        }
    }

    // remove original elements
    for(let index=deleteArray.length-1; index >= 0; index--)
    {
        placeHolder.splice(deleteArray[index],1);
    }
}
