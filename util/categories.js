const nowYear = new Date().getFullYear();

const CommonList = [
    {
        name: "地区",
        icon: 'map-pin',
        cate: 'Area',
        type: [
            {
                name:"大陆",
                id:"大陆"
            },
            {
                name:"香港",
                id:"香港"
            },
            {
                name:"台湾",
                id:"台湾"
            },
            {
                name:"美国",
                id:"美国"
            },
            {
                name:"韩国",
                id:"韩国"
            },
            {
                name:"日本",
                id:"日本"
            },
            {
                name:"泰国",
                id:"泰国"
            },
            {
                name:"新加坡",
                id:"新加坡"
            },
            {
                name:"马来西亚",
                id:"马来西亚"
            },
            {
                name:"英国",
                id:"英国"
            },
            {
                name:"法国",
                id:"法国"
            },
            {
                name:"加拿大",
                id:"加拿大"
            },
        ]
    },
    {
        name: "年份",
        icon: 'calendar',
        cate: 'Year',
        //nowYear, nowYear - 1, nowYear - 2, nowYear - 3, nowYear - 4, nowYear - 5, nowYear - 6, nowYear - 7, nowYear - 8, nowYear - 9, nowYear - 10
        type: [
            {
                name:nowYear,
                id:nowYear
            },
            {
                name:nowYear-1,
                id:nowYear-1
            },
            {
                name:nowYear-2,
                id:nowYear-2
            },
            {
                name:nowYear-3,
                id:nowYear-3
            },
            {
                name:nowYear-4,
                id:nowYear-4
            },
            {
                name:nowYear-5,
                id:nowYear-5
            },
            {
                name:nowYear-6,
                id:nowYear-6
            },
            {
                name:nowYear-7,
                id:nowYear-7
            },
            {
                name:nowYear-8,
                id:nowYear-8
            },
            {
                name:nowYear-9,
                id:nowYear-9
            },
            {
                name:nowYear-10,
                id:nowYear-10
            }
        ]
    }
]

const Categories = {
    movie: [
        {
            name: "分类",
            icon: 'compass',
            cate: 'Plot',
            type: [
                {
                    name:"动作",
                    id:8
                },
                {
                    name:"惊悚",
                    id:43
                },
                {
                    name:"犯罪",
                    id:40
                },
                {
                    name:"冒险",
                    id:35
                },
                {
                    name:"武侠",
                    id:44
                },
                {
                    name:"悬疑",
                    id:42
                },
                {
                    name:"科幻",
                    id:11
                },
                {
                    name:"恐怖",
                    id:12
                },
                {
                    name:"爱情",
                    id:10
                },
                {
                    name:"喜剧",
                    id:9
                },
                {
                    name:"战争",
                    id:13
                },
                {
                    name:"灾难",
                    id:38
                },
                {
                    name:"古装",
                    id:37
                },
                {
                    name:"警匪",
                    id:39
                },
                {
                    name:"历史",
                    id:28
                },
                {
                    name:"伦理",
                    id:27
                },
                {
                    name:"剧情",
                    id:26
                },
                {
                    name:"抗日",
                    id:122
                },
                {
                    name:"谍战",
                    id:45
                },
                {
                    name:"青春",
                    id:31
                }
            ]
        },
    ],
    tv: [
        {
            name: "分类",
            icon: 'compass',
            cate: 'Plot',
            type: [
                {
                    name:"动作",
                    id:133
                },
                {
                    name:"惊悚",
                    id:134
                },
                {
                    name:"犯罪",
                    id:66
                },
                {
                    name:"恐怖",
                    id:112
                },
                {
                    name:"言情",
                    id:87
                },
                {
                    name:"悬疑",
                    id:67
                },
                {
                    name:"搞笑",
                    id:80
                },
                {
                    name:"校园",
                    id:69
                },
                {
                    name:"战争",
                    id:74
                },
                {
                    name:"古装",
                    id:78
                },
                {
                    name:"抗日",
                    id:123
                },
                {
                    name:"谍战",
                    id:71
                },
            ]
        },
        {
            name: "状态",
            icon: 'layers',
            cate: 'Status',
            type: [
                {
                    name:"连载中",
                    id:1
                },
                {
                    name:"已完结",
                    id:2
                },
            ]
        }
    ],
    comic: [
        {
            name: "分类",
            icon: 'compass',
            cate: 'Plot',
            type: [
                {
                    name:"热血",
                    id:59
                },
                {
                    name:"搞笑",
                    id:58
                },
                {
                    name:"冒险",
                    id:60
                },
                {
                    name:"惊悚",
                    id:128
                },
                {
                    name:"励志",
                    id:64
                },
                {
                    name:"恋爱",
                    id:104
                },
                {
                    name:"科幻",
                    id:109
                },
                {
                    name:"宠物",
                    id:116
                },
                {
                    name:"推理",
                    id:54
                },
                {
                    name:"校园",
                    id:53
                },
                {
                    name:"魔幻",
                    id:56
                },
                {
                    name:"益智",
                    id:50
                },
                {
                    name:"机战",
                    id:55
                },
            ]
        },
        {
            name: "状态",
            icon: 'layers',
            cate: 'Status',
            type: [
                {
                    name:"连载中",
                    id:1
                },
                {
                    name:"已完结",
                    id:2
                },
            ]
        }
    ],
    variety: [
        {
            name: "分类",
            icon: 'compass',
            cate: 'Plot',
            type: [
                {
                    name:"搞笑",
                    id:100
                },
                {
                    name:"真人秀",
                    id:101
                },
                {
                    name:"脱口秀",
                    id:102
                },
                {
                    name:"晚会",
                    id:16
                },
                {
                    name:"财经",
                    id:17
                },
                {
                    name:"体育",
                    id:18
                },
                {
                    name:"纪实",
                    id:19
                },
                {
                    name:"益智",
                    id:127
                },
                {
                    name:"歌舞",
                    id:21
                },
                {
                    name:"军事",
                    id:23
                },
                {
                    name:"少儿",
                    id:24
                },
                {
                    name:"音乐",
                    id:92
                },
                {
                    name:"游戏",
                    id:93
                },
                {
                    name:"美食",
                    id:94
                },
                {
                    name:"娱乐",
                    id:98
                },
            ]
        },
        {
            name: "状态",
            icon: 'layers',
            cate: 'Status',
            type: [
                {
                    name:"连载中",
                    id:1
                },
                {
                    name:"已完结",
                    id:2
                },
            ]
        }
    ]
}

export { CommonList,Categories }