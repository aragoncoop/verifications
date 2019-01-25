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
            const body = (code => code && code.textContent)(post.querySelector('.topic-body code'))
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
    while (newPosts >= 17); 
    console.log(`Obtained a total of ${allVerifications.length} verifications.`)
    return allVerifications;
  }
}

module.exports = new Crawler();