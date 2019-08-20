/* 19.1 Keyboard Bindings
    author: SheronW
    date: 8/20/2019 */


class PixelEditor {
  constructor(state, config) {
    let {tools, controls, dispatch} = config;
    this.state = state;

    this.canvas = new PictureCanvas(state.picture, pos => {
      let tool = tools[this.state.tool];
      let onMove = tool(pos, this.state, dispatch);
      if (onMove) {
        return pos => onMove(pos, this.state, dispatch);
      }
    });

    this.controls = controls.map(
      Control => new Control(state, config));

    this.dom = elt("div", {tabIndex: "0"}, this.canvas.dom, elt("br"),
                   ...this.controls.reduce(
                     (a, c) => a.concat(" ", c.dom), []));

    this.dom.addEventListener("keydown", (event, config)  => {
      if(event.key == "z"){
        if(event.ctrlKey || event.metaKey){
          // activates undo
          event.preventDefault();
          config.dispatch({undo: true});
        }
      }
      else if (!event.ctrlKey && !event.metaKey && !event.altKey){
        for(let tool of Obejct.keys(config.tools)){
          if (tool[0] == event.key){
            event.preventDefault();
            config.dispatch({tool});
            return;
          }
        }
      }
    });
  }

  syncState(state) {
    this.state = state;
    this.canvas.syncState(state.picture);
    for (let ctrl of this.controls) ctrl.syncState(state);
  }
}

document.querySelector("div")
  .appendChild(startPixelEditor({}));
