// https://vitepress.dev/guide/custom-theme
import {h} from 'vue';
import Theme from 'vitepress/theme';
import './styles/style.css';
import './styles/custom.css'
import Archives from './components/Archives.vue';
import Tags from './components/Tags.vue';
import Page from './components/Page.vue';
import Comment from './components/Comment.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import Avatar from './components/Avatar.vue';
import Login from './components/Login.vue';
// import VPNavBar from './components/VPNavBar.vue';
export default {
    extends: Theme,
    Layout: () => {
        return h(Theme.Layout, null, {
            'nav-bar-content-after': () => h(Avatar)
            // https://vitepress.dev/guide/extending-default-theme#layout-slots
        });
    },
    enhanceApp({app, router, siteData}) {
        app.use(ElementPlus);
        app.component('Tags', Tags);
        app.component('Archives', Archives);
        app.component('Page', Page);
        app.component('Comment', Comment);
        app.component('Login', Login);

        // app.component('VPNavBar', VPNavBar);
    },
};
