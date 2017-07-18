import Login from '../component/test/test2.vue'
import Login2 from '../component/test/test3.vue'
import Login3 from '../component/test/test4.vue'

let routes = [
    {
        path: '/login/:id',
        component: Login,
        name: '',
        hidden: true
    },
     {
        path: '/login/',
        component: Login2,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Login2,
        name: '',
        hidden: true
    },
    {
        path: '/children/',
        component: Login3,
        name: '',
        hidden: true,
        children:[
            {
                 path: 'childrenlist/:id',
                 component: Login
            }
        ]
    }
];

export default routes;