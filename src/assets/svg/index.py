import os
from bs4 import BeautifulSoup

# 指定目录路径
directory = './icons/'
# 输出后的目录
out_directory = './out/'
# 用来存储 SVG 文件内容
svg_files = []
# 修改后的 svg 文件内容
modified_svg_files = []
# 是否格式化
is_format = False
# 修改配置
modified_config = {
    'add': [{
        'target': ['path', 'rect', 'circle', 'g', 'ellipse'],
        'option': {
            'fill': 'none'
        }
    }],
    'delete': [{
        'target': True,
        'option': ['class']
    }, {
        'target': ['svg'],
        'option': ['fill']
    }],
    'update': [{
        'target': ['path', 'rect', 'circle', 'g', 'ellipse'],
        'option': {
            'stroke': 'currentColor',
            'data-follow-stroke': 'currentColor',
            'data-follow-fill': 'currentColor',
            'stroke-width': 4,
            'stroke-linejoin': 'round',
            'stroke-linecap': 'round',
        }
    }]
}

# 遍历目录中的所有文件
for filename in os.listdir(directory):
    # 检查文件是否为 SVG 文件
    if filename.endswith('.svg'):
        # 构建文件的完整路径
        filepath = os.path.join(directory, filename)
        # 打开并读取文件内容
        with open(filepath, 'r', encoding='utf-8') as file:
            content = file.read()
            svg_files.append({
                'name': filename,
                'content': content
            })

# 遍历 svg
for svg in svg_files:
    soup = BeautifulSoup(svg['content'], 'xml')
    # add
    for operate in modified_config['add']:
        # 寻找 target
        for tag in soup.find_all(operate['target']):
            for attr, value in operate['option'].items():
                # 检查标签是否有该属性
                if attr not in tag.attrs:
                    # 新增属性
                    tag[attr] = value

    # delete
    for operate in modified_config['delete']:
        # 寻找 target
        for tag in soup.find_all(operate['target']):
            for attr in operate['option']:
                # 删除属性值
                del tag[attr]

    # update
    for operate in modified_config['update']:
        # 寻找 target
        for tag in soup.find_all(operate['target']):
            for attr, value in operate['option'].items():
                # 检查标签是否有该属性
                if attr in tag.attrs:
                    # 修改属性值
                    tag[attr] = value

    content = soup.prettify() if is_format else str(soup)
    modified_svg_files.append({
        'name': svg['name'],
        # 去掉<?xml ...?>的部分
        'content': content.replace('<?xml version="1.0" encoding="utf-8"?>', '', 1).lstrip()
    })

# 确保目录存在
if not os.path.exists(out_directory):
    os.makedirs(out_directory)
# 遍历输出 svg
for svg in modified_svg_files:
    with open(out_directory + svg['name'], 'w', encoding='utf-8') as file:
        file.write(svg['content'])
        print(f'{svg["name"]}: {svg["content"]}')
