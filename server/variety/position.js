const moment = require("moment");
const { queryVarietyPostion } = require("../api/broker.js");
const { getNearestWeekday } = require("../utils/date.js");

async function fetchVarietyPositionData(varietyCode) {
    try {
        const data = await queryVarietyPostion({
            code: varietyCode,
            date: getNearestWeekday(),
        });
        return {
            longPosition: data.buy || [],
            shortPosition: data.ss || [],
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    fetchVarietyPositionData
}


