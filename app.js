const Home = {
    props: ['sources', 'updated'],
    data: function() {
        return {
            members: [
                {
                    name: 'うた',
                    key: 'Uta'
                },
                {
                    name: 'ひなか',
                    key: 'Hinaka'
                },
                {
                    name: 'ねね',
                    key: 'Nene'
                },
                {
                    name: 'れいか',
                    key: 'Reika'
                },
                {
                    name: 'しずく',
                    key: 'Shizuku'
                },
                {
                    name: 'みこと',
                    key: 'Mikoto'
                },
                {
                    name: 'ゆずき',
                    key: 'Yuzuki'
                },
                {
                    name: 'あおい',
                    key: 'Aoi'
                },
                {
                    name: 'ゆきの',
                    key: 'Yukino'
                },
                {
                    name: 'まや',
                    key: 'Maya'
                },
                {
                    name: 'なでしこ',
                    key: 'Nadeshiko'
                },
                {
                    name: 'ねくと',
                    key: 'Nekuto'
                }
            ]
        }
    },
    computed: {
        selectedMember: function() {
            let name = this.$route.params.name;
            if (name === undefined) {
                return 'メンバーを選んでね';
            } else {
                let member = this.members.filter(obj => {
                    return obj.key === name;
                });
                return member[0].name;
            }
        },
        buttons: function () {
            let name = this.$route.params.name;
            let buttons = [];
            for (let i in this.sources) {
                var video = this.sources[i];
                if (video.name === name) {
                    buttons.push(video);
                }
            }
            return buttons;
        }
    },
    created: function () {
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    },
    template: `
        <div class="container-fluid pt-2 pb-2">
            <div class="row mb-2">
                <div id="app" class="col-md-8">
                    <h1 class="mt-2">ジェムカンボタン v.1.1</h1>
                    <p>メンバーの何気ない一言を再生して愛でることができるボタンです。<br>
                        勝手に作ってごめんなさい。いつも配信してくれてありがとう。</p>
                    <div class="btn-group" role="group">
                        <button id="membersDrop" type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {{ selectedMember }}
                        </button>
                        <div class="dropdown-menu" aria-labelledby="membersDrop">
                            <router-link v-for="m in members" :key="m.key" :to="{ name: 'member', params: { name: m.key } }" class="dropdown-item" active-class="active">{{ m.name }}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="embed-responsive embed-responsive-16by9">
                        <div id="player" class="embed-responsive-item"></div>
                    </div>
                </div>
            </div>
            <div class="row mb-5">
                <div class="col">
                    <router-view :buttons="buttons"></router-view>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <small>
                        Inspired by <a href="http://sanabutton.ojaru.jp/" target="_blank">さなボタン</a> |
                        Developed with ♡ by <a href="https://twitter.com/KorokkeRamen" target="_blank">@KorokkeRamen</a> |
                        Supported by <a href="https://twitter.com/shira_vr" target="_blank">@shira_vr</a> |
                        <a href="https://gemscompany.jp/" target="_blank">GEMS COMPANY Official</a> |
                        Last updated at {{ updated }}
                    </small>
                </div>
            </div>
        </div>
    `
}

const Button = {
    props: ['button'],
    methods: {
        play: function (e) {
            let startSeconds;
            let endSeconds;

            startSeconds = this.button.start;
            if (typeof startSeconds === "string") {
                startSeconds = startSeconds.split(':');
                startSeconds = Number(startSeconds[0]) * 60 + Number(startSeconds[1]);
            }

            endSeconds = this.button.end;
            if (typeof endSeconds === "string") {
                endSeconds = endSeconds.split(':');
                endSeconds = Number(endSeconds[0]) * 60 + Number(endSeconds[1]);
            }

            player.loadVideoById({
                'videoId': this.button.videoid,
                'startSeconds': startSeconds,
                'endSeconds': endSeconds,
                'suggestedQuality': 'medium'
            });
        }
    },
    template: '<button @click="play" class="btn btn-light btn-sm mr-2 mb-2 shadow-sm">{{ button.label }}</button>'
}

const Buttons = {
    props: ['buttons'],
    components: {
        'play-button': Button
    },
    template: `
        <div>
            <play-button v-for="button in buttons" :key="button.videoid + button.start" :button="button"></play-button>
        </div>
        `
}

const router = new VueRouter({
    routes: [
        {
            path: '/',
            component: Home,
            children: [
                {
                    path: ':name',
                    name: 'member',
                    component: Buttons
                }
            ]
        }
    ]
});

var player;

function onYouTubeIframeAPIReady() {
    var milliseconds = new Date().getTime();
    player = new YT.Player('player');
    $.getJSON('source.json?t=' + milliseconds, function (response) {
        vm.lastUpdated = response.lastUpdated;
        vm.sources = response.Source;
        vm.sources.sort(function(a, b){
            if(a.label < b.label) { return -1; }
            if(a.label > b.label) { return 1; }
            return 0;
        });
    });
}

var vm = new Vue({
    router,
    data: {
        lastUpdated: '',
        sources: []
    },
    template: '<div id="app">' +
        '<router-view :sources="sources" :updated="lastUpdated"></router-view>' +
        '</div>'
}).$mount('#app');
