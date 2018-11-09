
exports.drag = () => {

  let panel = $('nav.floating-panel');
  let element = $('nav.floating-panel')[0];
  let elementHandle = $('div.floating-panel-handle')[0];
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  panel.css({ bottom: '75px', right: '75px' });

  elementHandle.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
    element.style.bottom = "";
    element.style.right = "";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
