
const path = require('path');
const fs = require('fs').promises;
const moment = require("moment");
const { fetchVarietyPositionData } = require("./variety/position.js");
const { MAIN_VARIERY } = require("./config/index");

const { getNearestWeekday } = require("./utils/date.js");

const DATA_OUTPUT_PATH = path.join(__dirname, `../app/public/data/variety.json`);

class Task {
    positonsData = {};

    async collectData() {
        /** 收集商品维度的持仓数据 */
        for (const mainVarieties of Object.values(MAIN_VARIERY)) {
            for (const varietyCode of mainVarieties) {
                try {
                    const data = await fetchVarietyPositionData(varietyCode);
                    this.positonsData[varietyCode] = data;
                } catch (error) {
                    console.log(error);
                }

                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    async loadData(file) {
        try {
          const raw = await fs.readFile(file, 'utf-8')
          return JSON.parse(raw);
        } catch {
          return []
        }
    }

    appendByDate(list, day) {
        const index = list.findIndex(d => d.date === day.date);
        if (index >= 0) {
          list[index] = day
        } else {
          list.push(day)
        }
    }
    
    async saveData () {
        const store = await this.loadData(DATA_OUTPUT_PATH);
        this.appendByDate(store, {
            date: getNearestWeekday(),
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            positions: this.positonsData
        });

        await fs.writeFile(
            DATA_OUTPUT_PATH,
            JSON.stringify(store, null, 2),
            'utf-8'
        )
    }

    async run() {
        await this.collectData();
        await this.saveData();
    }
}

new Task().run();