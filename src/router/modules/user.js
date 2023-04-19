const user = () => import('@v/user/index');

const list = [
  {
    path: '/user',
    children: [
      {
        path: 'index',
        name: 'User',
        component: user,
        meta: { title: '用户列表', icon: 'user' },
      },
    ],
  },
];

export default list;
