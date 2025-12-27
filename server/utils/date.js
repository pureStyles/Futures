const moment = require('moment');

function getNearestWeekday() {
    const today = moment();
    const dayOfWeek = today.day(); // 0:周日, 1:周一, ..., 6:周六
    
    // 如果是周六(6)，返回前一天(周五)
    if (dayOfWeek === 6) {
      return today.subtract(1, 'day').format('YYYY-MM-DD');
    }
    
    // 如果是周日(0)，返回前两天(周五)
    if (dayOfWeek === 0) {
      return today.subtract(2, 'days').format('YYYY-MM-DD');
    }
    
    // 工作日(周一到周五)，直接返回今天
    return today.format('YYYY-MM-DD');
}

module.exports = {
    getNearestWeekday
}