
// credit - http://stackoverflow.com/a/5354536
export const checkVisible = (elm) => {
  const rect = elm.getBoundingClientRect();
  const viewHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight
  );
  return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

// credit - http://stackoverflow.com/a/24829409
const getPosition = (element) => {
  let xPosition = 0;
  let yPosition = 0;
  let localElement = element;

  while (localElement) {
    xPosition += element.offsetLeft - element.scrollLeft + element.clientLeft;
    yPosition += element.offsetTop - element.scrollTop + element.clientTop;
    localElement = element.offsetParent;
  }

  return {
    x: xPosition,
    y: yPosition,
  };
}

export const scrollIntoView = (elem, position) => {
  const offsetTop = window.pageYOffset || document.documentElement.scrollTop;
  const docTop = document.documentElement.clientTop || 0;
  let currentWindowYOffset = offsetTop - docTop;
  let elementWindowYOffset;
  if (position && position === "bottom") {
    const elemY = getPosition(elem).y + currentWindowYOffset;
    const elemHeight = elem.offsetHeight;
    const elemBottomPixel = elemY + elemHeight;
    const extraSpacePixels = 30;
    const windowHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    const calculatedOffset = elemBottomPixel - windowHeight + extraSpacePixels;
    elementWindowYOffset = calculatedOffset >= 0 ? calculatedOffset : 0;
  } else {
    elementWindowYOffset = getPosition(elem).y;
  }

  if (currentWindowYOffset === elementWindowYOffset) {
    return;
  }
  const interval = window.setInterval(() => {
    if (currentWindowYOffset !== elementWindowYOffset) {
      let offset = 1;
      const distance = Math.abs(currentWindowYOffset - elementWindowYOffset);
      if (distance < 10) {
        offset = distance;
      } else {
        offset += Math.floor(Math.sqrt(distance));
      }

      if (currentWindowYOffset > elementWindowYOffset) {
        currentWindowYOffset -= offset;
      } else {
        currentWindowYOffset += offset;
      }
      window.scrollTo(0, currentWindowYOffset);
    } else {
      window.clearInterval(interval);
    }
  }, 25);
}
