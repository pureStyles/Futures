import moment from "moment";
import { queryVarietyPostion } from "../api/broker.js";

async function fetchNetPositionData(varietyCode) {
    try {
        const data = await queryVarietyPostion({
            code: varietyCode,
            date: moment().format("YYYY-MM-DD"),
        });
        return {
            longPosition: data.buy || [],
            shortPosition: data.ss || [],
        }
    } catch (error) {
        console.log(error)
    }
}


