const study = () => import('@v/study/index');
const studyCreate = () => import('@v/study/create');
const studyEdit = () => import('@v/study/edit');

const list = [
  {
    path: '/study',
    redirect: '/study/index',
    meta: { title: '试验项目管理', icon: 'el-icon-folder-opened' },
    children: [
      {
        path: 'index',
        name: 'Study',
        component: study,
        hidden: true,
        meta: { activeMenu: '/study' },
      },
      {
        path: 'create',
        name: 'StudyCreate',
        component: studyCreate,
        hidden: true,
        meta: { activeMenu: '/study', title: '创建项目' },
      },
      {
        path: 'edit',
        name: 'StudyEdit',
        component: studyEdit,
        hidden: true,
        meta: { activeMenu: '/study', title: '编辑项目' },
      },
    ],
  },
];

export default list;
