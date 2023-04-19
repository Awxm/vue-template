const subject = () => import('@v/subject/index');
const subjectEdit = () => import('@v/subject/edit');

const list = [
  {
    path: '/',
    redirect: '/subject',
    name: 'Subject',
    meta: { title: '受试者管理', icon: 'el-icon-tickets' },
    children: [
      {
        path: 'subject',
        component: subject,
        hidden: true,
        meta: { activeMenu: '/', title: '添加受试者' },
      },
      {
        path: 'edit/:subjectId',
        name: 'SubjectEdit',
        component: subjectEdit,
        hidden: true,
        meta: { activeMenu: '/', title: '编辑受试者' },
      },
    ],
  },
];

export default list;
