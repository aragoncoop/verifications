const puppeteer = require('puppeteer');
const constants = require('./constants');

function Crawler() {
  this.obtainVerificationsFromPosts = async (page) => {
    const url = constants.ARAGON_COOPERATIVE_MEMBERSHIP_THREAD + (page ? `/${page}` : '');
    await this.page.goto(url);
    console.log(`Evaluating page ${url}.`)
    return this.page
      .evaluate(
        () => {
          const posts = document.querySelectorAll('.topic-post')
          return Array.prototype.map.call(posts, (post => {
            const avatar = (img => img && img.getAttribute('src'))(post.querySelector('.topic-avatar img'))
            const body = (code => code && code.textContent)(post.querySelector('.topic-body code')) || (quote => quote && quote.innerText)(post.querySelector('.topic-body blockquote'))
            return { avatar, body }
          })).filter( verification => !!verification.body )
        }, 
      )
  }
  
  this.getVerificationsFromWebsite = async () => {
    this.browser = await puppeteer.launch({ headless: true });
    this.page = await this.browser.newPage();
    
    await this.page.setViewport({ width: 1920, height: 926 });
    
    let currentPosts = 0, currentVerifications, newPosts, allVerifications = [];
    do {
      console.log('Obtaining verifications...');
      currentVerifications = await this.obtainVerificationsFromPosts(currentPosts);
      newPosts = currentVerifications.length;
      console.log(`Obtained ${newPosts} verifications.`)
      currentPosts += newPosts;
      allVerifications = allVerifications.concat(currentVerifications)
    }
    while (newPosts >= 10); 

    currentVerifications = await this.obtainVerificationsFromPosts(currentPosts);
    allVerifications = allVerifications.concat(currentVerifications);

    console.log('Cleaning repeated verifications')
    const finalVerifications = allVerifications.filter((verification, index, self) => 
      index === self.findIndex((v) => v.body === verification.body)
    )
    console.log(`Obtained a total of ${finalVerifications.length} verifications.`)
    return finalVerifications;
  }
}

module.exports = new Crawler();