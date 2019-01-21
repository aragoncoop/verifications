const puppeteer = require('puppeteer');

function Crawler() {
  this.ARAGON_FORUM_URL = 'https://forum.aragon.org'
  this.ARAGON_COOPERATIVE_MEMBERSHIP_THREAD = `${this.ARAGON_FORUM_URL}/t/aragon-cooperative-membership-thread/463`
  
  this.getVerificationsFromWebsite = async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.setViewport({ width: 1920, height: 926 });
    await page.goto(this.ARAGON_COOPERATIVE_MEMBERSHIP_THREAD);
    
    return page
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
}

module.exports = new Crawler();