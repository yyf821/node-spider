const fs = require('fs')

const request = require('syncrequest')
const cheerio = require('cheerio')

class Book {
    constructor() {
        this.name = ''
        this.author = ''
        this.type = ''
        this.status = ''
        this.updateTime = ''
        this.ranking = 0
        this.coverUrl = ''
    }
}

const bookFromDiv = (div) => {
    let e = cheerio.load(div)
    let book = new Book()
    book.name = e('h4').find('a').text()
    let a = e('.author').find('a')
    book.status = e('.author').find('span').text()
    book.author = a.eq(0).text()
    book.type = a.eq(1).text()
    book.updateTime = e('.update').find('span').text()
    let pic = e('.book-img-box')
    book.ranking = Number(pic.find('span').text())
    book.coverUrl = "https:" + pic.find('img').attr('src')
    return book
}

const ensurePath = (dir) => {
    let exists = fs.existsSync(dir)
    if (!exists) {
        // 创建目录
        fs.mkdirSync(dir)
    }
}

const cachedUrl = (url) => {
    let dir = 'cached'
    ensurePath(dir)
    // 1. 确定缓存的文件名称
    let cacheFile = dir + '/' + url.split('?')[1] + '.html'
    // 2. 检查缓存文件是否存在
    // 如果存在就读取缓存文件
    // 如果不存在就下载并且写入缓存文件
    let exists = fs.existsSync(cacheFile)
    if (exists) {
        let s = fs.readFileSync(cacheFile)
        return s
    } else {
        let r = request.get.sync(url)
        let body = r.body
        fs.writeFileSync(cacheFile, body)
        return body
    }
}

const booksFromUrl = (url) => {
    let body = cachedUrl(url)
    let e = cheerio.load(body)
    let bookDivs = e('.book-img-text').find('li')
    let books = []
    for (let i = 0; i < bookDivs.length; i++) {
        let div = bookDivs[i]
        let m = bookFromDiv(div)
        books.push(m)
    }
    return books
}

//保存到json文件
const saveBook = (books) => {
    let s = JSON.stringify(books, null, 2)
    let path = 'qidian.json'
    fs.writeFileSync(path, s)
}

//下载图片封面
const downloadCovers = (books) => {
    let dir = 'covers'
    ensurePath(dir)
    const request = require('request')
    for (let i = 0; i < books.length; i++) {
        let m = books[i]
        let url = m.coverUrl
        let path = dir + '/' + m.ranking + '_' + m.name.split('/')[0] + '.jpg'
        request(url).pipe(fs.createWriteStream(path))
    }
}

const __main = () => {
    let books = []
    for (let i = 0; i < 5; i++) {
        let url = `https://www.qidian.com/rank/collect?page=${i + 1}`
        let booksInPage = booksFromUrl(url)
        books = [...books, ...booksInPage]
    }
    saveBook(books)
    downloadCovers(books)
    console.log('抓取成功');
}

__main()

