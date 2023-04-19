import store from '@/store';

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const permissionList = store.getters && store.getters.p;
    const permissionRoles = value;
    const hasPermission = permissionList.some((role) => {
      return permissionRoles.includes(role);
    });

    if (!hasPermission) {
      return false;
    }
    return true;
  } else {
    console.error('need roles!');
    return false;
  }
}
