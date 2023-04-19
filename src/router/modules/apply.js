const applyFormalAudit = () => import('@v/apply/formal');
const applyEnrollment = () => import('@v/apply/enrollment');
const applyList = () => import('@v/apply/list');

const list = [
  {
    path: '/apply',
    redirect: '/apply/list',
    meta: { title: '申请管理', icon: 'el-icon-edit-outline' },
    children: [
      {
        path: 'list',
        name: 'ApplyList',
        component: applyList,
        meta: { title: '申请单列表' },
      },
      {
        path: 'formal',
        name: 'ApplyFormal',
        component: applyFormalAudit,
        meta: { title: '形式审核列表' },
      },
      {
        path: 'enrollment',
        name: 'ApplyEnrollment',
        component: applyEnrollment,
        meta: { title: '医学审核列表' },
      },
    ],
  },
];

export default list;
