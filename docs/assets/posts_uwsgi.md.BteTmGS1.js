import{_ as n,c as i,m as s,a as e,t as l,aS as p,o as t}from"./chunks/framework.Dbjoj8K5.js";const r="/assets/uWSGI、uwsgi与WSGI.D63FhGYU.jpg",u="/assets/uwsgi2.CdfdFAU6.png",S=JSON.parse('{"title":"Flask使用uwsgi进行部署","description":"Flask使用uwsgi进行部署到Linux服务器","frontmatter":{"date":"2024.2.20","title":"Flask使用uwsgi进行部署","tags":["python","flask","linux"],"description":"Flask使用uwsgi进行部署到Linux服务器"},"headers":[],"relativePath":"posts/uwsgi.md","filePath":"posts/uwsgi.md","lastUpdated":1708342800000}'),o={name:"posts/uwsgi.md"},c={id:"frontmatter-title",tabindex:"-1"},h=s("a",{class:"header-anchor",href:"#frontmatter-title","aria-label":'Permalink to "{{ $frontmatter.title }}"'},"​",-1),d=p('<h2 id="前言" tabindex="-1">前言 <a class="header-anchor" href="#前言" aria-label="Permalink to &quot;前言&quot;">​</a></h2><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>正常运行flask app后会发出警告<code>WARNING:This is a developnent server. Do not use it in a production deploynent，</code></p></div><p>Flask 是一个 WSGI <em>应用</em> 。一个 WSGI <em>服务器</em> 被用来运行应用，将传入的 HTTP 请求转换为标准的 WSGI 响应，并将流出的 WSGI 响应转换为 HTTP 响应</p><p>要在生产环境中运行你的项目，你应该使用一个专门的WSGI服务器，例如Gunicorn、uWSGI或者mod_wsgi（对于Apache服务器）。这些服务器能够更好地处理并发请求、提供更好的性能，并且更适合长时间运行的生产环境</p><h2 id="uwsgi基础知识" tabindex="-1">UWSGI基础知识 <a class="header-anchor" href="#uwsgi基础知识" aria-label="Permalink to &quot;UWSGI基础知识&quot;">​</a></h2><h3 id="uwsgi、uwsgi、wsgi" tabindex="-1">uWSGI、uwsgi、WSGI <a class="header-anchor" href="#uwsgi、uwsgi、wsgi" aria-label="Permalink to &quot;uWSGI、uwsgi、WSGI&quot;">​</a></h3><blockquote><ul><li><strong>WSGI</strong> web应用程序之间的接口。它的作用就像是桥梁，连接在web服务器和web应用框架之间。* <em>它是一个Web服务器（uWSGI等服务器）与web应用（如用Django/Flask框架写的程序)通信的一种协议。</em>*</li><li><strong>uwsgi</strong> 是一种传输协议，用于定义传输信息的类型，<strong>常用于在uWSGI服务器与其他网络服务器的数据通信。</strong></li><li><strong>uWSGI</strong> 是实现了uwsgi协议WSGI的web服务器</li></ul></blockquote><p><img src="'+r+`" alt="uWSGI、uwsgi与WSGI.jpg"></p><h2 id="uwsgi服务器安装" tabindex="-1">uWSGI服务器安装 <a class="header-anchor" href="#uwsgi服务器安装" aria-label="Permalink to &quot;uWSGI服务器安装&quot;">​</a></h2><p>uWSGI全称Web Server Gateway Interface，是一个用于将Web应用程序和Web服务器之间进行通信的协议和软件实现。它不仅仅是一个应用服务器，还可以充当应用容器，提供了一种将Web应用程序与Web服务器解耦的方式。uWSGI 以其强大的性能而闻名，能够有效地处理大量并发请求。它采用多种性能优化策略，使其在高负载环境下表现出色。</p><p>也有不少人会用Gunicorn或Waitress去进行Flask的部署，相对于uWSGI而言，它们会更简单和易操作。但是在性能和并发上来说，都不及uWSGI，包括以后我们学习Django也可以用uWSGI去进行部署，并支持容器化部署，可以和Doker良好集成，这些都是十分方便的。</p><div class="vp-code-group vp-adaptive-theme"><div class="tabs"><input type="radio" name="group-Hy09e" id="tab-turDS6d" checked="checked"><label for="tab-turDS6d">pip</label><input type="radio" name="group-Hy09e" id="tab-fUzzoDe"><label for="tab-fUzzoDe">poetry</label></div><div class="blocks"><div class="language-shell vp-adaptive-theme active line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pip</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install uwsgi</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><div class="language-shell vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">poetry</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> add uwsgi</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div></div></div><h2 id="uwsgi配置启动" tabindex="-1">uWSGI配置启动 <a class="header-anchor" href="#uwsgi配置启动" aria-label="Permalink to &quot;uWSGI配置启动&quot;">​</a></h2><ul><li>windows下新建 <code>uwsgi.ini</code> 输入如下配置</li></ul><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>[uwsgi]</span></span>
<span class="line"><span>module = manage:app</span></span>
<span class="line"><span>home = /root/miniconda3/envs/blog</span></span>
<span class="line"><span>master = true</span></span>
<span class="line"><span>processes = 4</span></span>
<span class="line"><span>http-socket = 0.0.0.0:5000</span></span>
<span class="line"><span>threads = 2</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><ul><li>配置文件解释</li></ul><div class="language-python vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># module = manage:app</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">指定了包含应用程序的 Python 模块和应用程序实例。</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">在这个例子中，manage 是模块的名称，</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">app 是 Flask 应用程序实例的名称</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># home = /root/miniconda3/envs/blog</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">指定了虚拟环境的路径。uWSGI 将使用这个虚拟环境来运行你的应用程序，</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">确保应用程序可以访问所需的 Python 包</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># master = true</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">启用主进程。uWSGI 可以以主进程和工作进程的模式运行，</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">其中主进程负责管理工作进程。设置为 true 表示启用主进程</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># processes = 4</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">指定启动的工作进程数量。在这个例子中，设置为 4，</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">表示将启动 4 个工作进程来处理请求</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># http-socket = 0.0.0.0:5000</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">指定 uWSGI 监听的 HTTP 地址和端口。在这个例子中，</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">uWSGI 将监听所有可用的网络接口 (0.0.0.0) 的 5000 端口</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># threads = 2</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">指定每个工作进程启动2条线程，</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">指定线程的目的是因为项目开了Flask APScheduler，需要开启线程支持，</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">默认不开启多线程</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;&quot;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br></div></div><p>我们是用工厂模式编写的Flask项目，暴露的app对象在 <code>manage.py</code> 中，当你使用这个配置启动uWSGI时，它将利用你miniconda的虚拟环境加载你的Flask应用程序的<code>app</code> 并处理传入的请求</p><ul><li><p>uwsgi.ini 上传（可以将此配置文件丢到项目根目录下）</p></li><li><p>启动uWSGI（在你的uwsgi.ini文件目录下）</p></li></ul><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>uwsgi --ini uwsgi.ini</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><ul><li><p>浏览器输入公网IP+端口号进行访问，例如我的公网IP为8.111.222.55，则在浏览器中输入 <code>8.111.222.55:5000</code></p></li><li><p>访问即可看到此时已经启动4条进程且通过uWSGI服务器通过工厂模式启动了Flask项目，且能看到清晰的路由访问</p></li></ul><p><img src="`+u+'" alt="uwsgi2.png"></p><p>可以自行测试API的响应速度可以发现部分资源加载还是比较慢</p><blockquote><p>使用 uWSGI 单独是不足以使外网浏览器访问你的应用程序的，因为 uWSGI 本身只是一个应用服务器，负责运行 WSGI 应用程序。虽然WSGI 服务器包含内置的 HTTP 服务器。但是专业的 HTTP 服务器会可能更快，为了从外部访问你的应用程序，你还需要在 WSGI 服务器前面设置一个 HTTP 服务器，也就是反向代理服务器</p></blockquote>',24);function b(a,k,g,m,F,y){return t(),i("div",null,[s("h1",c,[e(l(a.$frontmatter.title)+" ",1),h]),d])}const w=n(o,[["render",b]]);export{S as __pageData,w as default};
