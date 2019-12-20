const nowYear = new Date().getFullYear();

const CommonList = [
    {
        name: "地区",
        icon: 'map-pin',
        cate: 'Area',
        type: ["大陆", "美国", "加拿大", "香港", "韩国", "日本", "台湾", "泰国", "西班牙", "法国", "印度", "英国"]
    },
    {
        name: "年份",
        icon: 'calendar',
        cate: 'Year',
        type: [nowYear, nowYear - 1, nowYear - 2, nowYear - 3, nowYear - 4, nowYear - 5, nowYear - 6, nowYear - 7, nowYear - 8, nowYear - 9, nowYear - 10]
    }
]

const Categories = {
    movie: [
        {
            name: "分类",
            icon: 'layers',
            cate: 'Channel',
            type: ["动作片", "喜剧片", "爱情片", "科幻片", "恐怖片", "剧情片", "战争片"]
        },
        {
            name: "剧情",
            icon: 'compass',
            cate: 'Plot',
            type: ["惊悚", "悬疑", "魔幻", "犯罪", "灾难", "动画", "古装", "歌舞"]
        }
    ],
    tv: [
        {
            name: "分类",
            icon: 'layers',
            cate: 'Channel',
            type: ["韩剧", "剧情", "欧美剧", "日剧", "台剧", "泰剧"]
        },
        {
            name: "剧情",
            icon: 'compass',
            cate: 'Plot',
            type: ["言情", "都市", "家庭", "偶像", "喜剧", "古装", "武侠", "刑侦", "战争", "神话", "军旅", "校园", "悬疑"]
        }
    ],
    comic: [
        {
            name: "剧情",
            icon: 'compass',
            cate: 'Plot',
            type: ["冒险", "热血", "搞笑", "少女", "推理"]
        }
    ],
    variety: [
        {
            name: "剧情",
            icon: 'compass',
            cate: 'Plot',
            type: ["喜剧", "家庭", "家庭", "运动", "真人秀", "脱口秀"]
        }
    ]
}

export { CommonList,Categories }