// import parseTime, formatTime and set to filter
export { parseTime } from '@/utils';
import store from '@/store';
/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label;
  }
  return time + label + 's';
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time);
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute');
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour');
  } else {
    return pluralize(~~(between / 86400), ' day');
  }
}

export function statusItemText(value, code, isStr = true) {
  if (!value) return '暂无';
  let explain = isStr ? null : [];
  if (isStr ? !value : value.length === 0) return;
  const dictionary = store.getters.dataDictionarty_code[code];
  if (!dictionary) return;
  const { items } = dictionary;
  if (isStr) {
    explain = items.find((f) => f.itemValue === value)?.itemText;
  } else {
    for (let index = 0; index < value.length; index++) {
      const item = items.find((f) => f.itemValue === value[index]);
      if (item) explain.push(item?.itemText);
    }
  }
  return isStr ? explain : explain.toString();
}
