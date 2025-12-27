
import path from "path";
import { allVarietiesData } from "./data/allVarietiesData.js";

const DATA_OUTPUT_PATH = path.join(__dirname, "../app/data.json");

const payload = {
    metadata: {
        update_at: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
        total_count: allVarietiesData.length
    },
    records: allVarietiesData
};