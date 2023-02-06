import states from './states';

function handleContentLinks(opts) {
  const { mentions = [], instance } = opts || {};
  return (e) => {
    let { target } = e;
    if (target.parentNode.tagName.toLowerCase() === 'a') {
      target = target.parentNode;
    }
    if (
      target.tagName.toLowerCase() === 'a' &&
      target.classList.contains('u-url')
    ) {
      const targetText = (
        target.querySelector('span') || target
      ).innerText.trim();
      const username = targetText.replace(/^@/, '');
      const url = target.getAttribute('href');
      const mention = mentions.find(
        (mention) =>
          mention.username === username ||
          mention.acct === username ||
          mention.url === url,
      );
      if (mention) {
        e.preventDefault();
        e.stopPropagation();
        states.showAccount = {
          account: mention.acct,
          instance,
        };
      } else if (!/^http/i.test(targetText)) {
        console.log('mention not found', targetText);
        e.preventDefault();
        e.stopPropagation();
        const href = target.getAttribute('href');
        states.showAccount = {
          account: href,
          instance,
        };
      }
    } else if (
      target.tagName.toLowerCase() === 'a' &&
      target.classList.contains('hashtag')
    ) {
      e.preventDefault();
      e.stopPropagation();
      const tag = target.innerText.replace(/^#/, '').trim();
      const hashURL = instance ? `#/t/${instance}/${tag}` : `#/t/${tag}`;
      console.log({ hashURL });
      location.hash = hashURL;
    }
  };
}

export default handleContentLinks;