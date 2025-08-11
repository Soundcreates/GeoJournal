const dayjs = require('dayjs');

module.exports.isThisMonth = (createdAt) => {

  return dayjs(createdAt).isSame(dayjs(), 'month');
}