let jp = require("jsonpath");

//--------------------------------------------------------------------------------------------------
// Handling standard json path
//--------------------------------------------------------------------------------------------------
function jsonpathMapStep1(paramObject, target, isInsideArray) {
  let obj = JSON.parse(JSON.stringify(paramObject));
  const itemList = [];
  const subCallList = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object') {
        if (isInsideArray) {
          obj[key] = jsonpathMapStep1(obj[key], target, isInsideArray);
          subCallList.push({ key: key, data: obj[key] });
        } else {
          if (Array.isArray(obj[key])) {
            obj[key] = jsonpathMapStep1(obj[key], target, true);
            subCallList.push({ key: key, data: obj[key] });
          } else {
            obj[key] = jsonpathMapStep1(obj[key], target, false);
            subCallList.push({ key: key, data: obj[key] });
          }
        }
      } else if ((typeof obj[key] === 'string') && (obj[key].startsWith('$.'))) { // Jsonpath query
        if (obj[key].indexOf('[!]') === -1) { // Custom step mode
          if (isInsideArray) {
            itemList.push({ key: key, target: target, query: obj[key] });
          } else {
            obj[key] = jp.query(target, obj[key]);
          }
        }
      } else if ((typeof obj[key] === 'string') && (obj[key].startsWith('%.'))) {  // Integer counter
        const myTarget = obj[key].replace('%.', '$.');
        obj[key] = jp.query(target, myTarget).length;
      } else if ((typeof obj[key] === 'string') && (obj[key].startsWith('#.'))) {  // String counter
        const myTarget = obj[key].replace('#.', '$.');
        obj[key] = jp.query(target, myTarget).length.toString();
      }
    } else {
      throw new Error('NOT hasOwnProperty');
    }
  }

  if (itemList.length !== 0) { // Inside array mode handling
    const objectList = [];
    let isFirst = true;
    itemList.forEach((item) => {
        const queryResult = jp.query(item.target, item.query);
        if (isFirst) {
          queryResult.forEach((queryItem) => {
            let myObject = {};
            if (itemList.length === 1 && item.key === '0') {
              myObject = queryItem;
            } else {
              myObject[`${item.key}`] = queryItem;
            }
            objectList.push(myObject);
          })
          isFirst = false;
        } else {
          queryResult.forEach((queryItem, index) => {
            objectList[index][`${item.key}`] = queryItem;
          });
        }
      }
    )
    obj = objectList;
    obj.forEach((v) => { // re-insert sub result into each array
      subCallList.forEach((x) => {
        v[`${x.key}`] = x.data;
      });
    });
  } else {
    if (Array.isArray(obj) && Array.isArray(obj[0])) { // ArrayMode result cleanup
      obj = obj[0];
    }
  }

  return obj;
}

//--------------------------------------------------------------------------------------------------
// Handling Custom step
//--------------------------------------------------------------------------------------------------
function jsonpathMapStep2(paramObject, target, index, arrayCount) {
  let obj = JSON.parse(JSON.stringify(paramObject));
  const queryResult = [];
  let isFirst = true;

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object') {
        if (Array.isArray(obj[key])) {
          const count = arrayCount !== 0 ? arrayCount : obj[key].length;
          obj[key] = jsonpathMapStep2(obj[key], target, index++, count);
        } else {
          obj[key] = jsonpathMapStep2(obj[key], target, index++, arrayCount);
        }
      } else if ((typeof obj[key] === 'string') && (obj[key].indexOf('[!].') !== -1)) {
        const convertedQuery = obj[key].replace('[!].', `[${index}].`);
        const queryOutput = jp.query(target, convertedQuery);

        if (isFirst) {
          queryOutput.forEach((x) => {
            const myObject = {};
            myObject[`${key}`] = x;
            queryResult.push(myObject);
          });
        } else {
          queryOutput.forEach((x, index) => {
            queryResult[index][`${key}`] = x;
          });
        }
        isFirst = false;
      }
    } else {
      throw new Error('NOT hasOwnProperty');
    }
  }
  if (queryResult.length !== 0) {
    obj = queryResult;

  } else if (Array.isArray(obj) && Array.isArray(obj[0])) { // ArrayMode result cleanup
    obj = obj[0];
  }

  return obj;
}

//--------------------------------------------------------------------------------------------------
exports.jsonpathmap2 = function (targetStructure, dataObject) {
  let result;

  result = jsonpathMapStep1(targetStructure, dataObject, false);
  if (JSON.stringify(result).indexOf('[!].') !== -1) { // Need custom operation
    result = jsonpathMapStep2(result, dataObject, 0, 0);
  }
  return result;
}
