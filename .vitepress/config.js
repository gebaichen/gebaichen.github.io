import {defineConfig} from 'vitepress';
import {getPosts} from './theme/serverUtils.js';

export default defineConfig({
    title: 'QuqiNotes',
    lang: 'zh',
    description: '一个文档网站',
    outDir: "dist/dist",
    lastUpdated: true,
    head: [['link', {rel: 'icon', href: '/logo.png'}]],
    themeConfig: {
        logo: '/logo.png',
        siteTitle: 'QuqiNotes',
        outlineTitle: '目录',
        outline: 'deep',
        posts: await getPosts(6),
        comment: {
            repo: 'gebaichen/quqinotes',
            themes: 'github-light',
            issueTerm: 'pathname',
        },
        lang: 'zh',
        search: {
            provider: 'local',
            options: {
                translations: {
                    button: {
                        buttonText: '搜索文档',
                        buttonAriaLabel: '搜索文档',
                    },
                    modal: {
                        noResultsText: '无法找到相关结果',
                        resetButtonTitle: '清除查询条件',
                        footer: {
                            selectText: '选择',
                            navigateText: '切换',
                        },
                    },
                },
            },
        },
        nav: [
            {text: '主页', link: '/'},
            {text: '文章', link: '/posts.html'},
            {text: '目录', link: '/archives.html'},
            {text: '标签', link: '/tags.html'},
            {text: '关于', link: '/about.html'},
            {
                text: '内容', items: [
                    {text: 'Flask', link: '/flask/index.html'},
                    {text: 'Pygame', link: '/pygame/index.html'},
                ],
            },
        ],
        localUrl: 'http://127.0.0.1:8000',
        lastUpdated: {
            text: '最后一次更新',
        },
        editLink: {
            pattern: 'https://gitee.com/ge-baichen_admin/quqinotes/issues',
            text: '报告错误',
        },
        socialLinks: [
            {
                icon: 'github',
                link: '',
            },
            {
                icon: {
                    svg: '<svg t="1676025427495" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2136" width="200" height="200"><path d="M512 1024C229.222 1024 0 794.778 0 512S229.222 0 512 0s512 229.222 512 512-229.222 512-512 512z m259.149-568.883h-290.74a25.293 25.293 0 0 0-25.292 25.293l-0.026 63.206c0 13.952 11.315 25.293 25.267 25.293h177.024c13.978 0 25.293 11.315 25.293 25.267v12.646a75.853 75.853 0 0 1-75.853 75.853h-240.23a25.293 25.293 0 0 1-25.267-25.293V417.203a75.853 75.853 0 0 1 75.827-75.853h353.946a25.293 25.293 0 0 0 25.267-25.292l0.077-63.207a25.293 25.293 0 0 0-25.268-25.293H417.152a189.62 189.62 0 0 0-189.62 189.645V771.15c0 13.977 11.316 25.293 25.294 25.293h372.94a170.65 170.65 0 0 0 170.65-170.65V480.384a25.293 25.293 0 0 0-25.293-25.267z" fill="#C71D23" p-id="2137"></path></svg>',
                },
                link: '',
                // You can include a custom label for accessibility too (optional but recommended):
            },
        ],
        sidebar: flaskSideBar(),
        footer: {
            copyright: 'CopyRight © 2023 quqi出品 All Rights Reserved',
        },
    },
    markdown: {
        lineNumbers: true,
    },
});

function flaskSideBar() {
    return {
        '/flask/': [
            {
                text: 'Flask基本使用',
                items: [
                    {
                        text: 'Web全栈介绍',
                        link: '/flask/introduce-web.html',
                    },
                    {
                        text: 'Flask基本操作',
                        link: '/flask/flask-basic.html',
                    },
                    {
                        text: 'Flask路由',
                        link: '/flask/flask-route.html',
                    },
                    {
                        text: 'Flask蓝图',
                        link: '/flask/flask-blueprint.html',
                    },
                    {
                        text: 'Flask请求',
                        link: '/flask/flask-request.html',
                    },
                    {
                        text: 'Flask模板（jinja2）',
                        link: '/flask/flask-jinja2.html',
                    },

                ],
            },
            {
                text: 'Flask进阶', items: [
                    {
                        text: 'Flask操作命令行',
                        link: '/flask/flask.cli.commmad.html',
                    },
                    {
                        text: 'Flask其他用法',
                        link: '/flask/flask-others.html',
                    },
                    {
                        text: 'Flask Web大型项目创建结构',
                        link: '/flask/web-project.html',
                    },
                    {
                        text: 'Flask项目部署',
                        link: '/flask/flask-bushu.html',
                    },
                ],
            },
            {
                text: 'Flask拓展插件', items: [
                    {
                        text: 'Flask插件',
                        link: '/flask/flask-tuozhan.html',
                    },
                    {
                        text: 'Flask-Sqlalchemy & Flask-Migrate',
                        link: '/flask/flask-sql.html',
                    },
                    {
                        text: 'Flask-Login & Flask-Session',
                        link: '/flask/flask-login.html',
                    },
                    {
                        text: 'Flask-Limiter',
                        link: '/flask/flask-limiter.html',
                    },
                    {
                        text: 'Flask-Wtf',
                        link: '/flask/flask-wtf.html',
                    },
                    {
                        text: 'Flask-Assets',
                        link: '/flask/flask-assets.html',
                    },
                    {
                        text: 'Flask-CORS',
                        link: '/flask/flask-cors.html',
                    },
                    {
                        text: 'Flask-RestFul',
                        link: '/flask/flask-restful.html',
                    },
                    {
                        text: 'Flask-JWT-Extended',
                        link: '/flask/flask-jwt.html',
                    },
                ],
            },
        ],
        '/pygame/': [
            {
                text: 'Pygame中文文档',
                items: [
                    {text: 'pygame', link: '/pygame/pygame.html'},
                    {text: 'BufferProxy', link: '/pygame/BufferProxy.html'},
                    {text: 'camera', link: '/pygame/camera.html'},
                    {text: 'cdrom', link: '/pygame/cdrom.html'},
                    {text: 'Color', link: '/pygame/Color.html'},
                    {text: 'cursors', link: '/pygame/cursors.html'},
                    {text: 'display', link: '/pygame/BufferProxy.html'},
                    {text: 'draw', link: '/pygame/draw.html'},
                    {text: 'event', link: '/pygame/event.html'},
                    {text: 'font', link: '/pygame/font.html'},
                    {text: 'gfxdraw', link: '/pygame/gfxdraw.html'},
                    {text: 'image', link: '/pygame/image.html'},
                    {text: 'joystick', link: '/pygame/joystick.html'},
                    {text: 'key', link: '/pygame/key.html'},
                    {text: 'locals', link: '/pygame/locals.html'},
                    {text: 'mask', link: '/pygame/mask.html'},
                    {text: 'mixer', link: '/pygame/mixer.html'},
                    {text: 'mouse', link: '/pygame/mouse.html'},
                    {text: 'movie', link: '/pygame/movie.html'},
                    {text: 'Overlay', link: '/pygame/Overlay.html'},
                    {text: 'rect', link: '/pygame/rect.html'},
                    {text: 'sndarray', link: '/pygame/sndarray.html'},
                    {text: 'version', link: '/pygame/version.html'},


                ]
            }]
    };
};
